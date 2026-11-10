import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { execute, query } from "@/lib/db";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { authErrorResponse, readJsonBody } from "@/lib/auth/http";
import { requireUser } from "@/lib/auth/authorization";

interface AssessmentRow extends RowDataPacket {
  id: number;
  user_id: number;
  course_slug: string;
  score: number;
  passed: number;
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

    const { courseSlug, score } = body as Record<string, unknown>;
    if (
      typeof courseSlug !== "string" ||
      !courseSlug.trim() ||
      courseSlug.length > 255 ||
      typeof score !== "number" ||
      !Number.isFinite(score) ||
      score < 0 ||
      score > 100
    ) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }
    const passed = score >= 70 ? 1 : 0;
    const result = await execute(
      "INSERT INTO assessments (user_id, course_slug, score, passed) VALUES (?, ?, ?, ?)",
      [user.id, courseSlug.trim(), score, passed],
    );
    return NextResponse.json({
      ok: true,
      passed: !!passed,
      assessment: { id: result.insertId, user_id: user.id, course_slug: courseSlug.trim(), score, passed },
    }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function GET() {
  try {
    const user = await requireUser();
    const rows = await query<AssessmentRow>(
      "SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC",
      [user.id],
    );
    return NextResponse.json({ rows });
  } catch (error) {
    return authErrorResponse(error);
  }
}
