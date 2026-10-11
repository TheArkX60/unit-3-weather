// Entry point: hash router that shows one screen section at a time.
import { fetchForecast } from './weather.js';
import { buildState, dayFromForecast } from './state.js';
import { loadLocation, saveLocation } from './location.js';
import { initLocationScreen } from './screens/location.js';

const SCREENS = ['main', 'dates', 'trip', 'info', 'location', 'error'];

function route() {
  const name = SCREENS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'main';
  if (name === 'main' && !loadLocation()) {
    location.hash = '#location'; // nothing saved yet: ask for a location first
    return;
  }
  for (const id of SCREENS) {
    document.getElementById(`screen-${id}`).hidden = id !== name;
  }
  if (name === 'main') showMain();
}

// Checkpoint 3 placeholder: proves location -> weather -> state works. Real main screen is Checkpoint 4.
async function showMain() {
  const out = document.getElementById('main-debug');
  const saved = loadLocation();
  out.textContent = `Loading weather for ${saved.name}…`;
  try {
    const data = await fetchForecast(saved.latitude, saved.longitude);
    const date = data.daily.time[0]; // today, in the location's own time zone
    const state = buildState({ location: saved.name, date, day: dayFromForecast(data.daily, date) });
    out.textContent = JSON.stringify(state, null, 1);
  } catch (err) {
    out.textContent = `Weather unavailable: ${err.message}`;
  }
}

function selectLocation(chosen) {
  saveLocation(chosen); // overwrites any previous location (R3)
  location.hash = '#main';
}

initLocationScreen({ onSelect: selectLocation });
window.addEventListener('hashchange', route);
route();
