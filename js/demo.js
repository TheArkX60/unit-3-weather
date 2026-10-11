// TEMPORARY dev helper: forces a forecast day so every condition/band/reminder can be previewed.
// Loaded only when the page address has ?demo=... (see main.js). Delete this file, demo-links.html,
// and the demo lines in main.js before final delivery.
//
// Tokens (comma-separated): rainy | snowy | windy (default clear), hot | warm | mild | cool | cold (default mild),
// sun (UV 8), hydrate (apparent max 95), reroll (forget this date's saved variants first).
// Example: index.html?demo=rainy,cold,sun#main
const BAND_TEMP_F = { hot: 88, warm: 77, mild: 62, cool: 47, cold: 30 };

export function demoDay(demoParam, date) {
  showBadge(demoParam);
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

// Fixed corner badge so a forced forecast can never be mistaken for real weather.
function showBadge(demoParam) {
  let badge = document.getElementById('demo-badge');
  if (!badge) {
    badge = document.createElement('a');
    badge.id = 'demo-badge';
    badge.href = location.pathname + location.hash; // same page without ?demo
    badge.style.cssText = 'position:fixed;top:8px;right:8px;z-index:99;background:#ff0;color:#000;'
      + 'padding:6px 10px;border-radius:6px;font:600 14px system-ui;text-decoration:none;';
    document.body.append(badge);
  }
  badge.textContent = `DEMO: ${demoParam} (click to exit)`;
}
