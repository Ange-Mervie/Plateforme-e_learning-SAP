import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { execute, query } from "@/lib/db";
import { createSession, getUserForSession, revokeSession } from "@/lib/auth/sessions";
import { POST as register } from "./register/route";
import { POST as login } from "./login/route";
import { GET as getSession } from "./session/route";
import { POST as logout } from "./logout/route";

vi.mock("@/lib/db", () => ({
  execute: vi.fn(),
  query: vi.fn(),
}));

vi.mock("@/lib/auth/sessions", () => ({
  createSession: vi.fn(),
  getUserForSession: vi.fn(),
  revokeSession: vi.fn(),
}));

const passwordHash = bcrypt.hashSync("correct-password", 4);

function request(path: string, body?: unknown, cookie?: string): Request {
  const headers = new Headers();
  if (body !== undefined) headers.set("content-type", "application/json");
  if (cookie) headers.set("cookie", `sap_academy_session=${cookie}`);
  return new Request(`http://localhost:3000${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe("authentication routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("APP_ORIGIN", "");
    vi.mocked(createSession).mockResolvedValue("random-session-token");
    vi.mocked(getUserForSession).mockResolvedValue({
      id: 11,
      name: "Alex Learner",
      email: "alex@example.com",
      role: "apprenant",
    });
  });

  it("returns 400 for missing registration fields", async () => {
    const response = await register(request("/api/auth/register", { name: "", email: "", password: "" }));
    expect(response.status).toBe(400);
  });

  it("returns 400 for malformed registration JSON", async () => {
    const response = await register(new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    }));
    expect(response.status).toBe(400);
  });

  it("creates an apprenant, establishes an HttpOnly session, and never returns credentials", async () => {
    vi.mocked(query).mockResolvedValue([]);
    vi.mocked(execute).mockResolvedValue({ insertId: 11 } as never);

    const response = await register(request("/api/auth/register", {
      name: "  Alex Learner ",
      email: " Alex@Example.com ",
      password: "new-password",
      role: "admin",
    }));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(vi.mocked(execute).mock.calls[0]?.[0]).toMatch(/'apprenant'/);
    expect(vi.mocked(execute).mock.calls[0]?.[1]).toEqual([
      "Alex Learner",
      "alex@example.com",
      expect.any(String),
    ]);
    expect(await bcrypt.compare("new-password", String(vi.mocked(execute).mock.calls[0]?.[1]?.[2]))).toBe(true);
    expect(createSession).toHaveBeenCalledWith(11);
    expect(response.headers.get("set-cookie")).toMatch(/HttpOnly/i);
    expect(payload.user).toMatchObject({ id: 11, role: "apprenant" });
    expect(JSON.stringify(payload)).not.toMatch(/password|token/i);
  });

  it("returns 409 when an account already uses the email", async () => {
    vi.mocked(query).mockResolvedValue([{ id: 9, email: "alex@example.com" }] as never);
    const response = await register(request("/api/auth/register", {
      name: "Alex",
      email: "alex@example.com",
      password: "new-password",
    }));
    expect(response.status).toBe(409);
  });

  it("uses the same generic 401 for an unknown account and a wrong password", async () => {
    vi.mocked(query).mockResolvedValueOnce([]).mockResolvedValueOnce([{
      id: 11,
      name: "Alex Learner",
      email: "alex@example.com",
      password: passwordHash,
      role: "apprenant",
      subscription_status: "free",
    }] as never);

    const unknownUser = await login(request("/api/auth/login", { email: "missing@example.com", password: "wrong" }));
    const wrongPassword = await login(request("/api/auth/login", { email: "alex@example.com", password: "wrong" }));

    expect(unknownUser.status).toBe(401);
    expect(wrongPassword.status).toBe(401);
    const unknownPayload = await unknownUser.json();
    const wrongPasswordPayload = await wrongPassword.json();
    expect(unknownPayload).toEqual(wrongPasswordPayload);
    expect(wrongPasswordPayload).toEqual({ error: "invalid" });
  });

  it("sets a secure cookie and returns no bearer token on successful login", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("APP_ORIGIN", "https://academy.example.com");
    vi.mocked(query).mockResolvedValue([{
      id: 11,
      name: "Alex Learner",
      email: "alex@example.com",
      password: passwordHash,
      role: "apprenant",
      subscription_status: "free",
    }] as never);

    const response = await login(new Request("https://academy.example.com/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://academy.example.com",
      },
      body: JSON.stringify({ email: "alex@example.com", password: "correct-password" }),
    }));
    const payload = await response.json();
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    expect(setCookie).toMatch(/HttpOnly/i);
    expect(setCookie).toMatch(/SameSite=Strict/i);
    expect(setCookie).toMatch(/Path=\//i);
    expect(setCookie).toMatch(/Max-Age=604800/i);
    expect(setCookie).toMatch(/Secure/i);
    expect(payload.user).toMatchObject({ id: 11, role: "apprenant" });
    expect(JSON.stringify(payload)).not.toMatch(/password|token/i);
  });

  it("returns the current server session without exposing its token", async () => {
    const response = await getSession(request("/api/auth/session", undefined, "random-session-token"));
    expect(await response.json()).toMatchObject({
      user: { id: 11, name: "Alex Learner", email: "alex@example.com", role: "apprenant" },
    });
    expect(getUserForSession).toHaveBeenCalledWith("random-session-token");
  });

  it("revokes the current server session before clearing the cookie", async () => {
    const response = await logout(request("/api/auth/logout", {}, "random-session-token"));
    expect(response.status).toBe(200);
    expect(revokeSession).toHaveBeenCalledWith("random-session-token");
    expect(response.headers.get("set-cookie")).toMatch(/Max-Age=0/i);
  });
});
