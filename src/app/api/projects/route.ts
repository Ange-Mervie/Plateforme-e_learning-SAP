import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { execute, query } from "@/lib/db";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { authErrorResponse, readJsonBody } from "@/lib/auth/http";
import { requireUser } from "@/lib/auth/authorization";

interface ProjectRow extends RowDataPacket {
  id: number;
  user_id: number;
  course_slug: string;
  status: string;
  grade: number | null;
  comments: string | null;
  created_at: Date;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const body = await readJsonBody(request);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const { courseSlug } = body as Record<string, unknown>;
    if (typeof courseSlug !== "string" || !courseSlug.trim() || courseSlug.length > 255) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }
    const result = await execute(
      "INSERT INTO projects (user_id, course_slug, status) VALUES (?, ?, 'submitted')",
      [user.id, courseSlug.trim()],
    );
    return NextResponse.json({ ok: true, id: result.insertId }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function GET() {
  try {
    const user = await requireUser();
    const rows = await query<ProjectRow>(
      "SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC",
      [user.id],
    );
    return NextResponse.json({ rows });
  } catch (error) {
    return authErrorResponse(error);
  }
}
