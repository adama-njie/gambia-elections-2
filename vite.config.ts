import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const BASE = process.env.BASE_PATH ?? '/';

/** Build-time constant, surfaced to the app as __BUILD_TIME__. */
const BUILD_TIME = new Date().toISOString();

/**
 * Emit dist/sw.js from src/pwa/sw-template.js with the real asset list
 * baked in.
 *
 * Hand-rolled rather than vite-plugin-pwa (which brings Workbox and a
 * sizeable dependency tree) because the requirement is narrow and the app is
 * deliberately dependency-light: one HTML shell, hashed immutable assets, no
 * API calls. The only thing a generic plugin would give us that matters here
 * is the precache manifest, and that is the twenty lines below.
 *
 * Precaching the whole manifest — not just the entry chunk — is what makes
 * the offline claim honest: the routes are lazy-loaded, so a reader who
 * installed the app from the Overview page would otherwise find the Forecast
 * page missing the moment they lost signal.
 */
function precacheManifest(): Plugin {
  return {
    name: 'gm26:precache-manifest',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist');

      const walk = (dir: string): string[] =>
        readdirSync(dir).flatMap((entry) => {
          const full = path.join(dir, entry);
          return statSync(full).isDirectory() ? walk(full) : [full];
        });

      const files = walk(dist)
        .map((file) => path.relative(dist, file).split(path.sep).join('/'))
        // Source maps are large and only ever fetched by devtools; caching
        // them would multiply the install cost on a metered connection.
        .filter((file) => !file.endsWith('.map') && file !== 'sw.js')
        .sort();

      const urls = files.map((file) => `${BASE}${file}`);

      // Version from the content of the manifest, so an identical build
      // produces an identical worker and does not churn caches.
      const version = createHash('sha256').update(urls.join('\n')).digest('hex').slice(0, 12);

      const template = readFileSync(path.resolve(__dirname, 'src/pwa/sw-template.js'), 'utf8');

      const worker = template
        .replace(/__BUILD_VERSION__/g, version)
        .replace(/__BASE__/g, BASE)
        .replace(/__PRECACHE_FILES__/g, JSON.stringify(urls, null, 2));

      // A surviving placeholder means the worker would throw a
      // ReferenceError on install and the app would silently lose its
      // offline support. Fail the build instead.
      const leftover = worker.match(/__[A-Z][A-Z_]*__/);
      if (leftover) {
        this.error(`sw-template.js: placeholder ${leftover[0]} was not substituted`);
      }

      writeFileSync(path.join(dist, 'sw.js'), worker, 'utf8');
      this.info(`sw.js: ${urls.length} files precached, version ${version}`);
    },
  };
}

export default defineConfig({
  base: BASE,
  define: {
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
  },
  plugins: [react(), precacheManifest()],
  server: { port: 3000, host: '0.0.0.0' },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: { outDir: 'dist', sourcemap: true, target: 'es2022' },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
