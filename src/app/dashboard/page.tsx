"use client";
import Layout from "../components/Layout";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "../components/Loader"; // Import the Loader component

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    logout(); // Clears token and user session
    router.push("/"); // Redirects to homepage
  };

  const initiateLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      handleLogout();
    }, 1000); // Show loader for 1 second before logging out
  };

  return (
    <Layout>
      <section className="flex flex-col gap-4 items-center">
        <h2 className="text-3xl font-semibold text-center text-[#2c3e50]">
          Dashboard
        </h2>
        <p className="text-center text-base">
          Welcome to your Fishly dashboard, {user?.username}!
        </p>
        <p>🚧 This page and other features are under construction 🚧</p>

        {/* Logout Button */}
        <button
          onClick={initiateLogout}
          className="bg-[#2c3e50] text-white px-4 py-2 rounded-md font-medium hover:bg-[#34495e] transition flex items-center justify-center w-[100px]"

        >
          {isLoggingOut ? <Loader size={24} color="white" /> : "Logout"}
        </button>
      </section>
    </Layout>
  );
}
