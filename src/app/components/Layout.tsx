"use client";

import { useAuth } from "@/context/AuthProvider";
import SidePane from "./SidePane";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth(); // Check if user is authenticated

  return (
    <div
      className={`font-[family-name:var(--font-geist-sans)] bg-gradient-to-r from-[#a0c4ff] to-[#8dd6f9] min-h-screen flex ${
        user ? "flex-row" : "flex-col"
      }`}
    >
      {/* Render SidePane only if the user is logged in */}
      {user && <SidePane />}

      {/* Main content area adjusts when SidePane is visible */}
      <main className="flex flex-col flex-grow items-center justify-center gap-8 px-8 pb-8 w-full">
        {children}
      </main>
    </div>
  );
}
