"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import { WeatherCard } from "../components/WeatherCard";
import SearchBar from "../components/SearchBar";
import { useMediaQuery } from "react-responsive";

export default function WeatherPage() {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("");
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  const fetchWeatherData = async (location: string) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${process.env.OPENWEATHER_API_KEY}`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (location: string) => {
    fetchWeatherData(location);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherData(`${lat},${lon}`);
      },
      (error) => console.error(error)
    );
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-3xl font-semibold text-center text-[#2c3e50]">
        Weather
      </h2>
      <p className="text-center text-base">
        Welcome to your Fishly weather page, {user?.username}!
      </p>
      <SearchBar
        location={location}
        setLocation={setLocation}
        handleSearch={handleSearch}
      />
      {weatherData && (
        <WeatherCard
          weatherData={weatherData}
          isDesktopOrLaptop={isDesktopOrLaptop}
        />
      )}
    </section>
  );
}
