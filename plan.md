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
- [ ] Info screen with all five disclosures (creator, Open-Meteo/NOAA source, recommendation rules, privacy including the 90-day Open-Meteo retention note, art credits) and the clear-saved-location control (R4, R15, R27, R28)
- [ ] Location permission denied, weather-unavailable-with-retry, and location-not-found states each render distinctly instead of a blank/broken screen (R17–R19)
- [ ] Back navigation from info and location-entry screens returns to the main screen

**Checkpoint 7 — accessibility and responsive pass**
- [ ] All interactive elements measured at ≥24×24 CSS px (R21)
- [ ] Text/icon contrast checked against every color-blocked background used (R22)
- [ ] Screen reader announces recommendation text alongside each icon (R23)
- [ ] Grayscale screenshot check confirms reminder/condition meaning survives without color (R24)
- [ ] Breakpoint swap between phone and laptop layouts verified with no overlapping/broken content

**Checkpoint 8 — deploy**
- [ ] Deployed to GitHub Pages at a public HTTPS URL, loading with no build step required by the visitor (R29)

- [ ] Test and fix each checkpoint against the specification before starting the next
- [ ] Commit meaningful working checkpoints

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

## Usability testing

Before testing, record the purpose, a few realistic tasks, non-leading prompts, and a consistent note format. For each session, use a non-identifying label and record the task, what the tester did or said, successes, barriers or questions, and possible changes. Keep observations separate from interpretations. After all three sessions, summarize the strongest findings and the improvement they support.

## Revisions

Record material plan changes and why they were made.

- **2026-10-10 — Checkpoint 1 done (Developer-verified in browser).** Live API check found no heat index field; hydration reminder now uses daily max apparent temperature ≥ 90°F (see `spec.md` Revisions). Asset pack unzipped directly into `assets/` (not a subfolder). `dev-check.html` is a temporary API check page; remove it once `state.js` exists.
- **2026-10-11 — Checkpoint 2 done (Developer-verified: all checks in `tests.html` pass).** Temperature band uses the average of the day's low and high apparent temperature (see `spec.md` Revisions). `tests.html` is a temporary dev page (about 50 checks); keep it until the app is stable, then remove.
- **2026-10-11 — Checkpoint 3 done (Developer-verified in browser).** Manual entry shows a list of US matches to choose from (Developer chose this over auto-picking the first match). Location and no-match problems show as inline text for now; the distinct error screens and the denied-permission re-test (browser remembers an earlier Allow, so the Developer must set the site's Location to Block) belong to Checkpoint 6. The clear-saved-location control also arrives with the info screen in Checkpoint 6.
- **2026-10-11 — 15 outfit images done and Developer-approved** (generated by `scripts/build_outfits.py`; Cold distinguished by a shivering face, see `spec.md` Revisions). `outfits.html` is a temporary review page.
- **2026-10-11 — All assets done and Developer-approved:** 6 Material Symbols icons (`assets/icons/`, unmodified, README credits Apache 2.0), 3 custom tiling SVG effects (`assets/effects/`) animated in CSS, and a CSS spinner. Effects freeze under `prefers-reduced-motion`. `assets-review.html` is a temporary review page; remove all review pages once the app is stable.
- **2026-10-11 — Checkpoint 4 done (Developer-verified in browser, phone and laptop widths).** Decisions: background color follows the condition; laptop layout is side-by-side (the laptop drawing showed a centered stack, which conflicted with R20 and the brief); on phone the date, location, and an added "About" link sit in a bottom bar for one-handed reach; text sits on a 55% dark scrim above the weather effect (black text failed contrast at 3.2-3.7:1; white text over an effect line passes at 5.3:1 worst case). Sunscreen reminder is hidden at 60%+ rain chance (see `spec.md` Revisions). **Temporary dev files to delete before delivery:** `js/demo.js`, `demo-links.html`, the two `demo` lines in `js/main.js`, `outfits.html`, `assets-review.html`, `dev-check.html`, `tests.html` (keep tests until the end), and the temporary placeholder nav (`.dev-nav` in `index.html`) once Checkpoint 6 gives every screen real navigation.
- **2026-10-11 — Checkpoint 5 done (Developer-verified in browser, mouse and phone mode).** Choices: trip range is any set of tapped days shown in date order; right-click on date rows opens the day (browser menu suppressed on rows only); a touch/mouse hint line and a "Plan a trip" button were added (keyboard and assistive-tech alternative to press-and-hold, not in the spec); list screens summarize days without rolling variants, so a date's random variants are only chosen when it is opened; trip rows use variant 1 of the band as the representative outfit. Debugging note: several stray `http.server` processes on port 8000 served stale files and hid CSS changes; `scripts/serve.py` (no-cache) now replaces them, run with `python scripts/serve.py`.

## Saving transcripts

At the end of planning, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.

At the end of every implementation chat, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/build-YYYY-MM-DD_HHMMSS.md` using the same formatting.
