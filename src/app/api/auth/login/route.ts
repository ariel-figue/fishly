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

    // Generate JWT Token (Fix: Ensure secret is provided)
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.NEXTAUTH_SECRET as string, // Ensure NEXTAUTH_SECRET is used
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { 
        message: "Login successful", 
        token, 
        user: {
          avatar: user.avatar,
          email: user.email,
          firstName: user.firstName,
          id: user.id,
          lastName: user.lastName,
          username: user.username,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}