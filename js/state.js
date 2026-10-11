// Recommendation state: the single object every screen renders from.
// Pure functions only (no DOM, no network) so rules are easy to test.
import { resolveVariants } from './variants.js';

// Thresholds from spec.md "Recommendation state and data flow".
export const RULES = {
  rainChancePct: 30,
  windyMph: 20,
  sunscreenUv: 3,
  sunscreenHiddenRainPct: 60, // very wet days drop the sunscreen reminder
  hydrationApparentF: 90,
  // Lower bound (°F) of each band, checked hottest first; anything below is Cold.
  bands: [['Hot', 85], ['Warm', 70], ['Mild', 55], ['Cool', 40]],
};

/** One forecast day from the raw Open-Meteo `daily` arrays, or null if the date isn't in range. */
export function dayFromForecast(daily, date) {
  const i = daily.time.indexOf(date);
  if (i === -1) return null;
  return {
    apparentMax: daily.apparent_temperature_max[i],
    apparentMin: daily.apparent_temperature_min[i],
    precipChancePct: daily.precipitation_probability_max[i],
    snowfallIn: daily.snowfall_sum[i],
    windMaxMph: daily.wind_speed_10m_max[i],
    uvMax: daily.uv_index_max[i],
  };
}

/** Snowy > Rainy > Windy > Clear; first match wins. */
export function conditionFor(day) {
  if (day.snowfallIn > 0) return 'Snowy';
  if (day.precipChancePct >= RULES.rainChancePct) return 'Rainy';
  if (day.windMaxMph >= RULES.windyMph) return 'Windy';
  return 'Clear';
}

/** Band uses the midpoint of the day's apparent-temperature range (pending Developer confirmation). */
export function temperatureBandFor(day) {
  const midpoint = (day.apparentMax + day.apparentMin) / 2;
  for (const [band, lowerBound] of RULES.bands) {
    if (midpoint >= lowerBound) return band;
  }
  return 'Cold';
}

/** Independent booleans; any number can be active at once. */
export function remindersFor(day) {
  const reminders = [];
  if (day.precipChancePct >= RULES.rainChancePct) reminders.push('umbrella');
  if (day.uvMax >= RULES.sunscreenUv && day.precipChancePct < RULES.sunscreenHiddenRainPct) reminders.push('sunscreen');
  if (day.apparentMax >= RULES.hydrationApparentF) reminders.push('hydration');
  return reminders;
}

/** Build the full recommendation state for a location + date + forecast day. */
export function buildState({ location, date, day }, storage) {
  const reminders = remindersFor(day);
  const { outfitVariant, reminderVariants } = resolveVariants(date, reminders, storage);
  return {
    location,
    date,
    condition: conditionFor(day),
    temperatureBand: temperatureBandFor(day),
    reminders,
    outfitVariant,
    reminderVariants,
    temperatureRangeF: [Math.round(day.apparentMin), Math.round(day.apparentMax)],
  };
}
