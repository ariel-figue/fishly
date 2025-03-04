import React, { memo, useMemo } from "react";
import { formatTimeTo12Hour } from "../../utils/weatherUtils";

interface Tide {
  tide_time: string;
  tide_height_mt: string;
  tide_type: string;
}

interface TidesCardProps {
  tides: Tide[];
}

const TidesCard: React.FC<TidesCardProps> = memo(({ tides }) => {
  const relevantTides = useMemo(() => {
    const now = new Date();
    const pastTides = tides
      .filter((tide) => new Date(tide.tide_time) <= now)
      .sort(
        (a, b) => new Date(b.tide_time).getTime() - new Date(a.tide_time).getTime()
      );
    const futureTides = tides
      .filter((tide) => new Date(tide.tide_time) > now)
      .sort(
        (a, b) => new Date(a.tide_time).getTime() - new Date(b.tide_time).getTime()
      );
    const mostRecentPastTide = pastTides[0];
    return mostRecentPastTide ? [mostRecentPastTide, ...futureTides] : futureTides;
  }, [tides]);

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 rounded-xl shadow-sm transition-all hover:shadow-md">
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 sm:mb-3">
        Today&apos;s Tides
      </h3>
      <ul className="text-xs sm:text-sm space-y-2">
        {relevantTides.length > 0 ? (
          relevantTides.map((tide, index) => (
            <li key={index} className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                {formatTimeTo12Hour(tide.tide_time)}
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {tide.tide_type} ({tide.tide_height_mt}m)
              </span>
            </li>
          ))
        ) : (
          <li className="text-gray-600 dark:text-gray-300">
            No relevant tides available
          </li>
        )}
      </ul>
    </div>
  );
});

TidesCard.displayName = "TidesCard";

export default TidesCard;