"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true); // Reveal the image only after mounting
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-r from-[#a0c4ff] to-[#8dd6f9]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <section className="flex flex-col gap-4 items-center ">
          <div className={`swim-container ${isLoaded ? "visible" : "hidden"}`}>
            <Image
              className="fish-image"
              src="/fishly_logo_white_fill.png"
              alt="Fishly Logo"
              width={200}
              height={200}
            />
            <style jsx>{`
              @keyframes swim {
                0% {
                  transform: translateY(0px) translateX(-250px) rotate(0deg);
                }
                25% {
                  transform: translateY(-240px) translateX(40vw) rotate(-60deg);
                }
                50% {
                  transform: translateY(-480px) translateX(50vw) rotate(120deg);
                }
                75% {
                  transform: translateY(-240px) translateX(85vw) rotate(360deg);
                }
                100% {
                  transform: translateY(-480px) translateX(150vw) rotate(480deg);
                }
              }

              .swim-container {
                display: inline-block;
                position: absolute;
                left: -200px; /* Start offscreen */
                animation: swim 18s linear infinite;
              }

              .hidden {
                display: none; /* Hide until page fully loads */
              }

              .visible {
                display: inline-block;
              }
            `}</style>
          </div>

          <h2 className="text-2xl font-semibold text-center sm:text-left text-[#2c3e50]">
            Welcome to Fishly
          </h2>
          <p className="text-sm text-center sm:text-left text-[#34495e]">
            Get started by logging in or creating an account
          </p>
          <div className="flex gap-4 items-center flex-row">
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#ffffff] text-[#2c3e50] gap-2 hover:bg-[#f7f7f7] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href="/login"
            >
              Login
            </a>
            <a
              className="rounded-full border border-solid border-[#dfe6e9] transition-colors flex items-center justify-center hover:bg-[#f1f1f1] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 text-[#2c3e50]"
              href="/create-account"
            >
              Create Account
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
