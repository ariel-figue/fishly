import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export const authMiddleware = (req: NextApiRequest) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("Unauthorized");

  try {
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, SECRET_KEY);
  } catch (error: unknown) {
    throw new Error("Invalid token" + error);
  }
};
