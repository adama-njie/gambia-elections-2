import { describe, expect, it } from 'vitest';
import { DATA_LAST_UPDATED, NEWEST_SOURCE_DATE } from './freshness';

/**
 * The freshness contract. The offline notice shows DATA_LAST_UPDATED to a
 * reader who may be looking at a week-old cached copy, so that date has to
 * mean something: it must be a real date, and it must not claim the dataset
 * is older than the newest thing it cites.
 */
describe('data freshness', () => {
  it('is a full ISO date', () => {
    expect(DATA_LAST_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(new Date(DATA_LAST_UPDATED).getTime())).toBe(false);
  });

  it('is not older than the newest source the dataset cites', () => {
    // Source dates are ISO prefixes (a year, a year-month, or a full date),
    // which compare correctly as strings.
    expect(DATA_LAST_UPDATED >= NEWEST_SOURCE_DATE).toBe(true);
  });

  it('is not in the future', () => {
    expect(new Date(DATA_LAST_UPDATED).getTime()).toBeLessThanOrEqual(Date.now());
  });
});
