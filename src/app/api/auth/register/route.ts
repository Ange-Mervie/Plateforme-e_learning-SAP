import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "missing" }, { status: 400 });
  const existing = await query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length) return NextResponse.json({ error: "exists" }, { status: 409 });
  const hash = await bcrypt.hash(password, 10);
  await query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hash]);
  return NextResponse.json({ ok: true });
}
