/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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
  const [placeholder] = useState("Search for city, state, or ZIP");

  // ✅ Fetch weather based on user selection
  const fetchWeather = async (lat: number, lon: number) => {
    setIsSearching(true);
    try {
      const [currentWeather, forecast] = await Promise.all([
        axios.get(`/api/weather?lat=${lat}&lon=${lon}`), // Current weather
        axios.get(`/api/weather?lat=${lat}&lon=${lon}&forecast=true`), // Forecast
      ]);

      onSelect(currentWeather.data, forecast.data.list); // ✅ Pass both to WeatherCard
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // 🔍 Fetch City/State or ZIP Code Suggestions using API Route
  const fetchSuggestions = async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
  
    try {
      let response;
      if (/\d{5}/.test(input)) { // Check if input is a ZIP code
        response = await axios.get(`/api/weather?query=${input}`); // Fetch using ZIP code
      } else {
        response = await axios.get(`/api/weather?query=${encodeURIComponent(input)}`); // Fetch using city/state
      }
  
      // ✅ Remove duplicates by filtering unique (name + state)
      const uniqueSuggestions = response.data.reduce((acc: any[], location: any) => {
        const exists = acc.find(
          (item) => item.name === location.name && item.state === location.state
        );
        if (!exists) acc.push(location);
        return acc;
      }, []);
  
      setSuggestions(uniqueSuggestions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };
  

  // ✅ Handle User Selection
  const handleSelect = async (location: any) => {
    setQuery(`${location.name}, ${location.state || location.country}`);
    setSuggestions([]);
    fetchWeather(location.lat, location.lon); // ✅ Fetch weather for selected location
  };

  return (
    <div className="relative w-full mt-4 mb-4">
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
          {isSearching ? <ImSpinner2 className="animate-spin text-xl" /> : <IoSearch className="text-xl" />}
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
