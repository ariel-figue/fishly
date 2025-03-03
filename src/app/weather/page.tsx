/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]); // ✅ Store hourly forecast
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const [isClient, setIsClient] = useState(false);

  // ✅ Ensure hydration to prevent mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="flex flex-col gap-4 mt-8">
      {!isClient ? (
        <Loader />
      ) : (
        <div>
          <h2 className="text-3xl font-semibold text-center text-[#2c3e50] w-full flex items-center justify-center gap-2 mb-2">
            Weather <IoMdSunny size={32} className="shrink-0" />
          </h2>
          <p className="text-center text-base text-[#2c3e50]">
            Welcome to your Fishly weather page, {user?.username}!
          </p>

          {/* 📌 Pass setWeatherData & setHourlyForecast to LocationSearch */}
          <LocationSearch onSelect={(data, hourly) => {
            setWeatherData(data);
            setHourlyForecast(hourly);
          }} />

          {/* Pass both weather data & hourly forecast */}
          {weatherData && (
            <WeatherCard
              weatherData={weatherData}
              hourlyForecast={hourlyForecast}
              isDesktopOrLaptop={isDesktopOrLaptop}
            />
          )}
        </div>
      )}
    </section>
  );
}
