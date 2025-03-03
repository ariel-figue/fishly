import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const query = searchParams.get("query"); // ✅ New query param for city/ZIP search
  const reverse = searchParams.get("reverse");
  const forecast = searchParams.get("forecast");
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  try {
    let response;

    if (query) {
      // ✅ Handle city or ZIP code search
      if (/^\d+$/.test(query)) {
        response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/zip?zip=${query},US&appid=${apiKey}`
        );
        response.data = [{ // Convert to array of objects with name, lat, lon and state
          name: response.data.name,
          lat: response.data.lat,
          lon: response.data.lon,
          state: response.data.state || "US",
        }];
      } else {
        response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
        );
      }
    } else if (lat && lon) {
      if (reverse) {
        response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
        );
      } else if (forecast) {
        response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
        );
      } else {
        response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
        );
      }
    } else {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data", details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
