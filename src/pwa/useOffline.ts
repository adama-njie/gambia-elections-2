import { useCallback, useEffect, useState } from 'react';

/**
 * Service worker registration and the honest-offline state.
 *
 * The rule this implements: the app may serve a cached copy, but it may
 * never do so silently. Three facts are surfaced to the interface —
 *
 *   online      whether the device currently has a connection
 *   cachedAt    when the copy on this device was actually saved
 *   updateReady whether a newer copy has already downloaded
 *
 * — and the components in src/components/Offline.tsx turn them into a
 * notice. Without `cachedAt` the offline story would amount to "some of
 * these numbers might be old", which is not something a reader can act on.
 */

const SW_URL = `${import.meta.env.BASE_URL}sw.js`;
const META_URL = `${import.meta.env.BASE_URL}__sw-meta`;

export interface SwMeta {
  version: string;
  /** ISO timestamp, or null if the worker has not recorded one. */
  cachedAt: string | null;
}

export interface OfflineState {
  online: boolean;
  /** True once a service worker is controlling this page. */
  controlled: boolean;
  meta: SwMeta | null;
  updateReady: boolean;
  /** Activate the waiting worker and reload. */
  applyUpdate: () => void;
}

let registration: ServiceWorkerRegistration | null = null;

/**
 * Register the worker. Called once from main.tsx, and only in a production
 * build: a service worker in front of the dev server caches module graphs
 * that Vite expects to serve fresh, which produces baffling stale-code bugs.
 */
export function registerServiceWorker(onUpdateReady: () => void): void {
  if (!import.meta.env.PROD) return;
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(SW_URL, { scope: import.meta.env.BASE_URL })
      .then((reg) => {
        registration = reg;

        // A worker already waiting means an update downloaded on a previous
        // visit and the reader has not reloaded yet.
        if (reg.waiting && navigator.serviceWorker.controller) onUpdateReady();

        reg.addEventListener('updatefound', () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            // `controller` present means this is an update, not a first
            // install — on a first install there is nothing stale to warn
            // about, so prompting for a reload would be noise.
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              onUpdateReady();
            }
          });
        });
      })
      .catch((error) => {
        // Offline support is an enhancement. A failed registration must
        // never take the platform down during an election period.
        console.warn('[pwa] service worker registration failed', error);
      });
  });
}

async function readMeta(): Promise<SwMeta | null> {
  try {
    const response = await fetch(META_URL, { cache: 'no-store' });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (typeof data !== 'object' || data === null) return null;
    const record = data as Partial<SwMeta>;
    return {
      version: typeof record.version === 'string' ? record.version : 'unknown',
      cachedAt: typeof record.cachedAt === 'string' ? record.cachedAt : null,
    };
  } catch {
    // No worker, or the fetch failed. Either way there is nothing to report,
    // and the interface says "not known" rather than guessing a date.
    return null;
  }
}

export function useOfflineState(): OfflineState {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  );
  const [meta, setMeta] = useState<SwMeta | null>(null);
  const [controlled, setControlled] = useState(
    () => typeof navigator !== 'undefined' && Boolean(navigator.serviceWorker?.controller),
  );
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const sync = () => {
      setControlled(Boolean(navigator.serviceWorker?.controller));
      void readMeta().then((value) => {
        if (!cancelled) setMeta(value);
      });
    };

    sync();
    navigator.serviceWorker?.addEventListener('controllerchange', sync);

    // The app registers the worker from main.tsx and reports an available
    // update on this event, so the hook does not need its own registration.
    const onUpdate = () => setUpdateReady(true);
    window.addEventListener('gm26:update-ready', onUpdate);

    return () => {
      cancelled = true;
      navigator.serviceWorker?.removeEventListener('controllerchange', sync);
      window.removeEventListener('gm26:update-ready', onUpdate);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    const waiting = registration?.waiting;
    if (!waiting) {
      window.location.reload();
      return;
    }
    // Reload once the new worker takes over, so the page and its assets come
    // from the same version.
    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), {
      once: true,
    });
    waiting.postMessage('SKIP_WAITING');
  }, []);

  return { online, controlled, meta, updateReady, applyUpdate };
}
