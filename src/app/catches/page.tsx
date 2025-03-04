"use client";

import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "../components/Loader";

export default function CatchesPage() {
  const { user, loading } = useAuth(); // Access user data and loading state from useAuth
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Navigate back to dashboard
  const handleBackToDashboard = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return null; // Prevent rendering until redirect
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-semibold text-center text-[#2c3e50] dark:text-gray-200 mb-4 sm:mb-6">
        Welcome, {user?.username}!
      </h1>
      <p className="text-lg sm:text-xl text-center text-[#2c3e50] dark:text-gray-300 mb-2 sm:mb-4">
        🚧🎣 Catches Feature Under Construction 🎣🚧
      </p>
      <p className="text-base sm:text-lg text-center text-gray-700 dark:text-gray-400 mb-6 sm:mb-8">
        Log your catches and where you caught it soon with this feature page!
      </p>
      <button
        onClick={handleBackToDashboard}
        className="bg-[#2c3e50] dark:bg-gray-700 text-white px-4 sm:px-6 py-2 rounded-md font-semibold hover:bg-[#2A4A68] dark:hover:bg-gray-600 transition-colors"
        aria-label="Back to Dashboard"
      >
        Back to Dashboard
      </button>
    </section>
  );
}