import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Authenticated user trying to access auth pages → redirect to dashboard
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated user trying to access protected pages → redirect to login
  if (!token && pathname.startsWith("/dashboard") ||
      !token && pathname.startsWith("/bookings") ||
      !token && pathname.startsWith("/trips") ||
      !token && pathname.startsWith("/listings") ||
      !token && pathname.startsWith("/wallet") ||
      !token && pathname.startsWith("/settings") ||
      !token && pathname.startsWith("/notifications") ||
      !token && pathname.startsWith("/profile") ||
      !token && pathname.startsWith("/support") ||
      !token && pathname.startsWith("/vehicle-onboarding") ||
      !token && pathname.startsWith("/account-setup")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bookings/:path*",
    "/trips/:path*",
    "/listings/:path*",
    "/wallet/:path*",
    "/settings/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/support/:path*",
    "/vehicle-onboarding/:path*",
    "/account-setup/:path*",
    "/login",
    "/signup",
  ],
};
