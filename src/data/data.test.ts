import { describe, expect, it } from 'vitest';
import { CANDIDATES_2026, MODELLED_CANDIDATES, REALIGNED_2026 } from './candidates';
import { ELECTIONS, ELECTION_DAY_2026 } from './elections';
import { COALITIONS, PARTIES, getParty } from './parties';
import { POLLS, TIMELINE } from './polls';
import { REGIONS, REGISTERED_VOTERS_2021, TOTAL_REGISTERED_2021 } from './regions';
import { SOURCES, getSource } from './sources';

/**
 * These tests are the data contract. They are what lets anyone verify that
 * the dataset is internally consistent and fully cited, which is the whole
 * basis for presenting this tool as a public resource.
 */

describe('sources', () => {
  it('has unique ids', () => {
    const ids = SOURCES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every source a resolvable url and a publisher', () => {
    for (const source of SOURCES) {
      expect(source.publisher.length).toBeGreaterThan(0);
      expect(source.url).toMatch(/^(https?:\/\/|#)/);
      expect(source.title.length).toBeGreaterThan(0);
    }
  });
});

describe('citation integrity', () => {
  const citedIds = new Set<string>();
  for (const e of ELECTIONS) e.sources.forEach((s) => citedIds.add(s));
  for (const c of COALITIONS) c.sources.forEach((s) => citedIds.add(s));
  for (const p of POLLS) p.sources.forEach((s) => citedIds.add(s));
  for (const t of TIMELINE) t.sources.forEach((s) => citedIds.add(s));
  for (const r of REALIGNED_2026) r.sources.forEach((s) => citedIds.add(s));

  it('resolves every citation to a known source', () => {
    for (const id of citedIds) {
      expect(getSource(id), `unresolved citation: ${id}`).toBeDefined();
    }
  });

  it('cites at least one source on every election, coalition and poll', () => {
    for (const e of ELECTIONS) expect(e.sources.length).toBeGreaterThan(0);
    for (const c of COALITIONS) expect(c.sources.length).toBeGreaterThan(0);
    for (const p of POLLS) expect(p.sources.length).toBeGreaterThan(0);
  });
});

describe('regions', () => {
  it('has the seven administrative areas', () => {
    expect(REGIONS).toHaveLength(7);
    expect(new Set(REGIONS.map((r) => r.code)).size).toBe(7);
  });

  it('apportions the 2021 register to the official national total', () => {
    expect(TOTAL_REGISTERED_2021).toBe(REGISTERED_VOTERS_2021);
  });

  it('keeps urban share a proportion', () => {
    for (const r of REGIONS) {
      expect(r.urbanShare).toBeGreaterThanOrEqual(0);
      expect(r.urbanShare).toBeLessThanOrEqual(1);
      expect(r.constituencies).toBeGreaterThan(0);
    }
  });

  it('accounts for all 53 elected National Assembly constituencies', () => {
    expect(REGIONS.reduce((a, r) => a + r.constituencies, 0)).toBe(53);
  });
});

describe('elections', () => {
  it('is ordered by year with no duplicates', () => {
    const years = ELECTIONS.map((e) => e.year);
    expect(years).toEqual([...years].sort((a, b) => a - b));
    expect(new Set(years).size).toBe(years.length);
  });

  it('has national shares summing to about 100', () => {
    for (const e of ELECTIONS) {
      const total = e.national.reduce((a, r) => a + r.share, 0);
      expect(total, `${e.year} shares`).toBeGreaterThan(97);
      expect(total, `${e.year} shares`).toBeLessThanOrEqual(100.5);
    }
  });

  it('keeps vote counts consistent with the reported shares', () => {
    for (const e of ELECTIONS) {
      if (!e.validVotes) continue;
      for (const row of e.national) {
        const implied = (row.votes / e.validVotes) * 100;
        expect(Math.abs(implied - row.share), `${e.year} ${row.candidate}`).toBeLessThan(0.15);
      }
    }
  });

  it('has vote counts that sum to the stated valid vote total', () => {
    for (const e of ELECTIONS) {
      if (!e.validVotes) continue;
      const total = e.national.reduce((a, r) => a + r.votes, 0);
      expect(Math.abs(total - e.validVotes), `${e.year} total`).toBeLessThan(e.validVotes * 0.005);
    }
  });

  it('derives turnout from the register and the valid vote', () => {
    for (const e of ELECTIONS) {
      if (!e.validVotes || !e.registeredVoters || e.turnout === null) continue;
      const implied = (e.validVotes / e.registeredVoters) * 100;
      expect(Math.abs(implied - e.turnout), `${e.year} turnout`).toBeLessThan(2.5);
    }
  });

  it('names a winner that appears in the result and leads it', () => {
    for (const e of ELECTIONS) {
      const ranked = [...e.national].sort((a, b) => b.share - a.share);
      expect(ranked[0]!.candidate).toBe(e.winner);
      expect(ranked[0]!.party).toBe(e.winningParty);
    }
  });

  it('states a margin matching first minus second place', () => {
    for (const e of ELECTIONS) {
      const ranked = [...e.national].sort((a, b) => b.share - a.share);
      const actual = ranked[0]!.share - ranked[1]!.share;
      expect(Math.abs(actual - e.margin), `${e.year} margin`).toBeLessThan(0.1);
    }
  });

  it('uses only known party ids', () => {
    for (const e of ELECTIONS) {
      for (const row of e.national) {
        expect(getParty(row.party), `${e.year}: ${row.party}`).toBeDefined();
      }
    }
  });

  it('has regional shares summing to about 100 where present', () => {
    for (const e of ELECTIONS) {
      for (const row of e.regional) {
        const total = Object.values(row.shares).reduce((a, b) => a + b, 0);
        expect(total, `${e.year} ${row.region}`).toBeGreaterThan(97);
        expect(total, `${e.year} ${row.region}`).toBeLessThanOrEqual(100.5);
      }
    }
  });

  it('labels every regional breakdown official, since the IEC now publishes them', () => {
    for (const e of ELECTIONS) {
      for (const row of e.regional) {
        expect(row.provenance, `${e.year} ${row.region}`).toBe('official');
      }
    }
  });

  it('covers all seven areas when a regional breakdown exists at all', () => {
    for (const e of ELECTIONS) {
      if (e.regional.length === 0) continue;
      expect(e.regional).toHaveLength(7);
      expect(new Set(e.regional.map((r) => r.region)).size).toBe(7);
    }
  });

  it('cites an IEC results document wherever it claims official provenance', () => {
    for (const e of ELECTIONS) {
      if (e.regional.every((r) => r.provenance !== 'official')) continue;
      expect(
        e.sources.some((id) => id.startsWith('iec-results-')),
        `${e.year} claims official area data without citing the IEC document`,
      ).toBe(true);
    }
  });
});

describe('parties and coalitions', () => {
  it('has unique party ids and valid colours', () => {
    const ids = PARTIES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of PARTIES) expect(p.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('builds every coalition from known parties', () => {
    for (const c of COALITIONS) {
      for (const member of c.members) {
        expect(getParty(member), `${c.id}: ${member}`).toBeDefined();
      }
      if (c.leadParty) expect(getParty(c.leadParty)).toBeDefined();
    }
  });

  it('points every coalition at a real flagbearer', () => {
    const ids = new Set(CANDIDATES_2026.map((c) => c.id));
    for (const c of COALITIONS) {
      expect(ids.has(c.flagbearer), `${c.id} flagbearer`).toBe(true);
    }
  });

  it('assigns each coalition its lead party colour', () => {
    for (const c of COALITIONS) {
      if (!c.leadParty) continue;
      expect(c.color).toBe(getParty(c.leadParty)!.color);
    }
  });

  it('records the four 2026 blocs', () => {
    expect(COALITIONS.map((c) => c.id).sort()).toEqual(
      ['coalition-2026', 'gambia-first', 'npp-alliance', 'team-gambia'].sort(),
    );
  });
});

describe('candidates', () => {
  it('has unique ids and known parties', () => {
    const ids = CANDIDATES_2026.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of CANDIDATES_2026) expect(getParty(c.party), c.party).toBeDefined();
  });

  it('links every coalition reference to a real coalition', () => {
    const ids = new Set(COALITIONS.map((c) => c.id));
    for (const c of CANDIDATES_2026) {
      if (c.coalition) expect(ids.has(c.coalition), `${c.id}`).toBe(true);
    }
  });

  it('models exactly the four bloc flagbearers', () => {
    const flagbearers = COALITIONS.map((c) => c.flagbearer).sort();
    expect([...MODELLED_CANDIDATES].sort()).toEqual(flagbearers);
  });

  it('never marks a candidate nominated before the IEC window closes', () => {
    // Nominations run 3-14 November 2026. Until the IEC certifies, nothing
    // in this dataset may claim nominated status.
    for (const c of CANDIDATES_2026) {
      expect(c.status, c.id).not.toBe('nominated');
    }
  });

  it('matches 2021 shares to the recorded result', () => {
    const results2021 = ELECTIONS.find((e) => e.year === 2021)!;
    for (const c of CANDIDATES_2026) {
      if (c.share2021 === undefined) continue;
      const match = results2021.national.find((r) => r.share === c.share2021);
      expect(match, `${c.name} 2021 share ${c.share2021}`).toBeDefined();
    }
  });
});

describe('polls', () => {
  it('has shares plus undecided summing to about 100', () => {
    for (const p of POLLS) {
      const total = Object.values(p.shares).reduce((a, b) => a + b, 0) + p.undecided;
      expect(total, p.id).toBeGreaterThan(97);
      expect(total, p.id).toBeLessThanOrEqual(100.5);
    }
  });

  it('is ordered oldest to newest', () => {
    const dates = POLLS.map((p) => p.fieldworkEnd);
    expect(dates).toEqual([...dates].sort());
  });

  it('records a sample size and a dated fieldwork end', () => {
    for (const p of POLLS) {
      expect(p.sampleSize).toBeGreaterThan(0);
      expect(p.fieldworkEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe('timeline', () => {
  it('is in chronological order', () => {
    const dates = TIMELINE.map((t) => t.date);
    expect(dates).toEqual([...dates].sort());
  });

  it('ends windows after they start', () => {
    for (const t of TIMELINE) {
      if (t.endDate) expect(t.endDate >= t.date, t.id).toBe(true);
    }
  });

  it('puts election day on the published date', () => {
    const day = TIMELINE.find((t) => t.kind === 'poll');
    expect(day!.date).toBe(ELECTION_DAY_2026);
    expect(ELECTION_DAY_2026).toBe('2026-12-05');
  });
});
