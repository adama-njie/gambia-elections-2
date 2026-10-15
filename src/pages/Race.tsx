import { useState } from 'react';
import { CANDIDATES_2026, REALIGNED_2026, getCandidate } from '@/data/candidates';
import { COALITIONS, COALITION_MOVEMENTS, getParty } from '@/data/parties';
import { POLLS, TIMELINE } from '@/data/polls';
import { daysUntil, formatDate, formatDateRange, formatNumber, formatPercent } from '@/lib/format';
import {
  Card,
  Citations,
  Notice,
  PageHeader,
  ProvenanceBadge,
  SectionHeading,
  ShareBar,
  TabList,
} from '@/components/ui';

const COHESION_LABEL: Record<string, string> = {
  formal: 'Signed agreement',
  announced: 'Announced, terms not public',
  contested: 'Disputed internally',
};

function CoalitionCard({ id }: { id: string }) {
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
            Formed {formatDate(coalition.formed)} &middot; {COHESION_LABEL[coalition.cohesion]}
          </p>
        </div>
        <ProvenanceBadge provenance="reported" />
      </div>

      {flagbearer && (
        <div className="hairline mt-4 flex items-start gap-3 rounded-lg border p-3">
          <div
            className="mt-0.5 h-10 w-10 shrink-0 rounded-full"
            style={{ backgroundColor: `${coalition.color}22`, border: `2px solid ${coalition.color}` }}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="font-semibold">{flagbearer.name}</p>
            <p className="muted text-xs leading-snug">{flagbearer.role}</p>
            {flagbearer.status === 'prospective' && (
              <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                Flagbearer not yet publicly confirmed
              </p>
            )}
          </div>
        </div>
      )}

      <p className="mt-4 text-sm leading-relaxed">{coalition.summary}</p>

      <div className="mt-4">
        <p className="muted text-xs font-semibold uppercase tracking-wide">Member parties</p>
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
          Combined 2021 vote of this bloc&rsquo;s components:{' '}
          <span className="tabular font-semibold">
            {share2021 > 0 ? formatPercent(share2021) : 'no prior presidential result'}
          </span>
        </p>
        <Citations className="mt-2" ids={coalition.sources} />
      </div>
    </Card>
  );
}

export default function Race() {
  const [tab, setTab] = useState<'blocs' | 'calendar' | 'polling'>('blocs');
  const independents = CANDIDATES_2026.filter((c) => !c.coalition);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="The field"
        title="The 2026 race"
        lede="Four blocs, formed between July and September 2026 after the all-party coalition talks collapsed. One consolidated incumbent alliance, three separate opposition platforms, and a nomination window that does not close until 14 November."
      />

      <Notice tone="warn" title="No certified field exists yet">
        Nominations run {formatDateRange('2026-11-03', '2026-11-14')}. Until the IEC publishes its
        certified candidate list, every entry on this page is a declared or reported candidacy, and
        alliance terms reported in the press may not match what is eventually filed. Several
        agreements described here were not published in full by the parties to them.
      </Notice>

      <TabList
        label="2026 race views"
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'blocs', label: 'Blocs and candidates' },
          { id: 'calendar', label: 'Election calendar' },
          { id: 'polling', label: 'Polling' },
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
              title="What changed since 2021"
              subtitle="Two candidates who polled 14.32 per cent between them in 2021 are no longer standing"
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
                      {person.name}{' '}
                      <span className="muted font-normal">({person.party})</span>
                    </p>
                    <p className="muted mt-0.5 text-xs leading-relaxed">{person.note}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="tabular text-lg font-bold">{formatPercent(person.share2021)}</p>
                    <p className="muted text-xs">2021 vote &middot; joined {person.when}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hairline mt-4 rounded-lg border bg-primary/5 p-3 dark:bg-accent/10">
              <p className="text-sm leading-relaxed">
                <strong>The arithmetic claim, and its limit.</strong> Added to the incumbent&rsquo;s
                own 53.23 per cent, these blocs total{' '}
                <strong>
                  {formatPercent(
                    53.23 + REALIGNED_2026.reduce((sum, r) => sum + r.share2021, 0),
                  )}
                </strong>{' '}
                of the 2021 vote, which is the basis for the claim that the election is already
                settled. The claim holds only if those votes transfer. An alliance is not a merger,
                the GDC was explicit that it had not dissolved itself, and part of Essa
                Faal&rsquo;s camp objected to the agreement. The forecast model treats transfer as
                the open question it is.
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
                title="Standing outside the blocs"
                provenance="reported"
                subtitle="Declared candidacies not attached to any of the four platforms. Not separately modelled; folded into the residual."
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
            title="Election calendar"
            provenance="reported"
            subtitle="Where outlets report conflicting windows, the later and more specific reporting is used and the conflict is noted. The IEC's own notices govern."
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
                        in {days} {days === 1 ? 'day' : 'days'}
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
          <Notice>
            The Gambian polling market is thin: two published national surveys, from one
            organisation, both carrying large undecided shares. Treat any single poll as weak
            evidence. The forecast model lets you set polling weight to zero and see the structural
            case on its own.
          </Notice>
          {[...POLLS].reverse().map((poll) => (
            <Card key={poll.id}>
              <SectionHeading
                title={poll.pollster}
                provenance="poll"
                subtitle={
                  <>
                    Fieldwork to {formatDate(poll.fieldworkEnd)} &middot; n=
                    {formatNumber(poll.sampleSize)}
                    {poll.marginOfError ? ` · ±${poll.marginOfError} points` : ''}
                    {poll.commissionedBy ? ` · commissioned by ${poll.commissionedBy}` : ''}
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
                        label={candidate?.name ?? 'Other candidates'}
                        share={share}
                        color={candidate?.color ?? '#B0BEC5'}
                        max={40}
                      />
                    );
                  })}
                <ShareBar label="Undecided" share={poll.undecided} color="#90A4AE" max={40} />
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
