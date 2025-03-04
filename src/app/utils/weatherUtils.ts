interface WeatherInfo {
  wind_mph: string;
  cloud: string;
  temp: string;
  pressure_mb: string;
  precip_mm: string;
  uv: string;
  vis_miles: string;
  waterTemp: string;
}

interface MarineConditions {
  swell_ht_ft?: number;
  swell_period_secs?: number;
}

interface Tide {
  tide_time: string;
  tide_type: string;
  tide_height_mt: string;
}

export const formatTimeTo12Hour = (time: string): string => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = new Date(time);
  if (isNaN(date.getTime())) {
    return "Invalid Time"; // Better debugging message
  }
  return date.toLocaleTimeString("en-US", {
    timeZone: userTimeZone, // Match the marine data time zone
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
export const getUVDescription = (uv: number): string => {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
};

export const calculateFishingScore = (
  weatherInfo: WeatherInfo,
  marineConditions: MarineConditions,
  moonPhase: string | undefined,
  tides: Tide[]
): number => {
  let score = 100;
  const { wind_mph, cloud, temp, pressure_mb, precip_mm, uv, vis_miles } =
    weatherInfo;
  const waterTemp = parseFloat(weatherInfo.waterTemp);
  const swell = marineConditions.swell_ht_ft;
  const period = marineConditions.swell_period_secs;

  if (wind_mph !== "N/A") {
    const wind = parseFloat(wind_mph);
    if (!Number.isNaN(wind)) {
      if (wind > 20) score -= 30;
      else if (wind > 15) score -= 20;
      else if (wind > 10) score -= 10;
      else if (wind < 5) score += 5;
    }
  }
  if (cloud !== "N/A") {
    const cloudNum = parseFloat(cloud);
    if (!Number.isNaN(cloudNum)) {
      if (cloudNum < 20) score -= 15;
      else if (cloudNum > 80) score -= 10;
      else if (cloudNum >= 30 && cloudNum <= 70) score += 10;
    }
  }
  if (temp !== "N/A") {
    const tempNum = parseFloat(temp);
    if (!Number.isNaN(tempNum)) {
      if (tempNum < 50 || tempNum > 90) score -= 20;
      else if (tempNum < 60 || tempNum > 85) score -= 10;
      else if (tempNum >= 65 && tempNum <= 80) score += 10;
    }
  }
  if (pressure_mb !== "N/A") {
    const pressure = parseFloat(pressure_mb);
    if (!Number.isNaN(pressure)) {
      if (pressure > 1020) score -= 15;
      else if (pressure < 1000) score -= 10;
      else if (pressure >= 1005 && pressure <= 1015) score += 15;
    }
  }
  if (precip_mm !== "N/A") {
    const precipNum = parseFloat(precip_mm);
    if (!Number.isNaN(precipNum)) {
      if (precipNum > 2) score -= 20;
      else if (precipNum > 0.5) score -= 10;
      else if (precipNum > 0) score += 5;
    }
  }
  if (!Number.isNaN(waterTemp)) {
    if (waterTemp < 60 || waterTemp > 85) score -= 15;
    else if (waterTemp >= 65 && waterTemp <= 80) score += 10;
  }
  if (swell !== undefined) {
    if (swell > 5) score -= 20;
    else if (swell > 3) score -= 10;
    else if (swell < 1) score += 5;
  }
  if (period !== undefined) {
    if (period < 5) score -= 10;
    else if (period >= 8) score += 10;
  }
  if (vis_miles !== "N/A") {
    const vis = parseFloat(vis_miles);
    if (!Number.isNaN(vis)) {
      if (vis > 10) score -= 10;
      else if (vis < 2) score -= 15;
      else if (vis >= 4 && vis <= 8) score += 5;
    }
  }
  if (moonPhase) {
    if (moonPhase === "Full Moon" || moonPhase === "New Moon") score += 10;
    else if (moonPhase.includes("Quarter")) score += 5;
  }
  if (uv !== "N/A") {
    const uvNum = parseFloat(uv);
    if (!Number.isNaN(uvNum)) {
      if (uvNum > 8) score -= 10;
      else if (uvNum < 3) score += 5;
    }
  }
  if (tides.length > 0) {
    const now = new Date();
    const tideTimes = tides.map((t) => new Date(t.tide_time).getTime());
    const closestTide = tideTimes.reduce((prev: number, curr: number) =>
      Math.abs(curr - now.getTime()) < Math.abs(prev - now.getTime())
        ? curr
        : prev
    );
    const timeDiff = Math.abs(now.getTime() - closestTide) / (1000 * 60 * 60);
    if (timeDiff <= 2) score += 15;
  }

  return Math.max(0, Math.min(150, score));
};
