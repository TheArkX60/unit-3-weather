// Location entry screen: type a US place, pick from the matches, or use the device location.
// Distinct problems (no match, permission denied) are reported through `onError` to the error screen.
import { geocode } from '../weather.js';
import { fromMatch, labelFor, requestDeviceLocation } from '../location.js';
import { filterByState, parseSearch, preferExactName } from '../search.js';

// With a state typed we need a wide net to be sure to include it; without one a short list is enough.
const COUNT_WITH_STATE = 100;
const COUNT_WITHOUT_STATE = 10;
const MAX_SHOWN = 10;

/**
 * Wire up the location screen.
 * `onSelect(location)` receives the chosen location; `onError(kind, detail)` receives
 * 'not-found' (with the searched text) or 'denied'.
 */
export function initLocationScreen({ onSelect, onError }) {
  const form = document.getElementById('location-form');
  const input = document.getElementById('location-input');
  const results = document.getElementById('location-results');
  const status = document.getElementById('location-status');
  const deviceButton = document.getElementById('use-device');

  const setStatus = (text) => { status.textContent = text; };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = input.value.trim();
    results.replaceChildren();
    if (!query) return;
    setStatus('Searching…');
    try {
      const { city, state } = parseSearch(query);
      const found = await geocode(city, state ? COUNT_WITH_STATE : COUNT_WITHOUT_STATE);
      const matches = preferExactName(filterByState(found, state), city).slice(0, MAX_SHOWN);
      if (matches.length === 0) {
        setStatus('');
        onError('not-found', query);
        return;
      }
      setStatus(`${matches.length} match${matches.length === 1 ? '' : 'es'}. Choose one:`);
      for (const match of matches) {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn--block';
        button.textContent = labelFor(match);
        button.addEventListener('click', () => onSelect(fromMatch(match)));
        item.append(button);
        results.append(item);
      }
    } catch {
      setStatus('Could not search right now. Check your connection and try again.');
    }
  });

  deviceButton.addEventListener('click', async () => {
    results.replaceChildren();
    setStatus('Getting your location…');
    try {
      onSelect(await requestDeviceLocation());
    } catch (err) {
      if (err.code === 'denied') {
        setStatus('');
        onError('denied');
      } else {
        setStatus('Could not get your device location. Type a location instead.');
      }
    }
  });
}
