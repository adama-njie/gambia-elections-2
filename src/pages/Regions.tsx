import { useMemo, useState } from 'react';
import RegionMap, { RegionTable, type RegionDatum } from '@/components/RegionMap';
import { Card, Citations, Notice, PageHeader, SectionHeading, ShareBar, Stat } from '@/components/ui';
import { ELECTIONS } from '@/data/elections';
import { getParty, partyColor } from '@/data/parties';
import { REGIONS } from '@/data/regions';
import { formatNumber, formatPercent } from '@/lib/format';
import type { RegionCode } from '@/types';

/** Elections for which any area-level breakdown exists in the dataset. */
const YEARS_WITH_REGIONS = ELECTIONS.filter((e) => e.regional.length > 0).map((e) => e.year);

export default function Regions() {
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
          { label: 'Turnout', value: formatPercent(row.turnout) },
        ],
      };
    }
    return out;
  }, [election, parties]);

  const selectedRow = selected ? election.regional.find((r) => r.region === selected) : undefined;
  const selectedMeta = selected ? REGIONS.find((r) => r.code === selected) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Seven administrative areas"
        title="The electoral map"
        lede="The Gambia tabulates results across seven administrative areas, which are also the IEC's reporting units. This page shows how the vote is distributed across them — and is explicit that the distribution itself is modelled, not published."
      />

      <Notice tone="warn" title="These area figures are modelled, not official">
        No official area-level or polling-station dataset exists in the public record for any
        Gambian presidential election. The EU Election Observation Mission&rsquo;s 2021 final report
        notes that the IEC published no results on its website and recommends publishing results
        disaggregated by polling station. The area shares below are therefore{' '}
        <strong>this platform&rsquo;s estimates</strong>, constrained to reproduce the verified
        national totals and built as documented in the methodology. They are useful for seeing
        shape and pattern. They are not evidence about any particular area, and they must not be
        cited as results. If the IEC publishes real disaggregated data, this page is designed to
        take it as a drop-in replacement.
      </Notice>

      <div className="no-print flex flex-wrap gap-2" role="group" aria-label="Select election year">
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
          title={`${year}: leading party by area`}
          provenance="modelled"
          subtitle="Shading reflects the size of the lead: paler areas were closer. Click an area for detail."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <RegionMap
            data={mapData}
            selected={selected}
            onSelect={setSelected}
            caption={`Modelled leading party by administrative area, ${year}`}
          />
          <div>
            <RegionTable
              data={mapData}
              columns={[...parties, 'Turnout']}
              caption={`Modelled vote share by administrative area and party, ${year}`}
            />
            <Citations className="mt-3" ids={election.sources} />
          </div>
        </div>
      </Card>

      {selectedRow && selectedMeta && (
        <Card>
          <SectionHeading
            title={`${selectedMeta.name}${selectedMeta.altName ? ` (${selectedMeta.altName})` : ''} in ${year}`}
            provenance="modelled"
            action={
              <button type="button" onClick={() => setSelected(null)} className="btn-ghost">
                Clear
              </button>
            }
          />
          <div className="mb-5 grid gap-3 sm:grid-cols-4">
            <Stat label="Area seat" value={selectedMeta.seat} provenance="reported" />
            <Stat
              label="2021 register"
              value={formatNumber(selectedMeta.registeredVoters2021)}
              provenance="reported"
            />
            <Stat
              label="Constituencies"
              value={selectedMeta.constituencies}
              provenance="reported"
            />
            <Stat
              label="Urban share"
              value={formatPercent(selectedMeta.urbanShare * 100, 0)}
              sub="Drives the urban term in the model"
              provenance="modelled"
            />
          </div>
          <div className="space-y-4">
            {parties.map((party) => (
              <ShareBar
                key={party}
                label={
                  <>
                    {party}{' '}
                    <span className="muted font-normal">{getParty(party)?.name}</span>
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
          title="The areas themselves"
          provenance="reported"
          subtitle="Population, register and constituency counts. Register figures are the 2021 presidential register apportioned to area, summing to the official national total of 962,157."
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-sm">
            <caption className="sr-only">
              The Gambia&rsquo;s seven administrative areas with population and electoral weight
            </caption>
            <thead>
              <tr className="hairline border-b text-left">
                <th scope="col" className="py-2 pr-3 font-semibold">Area</th>
                <th scope="col" className="py-2 pr-3 font-semibold">Seat</th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">Population</th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">2021 register</th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">Share of register</th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">Constituencies</th>
                <th scope="col" className="py-2 text-right font-semibold">Urban</th>
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
        <p className="muted mt-4 text-xs leading-relaxed">
          West Coast and Kanifing together hold roughly half the national register, which is why
          urban swing dominates any national projection. Central and Upper River are
          disproportionately weighty relative to their population — a long-standing feature of the
          register that shapes every campaign&rsquo;s ground strategy.
        </p>
        <Citations className="mt-2" ids={['gbos', 'standard-demography', 'iec']} />
      </Card>
    </div>
  );
}
