/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaTimes,
  FaTemperatureHigh,
  FaWind,
} from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { IoWater } from "react-icons/io5";
import {
  getUVDescription,
  calculateFishingScore,
} from "../../utils/weatherUtils";
import FishingForecastCard from "./FishingForecastCard";
import SunMoonCard from "./SunMoonCard";
import TidesCard from "./TidesCard";
import WeatherInfoCard from "./WeatherInfoCard";
import HourlyForecastCard from "./HourlyForecastCard";
import type { WeatherHour } from "@/types/weatherTypes";

interface WeatherCardProps {
  weatherData: any;
  hourlyForecast?: WeatherHour[];
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  weatherData,
  hourlyForecast = [],
}) => {
  const [view, setView] = useState<"current" | "hourly">("current");
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const current = useMemo(
    () => weatherData?.forecast?.current || {},
    [weatherData]
  );
  const forecast = useMemo(
    () => weatherData?.marine?.forecast || { forecastday: [] },
    [weatherData]
  );
  const alerts = useMemo(() => {
    const seen = new Set<string>();
    return (weatherData?.forecast?.alerts || []).filter((alert: any) => {
      if (seen.has(alert.headline)) return false;
      seen.add(alert.headline);
      return true;
    });
  }, [weatherData]);
  const todayForecast = useMemo(
    () => forecast?.forecastday?.[0] || {},
    [forecast]
  );
  const nextDayForecast = useMemo(
    () => forecast?.forecastday?.[1] || {},
    [forecast]
  );
  const { sunrise: todaySunrise, sunset: todaySunset, moon_phase, moon_illumination, moonrise, moonset } =
    todayForecast?.astro || {};
  const { sunrise: nextDaySunrise, sunset: nextDaySunset } = nextDayForecast?.astro || {};
  const moonPhase = moon_phase || "Unknown";

  // Determine which day's tides to show based on the current time
  const tides = useMemo(() => {
    const forecastDays = forecast?.forecastday || [];
    const tidesDay1 = forecastDays[0]?.day?.tides?.[0]?.tide || [];
    const tidesDay2 = forecastDays.length >= 2 ? forecastDays[1]?.day?.tides?.[0]?.tide || [] : [];
    return [...tidesDay1, ...tidesDay2];
  }, [forecast]);

  const marineConditions = useMemo(
    () =>
      hourlyForecast?.length > 0
        ? hourlyForecast[0]
        : todayForecast?.hour?.[0] || {},
    [hourlyForecast, todayForecast]
  );

  const weatherInfo = useMemo(() => {
    const temp = current.temp_f?.toFixed(1);
    const feelsLike = current.feelslike_f?.toFixed(1);
    const waterTemp = marineConditions.water_temp_f?.toFixed(1);
    return {
      temp: temp || "N/A",
      feelsLike: feelsLike || "N/A",
      waterTemp: waterTemp || "N/A",
      pressure_mb: current.pressure_mb || "N/A",
      wind_mph: current.wind_mph || "N/A",
      wind_dir: current.wind_dir || "N/A",
      cloud: current.cloud || "N/A",
      humidity: current.humidity || "N/A",
      precip_mm:
        current.precip_mm !== undefined && current.precip_mm !== "N/A"
          ? `${current.precip_mm} mm`
          : "0%",
      uv: current.uv || "N/A",
      gust_mph: current.gust_mph || "N/A",
      vis_miles: current.vis_miles || "N/A",
    };
  }, [current, marineConditions]);

  const fishingScore = useMemo(
    () =>
      calculateFishingScore(weatherInfo, marineConditions, moonPhase, tides),
    [weatherInfo, marineConditions, moonPhase, tides]
  );

  const futureHourlyForecast = useMemo(() => {
    const currentTime = new Date();
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Get the current date in the user's timezone
    const currentDate = new Date(currentTime.toLocaleString("en-US", { timeZone: userTimeZone }));
    const currentDateString = currentDate.toLocaleDateString("en-US", {
      timeZone: userTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).split("/").reverse().join("-");

    // Get the next day's date
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    const nextDayString = nextDay.toLocaleDateString("en-US", {
      timeZone: userTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).split("/").reverse().join("-");

    // Combine hourly data from both days
    const hourlyDay1 = todayForecast?.hour || [];
    const hourlyDay2 = nextDayForecast?.hour || [];
    const combinedHourly = [...hourlyDay1, ...hourlyDay2];

    // Filter for future hours and sort by time
    const futureHours = combinedHourly
      .filter((hour: any) => {
        const hourDate = new Date(hour.time).toLocaleDateString("en-US", {
          timeZone: userTimeZone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).split("/").reverse().join("-");
        // Include only hours from the current day or next day that are in the future
        return (
          (hourDate === currentDateString || hourDate === nextDayString) &&
          new Date(hour.time) > currentTime
        );
      })
      .sort(
        (a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );

    return futureHours;
  }, [todayForecast, nextDayForecast]);

  useEffect(() => {
    if (isAlertModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
  }, [isAlertModalOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isAlertModalOpen)
        setIsAlertModalOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isAlertModalOpen]);

  if (!weatherData) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-300 p-4">
        No weather data available
      </p>
    );
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setIsAlertModalOpen(false);
  };

  return (
    <div className="relative flex flex-col gap-4 p-3 sm:p-5 rounded-xl bg-white shadow-lg dark:bg-gray-800 mt-4 sm:mt-6 w-full max-w-3xl mx-auto">
      {alerts.length > 0 && (
        <button
          onClick={() => setIsAlertModalOpen(true)}
          className="absolute top-2 right-2 text-red-500 hover:text-red-600 p-2 transition-colors"
          title="View Weather Alerts"
        >
          <FaExclamationTriangle className="text-xl sm:text-2xl" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {alerts.length}
          </span>
        </button>
      )}

      {isAlertModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={handleOverlayClick}
        >
          <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl w-full max-w-md sm:max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100 mx-2">
            <div className="flex justify-between items-center mb-4 sm:mb-6 border-b pb-2 border-gray-200 dark:border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" /> Weather
                Alerts
              </h2>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1"
              >
                <FaTimes className="text-lg sm:text-xl" />
              </button>
            </div>
            {alerts.map((alert: any, index: number) => (
              <div
                key={index}
                className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500 transition-all hover:shadow-md"
              >
                <p className="font-semibold text-red-700 dark:text-red-300 text-base sm:text-lg">
                  {alert.headline}
                </p>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 sm:mt-2 whitespace-pre-wrap">
                  {alert.desc}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Effective: {new Date(alert.effective).toLocaleString()} -
                  Expires: {new Date(alert.expires).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-2 sm:gap-4">
        <button
          onClick={() => setView("current")}
          className={`px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base transition-colors duration-200 ${
            view === "current"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Now
        </button>
        <button
          onClick={() => setView("hourly")}
          className={`px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base transition-colors duration-200 ${
            view === "hourly"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Hourly
        </button>
      </div>

      {view === "current" ? (
        <>
          <FishingForecastCard score={fishingScore} />
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <SunMoonCard
              sunrise={todaySunrise}
              sunset={todaySunset}
              moonrise={moonrise}
              moonset={moonset}
              moonPhase={moonPhase}
              moonIllumination={moon_illumination}
            />
            {tides.length > 0 && <TidesCard tides={tides} />}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            <WeatherInfoCard
              label="Temperature"
              value={weatherInfo.temp}
              icon={<FaTemperatureHigh />}
            />
            <WeatherInfoCard
              label="Feels Like"
              value={weatherInfo.feelsLike}
              icon={<FaTemperatureHigh />}
            />
            <WeatherInfoCard
              label="Water Temp"
              value={weatherInfo.waterTemp}
              icon={<IoWater />}
            />
            <WeatherInfoCard
              label="Wind"
              value={`${weatherInfo.wind_mph} mph ${weatherInfo.wind_dir}`}
              icon={<FaWind />}
            />
            <WeatherInfoCard
              label="Gusts"
              value={weatherInfo.gust_mph}
              icon={<FaWind />}
            />
            <WeatherInfoCard label="Pressure" value={weatherInfo.pressure_mb} />
            <WeatherInfoCard
              label="Precipitation"
              value={weatherInfo.precip_mm}
              icon={<IoWater />}
            />
            <WeatherInfoCard
              label="Humidity"
              value={weatherInfo.humidity}
              icon={<WiHumidity />}
            />
            <WeatherInfoCard label="Clouds" value={weatherInfo.cloud} />
            <WeatherInfoCard
              label="Swell"
              value={
                marineConditions?.swell_ht_ft
                  ? `${marineConditions.swell_ht_ft} ft (${marineConditions.swell_dir_16_point})`
                  : "N/A"
              }
            />
            <WeatherInfoCard label="Visibility" value={weatherInfo.vis_miles} />
            <WeatherInfoCard
              label="UV Index"
              value={
                weatherInfo.uv !== "N/A"
                  ? `${weatherInfo.uv} (${getUVDescription(parseFloat(weatherInfo.uv))})`
                  : "N/A"
              }
            />
          </div>
        </>
      ) : (
        <HourlyForecastCard
          forecast={futureHourlyForecast}
          todaySunrise={todaySunrise}
          todaySunset={todaySunset}
          nextDaySunrise={nextDaySunrise}
          nextDaySunset={nextDaySunset}
        />
      )}
    </div>
  );
};

export default WeatherCard;