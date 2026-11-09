import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "@/lib/local-store";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = findUserByEmail(trimmedEmail);

    if (!user) {
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET || "elevate-by-ibn-secret-2026",
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      token,
      id: user.id,
      name: user.name,
      role: user.role || "apprenant",
      subscription_status: user.subscription_status || "free",
    });

    response.cookies.set("sap_academy_session", token, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
