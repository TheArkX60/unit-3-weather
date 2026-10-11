// Location handling: labels, device geolocation, and the single saved location (R1-R4).
const STORAGE_KEY = 'location';
export const DEVICE_LABEL = 'Your location';

/** Display name for a geocoding match, e.g. "Austin, Texas". */
export function labelFor(match) {
  return match.admin1 ? `${match.name}, ${match.admin1}` : match.name;
}

/** Shape stored and passed around for a manual geocoding match. */
export function fromMatch(match) {
  return { name: labelFor(match), latitude: match.latitude, longitude: match.longitude, source: 'manual' };
}

/**
 * Ask the browser for the device position. Resolves to a location labelled "Your location".
 * Rejects with Error whose `.code` is 'denied' (permission refused) or 'unavailable' (anything else).
 */
export function requestDeviceLocation() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(Object.assign(new Error('Geolocation not supported'), { code: 'unavailable' }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        name: DEVICE_LABEL,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        source: 'device',
      }),
      (err) => reject(Object.assign(new Error(err.message), {
        code: err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable',
      })),
      { timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  });
}

// Only the most recent location is kept: every save overwrites the last one (R3).
export function saveLocation(location, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch {
    // Storage blocked: the app still works this session, it just won't remember the location.
  }
}

/** The saved location, or null if none/corrupt. */
export function loadLocation(storage = globalThis.localStorage) {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY));
    const valid = saved && typeof saved.name === 'string'
      && Number.isFinite(saved.latitude) && Number.isFinite(saved.longitude);
    return valid ? saved : null;
  } catch {
    return null;
  }
}

export function clearLocation(storage = globalThis.localStorage) {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
