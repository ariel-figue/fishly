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
  setToken: (token: string | null, user?: User | null, expiresIn?: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let logoutTimer: NodeJS.Timeout | null = null; // Global reference to prevent multiple timers

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const storedData = localStorage.getItem("token");
      if (storedData) {
        try {
          const { token, user, expiresAt } = JSON.parse(storedData);
          const now = Date.now();

          if (expiresAt && now >= expiresAt) {
            console.warn("Session expired. Logging out...");
            logout();
          } else {
            setTokenState(token);
            setUser(user);

            // ⏳ Recalculate time remaining and reset logout timer
            if (expiresAt) {
              setLogoutTimer(expiresAt - now);
            }
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // ✅ Function to set logout timer based on remaining time
  const setLogoutTimer = (timeRemaining: number) => {
    if (logoutTimer) clearTimeout(logoutTimer); // Clear any existing timer
    logoutTimer = setTimeout(() => {
      console.warn("Session expired. Auto-logging out...");
      logout();
    }, timeRemaining);
  };

  // ✅ Function to store token & expiration
  const setToken = (newToken: string | null, newUser: User | null = null) => {
    setTokenState(newToken);
    setUser(newUser);

    if (newToken && newUser) {
      // Calculate expiration time in milliseconds from now (1 hour)
      const expiresAt = Date.now() + 3600 * 1000;
      localStorage.setItem("token", JSON.stringify({ token: newToken, user: newUser, expiresAt }));

      if (expiresAt) {
        setLogoutTimer(expiresAt - Date.now()); // Set logout timer
      }
    } else {
      localStorage.removeItem("token");
    }

    setLoading(false);
  };

  const logout = () => {
    if (logoutTimer) clearTimeout(logoutTimer); // Clear timer on logout
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
