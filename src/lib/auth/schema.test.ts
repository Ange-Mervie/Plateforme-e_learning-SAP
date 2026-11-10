import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("auth session migration", () => {
  it("adds a display name and revocable MySQL sessions", () => {
    const sql = readFileSync(join(process.cwd(), "sql", "003_auth_sessions.sql"), "utf8");

    expect(sql).toMatch(/ALTER TABLE\s+users[\s\S]*ADD COLUMN\s+name/i);
    expect(sql).toMatch(/CREATE TABLE\s+sessions/i);
    expect(sql).toMatch(/token_hash[\s\S]*UNIQUE|UNIQUE[\s\S]*token_hash/i);
    expect(sql).toMatch(/expires_at/i);
    expect(sql).toMatch(/FOREIGN KEY\s*\(user_id\)[\s\S]*ON DELETE CASCADE/i);
  });
});
