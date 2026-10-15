import React, { useState, useMemo } from 'react';
import { DEMOGRAPHICS_DATA } from '../data/demographicsData';
import DemographicsChart from './DemographicsChart';
import { VoteDistribution } from '../types';

interface DemographicsProps {
  year: number;
}

type Tab = 'gender' | 'age';

const Demographics: React.FC<DemographicsProps> = ({ year }) => {
  const [activeTab, setActiveTab] = useState<Tab>('gender');

  const demographicData = useMemo(() => DEMOGRAPHICS_DATA.find(d => d.year === year), [year]);

  const processData = (groups: { [key:string]: VoteDistribution[] }): any[] => {
    if (!demographicData) return [];

    const allCandidates = new Set<string>();
    Object.values(groups).forEach(group => {
      group.forEach(v => allCandidates.add(v.candidate));
    });

    return Array.from(allCandidates).map(candidate => {
      const entry: { [key: string]: any } = { candidate };
      let partyFound = false;
      Object.keys(groups).forEach(key => {
        const vote = groups[key].find(v => v.candidate === candidate);
        entry[key] = vote?.percentage || 0;
        if (vote && !partyFound) {
          entry.party = vote.party;
          partyFound = true;
        }
      });
      return entry;
    });
  };

  const chartData = useMemo(() => {
    if (!demographicData) return [];
    if (activeTab === 'gender') {
      return processData(demographicData.data.gender);
    }
    return processData(demographicData.data.age);
  }, [demographicData, activeTab]);

  const genderBars = [
    { key: 'men', name: 'Men', color: '#2F8FA8' },
    { key: 'women', name: 'Women', color: '#E57373' },
  ];

  const ageBars = [
    { key: 'young', name: 'Young (18-25)', color: '#00ACC1' },
    { key: 'middle', name: 'Middle (26-40)', color: '#F5B376' },
    { key: 'old', name: 'Old (41+)', color: '#81C784' },
  ];

  if (!demographicData) {
    return (
        <section className="bg-white dark:bg-secondary p-6 rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-text-charcoal dark:text-background">Demographic Insights for {year}</h2>
            <p className="text-gray-500 dark:text-gray-400">No demographic data available for this year.</p>
        </section>
    );
  }

  return (
    <section className="bg-white dark:bg-secondary p-6 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-text-charcoal dark:text-background">Demographic Insights for {year}</h2>
      
      <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('gender')}
            className={`${
              activeTab === 'gender'
                ? 'border-primary text-primary dark:border-accent dark:text-accent'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            By Gender
          </button>
          <button
            onClick={() => setActiveTab('age')}
            className={`${
              activeTab === 'age'
                ? 'border-primary text-primary dark:border-accent dark:text-accent'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            By Age Group
          </button>
        </nav>
      </div>

      <div className="h-96">
        <DemographicsChart data={chartData} bars={activeTab === 'gender' ? genderBars : ageBars} />
      </div>
    </section>
  );
};

export default Demographics;