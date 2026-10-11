// Location entry screen: type a US place, pick from the matches, or use the device location.
// Checkpoint 3 shows problems as inline status text; distinct error states arrive in Checkpoint 6.
import { geocode } from '../weather.js';
import { fromMatch, labelFor, requestDeviceLocation } from '../location.js';

/** Wire up the location screen. `onSelect(location)` is called with the chosen location. */
export function initLocationScreen({ onSelect }) {
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
      const matches = await geocode(query);
      if (matches.length === 0) {
        setStatus(`No US location found for "${query}".`);
        return;
      }
      setStatus(`${matches.length} match${matches.length === 1 ? '' : 'es'}. Choose one:`);
      for (const match of matches) {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
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
      setStatus(err.code === 'denied'
        ? 'Location access was denied. Type a location instead.'
        : 'Could not get your device location. Type a location instead.');
    }
  });
}
