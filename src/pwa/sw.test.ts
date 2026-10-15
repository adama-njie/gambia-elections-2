import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

/**
 * Service worker behaviour tests.
 *
 * The worker is the whole offline story, and it is the one part of this
 * codebase that cannot be checked by opening the app: it runs in a separate
 * global, it only does anything on install/activate/fetch events, and the
 * failure mode (a reader on a weak connection getting a blank page, or
 * worse, a silently stale one) is invisible until it matters.
 *
 * So the template is loaded here, the build-time substitution is applied
 * exactly as vite.config.ts applies it, and it is executed against a mock
 * worker global. That covers the four promises the worker makes:
 * precaching everything, cleaning up old versions, serving the shell when
 * the network is gone, and recording when the copy was saved.
 */

const TEMPLATE = readFileSync(
  path.resolve(__dirname, 'sw-template.js'),
  'utf8',
);

const FILES = [
  '/index.html',
  '/manifest.webmanifest',
  '/assets/index-abc123.js',
  '/assets/index-abc123.css',
  '/assets/Forecast-def456.js',
  '/icons/icon-192.png',
];

const ORIGIN = 'https://example.test';

/* ------------------------------------------------------------------ */
/* Mock worker environment                                             */
/* ------------------------------------------------------------------ */

interface MockResponse {
  ok: boolean;
  body: string;
  clone: () => MockResponse;
  json: () => Promise<unknown>;
  status?: number;
}

function makeResponse(body: string, ok = true, status = 200): MockResponse {
  const response: MockResponse = {
    ok,
    body,
    status,
    clone: () => makeResponse(body, ok, status),
    json: async () => JSON.parse(body) as unknown,
  };
  return response;
}

type MockRequest = { url: string; method: string; mode?: string };

function requestKey(request: MockRequest | string, ignoreSearch = false): string {
  const url = new URL(typeof request === 'string' ? request : request.url, ORIGIN);
  return ignoreSearch ? url.pathname : url.pathname + url.search;
}

class MockCache {
  store = new Map<string, MockResponse>();

  async addAll(urls: string[]) {
    for (const url of urls) {
      const response = await networkFetch(url);
      if (!response.ok) throw new Error(`addAll failed for ${url}`);
      this.store.set(requestKey(url), response);
    }
  }

  async put(request: MockRequest | string, response: MockResponse) {
    this.store.set(requestKey(request), response);
  }

  async match(request: MockRequest | string, options?: { ignoreSearch?: boolean }) {
    const direct = this.store.get(requestKey(request));
    if (direct) return direct;
    if (options?.ignoreSearch) return this.store.get(requestKey(request, true));
    return undefined;
  }

  async keys() {
    return [...this.store.keys()];
  }
}

class MockCacheStorage {
  caches = new Map<string, MockCache>();

  async open(name: string) {
    if (!this.caches.has(name)) this.caches.set(name, new MockCache());
    return this.caches.get(name)!;
  }

  async keys() {
    return [...this.caches.keys()];
  }

  async delete(name: string) {
    return this.caches.delete(name);
  }

  async match(request: MockRequest | string, options?: { ignoreSearch?: boolean }) {
    for (const cache of this.caches.values()) {
      const hit = await cache.match(request, options);
      if (hit) return hit;
    }
    return undefined;
  }
}

/** Set to false to simulate losing the connection. */
let online = true;

async function networkFetch(input: MockRequest | string): Promise<MockResponse> {
  if (!online) throw new TypeError('Failed to fetch');
  const url = typeof input === 'string' ? input : input.url;
  return makeResponse(`network:${requestKey(url)}`);
}

interface Harness {
  listeners: Map<string, ((event: Record<string, unknown>) => void)[]>;
  cacheStorage: MockCacheStorage;
  skipWaitingCalled: boolean;
  claimCalled: boolean;
}

/** Load the worker into a fresh global and return handles into it. */
function loadWorker(version = 'testver'): Harness {
  const source = TEMPLATE.replace(/__BUILD_VERSION__/g, version)
    .replace(/__BASE__/g, '/')
    .replace(/__PRECACHE_FILES__/g, JSON.stringify(FILES));

  expect(source, 'every placeholder is substituted').not.toMatch(/__[A-Z][A-Z_]*__/);

  const listeners = new Map<string, ((event: Record<string, unknown>) => void)[]>();
  const cacheStorage = new MockCacheStorage();
  const harness: Harness = {
    listeners,
    cacheStorage,
    skipWaitingCalled: false,
    claimCalled: false,
  };

  const self = {
    location: new URL(`${ORIGIN}/sw.js`),
    addEventListener(type: string, handler: (event: Record<string, unknown>) => void) {
      const list = listeners.get(type) ?? [];
      list.push(handler);
      listeners.set(type, list);
    },
    skipWaiting() {
      harness.skipWaitingCalled = true;
    },
    clients: {
      claim: async () => {
        harness.claimCalled = true;
      },
    },
  };

  const context = createContext({
    self,
    caches: cacheStorage,
    fetch: networkFetch,
    Response: makeResponse as unknown,
    URL,
    setTimeout,
    clearTimeout,
    Promise,
    Error,
    TypeError,
    JSON,
    Date,
    console,
  });

  // The worker calls `new Response(body, init)`; the mock ignores init.
  runInContext(
    'globalThis.Response = function (body) { return globalThis.__makeResponse(String(body)); };',
    Object.assign(context, { __makeResponse: makeResponse }),
  );
  runInContext(source, context);

  return harness;
}

/** Fire an event and await whatever the handler passed to waitUntil. */
async function dispatch(
  harness: Harness,
  type: string,
  extra: Record<string, unknown> = {},
): Promise<unknown> {
  let pending: unknown;
  let responded: unknown;
  const event = {
    ...extra,
    waitUntil: (promise: unknown) => {
      pending = promise;
    },
    respondWith: (promise: unknown) => {
      responded = promise;
    },
  };
  for (const handler of harness.listeners.get(type) ?? []) handler(event);
  if (pending) await pending;
  return responded ? await responded : undefined;
}

beforeEach(() => {
  online = true;
});

/* ------------------------------------------------------------------ */

describe('install', () => {
  it('precaches every file in the manifest', async () => {
    const harness = loadWorker();
    await dispatch(harness, 'install');

    const cache = await harness.cacheStorage.open('gm26-precache-testver');
    for (const file of FILES) {
      expect(await cache.match(file), `${file} is precached`).toBeDefined();
    }
  });

  it('records when the copy was saved, so the app can say how stale it is', async () => {
    const harness = loadWorker();
    await dispatch(harness, 'install');

    const cache = await harness.cacheStorage.open('gm26-precache-testver');
    const meta = await cache.match('/__sw-meta');
    expect(meta).toBeDefined();
    const parsed = JSON.parse(meta!.body) as { version: string; cachedAt: string };
    expect(parsed.version).toBe('testver');
    expect(Number.isNaN(new Date(parsed.cachedAt).getTime())).toBe(false);
  });

  it('fails the install rather than leaving a half-cached app', async () => {
    const harness = loadWorker();
    online = false;
    await expect(dispatch(harness, 'install')).rejects.toThrow();
  });
});

describe('activate', () => {
  it('deletes caches from previous versions and claims open pages', async () => {
    const harness = loadWorker('v2');
    await harness.cacheStorage.open('gm26-precache-v1');
    await harness.cacheStorage.open('gm26-runtime-v1');
    await harness.cacheStorage.open('gm26-precache-v2');

    await dispatch(harness, 'activate');

    expect(await harness.cacheStorage.keys()).toEqual(['gm26-precache-v2']);
    expect(harness.claimCalled).toBe(true);
  });
});

describe('fetch', () => {
  it('serves the cached shell for a navigation when the network is gone', async () => {
    const harness = loadWorker();
    await dispatch(harness, 'install');
    online = false;

    const response = (await dispatch(harness, 'fetch', {
      request: { url: `${ORIGIN}/`, method: 'GET', mode: 'navigate' },
    })) as MockResponse;

    expect(response.body).toBe('network:/index.html');
  });

  it('serves a deep link offline too, so a shared scenario URL still opens', async () => {
    const harness = loadWorker();
    await dispatch(harness, 'install');
    online = false;

    const response = (await dispatch(harness, 'fetch', {
      request: { url: `${ORIGIN}/?x=1#/forecast`, method: 'GET', mode: 'navigate' },
    })) as MockResponse;

    expect(response.body).toBe('network:/index.html');
  });

  it('explains itself rather than showing a blank page when nothing is cached', async () => {
    const harness = loadWorker();
    online = false;

    const response = (await dispatch(harness, 'fetch', {
      request: { url: `${ORIGIN}/`, method: 'GET', mode: 'navigate' },
    })) as MockResponse;

    expect(response.body).toContain('not available offline yet');
  });

  it('serves a lazily-loaded route chunk from cache when offline', async () => {
    const harness = loadWorker();
    await dispatch(harness, 'install');
    online = false;

    const response = (await dispatch(harness, 'fetch', {
      request: { url: `${ORIGIN}/assets/Forecast-def456.js`, method: 'GET' },
    })) as MockResponse;

    expect(response.body).toBe('network:/assets/Forecast-def456.js');
  });

  it('answers the metadata request from cache and never from the network', async () => {
    const harness = loadWorker();
    await dispatch(harness, 'install');
    online = false;

    const response = (await dispatch(harness, 'fetch', {
      request: { url: `${ORIGIN}/__sw-meta`, method: 'GET' },
    })) as MockResponse;

    const parsed = JSON.parse(response.body) as { version: string };
    expect(parsed.version).toBe('testver');
  });

  it('leaves non-GET requests alone', async () => {
    const harness = loadWorker();
    const response = await dispatch(harness, 'fetch', {
      request: { url: `${ORIGIN}/anything`, method: 'POST' },
    });
    expect(response).toBeUndefined();
  });
});

describe('messages', () => {
  it('activates a waiting worker only when the app asks', async () => {
    const harness = loadWorker();
    await dispatch(harness, 'message', { data: 'SOMETHING_ELSE' });
    expect(harness.skipWaitingCalled).toBe(false);

    await dispatch(harness, 'message', { data: 'SKIP_WAITING' });
    expect(harness.skipWaitingCalled).toBe(true);
  });
});
