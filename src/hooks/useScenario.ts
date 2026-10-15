import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_SCENARIO } from '@/lib/forecast';
import type { ScenarioParams } from '@/types';

/**
 * Scenario state lives in the URL, not in component state.
 *
 * That is deliberate: a scenario someone builds has to be shareable and
 * citable. A journalist or analyst can send a link and the recipient sees
 * exactly the same numbers, which is also what makes the figures auditable.
 */

const KEYS: Record<keyof ScenarioParams, string> = {
  incumbentApproval: 'app',
  inflation: 'inf',
  gdpGrowth: 'gdp',
  youthUnemployment: 'yue',
  infrastructureRating: 'ifr',
  turnout: 'tno',
  youthTurnoutSwing: 'yts',
  transferEfficiency: 'tef',
  undecidedToChallengers: 'und',
  oppositionConsolidation: 'opc',
  pollWeight: 'plw',
  newVoterEffect: 'nve',
};

const PARAM_KEYS = Object.keys(KEYS) as (keyof ScenarioParams)[];

export function useScenario() {
  const [search, setSearch] = useSearchParams();

  const params = useMemo<ScenarioParams>(() => {
    const out = { ...DEFAULT_SCENARIO };
    for (const key of PARAM_KEYS) {
      const raw = search.get(KEYS[key]);
      if (raw === null) continue;
      const value = Number(raw);
      if (Number.isFinite(value)) out[key] = value;
    }
    return out;
  }, [search]);

  const seed = useMemo(() => {
    const raw = search.get('seed');
    const value = raw === null ? Number.NaN : Number(raw);
    return Number.isFinite(value) ? value : 20_261_205;
  }, [search]);

  const set = useCallback(
    (key: keyof ScenarioParams, value: number) => {
      setSearch(
        (current) => {
          const next = new URLSearchParams(current);
          // Omit values that match the default, so shared links stay short.
          if (value === DEFAULT_SCENARIO[key]) next.delete(KEYS[key]);
          else next.set(KEYS[key], String(Number(value.toFixed(2))));
          return next;
        },
        { replace: true },
      );
    },
    [setSearch],
  );

  const setAll = useCallback(
    (next: ScenarioParams) => {
      setSearch(
        (current) => {
          const out = new URLSearchParams(current);
          for (const key of PARAM_KEYS) {
            if (next[key] === DEFAULT_SCENARIO[key]) out.delete(KEYS[key]);
            else out.set(KEYS[key], String(Number(next[key].toFixed(2))));
          }
          return out;
        },
        { replace: true },
      );
    },
    [setSearch],
  );

  const reset = useCallback(() => {
    setSearch(
      (current) => {
        const next = new URLSearchParams(current);
        for (const key of PARAM_KEYS) next.delete(KEYS[key]);
        next.delete('seed');
        return next;
      },
      { replace: true },
    );
  }, [setSearch]);

  const isDefault = useMemo(
    () => PARAM_KEYS.every((key) => params[key] === DEFAULT_SCENARIO[key]),
    [params],
  );

  return { params, set, setAll, reset, seed, isDefault };
}
