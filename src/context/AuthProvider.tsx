"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { setCookie, destroyCookie } from "nookies"; // For cookie management
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
  loading: boolean;
  setToken: (token: string, user: User, expiresIn?: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default expiration time (1 hour)
const DEFAULT_TOKEN_EXPIRATION_SECONDS = 60 * 60;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // For logout loading state
  const router = useRouter();

  // Load user data from localStorage on mount
  const loadUser = useCallback(() => {
    try {
      const storedData = localStorage.getItem("token");
      if (!storedData) {
        setLoading(false);
        return;
      }

      const parsedData: AuthData = JSON.parse(storedData);
      const now = Date.now();

      // Validate token and expiration
      if (!parsedData.token || !parsedData.user || !parsedData.expiresAt) {
        console.warn("Invalid auth data in localStorage. Logging out...");
        logout();
        return;
      }

      // Check if session has expired
      if (parsedData.expiresAt <= now) {
        console.warn("Session expired on load. Logging out...");
        logout();
        return;
      }

      // Set auth data
      setTokenState(parsedData.token);
      setUser(parsedData.user);
      setExpiresAt(parsedData.expiresAt);
      setLoading(false);

      // Set logout timer
      const timeRemaining = parsedData.expiresAt - now;
      setLogoutTimer(timeRemaining);
    } catch (error) {
      console.error("Failed to load auth data from localStorage:", error);
      logout();
    }
  }, []);

  // Handle logout timer
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

    // Cleanup timer on unmount or token change
    return () => clearTimeout(timer);
  }, []);

  // Handle storage events (e.g., logout from another tab)
  const handleStorageEvent = useCallback(() => {
    loadUser();
  }, [loadUser]);

  // Load user data on mount and listen for storage events
  useEffect(() => {
    loadUser();

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [loadUser, handleStorageEvent]);

  // Check expiration on every render
  useEffect(() => {
    const now = Date.now();
    if (expiresAt && expiresAt <= now && token) {
      console.warn("Session expired during runtime. Logging out...");
      logout();
    }
  }, [token, expiresAt]);

  // Store token and user data
  const setToken = useCallback(
    (newToken: string, newUser: User, expiresInSeconds?: number) => {
      try {
        // Calculate expiration time
        const expiresIn = expiresInSeconds ?? DEFAULT_TOKEN_EXPIRATION_SECONDS;
        const expiresAt = Date.now() + expiresIn * 1000;

        // Update state
        setTokenState(newToken);
        setUser(newUser);
        setExpiresAt(expiresAt);
        setLoading(false);

        // Store in localStorage
        const authData: AuthData = { token: newToken, user: newUser, expiresAt };
        localStorage.setItem("token", JSON.stringify(authData));

        // Sync to cookies for middleware
        setCookie(null, "token", JSON.stringify(authData), {
          maxAge: expiresIn, // Cookie expiration in seconds
          path: "/",
          secure: process.env.NODE_ENV === "production", // Secure in production
          sameSite: "strict",
        });

        // Set logout timer
        setLogoutTimer(expiresIn * 1000);
      } catch (error) {
        console.error("Failed to set auth data:", error);
        logout();
      }
    },
    []
  );

  // Handle logout
  const logout = useCallback(() => {
    setIsLoggingOut(true);
    localStorage.removeItem("token");
    destroyCookie(null, "token", { path: "/" }); // Remove cookie
    setTokenState(null);
    setUser(null);
    setExpiresAt(null);
    setLoading(false);

    // Redirect to login page after a short delay to show loader
    setTimeout(() => {
      router.push("/login");
      setIsLoggingOut(false);
    }, 500);
  }, [router]);

  if (isLoggingOut) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, token, expiresAt, logout } = context;
  const now = Date.now();

  // Validate token expiration on every access
  if (token && expiresAt && expiresAt <= now) {
    console.warn("Session expired during useAuth access. Logging out...");
    logout();
    throw new Error("Session expired. Please log in again.");
  }

  return context;
}