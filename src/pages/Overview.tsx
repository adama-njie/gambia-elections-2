import { Link } from 'react-router-dom';
import { CANDIDATES_2026, REALIGNED_2026 } from '@/data/candidates';
import { ELECTION_DAY_2026, ELECTIONS, LATEST_ELECTION } from '@/data/elections';
import { COALITIONS } from '@/data/parties';
import { LATEST_POLL, TIMELINE } from '@/data/polls';
import { REGISTERED_VOTERS_2021 } from '@/data/regions';
import { useScenario } from '@/hooks/useScenario';
import { runForecast } from '@/lib/forecast';
import {
  daysUntil,
  formatDate,
  formatNumber,
  formatPercent,
  formatProbability,
} from '@/lib/format';
import {
  Card,
  Citations,
  ModelDisclaimer,
  PageHeader,
  SectionHeading,
  ShareBar,
  Stat,
} from '@/components/ui';
import { useMemo } from 'react';

export default function Overview() {
  const { params, seed } = useScenario();
  // A light run on the landing page: enough for a headline, fast to render.
  const forecast = useMemo(() => runForecast(params, { iterations: 2_000, seed }), [params, seed]);
  const days = daysUntil(ELECTION_DAY_2026);
  const leader = forecast.blocs[0]!;
  const runnerUp = forecast.blocs[1]!;

  const nextEvent = TIMELINE.find((event) => daysUntil(event.endDate ?? event.date) >= 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Presidential election · 5 December 2026"
        title="The Gambia goes to the polls"
        lede={
          <>
            An independent, open-source platform for understanding the 2026 presidential election:
            the verified record since 1996, the four blocs now contesting, and a transparent
            forecasting model you can interrogate assumption by assumption. Nothing here is a
            result, and nothing here comes from the IEC.
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label={days >= 0 ? 'Days to polling day' : 'Polling day'}
          value={days >= 0 ? days : formatDate(ELECTION_DAY_2026)}
          sub={days >= 0 ? formatDate(ELECTION_DAY_2026) : 'Single round, first past the post'}
          provenance="reported"
        />
        <Stat
          label="Blocs contesting"
          value={COALITIONS.length}
          sub="One incumbent alliance, three separate opposition platforms"
          provenance="reported"
        />
        <Stat
          label="2021 register"
          value={formatNumber(REGISTERED_VOTERS_2021)}
          sub={`Turnout ${formatPercent(LATEST_ELECTION.turnout ?? 0, 1)} in 2021`}
          provenance="reported"
        />
        <Stat
          label="Model leader"
          value={leader.name.split(' ').slice(-1)[0]}
          sub={`${formatPercent(leader.mean)} central, ${formatProbability(leader.winProbability)} of simulations`}
          provenance="modelled"
          accent={leader.color}
        />
      </div>

      <ModelDisclaimer />

      {/* ------------------------------------------------------------ */}
      <Card>
        <SectionHeading
          title="The structural story of this election"
          subtitle="Why the 2016 and 2021 arithmetic matters more than any single poll"
        />
        <div className="prose-sm max-w-none space-y-3 text-sm leading-relaxed sm:text-base">
          <p>
            In 2016, seven opposition parties agreed a single flagbearer and ended twenty-two years
            of APRC rule by <strong>3.65 points</strong>. In 2021, with that coalition dissolved,
            the opposition ran five separate candidates and the incumbent won by{' '}
            <strong>25.51 points</strong> on almost identical turnout. The same electorate produced
            both outcomes. Coalition structure, not public opinion, moved most of that distance.
          </p>
          <p>
            2026 inverts 2016. The incumbent has consolidated: Mama Kandeh&rsquo;s GDC joined the
            NPP-led alliance in July 2026, and Essa Faal&rsquo;s APP-Sobeyaa followed in September.
            On 2021 numbers those three blocs together polled{' '}
            <strong>
              {formatPercent(
                (CANDIDATES_2026.find((c) => c.id === 'barrow')?.share2021 ?? 0) +
                  REALIGNED_2026.reduce((sum, r) => sum + r.share2021, 0),
              )}
            </strong>
            . Meanwhile the all-party opposition talks collapsed and produced{' '}
            <strong>three</strong> rival platforms instead of one.
          </p>
          <p>
            That is the whole question of this election, and it is a question about vote transfer,
            not popularity. An alliance is not a merger: whether a GDC voter in Central River
            actually turns out for the NPP flagbearer is an empirical matter with no precedent to
            settle it. The{' '}
            <Link to="/forecast" className="font-semibold underline underline-offset-2">
              forecast model
            </Link>{' '}
            therefore puts transfer efficiency and opposition consolidation on the front panel as
            levers, rather than burying them in a single number.
          </p>
        </div>
        <Citations
          className="mt-4"
          ids={['point-kandeh-npp', 'standard-faal-alliance', 'riotimes-three-camps', 'wiki-2016']}
        />
      </Card>

      {/* ------------------------------------------------------------ */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <SectionHeading
            title="Current model projection"
            subtitle={`${formatNumber(forecast.iterations)} simulations, seed ${forecast.seed}. Bars show the central estimate; the 80 per cent interval is below each bar.`}
            provenance="modelled"
            action={
              <Link to="/forecast" className="btn-primary">
                Open the model
              </Link>
            }
          />
          <div className="space-y-4">
            {forecast.blocs.map((bloc) => (
              <ShareBar
                key={bloc.candidate}
                label={
                  <>
                    {bloc.name} <span className="muted font-normal">{bloc.party}</span>
                  </>
                }
                share={bloc.mean}
                color={bloc.color}
                interval={[bloc.p10, bloc.p90]}
                secondary={`80% interval ${formatPercent(bloc.p10)} to ${formatPercent(bloc.p90)} · leads in ${formatProbability(bloc.winProbability)} of simulations`}
              />
            ))}
          </div>
          <p className="muted mt-4 text-xs leading-relaxed">
            Projected lead of {formatPercent(forecast.expectedMargin)} between{' '}
            {leader.name.split(' ').slice(-1)[0]} and {runnerUp.name.split(' ').slice(-1)[0]}.{' '}
            {formatProbability(forecast.tooCloseToCall)} of simulations produce a gap under two
            points. These are model outputs under the assumptions currently set, not predictions of
            the certified result.
          </p>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <SectionHeading
              title="Latest published poll"
              provenance="poll"
              subtitle={`${LATEST_POLL.pollster}, fieldwork to ${formatDate(LATEST_POLL.fieldworkEnd)}, n=${formatNumber(LATEST_POLL.sampleSize)}`}
            />
            <div className="space-y-3">
              {Object.entries(LATEST_POLL.shares)
                .sort((a, b) => b[1] - a[1])
                .map(([id, share]) => {
                  const candidate = CANDIDATES_2026.find((c) => c.id === id);
                  return (
                    <ShareBar
                      key={id}
                      label={candidate?.name ?? 'Other candidates'}
                      share={share}
                      color={candidate?.color ?? '#B0BEC5'}
                      max={40}
                    />
                  );
                })}
              <ShareBar
                label="Undecided"
                share={LATEST_POLL.undecided}
                color="#90A4AE"
                max={40}
                secondary="Large enough to change the order of finish on its own"
              />
            </div>
            {LATEST_POLL.note && <p className="muted mt-3 text-xs leading-relaxed">{LATEST_POLL.note}</p>}
            <Citations className="mt-3" ids={LATEST_POLL.sources} />
          </Card>

          {nextEvent && (
            <Card>
              <SectionHeading title="Next on the calendar" provenance="reported" />
              <p className="text-sm font-semibold">{nextEvent.title}</p>
              <p className="muted mt-0.5 text-xs">
                {nextEvent.endDate
                  ? `${formatDate(nextEvent.date)} – ${formatDate(nextEvent.endDate)}`
                  : formatDate(nextEvent.date)}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{nextEvent.description}</p>
              <Link
                to="/race"
                className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-2 dark:text-accent"
              >
                Full election calendar
              </Link>
            </Card>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      <Card>
        <SectionHeading
          title="Six elections, two systems"
          subtitle="Winning share and turnout, 1996 to 2021"
          provenance="reported"
          action={
            <Link to="/history" className="btn-ghost">
              Full history
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="hairline border-b text-left">
                <th scope="col" className="py-2 pr-3 font-semibold">Year</th>
                <th scope="col" className="py-2 pr-3 font-semibold">Winner</th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">Share</th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">Margin</th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">Turnout</th>
                <th scope="col" className="py-2 font-semibold">Candidates</th>
              </tr>
            </thead>
            <tbody>
              {ELECTIONS.map((election) => (
                <tr key={election.year} className="hairline border-b last:border-0">
                  <th scope="row" className="tabular py-2 pr-3 text-left font-medium">
                    {election.year}
                  </th>
                  <td className="py-2 pr-3">{election.winner}</td>
                  <td className="tabular py-2 pr-3 text-right">
                    {formatPercent(election.national[0]!.share)}
                  </td>
                  <td className="tabular py-2 pr-3 text-right">{formatPercent(election.margin)}</td>
                  <td className="tabular py-2 pr-3 text-right">
                    {election.turnout === null ? '—' : formatPercent(election.turnout)}
                  </td>
                  <td className="tabular py-2">{election.national.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
