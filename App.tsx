import React, { useState } from 'react';
import Header from './components/Header';
import ElectionHistory from './components/ElectionHistory';
import PredictionPanel from './components/PredictionPanel';
import Demographics from './components/Demographics';
import DeeperAnalysis from './components/DeeperAnalysis';
import { ELECTION_DATA } from './data/electionData';
import { CANDIDATES_2026 } from './constants';
import { InfoIcon } from './components/icons/InfoIcon';

const App: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(ELECTION_DATA[ELECTION_DATA.length - 1].year);

  return (
    <div className="min-h-screen bg-background dark:bg-text-charcoal font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ElectionHistory selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
            <Demographics year={selectedYear} />
            <DeeperAnalysis selectedYear={selectedYear} />
          </div>
          <div>
            <PredictionPanel candidates={CANDIDATES_2026} />
          </div>
        </div>

        <div className="mt-12 bg-white dark:bg-secondary/30 p-4 rounded-lg shadow-md text-sm text-gray-600 dark:text-gray-400 flex items-start gap-3 border border-gray-200 dark:border-gray-700 animate-fade-in">
          <InfoIcon className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-text-charcoal dark:text-background">Data Source Clarification:</span> All election and demographic data presented is based on historical public records and is for illustrative and analytical purposes only. It does not represent official, certified results.
          </div>
        </div>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; 2024 Gambia Election Analytics.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;