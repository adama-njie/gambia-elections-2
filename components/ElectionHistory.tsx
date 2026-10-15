
import React, { useState, useMemo } from 'react';
import { ELECTION_DATA } from '../data/electionData';
import ResultsChart from './ResultsChart';
import KpiCard from './KpiCard';
import { TrophyIcon } from './icons/TrophyIcon';
import { ChartPieIcon } from './icons/ChartPieIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { UsersIcon } from './icons/UsersIcon';

interface ElectionHistoryProps {
    selectedYear: number;
    setSelectedYear: (year: number) => void;
}

const ElectionHistory: React.FC<ElectionHistoryProps> = ({ selectedYear, setSelectedYear }) => {
  const [selectedRegion, setSelectedRegion] = useState('National');

  const election = useMemo(() => ELECTION_DATA.find(e => e.year === selectedYear), [selectedYear]);
  const regions = useMemo(() => election ? Object.keys(election.results) : [], [election]);
  const chartData = useMemo(() => election?.results[selectedRegion] || [], [election, selectedRegion]);

  const kpiData = useMemo(() => {
    if (!election) return null;
    
    const sortedResults = [...chartData].sort((a, b) => b.votes - a.votes);
    const winner = sortedResults.length > 0 ? sortedResults[0] : null;
    const runnerUp = sortedResults.length > 1 ? sortedResults[1] : null;

    return {
        winnerName: winner ? winner.candidate : 'N/A',
        winnerParty: winner ? winner.party : '',
        winningVote: winner ? `${winner.votes.toFixed(1)}%` : 'N/A',
        marginOfVictory: (winner && runnerUp) ? `${(winner.votes - runnerUp.votes).toFixed(1)}%` : 'N/A',
        nationalTurnout: `${election.turnout}%`
    };
  }, [election, chartData]);


  if (!election || !kpiData) return <div>Loading...</div>;

  return (
    <section className="bg-white dark:bg-secondary p-6 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-text-charcoal dark:text-background">Historical Election Results</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div>
          <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Election Year
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => {
                setSelectedYear(Number(e.target.value));
                const newElection = ELECTION_DATA.find(el => el.year === Number(e.target.value));
                if (newElection && !newElection.results[selectedRegion]) {
                    setSelectedRegion(Object.keys(newElection.results)[0]);
                }
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-text-charcoal dark:text-background"
          >
            {ELECTION_DATA.map(e => <option key={e.year} value={e.year}>{e.year}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Region / City
          </label>
          <select
            id="region-select"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-text-charcoal dark:text-background"
          >
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <KpiCard
          title="Winner"
          value={kpiData.winnerName}
          subValue={kpiData.winnerParty}
          icon={<TrophyIcon className="h-6 w-6 text-primary dark:text-accent" />}
        />
        <KpiCard
          title="Winning Vote"
          value={kpiData.winningVote}
          icon={<ChartPieIcon className="h-6 w-6 text-primary dark:text-accent" />}
        />
        <KpiCard
          title="Victory Margin"
          value={kpiData.marginOfVictory}
          icon={<ScaleIcon className="h-6 w-6 text-primary dark:text-accent" />}
        />
        <KpiCard
          title="National Turnout"
          value={kpiData.nationalTurnout}
          icon={<UsersIcon className="h-6 w-6 text-primary dark:text-accent" />}
        />
      </div>

      <div className="h-96">
        <ResultsChart data={chartData} />
      </div>
    </section>
  );
};

export default ElectionHistory;
