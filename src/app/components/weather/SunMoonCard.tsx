import React, { memo, JSX } from "react";
import { WiSunrise, WiSunset, WiMoonrise, WiMoonset } from "react-icons/wi";
import { FaMoon } from "react-icons/fa";

// Moon phase icons with FaMoon
const moonIcons: { [key: string]: JSX.Element } = {
  "New Moon": <FaMoon className="text-gray-500" />,
  "Waxing Crescent": <FaMoon className="text-yellow-400" />,
  "First Quarter": <FaMoon className="text-yellow-500" />,
  "Waxing Gibbous": <FaMoon className="text-yellow-600" />,
  "Full Moon": <FaMoon className="text-white" />,
  "Waning Gibbous": <FaMoon className="text-yellow-600" />,
  "Last Quarter": <FaMoon className="text-yellow-500" />,
  "Waning Crescent": <FaMoon className="text-yellow-400" />,
  unknown: <FaMoon className="text-gray-400" />,
};

interface SunMoonCardProps {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moonPhase: string;
  moonIllumination: string;
}

const SunMoonCard: React.FC<SunMoonCardProps> = memo(
  ({ sunrise, sunset, moonrise, moonset, moonPhase, moonIllumination }) => (
    <div className="bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 rounded-xl shadow-sm transition-all hover:shadow-md">
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 sm:mb-3">
        Sun & Moon
      </h3>
      <div className="space-y-3 sm:space-y-4">
        {/* Sun and Moon Times */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          {/* Sun Times (Sunrise and Sunset stacked on mobile) */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <WiSunrise className="text-xl sm:text-2xl text-orange-500 mr-2" />
              <span className="text-sm sm:text-base">Sunrise: {sunrise || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <WiSunset className="text-xl sm:text-2xl text-purple-500 mr-2" />
              <span className="text-sm sm:text-base">Sunset: {sunset || "N/A"}</span>
            </div>
          </div>

          {/* Moon Times (Moonrise and Moonset stacked on mobile) */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <WiMoonrise className="text-xl sm:text-2xl text-yellow-400 mr-2" />
              <span className="text-sm sm:text-base">Moonrise: {moonrise || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <WiMoonset className="text-xl sm:text-2xl text-yellow-600 mr-2" />
              <span className="text-sm sm:text-base">Moonset: {moonset || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Moon Phase and Illumination */}
        <div className="flex items-center justify-center text-sm sm:text-base">
          {moonIcons[moonPhase] || moonIcons["unknown"]}
          <span className="ml-2">{moonPhase} ({moonIllumination || "N/A"}% Illuminated)</span>
        </div>
      </div>
    </div>
  )
);

SunMoonCard.displayName = "SunMoonCard";

export default SunMoonCard;