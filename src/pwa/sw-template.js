/**
 * Service worker source.
 *
 * This file is not bundled. The `precacheManifest` plugin in vite.config.ts
 * reads it at build time, replaces the three upper-case placeholders below
 * (build version, base path, precache manifest) with real values, and
 * writes the result to dist/sw.js. Those placeholders are deliberately not
 * named anywhere else in this file, including in comments, so that a
 * substitution can only ever hit the statement it is meant for, and the
 * plugin fails the build if any placeholder survives.
 *
 * The substitution is the whole reason this is hand-rolled
 * rather than a plugin dependency: the app's routes are code-split, so a
 * runtime-caching-only worker would leave the Forecast page unavailable to
 * someone who installed the app from the Overview and then lost signal. The
 * full asset list is precached on install instead, which is what makes
 * "works offline after first load" true rather than nearly true.
 *
 * Design constraints, in priority order:
 *
 * 1. Never serve a stale figure without saying so. The client can read
 *    /__sw-meta to find out exactly when this copy was cached, and the
 *    interface shows that date whenever the page is being served offline.
 * 2. Never trap a reader on an old version. A new worker waits rather than
 *    activating under their feet, and the app offers a reload.
 * 3. Fail open. Any unexpected error falls through to the network.
 */

const VERSION = '__BUILD_VERSION__';
const PRECACHE = `gm26-precache-${VERSION}`;
const RUNTIME = `gm26-runtime-${VERSION}`;
const META_URL = '__BASE____sw-meta';

/** Hashed build output plus the app shell. Injected at build time. */
// eslint-disable-next-line no-undef -- substituted by vite.config.ts
const PRECACHE_FILES = __PRECACHE_FILES__;

/* ------------------------------------------------------------------ */
/* Install: take the whole shell, or none of it                        */
/* ------------------------------------------------------------------ */

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      // addAll is atomic enough for our purposes: if one request fails the
      // whole install fails and the old worker stays in charge, which is
      // better than a half-cached app that breaks offline in one route.
      await cache.addAll(PRECACHE_FILES);
      await cache.put(
        META_URL,
        new Response(JSON.stringify({ version: VERSION, cachedAt: new Date().toISOString() }), {
          headers: { 'content-type': 'application/json' },
        }),
      );
    })(),
  );
});

/* ------------------------------------------------------------------ */
/* Activate: drop previous versions                                    */
/* ------------------------------------------------------------------ */

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== PRECACHE && key !== RUNTIME).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

/* ------------------------------------------------------------------ */
/* Fetch                                                               */
/* ------------------------------------------------------------------ */

const SHELL_URL = '__BASE__index.html';

/** Network first, with a short timeout, then whatever is cached. */
async function networkFirst(request, cacheName, timeoutMs = 4000) {
  const cache = await caches.open(cacheName);
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('network timeout')), timeoutMs),
      ),
    ]);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    throw new Error('offline and not cached');
  }
}

/** Cached copy immediately; refresh in the background for next time. */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);
  const response = cached ?? (await network);
  if (!response) throw new Error('offline and not cached');
  return response;
}

/** Immutable hashed assets: cache is always correct. */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const cache = await caches.open(cacheName);
  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  // The metadata record lives only in the cache; never go to the network.
  if (sameOrigin && url.pathname === new URL(META_URL, self.location.origin).pathname) {
    event.respondWith(
      caches.match(META_URL).then(
        (hit) =>
          hit ??
          new Response(JSON.stringify({ version: VERSION, cachedAt: null }), {
            headers: { 'content-type': 'application/json' },
          }),
      ),
    );
    return;
  }

  // Navigations: the app is a single HTML shell plus hash routes, so every
  // navigation resolves to that shell. Prefer a fresh copy, accept the
  // cached one, and let the interface tell the reader which it got.
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, RUNTIME).catch(async () => {
        const cached = await caches.match(SHELL_URL, { ignoreSearch: true });
        if (cached) return cached;
        return new Response(
          '<!doctype html><meta charset="utf-8"><title>Offline</title><p style="font:16px system-ui;margin:3rem auto;max-width:34rem;padding:0 1rem">This platform is not available offline yet. Open it once while connected and it will be saved to your device.</p>',
          { status: 503, headers: { 'content-type': 'text/html; charset=utf-8' } },
        );
      }),
    );
    return;
  }

  if (sameOrigin) {
    // Vite emits content-hashed filenames, so these never change in place.
    if (url.pathname.includes('/assets/')) {
      event.respondWith(cacheFirst(request, PRECACHE));
      return;
    }
    event.respondWith(staleWhileRevalidate(request, RUNTIME));
    return;
  }

  // Cross-origin: the Google Fonts stylesheet and its woff2 files. Caching
  // them is what stops the typography collapsing offline. Anything that
  // cannot be cached simply falls through to the network.
  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('gstatic.com')) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME).catch(() => fetch(request)));
  }
});

/* ------------------------------------------------------------------ */
/* Messages                                                            */
/* ------------------------------------------------------------------ */

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
