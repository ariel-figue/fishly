/* eslint-disable no-unused-vars, no-undef */
import React, { memo } from "react";
import Image from "next/image";
import { IoWater } from "react-icons/io5";
import { FaWind } from "react-icons/fa";
import { WiSunrise, WiSunset } from "react-icons/wi";
import { formatTimeTo12Hour } from "../../utils/weatherUtils";

interface HourlyForecastItem {
  type: "hourly"; // Discriminator for hourly forecast entries
  time: string;
  is_day: number;
  precip_mm: number;
  temp_f: number;
  condition: {
    icon: string;
    text: string;
  };
  wind_mph: number;
}

interface SunriseSunsetItem {
  type: "sunrise" | "sunset"; // Discriminator for sunrise/sunset events
  time: string; // ISO string format (e.g., "2025-03-03T06:42:00")
}

type ForecastEntry = HourlyForecastItem | SunriseSunsetItem;

interface HourlyForecastCardProps {
  forecast: HourlyForecastItem[];
  todaySunrise?: string; // e.g., "06:42 AM"
  todaySunset?: string; // e.g., "06:24 PM"
  nextDaySunrise?: string;
  nextDaySunset?: string;
}

const parseTimeToDate = (
  date: string,
  time: string,
  _: string
): Date | null => {
  const [hoursMinutes, period] = time.split(" ");
  const [hours, minutes] = hoursMinutes.split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes) || !period) {
    return null; // Invalid time format
  }

  let adjustedHours = hours;
  if (period.toUpperCase() === "PM" && hours !== 12) {
    adjustedHours += 12;
  } else if (period.toUpperCase() === "AM" && hours === 12) {
    adjustedHours = 0;
  }

  const dateTimeString = `${date}T${adjustedHours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
  const dateTime = new Date(dateTimeString);
  if (isNaN(dateTime.getTime())) {
    return null; // Invalid date
  }

  return dateTime;
};

const HourlyForecastCard: React.FC<HourlyForecastCardProps> = memo(
  ({ forecast, todaySunrise, todaySunset, nextDaySunrise, nextDaySunset }) => {
    if (forecast.length === 0) {
      return (
        <p className="text-center text-gray-600 dark:text-gray-400 p-2 sm:p-5">
          No future hourly forecast available
        </p>
      );
    }

    // Create sunrise/sunset events
    const sunriseSunsetEvents: SunriseSunsetItem[] = [];
    const currentTime = new Date();
    const timeZone = "America/New_York"; // As per marine data

    // Add today’s sunrise and sunset (March 3)
    if (todaySunrise) {
      const todaySunriseDate = parseTimeToDate(
        "2025-03-03",
        todaySunrise,
        timeZone
      );
      if (todaySunriseDate && todaySunriseDate > currentTime) {
        sunriseSunsetEvents.push({
          type: "sunrise",
          time: todaySunriseDate.toISOString(),
        });
      }
    }
    if (todaySunset) {
      const todaySunsetDate = parseTimeToDate(
        "2025-03-03",
        todaySunset,
        timeZone
      );
      if (todaySunsetDate && todaySunsetDate > currentTime) {
        sunriseSunsetEvents.push({
          type: "sunset",
          time: todaySunsetDate.toISOString(),
        });
      }
    }

    // Add next day’s sunrise and sunset (March 4)
    if (nextDaySunrise) {
      const nextDaySunriseDate = parseTimeToDate(
        "2025-03-04",
        nextDaySunrise,
        timeZone
      );
      if (nextDaySunriseDate && nextDaySunriseDate > currentTime) {
        sunriseSunsetEvents.push({
          type: "sunrise",
          time: nextDaySunriseDate.toISOString(),
        });
      }
    }
    if (nextDaySunset) {
      const nextDaySunsetDate = parseTimeToDate(
        "2025-03-04",
        nextDaySunset,
        timeZone
      );
      if (nextDaySunsetDate && nextDaySunsetDate > currentTime) {
        sunriseSunsetEvents.push({
          type: "sunset",
          time: nextDaySunsetDate.toISOString(),
        });
      }
    }

    // Combine hourly forecast entries with sunrise/sunset events
    const combinedEntries: ForecastEntry[] = [
      ...forecast, // Already filtered for future hours in WeatherCard
      ...sunriseSunsetEvents,
    ];

    // Sort all entries by time
    const sortedEntries = combinedEntries.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    // Take the first 12 entries
    const limitedForecast = sortedEntries.slice(0, 12);

    return (
      <div className="p-2 sm:p-5 w-full">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1 sm:mb-3">
          Hourly Forecast
        </h3>
        <div className="relative">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <div className="flex flex-nowrap gap-2 snap-x snap-mandatory w-[80vw]">
              {limitedForecast.map((entry, index) => {
                if (entry.type === "sunrise" || entry.type === "sunset") {
                  // Render sunrise/sunset entry
                  const isSunrise = entry.type === "sunrise";
                  const formattedTime = formatTimeTo12Hour(entry.time);

                  return (
                    <div
                      key={index}
                      className="flex-shrink-0 snap-start bg-gray-100 dark:bg-gray-700 p-1.5 sm:p-3 rounded-xl w-16 sm:w-32 flex flex-col items-center transition-all hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-opacity-90"
                    >
                      <span className="text-[10px] sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                        {formattedTime}
                      </span>
                      {isSunrise ? (
                        <WiSunrise
                          className="text-yellow-500 my-0.5 sm:my-2 w-6 h-6 sm:w-10 sm:h-10"
                          title="Sunrise"
                        />
                      ) : (
                        <WiSunset
                          className="text-orange-500 my-0.5 sm:my-2 w-6 h-6 sm:w-10 sm:h-10"
                          title="Sunset"
                        />
                      )}
                      <span className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {isSunrise ? "Sunrise" : "Sunset"}
                      </span>
                    </div>
                  );
                } else {
                  // Render regular hourly forecast entry
                  const isDay = entry.is_day === 1;
                  const hasPrecip = entry.precip_mm > 0;
                  const hourFormatted = formatTimeTo12Hour(entry.time);

                  return (
                    <div
                      key={index}
                      className={`flex-shrink-0 snap-start bg-gray-100 dark:bg-gray-700 p-1.5 sm:p-3 rounded-xl w-16 sm:w-32 flex flex-col items-center transition-all hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDay ? "bg-opacity-90" : "bg-opacity-70"
                      } ${
                        hasPrecip
                          ? "border-l-2 sm:border-l-4 border-blue-400"
                          : ""
                      }`}
                    >
                      <span className="text-[10px] sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                        {hourFormatted}
                      </span>
                      <Image
                        src={`https:${entry.condition.icon}`}
                        alt={entry.condition.text}
                        width={24}
                        height={24}
                        className="my-0.5 sm:my-2 w-6 h-6 sm:w-10 sm:h-10"
                      />
                      <span className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {Math.round(entry.temp_f)}°F
                      </span>
                      <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 flex flex-col items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                        <span className="flex items-center">
                          <IoWater className="mr-0.5 sm:mr-1 text-blue-500 text-[10px] sm:text-xs" />
                          {hasPrecip ? `${entry.precip_mm} mm` : "0%"}
                        </span>
                        <span className="flex items-center">
                          <FaWind className="mr-0.5 sm:mr-1 text-gray-500 text-[10px] sm:text-xs" />
                          {Math.round(entry.wind_mph)} mph
                        </span>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
          <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-white dark:from-gray-800 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none" />
        </div>
      </div>
    );
  }
);

HourlyForecastCard.displayName = "HourlyForecastCard";

export default HourlyForecastCard;
