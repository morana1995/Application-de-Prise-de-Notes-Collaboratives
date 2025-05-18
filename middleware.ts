// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  // Routes publiques (login, register) restent accessibles
  const publicPaths = ["/login", "/register", "/api/auth"];

  if (publicPaths.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!token) {
    // Rediriger utilisateur non connecté vers login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Exemple : limiter accès admin uniquement pour /admin/*
  if (url.pathname.startsWith("/admin") && token.role !== "admin") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/admin/:path*",
  ],
};
