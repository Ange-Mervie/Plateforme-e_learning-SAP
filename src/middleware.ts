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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = isProtected(pathname);
  const isLoggedIn = request.cookies.get("sap_academy_session")?.value === "1";

  if (isProtectedRoute && !isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
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
