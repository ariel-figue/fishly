import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let lat = searchParams.get("lat");
  let lon = searchParams.get("lon");
  const query = searchParams.get("query"); // ✅ City/ZIP query
  const forecast = searchParams.get("forecast"); // ✅ Fetch forecast if present
  const weatherApiKey = process.env.WEATHERAPI_KEY; // ✅ WeatherAPI key

  if (!weatherApiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  try {
    let responseData;

    if (query) {
      // ✅ Autocomplete for location search
      const searchResponse = await axios.get(
        `https://api.weatherapi.com/v1/search.json?key=${weatherApiKey}&q=${query}`
      );
      return NextResponse.json(searchResponse.data);
    }

    if (!lat || !lon) {
      // ✅ Get user geolocation based on IP
      const geoResponse = await axios.get(
        `https://api.weatherapi.com/v1/ip.json?key=${weatherApiKey}&q=auto:ip`
      );
      lat = geoResponse.data.lat;
      lon = geoResponse.data.lon;
    }

    if (lat && lon) {
      // ✅ Fetch Marine Weather
      const marineResponse = await axios.get(
        `https://api.weatherapi.com/v1/marine.json?key=${weatherApiKey}&q=${lat},${lon}&days=1`
      );

      // ✅ Fetch Land-Based Forecast & Alerts
      const forecastResponse = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${lat},${lon}&days=3&alerts=yes&hour=24`
      );

      // ✅ Fetch Moon Info
      const todayDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const astronomyResponse = await axios.get(
        `https://api.weatherapi.com/v1/astronomy.json?key=${weatherApiKey}&q=${lat},${lon}&dt=${todayDate}`
      );

      responseData = {
        location: forecastResponse.data.location,
        geolocation: {
          lat,
          lon,
          city: forecastResponse.data.location.name,
          region: forecastResponse.data.location.region,
          country: forecastResponse.data.location.country,
        },
        marine: marineResponse.data,
        forecast: {
          current: forecastResponse.data.current,
          alerts: forecastResponse.data.alerts?.alert || [],
          daily: forecastResponse.data.forecast.forecastday, // ✅ Daily forecast
          hourly: forecastResponse.data.forecast.forecastday.flatMap((day) => day.hour), // ✅ Hourly forecast
        },
        moon: astronomyResponse.data.astronomy.astro,
      };
    } else {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch data",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
