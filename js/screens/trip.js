// Trip overview: one row per chosen day with weather and a representative outfit (R14).
// The outfit is variant 1 of the day's band (fixed, not a random variation); opening the day
// shows its usual stored variation on the main screen.
import { dayFromForecast, summaryFor } from '../state.js';
import { CONDITION_ICON, dateLabel, temperatureRangeText } from '../text.js';

const $ = (id) => document.getElementById(id);

export function renderTrip(data, dates) {
  const today = data.daily.time[0];
  $('trip-empty').hidden = dates.length > 0;
  $('trip-list').replaceChildren(...dates.map((date) => {
    const summary = summaryFor(dayFromForecast(data.daily, date));
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#main/${date}`;
    link.className = 'day-row day-row--trip';
    link.dataset.condition = summary.condition.toLowerCase();
    link.innerHTML = `
      <span class="day-row__date"></span>
      <span class="day-row__weather"><span class="icon icon--${CONDITION_ICON[summary.condition]}" aria-hidden="true"></span><span class="day-row__condition"></span></span>
      <span class="day-row__range"></span>
      <img class="day-row__outfit" alt="">`;
    link.querySelector('.day-row__date').textContent = dateLabel(date, today);
    link.querySelector('.day-row__condition').textContent = summary.condition;
    link.querySelector('.day-row__range').textContent = temperatureRangeText(summary.temperatureRangeF);
    const outfit = link.querySelector('.day-row__outfit');
    outfit.src = `assets/outfits/${summary.temperatureBand.toLowerCase()}-1.svg`;
    outfit.alt = `Outfit for ${summary.temperatureBand.toLowerCase()} weather`;
    item.append(link);
    return item;
  }));
}
