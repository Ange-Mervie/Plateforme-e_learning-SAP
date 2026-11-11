import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { createSession } from "@/lib/auth/sessions";
import { authErrorResponse, getSessionCookieOptions } from "@/lib/auth/http";
import { registerUserWithFallback } from "@/lib/auth/persistent-store";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);

    const clientIp = getClientIp(req);

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

    const normalizedEmail = email.trim().toLowerCase();
    const rateLimitId = `register:${clientIp}:${normalizedEmail}`;
    const rateLimit = checkRateLimit(rateLimitId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "rate_limited", resetTime: rateLimit.resetTime },
        { status: 429 },
      );
    }

    const displayName = name.trim();
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

    const hash = await bcrypt.hash(password, 12);
    const result = await registerUserWithFallback(displayName, normalizedEmail, hash);

    if (!result) {
      return NextResponse.json({ error: "exists" }, { status: 409 });
    }

    const token = await createSession(result.id);
    const response = NextResponse.json({
      user: {
        id: result.id,
        name: displayName,
        email: normalizedEmail,
        role: "apprenant",
        subscription: { status: "free", planId: null },
        emailVerified: result.emailVerified,
      },
      emailVerification: {
        required: !result.emailVerified,
        code: result.verificationCode,
        message: !result.emailVerified
          ? "Un email de confirmation a été envoyé. Vérifiez votre boîte de réception pour activer votre compte."
          : null,
      },
    }, { status: 201 });
    response.cookies.set("sap_academy_session", token, getSessionCookieOptions());

    return response;
  } catch (err: unknown) {
    return authErrorResponse(err);
  }
}
