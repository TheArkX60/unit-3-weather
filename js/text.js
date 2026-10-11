// All user-facing wording derived from the recommendation state (approved wording, spec "Content variation").
// Pure functions: no DOM access, so they are easy to test.

const BAND_LINES = {
  Hot: "It's hot. Wear something light.",
  Warm: "It's warm. A tee and shorts work.",
  Mild: "It's mild. A tee and pants are fine.",
  Cool: "It's cool. Wear long sleeves.",
  Cold: "It's cold. Bundle up.",
};

// Clear days add nothing after the band line.
const CONDITION_LINES = {
  Clear: '',
  Rainy: "It's rainy. Bring an umbrella.",
  Snowy: "It's snowy. Dress warm and watch your step.",
  Windy: "It's windy. Wear something that stays put.",
};

// Three wordings per reminder; reminderVariants (1-3) picks one.
const REMINDER_WORDING = {
  umbrella: ['Bring an umbrella.', "Don't forget your umbrella.", "Rain's likely, so pack an umbrella."],
  sunscreen: ['Wear sunscreen.', 'Put on sunscreen before you go.', "The sun's out, so sunscreen up."],
  hydration: ['Drink extra water.', 'Stay hydrated today.', "It's hot, so carry a water bottle."],
};

export const CONDITION_ICON = { Clear: 'sunny', Rainy: 'rainy', Snowy: 'snowing', Windy: 'air' };
export const REMINDER_ICON = { umbrella: 'umbrella', sunscreen: 'sunny', hydration: 'water-drop' };

/** The written recommendation: band line plus the condition line, if any. */
export function recommendationText(state) {
  return [BAND_LINES[state.temperatureBand], CONDITION_LINES[state.condition]].filter(Boolean).join(' ');
}

/** Wording for one active reminder, using its stored variant (1-3). */
export function reminderText(reminder, variant) {
  return REMINDER_WORDING[reminder][variant - 1];
}

/** Parse 'YYYY-MM-DD' as a local date (new Date('YYYY-MM-DD') would shift by time zone). */
function parseDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** "Today" for the current day, otherwise a forecast label like "Tue, Oct 13". */
export function dateLabel(date, today) {
  if (date === today) return 'Today';
  return parseDate(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/** Fahrenheit range, e.g. "72–91°F". */
export function temperatureRangeText([low, high]) {
  return `${low}–${high}°F`;
}
