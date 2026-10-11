// Open-Meteo wrapper: the app's only external data dependency.
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/** Resolve a place name to US matches: [{ name, admin1, latitude, longitude }]. */
export async function geocode(query) {
  const params = new URLSearchParams({ name: query, count: 5, language: 'en', format: 'json' });
  const res = await fetch(`${GEOCODE_URL}?${params}`);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  return (data.results ?? []).filter((r) => r.country_code === 'US');
}

/** Fetch current + 7-day forecast in imperial units. Returns the raw Open-Meteo response. */
export async function fetchForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,apparent_temperature,precipitation,snowfall,wind_speed_10m,uv_index',
    daily: 'apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,snowfall_sum,wind_speed_10m_max,uv_index_max,cloud_cover_mean,weather_code',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    timezone: 'auto',
    forecast_days: 7,
  });
  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error(`Forecast failed: ${res.status}`);
  return res.json();
}
