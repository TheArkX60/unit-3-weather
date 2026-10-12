// Main screen: renders entirely from the recommendation state (never from raw weather).
import {
  CONDITION_ICON, REMINDER_ICON,
  recommendationText, reminderText, dateLabel, temperatureRangeText,
} from '../text.js';

const $ = (id) => document.getElementById(id);

/** Wire the Back control once. `onBack()` decides where it goes. */
export function initMainScreen({ onBack }) {
  $('main-back').addEventListener('click', (event) => {
    event.preventDefault();
    onBack();
  });
}

/** Show Back only when a specific day was opened from the date picker or a trip overview (R30). */
export function setBackVisible(visible) {
  $('main-back').hidden = !visible;
}

/** Show the blank color-blocked background and spinner while weather loads (R16). */
export function showMainLoading() {
  $('screen-main').dataset.condition = 'loading';
  $('main-loading').hidden = false;
  $('main-content').hidden = true;
  $('main-effect').className = 'effect';
}

/** Render one recommendation state. `today` is the location's current date, for the Today/forecast label. */
export function renderMain(state, today) {
  $('screen-main').dataset.condition = state.condition.toLowerCase();
  $('main-loading').hidden = true;
  $('main-content').hidden = false;

  $('main-date').textContent = dateLabel(state.date, today);
  $('main-location').textContent = state.location;

  $('main-condition-icon').className = `icon icon--${CONDITION_ICON[state.condition]}`;
  $('main-condition-text').textContent = state.condition;
  $('main-range').textContent = `Feels like ${temperatureRangeText(state.temperatureRangeF)}`;

  $('main-recommendation').textContent = recommendationText(state);

  const reminders = $('main-reminders');
  reminders.replaceChildren(...state.reminders.map((reminder) => {
    const item = document.createElement('li');
    const icon = document.createElement('span');
    icon.className = `icon icon--${REMINDER_ICON[reminder]}`;
    icon.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    text.textContent = reminderText(reminder, state.reminderVariants[reminder]);
    item.append(icon, text);
    return item;
  }));

  const character = $('main-character');
  character.src = `assets/outfits/${state.temperatureBand.toLowerCase()}-${state.outfitVariant}.svg`;
  character.alt = `Character dressed for ${state.temperatureBand.toLowerCase()} weather`;

  // Effect layers over the whole scene, never the character itself; Clear and Cloudy have none.
  $('main-effect').className = EFFECT[state.condition] ? `effect effect--${EFFECT[state.condition]}` : 'effect';
}

const EFFECT = { Rainy: 'rain', Snowy: 'snow', Windy: 'wind' };
