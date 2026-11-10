import { NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { AuthenticationError } from "./types";

export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export class InvalidRequestError extends Error {
  constructor() {
    super("Invalid JSON request body.");
    this.name = "InvalidRequestError";
  }
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new InvalidRequestError();
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  };
}

export function readSessionToken(request: Request): string | undefined {
  const cookie = request.headers.get("cookie");
  if (!cookie) return undefined;

  for (const part of cookie.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (name === "sap_academy_session") {
      return valueParts.join("=");
    }
  }
  return undefined;
}

export function authErrorResponse(error: unknown): NextResponse {
  unstable_rethrow(error);
  if (error instanceof InvalidRequestError) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      { error: error.status === 401 ? "unauthorized" : "forbidden" },
      { status: error.status },
    );
  }
  console.error("[Auth] Request failed:", error);
  return NextResponse.json({ error: "internal_error" }, { status: 500 });
}
