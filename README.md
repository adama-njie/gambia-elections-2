# Gambia Elections 2026

An independent, open-source civic analytics platform for The Gambia's presidential elections.
Covers the electoral record from 1996, the four blocs contesting **5 December 2026**, and a
transparent forecasting model that runs entirely in the browser.

> **Not affiliated with the Independent Electoral Commission, any political party, or any
> candidate.** Only the IEC can declare a result. Everything here is either a reported figure or a
> modelled estimate, and the interface labels which is which on every number.

---

## What this is

A tool for journalists, researchers, civil society and voters who want to understand the 2026
election rather than be told who will win. Three principles shape it:

1. **Provenance on every figure.** Four trust levels — official, reported, modelled, survey —
   displayed as a badge wherever a number appears. Nothing currently carries the *official* label,
   because the IEC has not published a machine-readable results archive. Claiming otherwise would be
   false, so the app does not.
2. **A model you can argue with.** The forecast is a documented Monte Carlo simulation, not a
   language model. Same inputs, same outputs, every time, on any machine, with no API key and no
   network call. Every coefficient is listed in the Methodology page.
3. **Uncertainty shown, not hidden.** Credible intervals, win probabilities capped at ">99%", and
   an explicit list of what the model cannot know.

## Features

- **Overview** — the structural story of the election, headline projection, latest poll, record since 1996.
- **The 2026 race** — the four blocs with members, formation dates and flagbearers; what changed since 2021; the IEC calendar; all published polling.
- **Forecast** — twelve scenario levers, five named presets, Monte Carlo simulation up to 50,000 iterations, driver breakdown, area projection, CSV export, shareable scenario URLs.
- **Regions** — schematic choropleth of the seven administrative areas with a full accessible data table.
- **History** — every election 1996–2021, party trend lines, turnout, and a competitiveness analysis of the combined opposition vote.
- **Methodology** — the complete model specification, every coefficient, and the known limitations.
- **Data** — provenance rules, CSV and JSON downloads, and all sources.

Plus: four interface languages, full offline support, dark mode, keyboard-navigable map, print
styles, code-split routes, and a 98-test suite that enforces the data contract, the translation
contract and the offline behaviour.

## The 2026 landscape

The all-party coalition talks collapsed in mid-2026, producing one consolidated incumbent alliance
and three separate opposition platforms:

| Bloc | Lead party | Flagbearer | Formed |
| --- | --- | --- | --- |
| NPP-led Alliance | NPP | Adama Barrow | Sept 2026 (GDC July, APP-Sobeyaa Sept) |
| Gambia First Coalition | UDP | Ousainou Darboe | 14 August 2026 |
| Coalition 2026 | UNITE | Talib Ahmed Bensouda | 20 August 2026 |
| Team Gambia Grand Coalition | PDOIS | not yet confirmed | 12 September 2026 |

The central analytical question is **vote transfer**. Barrow, Kandeh and Faal together polled 67.55
per cent in 2021, which is the basis for the claim that the election is settled — but an alliance is
not a merger, and no Gambian precedent supports perfect transfer. The model puts transfer efficiency
and opposition consolidation on the front panel rather than burying them in a single number.

## Quick start

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Typecheck, then production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run icons` | Regenerate the PWA icons from `scripts/make-icons.mjs` |

No environment variables and no API keys are needed. The app is fully static and routes with a hash
router, so `dist/` deploys unchanged to GitHub Pages, any shared host, or a USB stick.

## Project structure

```
src/
  data/          Datasets, each row carrying provenance and citations
    sources.ts     The source registry — every citation resolves here
    elections.ts   National results 1996–2021 + modelled area baselines
    parties.ts     Parties and the four 2026 coalitions
    candidates.ts  The 2026 field
    polls.ts       Published polling and the IEC calendar
    regions.ts     The seven administrative areas
    mapGeometry.ts Schematic map layout
    data.test.ts   The data contract, enforced
  lib/
    forecast.ts      The model: priors, fundamentals, simulation, projection
    forecast.test.ts Model invariants
    rng.ts           Seeded RNG, so results are reproducible
    format.ts        Formatting and provenance labels
  i18n/
    en.ts          The complete English dictionary — the source of truth
    mnk.ts         Mandinka draft
    wo.ts          Wolof draft
    ff.ts          Pulaar draft
    authoritative.ts  Keys that are always served in English, and why
    core.ts        Locale registry and the explicit-fallback resolver
    react.tsx      Provider, useT, and <T> for sentences containing links
    i18n.test.ts   The translation contract, enforced
  pwa/
    sw-template.js Service worker source, templated at build time
    useOffline.ts  Registration, update detection, cache-age reporting
    sw.test.ts     Worker behaviour: precache, cleanup, offline fallback
  components/    Layout, shared UI, map, slider, language switcher, offline notice
  pages/         The seven routes
  hooks/         Theme, URL-backed scenario state
```

## Languages

The interface ships in **English, Mandinka, Wolof and Pulaar**, switchable from the header and
remembered per device. English is complete and is the source of truth: `src/i18n/en.ts` defines
every key, and the type system makes it impossible to reference one that is not there.

**The other three are unreviewed drafts, and they must be reviewed by native speakers before
launch.** They were drafted without native-speaker review, they are labelled as drafts in the
language switcher, and a banner on every page tells the reader exactly how much of the interface is
actually in their language ("50 of 416 interface strings have a Wolof draft"). That number comes
from `coverage()`, so it is a fact about the build and it falls as review proceeds.

Three rules govern how the drafts behave, and they are enforced by `src/i18n/i18n.test.ts`:

1. **Fallback is explicit, never silent.** Every lookup returns *why* it returned what it did —
   `translated`, `fallback-en`, `english-authoritative` or `missing`. Longer analytical prose has no
   draft and falls back to English by design; the reader is told, and the count says how often.
2. **A gap beats a guess.** Where no confident rendering existed, the key is left out rather than
   filled in. Mandinka and Pulaar deliberately do not yet translate *Modelled* or *Survey*: those
   two words are what stop a projection being read as a count, and the English word is safer than a
   wrong one. They are the highest-priority review targets in the repository.
3. **The disclaimers stay in English.** The statistical and legal notices — "this is a projection,
   not a prediction", "nothing on this platform is official", the area-data warnings — are listed in
   `src/i18n/authoritative.ts` and are *always* served in English, even if a translation is added.
   A mistranslated disclaimer is worse than an untranslated one. What a non-English reader gets
   instead is a short, plain-language gloss in their own language ("This is not a result. Only the
   IEC can say who has won."), rendered directly above the English wording, plus a note saying why
   that block is in English.

Exports (CSV, JSON) are always English whatever the interface language is. They are cited artefacts,
and a column header that changes with a reader's language setting cannot be cited. Dates and numbers
stay in `en-GB` for the same reason, and because no CLDR data exists for these three languages.

### If you speak Mandinka, Wolof or Pulaar

Reviewing one of `src/i18n/mnk.ts`, `wo.ts` or `ff.ts` is the single most useful contribution anyone
can make to this project right now. Each file is a flat list of short strings with the English in
`en.ts` beside it. Treat every entry as a question, not an assertion. Where a borrowing from English
or French is what speakers actually use for a civic or statistical term, prefer the borrowing over a
coined native word. Nothing outside these files encodes anything about the language, including its
orthography.

## Offline

The app is an installable PWA that works fully offline after one visit — genuinely fully, because
the forecast model runs on the device and the app makes no API calls at any point.

- `src/pwa/sw-template.js` is the service worker; a ~40-line plugin in `vite.config.ts` bakes the
  real hashed asset manifest into it at build time and writes `dist/sw.js`. Hand-rolled rather than
  `vite-plugin-pwa` because the app is deliberately dependency-light and the only thing a generic
  plugin would add here is that manifest.
- **Every** build asset is precached, not just the entry chunk — about 830 kB uncompressed, roughly
  250 kB over the wire, once. The routes are code-split, so precaching only the entry would leave
  someone who installed from the Overview page without the Forecast page the moment they lost
  signal.
- Navigations are network-first with a short timeout and fall back to the cached shell; hashed
  assets are cache-first; the Google Fonts stylesheet and its files are cached too, so the
  typography does not collapse offline.
- An update is downloaded in the background and **waits**: the app offers a reload rather than
  swapping versions underneath a reader mid-sentence.

### Honest staleness

A cached copy is only useful if the reader knows how old it is. The worker records when it saved
the copy, and the interface reports it:

- the footer and the Data page always state when the dataset was last updated
  (`src/data/freshness.ts`, maintained by hand — rebuilding the site does not make the figures
  newer, so the build timestamp is never presented as a data date);
- going offline raises a banner naming the date and time this copy was saved on this device;
- past a week it says how many days ago that was and links to the IEC.

If the save date cannot be determined, the interface says so rather than guessing.

`src/pwa/sw.test.ts` executes the real worker source against a mock worker global and covers
precaching, atomic install, old-cache cleanup, the offline shell fallback (including deep links),
serving a lazily-loaded route chunk from cache, and the update handshake.

## The data contract

`src/data/data.test.ts` is not a formality. The suite fails if:

- any election claims `official` provenance,
- any area-level breakdown is labelled anything other than `modelled`,
- a citation does not resolve to a registered source,
- vote counts contradict the reported shares or the stated valid-vote total,
- turnout cannot be derived from the register and the valid vote,
- a named winner is not the leading candidate in that result,
- a candidate is marked `nominated` before the IEC nomination window closes,
- a coalition references an unknown party or a non-existent flagbearer.

This is how the project keeps its central promise. If you change the data, run `npm test`.

## Contributing

Corrections to the verified record take priority over everything else. If a figure is wrong or a
citation is missing, that is a bug.

**The single most valuable contribution anyone can make** is official IEC results at area or
polling-station level. The EU Election Observation Mission's 2021 final report notes that the IEC
published no results on its website and recommends publication disaggregated by polling station.
Until that exists, this project's area figures are modelled estimates. The data layer is built to
accept real figures as a drop-in replacement, and those estimates are designed to be deleted the day
real data arrives.

## Limitations

Read the Methodology page in full before citing anything. In short: the model is **not validated
against out-of-sample elections** — there are only six on record, two of them meaningfully
competitive. Its coefficients are reasoned priors, not fitted parameters. There are two published
polls, from one organisation, both with large undecided shares. The candidate field is not certified
until nominations close on 14 November 2026. No area-level results data exists publicly. The model
does not attempt ethnic or linguistic modelling, and makes no attempt to quantify electoral
integrity. The Mandinka, Wolof and Pulaar interface translations are unreviewed drafts and should
not be treated as a translation until native speakers have checked them.

## Licence

Released for public use. Carry the provenance labels with any figures you republish — a modelled
estimate that loses its label becomes misinformation.
