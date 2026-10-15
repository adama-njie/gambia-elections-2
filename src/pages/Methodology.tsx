import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  EnglishOnlyGloss,
  Notice,
  PageHeader,
  SectionHeading,
} from '@/components/ui';
import { T, useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
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

/** A `<strong>term.</strong> body` list item, which this page uses a lot. */
function TermItem({ term, body }: { term: TranslationKey; body: TranslationKey }) {
  const t = useT();
  return (
    <li>
      <strong>{t(term)}</strong> {t(body)}
    </li>
  );
}

export default function Methodology() {
  const t = useT();
  const c = MODEL_CONSTANTS;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t('meth.eyebrow')} title={t('meth.title')} lede={t('meth.lede')} />

      <Notice tone="warn" title={t('meth.limitation.title')}>
        <EnglishOnlyGloss />
        <T
          k="meth.limitation.body"
          vars={{
            notValidated: <strong>{t('meth.limitation.notValidated')}</strong>,
            withinTheModel: <em>{t('meth.limitation.withinTheModel')}</em>,
          }}
        />
      </Notice>

      <Card>
        <SectionHeading title={t('meth.s1.title')} />
        <div className="space-y-3 text-sm leading-relaxed sm:text-base">
          <p>{t('meth.s1.intro')}</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <TermItem term="meth.s1.reproducibility.term" body="meth.s1.reproducibility.body" />
            <TermItem term="meth.s1.explicability.term" body="meth.s1.explicability.body" />
            <TermItem term="meth.s1.availability.term" body="meth.s1.availability.body" />
            <TermItem term="meth.s1.accountability.term" body="meth.s1.accountability.body" />
          </ul>
          <p>
            <T
              k="meth.s1.outro"
              vars={{
                file: (
                  <code className="rounded bg-black/5 px-1 py-0.5 text-xs dark:bg-white/10">
                    src/lib/forecast.ts
                  </code>
                ),
              }}
            />
          </p>
        </div>
      </Card>

      <Card>
        <SectionHeading title={t('meth.s2.title')} />
        <div className="space-y-3 text-sm leading-relaxed sm:text-base">
          <p>{t('meth.s2.intro')}</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <T
                k="meth.s2.official"
                vars={{
                  term: <strong>{t('prov.official.label')}</strong>,
                  emphasis: <em>{t('meth.s2.officialEmphasis')}</em>,
                }}
              />
            </li>
            <li>
              <T
                k="meth.s2.reported"
                vars={{ term: <strong>{t('prov.reported.label')}</strong> }}
              />
            </li>
            <li>
              <T
                k="meth.s2.modelled"
                vars={{ term: <strong>{t('prov.modelled.label')}</strong> }}
              />
            </li>
            <li>
              <T k="meth.s2.survey" vars={{ term: <strong>{t('prov.poll.label')}</strong> }} />
            </li>
          </ul>
          <p>{t('meth.s2.enforced')}</p>
        </div>
      </Card>

      <Card>
        <SectionHeading title={t('meth.s3.title')} subtitle={t('meth.s3.subtitle')} />
        <ol className="space-y-4 text-sm leading-relaxed sm:text-base">
          {(
            [
              ['meth.s3.step1.title', 'meth.s3.step1.body'],
              ['meth.s3.step2.title', 'meth.s3.step2.body'],
              ['meth.s3.step3.title', 'meth.s3.step3.body'],
              ['meth.s3.step4.title', 'meth.s3.step4.body'],
              ['meth.s3.step5.title', 'meth.s3.step5.body'],
            ] as [TranslationKey, TranslationKey][]
          ).map(([title, body]) => (
            <li key={title}>
              <p className="font-semibold">{t(title)}</p>
              <p className="muted mt-0.5">{t(body)}</p>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <SectionHeading title={t('meth.s4.title')} subtitle={t('meth.s4.subtitle')} />
        <div>
          <Coefficient
            name={t('meth.coef.approval.name')}
            value={t('meth.coef.unit.ptsPerPt', { value: c.approvalCoefficient })}
          >
            {t('meth.coef.approval.body')}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.inflation.name')}
            value={t('meth.coef.unit.negPtsPerPt', { value: c.inflationCoefficient })}
          >
            {t('meth.coef.inflation.body', { baseline: c.baseline.inflation })}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.gdp.name')}
            value={t('meth.coef.unit.ptsPerPt', { value: c.gdpCoefficient })}
          >
            {t('meth.coef.gdp.body', { baseline: c.baseline.gdpGrowth })}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.youthUnemployment.name')}
            value={t('meth.coef.unit.negPtsPerPt', { value: c.youthUnemploymentCoefficient })}
          >
            {t('meth.coef.youthUnemployment.body', { baseline: c.baseline.youthUnemployment })}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.infrastructure.name')}
            value={t('meth.coef.unit.ptsPerPt', { value: c.infrastructureCoefficient })}
          >
            {t('meth.coef.infrastructure.body', { baseline: c.baseline.infrastructureRating })}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.turnout.name')}
            value={t('meth.coef.unit.negPtsPerPt', { value: c.turnoutCoefficient })}
          >
            {t('meth.coef.turnout.body', { baseline: c.baseline.turnout })}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.youthTurnout.name')}
            value={t('meth.coef.unit.negPtsPerPt', { value: c.youthTurnoutCoefficient })}
          >
            {t('meth.coef.youthTurnout.body', {
              share: Math.round(c.youthEffectToUnite * 100),
            })}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.uniteSplit.name')}
            value={`${c.uniteSplitOfUdp * 100}%`}
          >
            {t('meth.coef.uniteSplit.body', {
              floor: c.uniteUrbanFloor,
              ceiling: c.uniteUrbanFloor + c.uniteUrbanGain,
            })}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.leakage.name')}
            value={`${c.leakageToAbstention * 100}%`}
          >
            {t('meth.coef.leakage.body')}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.retention.name')}
            value={`${c.consolidationRetention * 100}%`}
          >
            {t('meth.coef.retention.body')}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.nationalError.name')}
            value={t('meth.coef.unit.sigma', { value: c.error.nationalSd })}
          >
            {t('meth.coef.nationalError.body')}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.blocError.name')}
            value={t('meth.coef.unit.sigma', { value: c.error.blocSd })}
          >
            {t('meth.coef.blocError.body')}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.transferError.name')}
            value={t('meth.coef.unit.sigma', { value: c.error.transferSd })}
          >
            {t('meth.coef.transferError.body')}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.newEntrantError.name')}
            value={t('meth.coef.unit.sigma', { value: c.error.newEntrantSd })}
          >
            {t('meth.coef.newEntrantError.body')}
          </Coefficient>
          <Coefficient
            name={t('meth.coef.register.name')}
            value={c.assumedRegister2026.toLocaleString('en-GB')}
          >
            {t('meth.coef.register.body')}
          </Coefficient>
        </div>
      </Card>

      <Card>
        <SectionHeading title={t('meth.s5.title')} />
        <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed sm:text-base">
          <TermItem term="meth.s5.areaData.term" body="meth.s5.areaData.body" />
          <TermItem term="meth.s5.sixElections.term" body="meth.s5.sixElections.body" />
          <TermItem term="meth.s5.twoPolls.term" body="meth.s5.twoPolls.body" />
          <TermItem term="meth.s5.unresolvedField.term" body="meth.s5.unresolvedField.body" />
          <TermItem term="meth.s5.noEthnic.term" body="meth.s5.noEthnic.body" />
          <TermItem term="meth.s5.noIntegrity.term" body="meth.s5.noIntegrity.body" />
        </ul>
      </Card>

      <Card>
        <SectionHeading title={t('meth.s6.title')} subtitle={t('meth.s6.subtitle')} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[26rem] text-sm">
            <thead>
              <tr className="hairline border-b text-left">
                <th scope="col" className="py-2 pr-3 font-semibold">
                  {t('meth.s6.colParameter')}
                </th>
                <th scope="col" className="py-2 text-right font-semibold">
                  {t('meth.s6.colDefault')}
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(DEFAULT_SCENARIO).map(([key, value]) => (
                <tr key={key} className="hairline border-b last:border-0">
                  {/* Parameter names are the model's own identifiers, shown
                      verbatim so a reader can match them to the URL and the
                      CSV export. */}
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
          <T
            k="meth.s6.note"
            vars={{
              forecastPanel: (
                <Link to="/forecast" className="font-semibold underline underline-offset-2">
                  {t('meth.s6.forecastPanelLink')}
                </Link>
              ),
            }}
          />
        </p>
      </Card>

      <Card>
        <SectionHeading title={t('meth.s7.title')} />
        <p className="text-sm leading-relaxed sm:text-base">{t('meth.s7.body')}</p>
      </Card>

      <Card>
        <SectionHeading title={t('meth.s8.title')} />
        <p className="text-sm leading-relaxed sm:text-base">{t('meth.s8.body')}</p>
      </Card>
    </div>
  );
}
