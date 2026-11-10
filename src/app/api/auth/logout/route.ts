import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { SESSION_COOKIE } from "@/lib/auth/authorization";
import { authErrorResponse, getSessionCookieOptions, readSessionToken } from "@/lib/auth/http";
import { revokeSession } from "@/lib/auth/sessions";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await revokeSession(readSessionToken(request));
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", { ...getSessionCookieOptions(), maxAge: 0 });
    return response;
  } catch (error) {
    return authErrorResponse(error);
  }
}
