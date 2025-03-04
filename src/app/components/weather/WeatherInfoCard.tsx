import React, { memo, JSX } from "react";

interface WeatherInfoCardProps {
  label: string;
  value: string;
  icon?: JSX.Element;
}

const WeatherInfoCard: React.FC<WeatherInfoCardProps> = memo(({ label, value, icon }) => (
  <div className="flex flex-col items-center p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-center shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center justify-center">
      {icon && (
        <span className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mr-1">
          {icon}
        </span>
      )}
      <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
        {label}
      </span>
    </div>
    <span className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mt-1 break-words max-w-full">
      {value}
    </span>
  </div>
));

WeatherInfoCard.displayName = "WeatherInfoCard";

export default WeatherInfoCard;