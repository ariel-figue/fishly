"use client";

// import { SessionProvider } from "next-auth/react";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // <SessionProvider>
      <div className="font-[family-name:var(--font-geist-sans)] bg-gradient-to-r from-[#a0c4ff] to-[#8dd6f9]">
        <main className="flex flex-col min-h-screen flex-grow items-center justify-center gap-8 px-8 pb-8">
          {children}
        </main>
        <Footer />
      </div>
    // </SessionProvider>
  );
}
