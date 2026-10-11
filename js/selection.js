// Pure helpers for building a trip range on the date picker.

/** Add the date if absent, remove it if present; result is in date order (ISO dates sort chronologically). */
export function toggleDate(selected, date) {
  const next = selected.includes(date) ? selected.filter((d) => d !== date) : [...selected, date];
  return next.sort();
}

/** Trip dates from a route argument like "2026-10-12,2026-10-14", keeping only dates inside the forecast (R6). */
export function tripDatesFromHash(arg, validDates) {
  if (!arg) return [];
  return [...new Set(arg.split(','))].filter((date) => validDates.includes(date)).sort();
}
