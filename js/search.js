// Location search helpers (pure, no network). Open-Meteo's geocoder matches only the place name and
// ignores everything else, so "Austin TX" finds nothing and "Springfield MO" finds the wrong Springfield.
// We split a typed query into a city and an optional state, search the city, and filter by state ourselves.

const STATES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
  CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho',
  IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas',
  UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
  WI: 'Wisconsin', WY: 'Wyoming', DC: 'District of Columbia',
};

// Lowercase lookup for both forms: "tx" and "texas" each map to "Texas".
const STATE_LOOKUP = new Map();
for (const [abbreviation, name] of Object.entries(STATES)) {
  STATE_LOOKUP.set(abbreviation.toLowerCase(), name);
  STATE_LOOKUP.set(name.toLowerCase(), name);
}

// Longest state name is "District of Columbia" (3 words).
const MAX_STATE_WORDS = 3;
const COUNTRY_WORDS = new Set(['us', 'usa', 'united states']);

/** Full state name for text like "TX", "tx", "Texas" or "D.C.", or null if it is not a US state. */
export function lookupState(text) {
  const key = text.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();
  return STATE_LOOKUP.get(key) ?? null;
}

/**
 * Split a typed query into { city, state }. `state` is a full state name or null.
 *   "Austin, TX" / "Austin TX" / "austin texas" -> city "Austin", state "Texas"
 *   "Austin"                                    -> city "Austin", state null
 * A trailing word only counts as a state if something is left over for the city, so "New York" and
 * "Washington" alone stay city names.
 */
export function parseSearch(query) {
  const cleaned = query.replace(/\s+/g, ' ').trim();

  if (cleaned.includes(',')) {
    const [city, ...rest] = cleaned.split(',').map((part) => part.trim());
    let state = null;
    for (const part of rest) {
      if (COUNTRY_WORDS.has(part.toLowerCase())) continue; // "Austin, TX, USA"
      state ??= lookupState(part);
    }
    return { city, state };
  }

  const words = cleaned.split(' ');
  for (let count = MAX_STATE_WORDS; count >= 1; count--) {
    if (words.length <= count) continue; // nothing would be left for the city
    const state = lookupState(words.slice(-count).join(' '));
    if (state) return { city: words.slice(0, -count).join(' '), state };
  }
  return { city: cleaned, state: null };
}

/**
 * Open-Meteo also matches alternate names, so "Austin" returns Ardmore, Tennessee (where Austin is an
 * alias). When any result is named exactly what was typed, show only those; otherwise keep all results,
 * for example a partial name that only matches by alias or prefix. (The geocoder does no typo matching.)
 */
export function preferExactName(results, city) {
  const sameName = (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }) === 0; // ignores case and accents
  const exact = results.filter((result) => sameName(result.name, city));
  return exact.length > 0 ? exact : results;
}

/** Keep only results in the named state (Open-Meteo's `admin1` is the full state name). */
export function filterByState(results, stateName) {
  if (!stateName) return results;
  return results.filter((result) => result.admin1 === stateName);
}
