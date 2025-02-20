import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Compare password hash
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Use `NEXTAUTH_SECRET` for compatibility with NextAuth.js
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("NEXTAUTH_SECRET is missing in environment variables");
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    // Generate JWT Token with `iat` and `exp`
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      secret,
      { expiresIn: "1h" }
    );

    // Securely set JWT as an HttpOnly Cookie (Best Practice)
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          avatar: user.avatar,
          email: user.email,
          firstName: user.firstName,
          id: user.id,
          lastName: user.lastName,
          username: user.username,
        },
      },
      { status: 200 }
    );

    // Set cookie with `HttpOnly`, `Secure`, `SameSite=Strict`
    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
    );

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
