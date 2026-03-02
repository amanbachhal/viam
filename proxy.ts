import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isAuth = request.cookies.get("admin-auth")?.value === "true";
  const { pathname } = request.nextUrl;

  if (!isAuth && pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAuth && pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }

  if (isAuth && pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
