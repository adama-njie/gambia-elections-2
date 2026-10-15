import React, { Suspense, lazy } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, PageHeader } from '@/components/ui';
import { I18nProvider, T, useT } from '@/i18n';
import Overview from '@/pages/Overview';

// Code-split the heavier pages so the landing view stays fast on a slow
// connection, which matters more here than a few extra requests.
const Race = lazy(() => import('@/pages/Race'));
const Forecast = lazy(() => import('@/pages/Forecast'));
const Regions = lazy(() => import('@/pages/Regions'));
const History = lazy(() => import('@/pages/History'));
const Methodology = lazy(() => import('@/pages/Methodology'));
const Data = lazy(() => import('@/pages/Data'));

function Loading() {
  const t = useT();
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <span className="sr-only">{t('chrome.loading')}</span>
      <svg
        className="h-7 w-7 animate-spin text-primary dark:text-accent"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity=".25" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function NotFound() {
  const t = useT();
  return (
    <div>
      <PageHeader eyebrow={t('notFound.eyebrow')} title={t('notFound.title')} />
      <Card>
        <p className="text-sm leading-relaxed">
          <T
            k="notFound.body"
            vars={{
              overview: (
                <Link to="/" className="font-semibold underline underline-offset-2">
                  {t('notFound.overviewLink')}
                </Link>
              ),
            }}
          />
        </p>
      </Card>
    </div>
  );
}

/**
 * A render error must not take the whole platform down during an election
 * period. Fail to a page that still points at the official source.
 *
 * This fallback is deliberately English-only and context-free. It is the
 * last thing standing after something has already broken, so it must not
 * depend on the i18n provider, the router, or any hook — all of which sit
 * inside it and any of which may be the thing that failed.
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('Unhandled error in Gambia Elections:', error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <header className="mb-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent">
            Something went wrong
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">This view failed to load</h1>
          <p className="muted mt-2 max-w-3xl text-sm leading-relaxed sm:text-base">
            The error has been logged to the browser console. Reloading usually clears it.
          </p>
        </header>
        <div className="card card-pad">
          <p className="text-sm leading-relaxed">
            For official election information, go to the{' '}
            <a
              href="https://iec.gm/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2"
            >
              Independent Electoral Commission
            </a>
            .
          </p>
          <pre className="muted mt-4 overflow-x-auto rounded bg-black/5 p-3 text-xs dark:bg-white/10">
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary mt-4"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Overview />} />
            <Route
              path="race"
              element={
                <Suspense fallback={<Loading />}>
                  <Race />
                </Suspense>
              }
            />
            <Route
              path="forecast"
              element={
                <Suspense fallback={<Loading />}>
                  <Forecast />
                </Suspense>
              }
            />
            <Route
              path="map"
              element={
                <Suspense fallback={<Loading />}>
                  <Regions />
                </Suspense>
              }
            />
            <Route
              path="history"
              element={
                <Suspense fallback={<Loading />}>
                  <History />
                </Suspense>
              }
            />
            <Route
              path="methodology"
              element={
                <Suspense fallback={<Loading />}>
                  <Methodology />
                </Suspense>
              }
            />
            <Route
              path="data"
              element={
                <Suspense fallback={<Loading />}>
                  <Data />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </I18nProvider>
    </ErrorBoundary>
  );
}
