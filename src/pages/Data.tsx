import { DataFreshness } from '@/components/Offline';
import {
  Card,
  EnglishOnlyGloss,
  Notice,
  PageHeader,
  ProvenanceBadge,
  SectionHeading,
} from '@/components/ui';
import { CANDIDATES_2026 } from '@/data/candidates';
import { ELECTIONS } from '@/data/elections';
import { COALITIONS } from '@/data/parties';
import { POLLS } from '@/data/polls';
import { REGIONS } from '@/data/regions';
import { SOURCES } from '@/data/sources';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import {
  PROVENANCE_HELP_KEY,
  PROVENANCE_LABEL_KEY,
  downloadFile,
  formatDate,
  toCsv,
} from '@/lib/format';
import type { Provenance } from '@/types';

const LEVELS: Provenance[] = ['official', 'reported', 'modelled', 'poll'];

export default function Data() {
  const t = useT();

  /**
   * Exports are always English. They are cited artefacts that get
   * republished, and a column header or a disclaimer that changes with the
   * reader's language setting cannot be referenced in a correction.
   */
  const exportResults = () => {
    const rows: (string | number)[][] = [
      [
        'Year',
        'Date',
        'Candidate',
        'Party',
        'Votes',
        'Share %',
        'Registered',
        'Valid votes',
        'Turnout %',
        'Provenance',
      ],
      ...ELECTIONS.flatMap((e) =>
        e.national.map((r) => [
          e.year,
          e.date,
          r.candidate,
          r.party,
          r.votes,
          r.share,
          e.registeredVoters ?? '',
          e.validVotes ?? '',
          e.turnout ?? '',
          e.provenance,
        ]),
      ),
    ];
    downloadFile('gambia-presidential-results-1996-2021.csv', toCsv(rows), 'text/csv;charset=utf-8');
  };

  const exportJson = () => {
    const payload = {
      generated: new Date().toISOString(),
      disclaimer:
        'Independent civic dataset. National figures are IEC-announced totals as recorded by observer missions and standard secondary tables; the IEC has not published a machine-readable archive, so nothing here is official. All regional breakdowns are modelled estimates, not observations. Not affiliated with the IEC, any party or any candidate.',
      sources: SOURCES,
      regions: REGIONS,
      elections: ELECTIONS,
      coalitions2026: COALITIONS,
      candidates2026: CANDIDATES_2026,
      polls: POLLS,
    };
    downloadFile(
      'gambia-elections-dataset.json',
      JSON.stringify(payload, null, 2),
      'application/json',
    );
  };

  const contents: {
    name: TranslationKey;
    coverage: TranslationKey;
    rows: number | string;
    provenance?: Provenance;
    provenanceNote?: TranslationKey;
  }[] = [
    {
      name: 'data.contents.nationalResults',
      coverage: 'data.contents.nationalResultsCoverage',
      rows: ELECTIONS.reduce((a, e) => a + e.national.length, 0),
      provenance: 'reported',
    },
    {
      name: 'data.contents.areaBreakdowns',
      coverage: 'data.contents.areaBreakdownsCoverage',
      rows: ELECTIONS.reduce((a, e) => a + e.regional.length, 0),
      provenance: 'modelled',
    },
    {
      name: 'data.contents.areas',
      coverage: 'data.contents.areasCoverage',
      rows: REGIONS.length,
      provenance: 'reported',
    },
    {
      name: 'data.contents.blocs',
      coverage: 'data.contents.blocsCoverage',
      rows: COALITIONS.length,
      provenance: 'reported',
    },
    {
      name: 'data.contents.candidates',
      coverage: 'data.contents.candidatesCoverage',
      rows: CANDIDATES_2026.length,
      provenance: 'reported',
    },
    {
      name: 'data.contents.polls',
      coverage: 'data.contents.pollsCoverage',
      rows: POLLS.length,
      provenance: 'poll',
    },
    {
      name: 'data.contents.pollingStation',
      coverage: 'data.contents.pollingStationCoverage',
      rows: 0,
      provenanceNote: 'data.contents.pollingStationProvenance',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t('data.eyebrow')} title={t('data.title')} lede={t('data.lede')} />

      <Notice tone="warn" title={t('data.notice.title')}>
        <EnglishOnlyGloss />
        {t('data.notice.body')}
      </Notice>

      <Card>
        <SectionHeading title={t('data.levels.title')} subtitle={t('data.levels.subtitle')} />
        <div className="space-y-3">
          {LEVELS.map((level) => (
            <div key={level} className="hairline flex items-start gap-3 rounded-lg border p-3">
              <ProvenanceBadge provenance={level} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{t(PROVENANCE_LABEL_KEY[level])}</p>
                <p className="muted mt-0.5 text-sm leading-relaxed">
                  {t(PROVENANCE_HELP_KEY[level])}
                </p>
                {level === 'official' && (
                  <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                    {t('data.levels.officialUnused')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeading title={t('data.downloads.title')} subtitle={t('data.downloads.subtitle')} />
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={exportResults} className="btn-primary">
            {t('data.downloads.resultsCsv')}
          </button>
          <button type="button" onClick={exportJson} className="btn-ghost">
            {t('data.downloads.fullJson')}
          </button>
        </div>
        <p className="muted mt-3 text-xs leading-relaxed">{t('data.downloads.note')}</p>
        <p className="muted mt-1 text-xs leading-relaxed">{t('data.downloads.languageNote')}</p>
        <DataFreshness className="mt-3" />
      </Card>

      <Card>
        <SectionHeading title={t('data.contents.title')} subtitle={t('data.contents.subtitle')} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="hairline border-b text-left">
                <th scope="col" className="py-2 pr-3 font-semibold">
                  {t('data.contents.colDataset')}
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  {t('data.contents.colCoverage')}
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  {t('data.contents.colRows')}
                </th>
                <th scope="col" className="py-2 font-semibold">
                  {t('data.contents.colProvenance')}
                </th>
              </tr>
            </thead>
            <tbody>
              {contents.map((row) => (
                <tr key={row.name} className="hairline border-b last:border-0">
                  <th scope="row" className="py-2 pr-3 text-left font-medium">
                    {t(row.name)}
                  </th>
                  <td className="py-2 pr-3">{t(row.coverage)}</td>
                  <td className="tabular py-2 pr-3">{row.rows}</td>
                  <td className={row.provenance ? 'py-2' : 'muted py-2 text-xs'}>
                    {row.provenance ? (
                      <ProvenanceBadge provenance={row.provenance} />
                    ) : (
                      row.provenanceNote && t(row.provenanceNote)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionHeading
          title={t('data.sources.title')}
          subtitle={t('data.sources.subtitle', { count: SOURCES.length })}
        />
        <ol className="space-y-3">
          {/* Source titles and publishers are cited material: never
              translated, so a citation can always be matched to its origin. */}
          {SOURCES.map((source) => (
            <li key={source.id} className="hairline border-b pb-3 last:border-0 last:pb-0">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold underline decoration-dotted underline-offset-2 hover:text-primary dark:hover:text-accent"
              >
                {source.title}
              </a>
              <p className="muted mt-0.5 text-xs">
                {source.publisher} &middot; {formatDate(source.date)} &middot;{' '}
                <code className="rounded bg-black/5 px-1 dark:bg-white/10">{source.id}</code>
              </p>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <SectionHeading title={t('data.independence.title')} />
        <p className="text-sm leading-relaxed sm:text-base">{t('data.independence.body')}</p>
      </Card>
    </div>
  );
}
