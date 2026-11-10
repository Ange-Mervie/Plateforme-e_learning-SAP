import { beforeEach, describe, expect, it, vi } from "vitest";
import { execute, query } from "@/lib/db";
import { requireRole } from "@/lib/auth/authorization";
import { AuthenticationError } from "@/lib/auth/types";
import { PATCH } from "./users/[id]/role/route";

vi.mock("@/lib/db", () => ({
  execute: vi.fn(),
  query: vi.fn(),
}));

vi.mock("@/lib/auth/authorization", () => ({
  requireRole: vi.fn(),
}));

vi.mock("@/lib/auth/csrf", () => ({
  assertSameOrigin: vi.fn(),
}));

describe("admin role assignment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(query).mockResolvedValue([{ id: 11 }] as never);
    vi.mocked(requireRole).mockResolvedValue({
      id: 2,
      name: "Administrator",
      email: "admin@example.com",
      role: "admin",
    });
    vi.mocked(execute).mockResolvedValue({ affectedRows: 1 } as never);
  });

  it("allows an admin to assign an allowed role through a parameterized update", async () => {
    const response = await PATCH(
      new Request("http://localhost:3000/api/admin/users/11/role", {
        method: "PATCH",
        headers: { "content-type": "application/json", origin: "http://localhost:3000" },
        body: JSON.stringify({ role: "formateur" }),
      }),
      { params: Promise.resolve({ id: "11" }) },
    );

    expect(response.status).toBe(200);
    expect(requireRole).toHaveBeenCalledWith(["admin"]);
    expect(execute).toHaveBeenCalledWith("UPDATE users SET role = ? WHERE id = ?", ["formateur", 11]);
  });

  it("rejects a privileged request from a non-admin", async () => {
    vi.mocked(requireRole).mockRejectedValue(new AuthenticationError(403, "Insufficient role"));
    const response = await PATCH(
      new Request("http://localhost:3000/api/admin/users/11/role", {
        method: "PATCH",
        headers: { "content-type": "application/json", origin: "http://localhost:3000" },
        body: JSON.stringify({ role: "admin" }),
      }),
      { params: Promise.resolve({ id: "11" }) },
    );
    expect(response.status).toBe(403);
    expect(execute).not.toHaveBeenCalled();
  });

  it("rejects unknown roles and invalid target IDs", async () => {
    const invalidRole = await PATCH(
      new Request("http://localhost:3000/api/admin/users/11/role", {
        method: "PATCH",
        headers: { "content-type": "application/json", origin: "http://localhost:3000" },
        body: JSON.stringify({ role: "root" }),
      }),
      { params: Promise.resolve({ id: "11" }) },
    );
    const invalidId = await PATCH(
      new Request("http://localhost:3000/api/admin/users/nope/role", {
        method: "PATCH",
        headers: { "content-type": "application/json", origin: "http://localhost:3000" },
        body: JSON.stringify({ role: "admin" }),
      }),
      { params: Promise.resolve({ id: "nope" }) },
    );
    expect(invalidRole.status).toBe(400);
    expect(invalidId.status).toBe(400);
    expect(execute).not.toHaveBeenCalled();
  });

  it("treats assigning the user's current role as a successful no-op", async () => {
    vi.mocked(execute).mockResolvedValue({ affectedRows: 0 } as never);
    const response = await PATCH(
      new Request("http://localhost:3000/api/admin/users/11/role", {
        method: "PATCH",
        headers: { "content-type": "application/json", origin: "http://localhost:3000" },
        body: JSON.stringify({ role: "apprenant" }),
      }),
      { params: Promise.resolve({ id: "11" }) },
    );
    expect(response.status).toBe(200);
  });
});
