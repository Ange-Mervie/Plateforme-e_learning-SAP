import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { createSessionWithFallback } from "@/lib/auth/persistent-store";
import { loginUserWithFallback } from "@/lib/auth/persistent-store";
import { authErrorResponse, getSessionCookieOptions } from "@/lib/auth/http";
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
    const { email, password } = body as Record<string, unknown>;
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }

    const rateLimitId = `login:${clientIp}:${email.trim().toLowerCase()}`;
    const rateLimit = checkRateLimit(rateLimitId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "rate_limited", resetTime: rateLimit.resetTime },
        { status: 429 },
      );
    }

    const user = await loginUserWithFallback(email, password);

    if (!user) {
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }

    const token = await createSessionWithFallback(user.id);
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role === "learner" ? "apprenant" : user.role,
        subscription: { status: user.subscription_status === "active" ? "active" : "free", planId: null },
        emailVerified: user.email_verified,
      },
      emailVerificationRequired: !user.email_verified,
    });
    response.cookies.set("sap_academy_session", token, getSessionCookieOptions());

    return response;
  } catch (err: unknown) {
    return authErrorResponse(err);
  }
}
