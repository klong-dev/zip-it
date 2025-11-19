import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is accessing /admin root
  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Check if user is on login page
  if (pathname === "/admin/login") {
    // Check if admin token exists in cookies
    const adminToken = request.cookies.get("admin_token")?.value;

    if (adminToken) {
      // User is already logged in, redirect to dashboard
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // Check if user is accessing protected admin routes (not login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminToken = request.cookies.get("admin_token")?.value;

    if (!adminToken) {
      // No token, redirect to login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
