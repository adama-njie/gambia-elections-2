import type { Region, RegionCode } from '@/types';

/**
 * The Gambia's seven administrative areas, which are also the IEC's
 * tabulation areas. Registered-voter figures are the 2021 presidential
 * register apportioned to area; they sum to the official national total of
 * 962,157. Treat area-level register figures as reported rather than
 * official until the IEC publishes its own disaggregation.
 */
export const REGIONS: Region[] = [
  {
    code: 'BJL',
    name: 'Banjul',
    seat: 'Banjul',
    population: 31_301,
    registeredVoters2021: 25_462,
    constituencies: 2,
    urbanShare: 1.0,
  },
  {
    code: 'KMC',
    name: 'Kanifing',
    seat: 'Kanifing',
    population: 442_096,
    registeredVoters2021: 183_119,
    constituencies: 9,
    urbanShare: 1.0,
  },
  {
    code: 'WCR',
    name: 'West Coast',
    altName: 'Brikama',
    seat: 'Brikama',
    population: 841_457,
    registeredVoters2021: 297_484,
    constituencies: 15,
    urbanShare: 0.62,
  },
  {
    code: 'NBR',
    name: 'North Bank',
    altName: 'Kerewan',
    seat: 'Kerewan',
    population: 262_019,
    registeredVoters2021: 104_712,
    constituencies: 7,
    urbanShare: 0.26,
  },
  {
    code: 'LRR',
    name: 'Lower River',
    altName: 'Mansakonko',
    seat: 'Mansakonko',
    population: 97_048,
    registeredVoters2021: 46_628,
    constituencies: 6,
    urbanShare: 0.19,
  },
  {
    code: 'CRR',
    name: 'Central River',
    altName: 'Janjanbureh',
    seat: 'Janjanbureh',
    population: 245_986,
    registeredVoters2021: 141_855,
    constituencies: 7,
    urbanShare: 0.17,
  },
  {
    code: 'URR',
    name: 'Upper River',
    altName: 'Basse',
    seat: 'Basse',
    population: 263_441,
    registeredVoters2021: 162_897,
    constituencies: 7,
    urbanShare: 0.21,
  },
];

export const REGION_CODES: RegionCode[] = REGIONS.map((r) => r.code);

const byCode = new Map(REGIONS.map((r) => [r.code, r]));

export function getRegion(code: RegionCode): Region {
  const region = byCode.get(code);
  if (!region) throw new Error(`Unknown region code: ${code}`);
  return region;
}

export function regionName(code: RegionCode): string {
  return byCode.get(code)?.name ?? code;
}

/** Official national register at the 2021 presidential election. */
export const REGISTERED_VOTERS_2021 = 962_157;

export const TOTAL_REGISTERED_2021 = REGIONS.reduce((sum, r) => sum + r.registeredVoters2021, 0);
