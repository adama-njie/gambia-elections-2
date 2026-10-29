import { useMemo, useState } from 'react';
import RegionMap, { RegionTable, type RegionDatum } from '@/components/RegionMap';
import {
  Card,
  Citations,
  EnglishOnlyGloss,
  Notice,
  PageHeader,
  SectionHeading,
  ShareBar,
  Stat,
} from '@/components/ui';
import { ELECTIONS } from '@/data/elections';
import { getParty, partyColor } from '@/data/parties';
import { REGIONS } from '@/data/regions';
import { T, useT } from '@/i18n';
import { formatNumber, formatPercent } from '@/lib/format';
import type { RegionCode } from '@/types';

/** Elections for which any area-level breakdown exists in the dataset. */
const YEARS_WITH_REGIONS = ELECTIONS.filter((e) => e.regional.length > 0).map((e) => e.year);

export default function Regions() {
  const t = useT();
  const [year, setYear] = useState(YEARS_WITH_REGIONS[YEARS_WITH_REGIONS.length - 1]!);
  const [selected, setSelected] = useState<RegionCode | null>(null);
  const election = ELECTIONS.find((e) => e.year === year)!;

  const parties = useMemo(() => {
    const seen = new Set<string>();
    for (const row of election.regional) {
      for (const party of Object.keys(row.shares)) seen.add(party);
    }
    return [...seen].sort(
      (a, b) =>
        (election.national.find((r) => r.party === b)?.share ?? 0) -
        (election.national.find((r) => r.party === a)?.share ?? 0),
    );
  }, [election]);

  const mapData = useMemo(() => {
    const out: Partial<Record<RegionCode, RegionDatum>> = {};
    for (const row of election.regional) {
      const ranked = Object.entries(row.shares).sort((a, b) => b[1] - a[1]);
      const [leadParty, leadShare] = ranked[0]!;
      out[row.region] = {
        color: partyColor(leadParty),
        label: `${leadParty} ${formatPercent(leadShare)}`,
        margin: leadShare - (ranked[1]?.[1] ?? 0),
        tileValue: formatPercent(leadShare, 0),
        detail: [
          ...parties.map((party) => ({
            label: party,
            value: formatPercent(row.shares[party] ?? 0),
            color: partyColor(party),
          })),
          { label: t('common.turnout'), value: formatPercent(row.turnout) },
        ],
      };
    }
    return out;
  }, [election, parties, t]);

  const selectedRow = selected ? election.regional.find((r) => r.region === selected) : undefined;
  const selectedMeta = selected ? REGIONS.find((r) => r.code === selected) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('regions.eyebrow')}
        title={t('regions.title')}
        lede={t('regions.lede')}
      />

      <Notice tone="warn" title={t('regions.notice.title')}>
        <EnglishOnlyGloss />
        <T
          k="regions.notice.body"
          vars={{ estimates: <strong>{t('regions.notice.estimates')}</strong> }}
        />
      </Notice>

      <div
        className="no-print flex flex-wrap gap-2"
        role="group"
        aria-label={t('regions.yearGroupLabel')}
      >
        {YEARS_WITH_REGIONS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setYear(value)}
            aria-pressed={value === year}
            className={`tabular rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
              value === year
                ? 'bg-primary text-white'
                : 'hairline border hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <Card>
        <SectionHeading
          title={t('regions.leadByArea.title', { year })}
          provenance="official"
          subtitle={t('regions.leadByArea.subtitle')}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <RegionMap
            data={mapData}
            selected={selected}
            onSelect={setSelected}
            caption={t('regions.map.caption', { year })}
          />
          <div>
            <RegionTable
              data={mapData}
              columns={[...parties, t('common.turnout')]}
              caption={t('regions.table.caption', { year })}
            />
            <Citations className="mt-3" ids={election.sources} />
          </div>
        </div>
      </Card>

      {selectedRow && selectedMeta && (
        <Card>
          <SectionHeading
            title={t('regions.detail.title', {
              area: `${selectedMeta.name}${
                selectedMeta.altName ? ` (${selectedMeta.altName})` : ''
              }`,
              year,
            })}
            provenance="official"
            action={
              <button type="button" onClick={() => setSelected(null)} className="btn-ghost">
                {t('common.clear')}
              </button>
            }
          />
          <div className="mb-5 grid gap-3 sm:grid-cols-4">
            <Stat
              label={t('regions.stat.areaSeat')}
              value={selectedMeta.seat}
              provenance="reported"
            />
            <Stat
              label={t('regions.stat.register2021')}
              value={formatNumber(selectedMeta.registeredVoters2021)}
              provenance="reported"
            />
            <Stat
              label={t('regions.stat.constituencies')}
              value={selectedMeta.constituencies}
              provenance="reported"
            />
            <Stat
              label={t('regions.stat.urbanShare')}
              value={formatPercent(selectedMeta.urbanShare * 100, 0)}
              sub={t('regions.stat.urbanShareSub')}
              provenance="modelled"
            />
          </div>
          <div className="space-y-4">
            {parties.map((party) => (
              <ShareBar
                key={party}
                label={
                  <>
                    {party} <span className="muted font-normal">{getParty(party)?.name}</span>
                  </>
                }
                share={selectedRow.shares[party] ?? 0}
                color={partyColor(party)}
              />
            ))}
          </div>
        </Card>
      )}

      <Card>
        <SectionHeading
          title={t('regions.areas.title')}
          provenance="reported"
          subtitle={t('regions.areas.subtitle')}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-sm">
            <caption className="sr-only">{t('regions.areas.tableCaption')}</caption>
            <thead>
              <tr className="hairline border-b text-left">
                <th scope="col" className="py-2 pr-3 font-semibold">
                  {t('regions.areas.colArea')}
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  {t('regions.areas.colSeat')}
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">
                  {t('regions.areas.colPopulation')}
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">
                  {t('regions.areas.colRegister')}
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">
                  {t('regions.areas.colShareOfRegister')}
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">
                  {t('regions.areas.colConstituencies')}
                </th>
                <th scope="col" className="py-2 text-right font-semibold">
                  {t('regions.areas.colUrban')}
                </th>
              </tr>
            </thead>
            <tbody>
              {[...REGIONS]
                .sort((a, b) => b.registeredVoters2021 - a.registeredVoters2021)
                .map((region) => (
                  <tr key={region.code} className="hairline border-b last:border-0">
                    <th scope="row" className="py-2 pr-3 text-left font-medium">
                      {region.name}
                      {region.altName && <span className="muted"> ({region.altName})</span>}
                    </th>
                    <td className="py-2 pr-3">{region.seat}</td>
                    <td className="tabular py-2 pr-3 text-right">
                      {formatNumber(region.population)}
                    </td>
                    <td className="tabular py-2 pr-3 text-right">
                      {formatNumber(region.registeredVoters2021)}
                    </td>
                    <td className="tabular py-2 pr-3 text-right">
                      {formatPercent((region.registeredVoters2021 / 962_157) * 100)}
                    </td>
                    <td className="tabular py-2 pr-3 text-right">{region.constituencies}</td>
                    <td className="tabular py-2 text-right">
                      {formatPercent(region.urbanShare * 100, 0)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="muted mt-4 text-xs leading-relaxed">{t('regions.areas.note')}</p>
        <Citations className="mt-2" ids={['gbos', 'standard-demography', 'iec']} />
      </Card>
    </div>
  );
}
