import { beforeEach, describe, expect, it, vi } from "vitest";
import { authErrorResponse } from "./http";

const nextNavigation = vi.hoisted(() => ({
  unstable_rethrow: vi.fn(),
  sentinel: new Error("framework prerender bailout"),
}));

vi.mock("next/navigation", () => ({
  unstable_rethrow: (error: unknown) => {
    nextNavigation.unstable_rethrow(error);
    if (error === nextNavigation.sentinel) throw error;
  },
}));

describe("auth error responses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rethrows framework-controlled request-time interrupts", () => {
    expect(() => authErrorResponse(nextNavigation.sentinel)).toThrow(nextNavigation.sentinel);
    expect(nextNavigation.unstable_rethrow).toHaveBeenCalledWith(nextNavigation.sentinel);
  });
});
