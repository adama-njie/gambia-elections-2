# Methodology

This document is the canonical specification of the forecast model and the data rules. The
Methodology page in the app renders the same content for readers; this file is the reference for
anyone reading or changing the code.

**The headline limitation, stated first:** this model is *not statistically validated against
out-of-sample Gambian elections*. There are only six presidential elections on record and only two
under a genuinely competitive multi-party configuration. Its coefficients are reasoned priors
informed by the 1996–2021 record, not fitted parameters with standard errors. It is a structured way
to reason about scenarios and to make assumptions explicit. The credible intervals it reports
describe uncertainty *within the model*, not the full uncertainty about the world.

---

## 1. Why this is not an AI model

An earlier version of this tool asked a large language model to predict the result. That approach
was abandoned deliberately:

- **Reproducibility.** The same inputs must always produce the same outputs so a published figure
  can be audited. A sampled language model cannot guarantee that.
- **Explicability.** When a projection moves, a reader is entitled to know which assumption moved it
  and by how much.
- **Availability.** No API key, no network call, no running cost. The model executes in the browser,
  so it works on a poor connection and cannot be rate-limited away during a campaign.
- **Accountability.** A wrong coefficient can be pointed at, argued with and corrected. A wrong
  intuition inside a language model cannot.

The model lives in `src/lib/forecast.ts` with invariants pinned by `src/lib/forecast.test.ts`.

## 2. Data rules

Four provenance levels, displayed as a badge on every figure in the interface:

| Level | Meaning |
| --- | --- |
| `official` | Extracted from a primary IEC document. Used for area-level results 1996-2021. |
| `reported` | Figures the IEC announced, recorded consistently by observer missions and standard secondary tables. All national results 1996–2021. |
| `modelled` | Produced by this platform. All area-level breakdowns and all forecasts. |
| `poll` | Survey data from a named pollster, with sample size and margin of error attached. |

Nothing carries `official` because the EU Election Observation Mission's 2021 final report records
that the IEC published no results on its website, and recommends publication disaggregated by
polling station. Until that archive exists, claiming official provenance would be false.

These rules are enforced by `src/data/data.test.ts`, not by convention. See the README for the full
list of conditions that fail the build.

## 3. The model

### 3.1 Structural prior

Start from the verified 2021 national result:

| Candidate | Party | Share |
| --- | --- | --- |
| Adama Barrow | NPP | 53.23 |
| Ousainou Darboe | UDP | 27.72 |
| Mama Kandeh | GDC | 12.32 |
| Halifa Sallah | PDOIS | 3.77 |
| Essa M. Faal | Independent | 2.00 |
| Abdoulie Ebrima Jammeh | NUP | 0.96 |

Then:

- **Incumbent bloc** = `NPP + transferEfficiency × (GDC + IND)`. At 100 per cent transfer this is
  67.55, the arithmetic case.
- **Untransferred remainder** splits by `leakageToAbstention`: 60 per cent demobilises or scatters
  to the residual, 40 per cent defects to opposition blocs in proportion to their size.
- **UDP base** splits between Darboe and Bensouda by `uniteSplitOfUdp` (30 per cent), since UNITE has
  no prior presidential result to build on. NUP's 0.96 goes to Bensouda, reflecting the UNITE–NUP
  memorandum.
- **PDOIS bloc** carries its 3.77 forward.

Shares are normalised to 100 at every step.

### 3.2 Polling prior

The most recent published survey, with undecided voters allocated by `undecidedToChallengers`. The
remainder goes to the incumbent; the challenger share is split in proportion to existing support.

Kandeh's and Faal's polled shares are folded into the residual rather than attributed to a standing
candidate, since neither now contests.

### 3.3 Blend

Linear interpolation by `pollWeight`. At 0 you see the pure 2021 arithmetic; at 100 the polls alone.

### 3.4 Fundamentals

Applied as a signed swing on the incumbent, measured against reference conditions, then mirrored
onto challengers in proportion to their size, except the youth-mobilisation component, 60 per cent
of which accrues specifically to UNITE.

| Driver | Coefficient | Reference |
| --- | --- | --- |
| Incumbent approval | +0.18 pts/pt | 50% |
| Inflation | −0.45 pts/pt | 7.5% |
| GDP growth | +0.35 pts/pt | 5.0% |
| Youth unemployment | −0.12 pts/pt | 38% |
| Infrastructure rating | +0.10 pts/pt | 60% |
| Turnout level | −0.08 pts/pt | 89.34% |
| Youth mobilisation | −0.15 pts/pt | 0 |
| New and diaspora voters | −1.00 pts/pt | 0 |

Inflation carries the largest economic coefficient because price levels are felt far more directly
than aggregate growth. The turnout term is negative on the incumbent because higher turnout in The
Gambia has historically brought in newer, younger and more urban voters.

### 3.5 Opposition consolidation

The mechanism that decided 2016 and whose absence decided 2021, so it gets its own lever rather than
being buried in transfer efficiency.

The strongest challenger stays on the ballot. The other two withdraw in proportion to
`oppositionConsolidation`, and `consolidationRetention` (82 per cent) of their vote follows the
agreed flagbearer; the rest demobilises. The 82 per cent figure comes from the 2016 precedent, where
coalition transfer was good but not total.

### 3.6 Simulation

Each iteration:

1. Re-draw `transferEfficiency` from `N(set value, 7)`, clamped to [0, 100].
2. Recompute central shares under that draw.
3. Add a **correlated national error** `N(0, 3.4)` to the incumbent, mirrored across the field. Set
   wide on purpose: in 2016 a 22-year incumbent lost an election almost nobody forecast.
4. Add **idiosyncratic per-bloc error** `N(0, 2.1)`.
5. Add **extra variance on UNITE** `N(0, 2.6)`, which has never contested a presidential election.
6. Clamp at zero and normalise.

Report means, medians, 80 and 95 per cent credible intervals, and the share of iterations each bloc
leads. Randomness comes from a seeded mulberry32 generator with Box-Muller normals, so a given seed
always reproduces the same figures.

Win probabilities are never displayed as a flat 0 or 100: a bloc leading every simulation is
reported as ">99%". The model is not validated well enough to claim certainty.

### 3.7 Regional projection

Uniform national swing applied to the modelled 2021 area baseline, mapped from parties onto 2026
blocs. The one place areas diverge from a pure uniform swing is the UNITE share of the UDP base,
scaled by urbanisation between 0.6× and 1.4× the national figure, reflecting Bensouda's municipal
base.

Projected vote counts apportion the national projection by each area's share of the 2021 register,
against an assumed 2026 register of 1,040,000. The IEC has not published the final register, so
those counts inherit that assumption's error.

## 4. The area baselines

The IEC publishes a constituency-level results table for every presidential election since 1996,
at https://iec.gm/download/. Each document carries a real text layer, so the figures can be read
directly rather than estimated. `scripts/extract_iec.py` in the companion data repository reads
them, reconstructs the table from word coordinates, and validates each year against that
document's own printed national total before the figures are used.

Extraction is validated exactly for 2006, 2011, 2016 and 2021, is within 0.3 per cent for 1996,
and could not be completed for the 2001 Upper River block, which is missing cells in the published
PDF's text layer. 2001 therefore carries national figures only.

Until October 2026 this platform instead carried modelled area-level estimates, on the basis that
the EU Election Observation Mission's 2021 report recorded that the IEC published no results on its
website. That is no longer true. The estimates have been replaced. For the record, they were wrong
by an average of 7.9 points per area in 2021 and by 17.5 points in Upper River, which is exactly
why they were labelled modelled and never official.

## 5. Known limitations

- **No validated area-level data.** See above.
- **Six elections, two systems.** 1996–2011 were held under conditions international observers
  repeatedly declined to call competitive. The model largely does not calibrate on them.
- **Two polls.** Both from one organisation, both with large undecided shares, the most recent with
  fieldwork ending before the September alliance with Essa Faal.
- **An unresolved field.** Nominations close 14 November 2026. Team Gambia had not publicly
  confirmed its flagbearer, and has said that person may stand as an independent.
- **No ethnic or linguistic modelling.** Gambian voting has well-documented ethno-regional patterns.
  This platform does not model them: the individual-level data does not exist publicly, and a civic
  tool that forecasts how ethnic groups will vote risks doing harm that outweighs its analytical
  value. Urbanisation is the only sub-national differentiator used.
- **No modelling of electoral integrity.** The model assumes the count reflects the votes cast. It
  is not a verification tool.

## 6. Changing the model

If you change a coefficient, change it here and in `MODEL_CONSTANTS` together, and say why. The
Methodology page reads its numbers directly from `MODEL_CONSTANTS`, so the app cannot drift out of
sync with the code, but this document can, so keep it current.
