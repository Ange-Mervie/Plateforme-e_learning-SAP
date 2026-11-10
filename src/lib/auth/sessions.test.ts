import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RowDataPacket } from "mysql2/promise";
import { execute, query } from "@/lib/db";
import { createSession, getUserForSession, revokeSession } from "./sessions";

vi.mock("@/lib/db", () => ({
  execute: vi.fn(),
  query: vi.fn(),
}));

describe("session storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("persists only a SHA-256 digest and returns a random token", async () => {
    vi.mocked(execute).mockResolvedValue({} as never);
    const now = Date.now();

    const token = await createSession(42);

    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(execute).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO sessions"),
      [42, expect.stringMatching(/^[a-f0-9]{64}$/), expect.any(Date)],
    );
    const storedDigest = vi.mocked(execute).mock.calls[0]?.[1]?.[1];
    const expiresAt = vi.mocked(execute).mock.calls[0]?.[1]?.[2];
    expect(token).not.toBe(storedDigest);
    expect(expiresAt).toBeInstanceOf(Date);
    expect((expiresAt as Date).getTime() - now).toBeGreaterThanOrEqual(7 * 24 * 60 * 60 * 1000 - 100);
    expect((expiresAt as Date).getTime() - now).toBeLessThan(7 * 24 * 60 * 60 * 1000 + 100);
  });

  it("does not query the database when no token is supplied", async () => {
    await expect(getUserForSession(undefined)).resolves.toBeNull();
    expect(query).not.toHaveBeenCalled();
  });

  it("resolves only non-expired sessions by token digest", async () => {
    const user = {
      id: 42,
      name: "Alex Learner",
      email: "alex@example.com",
      role: "apprenant",
      subscription_status: "free",
    } as RowDataPacket;
    vi.mocked(query).mockResolvedValue([user]);

    await expect(getUserForSession("session-token")).resolves.toEqual({
      id: 42,
      name: "Alex Learner",
      email: "alex@example.com",
      role: "apprenant",
      subscription: { status: "free", planId: null },
    });

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining("expires_at > CURRENT_TIMESTAMP"),
      [expect.stringMatching(/^[a-f0-9]{64}$/)],
    );
  });

  it("maps the legacy learner role to apprenant", async () => {
    vi.mocked(query).mockResolvedValue([{
      id: 42,
      name: "Alex Learner",
      email: "alex@example.com",
      role: "learner",
    } as RowDataPacket]);

    await expect(getUserForSession("session-token")).resolves.toMatchObject({ role: "apprenant" });
  });

  it("revokes a session by its digest and ignores a missing token", async () => {
    vi.mocked(execute).mockResolvedValue({} as never);

    await revokeSession(undefined);
    expect(execute).not.toHaveBeenCalled();

    await revokeSession("session-token");
    expect(execute).toHaveBeenCalledWith(
      "DELETE FROM sessions WHERE token_hash = ?",
      [expect.stringMatching(/^[a-f0-9]{64}$/)],
    );
  });
});
