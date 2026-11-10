import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { execute, query } from "@/lib/db";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { authErrorResponse, readJsonBody } from "@/lib/auth/http";
import { requireRole } from "@/lib/auth/authorization";
import type { UserRole } from "@/lib/auth/types";

const ASSIGNABLE_ROLES: readonly UserRole[] = [
  "apprenant",
  "formateur",
  "consultant",
  "expert",
  "admin",
];

function isAssignableRole(role: unknown): role is UserRole {
  return typeof role === "string" && ASSIGNABLE_ROLES.includes(role as UserRole);
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/users/[id]/role">,
) {
  try {
    assertSameOrigin(request);
    await requireRole(["admin"]);
    const { id } = await context.params;
    if (!/^[1-9]\d*$/.test(id)) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const body = await readJsonBody(request);
    if (
      !body ||
      typeof body !== "object" ||
      !("role" in body) ||
      !isAssignableRole(body.role)
    ) {
      return NextResponse.json({ error: "invalid_role" }, { status: 400 });
    }

    const targetUsers = await query<RowDataPacket>("SELECT id FROM users WHERE id = ? LIMIT 1", [Number(id)]);
    if (targetUsers.length === 0) {
      return NextResponse.json({ error: "user_not_found" }, { status: 404 });
    }
    await execute("UPDATE users SET role = ? WHERE id = ?", [body.role, Number(id)]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
