import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2/promise";
import { query } from "@/lib/db";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { createSession } from "@/lib/auth/sessions";
import { authErrorResponse, getSessionCookieOptions } from "@/lib/auth/http";

interface LoginUserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  subscription_status: string;
}

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }
    const { email, password } = body as Record<string, unknown>;
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const rows = await query<LoginUserRow>(
      `SELECT id, name, email, password, role, subscription_status
       FROM users WHERE email = ? LIMIT 1`,
      [normalizedEmail],
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }

    const token = await createSession(user.id);
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role === "learner" ? "apprenant" : user.role,
        subscription: { status: user.subscription_status === "active" ? "active" : "free", planId: null },
      },
    });
    response.cookies.set("sap_academy_session", token, getSessionCookieOptions());

    return response;
  } catch (err: unknown) {
    return authErrorResponse(err);
  }
}
