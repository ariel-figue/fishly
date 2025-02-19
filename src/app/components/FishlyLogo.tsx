"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function FishlyLogo({ animated = false }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`fishly-logo ${animated ? "swim-container" : ""}`}>
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
            transform: translateY(-140px) translateX(40vw) rotate(-60deg);
          }
          50% {
            transform: translateY(-380px) translateX(50vw) rotate(120deg);
          }
          75% {
            transform: translateY(-140px) translateX(85vw) rotate(360deg);
          }
          100% {
            transform: translateY(-380px) translateX(150vw) rotate(480deg);
          }
        }

        .swim-container {
          display: inline-block;
          position: fixed;
          top: 20%;
          left: -200px;
          animation: swim 18s linear infinite;
          width: 200px;
          height: 200px;
        }
      `}</style>
    </div>
  );
}

