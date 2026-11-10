import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { execute, query } from "@/lib/db";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { createSession } from "@/lib/auth/sessions";
import { authErrorResponse, getSessionCookieOptions } from "@/lib/auth/http";
import type { RowDataPacket } from "mysql2/promise";

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

    const { name, email, password } = body as Record<string, unknown>;
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }

    const displayName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (
      !displayName ||
      displayName.length > 120 ||
      normalizedEmail.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
      password.length < 6 ||
      password.length > 128
    ) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const existing = await query<RowDataPacket>(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail],
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: "exists" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await execute(
      "INSERT INTO users (name, email, password, role, subscription_status) VALUES (?, ?, ?, 'apprenant', 'free')",
      [displayName, normalizedEmail, hash],
    );
    const token = await createSession(result.insertId);
    const response = NextResponse.json({
      user: {
        id: result.insertId,
        name: displayName,
        email: normalizedEmail,
        role: "apprenant",
        subscription: { status: "free", planId: null },
      },
    }, { status: 201 });
    response.cookies.set("sap_academy_session", token, getSessionCookieOptions());

    return response;
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "ER_DUP_ENTRY"
    ) {
      return NextResponse.json({ error: "exists" }, { status: 409 });
    }
    return authErrorResponse(err);
  }
}
