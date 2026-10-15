import { CANDIDATES_2026, MODELLED_CANDIDATES } from '@/data/candidates';
import { BASELINE_ELECTION } from '@/data/elections';
import { LATEST_POLL } from '@/data/polls';
import { REGIONS } from '@/data/regions';
import type {
  BlocForecast,
  ForecastDriver,
  ForecastOutput,
  RegionalForecast,
  ScenarioParams,
} from '@/types';
import { gaussianFactory, mean, mulberry32, percentileSorted } from './rng';

/**
 * The 2026 forecast model.
 *
 * Deliberately not an LLM. A national election tool has to be reproducible,
 * auditable, free to run and available offline, and it has to be able to say
 * exactly why a number moved. Every coefficient below is a stated
 * assumption, documented in docs/METHODOLOGY.md, and every one of them is
 * reachable from the UI.
 *
 * Structure:
 *   1. Build two independent priors for the four blocs' vote shares:
 *      a structural prior from the 2021 result plus coalition arithmetic,
 *      and a polling prior from the most recent published survey.
 *   2. Blend them by `pollWeight`.
 *   3. Apply fundamentals (approval, prices, growth, jobs, turnout) as a
 *      signed swing against the incumbent, redistributed to challengers.
 *   4. Simulate, adding correlated national error plus per-bloc error plus
 *      uncertainty about how well coalition votes actually transfer.
 *   5. Project the national swing down onto the seven administrative areas.
 */

export const CANDIDATE_IDS = [...MODELLED_CANDIDATES] as string[];
const INCUMBENT = 'barrow';
const OTHER = 'other';

/** All series the model tracks, including the residual "other" bucket. */
const SERIES = [...CANDIDATE_IDS, OTHER];

/* ------------------------------------------------------------------ */
/* Model constants: every one of these is an assumption               */
/* ------------------------------------------------------------------ */

export const MODEL_CONSTANTS = {
  /**
   * Share of the UDP's 2021 vote that the model assumes has moved to
   * UNITE in the absence of any polling, reflecting Bensouda's split from
   * the UDP and his urban municipal base. Scaled by urbanisation at
   * regional level.
   */
  uniteSplitOfUdp: 0.3,
  /**
   * Of the votes that fail to transfer to an alliance flagbearer, the share
   * that stays home or scatters to minor candidates rather than defecting to
   * a rival bloc. 2016 and 2021 both suggest most of the leakage is
   * demobilisation, not defection.
   */
  leakageToAbstention: 0.6,
  /** Points of incumbent share per point of approval above 50. */
  approvalCoefficient: 0.18,
  /** Points of incumbent share lost per point of inflation above the 2021-26 average. */
  inflationCoefficient: 0.45,
  /** Points gained per point of real GDP growth above trend. */
  gdpCoefficient: 0.35,
  /** Points lost per point of youth unemployment above baseline. */
  youthUnemploymentCoefficient: 0.12,
  /** Points gained per point of infrastructure approval above 60. */
  infrastructureCoefficient: 0.1,
  /**
   * Points of incumbent share lost per point of turnout above the 2021
   * level. Higher turnout in The Gambia has historically brought in newer,
   * younger and more urban voters, who lean against the incumbent.
   */
  turnoutCoefficient: 0.08,
  /** Points lost per point of extra youth turnout, most of it going to UNITE. */
  youthTurnoutCoefficient: 0.15,
  /** Share of the youth-turnout effect that accrues specifically to UNITE. */
  youthEffectToUnite: 0.6,
  /** Reference values the fundamentals are measured against. */
  baseline: {
    inflation: 7.5,
    gdpGrowth: 5.0,
    youthUnemployment: 38,
    infrastructureRating: 60,
    turnout: 89.34,
  },
  /** Simulation error terms, in points of national share. */
  error: {
    /** Correlated national error on the incumbent. Wide, because 2016 happened. */
    nationalSd: 3.4,
    /** Idiosyncratic per-bloc error. */
    blocSd: 2.1,
    /** Uncertainty on transfer efficiency, in points of the 0-100 lever. */
    transferSd: 7.0,
    /** Extra error applied to UNITE, which has no prior presidential result. */
    newEntrantSd: 2.6,
  },
  /**
   * When opposition blocs consolidate, not every supporter follows. This is
   * the share of a withdrawing bloc's vote that actually reaches the agreed
   * flagbearer; the remainder demobilises or scatters. Set from the 2016
   * precedent, where coalition transfer was good but not total.
   */
  consolidationRetention: 0.82,
  /** Regional urban weighting for the UNITE split: 0.6 rural floor, +0.8 per unit urban share. */
  uniteUrbanFloor: 0.6,
  uniteUrbanGain: 0.8,
  /** Assumed 2026 register, pending the IEC's final figure. */
  assumedRegister2026: 1_040_000,
} as const;

export const DEFAULT_SCENARIO: ScenarioParams = {
  incumbentApproval: 52,
  inflation: 9.5,
  gdpGrowth: 5.8,
  youthUnemployment: 41,
  infrastructureRating: 64,
  turnout: 87,
  youthTurnoutSwing: 2,
  transferEfficiency: 72,
  undecidedToChallengers: 55,
  pollWeight: 50,
  newVoterEffect: 1.5,
  oppositionConsolidation: 0,
};

type Shares = Record<string, number>;

function normalise(shares: Shares): Shares {
  const total = Object.values(shares).reduce((sum, v) => sum + Math.max(0, v), 0);
  if (total <= 0) return shares;
  const out: Shares = {};
  for (const key of Object.keys(shares)) {
    out[key] = (Math.max(0, shares[key] ?? 0) / total) * 100;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Step 1a. Structural prior from the 2021 result                      */
/* ------------------------------------------------------------------ */

/** 2021 national shares keyed by party. */
function shares2021(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const row of BASELINE_ELECTION.national) {
    out[row.party] = (out[row.party] ?? 0) + row.share;
  }
  return out;
}

/**
 * The incumbent alliance's arithmetic case: Barrow's own 2021 vote plus the
 * GDC and Essa Faal blocs that have since joined him. The president's claim
 * that this settles the election is exactly the `transferEfficiency = 100`
 * corner of this model, which is why the lever is front and centre.
 */
export function structuralPrior(transferEfficiency: number): Shares {
  const s = shares2021();
  const te = Math.max(0, Math.min(1, transferEfficiency / 100));
  const { uniteSplitOfUdp, leakageToAbstention } = MODEL_CONSTANTS;

  const absorbed = (s.GDC ?? 0) + (s.IND ?? 0);
  const transferred = absorbed * te;
  const leaked = absorbed - transferred;

  const udpBase = s.UDP ?? 0;
  const darboe = udpBase * (1 - uniteSplitOfUdp);
  const bensoudaBase = udpBase * uniteSplitOfUdp + (s.NUP ?? 0);
  const pdois = s.PDOIS ?? 0;

  // Leakage: most of it demobilises or scatters; the rest defects to the
  // opposition blocs in proportion to their existing size.
  const scattered = leaked * leakageToAbstention;
  const defecting = leaked - scattered;
  const oppTotal = darboe + bensoudaBase + pdois;
  const share = (v: number) => (oppTotal > 0 ? (v / oppTotal) * defecting : 0);

  return normalise({
    barrow: (s.NPP ?? 0) + transferred,
    darboe: darboe + share(darboe),
    bensouda: bensoudaBase + share(bensoudaBase),
    'pdois-flagbearer': pdois + share(pdois),
    other: scattered,
  });
}

/* ------------------------------------------------------------------ */
/* Step 1b. Polling prior                                              */
/* ------------------------------------------------------------------ */

/**
 * The latest published poll, with undecided voters allocated. Undecided
 * shares in Gambian polling are large (17 per cent in August 2026), so how
 * they are allocated matters more than the headline numbers.
 */
export function pollingPrior(undecidedToChallengers: number): Shares {
  const poll = LATEST_POLL;
  const toChallengers = Math.max(0, Math.min(1, undecidedToChallengers / 100));
  const base: Shares = {
    barrow: poll.shares.barrow ?? 0,
    darboe: poll.shares.darboe ?? 0,
    bensouda: poll.shares.bensouda ?? 0,
    'pdois-flagbearer': poll.shares['pdois-flagbearer'] ?? 0,
    other: poll.shares.other ?? 0,
  };

  const challengerKeys = ['darboe', 'bensouda', 'pdois-flagbearer'];
  const challengerTotal = challengerKeys.reduce((sum, k) => sum + (base[k] ?? 0), 0);
  const toChallengerPool = poll.undecided * toChallengers;
  const toIncumbent = poll.undecided - toChallengerPool;

  const out: Shares = { ...base };
  out.barrow = (out.barrow ?? 0) + toIncumbent;
  for (const key of challengerKeys) {
    const weight = challengerTotal > 0 ? (base[key] ?? 0) / challengerTotal : 1 / challengerKeys.length;
    out[key] = (out[key] ?? 0) + toChallengerPool * weight;
  }
  return normalise(out);
}

/* ------------------------------------------------------------------ */
/* Step 2-3. Blend and apply fundamentals                              */
/* ------------------------------------------------------------------ */

/** The signed fundamentals swing on the incumbent, broken out by driver. */
export function computeDrivers(params: ScenarioParams): ForecastDriver[] {
  const c = MODEL_CONSTANTS;
  const b = c.baseline;
  const raw: ForecastDriver[] = [
    {
      label: 'Incumbent approval',
      effect: (params.incumbentApproval - 50) * c.approvalCoefficient,
      direction: 'incumbent',
    },
    {
      label: 'Cost of living',
      effect: -(params.inflation - b.inflation) * c.inflationCoefficient,
      direction: 'incumbent',
    },
    {
      label: 'Economic growth',
      effect: (params.gdpGrowth - b.gdpGrowth) * c.gdpCoefficient,
      direction: 'incumbent',
    },
    {
      label: 'Youth unemployment',
      effect: -(params.youthUnemployment - b.youthUnemployment) * c.youthUnemploymentCoefficient,
      direction: 'incumbent',
    },
    {
      label: 'Infrastructure record',
      effect: (params.infrastructureRating - b.infrastructureRating) * c.infrastructureCoefficient,
      direction: 'incumbent',
    },
    {
      label: 'Turnout level',
      effect: -(params.turnout - b.turnout) * c.turnoutCoefficient,
      direction: 'incumbent',
    },
    {
      label: 'Youth mobilisation',
      effect: -params.youthTurnoutSwing * c.youthTurnoutCoefficient,
      direction: 'incumbent',
    },
    {
      label: 'New and diaspora voters',
      effect: -params.newVoterEffect,
      direction: 'incumbent',
    },
  ];
  return raw
    .map((d) => ({ ...d, direction: d.effect >= 0 ? ('incumbent' as const) : ('opposition' as const) }))
    .sort((a, b2) => Math.abs(b2.effect) - Math.abs(a.effect));
}

/**
 * Central expectation before simulation error: the blended prior with the
 * fundamentals swing applied and redistributed.
 */
export function centralShares(params: ScenarioParams): Shares {
  const w = Math.max(0, Math.min(1, params.pollWeight / 100));
  const structural = structuralPrior(params.transferEfficiency);
  const polling = pollingPrior(params.undecidedToChallengers);

  const blended: Shares = {};
  for (const key of SERIES) {
    blended[key] = (1 - w) * (structural[key] ?? 0) + w * (polling[key] ?? 0);
  }

  const drivers = computeDrivers(params);
  const totalSwing = drivers.reduce((sum, d) => sum + d.effect, 0);
  const youthSwing = drivers.find((d) => d.label === 'Youth mobilisation')?.effect ?? 0;

  const out: Shares = { ...blended };
  const before = out.barrow ?? 0;
  // Never let the swing drive a bloc below a floor; the incumbent alliance
  // has a real structural base and the model should not pretend otherwise.
  out.barrow = Math.max(5, before + totalSwing);
  const actualSwing = out.barrow - before;

  // Redistribute the mirror image of the incumbent's swing. The youth
  // component is weighted towards UNITE; the rest moves in proportion to
  // each challenger's existing size.
  const challengerKeys = ['darboe', 'bensouda', 'pdois-flagbearer'];
  const challengerTotal = challengerKeys.reduce((sum, k) => sum + (blended[k] ?? 0), 0);
  const youthPortion = Math.min(Math.abs(youthSwing), Math.abs(actualSwing)) * Math.sign(-actualSwing);
  const uniteBonus = youthPortion * MODEL_CONSTANTS.youthEffectToUnite;
  const generic = -actualSwing - uniteBonus;

  for (const key of challengerKeys) {
    const weight = challengerTotal > 0 ? (blended[key] ?? 0) / challengerTotal : 1 / challengerKeys.length;
    out[key] = Math.max(0.2, (out[key] ?? 0) + generic * weight + (key === 'bensouda' ? uniteBonus : 0));
  }

  return normalise(consolidateOpposition(out, params.oppositionConsolidation));
}

/**
 * Opposition consolidation. The strongest challenger stays on the ballot;
 * the other two withdraw in proportion to the lever, and
 * `consolidationRetention` of their vote follows. This is the mechanism that
 * decided 2016 and whose absence decided 2021, so it gets its own lever
 * rather than being buried in transfer efficiency.
 */
export function consolidateOpposition(shares: Shares, consolidation: number): Shares {
  const k = Math.max(0, Math.min(1, consolidation / 100));
  if (k <= 0) return shares;

  const challengerKeys = ['darboe', 'bensouda', 'pdois-flagbearer'];
  const ranked = challengerKeys
    .map((id) => ({ id, share: shares[id] ?? 0 }))
    .sort((a, b) => b.share - a.share);
  const lead = ranked[0];
  if (!lead) return shares;

  const out: Shares = { ...shares };
  let gathered = 0;
  let lost = 0;
  for (const bloc of ranked.slice(1)) {
    const moved = bloc.share * k;
    out[bloc.id] = bloc.share - moved;
    gathered += moved * MODEL_CONSTANTS.consolidationRetention;
    lost += moved * (1 - MODEL_CONSTANTS.consolidationRetention);
  }
  out[lead.id] = (out[lead.id] ?? 0) + gathered;
  out.other = (out.other ?? 0) + lost;
  return normalise(out);
}

/* ------------------------------------------------------------------ */
/* Step 4. Simulation                                                  */
/* ------------------------------------------------------------------ */

export interface RunOptions {
  iterations?: number;
  seed?: number;
}

export function runForecast(params: ScenarioParams, options: RunOptions = {}): ForecastOutput {
  const iterations = options.iterations ?? 10_000;
  const seed = options.seed ?? 20_261_205;
  const uniform = mulberry32(seed);
  const gauss = gaussianFactory(uniform);
  const err = MODEL_CONSTANTS.error;

  const samples: Record<string, number[]> = {};
  for (const key of SERIES) samples[key] = [];
  const margins: number[] = [];
  const wins: Record<string, number> = {};
  for (const key of CANDIDATE_IDS) wins[key] = 0;
  let closeCount = 0;

  for (let i = 0; i < iterations; i += 1) {
    // Transfer efficiency is itself uncertain: re-draw it each iteration.
    const teDraw = Math.max(
      0,
      Math.min(100, params.transferEfficiency + gauss() * err.transferSd),
    );
    const drawParams: ScenarioParams = { ...params, transferEfficiency: teDraw };
    const central = centralShares(drawParams);

    // Correlated national error moves the incumbent against the field.
    const national = gauss() * err.nationalSd;
    const draw: Shares = {};
    for (const key of SERIES) {
      const idiosyncratic = gauss() * err.blocSd;
      const entrant = key === 'bensouda' ? gauss() * err.newEntrantSd : 0;
      const nationalTerm = key === INCUMBENT ? national : -national / CANDIDATE_IDS.length;
      draw[key] = Math.max(0, (central[key] ?? 0) + nationalTerm + idiosyncratic + entrant);
    }
    const final = normalise(draw);

    for (const key of SERIES) samples[key]!.push(final[key] ?? 0);

    const ranked = CANDIDATE_IDS.map((id) => ({ id, share: final[id] ?? 0 })).sort(
      (a, b) => b.share - a.share,
    );
    const first = ranked[0]!;
    const second = ranked[1]!;
    wins[first.id] = (wins[first.id] ?? 0) + 1;
    const gap = first.share - second.share;
    margins.push(gap);
    if (gap < 2) closeCount += 1;
  }

  const blocs: BlocForecast[] = CANDIDATE_IDS.map((id) => {
    const candidate = CANDIDATES_2026.find((c) => c.id === id);
    const sorted = [...samples[id]!].sort((a, b) => a - b);
    return {
      candidate: id,
      name: candidate?.name ?? id,
      party: candidate?.party ?? 'OTHER',
      coalition: candidate?.coalition ?? null,
      color: candidate?.color ?? '#B0BEC5',
      mean: mean(sorted),
      median: percentileSorted(sorted, 50),
      p10: percentileSorted(sorted, 10),
      p90: percentileSorted(sorted, 90),
      p2_5: percentileSorted(sorted, 2.5),
      p97_5: percentileSorted(sorted, 97.5),
      winProbability: ((wins[id] ?? 0) / iterations) * 100,
    };
  }).sort((a, b) => b.mean - a.mean);

  const centre = centralShares(params);
  const projectedVotes = Math.round(
    MODEL_CONSTANTS.assumedRegister2026 * (params.turnout / 100),
  );

  return {
    blocs,
    regions: projectRegions(centre, params, projectedVotes),
    expectedMargin: mean(margins),
    tooCloseToCall: (closeCount / iterations) * 100,
    iterations,
    seed,
    projectedTurnoutVotes: projectedVotes,
    drivers: computeDrivers(params),
  };
}

/* ------------------------------------------------------------------ */
/* Step 5. Regional projection                                         */
/* ------------------------------------------------------------------ */

/**
 * Uniform national swing, applied to the modelled 2021 regional baseline
 * and mapped from parties onto 2026 blocs. The UNITE share of the UDP base
 * is scaled by each area's urbanisation, which is the one place the model
 * lets regions diverge from a pure uniform swing.
 */
export function projectRegions(
  nationalShares: Shares,
  params: ScenarioParams,
  projectedVotes: number,
): RegionalForecast[] {
  const te = Math.max(0, Math.min(1, params.transferEfficiency / 100));
  const c = MODEL_CONSTANTS;
  const baseline2021 = BASELINE_ELECTION.regional;
  const totalRegister = REGIONS.reduce((sum, r) => sum + r.registeredVoters2021, 0);

  // National bloc baseline built the same way, so the swing is a clean delta.
  const nationalBase = structuralPrior(params.transferEfficiency);

  return REGIONS.map((region) => {
    const row = baseline2021.find((r) => r.region === region.code);
    const s = row?.shares ?? {};
    const uniteSplit =
      c.uniteSplitOfUdp * (c.uniteUrbanFloor + c.uniteUrbanGain * region.urbanShare);

    const absorbed = (s.GDC ?? 0) + (s.IND ?? 0);
    const regionBase: Shares = normalise({
      barrow: (s.NPP ?? 0) + absorbed * te,
      darboe: (s.UDP ?? 0) * (1 - uniteSplit),
      bensouda: (s.UDP ?? 0) * uniteSplit + (s.NUP ?? 0),
      'pdois-flagbearer': s.PDOIS ?? 0,
      other: absorbed * (1 - te),
    });

    const projected: Shares = {};
    for (const key of SERIES) {
      const delta = (nationalShares[key] ?? 0) - (nationalBase[key] ?? 0);
      projected[key] = Math.max(0, (regionBase[key] ?? 0) + delta);
    }
    const final = normalise(projected);

    const ranked = CANDIDATE_IDS.map((id) => ({ id, share: final[id] ?? 0 })).sort(
      (a, b) => b.share - a.share,
    );

    return {
      region: region.code,
      shares: final,
      leader: ranked[0]!.id,
      margin: ranked[0]!.share - (ranked[1]?.share ?? 0),
      projectedVotes: Math.round(projectedVotes * (region.registeredVoters2021 / totalRegister)),
    };
  });
}

/* ------------------------------------------------------------------ */
/* Scenario presets                                                    */
/* ------------------------------------------------------------------ */

export interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  params: ScenarioParams;
}

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'central',
    name: 'Central scenario',
    description:
      'Current economic indicators, a partially effective incumbent alliance, and polls given equal weight with the 2021 baseline.',
    params: DEFAULT_SCENARIO,
  },
  {
    id: 'arithmetic',
    name: 'The arithmetic case',
    description:
      'The president’s own framing: every GDC and APP-Sobeyaa vote from 2021 transfers intact to the alliance, and the 2021 result is the only guide.',
    params: {
      ...DEFAULT_SCENARIO,
      transferEfficiency: 100,
      pollWeight: 0,
      undecidedToChallengers: 40,
      oppositionConsolidation: 0,
    },
  },
  {
    id: 'fragmented',
    name: 'Three-way opposition split',
    description:
      'The alliance holds together and the three opposition blocs each run a full campaign without consolidating. The 2006 pattern.',
    params: {
      ...DEFAULT_SCENARIO,
      transferEfficiency: 85,
      turnout: 82,
      youthTurnoutSwing: 0,
      pollWeight: 60,
      oppositionConsolidation: 0,
    },
  },
  {
    id: 'cost-of-living',
    name: 'Cost-of-living election',
    description:
      'Prices dominate the campaign, approval of the incumbent record falls, and younger urban voters turn out in force.',
    params: {
      ...DEFAULT_SCENARIO,
      inflation: 16,
      incumbentApproval: 42,
      youthUnemployment: 47,
      turnout: 91,
      youthTurnoutSwing: 7,
      undecidedToChallengers: 72,
      newVoterEffect: 3.5,
      oppositionConsolidation: 25,
    },
  },
  {
    id: 'late-unity',
    name: 'Late opposition unity',
    description:
      'A single opposition flagbearer emerges before polling day, as in 2016, while discipline inside the incumbent alliance frays. The scenario the arithmetic case assumes away.',
    params: {
      ...DEFAULT_SCENARIO,
      transferEfficiency: 60,
      incumbentApproval: 46,
      turnout: 90,
      youthTurnoutSwing: 6,
      undecidedToChallengers: 75,
      newVoterEffect: 3,
      oppositionConsolidation: 85,
    },
  },
];
