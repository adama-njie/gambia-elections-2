import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import LanguageSwitcher, { DraftLocaleBanner } from '@/components/LanguageSwitcher';
import { DataFreshness, OfflineNotice } from '@/components/Offline';
import { ELECTION_DAY_2026 } from '@/data/elections';
import { useTheme } from '@/hooks/useTheme';
import { T, useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import { daysUntil, formatDate } from '@/lib/format';

const NAV: { to: string; label: TranslationKey; end?: boolean }[] = [
  { to: '/', label: 'nav.overview', end: true },
  { to: '/race', label: 'nav.race' },
  { to: '/forecast', label: 'nav.forecast' },
  { to: '/map', label: 'nav.regions' },
  { to: '/history', label: 'nav.history' },
  { to: '/methodology', label: 'nav.methodology' },
  { to: '/data', label: 'nav.data' },
];

function Countdown() {
  const t = useT();
  const days = daysUntil(ELECTION_DAY_2026);
  if (days < 0) return null;
  return (
    <div className="tabular hidden items-baseline gap-1.5 text-right lg:flex">
      <span className="text-lg font-bold leading-none text-primary dark:text-accent">{days}</span>
      <span className="muted text-xs">
        {t(days === 1 ? 'countdown.dayTo' : 'countdown.daysTo', {
          date: formatDate(ELECTION_DAY_2026),
        })}
      </span>
    </div>
  );
}

function ThemeToggle() {
  const t = useT();
  const { theme, toggle } = useTheme();
  const label = t(theme === 'dark' ? 'chrome.themeToLight' : 'chrome.themeToDark');
  return (
    <button type="button" onClick={toggle} className="btn-ghost" aria-label={label} title={label}>
      <span aria-hidden="true">{theme === 'dark' ? '☼' : '☾'}</span>
    </button>
  );
}

function Logo() {
  const t = useT();
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={t('brand.homeAria')}>
      <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#0D2B36" />
        {/*
          The national flag of The Gambia: red, blue and green bands
          separated by two white fimbriations, in the official 6:1:4:1:6
          ratio and the official 2:3 proportion. The white base shows through
          coloured bands to form the fimbriations.
        */}
        <rect x="3" y="6" width="18" height="12" fill="#FFFFFF" />
        <rect x="3" y="6" width="18" height="4" fill="#CE1126" />
        <rect x="3" y="10.667" width="18" height="2.666" fill="#0C1C8C" />
        <rect x="3" y="14" width="18" height="4" fill="#3A7728" />
      </svg>
      <span className="leading-tight">
        <span className="block text-sm font-bold tracking-tight sm:text-base">
          {t('brand.name')}
        </span>
        <span className="muted block text-[10px] font-medium uppercase tracking-widest">
          {t('brand.tagline')}
        </span>
      </span>
    </Link>
  );
}

export default function Layout() {
  const t = useT();
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
        {t('chrome.skipToContent')}
      </a>

      <header className="no-print sticky top-0 z-40 border-b border-black/10 bg-paper/85 backdrop-blur dark:border-white/10 dark:bg-ink/85">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <Logo />
          <nav aria-label={t('nav.primary')} className="ml-auto hidden items-center gap-0.5 md:flex">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {t(item.label)}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-4">
            <Countdown />
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              className="btn-ghost md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
              <span className="sr-only">{t('chrome.menu')}</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-nav"
            aria-label={t('nav.primaryMobile')}
            className="animate-fade-in border-t border-black/10 px-4 pb-3 pt-2 dark:border-white/10 md:hidden"
          >
            <div className="flex flex-col gap-0.5">
              {NAV.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                  {t(item.label)}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Both banners are facts about this session, not decoration: one says
          the interface language is an unreviewed draft, the other says the
          page is being served from a saved copy and how old it is. */}
      <DraftLocaleBanner />
      <OfflineNotice />

      <main
        id="main"
        ref={mainRef}
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8"
      >
        <Outlet />
      </main>

      <footer className="no-print mt-8 border-t border-black/10 py-8 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 text-sm sm:grid-cols-3">
            <div>
              <p className="font-semibold">{t('footer.about.title')}</p>
              <p className="muted mt-1 text-xs leading-relaxed">{t('footer.about.body')}</p>
            </div>
            <div>
              <p className="font-semibold">{t('footer.cite.title')}</p>
              <p className="muted mt-1 text-xs leading-relaxed">
                <T
                  k="footer.cite.body"
                  vars={{
                    methodology: (
                      <Link to="/methodology" className="underline underline-offset-2">
                        {t('footer.cite.methodologyLink')}
                      </Link>
                    ),
                    provenance: (
                      <Link to="/data" className="underline underline-offset-2">
                        {t('footer.cite.provenanceLink')}
                      </Link>
                    ),
                  }}
                />
              </p>
            </div>
            <div>
              <p className="font-semibold">{t('footer.official.title')}</p>
              <p className="muted mt-1 text-xs leading-relaxed">
                <T
                  k="footer.official.body"
                  vars={{
                    iec: (
                      <a
                        href="https://iec.gm/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                      >
                        {t('common.iecName')}
                      </a>
                    ),
                  }}
                />
              </p>
            </div>
          </div>
          <p className="muted mt-6 text-xs">
            {t('footer.electionDay', { date: formatDate(ELECTION_DAY_2026) })}
          </p>
          <DataFreshness className="mt-1" />
        </div>
      </footer>
    </div>
  );
}
