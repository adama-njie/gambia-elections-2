import { useState } from 'react';
import {
  Card,
  Citations,
  EnglishOnlyGloss,
  Notice,
  PageHeader,
  ProvenanceBadge,
  SectionHeading,
  ShareBar,
  TabList,
} from '@/components/ui';
import { CANDIDATES_2026, REALIGNED_2026, getCandidate } from '@/data/candidates';
import { COALITIONS, COALITION_MOVEMENTS, getParty } from '@/data/parties';
import { POLLS, TIMELINE } from '@/data/polls';
import { T, useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import { daysUntil, formatDate, formatDateRange, formatNumber, formatPercent } from '@/lib/format';

const COHESION_LABEL: Record<string, TranslationKey> = {
  formal: 'race.cohesion.formal',
  announced: 'race.cohesion.announced',
  contested: 'race.cohesion.contested',
};

function CoalitionCard({ id }: { id: string }) {
  const t = useT();
  const coalition = COALITIONS.find((c) => c.id === id)!;
  const flagbearer = getCandidate(coalition.flagbearer);
  const movements = COALITION_MOVEMENTS[coalition.id] ?? [];
  const share2021 =
    (flagbearer?.share2021 ?? 0) +
    REALIGNED_2026.filter((r) => r.movedTo === coalition.id).reduce((s, r) => s + r.share2021, 0);

  return (
    <Card as="article" className="flex flex-col">
      <div
        className="mb-4 -mx-4 -mt-4 h-1.5 rounded-t-xl sm:-mx-6 sm:-mt-6"
        style={{ backgroundColor: coalition.color }}
        aria-hidden="true"
      />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-lg font-bold tracking-tight">{coalition.name}</h3>
          <p className="muted text-xs">
            {t('race.coalition.formed', {
              date: formatDate(coalition.formed),
              cohesion: t(COHESION_LABEL[coalition.cohesion]!),
            })}
          </p>
        </div>
        <ProvenanceBadge provenance="reported" />
      </div>

      {flagbearer && (
        <div className="hairline mt-4 flex items-start gap-3 rounded-lg border p-3">
          <div
            className="mt-0.5 h-10 w-10 shrink-0 rounded-full"
            style={{
              backgroundColor: `${coalition.color}22`,
              border: `2px solid ${coalition.color}`,
            }}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="font-semibold">{flagbearer.name}</p>
            <p className="muted text-xs leading-snug">{flagbearer.role}</p>
            {flagbearer.status === 'prospective' && (
              <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                {t('race.coalition.flagbearerUnconfirmed')}
              </p>
            )}
          </div>
        </div>
      )}

      <p className="mt-4 text-sm leading-relaxed">{coalition.summary}</p>

      <div className="mt-4">
        <p className="muted text-xs font-semibold uppercase tracking-wide">
          {t('race.coalition.members')}
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {coalition.members.map((memberId) => {
            const party = getParty(memberId);
            return (
              <li
                key={memberId}
                className="hairline rounded border px-2 py-0.5 text-xs font-medium"
                title={party?.name}
              >
                {memberId}
              </li>
            );
          })}
        </ul>
        {movements.length > 0 && (
          <ul className="muted mt-2 space-y-0.5 text-xs">
            {movements.map((movement) => (
              <li key={movement}>&middot; {movement}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="hairline mt-auto border-t pt-3">
        <p className="muted text-xs">
          <T
            k="race.coalition.combined2021"
            vars={{
              share: (
                <span className="tabular font-semibold">
                  {share2021 > 0 ? formatPercent(share2021) : t('race.coalition.noPrior')}
                </span>
              ),
            }}
          />
        </p>
        <Citations className="mt-2" ids={coalition.sources} />
      </div>
    </Card>
  );
}

export default function Race() {
  const t = useT();
  const [tab, setTab] = useState<'blocs' | 'calendar' | 'polling'>('blocs');
  const independents = CANDIDATES_2026.filter((c) => !c.coalition);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow={t('race.eyebrow')} title={t('race.title')} lede={t('race.lede')} />

      <Notice tone="warn" title={t('race.notice.title')}>
        <EnglishOnlyGloss />
        {t('race.notice.body', { window: formatDateRange('2026-11-03', '2026-11-14') })}
      </Notice>

      <TabList
        label={t('race.tabs.label')}
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'blocs', label: t('race.tabs.blocs') },
          { id: 'calendar', label: t('race.tabs.calendar') },
          { id: 'polling', label: t('race.tabs.polling') },
        ]}
      />

      {tab === 'blocs' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid gap-6 lg:grid-cols-2">
            {COALITIONS.map((coalition) => (
              <CoalitionCard key={coalition.id} id={coalition.id} />
            ))}
          </div>

          <Card>
            <SectionHeading
              title={t('race.changed.title')}
              subtitle={t('race.changed.subtitle')}
              provenance="reported"
            />
            <div className="space-y-4">
              {REALIGNED_2026.map((person) => (
                <div
                  key={person.name}
                  className="hairline flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {person.name} <span className="muted font-normal">({person.party})</span>
                    </p>
                    <p className="muted mt-0.5 text-xs leading-relaxed">{person.note}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="tabular text-lg font-bold">{formatPercent(person.share2021)}</p>
                    <p className="muted text-xs">
                      {t('race.changed.voteJoined', { when: person.when })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hairline mt-4 rounded-lg border bg-primary/5 p-3 dark:bg-accent/10">
              <p className="text-sm leading-relaxed">
                <T
                  k="race.changed.claimBody"
                  vars={{
                    claimTitle: <strong>{t('race.changed.claimTitle')}</strong>,
                    total: (
                      <strong>
                        {formatPercent(
                          53.23 + REALIGNED_2026.reduce((sum, r) => sum + r.share2021, 0),
                        )}
                      </strong>
                    ),
                  }}
                />
              </p>
            </div>
            <Citations
              className="mt-3"
              ids={['point-kandeh-npp', 'standard-faal-alliance', 'standard-landscape']}
            />
          </Card>

          {independents.length > 0 && (
            <Card>
              <SectionHeading
                title={t('race.independents.title')}
                provenance="reported"
                subtitle={t('race.independents.subtitle')}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {independents.map((candidate) => (
                  <div key={candidate.id} className="hairline rounded-lg border p-3">
                    <p className="font-semibold">{candidate.name}</p>
                    <p className="muted text-xs">
                      {getParty(candidate.party)?.name} &middot; {candidate.role}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed">{candidate.bio}</p>
                  </div>
                ))}
              </div>
              <Citations className="mt-3" ids={['wiki-2026']} />
            </Card>
          )}
        </div>
      )}

      {tab === 'calendar' && (
        <Card className="animate-fade-in">
          <SectionHeading
            title={t('race.calendar.title')}
            provenance="reported"
            subtitle={t('race.calendar.subtitle')}
          />
          <ol className="relative space-y-6 border-l border-black/10 pl-6 dark:border-white/10">
            {TIMELINE.map((event) => {
              const days = daysUntil(event.endDate ?? event.date);
              const past = days < 0;
              return (
                <li key={event.id} className="relative">
                  <span
                    className={`absolute -left-[1.655rem] top-1.5 h-3 w-3 rounded-full border-2 ${
                      past
                        ? 'border-black/20 bg-paper dark:border-white/20 dark:bg-ink'
                        : 'border-primary bg-primary dark:border-accent dark:bg-accent'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className={`font-semibold ${past ? 'muted' : ''}`}>{event.title}</h3>
                    {!past && days <= 60 && (
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary dark:bg-accent/15 dark:text-accent">
                        {t(days === 1 ? 'race.calendar.inDay' : 'race.calendar.inDays', { days })}
                      </span>
                    )}
                  </div>
                  <p className="muted text-xs">{formatDateRange(event.date, event.endDate)}</p>
                  <p className="mt-1.5 text-sm leading-relaxed">{event.description}</p>
                  <Citations className="mt-1.5" ids={event.sources} />
                </li>
              );
            })}
          </ol>
        </Card>
      )}

      {tab === 'polling' && (
        <div className="space-y-6 animate-fade-in">
          <Notice>{t('race.polling.notice')}</Notice>
          {[...POLLS].reverse().map((poll) => (
            <Card key={poll.id}>
              <SectionHeading
                title={poll.pollster}
                provenance="poll"
                subtitle={
                  <>
                    {t('race.poll.fieldwork', {
                      date: formatDate(poll.fieldworkEnd),
                      sample: formatNumber(poll.sampleSize),
                    })}
                    {poll.marginOfError ? t('race.poll.moe', { points: poll.marginOfError }) : ''}
                    {poll.commissionedBy
                      ? t('race.poll.commissionedBy', { organisation: poll.commissionedBy })
                      : ''}
                  </>
                }
              />
              <div className="space-y-3">
                {Object.entries(poll.shares)
                  .sort((a, b) => b[1] - a[1])
                  .map(([id, share]) => {
                    const candidate = getCandidate(id);
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
                  share={poll.undecided}
                  color="#90A4AE"
                  max={40}
                />
              </div>
              {poll.note && <p className="muted mt-3 text-xs leading-relaxed">{poll.note}</p>}
              <Citations className="mt-3" ids={poll.sources} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
