import React, { memo, useMemo } from "react";
import { GiWaveCrest } from "react-icons/gi";
import { formatTimeTo12Hour } from "../../utils/weatherUtils";
import type { Tide } from "@/types/weatherTypes";

interface TidesCardProps {
  tides: Tide[];
}

const TidesCard: React.FC<TidesCardProps> = memo(({ tides }) => {
  const relevantTides = useMemo(() => {
    const now = new Date();

    // Sort all tides chronologically
    const sortedTides = tides.sort(
      (a, b) =>
        new Date(a.tide_time).getTime() - new Date(b.tide_time).getTime()
    );

    // Find the most recent past tide (the last tide before now)
    const pastTides = sortedTides
      .filter((tide) => new Date(tide.tide_time) <= now)
      .sort(
        (a, b) =>
          new Date(b.tide_time).getTime() - new Date(a.tide_time).getTime()
      );
    const mostRecentPastTide = pastTides[0];

    // Find future tides (after now)
    const futureTides = sortedTides
      .filter((tide) => new Date(tide.tide_time) > now)
      .sort(
        (a, b) =>
          new Date(a.tide_time).getTime() - new Date(b.tide_time).getTime()
      );

    // If there's a past tide, include it and take the next 3 future tides
    if (mostRecentPastTide) {
      const nextThreeFutureTides = futureTides.slice(0, 3);
      return [mostRecentPastTide, ...nextThreeFutureTides];
    } else {
      // If no past tide, take the first 4 future tides
      return futureTides.slice(0, 4);
    }
  }, [tides]);

  const formatTideTimeWithDate = (tideTime: string) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    const today = new Date(
      now.toLocaleString("en-US", { timeZone: userTimeZone })
    );
    const todayFormatted = today
      .toLocaleDateString("en-US", {
        timeZone: userTimeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split("/")
      .reverse()
      .join("-"); // e.g., "2025-03-04"

    const tide = new Date(tideTime);
    const tideDate = tide
      .toLocaleDateString("en-US", {
        timeZone: userTimeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split("/")
      .reverse()
      .join("-"); // e.g., "2025-03-03"

    const formattedTime = formatTimeTo12Hour(tideTime);

    if (todayFormatted === tideDate) {
      return formattedTime;
    } else {
      const [_, day, month] = tideDate.split("-");
      const formattedDate = `${month}/${day}`;
      return `${formattedTime} (${formattedDate})`;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 rounded-xl shadow-sm transition-all hover:shadow-md">
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 sm:mb-3 flex items-center gap-2">
        <GiWaveCrest className="text-blue-500" /> Tide Schedule
      </h3>
      <ul className="text-xs sm:text-sm space-y-2">
        {relevantTides.length > 0 ? (
          relevantTides.map((tide, index) => (
            <li key={index} className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                {formatTideTimeWithDate(tide.tide_time)}
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {tide.tide_type} ({tide.tide_height_mt}m)
              </span>
            </li>
          ))
        ) : (
          <li className="text-gray-600 dark:text-gray-300">
            No tide data available
          </li>
        )}
      </ul>
    </div>
  );
});

TidesCard.displayName = "TidesCard";

export default TidesCard;
