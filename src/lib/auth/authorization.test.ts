import { beforeEach, describe, expect, it, vi } from "vitest";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { getUserForSession } from "./sessions";
import { requireRole, requireUser } from "./authorization";

const sessionState = vi.hoisted(() => ({ token: "session-token" }));

vi.mock("next/server", () => ({
  connection: vi.fn(async () => ({})),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: () => sessionState.token ? { value: sessionState.token } : undefined,
  })),
}));

vi.mock("./sessions", () => ({
  getUserForSession: vi.fn(),
}));

const learner = {
  id: 42,
  name: "Alex Learner",
  email: "alex@example.com",
  role: "apprenant" as const,
};

describe("server authorization", () => {
  beforeEach(() => {
    sessionState.token = "session-token";
    vi.clearAllMocks();
    vi.mocked(connection).mockResolvedValue({} as never);
  });

  it("resolves the user from the HttpOnly session cookie", async () => {
    vi.mocked(getUserForSession).mockResolvedValue(learner);

    await expect(requireUser()).resolves.toEqual(learner);
    expect(cookies).toHaveBeenCalledOnce();
    expect(getUserForSession).toHaveBeenCalledWith("session-token");
  });

  it("rejects an absent session with 401", async () => {
    sessionState.token = "";
    vi.mocked(getUserForSession).mockResolvedValue(null);

    await expect(requireUser()).rejects.toMatchObject({ status: 401 });
  });

  it("rejects insufficient roles with 403", async () => {
    vi.mocked(getUserForSession).mockResolvedValue(learner);

    await expect(requireRole(["admin"])).rejects.toMatchObject({ status: 403 });
  });
});
