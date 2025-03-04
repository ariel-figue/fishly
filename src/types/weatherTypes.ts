// Utility Types for Common Fields
interface Temperature {
  celsius: number;
  fahrenheit: number;
}

interface Wind {
  speed_mph: number;
  speed_kph: number;
  degree: number;
  direction: string;
  gust_mph: number;
  gust_kph: number;
}

interface Precipitation {
  mm: number;
  inches: number;
}

interface Visibility {
  km: number;
  miles: number;
}

// Base Condition Interface
export interface Condition {
  text: string;
  icon: string;
  code: number;
}

// Tide and Tides
export interface Tide {
  time: string;
  height_mt: string;
  type: "LOW" | "HIGH";
}

export interface Tides {
  tide: Tide[];
}

// Astro Data (Sun and Moon)
export interface Astro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: number;
  is_moon_up: number;
  is_sun_up: number;
}

// Location Data
export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id?: string;
  localtime_epoch?: number;
  localtime?: string;
}

// Geolocation Data
export interface Geolocation {
  lat: string;
  lon: string;
  city: string;
  region: string;
  country: string;
}

// Alert Data
export interface Alert {
  headline: string;
  msgtype: string;
  severity: string;
  urgency: string;
  areas: string;
  category: string;
  certainty: string;
  event: string;
  note: string;
  effective: string;
  expires: string;
  desc: string;
  instruction: string;
}

// Hourly Weather Data
export interface WeatherHour {
  time_epoch: number;
  time: string;
  temp: Temperature;
  is_day: number;
  condition: Condition;
  wind: Wind;
  pressure_mb: number;
  pressure_in: number;
  precip: Precipitation;
  humidity: number;
  cloud: number;
  feelslike: Temperature;
  windchill: Temperature;
  heatindex: Temperature;
  dewpoint: Temperature;
  visibility: Visibility;
  uv: number;
  swell: {
    height_mt: number;
    height_ft: number;
    dir: number;
    dir_16_point: string;
    period_secs: number;
  };
  wave_height_mt: number;
  water_temp: Temperature;
}

// Daily Weather Data
export interface WeatherDay {
  max_temp: Temperature;
  min_temp: Temperature;
  avg_temp: Temperature;
  max_wind: {
    mph: number;
    kph: number;
  };
  total_precip: Precipitation;
  total_snow_cm: number;
  avg_vis: Visibility;
  avg_humidity: number;
  tides?: Tides[];
  condition: Condition;
  uv: number;
  daily_will_it_rain?: number;
  daily_chance_of_rain?: number;
  daily_will_it_snow?: number;
  daily_chance_of_snow?: number;
}

// Forecast Day Structures
interface ForecastDayBase {
  date: string;
  date_epoch: number;
  astro: Astro;
}

interface ForecastDayMarine extends ForecastDayBase {
  day: WeatherDay;
  hour: WeatherHour[];
}

export interface ForecastDayDaily extends ForecastDayBase {
  day: WeatherDay;
  hour: WeatherHour[];
}

// Marine Forecast
interface ForecastMarine {
  forecastday: ForecastDayMarine[];
}

// Forecast Structure for API Response
interface Forecast {
  forecastday: ForecastDayDaily[];
}

// Forecast Structure for WeatherResponse
export interface WeatherForecast {
  current: {
    temp: Temperature;
    feelslike: Temperature;
    wind: Wind;
    pressure_mb: number;
    pressure_in: number;
    precip: Precipitation;
    humidity: number;
    cloud: number;
    uv: number;
    visibility: Visibility;
    condition: Condition;
  };
  alerts: Alert[];
  daily: ForecastDayDaily[];
  hourly: WeatherHour[];
}

// Marine Data
interface Marine {
  location: Location;
  forecast: ForecastMarine;
}

// Moon Data (Simplified from Astro)
export interface Moon {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: number;
  is_moon_up: number;
  is_sun_up: number;
}

// Weather API Response
export interface WeatherResponse {
  location: Location;
  geolocation: Geolocation;
  marine: Marine;
  forecast: WeatherForecast;
  moon: Moon;
}

// Search Result
export interface SearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

// IP Geolocation Response
export interface IpResponse {
  ip: string;
  type: string;
  continent_code: string;
  continent_name: string;
  country_code: string;
  country_name: string;
  region: string;
  city: string;
  zip: string;
  latitude: number;
  longitude: number;
  location: {
    capital: string;
    languages: {
      code: string;
      name: string;
    }[];
    country_flag: string;
    country_flag_emoji: string;
    country_flag_emoji_unicode: string;
    calling_code: string;
  };
}

// Token Data
export interface TokenData {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
  };
  expiresAt: number;
}

// Internal Types for API Responses
export interface AstronomyResponse {
  location: Location;
  astronomy: {
    astro: Astro;
  };
}

export interface ForecastResponse {
  location: Location;
  current: {
    temp_c: number;
    temp_f: number;
    feelslike_c: number;
    feelslike_f: number;
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    uv: number;
    vis_km: number;
    vis_miles: number;
    gust_mph: number;
    gust_kph: number;
    condition: Condition;
  };
  forecast: Forecast;
  alerts: {
    alert: Alert[];
  };
}

export interface MarineResponse {
  location: Location;
  forecast: ForecastMarine;
}