/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { IoSearch } from "react-icons/io5"; // Magnifying glass icon
import { ImSpinner2 } from "react-icons/im"; // Loader icon

interface LocationSearchProps {
  onSelect: (weatherData: any, hourlyForecast: any[]) => void; // ✅ Returns both current & hourly forecast
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [placeholder, setPlaceholder] = useState(
    "Search for city, state, or ZIP"
  );

  // ✅ Moved fetchWeather here, making it accessible to handleSelect
  const fetchWeather = async (lat: number, lon: number) => {
    setIsSearching(true);
    try {
      const [currentWeather, forecast] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        ),
      ]);

      onSelect(currentWeather.data, forecast.data.list); // ✅ Pass both to WeatherCard
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const fetchLocationAndWeather = async (lat: number, lon: number) => {
      try {
        // Get city/state name for placeholder
        const geoResponse = await axios.get(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );

        if (geoResponse.data.length > 0) {
          const location = geoResponse.data[0];
          setPlaceholder(
            `${location.name}, ${location.state || location.country}`
          );

          // ✅ Fetch weather on page load
          fetchWeather(lat, lon);
        }
      } catch (error) {
        console.error("Error fetching geolocation:", error);
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
      },
      { timeout: 10000 }
    );
  }, []);

  // 🔍 Fetch City/State or ZIP Code Suggestions
  const fetchSuggestions = async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      let response;
      if (/^\d+$/.test(input)) {
        response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/zip?zip=${input},US&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        setSuggestions([
          {
            name: response.data.name,
            lat: response.data.lat,
            lon: response.data.lon,
            state: response.data.state || "US",
          },
        ]);
      } else {
        response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        setSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  // ✅ Handle User Selection
  const handleSelect = async (location: any) => {
    setQuery(`${location.name}, ${location.state || location.country}`);
    setSuggestions([]);
    fetchWeather(location.lat, location.lon); // ✅ Now works without errors
  };

  return (
    <div className="relative w-full mt-4">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        <button
          onClick={() => handleSelect(suggestions[0])}
          disabled={isSearching}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {isSearching ? (
            <ImSpinner2 className="animate-spin text-xl" />
          ) : (
            <IoSearch className="text-xl" />
          )}
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white w-full border rounded-md mt-1 shadow-md">
          {suggestions.map((location, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200 flex justify-between"
              onClick={() => handleSelect(location)}
            >
              {location.name}, {location.state || location.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
