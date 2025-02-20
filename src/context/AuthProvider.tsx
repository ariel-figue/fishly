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
  const [loading, setLoading] = useState(true);

  // 🔹 Sync state with localStorage changes
  useEffect(() => {
    const loadUser = () => {
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
      setLoading(false);
    };

    loadUser();

    // 🔹 Listen for storage changes from other tabs/windows
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // 🔹 Ensure token updates state dynamically
  const setToken = (newToken: string | null, newUser: User | null = null) => {
    setTokenState(newToken);
    setUser(newUser);
  
    if (newToken && newUser) {
      localStorage.setItem("token", JSON.stringify({ token: newToken, user: newUser }));
    } else {
      localStorage.removeItem("token");
    }
  
    setLoading(false);
  };
  

  const logout = () => {
    setTokenState(null);
    setUser(null);
    localStorage.removeItem("token");
    setLoading(false);
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
