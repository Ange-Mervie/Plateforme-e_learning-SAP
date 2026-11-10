import { describe, expect, it } from "vitest";
import { getDatabaseConfig } from "@/lib/db";

describe("getDatabaseConfig", () => {
  it("rejects a missing DATABASE_URL", () => {
    expect(() => getDatabaseConfig({})).toThrow(/DATABASE_URL/);
  });

  it("rejects a non-MySQL URL", () => {
    expect(() => getDatabaseConfig({ DATABASE_URL: "https://example.com/db" })).toThrow(/DATABASE_URL/);
  });

  it("returns a valid MySQL URL unchanged", () => {
    const url = "mysql://user:password@localhost:3306/sap_academy";
    expect(getDatabaseConfig({ DATABASE_URL: url })).toBe(url);
  });
});
