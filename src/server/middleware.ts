// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Parse token from cookies
  let authData: { token: string; user: unknown; expiresAt: number } | null = null;
  try {
    if (token) {
      authData = JSON.parse(token);
    }
  } catch (error) {
    console.error("Error parsing token in middleware:", error);
  }

  // Check if token is valid and not expired
  const isAuthenticated =
    authData &&
    authData.token &&
    authData.expiresAt &&
    authData.expiresAt > Date.now();

  // Define protected routes
  const protectedRoutes = ["/weather", "/map", "/catches"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/register pages
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);
  if (isAuthRoute && isAuthenticated) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/weather/:path*", "/map/:path*", "/catches/:path*", "/login", "/register"],
};