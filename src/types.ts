/**
 * Core domain types for the Gambia Elections platform.
 *
 * Design rule: every quantitative datum in this app carries a `Provenance`
 * tag. The UI must never present a modelled estimate with the same visual
 * weight as a verified official figure.
 */

/** How much a number can be trusted. Surfaced in the UI on every figure. */
export type Provenance =
  /** Published by the IEC or a primary official record. */
  | 'official'
  /** Reported consistently by credible secondary sources (press, observer missions). */
  | 'reported'
  /** Produced by this app's model from official inputs. Not a real-world observation. */
  | 'modelled'
  /** Survey data from a named pollster, with its own margin of error. */
  | 'poll';

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  /** ISO date, or year when that is all that is known. */
  date: string;
}

/* ------------------------------------------------------------------ */
/* Geography                                                           */
/* ------------------------------------------------------------------ */

export type RegionCode = 'BJL' | 'KMC' | 'WCR' | 'NBR' | 'LRR' | 'CRR' | 'URR';

export interface Region {
  code: RegionCode;
  /** Name as the IEC uses it. */
  name: string;
  /** Common alternative name, e.g. "Brikama" for West Coast Region. */
  altName?: string;
  /** Local Government Area seat. */
  seat: string;
  /** Projected population. */
  population: number;
  /** Registered voters at the 2021 presidential election. */
  registeredVoters2021: number;
  /** Number of National Assembly constituencies in the area. */
  constituencies: number;
  /** Rough urban share, 0-1. Drives the urban/rural model term. */
  urbanShare: number;
}

/* ------------------------------------------------------------------ */
/* Parties, coalitions, candidates                                     */
/* ------------------------------------------------------------------ */

export interface Party {
  /** Acronym used as the stable key throughout the app. */
  id: string;
  name: string;
  founded?: number;
  leader?: string;
  color: string;
  /** Short description of the party's platform or position. */
  profile?: string;
  active: boolean;
}

/** A 2026 electoral bloc: one flagbearer, many member organisations. */
export interface Coalition {
  id: string;
  name: string;
  /** Party id of the lead party, or null for a genuinely joint platform. */
  leadParty: string | null;
  flagbearer: string;
  /** Party ids and movement names that signed on. */
  members: string[];
  /** ISO date the alliance was formed or announced. */
  formed: string;
  color: string;
  /** How settled the alliance is. Drives the vote-transfer efficiency prior. */
  cohesion: 'formal' | 'announced' | 'contested';
  summary: string;
  sources: string[];
}

export interface Candidate2026 {
  id: string;
  name: string;
  /** Party id. */
  party: string;
  /** Coalition id, or null if standing alone. */
  coalition: string | null;
  role: string;
  bio: string;
  /** Vote share this candidate won in 2021, if they stood. */
  share2021?: number;
  color: string;
  status: 'declared' | 'nominated' | 'prospective' | 'withdrawn';
}

/* ------------------------------------------------------------------ */
/* Historical results                                                  */
/* ------------------------------------------------------------------ */

export interface CandidateResult {
  candidate: string;
  party: string;
  votes: number;
  share: number;
}

export interface RegionalShare {
  region: RegionCode;
  /** Party id -> vote share (0-100). */
  shares: Record<string, number>;
  turnout: number;
  provenance: Provenance;
}

export interface ElectionResult {
  year: number;
  date: string;
  registeredVoters: number | null;
  validVotes: number | null;
  turnout: number | null;
  national: CandidateResult[];
  /** Regional detail. Empty when no breakdown exists at any trust level. */
  regional: RegionalShare[];
  winner: string;
  winningParty: string;
  /** Margin between first and second place, in points. */
  margin: number;
  provenance: Provenance;
  sources: string[];
  context: { title: string; description: string };
}

/* ------------------------------------------------------------------ */
/* Polling                                                             */
/* ------------------------------------------------------------------ */

export interface Poll {
  id: string;
  pollster: string;
  commissionedBy?: string;
  /** ISO date fieldwork ended. */
  fieldworkEnd: string;
  sampleSize: number;
  /** Margin of error in points, if published. */
  marginOfError?: number;
  /** Candidate id -> share. Undecided tracked separately. */
  shares: Record<string, number>;
  undecided: number;
  sources: string[];
  note?: string;
}

/* ------------------------------------------------------------------ */
/* Election calendar                                                   */
/* ------------------------------------------------------------------ */

export interface TimelineEvent {
  id: string;
  /** ISO date, or start of the window. */
  date: string;
  /** ISO date the window closes, for multi-day phases. */
  endDate?: string;
  title: string;
  description: string;
  kind: 'legal' | 'campaign' | 'poll' | 'result';
  sources: string[];
}

/* ------------------------------------------------------------------ */
/* Forecast model                                                      */
/* ------------------------------------------------------------------ */

export interface ScenarioParams {
  /** Approval of the incumbent's record, 0-100. */
  incumbentApproval: number;
  /** Annual headline inflation, %. */
  inflation: number;
  /** Real GDP growth, %. */
  gdpGrowth: number;
  /** Youth (15-35) unemployment, %. */
  youthUnemployment: number;
  /** Rating of the public infrastructure programme, 0-100. */
  infrastructureRating: number;
  /** National turnout, %. */
  turnout: number;
  /** Extra turnout among under-35s relative to the national figure, points. */
  youthTurnoutSwing: number;
  /**
   * How efficiently a bloc's member-party votes actually transfer to its
   * flagbearer, 0-100. The central lesson of 2016 and 2021.
   */
  transferEfficiency: number;
  /** Share of undecided voters who break for challengers rather than split evenly, 0-100. */
  undecidedToChallengers: number;
  /**
   * How far the three opposition blocs consolidate behind their strongest
   * challenger before polling day, 0-100. 0 leaves three separate tickets;
   * 100 is a single opposition flagbearer, the 2016 arrangement.
   */
  oppositionConsolidation: number;
  /** Weight given to published polls versus the 2021 baseline, 0-100. */
  pollWeight: number;
  /** Diaspora and new-registrant effect on the opposition, points. */
  newVoterEffect: number;
}

export interface BlocForecast {
  /** Candidate id. */
  candidate: string;
  name: string;
  party: string;
  coalition: string | null;
  color: string;
  /** Mean share across simulations. */
  mean: number;
  median: number;
  /** 80% credible interval. */
  p10: number;
  p90: number;
  /** 95% credible interval. */
  p2_5: number;
  p97_5: number;
  /** Share of simulations this bloc placed first. */
  winProbability: number;
}

export interface RegionalForecast {
  region: RegionCode;
  /** Candidate id -> mean share. */
  shares: Record<string, number>;
  leader: string;
  /** Lead over second place, in points. */
  margin: number;
  /** Projected votes cast in the region. */
  projectedVotes: number;
}

export interface ForecastDriver {
  label: string;
  /** Signed effect on the incumbent's share, in points. */
  effect: number;
  direction: 'incumbent' | 'opposition';
}

export interface ForecastOutput {
  blocs: BlocForecast[];
  regions: RegionalForecast[];
  /** Mean margin between first and second. */
  expectedMargin: number;
  /** Share of simulations where the gap between 1st and 2nd is under 2 points. */
  tooCloseToCall: number;
  iterations: number;
  seed: number;
  /** Projected total valid votes nationally. */
  projectedTurnoutVotes: number;
  /** Human-readable drivers, strongest first. */
  drivers: ForecastDriver[];
}
