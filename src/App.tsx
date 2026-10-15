import React, { Suspense, lazy } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, PageHeader } from '@/components/ui';
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
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <span className="sr-only">Loading</span>
      <svg className="h-7 w-7 animate-spin text-primary dark:text-accent" viewBox="0 0 24 24" aria-hidden="true">
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
  return (
    <div>
      <PageHeader eyebrow="404" title="Page not found" />
      <Card>
        <p className="text-sm leading-relaxed">
          That page does not exist. Start from the{' '}
          <Link to="/" className="font-semibold underline underline-offset-2">
            overview
          </Link>
          .
        </p>
      </Card>
    </div>
  );
}

/**
 * A render error must not take the whole platform down during an election
 * period. Fail to a page that still points at the official source.
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
        <PageHeader
          eyebrow="Something went wrong"
          title="This view failed to load"
          lede="The error has been logged to the browser console. Reloading usually clears it."
        />
        <Card>
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
        </Card>
      </div>
    );
  }
}

export default function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
