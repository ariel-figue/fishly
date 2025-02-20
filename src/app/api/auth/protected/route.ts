import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.warn("No token found, redirecting...");
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect instead of returning JSON
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT secret is missing");

    jwt.verify(token, secret); // Verify JWT token
    return NextResponse.next(); //  Allow request to continue
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login on failure
  }
}

// Apply middleware only to protected API routes
export const config = {
  matcher: "/api/auth/protected/:path*",
};
