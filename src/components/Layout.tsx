import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ELECTION_DAY_2026 } from '@/data/elections';
import { useTheme } from '@/hooks/useTheme';
import { daysUntil, formatDate } from '@/lib/format';

const NAV = [
  { to: '/', label: 'Overview', end: true },
  { to: '/race', label: 'The 2026 race' },
  { to: '/forecast', label: 'Forecast' },
  { to: '/map', label: 'Regions' },
  { to: '/history', label: 'History' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/data', label: 'Data' },
];

function Countdown() {
  const days = daysUntil(ELECTION_DAY_2026);
  if (days < 0) return null;
  return (
    <div className="tabular hidden items-baseline gap-1.5 text-right lg:flex">
      <span className="text-lg font-bold leading-none text-primary dark:text-accent">{days}</span>
      <span className="muted text-xs">
        {days === 1 ? 'day to' : 'days to'} {formatDate(ELECTION_DAY_2026)}
      </span>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-ghost"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☼' : '☾'}</span>
    </button>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Gambia Elections, home">
      <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#1F6F8B" />
        {/* The flag's bands, abstracted. */}
        <rect x="4" y="6" width="16" height="3.2" rx="1" fill="#CE1126" />
        <rect x="4" y="10.4" width="16" height="3.2" rx="1" fill="#F5F5F5" opacity=".9" />
        <rect x="4" y="14.8" width="16" height="3.2" rx="1" fill="#3A7728" />
      </svg>
      <span className="leading-tight">
        <span className="block text-sm font-bold tracking-tight sm:text-base">
          Gambia Elections
        </span>
        <span className="muted block text-[10px] font-medium uppercase tracking-widest">
          Civic analytics
        </span>
      </span>
    </Link>
  );
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Close the mobile menu and reset scroll on navigation.
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-primary/10 text-primary dark:bg-accent/15 dark:text-accent'
        : 'muted hover:bg-black/5 dark:hover:bg-white/5'
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="no-print sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <header className="no-print sticky top-0 z-40 border-b border-black/10 bg-paper/85 backdrop-blur dark:border-white/10 dark:bg-ink/85">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <Logo />
          <nav aria-label="Primary" className="ml-auto hidden items-center gap-0.5 md:flex">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-4">
            <Countdown />
            <ThemeToggle />
            <button
              type="button"
              className="btn-ghost md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-nav"
            aria-label="Primary, mobile"
            className="animate-fade-in border-t border-black/10 px-4 pb-3 pt-2 dark:border-white/10 md:hidden"
          >
            <div className="flex flex-col gap-0.5">
              {NAV.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="main" ref={mainRef} className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>

      <footer className="no-print mt-8 border-t border-black/10 py-8 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 text-sm sm:grid-cols-3">
            <div>
              <p className="font-semibold">Gambia Elections</p>
              <p className="muted mt-1 text-xs leading-relaxed">
                An independent, open-source civic analytics platform for The Gambia&rsquo;s
                presidential elections. Not affiliated with the Independent Electoral Commission,
                any political party, or any candidate.
              </p>
            </div>
            <div>
              <p className="font-semibold">Before you cite us</p>
              <p className="muted mt-1 text-xs leading-relaxed">
                Only the IEC can declare a result. Every projection here is a model output with a
                stated margin. Read the{' '}
                <Link to="/methodology" className="underline underline-offset-2">
                  methodology
                </Link>{' '}
                and check the{' '}
                <Link to="/data" className="underline underline-offset-2">
                  data provenance
                </Link>
                .
              </p>
            </div>
            <div>
              <p className="font-semibold">Official source</p>
              <p className="muted mt-1 text-xs leading-relaxed">
                <a
                  href="https://iec.gm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  Independent Electoral Commission
                </a>{' '}
                publishes the register, the certified candidate list and the official results.
              </p>
            </div>
          </div>
          <p className="muted mt-6 text-xs">
            Election day: {formatDate(ELECTION_DAY_2026)}. Open source, released for public use.
          </p>
        </div>
      </footer>
    </div>
  );
}
