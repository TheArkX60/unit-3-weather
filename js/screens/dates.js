// Date picker: the 7 forecast days. Single-day open and trip multi-select (R5, R6, R11-R13).
//   Touch:    tap = open the day; press-and-hold = start selecting.
//   Mouse:    right-click = open the day; left-click = start selecting.
//   Keyboard: Enter/Space = open the day; "Plan a trip" button = start selecting.
// While selecting, any tap/click/Enter toggles a day and "OK" opens the trip overview.
import { dayFromForecast, summaryFor } from '../state.js';
import { CONDITION_ICON, dateLabel, temperatureRangeText } from '../text.js';
import { toggleDate } from '../selection.js';

const LONG_PRESS_MS = 500;
const $ = (id) => document.getElementById(id);

let actions = { openDay() {}, openTrip() {} };
let selecting = false;
let selected = [];
const rowButtons = new Map(); // date -> button

/** Wire the static controls once. `openDay(date)` and `openTrip(dates)` perform navigation. */
export function initDatesScreen({ openDay, openTrip }) {
  actions = { openDay, openTrip };
  $('dates-plan').addEventListener('click', () => setSelecting(true));
  $('dates-cancel').addEventListener('click', () => setSelecting(false));
  $('dates-ok').addEventListener('click', () => actions.openTrip(selected));
}

/** Build the list from a fetched forecast. Always starts out of selecting mode. */
export function renderDates(data) {
  const today = data.daily.time[0];
  rowButtons.clear();
  $('dates-list').replaceChildren(...data.daily.time.map((date) => {
    const summary = summaryFor(dayFromForecast(data.daily, date));
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'day-row';
    button.dataset.condition = summary.condition.toLowerCase();
    button.innerHTML = `
      <span class="day-row__date"></span>
      <span class="day-row__weather"><span class="icon icon--${CONDITION_ICON[summary.condition]}" aria-hidden="true"></span><span class="day-row__condition"></span></span>
      <span class="day-row__range"></span>
      <span class="day-row__check" aria-hidden="true" hidden>✓ Selected</span>`;
    button.querySelector('.day-row__date').textContent = dateLabel(date, today);
    button.querySelector('.day-row__condition').textContent = summary.condition;
    button.querySelector('.day-row__range').textContent = temperatureRangeText(summary.temperatureRangeF);
    wireRow(button, date);
    rowButtons.set(date, button);
    item.append(button);
    return item;
  }));
  setSelecting(false);
}

function wireRow(button, date) {
  let pointerType = 'keyboard';
  let pressTimer = null;
  let longPressed = false;
  const cancelPress = () => clearTimeout(pressTimer);

  button.addEventListener('pointerdown', (event) => {
    pointerType = event.pointerType;
    longPressed = false;
    if (event.pointerType === 'mouse' || selecting) return;
    pressTimer = setTimeout(() => {
      longPressed = true; // swallow the click that follows the release
      setSelecting(true);
      select(date);
    }, LONG_PRESS_MS);
  });
  for (const type of ['pointerup', 'pointercancel', 'pointerleave']) button.addEventListener(type, cancelPress);

  button.addEventListener('click', (event) => {
    if (longPressed) {
      longPressed = false;
      return;
    }
    const source = event.detail === 0 ? 'keyboard' : pointerType; // detail 0 = keyboard-triggered click
    if (selecting) {
      select(date);
    } else if (source === 'mouse') {
      setSelecting(true);
      select(date);
    } else {
      actions.openDay(date);
    }
  });

  // Right-click opens the day instead of the browser menu; touch long-press must not open anything.
  button.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if (pointerType === 'mouse') actions.openDay(date);
  });
}

function select(date) {
  selected = toggleDate(selected, date);
  refresh();
}

function setSelecting(on) {
  selecting = on;
  selected = [];
  refresh();
}

/** Sync every control and row with the current selecting/selected state. */
function refresh() {
  const touch = matchMedia('(pointer: coarse)').matches;
  $('dates-hint').textContent = selecting
    ? 'Select the days of your trip, then press OK.'
    : touch
      ? 'Tap a day to see it. Press and hold a day to plan a trip.'
      : 'Right-click a day to see it. Click a day to plan a trip.';
  $('dates-plan').hidden = selecting;
  $('dates-cancel').hidden = !selecting;
  $('dates-ok').hidden = !selecting;
  $('dates-ok').disabled = selected.length === 0;
  $('dates-status').textContent = selecting ? `${selected.length} day${selected.length === 1 ? '' : 's'} selected` : '';
  for (const [date, button] of rowButtons) {
    const isSelected = selected.includes(date);
    button.classList.toggle('is-selected', isSelected);
    button.querySelector('.day-row__check').hidden = !isSelected;
    if (selecting) button.setAttribute('aria-pressed', String(isSelected));
    else button.removeAttribute('aria-pressed');
  }
}
