/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import WeatherCard from "../components/weather/WeatherCard";
import LocationSearch from "../components/weather/LocationSearch";
import { useMediaQuery } from "react-responsive";
import Loader from "../components/Loader";
import { IoMdSunny } from "react-icons/io";
import axios from "axios";

export default function WeatherPage() {
  const { user, loading } = useAuth(); // Updated to use loading from useAuth
  const router = useRouter();
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const [isFetching, setIsFetching] = useState(true); // Renamed for clarity
  const [location, setLocation] = useState<string>(""); // Stores the user's location

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return; // Wait for user to be authenticated

    let isMounted = true; // Prevents unnecessary re-renders

    const fetchLocationAndWeather = async (lat: number, lon: number) => {
      if (!isMounted) return; // Prevent multiple calls

      try {
        setIsFetching(true); // Start loading

        const response = await axios.get(
          `/api/weather?lat=${lat}&lon=${lon}&forecast=true`
        );

        // Extract location details
        const { location, forecast } = response.data;
        setLocation(`${location.name}, ${location.region || location.country}`);

        // Set weather data
        setWeatherData(response.data);
        setHourlyForecast(forecast.hourly || []);
      } catch (error) {
        console.error("Error fetching location/weather:", error);
      } finally {
        setIsFetching(false); // Stop loading after fetching
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchLocationAndWeather(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        console.warn("Geolocation not available. User must manually search.");
        setIsFetching(false); // Stop loading if geolocation is not available
      },
      { timeout: 10000 }
    );

    return () => {
      isMounted = false; // Cleanup function to prevent multiple calls
    };
  }, [user]);

  if (loading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return null; // Prevent rendering until redirect
  }

  return (
    <section className="flex flex-col gap-4 mt-8">
      <h2 className="text-3xl font-semibold text-center text-[#2c3e50] w-full flex items-center justify-center gap-2 mb-2">
        Weather <IoMdSunny size={32} className="shrink-0" />
      </h2>
      <p className="text-center text-base text-[#2c3e50]">
        Welcome to your Fishly weather page, {user?.username}!
        {location && (
          <span>
            <br />
            Current Location: <b>{location}</b>{" "}
          </span>
        )}
      </p>

      <LocationSearch
        onSelect={(data, hourly) => {
          setWeatherData(data);
          setHourlyForecast(hourly);
        }}
      />

      <WeatherCard
        weatherData={weatherData}
        hourlyForecast={hourlyForecast}
        isDesktopOrLaptop={isDesktopOrLaptop}
      />
    </section>
  );
}