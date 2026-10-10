# Research

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Research your context of use, references, weather guidance, technical options, and choices that will guide the specification.

## Instructions for the Developer

Judge sources and recommendations, make the consequential decisions, and keep this file current as the work develops.

To begin, open the project repository in a fresh chat and enter:

`Read ./research.md and help me begin Project 3 research.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, and this file. Ask one focused question at a time. Help investigate and compare options without deciding for the Developer. Verify sources directly and keep this file concise.

## Context of use

I use this app in three situations:
- **Daily routine:** After breakfast, before deciding what to wear, checking my current location's weather for today.
- **Trip planning:** Checking the forecast for a destination different from my current location, most reliably the day before departure, though I may check randomly in the days leading up to it.
- **Casual check-ins:** Throughout the day, on my phone.

Assumptions and limitations: forecast accuracy matters most for near-term checks (today, or the day before a trip); a 7-day forecast range should cover realistic trip-planning needs without requiring an extended-range provider. The phone layout should scale reasonably to larger touch devices (e.g., tablets) since it's fluid rather than fixed-width, though tablet is not a dedicated design target.

## User story

> As a college student getting ready in the morning, I want to quickly see what to wear based on today's forecast, so that I don't have to check the weather separately and guess at appropriate clothing.

> As a college student planning a trip, I want to check the forecast for my destination the day before I leave, so that I can pack and dress appropriately for weather different from where I currently am.

## References

1. **Apple Weather (iOS)** — `reference/Apple Weather.PNG`
   Shows location, current temp, high/low range, condition summary, and hourly forecast. Useful: the top portion (location, temp, condition, high/low) is the information our weather summary needs — we don't need the hourly/10-day list since the character will occupy that space instead.

2. **Duolingo** — `reference/Duolingo.JPG`
   Mascot (Duo) sits in the lower-middle of the screen with a speech bubble above it. Useful: confirms a character can anchor the bottom portion of the screen while text/data sits above it, clearly visible without crowding.

3. **Finch** — `reference/Finch.JPG`
   Character's appearance reflects a situational state (shown here dressed for Halloween). Useful: demonstrates a character communicating "current state" through appearance alone, without extra screen elements like a room — our character should stay the sole visual focus, with its outfit (not a backdrop) doing that communication, driven by weather rather than occasion.

4. **Cladwell** — `reference/Cladwell.JPG`
   Shows a styled outfit on a person alongside a grid of the individual clothing pieces that make it up. Useful: suggests we could show both the character wearing the full outfit and call out individual clothing items (e.g., "jacket," "boots") to make the recommendation more specific. Imperfect fit since it's a wardrobe-planning tool, not weather-driven, but the item-breakdown idea carries over.

5. **Gas app** — `reference/Gas app.JPG`
   Bold, high-contrast color blocking with large, easy-to-read text. Useful as a tone reference: simple color fields, minimal clutter, readable type — a layout direction with weather/date up top, character below, and date navigation near the top for picking a date within the forecast range.

Note: a "pick any date, past or future" feature was considered (inspired by the Gas app's date navigation) but set aside — our user stories only cover today and forecast-range trip planning, not historical weather. Revisit if research or testing surfaces a need for it.

## Weather and technical evidence

Record each useful source, what it supports, and important limitations. Research the weather variables, apparel guidance, reminders, accessibility, privacy, artwork, weather providers, and technical options needed for informed decisions.

**Weather provider comparison:**

- **National Weather Service (api.weather.gov)** — Free, no API key, no meaningful rate limit, official U.S. government source. U.S.-only coverage (matches project scope) and 7-day forecast. Limitation: only accepts lat/long, so manual location entry would need a separate geocoding service wired in alongside it.
- **Open-Meteo (open-meteo.com)** — Free for non-commercial use, no API key, 10,000 calls/day. Forecast up to 16 days, plus historical data and a bundled free geocoding API in the same ecosystem (one integration instead of two). For U.S. locations, its default model is NOAA's GFS — the same Global Forecast System NWS forecasts are built on — so the underlying data is still a government source, aggregated and made easier to query. [Open-Meteo: Best weather models in one open-source API](https://openmeteo.substack.com/p/best-weather-models-in-one-open-source), [NOAA GFS](https://www.ncei.noaa.gov/products/model-data/model-datasets/global-forcast-system-gfs)

Decision: Open-Meteo selected — bundled geocoding simplifies manual location entry, and since it's built on NOAA's GFS model for U.S. locations, it doesn't trade away the government-sourced data NWS would provide. Info screen will disclose "weather data from Open-Meteo, sourced from NOAA's GFS model."

**Recommendation categories and reminder rules:**

Primary condition is checked first, then temperature band layers on top (checked first since it changes the outfit silhouette more than temperature does):
- Clear / Rainy (precipitation probability ≥ 40–50%) / Snowy (precipitation type = snow) / Windy (sustained wind ≥ 20 mph)

Temperature bands use "feels like"/apparent temperature rather than raw air temperature, since that's what actually drives clothing choice:
- Hot: ≥ 85°F, Warm: 70–84°F, Mild: 55–69°F, Cool: 40–54°F, Cold: < 40°F

Note: the three-layer principle (base/mid/outer) behind this is well-documented ([REI: layering basics](https://www.rei.com/learn/expert-advice/best-base-layers.html)), but no single authoritative source gives exact temperature cutoffs for "wear shorts" vs. "wear a coat" — these band boundaries are a judgment call, not a cited fact. The app's guidance is meant as a sensible suggestion, not a strict rule: people reasonably dress warmer or cooler than the band suggests, but the recommendation should still avoid genuinely mismatched suggestions (e.g., never suggesting summer clothes in freezing weather).

Reminders (independent triggers layered onto the above):
- **Umbrella** — precipitation probability ≥ 40–50%
- **Sunscreen** — UV index ≥ 3 ("Moderate" on the NWS/EPA UV index scale)
- **Extra hydration** — heat index ≥ 90°F ("Extreme Caution" per [NWS heat index chart](https://www.weather.gov/ama/heatindex))

**Accessibility:**

- **Touch targets** — WCAG 2.2 AA requires interactive elements to be at least 24×24 CSS pixels (minor exceptions apply). Relevant to date navigation, settings, and info-screen buttons for the one-handed phone layout. ([w3.org](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html))
- **Contrast** — WCAG 2.2 AA requires 4.5:1 contrast for normal text, 3:1 for large text (≥18pt) and for UI components/icons. Matters for weather/reminder icons sitting on colored backgrounds.
- **Icon/image text alternatives** — icons conveying meaning (weather icons, reminder icons) need text alternatives, not just decoration. The written recommendation text can double as that alternative if structured so screen readers announce it alongside the icon.
- **Color is never the only signal (WCAG 1.4.1)** — any meaning conveyed by color (e.g., a reminder badge's color) must be paired with a second signal — icon, label, shape, or pattern — so it still reads correctly for color-blind users. Applies to reminder badges and any color-coded temperature indicator.

**Privacy:**

- No accounts, server, or analytics of our own — the app is static (GitHub Pages), so there's no backend to collect or store anything.
- Only the most recent location is saved, in the browser's `localStorage` on the user's own device — never transmitted anywhere except to Open-Meteo to fetch the forecast.
- Device geolocation is requested only when the user chooses "use my location," with a clear fallback if permission is denied.
- Third-party disclosure: Open-Meteo logs IP address + coordinates in server logs for up to 90 days for technical/anti-abuse purposes, then deletes the detailed logs; it does not share this data with third parties. ([Open-Meteo Terms & Privacy](https://open-meteo.com/en/terms)) This should be stated plainly on the info screen since it's the one external party any data reaches.
- Potential feature: a "clear saved location" control on the info screen, letting the user remove what's stored about them on demand. Originated as a privacy-support detail, not yet decided whether it becomes the brief's "one additional feature" or stays a small addition alongside it.

## Decisions

- **Weather provider:** Open-Meteo (see Weather and technical evidence above for trade-offs against NWS).
- **Forecast range:** 7 days — covers the daily-routine and day-before-trip use cases from the context of use; matches NWS's native range even though Open-Meteo supports more, so we're not relying on forecast days that are typically low-confidence anyway.
- **Recommendation categories and rules:** 4 conditions (Clear/Rainy/Snowy/Windy) × 5 temperature bands (Hot/Warm/Mild/Cool/Cold), plus 3 independent reminders (umbrella, sunscreen, hydration) — see Weather and technical evidence above for exact thresholds.
- **Outfit structure:** hybrid of complete outfits and layered overlays — each temperature band has 3 complete outfit images (not separately swappable tops/bottoms), and each non-Clear condition (Rainy, Snowy, Windy) adds one small overlay accessory on top of whichever complete outfit is showing. Chosen over fully swappable clothing slots because: (a) pre-made "seasonal complete outfit" asset packs are easier to source than packs with guaranteed-to-align separate parts, and (b) it avoids the image-alignment risk of layering independently-drawn tops and bottoms.
- **Artwork approach:** licensed asset pack (not original or AI-generated). Original was ruled out due to limited drawing ability; AI-generation was ruled out because maintaining visual consistency across ~20 separate images that must align to one base character is flagged in current research as an unsolved problem, and would likely need as much manual cleanup as starting from a licensed pack. Candidates to inspect first: nonemo's "Character Creation Asset Pack" (CC0, vector style) and mothymeadows' "Character Creator Plug and Play" (CC BY 4.0, anime style) — next step is downloading and checking actual slot coverage against the estimate below before committing.
- **Art estimate** (based on the hybrid outfit structure): 1 base character + 15 complete outfit images (3 variations × 5 temperature bands) + 3–4 condition overlay accessories (Rainy, Snowy, Windy) + 4–6 weather condition icons + 3 reminder icons ≈ **25–30 total art pieces**, substantially fewer than the ~30–35 estimated under a fully swappable-parts structure.
- **Screen structure and visual direction:** to be finalized in `spec.md` using the hand-drawn screen designs; direction so far favors a Gas-app-style bold/simple color-blocked layout with weather/date up top and the character anchoring the bottom of the screen (Duolingo-style), per the References section.
- **Deployment method:** GitHub Pages, per the brief's recommendation and prior familiarity with it.
- **One additional feature:** a multi-day trip overview. When the user manually enters a new (trip) location, they can pick a range of dates rather than just one; the app shows a condensed overview across those days (limited to whatever falls within the 7-day forecast range), each day showing the weather range and one representative outfit (not the full randomized variation) for a quick glance. Selecting any individual day from that overview opens the normal single-day detail screen (full character, recommendation, and reminders, with its usual random-but-consistent variation). Directly justified by the trip-planning user story. The "clear saved location" privacy control remains a smaller addition alongside this, not competing with it for the "one additional feature" slot.

Once the recommendation categories are chosen, estimate the art needed: the character, three outfit variations per category, weather icons, and reminder icons. Use that estimate to choose the artwork approach.

## Revisions

Record new evidence or changed decisions and explain why they changed.

- **Precipitation threshold (2026-10-04, during specification):** changed from the "≥ 40–50%" range to a fixed **≥ 30%** for both the Rainy condition and the Umbrella reminder, per Developer's own experience that precipitation tends to actually occur around that probability. Like the temperature band boundaries, this is a judgment call rather than a cited figure.
- **Condition priority (2026-10-04, during specification):** when multiple condition thresholds are met at once, priority is **Snowy > Rainy > Windy > Clear** — snow and rain take precedence over wind, and wind conditions are treated as generally cold anyway.
- **Art pack selection (2026-10-04, during specification):** confirmed nonemo's "Character Creation Asset Pack" (CC0, vector style) over mothymeadows' "Character Creator Plug and Play." Developer checked nonemo's preview images directly and confirmed its outfit pieces are drawn on one consistent base-character body. Both packs were checked for jackets/coats or weather-specific items (umbrella, raincoat, wind gear) and neither has any — nonemo's 28 outfits are shirts (short/long sleeve), pants, shorts, and shoes only; mothymeadows' is a "summery beachy" pack with no documented weather gear either, and its deliverables are bundled for a Ren'Py visual novel (.rpy code, .psd source) rather than standalone web-ready assets, adding extraction work nonemo's pack doesn't require.
- **Condition overlay structure (2026-10-04, during specification):** dropped the planned on-character overlay accessory (umbrella, raincoat, wind element layered onto the outfit image) since no available pack supplies matching weather gear, and sourcing it from a different pack would reintroduce the alignment risk the licensed-pack decision was meant to avoid. Replaced with **atmospheric weather effects over the whole scene** (falling rain streaks, falling snowflakes, wind-swirl lines) that don't need to match the character's proportions, plus the written recommendation/reminder text for specific guidance (e.g. "it's rainy — bring an umbrella"). The Cold temperature band tops out at the pack's long-sleeve-and-pants combination; no literal jacket/coat is available in either pack checked.
- **Icon source (2026-10-04, during specification):** weather condition icons and reminder icons both sourced from Material Symbols (Google, Apache 2.0) rather than a separate icon pack — one license to track instead of two. Covers `sunny`/`rainy`/`snowing`/`air`/`wind_power` for conditions and `umbrella`/`water_drop` for two of the three reminders; no dedicated "sunscreen" icon exists in the set, so the Sunscreen reminder reuses the `sunny` icon, distinguished by its own text label (consistent with the WCAG 1.4.1/text-alternative requirements already in `spec.md`).

## Approval

The Developer reviews the sources and decisions, corrects this file, and explicitly approves it before specification begins.

**Approved 2026-10-04** — reviewed section by section (Context of use, User story, References, Weather and technical evidence, Decisions, Revisions) and explicitly approved as recorded above.

## Saving the transcript

After the Developer approves the research, ask them to enter `save transcript`. When directed, save the complete conversation as `transcripts/research-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.
