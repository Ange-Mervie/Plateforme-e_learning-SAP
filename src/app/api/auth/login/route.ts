import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const rows = await query<any>("SELECT * FROM users WHERE email = ?", [email]);
  if (!rows.length) return NextResponse.json({ error: "invalid" }, { status: 401 });
  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return NextResponse.json({ error: "invalid" }, { status: 401 });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
  return NextResponse.json({ token, role: user.role });
}
