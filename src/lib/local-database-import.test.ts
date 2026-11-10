import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ImportDatabase } from "./local-database-import";
import { importLocalDatabase, type OwnerEmailPrompt } from "./local-database-import";

class FakeDatabase implements ImportDatabase {
  ledger: string | null = null;
  users = new Map<string, { id: number; password: string; role: string; name: string }>();
  statements: Array<{ sql: string; params: readonly unknown[] }> = [];
  transactionStarted = false;
  committed = false;
  rolledBack = false;
  failOnUserInsert = false;
  nextId = 10;

  async beginTransaction() {
    this.transactionStarted = true;
  }

  async commit() {
    this.committed = true;
  }

  async rollback() {
    this.rolledBack = true;
  }

  async end() {}

  async query(sql: string, params: readonly unknown[] = []): Promise<unknown[]> {
    this.statements.push({ sql, params });
    if (sql.includes("local_store_imports")) {
      return this.ledger ? [{ source_checksum: this.ledger }] : [];
    }
    if (sql.includes("FROM users WHERE email")) {
      const email = String(params[0]);
      const user = this.users.get(email);
      return user ? [user] : [];
    }
    return [];
  }

  async execute(sql: string, params: readonly unknown[] = []): Promise<{ insertId: number }> {
    this.statements.push({ sql, params });
    if (sql.includes("INSERT INTO users")) {
      if (this.failOnUserInsert) throw new Error("database write failed");
      const [name, email, password, role] = params.map(String);
      const user = { id: this.nextId++, name, email, password, role };
      this.users.set(email, user);
      return { insertId: user.id };
    }
    if (sql.includes("UPDATE users SET password")) {
      const [password, email] = params.map(String);
      const user = this.users.get(email);
      if (user) user.password = password;
    }
    if (sql.includes("local_store_imports")) {
      this.ledger = String(params[0]);
    }
    return { insertId: 0 };
  }
}

function makeSource(password: string): string {
  return JSON.stringify({
    users: [{
      id: 1,
      name: "Legacy Learner",
      email: "legacy@example.com",
      password,
      role: "apprenant",
      subscription_status: "active",
      created_at: "2026-11-01T00:00:00.000Z",
    }],
    subscriptions: [{
      id: 1,
      user_id: 1,
      status: "active",
      plan_id: "pack-finance",
      created_at: "2026-11-01T00:00:00.000Z",
    }],
    progress: [{
      id: 1,
      user_id: 1,
      course_slug: "fi-test",
      lesson_title: "lesson-1",
      completed: 1,
      updated_at: "2026-11-02T00:00:00.000Z",
    }],
    assessments: [{
      id: 1,
      user_id: 1,
      course_slug: "fi-test",
      score: 85,
      passed: 1,
      created_at: "2026-11-03T00:00:00.000Z",
    }],
    projects: [{
      id: 1,
      user_id: 1,
      course_slug: "fi-test",
      status: "submitted",
      created_at: "2026-11-04T00:00:00.000Z",
    }],
    certificates: [{
      id: 1,
      user_id: 1,
      course_slug: "fi-test",
      issued_at: "2026-11-05T00:00:00.000Z",
    }],
  });
}

describe("legacy JSON data import", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("imports a snapshot transactionally and records its checksum", async () => {
    const database = new FakeDatabase();
    const source = makeSource(bcrypt.hashSync("strong-existing-password", 4));
    const result = await importLocalDatabase(source, database, vi.fn());

    expect(result).toMatchObject({
      status: "imported",
      users: 1,
      subscriptions: 1,
      progress: 1,
      assessments: 1,
      projects: 1,
      certificates: 1,
    });
    expect(database.transactionStarted).toBe(true);
    expect(database.committed).toBe(true);
    expect(database.rolledBack).toBe(false);
    expect(database.ledger).toMatch(/^[a-f0-9]{64}$/);
    expect(database.users.get("legacy@example.com")?.role).toBe("apprenant");
    for (const table of ["subscriptions", "progress", "assessments", "projects", "certificates"]) {
      expect(database.statements.some(({ sql }) => sql.includes(`INSERT`) && sql.includes(table))).toBe(true);
    }
    expect(database.statements.find(({ sql }) => sql.includes("INSERT IGNORE INTO progress"))?.params[0]).toBe(10);
  });

  it("maps orphaned records to an explicitly selected existing account", async () => {
    const database = new FakeDatabase();
    const legacy = JSON.parse(makeSource(bcrypt.hashSync("strong-password", 4)));
    legacy.subscriptions[0].user_id = 99;
    legacy.assessments[0].user_id = 99;
    const promptOwner: OwnerEmailPrompt = vi.fn().mockResolvedValue("legacy@example.com");

    await importLocalDatabase(JSON.stringify(legacy), database, vi.fn(), promptOwner);

    expect(promptOwner).toHaveBeenCalledWith(99);
    expect(database.statements.find(({ sql }) => sql.includes("INSERT INTO subscriptions"))?.params[0]).toBe(10);
    expect(database.statements.find(({ sql }) => sql.includes("INSERT INTO assessments"))?.params[0]).toBe(10);
    expect(database.committed).toBe(true);
  });

  it("refuses to map an orphaned record to an email with no database account", async () => {
    const database = new FakeDatabase();
    const legacy = JSON.parse(makeSource(bcrypt.hashSync("strong-password", 4)));
    legacy.subscriptions[0].user_id = 99;

    await expect(importLocalDatabase(
      JSON.stringify(legacy),
      database,
      vi.fn(),
      vi.fn().mockResolvedValue("missing@example.com"),
    )).rejects.toThrow(/does not match an existing account/i);

    expect(database.rolledBack).toBe(true);
    expect(database.committed).toBe(false);
  });

  it("does not duplicate rows when the same snapshot is imported twice", async () => {
    const database = new FakeDatabase();
    const source = makeSource(bcrypt.hashSync("strong-existing-password", 4));
    await importLocalDatabase(source, database, vi.fn());
    const second = await importLocalDatabase(source, database, vi.fn());

    expect(second.status).toBe("already_imported");
    expect(database.statements.filter(({ sql }) => sql.includes("INSERT INTO users"))).toHaveLength(1);
  });

  it("rejects a changed snapshot after an import was recorded", async () => {
    const database = new FakeDatabase();
    await importLocalDatabase(makeSource(bcrypt.hashSync("strong-password-one", 4)), database, vi.fn());

    await expect(importLocalDatabase(
      makeSource(bcrypt.hashSync("strong-password-two", 4)),
      database,
      vi.fn(),
    )).rejects.toThrow(/different local snapshot/i);
    expect(database.rolledBack).toBe(true);
  });

  it("re-hashes built-in demo credentials without printing the supplied password", async () => {
    const database = new FakeDatabase();
    const requestPassword = vi.fn().mockResolvedValue("A-secure-local-password-2026");
    const source = makeSource(bcrypt.hashSync("demo123", 4));
    const result = await importLocalDatabase(source, database, requestPassword);
    const insertedHash = database.users.get("legacy@example.com")?.password;

    expect(requestPassword).toHaveBeenCalledWith("legacy@example.com");
    expect(insertedHash).not.toContain("A-secure-local-password-2026");
    expect(await bcrypt.compare("A-secure-local-password-2026", insertedHash ?? "")).toBe(true);
    expect(JSON.stringify(result)).not.toContain("A-secure-local-password-2026");
  });

  it("preserves an existing account's identity and strong password", async () => {
    const database = new FakeDatabase();
    const existingHash = bcrypt.hashSync("existing-account-password", 4);
    database.users.set("legacy@example.com", {
      id: 77,
      name: "Existing Account",
      password: existingHash,
      role: "admin",
    });

    await importLocalDatabase(makeSource(bcrypt.hashSync("demo123", 4)), database, vi.fn());

    expect(database.users.get("legacy@example.com")).toEqual({
      id: 77,
      name: "Existing Account",
      password: existingHash,
      role: "admin",
    });
    expect(database.statements.some(({ sql }) => sql.includes("INSERT INTO users"))).toBe(false);
  });

  it("rolls back every imported record when a database write fails", async () => {
    const database = new FakeDatabase();
    database.failOnUserInsert = true;

    await expect(importLocalDatabase(
      makeSource(bcrypt.hashSync("strong-existing-password", 4)),
      database,
      vi.fn(),
    )).rejects.toThrow("database write failed");

    expect(database.rolledBack).toBe(true);
    expect(database.committed).toBe(false);
  });
});
