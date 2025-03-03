/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { IoSearch } from "react-icons/io5"; // Magnifying glass icon
import { ImSpinner2 } from "react-icons/im"; // Loader icon

interface LocationSearchProps {
  onSelect: (weatherData: any) => void; // Now correctly returns weather data
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [placeholder, setPlaceholder] = useState("Search for city, state, or ZIP");

  // 🌍 **Use Geolocation to Set Placeholder & Fetch Weather on Load**
  useEffect(() => {
    const fetchLocationAndWeather = async (lat: number, lon: number) => {
      try {
        // Get city/state name for placeholder
        const geoResponse = await axios.get(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );

        if (geoResponse.data.length > 0) {
          const location = geoResponse.data[0];
          setPlaceholder(`${location.name}, ${location.state || location.country}`);

          // ✅ Automatically fetch weather on page load
          fetchWeather(lat, lon);
        }
      } catch (error) {
        console.error("Error fetching reverse geolocation data:", error);
      }
    };

    const fetchWeather = async (lat: number, lon: number) => {
      setIsSearching(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        onSelect(response.data); // ✅ Pass weather data to parent component
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setIsSearching(false);
      }
    };

    // Try to get user's geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchLocationAndWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => console.error("Geolocation error:", error),
      { timeout: 10000 }
    );
  }, []);

  // 🔍 **Fetch City/State or ZIP Code Suggestions**
  const fetchSuggestions = async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      let response;
      if (/^\d+$/.test(input)) {
        // ZIP code search
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
        // City/State search
        response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        setSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  // ✅ **Handle User Selection**
  const handleSelect = async (location: any) => {
    setQuery(`${location.name}, ${location.state || location.country}`);
    setSuggestions([]);
    setIsSearching(true); // Show loader while fetching weather data

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=imperial&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );

      onSelect(response.data); // Send full weather data to parent
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsSearching(false); // Hide loader
    }
  };

  // 🎯 **Trigger Search When User Clicks Button**
  const handleSearch = () => {
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]); // Select first suggestion
    }
  };

  // ⌨ **Trigger Search on "Enter" Key Press**
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div className="relative w-full mt-4">
      <div className="relative w-[500px]">
        {/* 🌍 Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          onKeyDown={handleKeyPress}
          placeholder={placeholder} // Dynamically updates based on geolocation
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />

        {/* 🔍 Search Button with Loader */}
        <button
          onClick={handleSearch}
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

      {/* 📌 Suggestions Dropdown */}
      {isSearching ? (
        <div className="absolute z-10 bg-white w-[500px] border rounded-md mt-1 shadow-md p-2 flex items-center justify-center">
          <ImSpinner2 className="animate-spin text-xl" />
        </div>
      ) : suggestions.length > 0 ? (
        <ul className="absolute z-10 bg-white w-[500px] border rounded-md mt-1 shadow-md">
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
      ) : null}
    </div>
  );
};

export default LocationSearch;
