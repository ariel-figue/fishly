import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, username, password } = await req.json();

    if (!firstName || !lastName || !email || !username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "This user already exists" }, { status: 409 });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        username,
        passwordHash: hashedPassword,
      },
    });

    // Ensure NEXTAUTH_SECRET is available
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("NEXTAUTH_SECRET is missing from environment variables");
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    // Generate JWT Token with Expiry
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, username: newUser.username },
      secret,
      { expiresIn: "1h" }
    );

    // Return both `token` and `user` in JSON response
    const response = NextResponse.json(
      {
        message: "User created successfully",
        token, // ✅ Now returning token
        user: {
          avatar: newUser.avatar,
          email: newUser.email,
          firstName: newUser.firstName,
          id: newUser.id,
          lastName: newUser.lastName,
          username: newUser.username,
        },
      },
      { status: 201 }
    );

    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
    );

    return response;
  } catch (error: unknown) {
    console.error("Signup API Error:", error);

    // Handle known Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ error: "Username or email already exists" }, { status: 409 });
      }
    }

    return NextResponse.json(
      { error: "Failed to create an account. Please try again." },
      { status: 500 }
    );
  }
}
