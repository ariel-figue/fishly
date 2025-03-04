"use client";

import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { IoMdSunny, IoMdMap } from "react-icons/io";
import { GiFishingPole } from "react-icons/gi";
import { motion } from "framer-motion"; // For animations

export default function Dashboard() {
  const { user } = useAuth(); // Access user data from useAuth
  const router = useRouter(); // For navigation to feature pages

  // Redirect to feature pages
  const handleWeatherClick = () => router.push("/weather");
  const handleMapClick = () => router.push("/map");
  const handleCatchesClick = () => router.push("/catches");

  // Animation variants for the welcome message
  const welcomeVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="flex flex-col items-center min-h-screen">
      {/* Welcome Message with Animation */}
      <motion.h1
        className="text-3xl sm:text-4xl font-semibold text-center text-[#2c3e50] dark:text-gray-200 mt-8 sm:mt-12"
        variants={welcomeVariants}
        initial="hidden"
        animate="visible"
      >
        Welcome to Fishly, {user?.username}!
      </motion.h1>

      {/* Subheading */}
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 text-center mt-2 sm:mt-4 mb-6 sm:mb-8">
        Explore Fishly’s Features
      </p>

      {/* Feature Cards */}
      <div className="w-full max-w-5xl px-4 sm:px-6 md:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Weather Card */}
          <button
            onClick={handleWeatherClick}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
          >
            <IoMdSunny className="text-4xl sm:text-5xl text-[#2c3e50] dark:text-gray-200 mb-2 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-[#2c3e50] dark:text-gray-200">
              Check Weather
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
              Get real-time weather updates to plan your fishing trips.
            </p>
          </button>

          {/* Maps Card */}
          <button
            onClick={handleMapClick}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
          >
            <IoMdMap className="text-4xl sm:text-5xl text-[#2c3e50] dark:text-gray-200 mb-2 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-[#2c3e50] dark:text-gray-200">
              View Maps
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
              Discover top fishing spots with interactive maps.
            </p>
          </button>

          {/* Catches Card */}
          <button
            onClick={handleCatchesClick}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
          >
            <GiFishingPole className="text-4xl sm:text-5xl text-[#2c3e50] dark:text-gray-200 mb-2 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-[#2c3e50] dark:text-gray-200">
              Log a Catch
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
              Record and analyze your fishing history with ease.
            </p>
          </button>
        </div>
      </div>
    </section>
  );
}