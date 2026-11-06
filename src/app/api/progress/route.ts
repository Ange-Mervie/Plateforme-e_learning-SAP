import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const { userId, courseSlug, lessonTitle, completed } = await req.json();
  if (!userId || !courseSlug || !lessonTitle) return NextResponse.json({ error: "missing" }, { status: 400 });
  await query(
    "INSERT INTO progress (user_id, course_slug, lesson_title, completed) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE completed = VALUES(completed)",
    [userId, courseSlug, lessonTitle, completed ? 1 : 0]
  );
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const courseSlug = searchParams.get("courseSlug");
  if (!userId) return NextResponse.json({ error: "missing" }, { status: 400 });
  const rows = await query("SELECT * FROM progress WHERE user_id = ?" + (courseSlug ? " AND course_slug = ?" : ""), courseSlug ? [userId, courseSlug] : [userId]);
  return NextResponse.json({ rows });
}
