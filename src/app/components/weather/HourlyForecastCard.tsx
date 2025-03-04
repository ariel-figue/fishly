import React, { memo } from "react";
import Image from "next/image";
import { IoWater } from "react-icons/io5";
import { FaWind } from "react-icons/fa";
import { formatTimeTo12Hour } from "../../utils/weatherUtils";

interface HourlyForecastItem {
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

interface HourlyForecastCardProps {
  forecast: HourlyForecastItem[];
}

const HourlyForecastCard: React.FC<HourlyForecastCardProps> = memo(({ forecast }) => {
  if (forecast.length === 0) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-400 p-4">
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
          <div className="flex flex-nowrap gap-2 snap-x snap-mandatory">
            {forecast.map((hour, index) => {
              const isDay = hour.is_day === 1;
              const hasPrecip = hour.precip_mm > 0;
              return (
                <div
                  key={index}
                  className={`flex-shrink-0 snap-start bg-gray-100 dark:bg-gray-700 p-1.5 sm:p-3 rounded-xl w-16 sm:w-32 flex flex-col items-center transition-all hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDay ? "bg-opacity-90" : "bg-opacity-70"
                  } ${hasPrecip ? "border-l-2 sm:border-l-4 border-blue-400" : ""}`}
                >
                  <span className="text-[10px] sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                    {formatTimeTo12Hour(hour.time)}
                  </span>
                  <Image
                    src={`https:${hour.condition.icon}`}
                    alt={hour.condition.text}
                    width={24}
                    height={24}
                    className="my-0.5 sm:my-2 w-6 h-6 sm:w-10 sm:h-10"
                  />
                  <span className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {Math.round(hour.temp_f)}°F
                  </span>
                  <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 flex flex-col items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                    <span className="flex items-center">
                      <IoWater className="mr-0.5 sm:mr-1 text-blue-500 text-[10px] sm:text-xs" />
                      {hasPrecip ? `${hour.precip_mm} mm` : "0%"}
                    </span>
                    <span className="flex items-center">
                      <FaWind className="mr-0.5 sm:mr-1 text-gray-500 text-[10px] sm:text-xs" />
                      {Math.round(hour.wind_mph)} mph
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
});

HourlyForecastCard.displayName = "HourlyForecastCard";

export default HourlyForecastCard;