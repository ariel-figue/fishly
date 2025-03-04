import React, { memo, useMemo } from "react";
import Image from "next/image";
import { IoWater } from "react-icons/io5";
import { FaWind } from "react-icons/fa";
import { WiSunrise, WiSunset } from "react-icons/wi";
import { formatTimeTo12Hour } from "../../utils/weatherUtils";

interface Condition {
  icon: string;
  text: string;
}

interface ForecastEntry {
  type: "hourly" | "sunrise" | "sunset";
  time: string;
  is_day?: number; // Optional for sunrise/sunset
  precip_mm?: number; // Optional for sunrise/sunset
  temp_f?: number; // Optional for sunrise/sunset
  condition?: Condition; // Optional for sunrise/sunset
  wind_mph?: number; // Optional for sunrise/sunset
}

interface HourlyForecastCardProps {
  forecast: ForecastEntry[];
  todaySunrise?: string;
  todaySunset?: string;
  nextDaySunrise?: string;
  nextDaySunset?: string;
  timeZone?: string;
}

/**
 * Combines a date (YYYY-MM-DD) with a time (HH:MM AM/PM) into a Date object in the specified time zone.
 * @param date - Date string in YYYY-MM-DD format
 * @param time - Time string in "HH:MM AM/PM" format
 * @param timeZone - The time zone to interpret the date/time in
 * @returns Date object or null if parsing fails
 */
const parseTimeToDate = (
  date: string,
  time: string,
  _: string
): Date | null => {
  const [hoursMinutes, period] = time.split(" ");
  const [hours, minutes] = hoursMinutes.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes) || !period) {
    console.error(`Invalid time format: ${time}`);
    return null;
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
  if (Number.isNaN(dateTime.getTime())) {
    console.error(`Invalid date constructed: ${dateTimeString}`);
    return null;
  }

  return dateTime;
};

const HourlyForecastCard: React.FC<HourlyForecastCardProps> = memo(
  ({
    forecast = [],
    todaySunrise,
    todaySunset,
    nextDaySunrise,
    nextDaySunset,
    timeZone = "America/New_York",
  }) => {
    const limitedForecast = useMemo(() => {
      const currentTime = new Date();
      const sunriseSunsetEvents: ForecastEntry[] = [];

      if (!forecast.length) {
        return [];
      }

      const firstForecastDate = new Date(forecast[0].time);
      const today = new Date(firstForecastDate);
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const todayStr = today.toISOString().split("T")[0];
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      if (todaySunrise) {
        const todaySunriseDate = parseTimeToDate(
          todayStr,
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
          todayStr,
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

      if (nextDaySunrise) {
        const nextDaySunriseDate = parseTimeToDate(
          tomorrowStr,
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
          tomorrowStr,
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

      const combinedEntries: ForecastEntry[] = [
        ...forecast,
        ...sunriseSunsetEvents,
      ];
      combinedEntries.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );
      return combinedEntries.slice(0, 12);
    }, [
      forecast,
      todaySunrise,
      todaySunset,
      nextDaySunrise,
      nextDaySunset,
      timeZone,
    ]);

    if (!limitedForecast.length) {
      return (
        <p className="text-center text-gray-600 dark:text-gray-400 p-2 sm:p-5">
          No future hourly forecast available
        </p>
      );
    }

    return (
      <div className="p-2 sm:p-5 w-full">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1 sm:mb-3">
          Hourly Forecast
        </h3>
        <div className="relative">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <div className="flex flex-nowrap gap-2 snap-x snap-mandatory w-[80vw]">
              {limitedForecast.map((entry, index) => {
                const formattedTime = formatTimeTo12Hour(entry.time);

                if (entry.type === "sunrise" || entry.type === "sunset") {
                  const isSunrise = entry.type === "sunrise";
                  return (
                    <div
                      key={index}
                      className={`flex-shrink-0 snap-start bg-gray-100 dark:bg-gray-700 p-1.5 sm:p-3 rounded-xl w-16 sm:w-32 flex flex-col items-center transition-all hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-[#ecb510] bg-opacity-90 border-l-2 sm:border-l-4 border-[#ecb510]`}
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
                }

                const isDay = entry.is_day ?? 1;
                const hasPrecip = (entry.precip_mm ?? 0) > 0;
                const tempF = entry.temp_f ?? 0;
                const condition = entry.condition ?? { icon: "", text: "" };
                const windMph = entry.wind_mph ?? 0;

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
                      {formattedTime}
                    </span>
                    <Image
                      src={`https:${condition.icon}`}
                      alt={condition.text}
                      width={24}
                      height={24}
                      className="my-0.5 sm:my-2 w-6 h-6 sm:w-10 sm:h-10"
                    />
                    <span className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {Math.round(tempF)}°F
                    </span>
                    <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 flex flex-col items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                      <span className="flex items-center">
                        <IoWater className="mr-0.5 sm:mr-1 text-blue-500 text-[10px] sm:text-xs" />
                        {hasPrecip ? `${entry.precip_mm} mm` : "0%"}
                      </span>
                      <span className="flex items-center">
                        <FaWind className="mr-0.5 sm:mr-1 text-gray-500 text-[10px] sm:text-xs" />
                        {Math.round(windMph)} mph
                      </span>
                    </div>
                  </div>
                );
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
