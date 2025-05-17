// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  // Routes publiques accessibles sans auth
  const publicPaths = ["/login", "/register", "/api/auth"];
  if (publicPaths.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Non connecté → rediriger vers login
  if (!token || !token.email) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const email = token.email as string;

  // Redirection basée sur le domaine email
  if (url.pathname === "/") {
    if (email.endsWith("@notenexus.com")) {
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
    if (email.endsWith("@gmail.com")) {
      // Accès autorisé pour utilisateur classique
      return NextResponse.next();
    }
  }

  // Protection des routes admin : seuls les emails @notenexus.com autorisés
  if (url.pathname.startsWith("/admin") && !email.endsWith("@notenexus.com")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // Rediriger en fonction du rôle sur page principale
    "/profile/:path*",
    "/notes/:path*",
    "/admin/:path*",
  ],
};
