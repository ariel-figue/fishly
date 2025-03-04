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
      const response = await axios.get(`/api/weather?lat=${lat}&lon=${lon}&forecast=true`);
      const { forecast } = response.data;

      onSelect(response.data, forecast?.hourly || []); // ✅ Ensure correct hourly forecast usage
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
      const response = await axios.get(`/api/weather?query=${encodeURIComponent(input)}`);
      // ✅ Remove duplicates by filtering unique (name + region + country)
      const uniqueSuggestions = response.data.reduce((acc: any[], location: any) => {
        const key = `${location.name}-${location.region || ''}-${location.country || ''}`;
        if (!acc.find((item) => `${item.name}-${item.region || ''}-${item.country || ''}` === key)) {
          acc.push(location);
        }
        return acc;
      }, []);

      setSuggestions(uniqueSuggestions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  // ✅ Handle User Selection
  const handleSelect = (location: any) => {
    // Construct the display string: "city, state, country" if both region and country are available
    const statePart = location.region ? `${location.region}, ` : "";
    const countryPart = location.country || "";
    const displayLocation = location.country
      ? `${location.name}, ${statePart}${countryPart}`
      : location.region
        ? `${location.name}, ${statePart}`
        : location.name;

    setQuery(displayLocation);
    setSuggestions([]);
    fetchWeather(location.lat, location.lon); // ✅ Fetch weather for selected location
  };

  // ✅ Format suggestion display as "city, state, country"
  const formatSuggestion = (location: any) => {
    const statePart = location.region ? `${location.region}, ` : "";
    const countryPart = location.country || "";
    return location.country
      ? `${location.name}, ${statePart}${countryPart}`
      : location.region
        ? `${location.name}, ${statePart}`
        : location.name;
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
          disabled={isSearching || suggestions.length === 0}
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
              {formatSuggestion(location)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;