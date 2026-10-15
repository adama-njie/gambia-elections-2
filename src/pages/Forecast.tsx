import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ErrorBar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import RegionMap, { RegionTable, type RegionDatum } from '@/components/RegionMap';
import Slider from '@/components/Slider';
import {
  Card,
  ModelDisclaimer,
  Notice,
  PageHeader,
  SectionHeading,
  ShareBar,
  Stat,
} from '@/components/ui';
import { getCandidate } from '@/data/candidates';
import { REGIONS, regionName } from '@/data/regions';
import { useScenario } from '@/hooks/useScenario';
import { MODEL_CONSTANTS, SCENARIO_PRESETS, runForecast } from '@/lib/forecast';
import {
  downloadFile,
  formatNumber,
  formatPercent,
  formatProbability,
  formatSigned,
  toCsv,
} from '@/lib/format';
import type { RegionCode } from '@/types';

export default function Forecast() {
  const { params, set, setAll, reset, seed, isDefault } = useScenario();
  const [iterations, setIterations] = useState(10_000);
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | null>(null);
  const [copied, setCopied] = useState(false);

  const forecast = useMemo(
    () => runForecast(params, { iterations, seed }),
    [params, iterations, seed],
  );

  const leader = forecast.blocs[0]!;
  const runnerUp = forecast.blocs[1]!;

  const chartData = forecast.blocs.map((bloc) => ({
    name: bloc.name.split(' ').slice(-1)[0],
    full: bloc.name,
    mean: Number(bloc.mean.toFixed(2)),
    color: bloc.color,
    // Recharts ErrorBar takes [below, above] offsets from the value.
    error: [
      Number((bloc.mean - bloc.p10).toFixed(2)),
      Number((bloc.p90 - bloc.mean).toFixed(2)),
    ] as [number, number],
  }));

  const mapData = useMemo(() => {
    const out: Partial<Record<RegionCode, RegionDatum>> = {};
    for (const region of forecast.regions) {
      const lead = getCandidate(region.leader);
      out[region.region] = {
        color: lead?.color ?? '#CFD8DC',
        label: lead?.name ?? region.leader,
        margin: region.margin,
        tileValue: formatPercent(region.shares[region.leader] ?? 0, 0),
        detail: [
          ...forecast.blocs.map((bloc) => ({
            label: bloc.name,
            value: formatPercent(region.shares[bloc.candidate] ?? 0),
            color: bloc.color,
          })),
          { label: 'Lead', value: formatPercent(region.margin) },
          { label: 'Projected votes', value: formatNumber(region.projectedVotes) },
        ],
      };
    }
    return out;
  }, [forecast]);

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ['Gambia Elections 2026 — model projection (NOT an official result)'],
      ['Generated', new Date().toISOString()],
      ['Iterations', forecast.iterations],
      ['Seed', forecast.seed],
      [],
      ['Scenario parameter', 'Value'],
      ...Object.entries(params).map(([key, value]) => [key, value]),
      [],
      ['Candidate', 'Party', 'Mean %', 'Median %', 'P10', 'P90', 'P2.5', 'P97.5', 'Win prob %'],
      ...forecast.blocs.map((b) => [
        b.name,
        b.party,
        b.mean.toFixed(2),
        b.median.toFixed(2),
        b.p10.toFixed(2),
        b.p90.toFixed(2),
        b.p2_5.toFixed(2),
        b.p97_5.toFixed(2),
        b.winProbability.toFixed(2),
      ]),
      [],
      ['Area', ...forecast.blocs.map((b) => b.name), 'Leader', 'Lead', 'Projected votes'],
      ...forecast.regions.map((r) => [
        regionName(r.region),
        ...forecast.blocs.map((b) => (r.shares[b.candidate] ?? 0).toFixed(2)),
        getCandidate(r.leader)?.name ?? r.leader,
        r.margin.toFixed(2),
        r.projectedVotes,
      ]),
    ];
    downloadFile('gambia-2026-projection.csv', toCsv(rows), 'text/csv;charset=utf-8');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_000);
    } catch {
      // Clipboard blocked. The URL is in the address bar regardless.
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Scenario model"
        title="2026 forecast"
        lede={
          <>
            A transparent Monte Carlo model, not an opinion. It runs entirely in your browser, needs
            no API key, and produces the same numbers for the same inputs on any machine. Move a
            lever and the projection moves for a reason you can read. Every assumption is documented
            in the{' '}
            <Link to="/methodology" className="font-semibold underline underline-offset-2">
              methodology
            </Link>
            .
          </>
        }
      />

      <ModelDisclaimer />

      <div className="grid gap-6 xl:grid-cols-3">
        {/* -------------------------------------------------- controls */}
        <aside className="no-print space-y-6 xl:col-span-1">
          <Card>
            <SectionHeading
              title="Scenarios"
              subtitle="Start from a named scenario, then adjust."
            />
            <div className="space-y-2">
              {SCENARIO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setAll(preset.params)}
                  className="hairline w-full rounded-lg border p-3 text-left transition hover:border-primary hover:bg-primary/5 dark:hover:border-accent dark:hover:bg-accent/10"
                >
                  <p className="text-sm font-semibold">{preset.name}</p>
                  <p className="muted mt-0.5 text-xs leading-snug">{preset.description}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={copyLink} className="btn-ghost">
                {copied ? 'Link copied' : 'Copy shareable link'}
              </button>
              <button type="button" onClick={reset} className="btn-ghost" disabled={isDefault}>
                Reset
              </button>
            </div>
            <p className="muted mt-2 text-xs leading-snug">
              The scenario lives in the page URL, so a link reproduces these exact figures.
            </p>
          </Card>

          <Card>
            <SectionHeading
              title="Coalition dynamics"
              subtitle="The levers that decided 2016 and 2021."
            />
            <div className="space-y-5">
              <Slider
                label="Alliance vote transfer"
                value={params.transferEfficiency}
                onChange={(v) => set('transferEfficiency', v)}
                min={0}
                max={100}
                unit="%"
                help="How much of the GDC and APP-Sobeyaa 2021 vote actually turns out for the NPP flagbearer. 100% is the president's arithmetic claim; an alliance is not a merger."
              />
              <Slider
                label="Opposition consolidation"
                value={params.oppositionConsolidation}
                onChange={(v) => set('oppositionConsolidation', v)}
                min={0}
                max={100}
                unit="%"
                help="How far the three opposition blocs stand down behind their strongest challenger. 0 keeps three tickets; 100 is a single flagbearer, as in 2016."
              />
              <Slider
                label="Undecided break to challengers"
                value={params.undecidedToChallengers}
                onChange={(v) => set('undecidedToChallengers', v)}
                min={0}
                max={100}
                unit="%"
                help="The August 2026 poll left 17 per cent undecided — enough to change the order of finish on its own."
              />
              <Slider
                label="Weight on published polls"
                value={params.pollWeight}
                onChange={(v) => set('pollWeight', v)}
                min={0}
                max={100}
                unit="%"
                help="0 uses only the 2021 result plus coalition arithmetic. 100 uses only the latest poll. Two published surveys is thin evidence either way."
              />
            </div>
          </Card>

          <Card>
            <SectionHeading title="Political conditions" />
            <div className="space-y-5">
              <Slider
                label="Incumbent approval"
                value={params.incumbentApproval}
                onChange={(v) => set('incumbentApproval', v)}
                min={20}
                max={80}
                unit="%"
                help="Approval of the incumbent's record in office."
              />
              <Slider
                label="Infrastructure record rating"
                value={params.infrastructureRating}
                onChange={(v) => set('infrastructureRating', v)}
                min={20}
                max={95}
                unit="%"
                help="Public rating of the roads, bridges and energy programme the NPP campaigns on."
              />
              <Slider
                label="National turnout"
                value={params.turnout}
                onChange={(v) => set('turnout', v)}
                min={55}
                max={95}
                step={0.5}
                unit="%"
                help="89.3 per cent in 2021; 59.3 per cent in 2016. Turnout in The Gambia swings enormously."
              />
              <Slider
                label="Extra youth turnout"
                value={params.youthTurnoutSwing}
                onChange={(v) => set('youthTurnoutSwing', v)}
                min={-10}
                max={20}
                unit=" pts"
                help="Under-35 turnout relative to the national figure. Most of this effect accrues to UNITE."
              />
              <Slider
                label="New and diaspora voters"
                value={params.newVoterEffect}
                onChange={(v) => set('newVoterEffect', v)}
                min={0}
                max={8}
                step={0.5}
                unit=" pts"
                help="Net points off the incumbent from first-time registrants and diaspora participation."
              />
            </div>
          </Card>

          <Card>
            <SectionHeading title="Economic conditions" />
            <div className="space-y-5">
              <Slider
                label="Inflation"
                value={params.inflation}
                onChange={(v) => set('inflation', v)}
                min={2}
                max={30}
                step={0.5}
                unit="%"
                help="Headline annual inflation. The strongest single economic term in the model."
              />
              <Slider
                label="Real GDP growth"
                value={params.gdpGrowth}
                onChange={(v) => set('gdpGrowth', v)}
                min={-6}
                max={12}
                step={0.1}
                unit="%"
              />
              <Slider
                label="Youth unemployment"
                value={params.youthUnemployment}
                onChange={(v) => set('youthUnemployment', v)}
                min={15}
                max={70}
                unit="%"
              />
            </div>
          </Card>

          <Card>
            <SectionHeading title="Simulation" />
            <Slider
              label="Iterations"
              value={iterations}
              onChange={setIterations}
              min={1_000}
              max={50_000}
              step={1_000}
              format={(v) => formatNumber(v)}
              help="More iterations give smoother intervals. Results are seeded, so they are reproducible at any count."
            />
            <p className="muted mt-3 text-xs">Seed {forecast.seed}.</p>
          </Card>
        </aside>

        {/* -------------------------------------------------- results */}
        <div className="space-y-6 xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Model leader"
              value={leader.name.split(' ').slice(-1)[0]}
              sub={`${formatPercent(leader.mean)} central estimate`}
              provenance="modelled"
              accent={leader.color}
            />
            <Stat
              label="Leads in"
              value={formatProbability(leader.winProbability)}
              sub={`of ${formatNumber(forecast.iterations)} simulations`}
              provenance="modelled"
            />
            <Stat
              label="Projected lead"
              value={formatPercent(forecast.expectedMargin)}
              sub={`over ${runnerUp.name.split(' ').slice(-1)[0]} · ${formatProbability(forecast.tooCloseToCall)} of runs under 2 pts`}
              provenance="modelled"
            />
          </div>

          <Card>
            <SectionHeading
              title="Projected national vote share"
              provenance="modelled"
              subtitle="Bars are the central estimate; whiskers show the 80 per cent credible interval."
              action={
                <button type="button" onClick={exportCsv} className="btn-ghost">
                  Export CSV
                </button>
              }
            />
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid vertical={false} strokeOpacity={0.12} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    unit="%"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    domain={[0, 'dataMax + 8']}
                  />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Central estimate']}
                    labelFormatter={(_label, payload) => payload?.[0]?.payload?.full ?? ''}
                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="mean" radius={[4, 4, 0, 0]} maxBarSize={72}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                    <ErrorBar dataKey="error" width={6} strokeWidth={1.5} stroke="#101518" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-4">
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
                  secondary={`80% ${formatPercent(bloc.p10)}–${formatPercent(bloc.p90)} · 95% ${formatPercent(bloc.p2_5)}–${formatPercent(bloc.p97_5)} · leads in ${formatProbability(bloc.winProbability)} of runs`}
                />
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeading
              title="What is moving this projection"
              provenance="modelled"
              subtitle="Each driver's effect on the incumbent's share, in percentage points, relative to the model's reference conditions."
            />
            <ul className="space-y-2">
              {forecast.drivers.map((driver) => {
                const width = Math.min(100, (Math.abs(driver.effect) / 6) * 100);
                const helps = driver.effect >= 0;
                return (
                  <li key={driver.label} className="flex items-center gap-3 text-sm">
                    <span className="w-44 shrink-0 truncate">{driver.label}</span>
                    <span className="relative h-2 flex-1 rounded-full bg-black/[.06] dark:bg-white/10">
                      <span className="absolute inset-y-0 left-1/2 w-px bg-black/20 dark:bg-white/20" />
                      <span
                        className="absolute inset-y-0 rounded-full"
                        style={{
                          backgroundColor: helps ? '#1F6F8B' : '#E08A3C',
                          left: helps ? '50%' : `${50 - width / 2}%`,
                          width: `${width / 2}%`,
                        }}
                      />
                    </span>
                    <span className="tabular w-16 shrink-0 text-right font-semibold">
                      {formatSigned(driver.effect)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="muted mt-3 text-xs leading-relaxed">
              Blue favours the incumbent alliance, orange favours the challengers. These are the
              fundamentals only: the coalition-structure levers act on the baseline itself, not as a
              swing, so they do not appear here. Total fundamentals swing:{' '}
              {formatSigned(forecast.drivers.reduce((a, d) => a + d.effect, 0))} points.
            </p>
          </Card>

          <Card>
            <SectionHeading
              title="Projection by administrative area"
              provenance="modelled"
              subtitle="Uniform national swing applied to the modelled 2021 area baseline, with the UNITE share of the UDP base scaled by urbanisation. Shading reflects the size of the lead."
            />
            <Notice tone="warn">
              No official area-level results dataset exists in the public record for any Gambian
              presidential election. These areas start from a <strong>modelled</strong> 2021
              baseline, not a published one. Treat the national figures as far more reliable than
              any single area.
            </Notice>
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <RegionMap
                data={mapData}
                selected={selectedRegion}
                onSelect={setSelectedRegion}
                caption="Projected leading bloc by administrative area"
              />
              <div>
                <RegionTable
                  data={mapData}
                  columns={[...forecast.blocs.map((b) => b.name), 'Lead']}
                  caption="Projected vote share by administrative area and bloc"
                />
                <p className="muted mt-3 text-xs">
                  Total projected valid votes: {formatNumber(forecast.projectedTurnoutVotes)}, from
                  an assumed 2026 register of{' '}
                  {formatNumber(MODEL_CONSTANTS.assumedRegister2026)} at{' '}
                  {formatPercent(params.turnout)} turnout. The IEC has not published the final
                  register, so this figure is an assumption.
                </p>
              </div>
            </div>
          </Card>

          {selectedRegion && (
            <Card>
              <SectionHeading
                title={`${regionName(selectedRegion)} in detail`}
                provenance="modelled"
                action={
                  <button type="button" onClick={() => setSelectedRegion(null)} className="btn-ghost">
                    Clear
                  </button>
                }
              />
              {(() => {
                const region = forecast.regions.find((r) => r.region === selectedRegion)!;
                const meta = REGIONS.find((r) => r.code === selectedRegion)!;
                return (
                  <>
                    <div className="mb-4 grid gap-3 sm:grid-cols-3">
                      <Stat
                        label="Projected votes"
                        value={formatNumber(region.projectedVotes)}
                        provenance="modelled"
                      />
                      <Stat
                        label="2021 register"
                        value={formatNumber(meta.registeredVoters2021)}
                        provenance="reported"
                      />
                      <Stat
                        label="Constituencies"
                        value={meta.constituencies}
                        sub={`Seat: ${meta.seat}`}
                        provenance="reported"
                      />
                    </div>
                    <div className="space-y-4">
                      {forecast.blocs.map((bloc) => (
                        <ShareBar
                          key={bloc.candidate}
                          label={bloc.name}
                          share={region.shares[bloc.candidate] ?? 0}
                          color={bloc.color}
                        />
                      ))}
                    </div>
                  </>
                );
              })()}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
