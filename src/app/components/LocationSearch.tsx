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
        axios.get(`/api/weather?lat=${lat}&lon=${lon}`), // Calls the Next.js API route
        axios.get(`/api/weather?lat=${lat}&lon=${lon}&forecast=true`), // Fetches the forecast
      ]);

      onSelect(currentWeather.data, forecast.data.list); // ✅ Pass both to WeatherCard
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    let isMounted = true; // Prevents unnecessary re-renders
  
    const fetchLocationAndWeather = async (lat: number, lon: number) => {
      if (!isMounted) return; // Prevent multiple calls
  
      try {
        const [geoResponse, weatherResponse, forecastResponse] = await Promise.all([
          axios.get(`/api/weather?lat=${lat}&lon=${lon}&reverse=true`), // Reverse geolocation
          axios.get(`/api/weather?lat=${lat}&lon=${lon}`), // Current weather
          axios.get(`/api/weather?lat=${lat}&lon=${lon}&forecast=true`), // Forecast
        ]);
  
        if (geoResponse.data.length > 0) {
          const location = geoResponse.data[0];
          setPlaceholder(`${location.name}, ${location.state || location.country}`);
        }
  
        onSelect(weatherResponse.data, forecastResponse.data.list);
      } catch (error) {
        console.error("Error fetching location/weather:", error);
      }
    };
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchLocationAndWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        console.warn("Geolocation not available. User must manually search.");
      },
      { timeout: 10000 }
    );
  
    return () => {
      isMounted = false; // Cleanup function to prevent multiple calls
    };
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
