import { authMiddleware } from "@/middleware/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createContext = ({ req }: any) => {
  try {
    const user = authMiddleware(req);
    return { user };
  } catch {
    return {};
  }
};
