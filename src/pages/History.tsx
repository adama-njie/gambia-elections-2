import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, Citations, PageHeader, SectionHeading, ShareBar, Stat, TabList } from '@/components/ui';
import { ELECTIONS } from '@/data/elections';
import { PARTIES, getParty, partyColor } from '@/data/parties';
import { formatNumber, formatPercent } from '@/lib/format';

/** Parties with enough presidential history to be worth a trend line. */
const TRACKED = ['APRC', 'UDP', 'NPP', 'GDC', 'PDOIS', 'NRP', 'COALITION-2016'];

export default function History() {
  const [year, setYear] = useState(ELECTIONS[ELECTIONS.length - 1]!.year);
  const [tab, setTab] = useState<'result' | 'trends' | 'competition'>('result');
  const election = ELECTIONS.find((e) => e.year === year)!;

  const trendData = useMemo(
    () =>
      ELECTIONS.map((e) => {
        const row: Record<string, number | null> = { year: e.year, Turnout: e.turnout };
        for (const party of TRACKED) {
          const match = e.national.find((r) => r.party === party);
          row[party] = match ? match.share : null;
        }
        return row;
      }),
    [],
  );

  const competition = useMemo(
    () =>
      ELECTIONS.map((e) => {
        const ranked = [...e.national].sort((a, b) => b.share - a.share);
        const oppositionTotal = ranked.slice(1).reduce((sum, r) => sum + r.share, 0);
        return {
          year: e.year,
          margin: e.margin,
          candidates: e.national.length,
          oppositionTotal,
          // The number that explains Gambian elections: the combined
          // opposition vote against the winner's share.
          wouldHaveWon: oppositionTotal > ranked[0]!.share,
          turnout: e.turnout,
        };
      }),
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="1996 to 2021"
        title="The electoral record"
        lede="Six presidential elections across two political systems. National figures are the IEC's announced totals as recorded by observer missions; the IEC has never published a machine-readable archive, which is why nothing here is labelled official."
      />

      <TabList
        label="History views"
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'result', label: 'Single election' },
          { id: 'trends', label: 'Trends' },
          { id: 'competition', label: 'Competitiveness' },
        ]}
      />

      {tab === 'result' && (
        <div className="space-y-6 animate-fade-in">
          <div className="no-print flex flex-wrap gap-2" role="group" aria-label="Select election year">
            {ELECTIONS.map((e) => (
              <button
                key={e.year}
                type="button"
                onClick={() => setYear(e.year)}
                aria-pressed={e.year === year}
                className={`tabular rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  e.year === year
                    ? 'bg-primary text-white'
                    : 'hairline border hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {e.year}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Winner"
              value={election.winner.split(' ').slice(-1)[0]}
              sub={getParty(election.winningParty)?.name}
              provenance={election.provenance}
              accent={partyColor(election.winningParty)}
            />
            <Stat
              label="Winning share"
              value={formatPercent(election.national[0]!.share)}
              sub={`Margin ${formatPercent(election.margin)}`}
              provenance={election.provenance}
            />
            <Stat
              label="Turnout"
              value={election.turnout === null ? '—' : formatPercent(election.turnout)}
              sub={
                election.registeredVoters
                  ? `${formatNumber(election.registeredVoters)} registered`
                  : undefined
              }
              provenance={election.provenance}
            />
            <Stat
              label="Valid votes"
              value={election.validVotes ? formatNumber(election.validVotes) : '—'}
              sub={`${election.national.length} candidates`}
              provenance={election.provenance}
            />
          </div>

          <Card>
            <SectionHeading
              title={election.context.title}
              subtitle={`${election.year} presidential election`}
              provenance={election.provenance}
            />
            <p className="text-sm leading-relaxed sm:text-base">{election.context.description}</p>
          </Card>

          <Card>
            <SectionHeading title="National result" provenance={election.provenance} />
            <div className="space-y-4">
              {election.national.map((row) => (
                <ShareBar
                  key={row.candidate}
                  label={
                    <>
                      {row.candidate}{' '}
                      <span className="muted font-normal">{getParty(row.party)?.id ?? row.party}</span>
                    </>
                  }
                  share={row.share}
                  color={partyColor(row.party)}
                  secondary={`${formatNumber(row.votes)} votes`}
                />
              ))}
            </div>
            <Citations className="mt-4" ids={election.sources} />
          </Card>
        </div>
      )}

      {tab === 'trends' && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <SectionHeading
              title="Party vote share, 1996 to 2021"
              provenance="reported"
              subtitle="Gaps mean the party did not contest that election. Note that the 2016 line is Coalition 2016, which Barrow led after resigning from the UDP, and the NPP line begins in 2021."
            />
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeOpacity={0.12} />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis unit="%" tickLine={false} axisLine={false} fontSize={12} domain={[0, 80]} />
                  <Tooltip
                    formatter={(value, name) => [`${Number(value).toFixed(2)}%`, String(name)]}
                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {TRACKED.map((party) => (
                    <Line
                      key={party}
                      type="monotone"
                      dataKey={party}
                      name={party === 'COALITION-2016' ? 'Coalition 2016' : party}
                      stroke={partyColor(party)}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <SectionHeading
              title="Turnout, 1996 to 2021"
              provenance="reported"
              subtitle="Turnout has swung by more than thirty points between consecutive elections. Any forecast that treats it as stable is mis-specified."
            />
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeOpacity={0.12} />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis unit="%" tickLine={false} axisLine={false} fontSize={12} domain={[50, 95]} />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Turnout']}
                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Turnout"
                    stroke="#1F6F8B"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {tab === 'competition' && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <SectionHeading
              title="The combined opposition vote"
              provenance="reported"
              subtitle="For each election: the winner's share, the sum of everyone else, and whether a single united opposition ticket would have outpolled the winner on those same votes."
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[44rem] text-sm">
                <thead>
                  <tr className="hairline border-b text-left">
                    <th scope="col" className="py-2 pr-3 font-semibold">Year</th>
                    <th scope="col" className="py-2 pr-3 text-right font-semibold">Winner</th>
                    <th scope="col" className="py-2 pr-3 text-right font-semibold">Rest combined</th>
                    <th scope="col" className="py-2 pr-3 text-right font-semibold">Margin</th>
                    <th scope="col" className="py-2 pr-3 text-right font-semibold">Candidates</th>
                    <th scope="col" className="py-2 font-semibold">United ticket outpolls winner</th>
                  </tr>
                </thead>
                <tbody>
                  {competition.map((row) => {
                    const election = ELECTIONS.find((e) => e.year === row.year)!;
                    return (
                      <tr key={row.year} className="hairline border-b last:border-0">
                        <th scope="row" className="tabular py-2 pr-3 text-left font-medium">
                          {row.year}
                        </th>
                        <td className="tabular py-2 pr-3 text-right">
                          {formatPercent(election.national[0]!.share)}
                        </td>
                        <td className="tabular py-2 pr-3 text-right">
                          {formatPercent(row.oppositionTotal)}
                        </td>
                        <td className="tabular py-2 pr-3 text-right">{formatPercent(row.margin)}</td>
                        <td className="tabular py-2 pr-3 text-right">{row.candidates}</td>
                        <td className="py-2">
                          <span
                            className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                              row.wouldHaveWon
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300'
                                : 'bg-black/5 dark:bg-white/10'
                            }`}
                          >
                            {row.wouldHaveWon ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="muted mt-4 text-xs leading-relaxed">
              This is an arithmetic exercise, not a counterfactual. Votes are not transferable
              property: in a consolidated race some supporters stay home and some switch sides,
              which is exactly what the transfer and consolidation levers in the forecast model
              represent. 2021 is the striking row — the combined opposition took 46.77 per cent
              against the winner&rsquo;s 53.23, so even perfect unity would have fallen short,
              while in 2016 unity was decisive at a margin of 3.65 points.
            </p>
          </Card>

          <Card>
            <SectionHeading title="Parties in the record" provenance="reported" />
            <div className="grid gap-3 sm:grid-cols-2">
              {PARTIES.filter((p) => p.profile).map((party) => (
                <div key={party.id} className="hairline rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: party.color }}
                      aria-hidden="true"
                    />
                    <p className="font-semibold">
                      {party.id}{' '}
                      {!party.active && <span className="muted text-xs font-normal">(inactive)</span>}
                    </p>
                  </div>
                  <p className="muted mt-0.5 text-xs">{party.name}</p>
                  {party.leader && <p className="muted mt-0.5 text-xs">Leader: {party.leader}</p>}
                  <p className="mt-1.5 text-sm leading-relaxed">{party.profile}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
