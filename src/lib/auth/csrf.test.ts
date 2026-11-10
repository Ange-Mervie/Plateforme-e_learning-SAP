import { afterEach, describe, expect, it, vi } from "vitest";
import { assertSameOrigin } from "./csrf";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("same-origin validation", () => {
  it("accepts a request from the configured application origin", () => {
    vi.stubEnv("APP_ORIGIN", "https://academy.example.com");
    vi.stubEnv("NODE_ENV", "production");

    expect(() => assertSameOrigin(new Request("https://academy.example.com/api/progress", {
      method: "POST",
      headers: { origin: "https://academy.example.com" },
    }))).not.toThrow();
  });

  it("rejects a request from a different origin", () => {
    vi.stubEnv("APP_ORIGIN", "https://academy.example.com");
    vi.stubEnv("NODE_ENV", "production");

    expect(() => assertSameOrigin(new Request("https://academy.example.com/api/progress", {
      method: "POST",
      headers: { origin: "https://evil.example" },
    }))).toThrow();
  });

  it("requires APP_ORIGIN in production when Origin is missing", () => {
    vi.stubEnv("APP_ORIGIN", "");
    vi.stubEnv("NODE_ENV", "production");

    expect(() => assertSameOrigin(new Request("https://academy.example.com/api/progress", {
      method: "POST",
    }))).toThrow(/APP_ORIGIN/);
  });

  it("allows same-origin localhost requests in development", () => {
    vi.stubEnv("APP_ORIGIN", "");
    vi.stubEnv("NODE_ENV", "development");

    expect(() => assertSameOrigin(new Request("http://localhost:3000/api/progress", {
      method: "POST",
      headers: { origin: "http://localhost:3000" },
    }))).not.toThrow();
  });
});
