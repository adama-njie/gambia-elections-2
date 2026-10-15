import { SOURCES } from './sources';

/**
 * When the dataset in this repository was last revised.
 *
 * Maintained by hand, and deliberately separate from the build timestamp:
 * rebuilding the site does not make the figures newer, and a "last updated"
 * line that moves every deploy would be a lie about the data. Raise this
 * only when something in src/data actually changes.
 *
 * A test pins it to be no older than the newest source the dataset cites.
 */
export const DATA_LAST_UPDATED = '2026-10-15';

/**
 * When this particular copy of the application was built. Injected by Vite.
 *
 * Used by the offline notice to say how old the cached copy is, never to
 * imply the data is fresher than DATA_LAST_UPDATED.
 */
export const BUILD_TIME: string =
  typeof __BUILD_TIME__ === 'string' ? __BUILD_TIME__ : new Date().toISOString();

/** The newest date any cited source carries. ISO prefix, so comparable. */
export const NEWEST_SOURCE_DATE = SOURCES.reduce(
  (newest, source) => (source.date > newest ? source.date : newest),
  '',
);
