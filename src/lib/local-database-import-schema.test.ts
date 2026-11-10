import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("local database import migration", () => {
  it("adds the legacy subscription plan and an import checksum ledger", () => {
    const sql = readFileSync(join(process.cwd(), "sql", "004_local_store_import.sql"), "utf8");

    expect(sql).toMatch(/ALTER TABLE\s+subscriptions[\s\S]*ADD COLUMN\s+plan_id/i);
    expect(sql).toMatch(/CREATE TABLE\s+local_store_imports/i);
    expect(sql).toMatch(/source_checksum\s+CHAR\(64\)\s+PRIMARY KEY/i);
  });
});
