import { describe, expect, it } from 'vitest';
import {
  CANDIDATE_IDS,
  DEFAULT_SCENARIO,
  SCENARIO_PRESETS,
  centralShares,
  computeDrivers,
  consolidateOpposition,
  pollingPrior,
  runForecast,
  structuralPrior,
} from './forecast';
import type { ScenarioParams } from '@/types';

const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);

describe('structural prior', () => {
  it('sums to 100 at any transfer efficiency', () => {
    for (const te of [0, 25, 50, 72, 100]) {
      expect(sum(structuralPrior(te))).toBeCloseTo(100, 6);
    }
  });

  it('reproduces the arithmetic case at full transfer', () => {
    // Barrow 53.23 + GDC 12.32 + Faal 2.00 = 67.55 of the 2021 vote.
    const prior = structuralPrior(100);
    expect(prior.barrow).toBeCloseTo(67.55, 1);
  });

  it('gives the incumbent less as transfer efficiency falls', () => {
    const full = structuralPrior(100).barrow!;
    const half = structuralPrior(50).barrow!;
    const none = structuralPrior(0).barrow!;
    expect(full).toBeGreaterThan(half);
    expect(half).toBeGreaterThan(none);
  });

  it('splits the UDP base with UNITE rather than inventing votes', () => {
    const prior = structuralPrior(72);
    // Darboe plus Bensouda should not exceed the 2021 UDP+NUP base by much,
    // allowing for the defection share of alliance leakage.
    expect(prior.darboe! + prior.bensouda!).toBeLessThan(40);
    expect(prior.bensouda!).toBeGreaterThan(5);
  });
});

describe('polling prior', () => {
  it('sums to 100 and allocates all undecided voters', () => {
    for (const u of [0, 50, 100]) {
      expect(sum(pollingPrior(u))).toBeCloseTo(100, 6);
    }
  });

  it('moves share to the incumbent when undecided voters break his way', () => {
    expect(pollingPrior(0).barrow!).toBeGreaterThan(pollingPrior(100).barrow!);
  });
});

describe('opposition consolidation', () => {
  const base = { barrow: 50, darboe: 20, bensouda: 18, 'pdois-flagbearer': 4, other: 8 };

  it('is a no-op at zero', () => {
    expect(consolidateOpposition(base, 0)).toEqual(base);
  });

  it('concentrates the opposition vote behind the strongest challenger', () => {
    const out = consolidateOpposition(base, 100);
    expect(out.darboe!).toBeGreaterThan(base.darboe);
    expect(out.bensouda!).toBeLessThan(1);
    expect(sum(out)).toBeCloseTo(100, 6);
  });

  it('loses some vote to demobilisation rather than transferring it all', () => {
    const out = consolidateOpposition(base, 100);
    const oppositionBefore = base.darboe + base.bensouda + base['pdois-flagbearer'];
    const oppositionAfter = out.darboe! + out.bensouda! + out['pdois-flagbearer']!;
    expect(oppositionAfter).toBeLessThan(oppositionBefore);
  });
});

describe('fundamentals', () => {
  it('has no net effect at baseline values', () => {
    const neutral: ScenarioParams = {
      ...DEFAULT_SCENARIO,
      incumbentApproval: 50,
      inflation: 7.5,
      gdpGrowth: 5.0,
      youthUnemployment: 38,
      infrastructureRating: 60,
      turnout: 89.34,
      youthTurnoutSwing: 0,
      newVoterEffect: 0,
    };
    const total = computeDrivers(neutral).reduce((a, d) => a + d.effect, 0);
    expect(total).toBeCloseTo(0, 6);
  });

  it('penalises the incumbent for inflation', () => {
    const hot = computeDrivers({ ...DEFAULT_SCENARIO, inflation: 20 });
    const driver = hot.find((d) => d.label === 'Cost of living');
    expect(driver!.effect).toBeLessThan(0);
    expect(driver!.direction).toBe('opposition');
  });

  it('ranks drivers by absolute size', () => {
    const drivers = computeDrivers({ ...DEFAULT_SCENARIO, inflation: 25, gdpGrowth: 5.1 });
    for (let i = 1; i < drivers.length; i += 1) {
      expect(Math.abs(drivers[i - 1]!.effect)).toBeGreaterThanOrEqual(Math.abs(drivers[i]!.effect));
    }
  });
});

describe('central shares', () => {
  it('always sums to 100', () => {
    for (const preset of SCENARIO_PRESETS) {
      expect(sum(centralShares(preset.params))).toBeCloseTo(100, 6);
    }
  });

  it('never returns a negative share', () => {
    const extreme: ScenarioParams = {
      ...DEFAULT_SCENARIO,
      incumbentApproval: 0,
      inflation: 40,
      gdpGrowth: -10,
      youthUnemployment: 70,
      infrastructureRating: 0,
      turnout: 95,
      youthTurnoutSwing: 20,
      newVoterEffect: 15,
      transferEfficiency: 0,
    };
    for (const v of Object.values(centralShares(extreme))) {
      expect(v).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('runForecast', () => {
  const output = runForecast(DEFAULT_SCENARIO, { iterations: 2_000, seed: 42 });

  it('is reproducible for a given seed', () => {
    const again = runForecast(DEFAULT_SCENARIO, { iterations: 2_000, seed: 42 });
    expect(again.blocs.map((b) => b.mean)).toEqual(output.blocs.map((b) => b.mean));
  });

  it('differs for a different seed but stays close', () => {
    const other = runForecast(DEFAULT_SCENARIO, { iterations: 2_000, seed: 99 });
    expect(other.blocs[0]!.mean).not.toBe(output.blocs[0]!.mean);
    expect(Math.abs(other.blocs[0]!.mean - output.blocs[0]!.mean)).toBeLessThan(2);
  });

  it('returns win probabilities that sum to 100', () => {
    expect(output.blocs.reduce((a, b) => a + b.winProbability, 0)).toBeCloseTo(100, 6);
  });

  it('orders credible intervals correctly', () => {
    for (const bloc of output.blocs) {
      expect(bloc.p2_5).toBeLessThanOrEqual(bloc.p10);
      expect(bloc.p10).toBeLessThanOrEqual(bloc.median);
      expect(bloc.median).toBeLessThanOrEqual(bloc.p90);
      expect(bloc.p90).toBeLessThanOrEqual(bloc.p97_5);
    }
  });

  it('covers every modelled candidate exactly once', () => {
    expect(output.blocs.map((b) => b.candidate).sort()).toEqual([...CANDIDATE_IDS].sort());
  });

  it('produces regional shares that sum to 100 for all seven areas', () => {
    expect(output.regions).toHaveLength(7);
    for (const region of output.regions) {
      expect(sum(region.shares)).toBeCloseTo(100, 6);
      expect(region.margin).toBeGreaterThanOrEqual(0);
    }
  });

  it('apportions projected votes across regions to the national total', () => {
    const total = output.regions.reduce((a, r) => a + r.projectedVotes, 0);
    expect(Math.abs(total - output.projectedTurnoutVotes)).toBeLessThan(output.regions.length);
  });

  it('gives the incumbent a near-certain win in the arithmetic scenario', () => {
    const preset = SCENARIO_PRESETS.find((p) => p.id === 'arithmetic')!;
    const result = runForecast(preset.params, { iterations: 2_000, seed: 7 });
    expect(result.blocs[0]!.candidate).toBe('barrow');
    expect(result.blocs[0]!.winProbability).toBeGreaterThan(95);
  });

  it('makes the race genuinely competitive under late opposition unity', () => {
    const preset = SCENARIO_PRESETS.find((p) => p.id === 'late-unity')!;
    const result = runForecast(preset.params, { iterations: 4_000, seed: 7 });
    const leader = result.blocs[0]!;
    expect(leader.winProbability).toBeLessThan(97);
    expect(result.expectedMargin).toBeLessThan(
      runForecast(SCENARIO_PRESETS.find((p) => p.id === 'arithmetic')!.params, {
        iterations: 4_000,
        seed: 7,
      }).expectedMargin,
    );
  });
});
