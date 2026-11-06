import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const { userId, courseSlug } = await req.json();
  if (!userId || !courseSlug) return NextResponse.json({ error: "missing" }, { status: 400 });
  await query("INSERT INTO projects (user_id, course_slug, status) VALUES (?, ?, 'submitted')", [userId, courseSlug]);
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "missing" }, { status: 400 });
  const rows = await query("SELECT * FROM projects WHERE user_id = ?", [userId]);
  return NextResponse.json({ rows });
}
