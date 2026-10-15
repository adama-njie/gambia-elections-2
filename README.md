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

Plus: dark mode, keyboard-navigable map, print styles, offline-capable, code-split routes, and a
59-test suite that enforces the data contract.

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
  components/    Layout, shared UI, map, slider
  pages/         The seven routes
  hooks/         Theme, URL-backed scenario state
```

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
integrity.

## Licence

Released for public use. Carry the provenance labels with any figures you republish — a modelled
estimate that loses its label becomes misinformation.
