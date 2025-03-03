/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { WeatherCard } from "../components/WeatherCard";
import LocationSearch from "../components/LocationSearch";
import { useMediaQuery } from "react-responsive";
import Loader from "../components/Loader";
import { IoMdSunny } from "react-icons/io";
import axios from "axios";

export default function WeatherPage() {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<string>(""); // Stores the user's location

  useEffect(() => {
    let isMounted = true; // Prevents unnecessary re-renders

    const fetchLocationAndWeather = async (lat: number, lon: number) => {
      if (!isMounted) return; // Prevent multiple calls

      try {
        setIsLoading(true); // Start loading

        const [geoResponse, weatherResponse, forecastResponse] =
          await Promise.all([
            axios.get(`/api/weather?lat=${lat}&lon=${lon}&reverse=true`), // Reverse geolocation
            axios.get(`/api/weather?lat=${lat}&lon=${lon}`), // Current weather
            axios.get(`/api/weather?lat=${lat}&lon=${lon}&forecast=true`), // Forecast
          ]);

        if (geoResponse.data.length > 0) {
          const location = geoResponse.data[0];
          setLocation(
            `${location.name}, ${location.state || location.country}`
          );
        }

        setWeatherData(weatherResponse.data);
        setHourlyForecast(forecastResponse.data.list);
      } catch (error) {
        console.error("Error fetching location/weather:", error);
      } finally {
        setIsLoading(false); // Stop loading after fetching
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
        setIsLoading(false); // Stop loading if geolocation is not available
      },
      { timeout: 10000 }
    );

    return () => {
      isMounted = false; // Cleanup function to prevent multiple calls
    };
  }, []);

  return (
    <section className="flex flex-col gap-4 mt-8">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
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

          {/* 📌 Pass setWeatherData & setHourlyForecast to LocationSearch */}
          <LocationSearch
            onSelect={(data, hourly) => {
              setWeatherData(data);
              setHourlyForecast(hourly);
            }}
          />

          {/* Pass both weather data & hourly forecast */}
          <WeatherCard
            weatherData={weatherData}
            hourlyForecast={hourlyForecast}
            isDesktopOrLaptop={isDesktopOrLaptop}
          />
        </div>
      )}
    </section>
  );
}
