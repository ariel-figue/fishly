"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { WeatherCard } from "../components/WeatherCard";
import LocationSearch from "../components/LocationSearch";
import { useMediaQuery } from "react-responsive";
import Loader from "../components/Loader";
import { IoMdSunny } from "react-icons/io";

export default function WeatherPage() {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setShowLoader(false);
  }, []);

  return (
    <section className="flex flex-col gap-4">
      {showLoader ? (
        <Loader />
      ) : (
        <div>
          <h2 className="text-3xl font-semibold text-center text-[#2c3e50] w-full flex items-center justify-center gap-2 mb-2">
            Weather <IoMdSunny size={32} className="shrink-0" />
          </h2>
          <p className="text-center text-base text-[#2c3e50]">
            Welcome to your Fishly weather page, {user?.username}!
          </p>

          {/* Autocomplete Search Bar */}
          <LocationSearch onSelect={setWeatherData} />

          {weatherData && (
            <WeatherCard
              weatherData={weatherData}
              isDesktopOrLaptop={isDesktopOrLaptop}
            />
          )}
        </div>
      )}
    </section>
  );
}
