import React, { memo, useMemo } from "react";

interface FishingForecastCardProps {
  score: number;
}

const FishingForecastCard: React.FC<FishingForecastCardProps> = memo(({ score }) => {
  const conditions = useMemo(() => {
    if (score >= 120)
      return { label: "🎣 Exceptional Fishing!", color: "text-green-700", bg: "bg-green-100" };
    if (score >= 90)
      return { label: "🎣 Great Fishing!", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 60)
      return { label: "⚖️ Decent Fishing", color: "text-yellow-500", bg: "bg-yellow-50" };
    if (score >= 30)
      return { label: "⚠️ Fair Fishing", color: "text-orange-500", bg: "bg-orange-50" };
    return { label: "🚫 Poor Fishing", color: "text-red-600", bg: "bg-red-50" };
  }, [score]);

  return (
    <div
      className={`flex flex-col items-center p-3 sm:p-4 ${conditions.bg} dark:bg-opacity-20 rounded-xl shadow-sm transition-all hover:shadow-md`}
    >
      <span className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
        Fishing Forecast
      </span>
      <span
        className={`text-xl sm:text-3xl font-bold ${conditions.color} mt-1 sm:mt-2`}
      >
        {conditions.label}
      </span>
      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
        Score: {score}/150
      </span>
    </div>
  );
});

FishingForecastCard.displayName = "FishingForecastCard";

export default FishingForecastCard;