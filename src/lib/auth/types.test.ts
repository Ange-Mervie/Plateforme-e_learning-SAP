import { describe, expect, it } from "vitest";

describe("test harness", () => {
  it("runs TypeScript tests in the Node environment", () => {
    expect("auth").toBe("auth");
  });
});
