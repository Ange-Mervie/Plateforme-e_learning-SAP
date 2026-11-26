import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/apprenant",
  "/formateur",
  "/entreprise",
  "/universite",
  "/admin",
  "/cours",
];

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 100;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  record.count++;
  return true;
}

function isProtected(pathname: string) {
  if (
    pathname === "/apprenant" ||
    pathname === "/formateur" ||
    pathname === "/entreprise" ||
    pathname === "/universite" ||
    pathname === "/admin" ||
    pathname === "/cours"
  ) {
    return true;
  }
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(`${prefix}/`));
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function proxy(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  if (!checkRateLimit(ip)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  const { pathname } = request.nextUrl;
  const isProtectedRoute = isProtected(pathname);
  const isLoggedIn = !!request.cookies.get("sap_academy_session")?.value;

  if (isProtectedRoute && !isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.search = "";
    const redirectResponse = NextResponse.redirect(url);
    return addSecurityHeaders(redirectResponse);
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    "/apprenant",
    "/apprenant/:path*",
    "/formateur",
    "/formateur/:path*",
    "/entreprise",
    "/entreprise/:path*",
    "/universite",
    "/universite/:path*",
    "/admin",
    "/admin/:path*",
    "/cours",
    "/cours/:path*",
  ],
};
