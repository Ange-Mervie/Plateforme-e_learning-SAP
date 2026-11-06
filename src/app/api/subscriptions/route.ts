import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "missing" }, { status: 400 });
  await query("INSERT INTO subscriptions (user_id, status) VALUES (?, 'pending')", [userId]);
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "missing" }, { status: 400 });
  const rows = await query("SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", [userId]);
  return NextResponse.json({ subscription: rows[0] || null });
}
