"use client";

import { Analytics } from "@vercel/analytics/react"
import Link from "next/link";
import Layout from "./components/Layout";
import FishlyLogo from "./components/FishlyLogo";

export default function Home() {
  const buttonBaseClasses =
    "rounded-full flex items-center justify-center h-10 sm:h-12 px-6 text-md font-semibold transition-colors hover:font-bold";

  return (
    <Layout>
      <section className="flex flex-col gap-4 items-center">
        <FishlyLogo animated={true} />
        <h2 className="text-5xl font-semibold text-center text-[#2c3e50]">
          Welcome to Fishly
        </h2>
        <p className="text-center text-[#34495e] text-base">
          Fishly is an app to keep track of your catches and favorite fishing spots
        </p>

        <div className="flex flex-wrap justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className={`${buttonBaseClasses} bg-[#ffffff] text-[#2c3e50] border border-transparent hover:bg-[#f7f7f7] min-w-[120px]`}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className={`${buttonBaseClasses} border border-[#dfe6e9] hover:bg-[#f1f1f1] text-[#2c3e50] min-w-[140px]`}
          >
            Sign Up
          </Link>
        </div>
      </section>
      <Analytics />
    </Layout>
  );
}
