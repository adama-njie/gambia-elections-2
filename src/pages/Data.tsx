import { Card, Notice, PageHeader, ProvenanceBadge, SectionHeading } from '@/components/ui';
import { CANDIDATES_2026 } from '@/data/candidates';
import { ELECTIONS } from '@/data/elections';
import { COALITIONS } from '@/data/parties';
import { POLLS } from '@/data/polls';
import { REGIONS } from '@/data/regions';
import { SOURCES } from '@/data/sources';
import { PROVENANCE_HELP, PROVENANCE_LABEL, downloadFile, formatDate, toCsv } from '@/lib/format';
import type { Provenance } from '@/types';

const LEVELS: Provenance[] = ['official', 'reported', 'modelled', 'poll'];

export default function Data() {
  const exportResults = () => {
    const rows: (string | number)[][] = [
      ['Year', 'Date', 'Candidate', 'Party', 'Votes', 'Share %', 'Registered', 'Valid votes', 'Turnout %', 'Provenance'],
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

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Provenance and downloads"
        title="Data and sources"
        lede="The full dataset behind this platform, the provenance rules that govern it, and every source it draws on. Take it, check it, reuse it."
      />

      <Notice tone="warn" title="Nothing on this platform is official">
        The Independent Electoral Commission is the only body that can publish official results.
        The EU Election Observation Mission&rsquo;s 2021 final report records that the IEC published
        no results on its website and recommends publishing them disaggregated by polling station.
        Until that archive exists, every figure here is either a reported total or a modelled
        estimate, and the dataset labels which is which on every row.
      </Notice>

      <Card>
        <SectionHeading title="Provenance levels" subtitle="Applied to every figure in the interface." />
        <div className="space-y-3">
          {LEVELS.map((level) => (
            <div key={level} className="hairline flex items-start gap-3 rounded-lg border p-3">
              <ProvenanceBadge provenance={level} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{PROVENANCE_LABEL[level]}</p>
                <p className="muted mt-0.5 text-sm leading-relaxed">{PROVENANCE_HELP[level]}</p>
                {level === 'official' && (
                  <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                    Currently unused: no primary official dataset is publicly available.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeading
          title="Downloads"
          subtitle="Open formats, no attribution required beyond keeping the provenance labels attached."
        />
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={exportResults} className="btn-primary">
            Results 1996&ndash;2021 (CSV)
          </button>
          <button type="button" onClick={exportJson} className="btn-ghost">
            Full dataset (JSON)
          </button>
        </div>
        <p className="muted mt-3 text-xs leading-relaxed">
          If you republish these figures, carry the provenance column with them. A modelled area
          estimate that loses its label becomes misinformation.
        </p>
      </Card>

      <Card>
        <SectionHeading
          title="Dataset contents"
          subtitle="What is in the repository, and what is deliberately absent."
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="hairline border-b text-left">
                <th scope="col" className="py-2 pr-3 font-semibold">Dataset</th>
                <th scope="col" className="py-2 pr-3 font-semibold">Coverage</th>
                <th scope="col" className="py-2 pr-3 font-semibold">Rows</th>
                <th scope="col" className="py-2 font-semibold">Provenance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hairline border-b">
                <th scope="row" className="py-2 pr-3 text-left font-medium">National results</th>
                <td className="py-2 pr-3">6 elections, 1996&ndash;2021</td>
                <td className="tabular py-2 pr-3">
                  {ELECTIONS.reduce((a, e) => a + e.national.length, 0)}
                </td>
                <td className="py-2"><ProvenanceBadge provenance="reported" /></td>
              </tr>
              <tr className="hairline border-b">
                <th scope="row" className="py-2 pr-3 text-left font-medium">Area breakdowns</th>
                <td className="py-2 pr-3">2016 and 2021 only</td>
                <td className="tabular py-2 pr-3">
                  {ELECTIONS.reduce((a, e) => a + e.regional.length, 0)}
                </td>
                <td className="py-2"><ProvenanceBadge provenance="modelled" /></td>
              </tr>
              <tr className="hairline border-b">
                <th scope="row" className="py-2 pr-3 text-left font-medium">Administrative areas</th>
                <td className="py-2 pr-3">Population, register, constituencies</td>
                <td className="tabular py-2 pr-3">{REGIONS.length}</td>
                <td className="py-2"><ProvenanceBadge provenance="reported" /></td>
              </tr>
              <tr className="hairline border-b">
                <th scope="row" className="py-2 pr-3 text-left font-medium">2026 blocs</th>
                <td className="py-2 pr-3">Members, formation dates, flagbearers</td>
                <td className="tabular py-2 pr-3">{COALITIONS.length}</td>
                <td className="py-2"><ProvenanceBadge provenance="reported" /></td>
              </tr>
              <tr className="hairline border-b">
                <th scope="row" className="py-2 pr-3 text-left font-medium">2026 candidates</th>
                <td className="py-2 pr-3">Declared and prospective, pre-nomination</td>
                <td className="tabular py-2 pr-3">{CANDIDATES_2026.length}</td>
                <td className="py-2"><ProvenanceBadge provenance="reported" /></td>
              </tr>
              <tr className="hairline border-b">
                <th scope="row" className="py-2 pr-3 text-left font-medium">National polls</th>
                <td className="py-2 pr-3">2025&ndash;2026</td>
                <td className="tabular py-2 pr-3">{POLLS.length}</td>
                <td className="py-2"><ProvenanceBadge provenance="poll" /></td>
              </tr>
              <tr>
                <th scope="row" className="py-2 pr-3 text-left font-medium">Polling-station results</th>
                <td className="py-2 pr-3">Not available</td>
                <td className="tabular py-2 pr-3">0</td>
                <td className="muted py-2 text-xs">Never published by the IEC</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionHeading
          title="Every source"
          subtitle={`${SOURCES.length} registered sources. Each figure in the dataset cites at least one, and the test suite fails if a citation does not resolve.`}
        />
        <ol className="space-y-3">
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
        <SectionHeading title="Independence" />
        <p className="text-sm leading-relaxed sm:text-base">
          This platform is not affiliated with, funded by, or endorsed by the Independent Electoral
          Commission, any political party, any coalition, or any candidate. It takes no position on
          who should win. Where sources conflict, the conflict is shown rather than resolved
          silently. Where the evidence is thin &mdash; which, for the 2026 race, is often &mdash;
          the interface says so.
        </p>
      </Card>
    </div>
  );
}
