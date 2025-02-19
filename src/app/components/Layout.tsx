"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)] bg-gradient-to-r from-[#a0c4ff] to-[#8dd6f9]">
      <SessionProvider>
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          {children}
        </main>
      </SessionProvider>
    </div>
  );
}
