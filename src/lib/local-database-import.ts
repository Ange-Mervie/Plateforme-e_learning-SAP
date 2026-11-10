import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import type { SqlParameter } from "./db";

export interface ImportDatabase {
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  end(): Promise<void>;
  query(sql: string, params?: readonly unknown[]): Promise<unknown[]>;
  execute(sql: string, params?: readonly unknown[]): Promise<{ insertId: number }>;
}

interface LegacyUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  subscription_status: string;
  created_at: string;
}

interface LegacySubscription {
  id: number;
  user_id: number;
  status: string;
  plan_id?: string;
  created_at: string;
}

interface LegacyProgress {
  id: number;
  user_id: number;
  course_slug: string;
  lesson_title: string;
  completed: number;
  updated_at: string;
}

interface LegacyAssessment {
  id: number;
  user_id: number;
  course_slug: string;
  score: number;
  passed: number;
  created_at: string;
}

interface LegacyProject {
  id: number;
  user_id: number;
  course_slug: string;
  status: string;
  grade?: number;
  comments?: string;
  created_at: string;
}

interface LegacyCertificate {
  id: number;
  user_id: number;
  course_slug: string;
  issued_at: string;
}

interface LegacyDatabase {
  users: LegacyUser[];
  subscriptions: LegacySubscription[];
  progress: LegacyProgress[];
  assessments: LegacyAssessment[];
  projects: LegacyProject[];
  certificates: LegacyCertificate[];
}

interface ExistingUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LocalImportResult {
  status: "imported" | "already_imported";
  users: number;
  subscriptions: number;
  progress: number;
  assessments: number;
  projects: number;
  certificates: number;
}

type PasswordPrompt = (email: string) => Promise<string>;
export type OwnerEmailPrompt = (legacyUserId: number) => Promise<string>;

const DEMO_PASSWORDS = ["demo123", "admin123"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function parseDatabase(source: string): LegacyDatabase {
  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch {
    throw new Error("Local database JSON is invalid.");
  }
  if (!isRecord(value)) throw new Error("Local database JSON must be an object.");

  const collections = ["users", "subscriptions", "progress", "assessments", "projects", "certificates"] as const;
  for (const collection of collections) {
    if (!Array.isArray(value[collection])) {
      throw new Error(`Local database collection "${collection}" must be an array.`);
    }
  }

  const database = value as unknown as LegacyDatabase;
  const userIds = new Set<number>();
  const emails = new Set<string>();
  for (const user of database.users) {
    if (
      !isRecord(user) ||
      !Number.isSafeInteger(user.id) ||
      Number(user.id) < 1 ||
      typeof user.name !== "string" ||
      !user.name.trim() ||
      user.name.length > 120 ||
      typeof user.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim()) ||
      typeof user.password !== "string" ||
      !/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(user.password) ||
      !["apprenant", "formateur", "consultant", "expert", "admin", "learner"].includes(user.role) ||
      typeof user.subscription_status !== "string" ||
      !isDate(user.created_at)
    ) {
      throw new Error("Local database contains an invalid user record.");
    }
    const email = user.email.trim().toLowerCase();
    if (userIds.has(user.id) || emails.has(email)) {
      throw new Error("Local database contains duplicate user identifiers.");
    }
    userIds.add(user.id);
    emails.add(email);
  }

  const validateOwnerId = (userId: unknown) => {
    if (!Number.isSafeInteger(userId) || Number(userId) < 1) {
      throw new Error("Local database contains an invalid owner identifier.");
    }
  };
  for (const record of database.subscriptions) {
    if (!isRecord(record) || typeof record.status !== "string" || !isDate(record.created_at)) {
      throw new Error("Local database contains an invalid subscription record.");
    }
    validateOwnerId(record.user_id);
  }
  for (const record of database.progress) {
    if (
      !isRecord(record) ||
      typeof record.course_slug !== "string" ||
      typeof record.lesson_title !== "string" ||
      ![0, 1].includes(record.completed) ||
      !isDate(record.updated_at)
    ) {
      throw new Error("Local database contains an invalid progress record.");
    }
    validateOwnerId(record.user_id);
  }
  for (const record of database.assessments) {
    if (
      !isRecord(record) ||
      typeof record.course_slug !== "string" ||
      typeof record.score !== "number" ||
      !Number.isFinite(record.score) ||
      record.score < 0 ||
      record.score > 100 ||
      ![0, 1].includes(record.passed) ||
      !isDate(record.created_at)
    ) {
      throw new Error("Local database contains an invalid assessment record.");
    }
    validateOwnerId(record.user_id);
  }
  for (const record of database.projects) {
    if (
      !isRecord(record) ||
      typeof record.course_slug !== "string" ||
      typeof record.status !== "string" ||
      !isDate(record.created_at)
    ) {
      throw new Error("Local database contains an invalid project record.");
    }
    validateOwnerId(record.user_id);
  }
  for (const record of database.certificates) {
    if (
      !isRecord(record) ||
      typeof record.course_slug !== "string" ||
      !isDate(record.issued_at)
    ) {
      throw new Error("Local database contains an invalid certificate record.");
    }
    validateOwnerId(record.user_id);
  }

  return database;
}

async function isBuiltInPassword(passwordHash: string): Promise<boolean> {
  for (const password of DEMO_PASSWORDS) {
    if (await bcrypt.compare(password, passwordHash)) return true;
  }
  return false;
}

async function replacementPassword(email: string, prompt: PasswordPrompt): Promise<string> {
  if (!prompt) throw new Error("A masked password prompt is required to rotate built-in credentials.");
  const value = await prompt(email);
  if (value.length < 12 || value.length > 128) {
    throw new Error("Replacement passwords must be between 12 and 128 characters.");
  }
  return bcrypt.hash(value, 12);
}

function toDate(value: string): Date {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error("Local database contains an invalid date.");
  return date;
}

function sqlRole(role: string): string {
  return role === "learner" ? "apprenant" : role;
}

export async function importLocalDatabase(
  source: string,
  database: ImportDatabase,
  promptPassword: PasswordPrompt,
  promptOwnerEmail?: OwnerEmailPrompt,
): Promise<LocalImportResult> {
  const local = parseDatabase(source);
  const checksum = createHash("sha256").update(source).digest("hex");
  await database.beginTransaction();

  try {
    const priorImports = await database.query(
      "SELECT source_checksum FROM local_store_imports LIMIT 1",
    ) as Array<{ source_checksum: string }>;
    if (priorImports.length > 0) {
      if (priorImports[0].source_checksum !== checksum) {
        throw new Error("A different local snapshot was already imported; manual reconciliation is required.");
      }
      await database.commit();
      return {
        status: "already_imported",
        users: local.users.length,
        subscriptions: local.subscriptions.length,
        progress: local.progress.length,
        assessments: local.assessments.length,
        projects: local.projects.length,
        certificates: local.certificates.length,
      };
    }

    const userIds = new Map<number, number>();
    const emailUserIds = new Map<string, number>();
    for (const legacyUser of local.users) {
      const email = legacyUser.email.trim().toLowerCase();
      const existingRows = await database.query(
        "SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1",
        [email],
      ) as ExistingUser[];
      const existing = existingRows[0];
      let passwordHash = legacyUser.password;

      if (existing) {
        if (await isBuiltInPassword(existing.password)) {
          passwordHash = await replacementPassword(email, promptPassword);
          await database.execute("UPDATE users SET password = ? WHERE id = ?", [passwordHash, existing.id]);
        }
        userIds.set(legacyUser.id, existing.id);
        emailUserIds.set(email, existing.id);
        continue;
      }

      if (await isBuiltInPassword(legacyUser.password)) {
        passwordHash = await replacementPassword(email, promptPassword);
      }
      const result = await database.execute(
        `INSERT INTO users (name, email, password, role, subscription_status, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          legacyUser.name.trim(),
          email,
          passwordHash,
          sqlRole(legacyUser.role),
          legacyUser.subscription_status,
          toDate(legacyUser.created_at),
        ],
      );
      userIds.set(legacyUser.id, result.insertId);
      emailUserIds.set(email, result.insertId);
    }

    const ownerIds = new Set([
      ...local.subscriptions.map((item) => item.user_id),
      ...local.progress.map((item) => item.user_id),
      ...local.assessments.map((item) => item.user_id),
      ...local.projects.map((item) => item.user_id),
      ...local.certificates.map((item) => item.user_id),
    ]);
    for (const ownerId of ownerIds) {
      if (userIds.has(ownerId)) continue;
      if (!promptOwnerEmail) {
        throw new Error(`Local records for unknown owner ${ownerId} require an explicit account mapping.`);
      }

      const email = (await promptOwnerEmail(ownerId)).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error(`The account mapping for owner ${ownerId} is not a valid email address.`);
      }
      let databaseUserId = emailUserIds.get(email);
      if (databaseUserId === undefined) {
        const matchingUsers = await database.query(
          "SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1",
          [email],
        ) as ExistingUser[];
        databaseUserId = matchingUsers[0]?.id;
      }
      if (databaseUserId === undefined) {
        throw new Error(`The email selected for owner ${ownerId} does not match an existing account.`);
      }
      userIds.set(ownerId, databaseUserId);
    }

    for (const item of local.subscriptions) {
      const userId = userIds.get(item.user_id);
      if (userId === undefined) throw new Error("A subscription owner could not be mapped.");
      const planId = item.plan_id ?? null;
      const createdAt = toDate(item.created_at);
      await database.execute(
        `INSERT INTO subscriptions (user_id, status, plan_id, created_at)
         SELECT ?, ?, ?, ? WHERE NOT EXISTS (
           SELECT 1 FROM subscriptions
           WHERE user_id = ? AND status = ? AND plan_id <=> ? AND created_at = ?
         )`,
        [userId, item.status, planId, createdAt, userId, item.status, planId, createdAt],
      );
    }

    for (const item of local.progress) {
      const userId = userIds.get(item.user_id);
      if (userId === undefined) throw new Error("A progress owner could not be mapped.");
      await database.execute(
        "INSERT IGNORE INTO progress (user_id, course_slug, lesson_title, completed, updated_at) VALUES (?, ?, ?, ?, ?)",
        [userId, item.course_slug, item.lesson_title, item.completed, toDate(item.updated_at)],
      );
    }

    for (const item of local.assessments) {
      const userId = userIds.get(item.user_id);
      if (userId === undefined) throw new Error("An assessment owner could not be mapped.");
      const createdAt = toDate(item.created_at);
      await database.execute(
        `INSERT INTO assessments (user_id, course_slug, score, passed, created_at)
         SELECT ?, ?, ?, ?, ? WHERE NOT EXISTS (
           SELECT 1 FROM assessments
           WHERE user_id = ? AND course_slug = ? AND score = ? AND passed = ? AND created_at = ?
         )`,
        [
          userId, item.course_slug, item.score, item.passed, createdAt,
          userId, item.course_slug, item.score, item.passed, createdAt,
        ],
      );
    }

    for (const item of local.projects) {
      const userId = userIds.get(item.user_id);
      if (userId === undefined) throw new Error("A project owner could not be mapped.");
      const createdAt = toDate(item.created_at);
      await database.execute(
        `INSERT INTO projects (user_id, course_slug, status, grade, comments, created_at)
         SELECT ?, ?, ?, ?, ?, ? WHERE NOT EXISTS (
           SELECT 1 FROM projects
           WHERE user_id = ? AND course_slug = ? AND status = ? AND created_at = ?
         )`,
        [
          userId, item.course_slug, item.status, item.grade ?? null, item.comments ?? null, createdAt,
          userId, item.course_slug, item.status, createdAt,
        ],
      );
    }

    for (const item of local.certificates) {
      const userId = userIds.get(item.user_id);
      if (userId === undefined) throw new Error("A certificate owner could not be mapped.");
      const issuedAt = toDate(item.issued_at);
      await database.execute(
        `INSERT INTO certificates (user_id, course_slug, issued_at)
         SELECT ?, ?, ? WHERE NOT EXISTS (
           SELECT 1 FROM certificates WHERE user_id = ? AND course_slug = ? AND issued_at = ?
         )`,
        [userId, item.course_slug, issuedAt, userId, item.course_slug, issuedAt],
      );
    }

    await database.execute(
      "INSERT INTO local_store_imports (source_checksum) VALUES (?)",
      [checksum],
    );
    await database.commit();
    return {
      status: "imported",
      users: local.users.length,
      subscriptions: local.subscriptions.length,
      progress: local.progress.length,
      assessments: local.assessments.length,
      projects: local.projects.length,
      certificates: local.certificates.length,
    };
  } catch (error) {
    await database.rollback();
    throw error;
  }
}

export function toImportSqlParameters(values: readonly unknown[]): SqlParameter[] {
  return values.map((value) => {
    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "bigint" ||
      typeof value === "boolean" ||
      value instanceof Date ||
      Buffer.isBuffer(value) ||
      value instanceof Uint8Array
    ) {
      return value;
    }
    throw new Error("Unsupported local import database parameter.");
  });
}
