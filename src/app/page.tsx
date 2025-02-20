"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "./components/Layout";
import FishlyLogo from "./components/FishlyLogo";
import Dashboard from "./dashboard/page"; 
import { useAuth } from "@/context/AuthProvider";
import Loader from "./components/Loader";
import { handleNavigation } from "./utils/navigation"; 

export default function Home() {
  const { user, loading } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false); 
  const router = useRouter();


  useEffect(() => {
    if (user !== undefined) {
      setAuthLoaded(true); 
    }
  }, [user]);

 
  const navigateTo = (url: string) => handleNavigation(router, url, setIsNavigating);

  const buttonBaseClasses =
    "rounded-full flex items-center justify-center h-10 sm:h-12 px-6 text-md font-semibold transition-colors hover:font-bold";

  
  if (loading || isNavigating || !authLoaded) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {user ? (
        <Dashboard /> 
      ) : (
        <section className="flex flex-col gap-4 items-center">
          <FishlyLogo handleNavigation={() => navigateTo("/")} animated={true} />
          <h2 className="text-5xl font-semibold text-center text-[#2c3e50]">
            Welcome to Fishly
          </h2>
          <p className="text-center text-[#34495e] text-base">
            Fishly is an app to keep track of your catches and favorite fishing spots
          </p>

          <div className="flex flex-wrap justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigateTo("/login")}
              className={`${buttonBaseClasses} bg-[#ffffff] text-[#2c3e50] border border-transparent hover:bg-[#f7f7f7] min-w-[120px]`}
            >
              Login
            </button>
            <button
              onClick={() => navigateTo("/signup")}
              className={`${buttonBaseClasses} border border-[#dfe6e9] hover:bg-[#f1f1f1] text-[#2c3e50] min-w-[140px]`}
            >
              Sign Up
            </button>
          </div>
        </section>
      )}
      <Analytics />
    </Layout>
  );
}
