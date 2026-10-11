// Entry point: hash router that shows one screen section at a time.
// Routes look like "#main" or "#main/2026-10-13" (a specific forecast date).
import { fetchForecast } from './weather.js';
import { buildState, dayFromForecast } from './state.js';
import { loadLocation, saveLocation } from './location.js';
import { initLocationScreen } from './screens/location.js';
import { initDatesScreen, renderDates } from './screens/dates.js';
import { renderTrip } from './screens/trip.js';
import { tripDatesFromHash } from './selection.js';
import { renderMain, showMainLoading, showMainError } from './screens/main.js';

const SCREENS = ['main', 'dates', 'trip', 'info', 'location', 'error'];

// Last forecast fetched, reused when switching dates for the same location.
let cachedForecast = null;

async function forecastFor(saved) {
  const key = `${saved.latitude},${saved.longitude}`;
  if (cachedForecast?.key !== key) {
    cachedForecast = { key, data: await fetchForecast(saved.latitude, saved.longitude) };
  }
  return cachedForecast.data;
}

function route() {
  const [name, arg] = location.hash.slice(1).split('/');
  const screen = SCREENS.includes(name) ? name : 'main';
  if (['main', 'dates', 'trip'].includes(screen) && !loadLocation()) {
    location.hash = '#location'; // nothing saved yet: ask for a location first
    return;
  }
  for (const id of SCREENS) {
    document.getElementById(`screen-${id}`).hidden = id !== screen;
  }
  if (screen === 'main') showMain(arg);
  if (screen === 'dates') showListScreen('dates', (data) => renderDates(data));
  if (screen === 'trip') {
    showListScreen('trip', (data) => renderTrip(data, tripDatesFromHash(arg, data.daily.time)));
  }
}

async function showMain(requestedDate) {
  const saved = loadLocation();
  showMainLoading();
  try {
    const data = await forecastFor(saved);
    const today = data.daily.time[0]; // today in the location's own time zone
    // Dates outside the 7-day forecast fall back to today (R6).
    const date = data.daily.time.includes(requestedDate) ? requestedDate : today;
    let day = dayFromForecast(data.daily, date);
    const demo = new URLSearchParams(location.search).get('demo'); // TEMPORARY dev preview, see js/demo.js
    if (demo) day = (await import('./demo.js')).demoDay(demo, date);
    const state = buildState({ location: saved.name, date, day });
    renderMain(state, today);
  } catch {
    showMainError('Weather is unavailable right now.');
  }
}

// Date picker and trip overview share one load/error pattern around the cached forecast.
async function showListScreen(screen, render) {
  const saved = loadLocation();
  const byId = (suffix) => document.getElementById(`${screen}-${suffix}`);
  byId('loading').hidden = false;
  byId('error').hidden = true;
  byId('content').hidden = true;
  try {
    render(await forecastFor(saved));
    byId('content').hidden = false;
  } catch {
    byId('error').hidden = false;
  } finally {
    byId('loading').hidden = true;
  }
}

function selectLocation(chosen) {
  saveLocation(chosen); // overwrites any previous location (R3)
  location.hash = '#main';
}

initLocationScreen({ onSelect: selectLocation });
initDatesScreen({
  openDay: (date) => { location.hash = `#main/${date}`; },
  openTrip: (dates) => { location.hash = `#trip/${dates.join(',')}`; },
});
window.addEventListener('hashchange', route);
route();
