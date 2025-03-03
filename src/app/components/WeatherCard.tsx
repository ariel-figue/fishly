/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";

export const WeatherCard = ({
  weatherData,
  hourlyForecast = [],
  isDesktopOrLaptop,
}: {
  weatherData: any;
  hourlyForecast?: any[];
  isDesktopOrLaptop: boolean;
}) => {
  // 🔄 Toggle between Current Weather & Hourly Forecast
  const [view, setView] = useState<"current" | "hourly">("current");

  if (!weatherData)
    return <p className="text-center">No weather data available.</p>;

  const { main, weather, wind, clouds, visibility, sys } = weatherData || {};
  const { temp, humidity, pressure } = main || {};
  const { description, icon } = weather?.[0] || {};
  const { speed, deg, gust } = wind || {};
  const { all: cloudCover } = clouds || {};
  const visibilityMiles = visibility
    ? (visibility / 1609.34).toFixed(1)
    : "N/A";
  const sunriseTime = sys?.sunrise
    ? new Date(sys.sunrise * 1000).toLocaleTimeString()
    : "N/A";
  const sunsetTime = sys?.sunset
    ? new Date(sys.sunset * 1000).toLocaleTimeString()
    : "N/A";

  // 🧭 Convert Wind Degrees to Compass Direction
  const getWindDirection = (angle: number) => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    return directions[Math.round(angle / 22.5) % 16] || "N/A";
  };

  // 🎣 Calculate Fishing Conditions Score
  const calculateFishingScore = () => {
    let score = 100;

    if (speed && speed > 20) score -= 40;
    else if (speed && speed > 15) score -= 25;
    else if (speed && speed > 10) score -= 10;

    if (cloudCover !== undefined && (cloudCover < 20 || cloudCover > 80))
      score -= 15;

    if (temp !== undefined && (temp < 40 || temp > 85)) score -= 20;
    else if (temp !== undefined && (temp < 50 || temp > 80)) score -= 10;

    if (pressure !== undefined && pressure > 1020) score -= 10;
    else if (pressure !== undefined && pressure < 1010) score += 10;

    const now = new Date().getHours();
    const sunrise = sys?.sunrise ? new Date(sys.sunrise * 1000).getHours() : 6;
    const sunset = sys?.sunset ? new Date(sys.sunset * 1000).getHours() : 18;

    if (now >= sunrise - 1 && now <= sunrise + 2) score += 10;
    if (now >= sunset - 2 && now <= sunset + 1) score += 10;

    return Math.max(0, Math.min(100, score));
  };

  const fishingScore = calculateFishingScore();

  const getFishingConditions = () => {
    if (fishingScore >= 80)
      return { label: "🎣 Ideal", color: "text-green-600" };
    if (fishingScore >= 50) return { label: "⚖️ OK", color: "text-yellow-500" };
    if (fishingScore >= 30)
      return { label: "⚠️ Not Great", color: "text-orange-500" };
    return { label: "🚫 Poor", color: "text-red-600" };
  };

  const fishingConditions = getFishingConditions();

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-white shadow-lg dark:bg-gray-800 mt-8 lg:min-w-[600px] lg:max-w-full">
      {/* 🔘 Toggle Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setView("current")}
          className={`px-4 py-2 rounded-md ${
            view === "current"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
          }`}
        >
          Current Conditions
        </button>
        <button
          onClick={() => setView("hourly")}
          className={`px-4 py-2 rounded-md ${
            view === "hourly"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
          }`}
        >
          Hourly Forecast
        </button>
      </div>

      {view === "current" ? (
        <>
          {/* 🌤️ Weather Icon & Description */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon && (
                <Image
                  src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt={description || "Weather Icon"}
                  width={50}
                  height={50}
                />
              )}
              <div className="text-lg font-semibold mr-2 capitalize">
                {description || "No description"}
              </div>
            </div>
          </div>

          {/* 🎣 Fishing Score */}
          <div className="flex flex-col items-center p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Fishing Conditions:
            </span>
            <span className={`text-2xl font-bold ${fishingConditions.color}`}>
              {fishingConditions.label}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Score: {fishingScore}/100
            </span>
          </div>

          {/* 📊 Weather Data */}
          <div
            className={`grid ${
              isDesktopOrLaptop ? "grid-cols-4" : "grid-cols-2"
            } gap-4`}
          >
            {[
              {
                label: "Temperature",
                value: temp ? `${Math.round(temp)}°F` : "N/A",
              },
              { label: "Humidity", value: humidity ? `${humidity}%` : "N/A" },
              {
                label: "Pressure",
                value: pressure ? `${pressure} hPa` : "N/A",
              },
              { label: "Wind Speed", value: speed ? `${speed} mph` : "N/A" },
              { label: "Wind Gusts", value: gust ? `${gust} mph` : "N/A" },
              {
                label: "Wind Direction",
                value: deg ? `${deg}° (${getWindDirection(deg)})` : "N/A",
              },
              {
                label: "Cloud Cover",
                value: cloudCover !== undefined ? `${cloudCover}%` : "N/A",
              },
              { label: "Visibility", value: `${visibilityMiles} miles` },
              { label: "Sunrise", value: sunriseTime },
              { label: "Sunset", value: sunsetTime },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col text-center p-2 bg-gray-200 rounded-lg dark:bg-gray-700"
              >
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  {label}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="overflow-x-auto">
          {hourlyForecast.length > 0 ? (
            <div>
              <div className="hidden sm:block">
                {" "}
                {/* Show table only on larger screens */}
                <table className="min-w-full divide-y bg-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 text-center">
                      <th className="p-2">Time</th>
                      <th className="p-2">Temp (°F)</th>
                      <th className="p-2">Wind Speed</th>
                      <th className="p-2">Conditions</th>
                      <th className="p-2">Precipitation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hourlyForecast
                      .slice(0, 6)
                      .map((hour: any, index: number) => (
                        <tr
                          key={index}
                          className="text-center border-t dark:border-gray-500 text-left"
                        >
                          <td className="p-2">
                            {new Date(hour.dt * 1000).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="p-2">
                            {Math.round(hour.main.temp)}°F
                          </td>
                          <td className="p-2">
                            {Math.round(hour.wind.speed)} mph
                          </td>
                          <td className="p-2 capitalize flex justify-between items-center">
                            {hour.weather[0]?.icon && (
                              <Image
                                src={`http://openweathermap.org/img/wn/${hour.weather[0]?.icon}@2x.png`}
                                alt={
                                  hour.weather[0]?.description || "Weather Icon"
                                }
                                width={25}
                                height={25}
                              />
                            )}
                            <span className="capitalize flex ml-2">
                              {hour.weather[0]?.description || "N/A"}
                            </span>
                          </td>
                          <td className="p-2">
                            {hour.pop !== undefined
                              ? `${Math.round(hour.pop * 100)}%`
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="block sm:hidden space-y-4">
                {hourlyForecast.slice(0, 6).map((hour: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-200 dark:bg-gray-400 rounded-lg shadow-md"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Time:
                      </span>
                      <span>
                        {new Date(hour.dt * 1000).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Temp:
                      </span>
                      <span>{Math.round(hour.main.temp)}°F</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Wind Speed:
                      </span>
                      <span>{Math.round(hour.wind.speed)} mph</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Conditions:
                      </span>
                      {hour.weather[0]?.icon && (
                        <Image
                          src={`http://openweathermap.org/img/wn/${hour.weather[0]?.icon}@2x.png`}
                          alt={hour.weather[0]?.description || "Weather Icon"}
                          width={25}
                          height={25}
                        />
                      )}
                      <span className="capitalize flex ml-2">
                        {hour.weather[0]?.description || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Precipitation:
                      </span>
                      <span>
                        {hour.pop !== undefined
                          ? `${Math.round(hour.pop * 100)}%`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No hourly forecast available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
