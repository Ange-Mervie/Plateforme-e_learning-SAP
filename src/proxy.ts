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
  const csp =
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://api.stripe.com https://www.google-analytics.com; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';";

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  // HSTS uniquement en production (HTTPS)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }
  return response;
}

export function proxy(request: NextRequest) {
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
