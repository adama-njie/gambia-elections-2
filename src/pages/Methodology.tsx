import { Link } from 'react-router-dom';
import { Card, Notice, PageHeader, SectionHeading } from '@/components/ui';
import { DEFAULT_SCENARIO, MODEL_CONSTANTS } from '@/lib/forecast';

function Coefficient({
  name,
  value,
  children,
}: {
  name: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hairline border-b py-3 last:border-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium">{name}</p>
        <code className="tabular rounded bg-black/5 px-1.5 py-0.5 text-xs font-semibold dark:bg-white/10">
          {value}
        </code>
      </div>
      <p className="muted mt-1 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

export default function Methodology() {
  const c = MODEL_CONSTANTS;
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="How this works"
        title="Methodology"
        lede="Every number this platform produces should be reproducible by someone who disagrees with us. This page documents the data rules, the model, each coefficient and the known limitations, in full."
      />

      <Notice tone="warn" title="The headline limitation, stated first">
        This model is <strong>not statistically validated against out-of-sample Gambian
        elections</strong>, because there are only six presidential elections on record and only two
        under the current multi-party configuration. Its coefficients are reasoned priors informed
        by the 1996&ndash;2021 record, not fitted parameters with standard errors. It is a
        structured way to reason about scenarios and to make assumptions explicit. It is not a
        statistical forecast in the sense that a well-polled national election permits, and the
        credible intervals it reports describe uncertainty <em>within the model</em>, not the full
        uncertainty about the world.
      </Notice>

      <Card>
        <SectionHeading title="1. Why this is not an AI model" />
        <div className="space-y-3 text-sm leading-relaxed sm:text-base">
          <p>
            An earlier version of this tool asked a large language model to predict the result. That
            approach was abandoned deliberately, for four reasons that matter for a public resource:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong>Reproducibility.</strong> The same inputs must always produce the same
              outputs, so a published figure can be audited. A sampled language model cannot
              guarantee that.
            </li>
            <li>
              <strong>Explicability.</strong> When a projection moves, a reader is entitled to know
              which assumption moved it and by how much. Here that is arithmetic you can read.
            </li>
            <li>
              <strong>Availability.</strong> No API key, no network call, no running cost. The model
              executes in the browser, which also means it works on a poor connection and cannot be
              rate-limited away during a campaign.
            </li>
            <li>
              <strong>Accountability.</strong> A wrong coefficient can be pointed at, argued with
              and corrected. A wrong intuition inside a language model cannot.
            </li>
          </ul>
          <p>
            The model is around 400 lines of TypeScript in{' '}
            <code className="rounded bg-black/5 px-1 py-0.5 text-xs dark:bg-white/10">
              src/lib/forecast.ts
            </code>
            , with a test suite that pins its invariants.
          </p>
        </div>
      </Card>

      <Card>
        <SectionHeading title="2. Data rules" />
        <div className="space-y-3 text-sm leading-relaxed sm:text-base">
          <p>Four provenance levels, shown as a badge on every figure in the interface:</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong>Official</strong> &mdash; published by the IEC or another primary official
              record. <em>Nothing in the current dataset carries this label.</em> That is not an
              oversight: the EU Election Observation Mission&rsquo;s 2021 final report records that
              the IEC published no results on its website, and recommends publication disaggregated
              by polling station. Until that exists, claiming official provenance would be false.
            </li>
            <li>
              <strong>Reported</strong> &mdash; figures the IEC announced, recorded consistently by
              observer missions and standard secondary tables. This covers all national results
              1996&ndash;2021.
            </li>
            <li>
              <strong>Modelled</strong> &mdash; produced by this platform. All area-level
              breakdowns and all forecasts.
            </li>
            <li>
              <strong>Survey</strong> &mdash; polling from a named pollster, with its sample size
              and margin of error attached.
            </li>
          </ul>
          <p>
            These rules are enforced by tests, not by convention. The suite fails if any election
            claims official provenance, if any area breakdown is labelled anything but modelled, if
            a citation does not resolve to a registered source, if vote counts contradict reported
            shares, or if a candidate is marked nominated before the IEC window closes.
          </p>
        </div>
      </Card>

      <Card>
        <SectionHeading
          title="3. The model, step by step"
          subtitle="Five stages, from the 2021 result to an area-level projection."
        />
        <ol className="space-y-4 text-sm leading-relaxed sm:text-base">
          <li>
            <p className="font-semibold">Structural prior</p>
            <p className="muted mt-0.5">
              Start from the verified 2021 national result. Add the GDC and APP-Sobeyaa 2021 vote to
              the incumbent, scaled by the transfer-efficiency lever. Split the UDP&rsquo;s 2021
              base between Darboe and Bensouda, since UNITE has no prior presidential result to
              build on. Treat the untransferred remainder as mostly demobilisation rather than
              defection.
            </p>
          </li>
          <li>
            <p className="font-semibold">Polling prior</p>
            <p className="muted mt-0.5">
              Take the most recent published survey and allocate its undecided share according to
              the undecided-break lever. Kandeh&rsquo;s and Faal&rsquo;s polled shares are folded
              into the residual rather than attributed to a standing candidate, since neither is now
              contesting.
            </p>
          </li>
          <li>
            <p className="font-semibold">Blend</p>
            <p className="muted mt-0.5">
              Interpolate the two priors by polling weight. At zero you see the pure 2021
              arithmetic; at 100 you see the polls alone.
            </p>
          </li>
          <li>
            <p className="font-semibold">Fundamentals and consolidation</p>
            <p className="muted mt-0.5">
              Apply the economic and political terms as a signed swing on the incumbent, mirrored
              onto the challengers in proportion to their size, with the youth-mobilisation
              component weighted towards UNITE. Then apply opposition consolidation: the weaker
              challengers stand down in proportion to the lever, and 82 per cent of their vote
              follows the surviving flagbearer.
            </p>
          </li>
          <li>
            <p className="font-semibold">Simulate and project down</p>
            <p className="muted mt-0.5">
              Run the scenario thousands of times, re-drawing transfer efficiency each iteration and
              adding a correlated national error plus per-bloc idiosyncratic error, with extra
              variance on UNITE as an untested entrant. Report means, medians and credible
              intervals, and the share of runs each bloc leads. Finally apply the national swing to
              the modelled 2021 area baseline as a uniform swing, with the UNITE share of the UDP
              base scaled by each area&rsquo;s urbanisation.
            </p>
          </li>
        </ol>
      </Card>

      <Card>
        <SectionHeading
          title="4. Every coefficient"
          subtitle="These are reasoned priors, not fitted parameters. Argue with them — that is the point of listing them."
        />
        <div>
          <Coefficient name="Incumbent approval" value={`${c.approvalCoefficient} pts / pt`}>
            Points of incumbent vote share per point of approval above 50.
          </Coefficient>
          <Coefficient name="Inflation" value={`−${c.inflationCoefficient} pts / pt`}>
            Points lost per point of inflation above the {c.baseline.inflation} per cent reference.
            The strongest economic term, reflecting how directly price levels are felt.
          </Coefficient>
          <Coefficient name="GDP growth" value={`${c.gdpCoefficient} pts / pt`}>
            Points gained per point of real growth above {c.baseline.gdpGrowth} per cent. Weaker
            than inflation, because aggregate growth is less legible to voters than prices.
          </Coefficient>
          <Coefficient
            name="Youth unemployment"
            value={`−${c.youthUnemploymentCoefficient} pts / pt`}
          >
            Points lost per point above the {c.baseline.youthUnemployment} per cent reference.
          </Coefficient>
          <Coefficient name="Infrastructure rating" value={`${c.infrastructureCoefficient} pts / pt`}>
            Points gained per point above {c.baseline.infrastructureRating}. The NPP&rsquo;s central
            campaign claim, so it gets its own term.
          </Coefficient>
          <Coefficient name="Turnout level" value={`−${c.turnoutCoefficient} pts / pt`}>
            Points lost per point of turnout above the 2021 level of {c.baseline.turnout} per cent.
            Higher turnout in The Gambia has historically brought in newer, younger and more urban
            voters, who lean against the incumbent.
          </Coefficient>
          <Coefficient name="Youth mobilisation" value={`−${c.youthTurnoutCoefficient} pts / pt`}>
            Points lost per point of extra under-35 turnout, of which{' '}
            {Math.round(c.youthEffectToUnite * 100)} per cent accrues specifically to UNITE.
          </Coefficient>
          <Coefficient name="UNITE share of the UDP base" value={`${c.uniteSplitOfUdp * 100}%`}>
            In the absence of polling, the share of the UDP&rsquo;s 2021 vote assumed to have moved
            to UNITE. Scaled regionally between{' '}
            {c.uniteUrbanFloor} and {c.uniteUrbanFloor + c.uniteUrbanGain} times this figure by
            urbanisation, reflecting Bensouda&rsquo;s municipal base.
          </Coefficient>
          <Coefficient name="Leakage to abstention" value={`${c.leakageToAbstention * 100}%`}>
            Of the votes that fail to transfer to an alliance flagbearer, the share that stays home
            or scatters rather than defecting to a rival. Both 2016 and 2021 suggest most leakage is
            demobilisation.
          </Coefficient>
          <Coefficient name="Consolidation retention" value={`${c.consolidationRetention * 100}%`}>
            When an opposition bloc stands down, the share of its vote that reaches the agreed
            flagbearer. Set from the 2016 precedent, where coalition transfer was good but not
            total.
          </Coefficient>
          <Coefficient name="National error" value={`σ = ${c.error.nationalSd} pts`}>
            Correlated error on the incumbent across all simulations. Set wide on purpose: in 2016 a
            22-year incumbent lost an election almost nobody forecast.
          </Coefficient>
          <Coefficient name="Per-bloc error" value={`σ = ${c.error.blocSd} pts`}>
            Idiosyncratic error on each bloc independently.
          </Coefficient>
          <Coefficient name="Transfer uncertainty" value={`σ = ${c.error.transferSd} pts`}>
            Uncertainty on the transfer-efficiency lever itself, re-drawn every iteration.
          </Coefficient>
          <Coefficient name="New-entrant error" value={`σ = ${c.error.newEntrantSd} pts`}>
            Additional variance on UNITE, which has never contested a presidential election and so
            has no prior to anchor it.
          </Coefficient>
          <Coefficient name="Assumed 2026 register" value={c.assumedRegister2026.toLocaleString('en-GB')}>
            Used only to convert projected shares into projected vote counts. The IEC has not
            published the final register, so this is an assumption and the vote counts inherit its
            error.
          </Coefficient>
        </div>
      </Card>

      <Card>
        <SectionHeading title="5. Known limitations" />
        <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed sm:text-base">
          <li>
            <strong>No validated area-level data.</strong> The 2016 and 2021 area baselines are
            modelled estimates constrained to the verified national totals. They reproduce known
            regional patterns, but they are not observations, and no area figure on this platform
            should be treated as evidence about that area.
          </li>
          <li>
            <strong>Six elections, two systems.</strong> 1996&ndash;2011 were held under conditions
            that international observers repeatedly declined to call competitive. Using them to
            calibrate a 2026 model is of limited value, and this model largely does not.
          </li>
          <li>
            <strong>Two polls.</strong> Both from one organisation, both with large undecided
            shares, the most recent with fieldwork ending before the September alliance with Essa
            Faal. The polling prior is weak evidence and the polling-weight lever exists so you can
            discount it.
          </li>
          <li>
            <strong>An unresolved field.</strong> Nominations close on 14 November 2026. The Team
            Gambia bloc had not publicly confirmed its flagbearer, and has said that person may
            stand as an independent. Blocs may still merge, split or withdraw.
          </li>
          <li>
            <strong>No ethnic or linguistic modelling.</strong> Gambian voting has well-documented
            ethno-regional patterns. This platform does not model them, for two reasons: the
            individual-level data does not exist publicly, and a civic tool that forecasts how
            ethnic groups will vote risks doing harm that outweighs its analytical value. Urbanisation
            is used as the only sub-national differentiator.
          </li>
          <li>
            <strong>No modelling of electoral integrity.</strong> The model assumes the count
            reflects the votes cast. It makes no attempt to quantify administrative irregularity,
            and nothing here should be read as a verification tool.
          </li>
        </ul>
      </Card>

      <Card>
        <SectionHeading title="6. Default scenario" subtitle="Where the model starts before you touch anything." />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[26rem] text-sm">
            <thead>
              <tr className="hairline border-b text-left">
                <th scope="col" className="py-2 pr-3 font-semibold">Parameter</th>
                <th scope="col" className="py-2 text-right font-semibold">Default</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(DEFAULT_SCENARIO).map(([key, value]) => (
                <tr key={key} className="hairline border-b last:border-0">
                  <th scope="row" className="py-2 pr-3 text-left font-normal">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (m) => m.toUpperCase())}
                  </th>
                  <td className="tabular py-2 text-right font-semibold">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted mt-4 text-sm leading-relaxed">
          Opposition consolidation defaults to zero, because as of writing three separate opposition
          blocs are contesting. Transfer efficiency defaults to 72 per cent rather than 100,
          because an alliance is not a merger and no Gambian precedent supports perfect transfer.
          Both are the assumptions most worth arguing about, which is why they sit at the top of the{' '}
          <Link to="/forecast" className="font-semibold underline underline-offset-2">
            forecast panel
          </Link>
          .
        </p>
      </Card>

      <Card>
        <SectionHeading title="7. Corrections and contributions" />
        <p className="text-sm leading-relaxed sm:text-base">
          This platform is open source. If a figure is wrong, a citation is missing, or a
          coefficient is indefensible, that is a bug and it should be filed as one. Corrections to
          the verified record take priority over everything else. If you have access to official
          IEC data at area or polling-station level, that is the single most valuable contribution
          anyone can make: the data layer is built to accept it and the modelled estimates are
          designed to be deleted the day real figures arrive.
        </p>
      </Card>
    </div>
  );
}
