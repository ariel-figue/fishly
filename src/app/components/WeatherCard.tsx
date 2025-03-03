import Image from "next/image";

export const WeatherCard = ({
  weatherData,
  isDesktopOrLaptop,
}: {
  weatherData: any;
  isDesktopOrLaptop: boolean;
}) => {
  const { main, weather, wind, clouds, visibility, sys } = weatherData;
  const { temp, humidity, pressure } = main;
  const { description, icon } = weather[0];
  const { speed, deg, gust } = wind;
  const { all: cloudCover } = clouds;
  const visibilityMiles = (visibility / 1609.34).toFixed(1);
  const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString();
  const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString();

  // 🧭 Convert Wind Degrees to Compass Direction
  const getWindDirection = (angle: number) => {
    const directions = [
      "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
      "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
    ];
    return directions[Math.round(angle / 22.5) % 16];
  };

  // 🎣 Calculate Fishing Conditions Score
  const calculateFishingScore = () => {
    let score = 100;

    // 📉 **Wind Speed (Ideal < 10 mph)**
    if (speed > 20) score -= 40; // Too windy
    else if (speed > 15) score -= 25;
    else if (speed > 10) score -= 10;

    // ☁️ **Cloud Cover (Ideal 30-70%)**
    if (cloudCover < 20 || cloudCover > 80) score -= 15;

    // 🌡️ **Temperature (Ideal: 50-80°F)**
    if (temp < 40 || temp > 85) score -= 20;
    else if (temp < 50 || temp > 80) score -= 10;

    // 📊 **Pressure (Fish bite better when falling)**
    if (pressure > 1020) score -= 10; // High pressure → Less active fish
    else if (pressure < 1010) score += 10; // Low pressure → More active fish

    // 🌅 **Better at Dawn & Dusk**
    const now = new Date().getHours();
    const sunrise = new Date(sys.sunrise * 1000).getHours();
    const sunset = new Date(sys.sunset * 1000).getHours();
    if (now >= sunrise - 1 && now <= sunrise + 2) score += 10; // Dawn
    if (now >= sunset - 2 && now <= sunset + 1) score += 10; // Dusk

    return Math.max(0, Math.min(100, score)); // Keep between 0-100
  };

  const fishingScore = calculateFishingScore();

  // 🏆 Determine Fishing Conditions
  const getFishingConditions = () => {
    if (fishingScore >= 80) return { label: "🎣 Ideal", color: "text-green-600" };
    if (fishingScore >= 50) return { label: "⚖️ OK", color: "text-yellow-500" };
    if (fishingScore >= 30) return { label: "⚠️ Not Great", color: "text-orange-500" };
    return { label: "🚫 Poor", color: "text-red-600" };
  };

  const fishingConditions = getFishingConditions();

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-white shadow-lg dark:bg-gray-800 mt-8">
      {/* 🌤️ Weather Icon & Description */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
            width={50}
            height={50}
          />
          <div className="text-lg font-semibold mr-2 capitalize">
            {description}
          </div>
        </div>
      </div>

      {/* 🎣 Fishing Score */}
      <div className="flex flex-col items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
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
      <div className={`grid ${isDesktopOrLaptop ? "grid-cols-3" : "grid-cols-2"} gap-4`}>
        {[
          { label: "Temperature", value: `${temp}°F` },
          { label: "Humidity", value: `${humidity}%` },
          { label: "Pressure", value: `${pressure} hPa` },
          { label: "Wind Speed", value: `${speed} mph` },
          { label: "Wind Gusts", value: gust ? `${gust} mph` : "N/A" },
          { label: "Wind Direction", value: `${deg}° (${getWindDirection(deg)})` },
          { label: "Cloud Cover", value: `${cloudCover}%` },
          { label: "Visibility", value: `${visibilityMiles} miles` },
          { label: "Sunrise", value: sunriseTime },
          { label: "Sunset", value: sunsetTime },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col text-center p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              {label}
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
