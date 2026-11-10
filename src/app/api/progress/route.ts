import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { execute, query } from "@/lib/db";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { authErrorResponse, readJsonBody } from "@/lib/auth/http";
import { requireUser } from "@/lib/auth/authorization";

interface ProgressRow extends RowDataPacket {
  id: number;
  user_id: number;
  course_slug: string;
  lesson_title: string;
  completed: number;
  updated_at: Date;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const body = await readJsonBody(request);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const { courseSlug, lessonTitle, completed } = body as Record<string, unknown>;
    if (
      typeof courseSlug !== "string" ||
      typeof lessonTitle !== "string" ||
      !courseSlug.trim() ||
      !lessonTitle.trim() ||
      courseSlug.length > 255 ||
      lessonTitle.length > 255 ||
      typeof completed !== "boolean"
    ) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }
    await execute(
      `INSERT INTO progress (user_id, course_slug, lesson_title, completed)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE completed = VALUES(completed)`,
      [user.id, courseSlug.trim(), lessonTitle.trim(), completed ? 1 : 0],
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const courseSlug = new URL(request.url).searchParams.get("courseSlug");
    const rows = courseSlug
      ? await query<ProgressRow>(
          "SELECT * FROM progress WHERE user_id = ? AND course_slug = ?",
          [user.id, courseSlug],
        )
      : await query<ProgressRow>("SELECT * FROM progress WHERE user_id = ?", [user.id]);
    return NextResponse.json({ rows });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
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
    await execute(
      "DELETE FROM progress WHERE user_id = ? AND course_slug = ?",
      [user.id, courseSlug.trim()],
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
