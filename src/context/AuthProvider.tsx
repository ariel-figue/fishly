"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { setCookie, destroyCookie } from "nookies";
import Loader from "@/app/components/Loader";

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface AuthData {
  token: string;
  user: User;
  expiresAt: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  expiresAt: number | null; // Added expiresAt to the interface
  loading: boolean;
  setToken: (token: string, user: User, expiresIn?: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_TOKEN_EXPIRATION_SECONDS = 60 * 60;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  
  const logout = useCallback(() => {
    setIsLoggingOut(true);
    localStorage.removeItem("token");
    destroyCookie(null, "token", { path: "/" });
    setTokenState(null);
    setUser(null);
    setExpiresAt(null);
    setLoading(false);

    setTimeout(() => {
      router.push("/login");
      setIsLoggingOut(false);
    }, 500);
  }, [router]);
  
  const setLogoutTimer = useCallback((timeRemaining: number) => {
    if (timeRemaining <= 0) {
      console.warn("Time remaining is invalid or negative. Logging out immediately...");
      logout();
      return;
    }

    const timer = setTimeout(() => {
      window.alert("Session expired. Auto-logging out...");
      logout();
    }, timeRemaining);

    return () => clearTimeout(timer);
  }, [logout]);

  const loadUser = useCallback(() => {
    try {
      const storedData = localStorage.getItem("token");
      if (!storedData) {
        setLoading(false);
        return;
      }

      const parsedData: AuthData = JSON.parse(storedData);
      const now = Date.now();

      if (!parsedData.token || !parsedData.user || !parsedData.expiresAt) {
        console.warn("Invalid auth data in localStorage. Logging out...");
        logout();
        return;
      }

      if (parsedData.expiresAt <= now) {
        console.warn("Session expired on load. Logging out...");
        logout();
        return;
      }

      setTokenState(parsedData.token);
      setUser(parsedData.user);
      setExpiresAt(parsedData.expiresAt);
      setLoading(false);

      const timeRemaining = parsedData.expiresAt - now;
      setLogoutTimer(timeRemaining);
    } catch (error) {
      console.error("Failed to load auth data from localStorage:", error);
      logout();
    }
  }, [logout, setLogoutTimer]);

  const handleStorageEvent = useCallback(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    loadUser();
    window.addEventListener("storage", handleStorageEvent);
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [loadUser, handleStorageEvent]);

  useEffect(() => {
    const now = Date.now();
    if (expiresAt && expiresAt <= now && token) {
      console.warn("Session expired during runtime. Logging out...");
      logout();
    }
  }, [token, expiresAt, logout]);

  const setToken = useCallback(
    (newToken: string, newUser: User, expiresInSeconds?: number) => {
      try {
        const expiresIn = expiresInSeconds ?? DEFAULT_TOKEN_EXPIRATION_SECONDS;
        const expiresAt = Date.now() + expiresIn * 1000;

        setTokenState(newToken);
        setUser(newUser);
        setExpiresAt(expiresAt);
        setLoading(false);

        const authData: AuthData = { token: newToken, user: newUser, expiresAt };
        localStorage.setItem("token", JSON.stringify(authData));

        setCookie(null, "token", JSON.stringify(authData), {
          maxAge: expiresIn,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        setLogoutTimer(expiresIn * 1000);
      } catch (error) {
        console.error("Failed to set auth data:", error);
        logout();
      }
    },
    [logout, setLogoutTimer]
  );


  if (isLoggingOut) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, expiresAt, loading, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { token, expiresAt, logout } = context;
  const now = Date.now();

  if (token && expiresAt && expiresAt <= now) {
    console.warn("Session expired during useAuth access. Logging out...");
    logout();
    throw new Error("Session expired. Please log in again.");
  }

  return context;
}