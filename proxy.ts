import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const cookieValue = request.cookies.get("admin-auth")?.value;
  const isAuth = cookieValue === "authenticated";

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
