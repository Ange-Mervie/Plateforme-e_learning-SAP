import type { RowDataPacket } from "mysql2/promise";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { execute, query } from "@/lib/db";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { requireUser } from "@/lib/auth/authorization";
import { AuthenticationError } from "@/lib/auth/types";
import { DELETE as deleteProgress, GET as getProgress, POST as postProgress } from "./progress/route";
import { GET as getAssessments, POST as postAssessments } from "./assessments/route";
import { GET as getProjects, POST as postProjects } from "./projects/route";
import { GET as getCertificates, POST as postCertificates } from "./certificates/route";
import { GET as getSubscriptions, POST as postSubscriptions } from "./subscriptions/route";

vi.mock("@/lib/db", () => ({
  execute: vi.fn(),
  query: vi.fn(),
}));

vi.mock("@/lib/auth/authorization", () => ({
  requireUser: vi.fn(),
}));

vi.mock("@/lib/auth/csrf", () => ({
  assertSameOrigin: vi.fn(),
}));

const user = {
  id: 11,
  name: "Current Learner",
  email: "current@example.com",
  role: "apprenant" as const,
};

function getRequest(path: string) {
  return new Request(`http://localhost:3000${path}?userId=99`);
}

function postRequest(path: string, body: Record<string, unknown> = {}) {
  return new Request(`http://localhost:3000${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify({ userId: 99, courseSlug: "fi-test", ...body }),
  });
}

describe("owner-scoped APIs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireUser).mockResolvedValue(user);
    vi.mocked(query).mockResolvedValue([] as RowDataPacket[]);
    vi.mocked(execute).mockResolvedValue({ affectedRows: 1 } as never);
  });

  it("always lists progress for the authenticated user, not the query-string userId", async () => {
    await getProgress(getRequest("/api/progress"));
    expect(requireUser).toHaveBeenCalledOnce();
    expect(query).toHaveBeenCalledWith(expect.stringContaining("user_id = ?"), [11]);
  });

  it("always lists assessments for the authenticated user", async () => {
    await getAssessments();
    expect(query).toHaveBeenCalledWith(expect.stringContaining("user_id = ?"), [11]);
  });

  it("always lists projects for the authenticated user", async () => {
    await getProjects();
    expect(query).toHaveBeenCalledWith(expect.stringContaining("user_id = ?"), [11]);
  });

  it("always lists certificates for the authenticated user", async () => {
    await getCertificates();
    expect(query).toHaveBeenCalledWith(expect.stringContaining("user_id = ?"), [11]);
  });

  it("always reads the current user's subscription", async () => {
    await getSubscriptions();
    expect(query).toHaveBeenCalledWith(expect.stringContaining("user_id = ?"), [11]);
  });

  it("writes progress using the authenticated user's ID and verifies origin", async () => {
    await postProgress(postRequest("/api/progress", { lessonTitle: "Introduction", completed: true }));
    expect(assertSameOrigin).toHaveBeenCalledOnce();
    expect(execute).toHaveBeenCalledWith(expect.stringContaining("user_id"), [11, "fi-test", "Introduction", 1]);
  });

  it("deletes only the authenticated user's progress for one course", async () => {
    const response = await deleteProgress(postRequest("/api/progress", { courseSlug: "fi-test" }));
    expect(response.status).toBe(200);
    expect(execute).toHaveBeenCalledWith(
      "DELETE FROM progress WHERE user_id = ? AND course_slug = ?",
      [11, "fi-test"],
    );
  });

  it("writes assessments using the authenticated user's ID", async () => {
    await postAssessments(postRequest("/api/assessments", { score: 85 }));
    expect(execute).toHaveBeenCalledWith(expect.stringContaining("user_id"), [11, "fi-test", 85, 1]);
  });

  it("writes projects using the authenticated user's ID", async () => {
    await postProjects(postRequest("/api/projects"));
    expect(execute).toHaveBeenCalledWith(expect.stringContaining("user_id"), [11, "fi-test"]);
  });

  it("does not allow a learner to self-issue a certificate", async () => {
    const response = await postCertificates(postRequest("/api/certificates"));
    expect(response.status).toBe(501);
    expect(execute).not.toHaveBeenCalled();
  });

  it("refuses to activate a subscription without a verified payment provider", async () => {
    const response = await postSubscriptions(postRequest("/api/subscriptions", { planId: "pack-finance" }));
    expect(response.status).toBe(501);
    expect(execute).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated progress before making any database write", async () => {
    vi.mocked(requireUser).mockRejectedValue(new AuthenticationError(401, "Authentication required"));
    const response = await postProgress(postRequest("/api/progress", { lessonTitle: "Introduction" }));
    expect(response.status).toBe(401);
    expect(execute).not.toHaveBeenCalled();
  });
});
