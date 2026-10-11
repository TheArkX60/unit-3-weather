# Implementation Plan

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Turn the approved specification into an ordered, trackable build and verification plan.

## Instructions for the Developer

Set priorities, review the checklist, verify results rather than relying only on the Agent's report, and keep the project documents current as the work changes. Expect the build to take many rounds of testing and fixing; record material changes under Revisions.

To begin planning, open the project repository in a fresh chat and enter:

`Read ./plan.md and help me create the Project 3 implementation plan.`

After approving the plan, open the project repository in a fresh chat and enter:

`Read ./plan.md and help me implement the approved Project 3 plan in working checkpoints.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, `research.md`, `spec.md`, and this file, then inspect the relevant project files. Propose concrete tasks and checks without expanding the approved scope.

During implementation, follow the approved plan in working checkpoints and keep it current. Never mark approvals or items requiring Developer verification complete on the Developer's behalf.

## Approach

**Stack:** Vanilla HTML/CSS/JS (ES modules), no build step, no framework, no `package.json`. Matches the static/no-backend requirement (R25) and deploys as-is to GitHub Pages. Screens are plain DOM sections shown/hidden by a small router; no component library is needed for four screens plus error states.

**Structure:**
- `index.html` + one CSS file (color-blocked, breakpoint-driven layout per R20).
- `js/state.js` — the single recommendation-state object and its recompute function (condition → temperature band → reminders → variant selection), per spec's Recommendation state and data flow.
- `js/weather.js` — Open-Meteo geocoding + forecast fetch wrapper; isolates the one external dependency.
- `js/location.js` — manual entry, device geolocation, `localStorage` read/write/clear for the most recent location (R1–R4).
- `js/variants.js` — `localStorage` read/write for per-date outfit/reminder variant persistence (spec Content variation).
- `js/screens/` — one module per screen (main, date picker, trip overview, info, location entry, error states), each a render function driven entirely by the shared state.
- `assets/` — character/outfit art, icons, atmospheric effect SVG/CSS, spinner.

**Data flow:** location + date → `weather.js` fetch → raw weather values → `state.js` derives condition, temperature band, reminders → `variants.js` resolves (or assigns and stores) outfit/reminder variants for that date → one recommendation-state object → every screen renders from that object, never from raw weather or ad hoc logic.

**Dependencies:** Open-Meteo geocoding + forecast APIs (network); browser Geolocation API; `localStorage`; nonemo's CC0 character pack and Material Symbols icons (static assets, no runtime dependency).

**Task order and rationale:** assets and the weather/state layer come first since every screen renders from them; main screen (the core user story) before the secondary screens (date picker, trip overview) it depends on; error/loading states alongside the screens that trigger them, not bolted on after; accessibility and responsive layout checked per screen as it's built, then re-verified as a pass; deployment early enough to test the real GitHub Pages URL before usability testing, not just at the very end.

**Main risks:** Open-Meteo field names/units for apparent temperature, precipitation type, and heat index need confirming against the live API response before `state.js` is written against assumed field names; geolocation permission UX varies by browser and needs manual testing on a real phone; the multi-select touch (press-and-hold) vs. mouse (left-click) interaction on the date picker is the most novel UI piece and may need iteration once built.

## Checklist

### Approvals

- [x] Research approved
- [x] Specification approved
- [x] Plan approved

### Build

- [x] Create or source the assets listed in `spec.md`, starting early: 15 complete outfit images from nonemo's pack (3 × 5 temperature bands), 6 Material Symbols icons, 3 custom atmospheric effects, 1 spinner
- [ ] Use the approved screen drawings to guide layout and interaction work
- [ ] Keep one recommendation state driving every visual and written output

**Checkpoint 1 — static shell and weather data**
- [x] Static project scaffold (`index.html`, CSS, `js/` structure) with placeholder screens, committed and openable locally with no build step
- [x] `weather.js` fetches Open-Meteo geocoding and current + 7-day forecast for a hardcoded location, with fields logged to confirm real API field names/units for apparent temperature, precipitation probability/type, wind speed, UV index, and heat index

**Checkpoint 2 — recommendation state**
- [x] `state.js` computes condition (Snowy > Rainy > Windy > Clear), temperature band, and reminders from fetched weather, matching the spec's priority order and thresholds
- [x] `variants.js` assigns and persists outfit/reminder variants per date in `localStorage`; reloading or revisiting a date returns the same variants instead of re-rolling, per spec's Persistence rule

**Checkpoint 3 — location**
- [x] Manual location entry resolves via Open-Meteo geocoding to coordinates + display name (R1)
- [x] Device geolocation path fetches weather for device coordinates and labels it "Your location" (R2)
- [x] Most-recent-location persistence in `localStorage`, overwritten on each new selection (R3)

**Checkpoint 4 — main screen**
- [x] Main screen renders location, date, temperature range, Open-Meteo credit label, character + outfit variant, atmospheric effect overlay when condition ≠ Clear, written recommendation, and reminder badges — all from the one recommendation-state object (R7–R10)
- [x] Loading state (blank color-blocked background + spinner) shown while weather is fetching (R16)
- [x] Phone layout usable one-handed; laptop layout uses a side-by-side arrangement, not a scaled-up phone layout (R20)

**Checkpoint 5 — date picker and trip overview**
- [x] Date picker lists the 7 forecast days with icon + condition text, dates outside range unreachable (R5, R6, R11)
- [x] Single-day navigation: tap / right-click opens main screen for that date (R12)
- [x] Multi-select: press-and-hold / left-click enters range-building mode, additional taps/clicks extend it, "OK" confirms (R13)
- [x] Trip overview screen shows the selected range with one representative outfit per day, and opens the main screen's full detail on day selection (R14)

**Checkpoint 6 — info screen and error/location states**
- [x] Info screen with all five disclosures (creator, Open-Meteo/NOAA source, recommendation rules, privacy including the 90-day Open-Meteo retention note, art credits) and the clear-saved-location control (R4, R15, R27, R28)
- [x] Location permission denied, weather-unavailable-with-retry, and location-not-found states each render distinctly instead of a blank/broken screen (R17–R19)
- [x] Back navigation from info and location-entry screens returns to the main screen

**Checkpoint 7 — accessibility and responsive pass**
- [x] All interactive elements measured at ≥24×24 CSS px (R21)
- [x] Text/icon contrast checked against every color-blocked background used (R22)
- [x] Screen reader announces recommendation text alongside each icon (R23)
- [x] Grayscale screenshot check confirms reminder/condition meaning survives without color (R24)
- [x] Breakpoint swap between phone and laptop layouts verified with no overlapping/broken content

**Checkpoint 8 — deploy**
- [x] Deployed to GitHub Pages at a public HTTPS URL, loading with no build step required by the visitor (R29)

- [ ] Test and fix each checkpoint against the specification before starting the next
- [x] Commit meaningful working checkpoints

### Verify and revise

- [ ] Check every specification requirement
- [ ] Test multiple locations, current and forecast dates, recommendation categories, outfit and reminder variations, and failure states
- [ ] Verify that eligible outfit and reminder variations are selected independently rather than as fixed pairs
- [ ] Verify that returning to a previously selected date shows the same variations
- [ ] Test the deployed app, independently of the local version, on a real phone and a laptop, including both screens, accessibility, and one-handed controls
- [ ] Prepare the usability test below
- [ ] Test with three peers and record each session
- [ ] Add the chosen improvement to this checklist, and update `spec.md` if the intended result changes
- [ ] Implement, verify, and redeploy at least one meaningful revision

### Deliver

- [ ] Confirm all brief deliverables, sources, privacy information, and asset credits
- [ ] Save all chat transcripts
- [ ] Complete the debrief

## Requirement verification

Evidence status as of 2026-10-11. **Verified** means a check was run and recorded; **Open** means it still needs a check on the live site (https://thearkx60.github.io/unit-3-weather/). The Developer runs the Open rows and updates this table; the Agent does not mark them closed.

| Req | Acceptance check | Evidence so far | Status | To close |
|---|---|---|---|---|
| R1 | "Austin, TX" returns a match and loads weather | Developer, local (CP3) and live (CP8) | Verified | none |
| R2 | Device location loads weather and shows "Your location" | Developer, local (CP3) and live phone (CP8) | Verified | none |
| R3 | Selecting B after A, reload shows B | Developer, local: Dallas replaced Austin (CP3); live reload kept location (CP8) | Verified | none |
| R4 | Clear control removes saved location; next visit prompts | Developer, local (CP6) | Verified | optionally repeat on live |
| R5 | A date 3 days out shows that day's forecast, not today's | Day navigation works (CP5); data not compared to a source | Open | open a day 3 out and compare its range and condition to Open-Meteo's own page for the same coordinates |
| R6 | No control reaches day 8 or a past date | Date picker lists only 7 days (CP5); unit test drops out-of-range trip dates; Developer typed `#main/2030-01-01` and `#main/2020-01-01` on the live site (2026-10-11) and both showed Today | Verified | none |
| R7 | Location, date, F range, Today vs forecast label | Developer viewed today and forecast dates (CP4/5) | Verified | none |
| R8 | "Open-Meteo" label under summary, away from character | Developer (CP4) | Verified | none |
| R9 | Character in outfit from state; effect when not Clear | Developer, all 4 conditions x 5 bands via preview (CP4) | Verified | none |
| R10 | Recommendation and reminders with icon and text | Developer (CP4); automated icon/text pairing 0 failures (CP7) | Verified | none |
| R11 | Picker icon and text match the live forecast's primary condition | List viewed; comparison with Open-Meteo for Austin (2026-10-11) showed overcast days labelled Clear, so Cloudy was added (see `spec.md` Revisions); Developer confirmed Cloudy appears on localhost | Open | after the Cloudy change is deployed, compare the 7 rows to the expected table for Austin (conditions and ranges within about 2 F) |
| R12 | Tap / right-click opens that day | Developer: mouse and phone mode (CP5), live phone (CP8) | Verified | none |
| R13 | Hold / left-click starts multi-select; taps add; OK confirms | Developer: mouse and phone mode (CP5), live phone (CP8) | Verified | none |
| R14 | 3-day selection shows exactly 3 rows, each opens its day | Developer (CP5); unit test for 3 trip dates | Verified | none |
| R15 | All five disclosures present and readable | Developer reviewed About (CP6) | Verified | none |
| R16 | Spinner visible right after location/date change, gone after load | Spinner built and styled (CP4); never explicitly watched | Open | DevTools Network, throttle to Slow 3G, change date or location, confirm spinner then content |
| R17 | Denying location shows the denied state | Screen checked via `#error/denied` (CP6); real denial on live phone (CP8) | Verified | none |
| R18 | Failed request shows "weather unavailable" with retry | Screen seen via demo hook (CP6, hook now removed); real failure not yet tested | Open | DevTools Network: block request URL `api.open-meteo.com`, reload, confirm the screen; unblock, press Try again |
| R19 | Nonsense location shows "character not found" | Developer, `zzzzqq` (CP6) | Verified | none |
| R20 | Resizing swaps layouts at a defined breakpoint, nothing broken | Developer at rest on phone and tablet/laptop sizes (CP7); no overflow at 899 and 900px | Verified | none |
| R21 | All targets at least 24x24 px | Automated, 55 measurements, 0 failures (CP7) | Verified | none |
| R22 | 4.5:1 text, 3:1 large text/icons on each background | Automated WCAG formula incl. worst case behind effects, 0 failures (CP7) | Verified | optionally spot-check one background in DevTools' contrast picker |
| R23 | Screen reader announces text with each icon | Developer, Windows Narrator (CP7); automated pairing check | Verified | none |
| R24 | Grayscale view still conveys active reminders | Developer, Achromatopsia emulation (CP7) | Verified | none |
| R25 | No account UI; no analytics script | Agent static scan of the deployed `index.html` and all JS/CSS (2026-10-11): one script (`js/main.js`), no off-site resources loaded, no login UI | Agent-verified; Developer to confirm | optional: glance at the live Network tab (only GitHub Pages files and Open-Meteo) |
| R26 | localStorage holds only location and variant numbers; location sent only to Open-Meteo | Agent code scan (2026-10-11): the only storage keys are `location` and `variants:<date>`; the only network calls are to `api.open-meteo.com` and `geocoding-api.open-meteo.com` | Verified | none (Developer saw only the `location` and `variants:<date>` keys in DevTools on the live site, 2026-10-11) |
| R27 | Open-Meteo 90-day logging disclosed | Developer reviewed About (CP6) | Verified | none |
| R28 | Art credits and licenses listed | Developer reviewed About (CP6) | Verified | none |
| R29 | Public HTTPS URL loads the working app, no build | Developer, laptop and phone (CP8); Agent confirmed build and 200s | Verified | none |

### Other verification items from the checklist

| Check | Evidence so far | Status | To close |
|---|---|---|---|
| Multiple locations, current and forecast dates | Austin and Dallas, device location | Open | try at least 3 more places on the live site, for example Fairbanks AK (cold or snow), Miami FL (hot, rain), Chicago IL (wind), and compare the outfit and condition to the actual forecast |
| All recommendation categories | 4 conditions x 5 bands via preview; unit tests for thresholds | Verified | none |
| Outfit and reminder variations chosen independently | Unit test: all 9 outfit x wording pairs occur over 300 dates | Verified | none |
| Returning to a date shows the same variations | Unit test (50 reads); Developer revisited dates | Verified | none |
| Failure states | Not found, denied checked; unavailable screen seen via hook | Open | covered by R18 and R17 above |
| Deployed app on a real phone and a laptop | Developer, one-handed use, both screens (CP8) | Verified | optionally repeat Narrator on the deployed laptop version |

## Usability testing

Before testing, record the purpose, a few realistic tasks, non-leading prompts, and a consistent note format. For each session, use a non-identifying label and record the task, what the tester did or said, successes, barriers or questions, and possible changes. Keep observations separate from interpretations. After all three sessions, summarize the strongest findings and the improvement they support.

## Revisions

Record material plan changes and why they were made.

- **2026-10-10 — Checkpoint 1 done (Developer-verified in browser).** Live API check found no heat index field; hydration reminder now uses daily max apparent temperature ≥ 90°F (see `spec.md` Revisions). Asset pack unzipped directly into `assets/` (not a subfolder). `dev-check.html` is a temporary API check page; remove it once `state.js` exists.
- **2026-10-11 — Checkpoint 2 done (Developer-verified: all checks in `tests.html` pass).** Temperature band uses the average of the day's low and high apparent temperature (see `spec.md` Revisions). `tests.html` is a temporary dev page (about 50 checks); keep it until the app is stable, then remove.
- **2026-10-11 — Checkpoint 3 done (Developer-verified in browser).** Manual entry shows a list of US matches to choose from (Developer chose this over auto-picking the first match). Location and no-match problems show as inline text for now; the distinct error screens and the denied-permission re-test (browser remembers an earlier Allow, so the Developer must set the site's Location to Block) belong to Checkpoint 6. The clear-saved-location control also arrives with the info screen in Checkpoint 6.
- **2026-10-11 — 15 outfit images done and Developer-approved** (generated by `scripts/build_outfits.py`; Cold distinguished by a shivering face, see `spec.md` Revisions). `outfits.html` is a temporary review page.
- **2026-10-11 — All assets done and Developer-approved:** 6 Material Symbols icons (`assets/icons/`, unmodified, README credits Apache 2.0), 3 custom tiling SVG effects (`assets/effects/`) animated in CSS, and a CSS spinner. Effects freeze under `prefers-reduced-motion`. `assets-review.html` is a temporary review page; remove all review pages once the app is stable.
- **2026-10-11 — Checkpoint 4 done (Developer-verified in browser, phone and laptop widths).** Decisions: background color follows the condition; laptop layout is side-by-side (the laptop drawing showed a centered stack, which conflicted with R20 and the brief); on phone the date, location, and an added "About" link sit in a bottom bar for one-handed reach; text sits on a 55% dark scrim above the weather effect (black text failed contrast at 3.2-3.7:1; white text over an effect line passes at 5.3:1 worst case). Sunscreen reminder is hidden at 60%+ rain chance (see `spec.md` Revisions). **Temporary dev files to delete before delivery:** `js/demo.js`, `demo-links.html`, the two `demo` lines in `js/main.js`, `outfits.html`, `assets-review.html`, `dev-check.html`, `tests.html` (keep tests until the end), (the placeholder nav was removed in Checkpoint 6). Also temporary: the `?demo=unavailable` check at the top of `forecastFor` in `js/main.js`.
- **2026-10-11 — Checkpoint 5 done (Developer-verified in browser, mouse and phone mode).** Choices: trip range is any set of tapped days shown in date order; right-click on date rows opens the day (browser menu suppressed on rows only); a touch/mouse hint line and a "Plan a trip" button were added (keyboard and assistive-tech alternative to press-and-hold, not in the spec); list screens summarize days without rolling variants, so a date's random variants are only chosen when it is opened; trip rows use variant 1 of the band as the representative outfit. Debugging note: several stray `http.server` processes on port 8000 served stale files and hid CSS changes; `scripts/serve.py` (no-cache) now replaces them, run with `python scripts/serve.py`.
- **2026-10-11 — Checkpoint 6 done (Developer-verified in browser).** Info screen has the five disclosures plus Clear saved location; three separate error screens (character not found, location denied, weather unavailable with Try again) replace the earlier inline text; Back works on Info and Location; the placeholder nav was removed. R26 was widened to cover stored variant choices (see `spec.md` Revisions). **Still to verify:** the real browser-denial path could not be triggered by the Developer, so only the denied screen itself was checked (via `#error/denied`). Test it on a real phone by tapping "Don't Allow" on the location prompt, as part of the deployed-app phone test in Verify and revise.
- **2026-10-11 — Checkpoint 7 mostly done.** R21 (targets), R22 (contrast, including worst case with a white effect line behind the 55% scrim), image/icon text (R23), and horizontal overflow at 360/393/899/900/1280px all passed in `a11y-check.html` (55 measurements, 0 failures; Developer ran it). R23 was also checked by the Developer with Windows Narrator and R24 with Edge's Achromatopsia emulation; both passed. **Still open:** the breakpoint-swap item (visual check that nothing overlaps while resizing through 900px) awaits the Developer. `a11y-check.html` is a temporary dev page; remove before delivery.
- **2026-10-11 — Checkpoint 7 done.** Breakpoint swap checked by the Developer at rest on phone presets and tablet/laptop sizes (stacked layout below 900px, side-by-side from 900px). While dragging the DevTools device frame, a white strip and shifted content appeared; screenshot evidence showed it only during the drag and not at rest, so it was treated as a DevTools redraw artifact, not an app bug. The related fix kept: the main screen is now at least one screen tall (character height from the window height) so the colored background grows with content and short windows scroll instead of clipping. **Pending:** re-run `a11y-check.html` once after this CSS change (Developer).
- **2026-10-11 — Pre-deploy cleanup (Developer approved).** Removed the temporary dev files `js/demo.js`, `demo-links.html`, `outfits.html`, `assets-review.html`, `dev-check.html`, and `a11y-check.html`, plus the `?demo` hooks in `js/main.js`, so a public visitor cannot force fake weather. The a11y results stay recorded above; the removed pages are recoverable from commit `a65eefe`. `tests.html` and `scripts/` stay.
- **2026-10-11 — Checkpoint 8 done: deployed to https://thearkx60.github.io/unit-3-weather/** (GitHub Pages, `master` branch root, HTTPS enforced; Developer approved the cleanup and publishing). Agent verified the Pages build and that every file returns 200 over HTTPS with correct content types. Developer then verified the live app on a laptop and a real phone: location search, device location, date picker, trip overview, About, persistence after reload, `tests.html` passing, and the location-denied path. Note: `a11y-check.html` was deleted at cleanup, so the automated checks were not re-run after the final main-screen CSS change (visually re-checked by the Developer on phone and tablet/laptop sizes); the page and its helper are recoverable from commit `a65eefe` if a re-run is wanted.
- **2026-10-11 — Cloudy condition added (found while verifying R11).** The Developer chose to fix "overcast shown as Clear" now. Added a fifth condition, Cloudy (average cloud cover 60% or more, from Open-Meteo `cloud_cover_mean`), between Windy and Clear, with a gray-blue background, the Material Symbols `cloud` icon, no atmospheric effect, and no extra recommendation sentence. Changed `js/weather.js`, `js/state.js`, `js/text.js`, `js/screens/main.js`, `css/styles.css`, the About rules text, `assets/icons/`, and the tests (7 new checks; all pass). Developer verified on localhost that Cloudy shows for the cloudy days. Not yet pushed to the live site.
- **2026-10-11 — Sunscreen wording 3 changed** from "The sun's out, so sunscreen up." to "UV is high, so sunscreen up." The old line was wrong on Cloudy and Rainy days where the UV index still triggers the reminder. Developer approved.

## Saving transcripts

At the end of planning, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.

At the end of every implementation chat, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/build-YYYY-MM-DD_HHMMSS.md` using the same formatting.
