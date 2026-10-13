# Technical Specification

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Turn the approved research, project brief, and hand-drawn screen designs into testable requirements.

## Instructions for the Developer

Make and approve the product decisions, draw every proposed screen, provide the drawings to the Agent, and keep this file current as the intended result changes.

To begin, open the project repository in a fresh chat and enter:

`Read ./spec.md and help me begin the Project 3 specification.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, `research.md`, and this file. Review the screen drawings the Developer provides. Ask one focused question at a time, surface gaps and trade-offs without inventing requirements, and keep the specification concise and testable.

## Goal

Help a college student quickly see what to wear for a given US location and date (today or within the 7-day forecast range), without separately checking the weather and judging appropriate clothing themselves.

User stories (from `research.md`):
- As a college student getting ready in the morning, I want to quickly see what to wear based on today's forecast, so that I don't have to check the weather separately and guess at appropriate clothing.
- As a college student planning a trip, I want to check the forecast for my destination the day before I leave, so that I can pack and dress appropriately for weather different from where I currently am.

## Screen designs

Draw every proposed screen by hand, in both phone and laptop layouts, on paper, a tablet, a whiteboard, or another hand-drawing surface. Save photos or exports in `reference/`, provide them to the Agent, and link them here. Use the drawings to define layout, hierarchy, controls, navigation, and important interaction states.

Hand-drawn screens (phone layout on the left, laptop layout on the right, in each drawing):

- `reference/App drawing.PNG`
  1. **Main screen** — date, location, weather summary (temperature range shown as "70–80"), character below.
  2. **Date picker** — list of forecast days (e.g. "1-1", "1-2", "1-3"), each row showing a weather icon and short weather text; lets the user pick which forecast day to view on the main screen.
  3. **Trip overview** (vacation screen, the brief's additional feature) — a selected date range (e.g. "1-2", "1-3"), each row showing a weather icon and short weather text for that day.
- `reference/App drawing 2.jpg`
  4. **Info screen** — Creator, Open-Meteo (weather source), Recommendation rules, Privacy, Art credit.
  5. **Location entry** — manual text entry for a US location ("Location: location").
  6. **Error states** — three separate states: "Weather / Character not found," "Location: denied" (device location permission denied), "Weather unavailable" (service error).

**Navigation and interaction states:**

- **Main screen** — clicking/tapping the location text opens the location entry screen. Clicking/tapping the date text opens the date picker screen.
- **Date picker screen** (list of forecast days within the 7-day range):
  - Touch: tapping a day opens the main screen showing that day's weather. Press-and-hold on a day enters multi-select mode for building a vacation date range.
  - Mouse: right-click on a day opens the main screen for that day. Left-click on a day enters multi-select mode for building a vacation date range.
  - In multi-select mode, tapping/clicking additional days adds them to the range; an "OK" button confirms the selection and opens the trip overview screen for the chosen dates (limited to the 7-day forecast range, per `research.md`).
- **Trip overview screen** — selecting a day within the overview opens the main screen showing that day's weather.

- **Info screen** and **location entry screen** — a back button returns to the main screen.
- **Loading state** — no dedicated loading screen was drawn. While weather data is fetching, the app shows its blank background (color-blocked layout, no character) with a small generic spinner (not weather- or character-specific, no extra art variations needed).

## Requirements

Translate every fixed brief requirement and the selected research-driven feature into a testable requirement. Define the chosen behavior, content, controls, current and forecast data, responsive layout, accessibility, error handling, privacy, credits, and deployment. The main screen should make clear the location, date, units, data source, and whether conditions are current or forecast. Include an acceptance check for each requirement.

### Location

- **R1. Manual entry.** The user can type a US location by name on the location entry screen; Open-Meteo's geocoding API resolves it to coordinates and a display name. Typing a state after the city, as an abbreviation or full name with or without a comma ("Austin, TX", "Austin TX", "Austin Texas"), limits the matches to that state. When a result is named exactly what was typed, only those are listed. Acceptance check: typing a valid US city (e.g. "Austin, TX" or "Austin TX") returns a matching location and loads its weather; "Springfield MO" lists only Missouri results.
- **R2. Device location.** The user can request their device's location instead of typing one. The browser's Geolocation API supplies coordinates, which are passed directly to Open-Meteo's forecast API; the main screen displays the generic label "Your location" (no reverse-geocoded place name, per the trade-off above). Acceptance check: granting location permission loads weather for the device's actual coordinates and shows "Your location" in place of a place name.
- **R3. Most recent location only.** Only the single most recently used location (manual or device) is saved, in the browser's `localStorage`; selecting a new location overwrites it. Acceptance check: after selecting location B following location A, reloading the page shows location B, not A.
- **R4. Clear saved location.** The info screen includes a control to clear the saved location from `localStorage`. Acceptance check: pressing it removes the stored location, and the next visit prompts for a location again.

### Date selection

- **R5. Today or forecast date.** The user can view today's weather or any date within Open-Meteo's forecast for the next 7 days, chosen via the date picker screen. Acceptance check: selecting a date 3 days out shows that day's forecast data, not today's.
- **R6. Date out of range.** Dates outside today through day 7 are not selectable on the date picker. Acceptance check: no control exists to reach day 8 or a past date.

### Main screen content

- **R7. Core info.** The main screen shows the location name (or "Your location"), the selected date, the temperature range in Fahrenheit, and whether the data is current or a forecast (e.g. "Today" vs. a specific future date label). Acceptance check: viewing a forecast date shows that date, not "Today."
- **R8. Data source credit.** A small, muted text label reading "Open-Meteo" appears directly under the weather summary and temperature range, visually separated from the character. Acceptance check: the label is present on every main-screen view and does not overlap or sit adjacent to the character.
- **R9. Character and outfit.** The character fills the lower portion of the screen, wearing the outfit variation selected by the current recommendation state; when condition is Rainy, Snowy, or Windy, an atmospheric weather effect (falling rain, falling snow, or wind-swirl lines) layers over the scene; Clear and Cloudy have no effect (see Recommendation state and data flow).
- **R10. Written recommendation and reminders.** A short written recommendation and any active reminder badges (umbrella, sunscreen, hydration) appear above the character, each reminder paired with an icon and a short text label (not color alone, per WCAG 1.4.1).

### Date picker and trip overview (additional feature)

- **R11. Date picker list.** Lists each selectable forecast day with a weather icon and brief condition text. Acceptance check: matches the live forecast for that day's primary condition.
- **R12. Single-day navigation.** Touch tap / mouse right-click on a day opens the main screen for that date.
- **R13. Vacation multi-select.** Touch press-and-hold / mouse left-click on a day enters multi-select mode; additional taps/clicks add more days to the range (bounded by the 7-day forecast window); an "OK" button confirms the selection.
- **R14. Trip overview screen.** Shows the selected date range, each day with a weather icon, brief condition text, and one representative outfit (not a random variation). Selecting a day opens the main screen for that date with its usual randomized-but-consistent variation. Acceptance check: a 3-day selection shows exactly 3 rows, each navigable to its own main-screen detail.

- **R30. Back from a chosen day.** (Added after usability testing; all three testers asked for it.) When a day is opened from the date picker or from a trip overview, the main screen shows a "Back" control that returns to that screen: the date picker, or the same trip overview with the same days. It is not shown on the main screen's normal first view. Acceptance check: pick 3 days, press OK, open one day, press Back: the same 3 rows appear; open a day from the date picker, press Back: the date picker appears.

### Info screen

- **R15. Disclosures.** Identifies the creator, states weather data comes from Open-Meteo (sourced from NOAA's GFS model for US locations), describes the recommendation rules and their basis, states privacy practices (see below), and lists art credits/licenses. Acceptance check: all five disclosures are present and readable.

### Loading and errors

- **R16. Loading state.** While weather data is being fetched, the screen shows its blank color-blocked background (no character) with a small generic spinner. Acceptance check: the spinner is visible immediately after a location/date change and disappears once data loads.
- **R17. Location permission denied.** Shows a clear "location access denied" state with a path to manual entry. Acceptance check: denying the browser's location prompt shows this state, not a blank or broken screen.
- **R18. Weather service error.** Shows a "weather unavailable" state (e.g. network failure, Open-Meteo error) with a retry option. Acceptance check: a simulated failed request shows this state.
- **R19. Missing/invalid location.** Shows a "character not found" / no-match state when manual entry matches no location. Acceptance check: typing a nonsense location shows this state instead of a blank screen or a crash.

### Responsive layout and accessibility

- **R20. Responsive layout.** The phone layout is usable one-handed (primary controls reachable by thumb, bottom-anchored where possible); the laptop layout uses the extra width for a side-by-side arrangement rather than a centered, scaled-up phone layout. Acceptance check: resizing the browser from phone to laptop width swaps layouts at a defined breakpoint without broken or overlapping content.
- **R21. Touch targets.** All interactive elements are at least 24×24 CSS pixels (WCAG 2.2 AA). Acceptance check: measured in browser dev tools.
- **R22. Contrast.** Text meets 4.5:1 contrast (3:1 for large text/icons) against its background (WCAG 2.2 AA). Acceptance check: verified with a contrast-checking tool on each color-blocked background used.
- **R23. Text alternatives.** Weather and reminder icons have text alternatives (the written recommendation/reminder text, structured so screen readers announce it with the icon). Acceptance check: a screen reader announces the recommendation text alongside each icon, not just "icon."
- **R24. Color not the only signal.** Reminder badges and any temperature color-coding pair color with an icon, label, or shape. Acceptance check: a grayscale screenshot of the main screen still conveys which reminders are active.

### Privacy

- **R25. No accounts, server, or analytics.** The app is static (GitHub Pages) with no backend. Acceptance check: no account/login UI exists; no analytics script is loaded.
- **R26. Local-only storage.** Only the most recent location and the per-date outfit and reminder wording choices (variant numbers 1-3, no personal data) are stored, in `localStorage`. The location is never transmitted anywhere except to Open-Meteo to fetch weather. Acceptance check: inspecting `localStorage` shows only the `location` key and `variants:<date>` keys; network tab shows no other destination receiving the location.
- **R27. Third-party disclosure.** The info screen states that Open-Meteo logs IP address and coordinates for up to 90 days for technical/anti-abuse purposes and does not share this data with third parties.

### Credits and deployment

- **R28. Art credits.** The info screen lists the licensed asset pack used and its license terms, per the Assets section below.
- **R29. Public deployment.** The app is deployed to a public HTTPS URL via GitHub Pages. Acceptance check: the URL loads the working app over HTTPS with no build step required by the visitor.

## Recommendation state and data flow

Define the weather inputs, recommendation categories, coded rules, and shared state. Weather values must come from the provider, and rules must follow the weather guidance cited in `research.md`. The selected location, date, and live weather data must produce one recommendation state that drives every visual and written output.

**Weather inputs** (fetched from Open-Meteo for the selected location and date): apparent ("feels like") temperature, precipitation probability, precipitation type, sustained wind speed, UV index, average daily cloud cover. (Open-Meteo has no heat index field; apparent temperature is used in its place, see Revisions.)

**Condition category** (one of five, checked in priority order — the first match wins):
1. **Snowy** — precipitation type = snow.
2. **Rainy** — precipitation probability ≥ 30%.
3. **Windy** — sustained wind ≥ 20 mph.
4. **Cloudy** — average daily cloud cover ≥ 60%.
5. **Clear** — none of the above (so a partly cloudy day is Clear).

**Temperature band** (one of five, by the average of the day's low and high apparent temperature): Hot (≥ 85°F), Warm (70–84°F), Mild (55–69°F), Cool (40–54°F), Cold (< 40°F).

**Reminders** (independent booleans, any number can be active at once): Umbrella (precipitation probability ≥ 30%), Sunscreen (UV index ≥ 3, unless precipitation probability ≥ 60%), Extra hydration (daily maximum apparent temperature ≥ 90°F).

**Recommendation state** — one object, recomputed whenever the location or date changes, that drives every visual and written output on the main screen and trip overview:

```
{
  location, date,
  condition,        // Snowy | Rainy | Windy | Cloudy | Clear
  temperatureBand,   // Hot | Warm | Mild | Cool | Cold
  reminders,         // array, any of: umbrella, sunscreen, hydration
  outfitVariant,     // 1-3, randomly chosen per temperatureBand (see Content variation)
  reminderVariants    // one randomly chosen wording index (1-3) per active reminder
}
```

**Rendering from state:** the character shows the complete outfit image for `temperatureBand` + `outfitVariant`; if `condition` is Rainy, Snowy, or Windy, the matching atmospheric effect (falling rain, falling snow, or wind-swirl lines) layers over the whole scene — not on the character itself; the weather icon reflects `condition`; the written recommendation text reflects `temperatureBand` and `condition` (and names the needed gear, e.g. "it's rainy — bring an umbrella," since no on-character rain gear exists); reminder badges render for each entry in `reminders`, each with its own icon and the wording selected by `reminderVariants`.

## Content variation

Define at least three outfit variations for each recommendation category and at least three wording variations for each reminder type. Define how outfit and reminder variations are chosen independently at random, and how a previously selected date keeps the same variations, including whether they persist after the page reloads.

- **Outfit variations**: each of the 5 temperature bands has 3 complete outfit images. When a date's recommendation state is first computed, one of the 3 is chosen at random, independently of any reminder wording choice.
- **Reminder wording variations**: each reminder type (umbrella, sunscreen, hydration) has 3 wording variations. Each active reminder on a given date independently gets its own randomly chosen wording.
- **Persistence**: the chosen outfit variant and reminder wording variants are stored in `localStorage`, keyed by date (e.g. `2026-10-07`). Returning to a previously viewed date — including after a full page reload — shows the same variations rather than re-rolling them. A date not yet viewed gets a fresh random choice the first time its recommendation state is computed, which is then stored the same way.

## Assets

List every art and graphical asset: the character, each outfit variation, icons, and any other visuals. For each, note where it appears, its format, and whether it will be created, generated, or licensed, with its credit or license.

The character and all outfit pieces come from nonemo's "Character Creation Asset Pack" (CC0, vector style, no attribution required) — confirmed to use one consistent base-character body across its outfit pieces. Condition (Rainy/Snowy/Windy) is communicated through atmospheric scene effects and written text instead of an on-character overlay accessory, since neither candidate pack includes weather-specific gear (see `research.md` Revisions). The Cold temperature band uses the same long-sleeve-and-pants coverage as Cool, in darker colors, plus a shivering face (closed eyes and clenched teeth) from the pack's face parts; no jacket/coat exists in the pack and no new art is made for it.

| Asset | Count | Appears | Format | Source |
|---|---|---|---|---|
| Base character | 1 | Main screen, trip overview | PNG/SVG (as provided by pack) | nonemo "Character Creation Asset Pack," CC0 |
| Complete outfit images (3 per temperature band × 5 bands, assembled by `scripts/build_outfits.py` from the pack's shirt, sleeve, and pants/shorts pieces; shoes are part of the bottoms) | 15 | Main screen, trip overview (1 representative per day) | PNG/SVG | nonemo "Character Creation Asset Pack," CC0 |
| Weather condition icons: `sunny` (Clear), `cloud` (Cloudy), `rainy` (Rainy), `snowing` (Snowy), `air`/`wind_power` (Windy) | 5 | Main screen, date picker, trip overview | SVG/font | Material Symbols (Google), Apache 2.0 |
| Reminder icons: `umbrella` (Umbrella), `water_drop` (Hydration), `sunny` reused (Sunscreen — distinguished by its own text label per R23, no dedicated "sunscreen" icon exists in the set) | 3 (2 unique + 1 reused) | Reminder badges on main screen | SVG/font | Material Symbols (Google), Apache 2.0 |
| Atmospheric weather effects (falling rain, falling snow, wind-swirl lines) | 3 | Layered over the whole scene when condition ≠ Clear | SVG/CSS animation | Can be custom-built (simple CSS/SVG animation), no license concern |
| Loading spinner | 1 | Loading state (all screens, during data fetch) | SVG/CSS | Custom-built (e.g. CSS animation), no license concern |

Total: 16 character-pack pieces + 7 unique icons + 3 atmospheric effects + 1 spinner ≈ **27 pieces**, consistent with the 25–30 estimate in `research.md`. The info screen's Art credit disclosure (R15/R28) names both nonemo's pack (CC0) and Material Symbols (Apache 2.0).

## Out of scope

Record features intentionally excluded from this project.

- **Arbitrary/past date selection** — only today through 7 days out is selectable; a free date-picker for past dates or dates beyond the forecast range was considered and set aside (per `research.md`).
- **Unit toggle** — Fahrenheit only, no Celsius option.
- **Reverse-geocoded place names for device location** — shows the generic label "Your location" instead (see Location requirements above); avoids adding a second geocoding integration.
- **Accounts, backend server, or analytics** — the app is fully static (GitHub Pages).
- **Extended-range or historical weather** — only the live 7-day forecast; no past-weather lookups even though Open-Meteo supports them.
- **Dedicated tablet layout** — the phone layout is fluid and expected to scale reasonably to tablets, but tablet is not a separate design target.
- **Fully swappable clothing slots** (independent tops/bottoms) — outfits are complete images per temperature band; condition is shown through atmospheric scene effects, not independently layered garments.

## Revisions

After implementation or testing, record requirement changes and the evidence that prompted them. Update the screen drawings when a material layout or interaction changes.

- **2026-10-10 — Heat index replaced by apparent temperature.** A live Open-Meteo forecast response (Austin, TX) contains no heat index field. The Extra hydration reminder now triggers on daily maximum apparent temperature ≥ 90°F, which already incorporates humidity. Developer chose this over computing the NWS heat index (Checkpoint 1).
- **2026-10-11 — Temperature band input defined.** The spec said "apparent temperature" without naming the daily value. The band now uses the average of the day's low and high apparent temperature, since most people are out during the middle of the day. Developer approved (Checkpoint 2).
- **2026-10-11 — Outfit art assembled; Cold distinguished by face.** The pack has no shoe pieces; shoes are built into the pants, shorts, and bare-legs bottoms. Cool and Cold would otherwise look identical, so Cold uses darker colors and a shivering face instead of added gear (Developer's idea, chosen over a custom scarf or beanie to keep the art consistent and avoid new assets). The 15 outfits are generated by `scripts/build_outfits.py` into `assets/outfits/` (skin `tint_2`, black hair, `cute` face; Cold uses closed eyes and clenched teeth). Developer approved the outfit sheet.
- **2026-10-11 — Sunscreen hidden on very wet days.** With real data, a day with a ~33% rain chance showed Rainy plus a sunscreen reminder, which read oddly. The Sunscreen reminder is now suppressed when precipitation probability ≥ 60%; below that, reminders stay independent. Developer chose this over keeping the rule unchanged or hiding sunscreen on every Rainy/Snowy day (Checkpoint 4).
- **2026-10-11 — R26 widened to include variant choices (Checkpoint 6).** The Persistence rule stores each date's outfit and wording variant numbers in `localStorage`, so "only the location" was inaccurate. R26 and the info screen's privacy text now say both are stored locally; neither contains personal data. Developer approved.
- **2026-10-11 — Cloudy condition added (verification of R11).** Comparing the date picker with Open-Meteo for Austin showed days its own data called overcast (weather code 3) or drizzly labelled "Clear" with a sun icon, which could read as wrong. A fifth condition, **Cloudy**, now sits between Windy and Clear in the priority order: average daily cloud cover ≥ 60% (Open-Meteo `cloud_cover_mean`, a judgment-call threshold like the others, chosen over the coarser `weather_code`, which marked a day overcast that averaged only 34% cloud). Cloudy has a gray-blue background (`#5A6772`, 5.8:1 with white text), the Material Symbols `cloud` icon (Apache 2.0), no atmospheric effect, and no extra recommendation sentence; reminders are unchanged (sunscreen still follows UV). "Clear" now explicitly means none of the other four. Evidence: Austin forecast of 2026-10-11 (cloud cover 34, 54, 44, 57, 2, 86, 63% across the 7 days). Developer approved.
- **2026-10-12 — R30 added: Back from a chosen day.** Usability testing with three peers (see `plan.md`): all three asked for a way to go back from a specific day, and the trip overview appeared not to "save" because there was no way to return to it. The main screen now shows a Back control when a day was opened from the date picker or a trip overview. Developer approved.
- **2026-10-12 — R1 widened: location search accepts a typed state (usability finding 2).** All three testers found that "Austin TX" returned nothing while "Austin, TX" worked; Open-Meteo's geocoder matches only the place name, and "Springfield MO" returned Wilbraham, Massachusetts. The app now splits the query into a city and an optional state (abbreviation or full name, comma or not), searches the city, and filters by state itself. It also lists only exact-name matches when any exist, because the geocoder returns alias and prefix matches ("Austin" returned Ardmore, Tennessee and Cazadero, California). Developer approved the behavior; the exact-name rule followed the Developer's observation of Ardmore in the results.
- **2026-10-11 — Main screen layout and styling decisions (Checkpoint 4).** Background color follows the condition (Clear orange, Rainy blue, Snowy slate blue, Windy teal), each at 5.7:1 or better against white text. The laptop layout is side-by-side (text column left, character right) per R20; the laptop drawing's centered stack is superseded. On phone, the date and location controls and a new "About" link to the info screen sit in a bottom bar for one-handed reach, so they no longer sit at the top as drawn. The summary and bottom controls sit on a 55% dark scrim above the effect layer so weather effects never hide text (black text was rejected: 3.2-3.7:1 on these backgrounds fails R22).

## Approval

The Developer reviews and explicitly approves this specification and its screen designs before planning begins.

**Approved 2026-10-04** — reviewed section by section (Goal, Screen designs, Requirements R1–R29, Recommendation state and data flow, Content variation, Assets, Out of scope) and explicitly approved as recorded above.

## Saving the transcript

After the Developer approves the specification, ask them to enter `save transcript`. When directed, save the complete conversation as `transcripts/spec-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.
