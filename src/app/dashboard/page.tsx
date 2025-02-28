"use client";

import { useAuth } from "@/context/AuthProvider";
export default function Dashboard() {
  const { user } = useAuth(); // Access loading state from useAuth

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-3xl font-semibold text-center text-[#2c3e50]">
        Dashboard
      </h2>
      <p className="text-center text-base">
        Welcome to your Fishly dashboard, {user?.username}!
      </p>
      <p className="text-center text-base">
        🚧 This page and other features are under construction 🚧
      </p>
    </section>
  );
}
