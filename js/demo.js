// TEMPORARY dev helper: forces a forecast day so every condition/band/reminder can be previewed.
// Loaded only when the page address has ?demo=... (see main.js). Delete this file, demo-links.html,
// and the demo lines in main.js before final delivery.
//
// Tokens (comma-separated): rainy | snowy | windy (default clear), hot | warm | mild | cool | cold (default mild),
// sun (UV 8), hydrate (apparent max 95), reroll (forget this date's saved variants first).
// Example: index.html?demo=rainy,cold,sun#main
const BAND_TEMP_F = { hot: 88, warm: 77, mild: 62, cool: 47, cold: 30 };

export function demoDay(demoParam, date) {
  const tokens = demoParam.split(',');
  const band = Object.keys(BAND_TEMP_F).find((b) => tokens.includes(b)) ?? 'mild';
  const temp = BAND_TEMP_F[band];
  const day = {
    apparentMin: temp - 3,
    apparentMax: temp + 3,
    precipChancePct: 0,
    snowfallIn: 0,
    windMaxMph: 5,
    uvMax: 1,
  };
  if (tokens.includes('rainy')) day.precipChancePct = 50;
  if (tokens.includes('snowy')) day.snowfallIn = 1;
  if (tokens.includes('windy')) day.windMaxMph = 25;
  if (tokens.includes('sun')) day.uvMax = 8;
  if (tokens.includes('hydrate')) day.apparentMax = 95;
  if (tokens.includes('reroll')) localStorage.removeItem(`variants:${date}`);
  return day;
}
