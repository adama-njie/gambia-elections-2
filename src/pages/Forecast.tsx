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
  EnglishOnlyGloss,
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
import { T, useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
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

/** Surnames are what the tiles and chart axis have room for. */
function surname(name: string): string {
  return name.split(' ').slice(-1)[0] ?? name;
}

/**
 * Preset copy lives in the dictionary, keyed by preset id. A preset without
 * an entry here falls back to the English text on the preset object itself,
 * so adding one in src/lib/forecast.ts cannot break this page.
 */
const PRESET_KEYS: Record<string, { name: TranslationKey; description: TranslationKey }> = {
  central: { name: 'preset.central.name', description: 'preset.central.description' },
  arithmetic: { name: 'preset.arithmetic.name', description: 'preset.arithmetic.description' },
  fragmented: { name: 'preset.fragmented.name', description: 'preset.fragmented.description' },
  'cost-of-living': {
    name: 'preset.cost-of-living.name',
    description: 'preset.cost-of-living.description',
  },
  'late-unity': { name: 'preset.late-unity.name', description: 'preset.late-unity.description' },
};

export default function Forecast() {
  const t = useT();
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
    name: surname(bloc.name),
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
          { label: t('common.lead'), value: formatPercent(region.margin) },
          { label: t('common.projectedVotes'), value: formatNumber(region.projectedVotes) },
        ],
      };
    }
    return out;
  }, [forecast, t]);

  /**
   * The export stays in English whatever the interface language is. It is a
   * cited artefact: a column header that changes with a reader's language
   * setting cannot be referenced in a correction or a methodology note.
   */
  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ['Gambia Elections 2026: model projection (NOT an official result)'],
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
        eyebrow={t('forecast.eyebrow')}
        title={t('forecast.title')}
        lede={
          <T
            k="forecast.lede"
            vars={{
              methodology: (
                <Link to="/methodology" className="font-semibold underline underline-offset-2">
                  {t('forecast.lede.methodologyLink')}
                </Link>
              ),
            }}
          />
        }
      />

      <ModelDisclaimer />

      <div className="grid gap-6 xl:grid-cols-3">
        {/* -------------------------------------------------- controls */}
        <aside className="no-print space-y-6 xl:col-span-1">
          <Card>
            <SectionHeading
              title={t('forecast.scenarios.title')}
              subtitle={t('forecast.scenarios.subtitle')}
            />
            <div className="space-y-2">
              {SCENARIO_PRESETS.map((preset) => {
                const keys = PRESET_KEYS[preset.id];
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAll(preset.params)}
                    className="hairline w-full rounded-lg border p-3 text-left transition hover:border-primary hover:bg-primary/5 dark:hover:border-accent dark:hover:bg-accent/10"
                  >
                    <p className="text-sm font-semibold">
                      {keys ? t(keys.name) : preset.name}
                    </p>
                    <p className="muted mt-0.5 text-xs leading-snug">
                      {keys ? t(keys.description) : preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={copyLink} className="btn-ghost">
                {t(copied ? 'forecast.linkCopied' : 'forecast.copyLink')}
              </button>
              <button type="button" onClick={reset} className="btn-ghost" disabled={isDefault}>
                {t('common.reset')}
              </button>
            </div>
            <p className="muted mt-2 text-xs leading-snug">{t('forecast.urlNote')}</p>
          </Card>

          <Card>
            <SectionHeading
              title={t('forecast.group.coalition.title')}
              subtitle={t('forecast.group.coalition.subtitle')}
            />
            <div className="space-y-5">
              <Slider
                label={t('lever.transferEfficiency.label')}
                value={params.transferEfficiency}
                onChange={(v) => set('transferEfficiency', v)}
                min={0}
                max={100}
                unit="%"
                help={t('lever.transferEfficiency.help')}
              />
              <Slider
                label={t('lever.oppositionConsolidation.label')}
                value={params.oppositionConsolidation}
                onChange={(v) => set('oppositionConsolidation', v)}
                min={0}
                max={100}
                unit="%"
                help={t('lever.oppositionConsolidation.help')}
              />
              <Slider
                label={t('lever.undecidedToChallengers.label')}
                value={params.undecidedToChallengers}
                onChange={(v) => set('undecidedToChallengers', v)}
                min={0}
                max={100}
                unit="%"
                help={t('lever.undecidedToChallengers.help')}
              />
              <Slider
                label={t('lever.pollWeight.label')}
                value={params.pollWeight}
                onChange={(v) => set('pollWeight', v)}
                min={0}
                max={100}
                unit="%"
                help={t('lever.pollWeight.help')}
              />
            </div>
          </Card>

          <Card>
            <SectionHeading title={t('forecast.group.political.title')} />
            <div className="space-y-5">
              <Slider
                label={t('lever.incumbentApproval.label')}
                value={params.incumbentApproval}
                onChange={(v) => set('incumbentApproval', v)}
                min={20}
                max={80}
                unit="%"
                help={t('lever.incumbentApproval.help')}
              />
              <Slider
                label={t('lever.infrastructureRating.label')}
                value={params.infrastructureRating}
                onChange={(v) => set('infrastructureRating', v)}
                min={20}
                max={95}
                unit="%"
                help={t('lever.infrastructureRating.help')}
              />
              <Slider
                label={t('lever.turnout.label')}
                value={params.turnout}
                onChange={(v) => set('turnout', v)}
                min={55}
                max={95}
                step={0.5}
                unit="%"
                help={t('lever.turnout.help')}
              />
              <Slider
                label={t('lever.youthTurnoutSwing.label')}
                value={params.youthTurnoutSwing}
                onChange={(v) => set('youthTurnoutSwing', v)}
                min={-10}
                max={20}
                unit={t('lever.unit.points')}
                help={t('lever.youthTurnoutSwing.help')}
              />
              <Slider
                label={t('lever.newVoterEffect.label')}
                value={params.newVoterEffect}
                onChange={(v) => set('newVoterEffect', v)}
                min={0}
                max={8}
                step={0.5}
                unit={t('lever.unit.points')}
                help={t('lever.newVoterEffect.help')}
              />
            </div>
          </Card>

          <Card>
            <SectionHeading title={t('forecast.group.economic.title')} />
            <div className="space-y-5">
              <Slider
                label={t('lever.inflation.label')}
                value={params.inflation}
                onChange={(v) => set('inflation', v)}
                min={2}
                max={30}
                step={0.5}
                unit="%"
                help={t('lever.inflation.help')}
              />
              <Slider
                label={t('lever.gdpGrowth.label')}
                value={params.gdpGrowth}
                onChange={(v) => set('gdpGrowth', v)}
                min={-6}
                max={12}
                step={0.1}
                unit="%"
              />
              <Slider
                label={t('lever.youthUnemployment.label')}
                value={params.youthUnemployment}
                onChange={(v) => set('youthUnemployment', v)}
                min={15}
                max={70}
                unit="%"
              />
            </div>
          </Card>

          <Card>
            <SectionHeading title={t('forecast.group.simulation.title')} />
            <Slider
              label={t('lever.iterations.label')}
              value={iterations}
              onChange={setIterations}
              min={1_000}
              max={50_000}
              step={1_000}
              format={(v) => formatNumber(v)}
              help={t('lever.iterations.help')}
            />
            <p className="muted mt-3 text-xs">{t('forecast.seedNote', { seed: forecast.seed })}</p>
          </Card>
        </aside>

        {/* -------------------------------------------------- results */}
        <div className="space-y-6 xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label={t('forecast.stat.modelLeader')}
              value={surname(leader.name)}
              sub={t('forecast.stat.centralEstimate', { share: formatPercent(leader.mean) })}
              provenance="modelled"
              accent={leader.color}
            />
            <Stat
              label={t('forecast.stat.leadsIn')}
              value={formatProbability(leader.winProbability)}
              sub={t('forecast.stat.ofSimulations', {
                iterations: formatNumber(forecast.iterations),
              })}
              provenance="modelled"
            />
            <Stat
              label={t('forecast.stat.projectedLead')}
              value={formatPercent(forecast.expectedMargin)}
              sub={t('forecast.stat.projectedLeadSub', {
                runnerUp: surname(runnerUp.name),
                tooClose: formatProbability(forecast.tooCloseToCall),
              })}
              provenance="modelled"
            />
          </div>

          <Card>
            <SectionHeading
              title={t('forecast.chart.title')}
              provenance="modelled"
              subtitle={t('forecast.chart.subtitle')}
              action={
                <button type="button" onClick={exportCsv} className="btn-ghost">
                  {t('forecast.exportCsv')}
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
                    formatter={(value) => [
                      `${Number(value).toFixed(1)}%`,
                      t('forecast.chart.centralEstimate'),
                    ]}
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
                  secondary={t('forecast.bloc.secondary', {
                    p10: formatPercent(bloc.p10),
                    p90: formatPercent(bloc.p90),
                    p2_5: formatPercent(bloc.p2_5),
                    p97_5: formatPercent(bloc.p97_5),
                    probability: formatProbability(bloc.winProbability),
                  })}
                />
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeading
              title={t('forecast.drivers.title')}
              provenance="modelled"
              subtitle={t('forecast.drivers.subtitle')}
            />
            <ul className="space-y-2">
              {forecast.drivers.map((driver) => {
                const width = Math.min(100, (Math.abs(driver.effect) / 6) * 100);
                const helps = driver.effect >= 0;
                return (
                  <li key={driver.label} className="flex items-center gap-3 text-sm">
                    {/* Driver labels come from the model, which names them in
                        English; translating them would mean keying off model
                        internals. Tracked as a follow-up. */}
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
              {t('forecast.drivers.note', {
                total: formatSigned(forecast.drivers.reduce((a, d) => a + d.effect, 0)),
              })}
            </p>
          </Card>

          <Card>
            <SectionHeading
              title={t('forecast.areas.title')}
              provenance="modelled"
              subtitle={t('forecast.areas.subtitle')}
            />
            <Notice tone="warn">
              <EnglishOnlyGloss />
              <T
                k="forecast.areas.notice"
                vars={{ modelled: <strong>{t('forecast.areas.noticeModelled')}</strong> }}
              />
            </Notice>
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <RegionMap
                data={mapData}
                selected={selectedRegion}
                onSelect={setSelectedRegion}
                caption={t('forecast.areas.mapCaption')}
              />
              <div>
                <RegionTable
                  data={mapData}
                  columns={[...forecast.blocs.map((b) => b.name), t('common.lead')]}
                  caption={t('forecast.areas.tableCaption')}
                />
                <p className="muted mt-3 text-xs">
                  {t('forecast.areas.votesNote', {
                    votes: formatNumber(forecast.projectedTurnoutVotes),
                    register: formatNumber(MODEL_CONSTANTS.assumedRegister2026),
                    turnout: formatPercent(params.turnout),
                  })}
                </p>
              </div>
            </div>
          </Card>

          {selectedRegion && (
            <Card>
              <SectionHeading
                title={t('forecast.region.title', { region: regionName(selectedRegion) })}
                provenance="modelled"
                action={
                  <button
                    type="button"
                    onClick={() => setSelectedRegion(null)}
                    className="btn-ghost"
                  >
                    {t('common.clear')}
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
                        label={t('forecast.region.projectedVotes')}
                        value={formatNumber(region.projectedVotes)}
                        provenance="modelled"
                      />
                      <Stat
                        label={t('forecast.region.register2021')}
                        value={formatNumber(meta.registeredVoters2021)}
                        provenance="reported"
                      />
                      <Stat
                        label={t('forecast.region.constituencies')}
                        value={meta.constituencies}
                        sub={t('forecast.region.seat', { seat: meta.seat })}
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
