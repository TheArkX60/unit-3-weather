// Info screen: the disclosures are static HTML; this wires the clear-saved-location control (R4).
import { clearLocation } from '../location.js';

export function initInfoScreen() {
  document.getElementById('clear-location').addEventListener('click', () => {
    clearLocation();
    document.getElementById('clear-status').textContent =
      "Saved location cleared. You'll be asked for a location next time.";
  });
}

/** Reset the confirmation message each time the screen is opened. */
export function resetInfoScreen() {
  document.getElementById('clear-status').textContent = '';
}
