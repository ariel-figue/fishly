import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET!; // Define in .env file

export const authResolvers = {
  Mutation: {
    async registerUser(_: unknown, { email, password, name }: unknown) {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) throw new Error("User already exists");

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });

      return { token, user };
    },

    async loginUser(_: unknown, { email, password }: unknown) {
      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) throw new Error("Invalid credentials");

      // Compare passwords
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("Invalid credentials");

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });

      return { token, user };
    },
  },

  Query: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async me(_: unknown, __: unknown, context: any) {
      if (!context.user) throw new Error("Not authenticated");
      return await prisma.user.findUnique({ where: { id: context.user.userId } });
    },
  },
};
