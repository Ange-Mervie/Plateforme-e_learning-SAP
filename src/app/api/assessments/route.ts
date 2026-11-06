import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const { userId, courseSlug, score } = await req.json();
  if (!userId || !courseSlug || score == null) return NextResponse.json({ error: "missing" }, { status: 400 });
  const passed = Number(score) >= 70 ? 1 : 0;
  await query("INSERT INTO assessments (user_id, course_slug, score, passed) VALUES (?, ?, ?, ?)", [userId, courseSlug, score, passed]);
  return NextResponse.json({ ok: true, passed: !!passed });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "missing" }, { status: 400 });
  const rows = await query("SELECT * FROM assessments WHERE user_id = ?", [userId]);
  return NextResponse.json({ rows });
}
