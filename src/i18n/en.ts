/**
 * English: the complete dictionary and the single source of truth.
 *
 * Rules for this file:
 *
 * 1. Every user-facing string in `src/components` and `src/pages` lives
 *    here. English is the only locale required to be complete; the type
 *    system derives `TranslationKey` from this object, so a key that is not
 *    here cannot be referenced anywhere in the app.
 * 2. Placeholders are `{name}`. They are substituted at render time, which
 *    keeps a whole sentence in one entry rather than splintering it into
 *    fragments a translator cannot reorder.
 * 3. Sentences that embed a link or bold run also use `{name}`; the `<T>`
 *    component substitutes React nodes for them.
 * 4. Nothing in `src/data` is translated here. That is the dataset (party
 *    names, candidate names, source titles, election context) and it is
 *    cited material, not interface copy.
 * 5. CSV and JSON exports stay in English regardless of the active locale.
 *    They are data artefacts that get republished and cited, and a column
 *    header that changes with a user's language setting makes them useless.
 */
export const en = {
  /* ---------------------------------------------------------------- */
  /* Language switching                                               */
  /* ---------------------------------------------------------------- */
  'lang.label': 'Language',
  'lang.choose': 'Choose a language',

  /* ---------------------------------------------------------------- */
  /* Brand, navigation, chrome                                        */
  /* ---------------------------------------------------------------- */
  'brand.name': 'Gambia Elections',
  'brand.tagline': 'Civic analytics',
  'brand.homeAria': 'Gambia Elections, home',

  'nav.overview': 'Overview',
  'nav.race': 'The 2026 race',
  'nav.forecast': 'Forecast',
  'nav.regions': 'Regions',
  'nav.history': 'History',
  'nav.methodology': 'Methodology',
  'nav.data': 'Data',
  'nav.primary': 'Primary',
  'nav.primaryMobile': 'Primary, mobile',

  'chrome.skipToContent': 'Skip to content',
  'chrome.menu': 'Menu',
  'chrome.loading': 'Loading',
  'chrome.themeToLight': 'Switch to light theme',
  'chrome.themeToDark': 'Switch to dark theme',
  'countdown.dayTo': 'day to {date}',
  'countdown.daysTo': 'days to {date}',

  'footer.about.title': 'Gambia Elections',
  'footer.about.body':
    'An independent, open-source civic analytics platform for The Gambia’s presidential elections. Not affiliated with the Independent Electoral Commission, any political party, or any candidate.',
  'footer.cite.title': 'Before you cite us',
  'footer.cite.body':
    'Only the IEC can declare a result. Every projection here is a model output with a stated margin. Read the {methodology} and check the {provenance}.',
  'footer.cite.methodologyLink': 'methodology',
  'footer.cite.provenanceLink': 'data provenance',
  'footer.official.title': 'Official source',
  'footer.official.body':
    '{iec} publishes the register, the certified candidate list and the official results.',
  'footer.electionDay': 'Election day: {date}. Open source, released for public use.',
  'common.iecName': 'Independent Electoral Commission',

  /* ---------------------------------------------------------------- */
  /* Shared vocabulary                                                */
  /* ---------------------------------------------------------------- */
  'common.clear': 'Clear',
  'common.reset': 'Reset',
  'common.sources': 'Sources: ',
  'common.undecided': 'Undecided',
  'common.otherCandidates': 'Other candidates',
  'common.turnout': 'Turnout',
  'common.lead': 'Lead',
  'common.projectedVotes': 'Projected votes',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.reload': 'Reload',

  /* ---------------------------------------------------------------- */
  /* Provenance: the core vocabulary of the whole platform           */
  /* ---------------------------------------------------------------- */
  'prov.official.label': 'Official',
  'prov.official.help': 'Published by the IEC or another primary official record.',
  'prov.reported.label': 'Reported',
  'prov.reported.help':
    'Announced by the IEC and recorded consistently by observer missions and standard secondary tables, but not re-derived here from a primary IEC document.',
  'prov.modelled.label': 'Modelled',
  'prov.modelled.help':
    'Produced by this platform’s model from official inputs. Not a real-world observation. See Methodology.',
  'prov.poll.label': 'Survey',
  'prov.poll.help':
    'Survey data from a named pollster, subject to its own margin of error.',

  /* ---------------------------------------------------------------- */
  /* The standing model disclaimer                                    */
  /*                                                                  */
  /* Listed in AUTHORITATIVE_EN_ONLY (see ./authoritative.ts): these   */
  /* entries are never served from a translation, because a drafted    */
  /* rendering of a statistical and legal disclaimer presented as the   */
  /* platform's own statement is a liability, not an accessibility win. */
  /* ---------------------------------------------------------------- */
  'disclaimer.model.title': 'This is a projection, not a prediction of the result',
  'disclaimer.model.body':
    'Forecasts on this platform are produced by an openly documented statistical model from historical results, published polling and user-set assumptions. They are not forecasts of certified results, they are not endorsed by the Independent Electoral Commission, and they should never be cited as a count. Only the IEC can declare a result. Read the {methodology} before quoting any figure.',
  'disclaimer.model.methodologyLink': 'methodology',

  /**
   * The short plain-language gloss. This one IS translated, because the
   * single most important sentence on the platform, "this is not a result",
   * has to reach a reader who does not read English. It is deliberately
   * written in short, concrete sentences with no statistical or legal terms,
   * it is still labelled a draft, and it is always rendered directly above
   * the authoritative English wording rather than in place of it.
   */
  'disclaimer.gloss.title': 'In short',
  'disclaimer.gloss.body':
    'This is not a result. It is an estimate made by a computer model. Only the Independent Electoral Commission can say who has won. Do not report any number here as a result.',

  /* Shown above an English-only notice when another locale is active. */
  'disclaimer.englishOnly.note':
    'The notice below is kept in English on purpose. It is a statistical and legal statement, and no translation of it has been checked by a native speaker, so an unverified rendering is not shown in its place.',

  /* ---------------------------------------------------------------- */
  /* Translation status banner                                        */
  /* ---------------------------------------------------------------- */
  'i18n.draft.title': '{language} is a draft translation.',
  'i18n.draft.body':
    '{translated} of {total} interface strings have a {language} draft. The rest, including longer analytical passages, are shown in English. No part of this translation has been checked by a native speaker yet.',
  'i18n.draft.reviewNote':
    'If you speak {language} and can review or correct it, that is the single most useful contribution anyone can make to this platform right now.',

  /* ---------------------------------------------------------------- */
  /* Offline and freshness                                            */
  /* ---------------------------------------------------------------- */
  'offline.badge': 'Offline',
  'offline.title': 'You are offline.',
  'offline.body':
    'This page is being served from a copy saved on your device, so the figures below are as stale as that copy. The forecast model itself runs on your device and is not affected.',
  'offline.updateTitle': 'A newer version is ready',
  'offline.updateBody':
    'An updated copy of the platform has been downloaded. Reload to use it.',
  'offline.updateAction': 'Reload now',
  'freshness.dataAsOf': 'Dataset last updated {date}.',
  'freshness.cachedAt': 'This copy was saved on your device on {date}.',
  'freshness.checkedAt': 'Loaded from the network {date}.',
  'freshness.unknown': 'When this copy was saved is not known.',
  'freshness.staleWarning':
    'That is {days} days ago. Check the {iec} for anything that may have changed since.',
  'freshness.installTitle': 'Works offline',
  'freshness.installBody':
    'Add this platform to your home screen and it keeps working without a connection. Pages you have opened once stay available, and the forecast model runs on your device either way.',

  /* ---------------------------------------------------------------- */
  /* Errors                                                           */
  /* ---------------------------------------------------------------- */
  'notFound.eyebrow': '404',
  'notFound.title': 'Page not found',
  'notFound.body': 'That page does not exist. Start from the {overview}.',
  'notFound.overviewLink': 'overview',
  'error.eyebrow': 'Something went wrong',
  'error.title': 'This view failed to load',
  'error.lede': 'The error has been logged to the browser console. Reloading usually clears it.',
  'error.body': 'For official election information, go to the {iec}.',

  /* ---------------------------------------------------------------- */
  /* Overview                                                         */
  /* ---------------------------------------------------------------- */
  'overview.eyebrow': 'Presidential election · 5 December 2026',
  'overview.title': 'The Gambia goes to the polls',
  'overview.lede':
    'An independent, open-source platform for understanding the 2026 presidential election: the verified record since 1996, the four blocs now contesting, and a transparent forecasting model you can interrogate assumption by assumption. Nothing here is a result, and nothing here comes from the IEC.',

  'overview.stat.daysToPolling': 'Days to polling day',
  'overview.stat.pollingDay': 'Polling day',
  'overview.stat.singleRound': 'Single round, first past the post',
  'overview.stat.blocs': 'Blocs contesting',
  'overview.stat.blocsSub': 'One incumbent alliance, three separate opposition platforms',
  'overview.stat.register2021': '2021 register',
  'overview.stat.turnout2021Sub': 'Turnout {turnout} in 2021',
  'overview.stat.modelLeader': 'Model leader',
  'overview.stat.modelLeaderSub': '{share} central, {probability} of simulations',

  'overview.structural.title': 'The structural story of this election',
  'overview.structural.subtitle':
    'Why the 2016 and 2021 arithmetic matters more than any single poll',
  'overview.structural.p1':
    'In 2016, seven opposition parties agreed a single flagbearer and ended twenty-two years of APRC rule by {margin2016}. In 2021, with that coalition dissolved, the opposition ran five separate candidates and the incumbent won by {margin2021} on almost identical turnout. The same electorate produced both outcomes. Coalition structure, not public opinion, moved most of that distance.',
  'overview.structural.p2':
    '2026 inverts 2016. The incumbent has consolidated: Mama Kandeh’s GDC joined the NPP-led alliance in July 2026, and Essa Faal’s APP-Sobeyaa followed in September. On 2021 numbers those three blocs together polled {combined}. Meanwhile the all-party opposition talks collapsed and produced {three} rival platforms instead of one.',
  'overview.structural.p3':
    'That is the whole question of this election, and it is a question about vote transfer, not popularity. An alliance is not a merger: whether a GDC voter in Central River actually turns out for the NPP flagbearer is an empirical matter with no precedent to settle it. The {forecastLink} therefore puts transfer efficiency and opposition consolidation on the front panel as levers, rather than burying them in a single number.',
  'overview.structural.p2Three': 'three',
  'overview.structural.forecastLink': 'forecast model',

  'overview.projection.title': 'Current model projection',
  'overview.projection.subtitle':
    '{iterations} simulations, seed {seed}. Bars show the central estimate; the 80 per cent interval is below each bar.',
  'overview.projection.open': 'Open the model',
  'overview.projection.blocSecondary':
    '80% interval {low} to {high} · leads in {probability} of simulations',
  'overview.projection.note':
    'Projected lead of {margin} between {leader} and {runnerUp}. {tooClose} of simulations produce a gap under two points. These are model outputs under the assumptions currently set, not predictions of the certified result.',

  'overview.poll.title': 'Latest published poll',
  'overview.poll.subtitle': '{pollster}, fieldwork to {date}, n={sample}',
  'overview.poll.undecidedNote': 'Large enough to change the order of finish on its own',

  'overview.next.title': 'Next on the calendar',
  'overview.next.calendarLink': 'Full election calendar',

  'overview.history.title': 'Six elections, two systems',
  'overview.history.subtitle': 'Winning share and turnout, 1996 to 2021',
  'overview.history.full': 'Full history',
  'overview.history.year': 'Year',
  'overview.history.winner': 'Winner',
  'overview.history.share': 'Share',
  'overview.history.margin': 'Margin',
  'overview.history.turnout': 'Turnout',
  'overview.history.candidates': 'Candidates',

  /* ---------------------------------------------------------------- */
  /* The 2026 race                                                    */
  /* ---------------------------------------------------------------- */
  'race.eyebrow': 'The field',
  'race.title': 'The 2026 race',
  'race.lede':
    'Four blocs, formed between July and September 2026 after the all-party coalition talks collapsed. One consolidated incumbent alliance, three separate opposition platforms, and a nomination window that does not close until 14 November.',

  'race.notice.title': 'No certified field exists yet',
  'race.notice.body':
    'Nominations run {window}. Until the IEC publishes its certified candidate list, every entry on this page is a declared or reported candidacy, and alliance terms reported in the press may not match what is eventually filed. Several agreements described here were not published in full by the parties to them.',

  'race.tabs.label': '2026 race views',
  'race.tabs.blocs': 'Blocs and candidates',
  'race.tabs.calendar': 'Election calendar',
  'race.tabs.polling': 'Polling',

  'race.cohesion.formal': 'Signed agreement',
  'race.cohesion.announced': 'Announced, terms not public',
  'race.cohesion.contested': 'Disputed internally',

  'race.coalition.formed': 'Formed {date} · {cohesion}',
  'race.coalition.flagbearerUnconfirmed': 'Flagbearer not yet publicly confirmed',
  'race.coalition.members': 'Member parties',
  'race.coalition.combined2021': 'Combined 2021 vote of this bloc’s components: {share}',
  'race.coalition.noPrior': 'no prior presidential result',

  'race.changed.title': 'What changed since 2021',
  'race.changed.subtitle':
    'Two candidates who polled 14.32 per cent between them in 2021 are no longer standing',
  'race.changed.voteJoined': '2021 vote · joined {when}',
  'race.changed.claimTitle': 'The arithmetic claim, and its limit.',
  'race.changed.claimBody':
    '{claimTitle} Added to the incumbent’s own 53.23 per cent, these blocs total {total} of the 2021 vote, which is the basis for the claim that the election is already settled. The claim holds only if those votes transfer. An alliance is not a merger, the GDC was explicit that it had not dissolved itself, and part of Essa Faal’s camp objected to the agreement. The forecast model treats transfer as the open question it is.',

  'race.independents.title': 'Standing outside the blocs',
  'race.independents.subtitle':
    'Declared candidacies not attached to any of the four platforms. Not separately modelled; folded into the residual.',

  'race.calendar.title': 'Election calendar',
  'race.calendar.subtitle':
    'Where outlets report conflicting windows, the later and more specific reporting is used and the conflict is noted. The IEC’s own notices govern.',
  'race.calendar.inDay': 'in {days} day',
  'race.calendar.inDays': 'in {days} days',

  'race.polling.notice':
    'The Gambian polling market is thin: two published national surveys, from one organisation, both carrying large undecided shares. Treat any single poll as weak evidence. The forecast model lets you set polling weight to zero and see the structural case on its own.',
  'race.poll.fieldwork': 'Fieldwork to {date} · n={sample}',
  'race.poll.moe': ' · ±{points} points',
  'race.poll.commissionedBy': ' · commissioned by {organisation}',

  /* ---------------------------------------------------------------- */
  /* Forecast                                                         */
  /* ---------------------------------------------------------------- */
  'forecast.eyebrow': 'Scenario model',
  'forecast.title': '2026 forecast',
  'forecast.lede':
    'A transparent Monte Carlo model, not an opinion. It runs entirely in your browser, needs no API key, and produces the same numbers for the same inputs on any machine. Move a lever and the projection moves for a reason you can read. Every assumption is documented in the {methodology}.',
  'forecast.lede.methodologyLink': 'methodology',

  'forecast.scenarios.title': 'Scenarios',
  'forecast.scenarios.subtitle': 'Start from a named scenario, then adjust.',
  'forecast.copyLink': 'Copy shareable link',
  'forecast.linkCopied': 'Link copied',
  'forecast.urlNote': 'The scenario lives in the page URL, so a link reproduces these exact figures.',

  'forecast.group.coalition.title': 'Coalition dynamics',
  'forecast.group.coalition.subtitle': 'The levers that decided 2016 and 2021.',
  'forecast.group.political.title': 'Political conditions',
  'forecast.group.economic.title': 'Economic conditions',
  'forecast.group.simulation.title': 'Simulation',
  'forecast.seedNote': 'Seed {seed}.',

  'lever.transferEfficiency.label': 'Alliance vote transfer',
  'lever.transferEfficiency.help':
    'How much of the GDC and APP-Sobeyaa 2021 vote actually turns out for the NPP flagbearer. 100% is the president’s arithmetic claim; an alliance is not a merger.',
  'lever.oppositionConsolidation.label': 'Opposition consolidation',
  'lever.oppositionConsolidation.help':
    'How far the three opposition blocs stand down behind their strongest challenger. 0 keeps three tickets; 100 is a single flagbearer, as in 2016.',
  'lever.undecidedToChallengers.label': 'Undecided break to challengers',
  'lever.undecidedToChallengers.help':
    'The August 2026 poll left 17 per cent undecided, enough to change the order of finish on its own.',
  'lever.pollWeight.label': 'Weight on published polls',
  'lever.pollWeight.help':
    '0 uses only the 2021 result plus coalition arithmetic. 100 uses only the latest poll. Two published surveys is thin evidence either way.',
  'lever.incumbentApproval.label': 'Incumbent approval',
  'lever.incumbentApproval.help': 'Approval of the incumbent’s record in office.',
  'lever.infrastructureRating.label': 'Infrastructure record rating',
  'lever.infrastructureRating.help':
    'Public rating of the roads, bridges and energy programme the NPP campaigns on.',
  'lever.turnout.label': 'National turnout',
  'lever.turnout.help':
    '89.3 per cent in 2021; 59.3 per cent in 2016. Turnout in The Gambia swings enormously.',
  'lever.youthTurnoutSwing.label': 'Extra youth turnout',
  'lever.youthTurnoutSwing.help':
    'Under-35 turnout relative to the national figure. Most of this effect accrues to UNITE.',
  'lever.newVoterEffect.label': 'New and diaspora voters',
  'lever.newVoterEffect.help':
    'Net points off the incumbent from first-time registrants and diaspora participation.',
  'lever.inflation.label': 'Inflation',
  'lever.inflation.help':
    'Headline annual inflation. The strongest single economic term in the model.',
  'lever.gdpGrowth.label': 'Real GDP growth',
  'lever.youthUnemployment.label': 'Youth unemployment',
  'lever.iterations.label': 'Iterations',
  'lever.iterations.help':
    'More iterations give smoother intervals. Results are seeded, so they are reproducible at any count.',
  'lever.unit.points': ' pts',

  'preset.central.name': 'Central scenario',
  'preset.central.description':
    'Current economic indicators, a partially effective incumbent alliance, and polls given equal weight with the 2021 baseline.',
  'preset.arithmetic.name': 'The arithmetic case',
  'preset.arithmetic.description':
    'The president’s own framing: every GDC and APP-Sobeyaa vote from 2021 transfers intact to the alliance, and the 2021 result is the only guide.',
  'preset.fragmented.name': 'Three-way opposition split',
  'preset.fragmented.description':
    'The alliance holds together and the three opposition blocs each run a full campaign without consolidating. The 2006 pattern.',
  'preset.cost-of-living.name': 'Cost-of-living election',
  'preset.cost-of-living.description':
    'Prices dominate the campaign, approval of the incumbent record falls, and younger urban voters turn out in force.',
  'preset.late-unity.name': 'Late opposition unity',
  'preset.late-unity.description':
    'A single opposition flagbearer emerges before polling day, as in 2016, while discipline inside the incumbent alliance frays. The scenario the arithmetic case assumes away.',

  'forecast.stat.modelLeader': 'Model leader',
  'forecast.stat.centralEstimate': '{share} central estimate',
  'forecast.stat.leadsIn': 'Leads in',
  'forecast.stat.ofSimulations': 'of {iterations} simulations',
  'forecast.stat.projectedLead': 'Projected lead',
  'forecast.stat.projectedLeadSub': 'over {runnerUp} · {tooClose} of runs under 2 pts',

  'forecast.chart.title': 'Projected national vote share',
  'forecast.chart.subtitle':
    'Bars are the central estimate; whiskers show the 80 per cent credible interval.',
  'forecast.chart.centralEstimate': 'Central estimate',
  'forecast.exportCsv': 'Export CSV',
  'forecast.bloc.secondary':
    '80% {p10}–{p90} · 95% {p2_5}–{p97_5} · leads in {probability} of runs',

  'forecast.drivers.title': 'What is moving this projection',
  'forecast.drivers.subtitle':
    'Each driver’s effect on the incumbent’s share, in percentage points, relative to the model’s reference conditions.',
  'forecast.drivers.note':
    'Blue favours the incumbent alliance, orange favours the challengers. These are the fundamentals only: the coalition-structure levers act on the baseline itself, not as a swing, so they do not appear here. Total fundamentals swing: {total} points.',

  'forecast.areas.title': 'Projection by administrative area',
  'forecast.areas.subtitle':
    'Uniform national swing applied to the modelled 2021 area baseline, with the UNITE share of the UDP base scaled by urbanisation. Shading reflects the size of the lead.',
  'forecast.areas.notice':
    'Area baselines are the IEC\u2019s own published constituency results, aggregated to administrative area.',
  'forecast.areas.noticeModelled': 'The projection applied to them is modelled: it is this platform\u2019s estimate, not an observation, and an area-level projection carries more uncertainty than the national figure.',
  'forecast.areas.mapCaption': 'Projected leading bloc by administrative area',
  'forecast.areas.tableCaption': 'Projected vote share by administrative area and bloc',
  'forecast.areas.votesNote':
    'Total projected valid votes: {votes}, from an assumed 2026 register of {register} at {turnout} turnout. The IEC has not published the final register, so this figure is an assumption.',

  'forecast.region.title': '{region} in detail',
  'forecast.region.projectedVotes': 'Projected votes',
  'forecast.region.register2021': '2021 register',
  'forecast.region.constituencies': 'Constituencies',
  'forecast.region.seat': 'Seat: {seat}',

  /* ---------------------------------------------------------------- */
  /* Regions                                                          */
  /* ---------------------------------------------------------------- */
  'regions.eyebrow': 'Seven administrative areas',
  'regions.title': 'The electoral map',
  'regions.lede':
    'The Gambia tabulates results across seven administrative areas, which are also the IEC\u2019s reporting units. This page shows how the vote is distributed across them, using the Commission\u2019s own published constituency tables.',

  'regions.notice.title': 'These area figures are the IEC\u2019s official results',
  'regions.notice.body':
    'The Commission publishes a constituency-level results table for every presidential election since 1996 at iec.gm. The figures on this page are extracted from those documents and reconciled against each document\u2019s own printed national total before use.',
  'regions.notice.estimates': 'Earlier versions of this page carried modelled estimates, because the EU Election Observation Mission\u2019s 2021 report recorded that the IEC published no results on its website and recommended publication disaggregated by polling station. The Commission has since published them. The estimates they replace were wrong by an average of 7.9 points per area in 2021, which is why they were labelled modelled and never official.',

  'regions.yearGroupLabel': 'Select election year',
  'regions.leadByArea.title': '{year}: leading party by area',
  'regions.leadByArea.subtitle':
    'Shading reflects the size of the lead: paler areas were closer. Click an area for detail.',
  'regions.map.caption': 'Modelled leading party by administrative area, {year}',
  'regions.table.caption': 'Modelled vote share by administrative area and party, {year}',

  'regions.detail.title': '{area} in {year}',
  'regions.stat.areaSeat': 'Area seat',
  'regions.stat.register2021': '2021 register',
  'regions.stat.constituencies': 'Constituencies',
  'regions.stat.urbanShare': 'Urban share',
  'regions.stat.urbanShareSub': 'Drives the urban term in the model',

  'regions.areas.title': 'The areas themselves',
  'regions.areas.subtitle':
    'Population, register and constituency counts. Register figures are the 2021 presidential register apportioned to area, summing to the official national total of 962,157.',
  'regions.areas.tableCaption':
    'The Gambia’s seven administrative areas with population and electoral weight',
  'regions.areas.colArea': 'Area',
  'regions.areas.colSeat': 'Seat',
  'regions.areas.colPopulation': 'Population',
  'regions.areas.colRegister': '2021 register',
  'regions.areas.colShareOfRegister': 'Share of register',
  'regions.areas.colConstituencies': 'Constituencies',
  'regions.areas.colUrban': 'Urban',
  'regions.areas.note':
    'West Coast and Kanifing together hold roughly half the national register, which is why urban swing dominates any national projection. Central and Upper River are disproportionately weighty relative to their population, a long-standing feature of the register that shapes every campaign’s ground strategy.',

  /* ---------------------------------------------------------------- */
  /* History                                                          */
  /* ---------------------------------------------------------------- */
  'history.eyebrow': '1996 to 2021',
  'history.title': 'The electoral record',
  'history.lede':
    'Six presidential elections across two political systems. National figures are the IEC’s announced totals as recorded by observer missions; the IEC has never published a machine-readable archive, which is why nothing here is labelled official.',

  'history.tabs.label': 'History views',
  'history.tabs.result': 'Single election',
  'history.tabs.trends': 'Trends',
  'history.tabs.competition': 'Competitiveness',
  'history.yearGroupLabel': 'Select election year',

  'history.stat.winner': 'Winner',
  'history.stat.winningShare': 'Winning share',
  'history.stat.marginSub': 'Margin {margin}',
  'history.stat.turnout': 'Turnout',
  'history.stat.registeredSub': '{registered} registered',
  'history.stat.validVotes': 'Valid votes',
  'history.stat.candidatesSub': '{count} candidates',

  'history.context.subtitle': '{year} presidential election',
  'history.national.title': 'National result',
  'history.national.votes': '{votes} votes',

  'history.trends.title': 'Party vote share, 1996 to 2021',
  'history.trends.subtitle':
    'Gaps mean the party did not contest that election. Note that the 2016 line is Coalition 2016, which Barrow led after resigning from the UDP, and the NPP line begins in 2021.',
  'history.coalition2016': 'Coalition 2016',
  'history.turnoutChart.title': 'Turnout, 1996 to 2021',
  'history.turnoutChart.subtitle':
    'Turnout has swung by more than thirty points between consecutive elections. Any forecast that treats it as stable is mis-specified.',

  'history.competition.title': 'The combined opposition vote',
  'history.competition.subtitle':
    'For each election: the winner’s share, the sum of everyone else, and whether a single united opposition ticket would have outpolled the winner on those same votes.',
  'history.competition.colYear': 'Year',
  'history.competition.colWinner': 'Winner',
  'history.competition.colRest': 'Rest combined',
  'history.competition.colMargin': 'Margin',
  'history.competition.colCandidates': 'Candidates',
  'history.competition.colUnited': 'United ticket outpolls winner',
  'history.competition.note':
    'This is an arithmetic exercise, not a counterfactual. Votes are not transferable property: in a consolidated race some supporters stay home and some switch sides, which is exactly what the transfer and consolidation levers in the forecast model represent. 2021 is the striking row, the combined opposition took 46.77 per cent against the winner’s 53.23, so even perfect unity would have fallen short, while in 2016 unity was decisive at a margin of 3.65 points.',

  'history.parties.title': 'Parties in the record',
  'history.parties.inactive': '(inactive)',
  'history.parties.leader': 'Leader: {leader}',

  /* ---------------------------------------------------------------- */
  /* Methodology                                                      */
  /* ---------------------------------------------------------------- */
  'meth.eyebrow': 'How this works',
  'meth.title': 'Methodology',
  'meth.lede':
    'Every number this platform produces should be reproducible by someone who disagrees with us. This page documents the data rules, the model, each coefficient and the known limitations, in full.',

  'meth.limitation.title': 'The headline limitation, stated first',
  'meth.limitation.body':
    'This model is {notValidated}, because there are only six presidential elections on record and only two under the current multi-party configuration. Its coefficients are reasoned priors informed by the 1996–2021 record, not fitted parameters with standard errors. It is a structured way to reason about scenarios and to make assumptions explicit. It is not a statistical forecast in the sense that a well-polled national election permits, and the credible intervals it reports describe uncertainty {withinTheModel}, not the full uncertainty about the world.',
  'meth.limitation.notValidated': 'not statistically validated against out-of-sample Gambian elections',
  'meth.limitation.withinTheModel': 'within the model',

  'meth.s1.title': '1. Why this is not an AI model',
  'meth.s1.intro':
    'An earlier version of this tool asked a large language model to predict the result. That approach was abandoned deliberately, for four reasons that matter for a public resource:',
  'meth.s1.reproducibility.term': 'Reproducibility.',
  'meth.s1.reproducibility.body':
    'The same inputs must always produce the same outputs, so a published figure can be audited. A sampled language model cannot guarantee that.',
  'meth.s1.explicability.term': 'Explicability.',
  'meth.s1.explicability.body':
    'When a projection moves, a reader is entitled to know which assumption moved it and by how much. Here that is arithmetic you can read.',
  'meth.s1.availability.term': 'Availability.',
  'meth.s1.availability.body':
    'No API key, no network call, no running cost. The model executes in the browser, which also means it works on a poor connection and cannot be rate-limited away during a campaign.',
  'meth.s1.accountability.term': 'Accountability.',
  'meth.s1.accountability.body':
    'A wrong coefficient can be pointed at, argued with and corrected. A wrong intuition inside a language model cannot.',
  'meth.s1.outro': 'The model is around 400 lines of TypeScript in {file}, with a test suite that pins its invariants.',

  'meth.s2.title': '2. Data rules',
  'meth.s2.intro': 'Four provenance levels, shown as a badge on every figure in the interface:',
  'meth.s2.official':
    '{term}: published by the IEC or another primary official record. {emphasis} That is not an oversight: the EU Election Observation Mission’s 2021 final report records that the IEC published no results on its website, and recommends publication disaggregated by polling station. Until that exists, claiming official provenance would be false.',
  'meth.s2.officialEmphasis': 'Nothing in the current dataset carries this label.',
  'meth.s2.reported':
    '{term}: figures the IEC announced, recorded consistently by observer missions and standard secondary tables. This covers all national results 1996–2021.',
  'meth.s2.modelled':
    '{term}: produced by this platform. All area-level breakdowns and all forecasts.',
  'meth.s2.survey':
    '{term}: polling from a named pollster, with its sample size and margin of error attached.',
  'meth.s2.enforced':
    'These rules are enforced by tests, not by convention. The suite fails if any election claims official provenance, if any area breakdown is labelled anything but modelled, if a citation does not resolve to a registered source, if vote counts contradict reported shares, or if a candidate is marked nominated before the IEC window closes.',

  'meth.s3.title': '3. The model, step by step',
  'meth.s3.subtitle': 'Five stages, from the 2021 result to an area-level projection.',
  'meth.s3.step1.title': 'Structural prior',
  'meth.s3.step1.body':
    'Start from the verified 2021 national result. Add the GDC and APP-Sobeyaa 2021 vote to the incumbent, scaled by the transfer-efficiency lever. Split the UDP’s 2021 base between Darboe and Bensouda, since UNITE has no prior presidential result to build on. Treat the untransferred remainder as mostly demobilisation rather than defection.',
  'meth.s3.step2.title': 'Polling prior',
  'meth.s3.step2.body':
    'Take the most recent published survey and allocate its undecided share according to the undecided-break lever. Kandeh’s and Faal’s polled shares are folded into the residual rather than attributed to a standing candidate, since neither is now contesting.',
  'meth.s3.step3.title': 'Blend',
  'meth.s3.step3.body':
    'Interpolate the two priors by polling weight. At zero you see the pure 2021 arithmetic; at 100 you see the polls alone.',
  'meth.s3.step4.title': 'Fundamentals and consolidation',
  'meth.s3.step4.body':
    'Apply the economic and political terms as a signed swing on the incumbent, mirrored onto the challengers in proportion to their size, with the youth-mobilisation component weighted towards UNITE. Then apply opposition consolidation: the weaker challengers stand down in proportion to the lever, and 82 per cent of their vote follows the surviving flagbearer.',
  'meth.s3.step5.title': 'Simulate and project down',
  'meth.s3.step5.body':
    'Run the scenario thousands of times, re-drawing transfer efficiency each iteration and adding a correlated national error plus per-bloc idiosyncratic error, with extra variance on UNITE as an untested entrant. Report means, medians and credible intervals, and the share of runs each bloc leads. Finally apply the national swing to the modelled 2021 area baseline as a uniform swing, with the UNITE share of the UDP base scaled by each area’s urbanisation.',

  'meth.s4.title': '4. Every coefficient',
  'meth.s4.subtitle':
    'These are reasoned priors, not fitted parameters. Argue with them: that is the point of listing them.',
  'meth.coef.approval.name': 'Incumbent approval',
  'meth.coef.approval.body': 'Points of incumbent vote share per point of approval above 50.',
  'meth.coef.inflation.name': 'Inflation',
  'meth.coef.inflation.body':
    'Points lost per point of inflation above the {baseline} per cent reference. The strongest economic term, reflecting how directly price levels are felt.',
  'meth.coef.gdp.name': 'GDP growth',
  'meth.coef.gdp.body':
    'Points gained per point of real growth above {baseline} per cent. Weaker than inflation, because aggregate growth is less legible to voters than prices.',
  'meth.coef.youthUnemployment.name': 'Youth unemployment',
  'meth.coef.youthUnemployment.body': 'Points lost per point above the {baseline} per cent reference.',
  'meth.coef.infrastructure.name': 'Infrastructure rating',
  'meth.coef.infrastructure.body':
    'Points gained per point above {baseline}. The NPP’s central campaign claim, so it gets its own term.',
  'meth.coef.turnout.name': 'Turnout level',
  'meth.coef.turnout.body':
    'Points lost per point of turnout above the 2021 level of {baseline} per cent. Higher turnout in The Gambia has historically brought in newer, younger and more urban voters, who lean against the incumbent.',
  'meth.coef.youthTurnout.name': 'Youth mobilisation',
  'meth.coef.youthTurnout.body':
    'Points lost per point of extra under-35 turnout, of which {share} per cent accrues specifically to UNITE.',
  'meth.coef.uniteSplit.name': 'UNITE share of the UDP base',
  'meth.coef.uniteSplit.body':
    'In the absence of polling, the share of the UDP’s 2021 vote assumed to have moved to UNITE. Scaled regionally between {floor} and {ceiling} times this figure by urbanisation, reflecting Bensouda’s municipal base.',
  'meth.coef.leakage.name': 'Leakage to abstention',
  'meth.coef.leakage.body':
    'Of the votes that fail to transfer to an alliance flagbearer, the share that stays home or scatters rather than defecting to a rival. Both 2016 and 2021 suggest most leakage is demobilisation.',
  'meth.coef.retention.name': 'Consolidation retention',
  'meth.coef.retention.body':
    'When an opposition bloc stands down, the share of its vote that reaches the agreed flagbearer. Set from the 2016 precedent, where coalition transfer was good but not total.',
  'meth.coef.nationalError.name': 'National error',
  'meth.coef.nationalError.body':
    'Correlated error on the incumbent across all simulations. Set wide on purpose: in 2016 a 22-year incumbent lost an election almost nobody forecast.',
  'meth.coef.blocError.name': 'Per-bloc error',
  'meth.coef.blocError.body': 'Idiosyncratic error on each bloc independently.',
  'meth.coef.transferError.name': 'Transfer uncertainty',
  'meth.coef.transferError.body':
    'Uncertainty on the transfer-efficiency lever itself, re-drawn every iteration.',
  'meth.coef.newEntrantError.name': 'New-entrant error',
  'meth.coef.newEntrantError.body':
    'Additional variance on UNITE, which has never contested a presidential election and so has no prior to anchor it.',
  'meth.coef.register.name': 'Assumed 2026 register',
  'meth.coef.register.body':
    'Used only to convert projected shares into projected vote counts. The IEC has not published the final register, so this is an assumption and the vote counts inherit its error.',
  'meth.coef.unit.ptsPerPt': '{value} pts / pt',
  'meth.coef.unit.negPtsPerPt': '−{value} pts / pt',
  'meth.coef.unit.sigma': 'σ = {value} pts',

  'meth.s5.title': '5. Known limitations',
  'meth.s5.areaData.term': 'No validated area-level data.',
  'meth.s5.areaData.body':
    'The 2016 and 2021 area baselines are modelled estimates constrained to the verified national totals. They reproduce known regional patterns, but they are not observations, and no area figure on this platform should be treated as evidence about that area.',
  'meth.s5.sixElections.term': 'Six elections, two systems.',
  'meth.s5.sixElections.body':
    '1996–2011 were held under conditions that international observers repeatedly declined to call competitive. Using them to calibrate a 2026 model is of limited value, and this model largely does not.',
  'meth.s5.twoPolls.term': 'Two polls.',
  'meth.s5.twoPolls.body':
    'Both from one organisation, both with large undecided shares, the most recent with fieldwork ending before the September alliance with Essa Faal. The polling prior is weak evidence and the polling-weight lever exists so you can discount it.',
  'meth.s5.unresolvedField.term': 'An unresolved field.',
  'meth.s5.unresolvedField.body':
    'Nominations close on 14 November 2026. The Team Gambia bloc had not publicly confirmed its flagbearer, and has said that person may stand as an independent. Blocs may still merge, split or withdraw.',
  'meth.s5.noEthnic.term': 'No ethnic or linguistic modelling.',
  'meth.s5.noEthnic.body':
    'Gambian voting has well-documented ethno-regional patterns. This platform does not model them, for two reasons: the individual-level data does not exist publicly, and a civic tool that forecasts how ethnic groups will vote risks doing harm that outweighs its analytical value. Urbanisation is used as the only sub-national differentiator.',
  'meth.s5.noIntegrity.term': 'No modelling of electoral integrity.',
  'meth.s5.noIntegrity.body':
    'The model assumes the count reflects the votes cast. It makes no attempt to quantify administrative irregularity, and nothing here should be read as a verification tool.',

  'meth.s6.title': '6. Default scenario',
  'meth.s6.subtitle': 'Where the model starts before you touch anything.',
  'meth.s6.colParameter': 'Parameter',
  'meth.s6.colDefault': 'Default',
  'meth.s6.note':
    'Opposition consolidation defaults to zero, because as of writing three separate opposition blocs are contesting. Transfer efficiency defaults to 72 per cent rather than 100, because an alliance is not a merger and no Gambian precedent supports perfect transfer. Both are the assumptions most worth arguing about, which is why they sit at the top of the {forecastPanel}.',
  'meth.s6.forecastPanelLink': 'forecast panel',

  'meth.s7.title': '7. Corrections and contributions',
  'meth.s7.body':
    'This platform is open source. If a figure is wrong, a citation is missing, or a coefficient is indefensible, that is a bug and it should be filed as one. Corrections to the verified record take priority over everything else. If you have access to official IEC data at area or polling-station level, that is the single most valuable contribution anyone can make: the data layer is built to accept it and the modelled estimates are designed to be deleted the day real figures arrive.',

  'meth.s8.title': '8. Languages',
  'meth.s8.body':
    'The interface ships a complete English dictionary and draft translations into Mandinka, Wolof and Pulaar covering navigation, page titles, provenance labels and the scenario levers. Those drafts were produced without native-speaker review and are labelled as drafts wherever they appear. Longer analytical passages fall back to English rather than being shown in an unverified rendering, and the statistical and legal disclaimers are deliberately kept in English only, because a mistranslated disclaimer is worse than an untranslated one. Review by Mandinka, Wolof and Pulaar speakers is the blocking task before any of this can be called a translation.',

  /* ---------------------------------------------------------------- */
  /* Data                                                             */
  /* ---------------------------------------------------------------- */
  'data.eyebrow': 'Provenance and downloads',
  'data.title': 'Data and sources',
  'data.lede':
    'The full dataset behind this platform, the provenance rules that govern it, and every source it draws on. Take it, check it, reuse it.',

  'data.notice.title': 'Nothing on this platform is official',
  'data.notice.body':
    'The Independent Electoral Commission is the only body that can publish official results. The EU Election Observation Mission’s 2021 final report records that the IEC published no results on its website and recommends publishing them disaggregated by polling station. Until that archive exists, every figure here is either a reported total or a modelled estimate, and the dataset labels which is which on every row.',

  'data.levels.title': 'Provenance levels',
  'data.levels.subtitle': 'Applied to every figure in the interface.',
  'data.levels.officialUnused': 'In use: area-level results are taken from the IEC\u2019s published constituency tables.',

  'data.downloads.title': 'Downloads',
  'data.downloads.subtitle':
    'Open formats, no attribution required beyond keeping the provenance labels attached.',
  'data.downloads.resultsCsv': 'Results 1996–2021 (CSV)',
  'data.downloads.fullJson': 'Full dataset (JSON)',
  'data.downloads.note':
    'If you republish these figures, carry the provenance column with them. A modelled area estimate that loses its label becomes misinformation.',
  'data.downloads.languageNote':
    'Downloads are always in English, whatever language the interface is set to. They are cited artefacts, and a column header that changes with a reader’s language setting cannot be cited.',

  'data.contents.title': 'Dataset contents',
  'data.contents.subtitle': 'What is in the repository, and what is deliberately absent.',
  'data.contents.colDataset': 'Dataset',
  'data.contents.colCoverage': 'Coverage',
  'data.contents.colRows': 'Rows',
  'data.contents.colProvenance': 'Provenance',
  'data.contents.nationalResults': 'National results',
  'data.contents.nationalResultsCoverage': '6 elections, 1996–2021',
  'data.contents.areaBreakdowns': 'Area breakdowns',
  'data.contents.areaBreakdownsCoverage': '2016 and 2021 only',
  'data.contents.areas': 'Administrative areas',
  'data.contents.areasCoverage': 'Population, register, constituencies',
  'data.contents.blocs': '2026 blocs',
  'data.contents.blocsCoverage': 'Members, formation dates, flagbearers',
  'data.contents.candidates': '2026 candidates',
  'data.contents.candidatesCoverage': 'Declared and prospective, pre-nomination',
  'data.contents.polls': 'National polls',
  'data.contents.pollsCoverage': '2025–2026',
  'data.contents.pollingStation': 'Polling-station results',
  'data.contents.pollingStationCoverage': 'Not available',
  'data.contents.pollingStationProvenance': 'Never published by the IEC',

  'data.sources.title': 'Every source',
  'data.sources.subtitle':
    '{count} registered sources. Each figure in the dataset cites at least one, and the test suite fails if a citation does not resolve.',

  'data.independence.title': 'Independence',
  'data.independence.body':
    'This platform is not affiliated with, funded by, or endorsed by the Independent Electoral Commission, any political party, any coalition, or any candidate. It takes no position on who should win. Where sources conflict, the conflict is shown rather than resolved silently. Where the evidence is thin, which, for the 2026 race, is often, the interface says so.',

  /* ---------------------------------------------------------------- */
  /* Region map                                                       */
  /* ---------------------------------------------------------------- */
  'map.defaultCaption': 'Schematic map of The Gambia by administrative area',
  'map.title':
    '{caption}. Areas are shown in their approximate positions along the River Gambia, not to scale. The same figures are listed in the table beside the map.',
  'map.river': 'River Gambia',
  'map.figcaption':
    'Schematic, not to scale: areas are placed in their approximate positions along the river and sized for legibility, so that Banjul and Kanifing remain visible. Use arrow keys to move between areas.',
  'map.areaAria': '{region}: {label}. {detail}',
  'map.areaNoData': '{region}: no data',
  'map.colArea': 'Area',
  'map.colLeading': 'Leading',
} as const;

/** Every key the interface may ask for. Derived, so it cannot drift. */
export type TranslationKey = keyof typeof en;

/** The shape every other locale is checked against. */
export type Dictionary = Record<TranslationKey, string>;

/** A locale other than English: complete coverage is not required. */
export type PartialDictionary = Partial<Dictionary>;

export const EN_KEYS = Object.keys(en) as TranslationKey[];
