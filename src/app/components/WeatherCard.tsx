import Image from "next/image";

export const WeatherCard = ({
  weatherData,
  isDesktopOrLaptop,
}: {
  weatherData: never;
  isDesktopOrLaptop: boolean;
}) => {
  const { main, weather, wind, clouds } = weatherData;
  const { temp, humidity } = main;
  const { description, icon } = weather[0];
  const { speed } = wind;
  const { all } = clouds;

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-white shadow-lg dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
            width={50}
            height={50}
          />
          <div className="text-lg font-semibold">{description}</div>
        </div>
        {isDesktopOrLaptop && (
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold">{temp}°F</div>
            <div className="text-lg font-semibold">{humidity}%</div>
            <div className="text-lg font-semibold">{speed}mph</div>
            <div className="text-lg font-semibold">{all}%</div>
          </div>
        )}
      </div>
      {!isDesktopOrLaptop && (
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold">{temp}°F</div>
          <div className="text-lg font-semibold">{humidity}%</div>
          <div className="text-lg font-semibold">{speed}mph</div>
          <div className="text-lg font-semibold">{all}%</div>
        </div>
      )}
    </div>
  );
};
