"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  setToken: (token: string | null, user?: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  // Load token from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("token");
      if (storedData) {
        try {
          const { token, user } = JSON.parse(storedData);
          setTokenState(token);
          setUser(user);
        } catch (error) {
          console.error("Error parsing auth data:", error);
          localStorage.removeItem("token"); // Remove invalid data
        }
      }
    }
    setLoading(false); // ✅ Finish loading once check is done
  }, []);

  // Ensure token is not removed immediately after setting
  const setToken = (newToken: string | null, newUser: User | null = null) => {
    setTokenState(newToken);
    if (newUser) setUser(newUser);

    if (newToken && newUser) {
      localStorage.setItem("token", JSON.stringify({ token: newToken, user: newUser }));
    } else {
      localStorage.removeItem("token");
    }

    setLoading(false); // ✅ Ensure UI updates properly after token is set
  };

  const logout = () => {
    setTokenState(null);
    setUser(null);
    localStorage.removeItem("token");
    setLoading(false); // ✅ Ensure logout completes before UI update
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
