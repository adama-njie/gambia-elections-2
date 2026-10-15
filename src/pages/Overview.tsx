import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Citations,
  ModelDisclaimer,
  PageHeader,
  SectionHeading,
  ShareBar,
  Stat,
} from '@/components/ui';
import { CANDIDATES_2026, REALIGNED_2026 } from '@/data/candidates';
import { ELECTION_DAY_2026, ELECTIONS, LATEST_ELECTION } from '@/data/elections';
import { COALITIONS } from '@/data/parties';
import { LATEST_POLL, TIMELINE } from '@/data/polls';
import { REGISTERED_VOTERS_2021 } from '@/data/regions';
import { useScenario } from '@/hooks/useScenario';
import { T, useT } from '@/i18n';
import { runForecast } from '@/lib/forecast';
import {
  daysUntil,
  formatDate,
  formatNumber,
  formatPercent,
  formatProbability,
} from '@/lib/format';

/** Surnames are what the tiles have room for. */
function surname(name: string): string {
  return name.split(' ').slice(-1)[0] ?? name;
}

export default function Overview() {
  const t = useT();
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
        eyebrow={t('overview.eyebrow')}
        title={t('overview.title')}
        lede={t('overview.lede')}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label={t(days >= 0 ? 'overview.stat.daysToPolling' : 'overview.stat.pollingDay')}
          value={days >= 0 ? days : formatDate(ELECTION_DAY_2026)}
          sub={days >= 0 ? formatDate(ELECTION_DAY_2026) : t('overview.stat.singleRound')}
          provenance="reported"
        />
        <Stat
          label={t('overview.stat.blocs')}
          value={COALITIONS.length}
          sub={t('overview.stat.blocsSub')}
          provenance="reported"
        />
        <Stat
          label={t('overview.stat.register2021')}
          value={formatNumber(REGISTERED_VOTERS_2021)}
          sub={t('overview.stat.turnout2021Sub', {
            turnout: formatPercent(LATEST_ELECTION.turnout ?? 0, 1),
          })}
          provenance="reported"
        />
        <Stat
          label={t('overview.stat.modelLeader')}
          value={surname(leader.name)}
          sub={t('overview.stat.modelLeaderSub', {
            share: formatPercent(leader.mean),
            probability: formatProbability(leader.winProbability),
          })}
          provenance="modelled"
          accent={leader.color}
        />
      </div>

      <ModelDisclaimer />

      {/* ------------------------------------------------------------ */}
      <Card>
        <SectionHeading
          title={t('overview.structural.title')}
          subtitle={t('overview.structural.subtitle')}
        />
        <div className="prose-sm max-w-none space-y-3 text-sm leading-relaxed sm:text-base">
          <p>
            <T
              k="overview.structural.p1"
              vars={{
                margin2016: <strong>3.65 points</strong>,
                margin2021: <strong>25.51 points</strong>,
              }}
            />
          </p>
          <p>
            <T
              k="overview.structural.p2"
              vars={{
                combined: (
                  <strong>
                    {formatPercent(
                      (CANDIDATES_2026.find((c) => c.id === 'barrow')?.share2021 ?? 0) +
                        REALIGNED_2026.reduce((sum, r) => sum + r.share2021, 0),
                    )}
                  </strong>
                ),
                three: <strong>{t('overview.structural.p2Three')}</strong>,
              }}
            />
          </p>
          <p>
            <T
              k="overview.structural.p3"
              vars={{
                forecastLink: (
                  <Link to="/forecast" className="font-semibold underline underline-offset-2">
                    {t('overview.structural.forecastLink')}
                  </Link>
                ),
              }}
            />
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
            title={t('overview.projection.title')}
            subtitle={t('overview.projection.subtitle', {
              iterations: formatNumber(forecast.iterations),
              seed: forecast.seed,
            })}
            provenance="modelled"
            action={
              <Link to="/forecast" className="btn-primary">
                {t('overview.projection.open')}
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
                secondary={t('overview.projection.blocSecondary', {
                  low: formatPercent(bloc.p10),
                  high: formatPercent(bloc.p90),
                  probability: formatProbability(bloc.winProbability),
                })}
              />
            ))}
          </div>
          <p className="muted mt-4 text-xs leading-relaxed">
            {t('overview.projection.note', {
              margin: formatPercent(forecast.expectedMargin),
              leader: surname(leader.name),
              runnerUp: surname(runnerUp.name),
              tooClose: formatProbability(forecast.tooCloseToCall),
            })}
          </p>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <SectionHeading
              title={t('overview.poll.title')}
              provenance="poll"
              subtitle={t('overview.poll.subtitle', {
                pollster: LATEST_POLL.pollster,
                date: formatDate(LATEST_POLL.fieldworkEnd),
                sample: formatNumber(LATEST_POLL.sampleSize),
              })}
            />
            <div className="space-y-3">
              {Object.entries(LATEST_POLL.shares)
                .sort((a, b) => b[1] - a[1])
                .map(([id, share]) => {
                  const candidate = CANDIDATES_2026.find((c) => c.id === id);
                  return (
                    <ShareBar
                      key={id}
                      label={candidate?.name ?? t('common.otherCandidates')}
                      share={share}
                      color={candidate?.color ?? '#B0BEC5'}
                      max={40}
                    />
                  );
                })}
              <ShareBar
                label={t('common.undecided')}
                share={LATEST_POLL.undecided}
                color="#90A4AE"
                max={40}
                secondary={t('overview.poll.undecidedNote')}
              />
            </div>
            {LATEST_POLL.note && (
              <p className="muted mt-3 text-xs leading-relaxed">{LATEST_POLL.note}</p>
            )}
            <Citations className="mt-3" ids={LATEST_POLL.sources} />
          </Card>

          {nextEvent && (
            <Card>
              <SectionHeading title={t('overview.next.title')} provenance="reported" />
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
                {t('overview.next.calendarLink')}
              </Link>
            </Card>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      <Card>
        <SectionHeading
          title={t('overview.history.title')}
          subtitle={t('overview.history.subtitle')}
          provenance="reported"
          action={
            <Link to="/history" className="btn-ghost">
              {t('overview.history.full')}
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="hairline border-b text-left">
                <th scope="col" className="py-2 pr-3 font-semibold">
                  {t('overview.history.year')}
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  {t('overview.history.winner')}
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">
                  {t('overview.history.share')}
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">
                  {t('overview.history.margin')}
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">
                  {t('overview.history.turnout')}
                </th>
                <th scope="col" className="py-2 font-semibold">
                  {t('overview.history.candidates')}
                </th>
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
