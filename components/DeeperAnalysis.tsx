
import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ELECTION_DATA } from '../data/electionData';
import { POLITICAL_CONTEXT_DATA } from '../data/contextData';
import { PARTY_COLORS } from '../constants';

interface DeeperAnalysisProps {
  selectedYear: number;
}
type Tab = 'trends' | 'competitiveness' | 'context';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-700 p-3 border border-gray-200 dark:border-gray-600 rounded shadow-lg text-sm">
        <p className="font-bold text-gray-800 dark:text-white mb-2">{`Year: ${label}`}</p>
        {payload.map((p: any) => (
          p.value ? <p key={p.dataKey} style={{ color: p.color }}>{`${p.name}: ${p.value.toFixed(1)}%`}</p> : null
        ))}
      </div>
    );
  }
  return null;
};

const StatCard: React.FC<{ title: string; value: string; description?: string }> = ({ title, value, description }) => (
    <div className="bg-background dark:bg-gray-700/50 p-4 rounded-lg text-center shadow-inner">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      <p className="text-3xl font-bold text-primary dark:text-accent mt-1">{value}</p>
      {description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>}
    </div>
);


const DeeperAnalysis: React.FC<DeeperAnalysisProps> = ({ selectedYear }) => {
  const [activeTab, setActiveTab] = useState<Tab>('trends');

  const turnoutData = useMemo(() => ELECTION_DATA.map(e => ({ year: e.year, Turnout: e.turnout })), []);

  const partyPerformanceData = useMemo(() => {
    const majorParties = ['APRC', 'UDP', 'NRP', 'PDOIS', 'Coalition 2016', 'GDC', 'NPP'];
    return ELECTION_DATA.map(election => {
        const yearData: { [key: string]: any } = { year: election.year };
        const nationalResults = election.results['National'];
        majorParties.forEach(party => {
            const partyResult = nationalResults.find(r => r.party === party);
            yearData[party] = partyResult ? partyResult.votes : null;
        });
        return yearData;
    });
  }, []);

  const competitivenessData = useMemo(() => {
    const election = ELECTION_DATA.find(e => e.year === selectedYear);
    if (!election) return null;

    // Margin of Victory
    const nationalResults = [...election.results['National']].sort((a, b) => b.votes - a.votes);
    const marginOfVictory = nationalResults.length > 1 ? (nationalResults[0].votes - nationalResults[1].votes).toFixed(1) : 'N/A';

    // Number of Candidates
    const numCandidates = nationalResults.length;

    // Swing Regions
    const currentElectionIndex = ELECTION_DATA.findIndex(e => e.year === selectedYear);
    let swingRegions: string[] = [];
    if (currentElectionIndex > 0) {
        const previousElection = ELECTION_DATA[currentElectionIndex - 1];
        const regions = Object.keys(election.results).filter(r => r !== 'National');
        
        regions.forEach(region => {
            const currentWinner = election.results[region]?.sort((a,b) => b.votes - a.votes)[0]?.party;
            const previousWinner = previousElection.results[region]?.sort((a,b) => b.votes - a.votes)[0]?.party;
            if (currentWinner && previousWinner && currentWinner !== previousWinner) {
                swingRegions.push(region);
            }
        });
    }

    return { marginOfVictory, numCandidates, swingRegions };
  }, [selectedYear]);

  const politicalContext = useMemo(() => POLITICAL_CONTEXT_DATA[selectedYear], [selectedYear]);

  return (
    <section className="bg-white dark:bg-secondary p-6 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-text-charcoal dark:text-background">Deeper Election Analysis</h2>
      
      <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {['trends', 'competitiveness', 'context'].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab as Tab)}
                className={`${
                  activeTab === tab
                    ? 'border-primary text-primary dark:border-accent dark:text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                } whitespace-nowrap capitalize py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
              >
                {tab === 'trends' ? 'Engagement & Trends' : tab}
              </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === 'trends' && (
            <div className="space-y-8">
                <div>
                    <h3 className="font-semibold text-lg mb-2 text-text-charcoal dark:text-background">National Voter Turnout Over Time</h3>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={turnoutData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis dataKey="year" tick={{ fill: '#6B7280' }} className="text-xs dark:fill-gray-400" />
                                <YAxis unit="%" tick={{ fill: '#6B7280' }} className="text-xs dark:fill-gray-400" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="Turnout" stroke="#2F8FA8" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg mb-2 text-text-charcoal dark:text-background">Major Party Performance Over Time</h3>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={partyPerformanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis dataKey="year" tick={{ fill: '#6B7280' }} className="text-xs dark:fill-gray-400" />
                                <YAxis unit="%" tick={{ fill: '#6B7280' }} className="text-xs dark:fill-gray-400" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                {Object.keys(PARTY_COLORS).map(party => (
                                    <Line key={party} connectNulls={false} type="monotone" name={party} dataKey={party} stroke={PARTY_COLORS[party]} strokeWidth={2} />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}
        {activeTab === 'competitiveness' && competitivenessData && (
             <div className="animate-fade-in">
                 <h3 className="font-semibold text-lg mb-4 text-text-charcoal dark:text-background">Electoral Competitiveness in {selectedYear}</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <StatCard title="Margin of Victory" value={`${competitivenessData.marginOfVictory}%`} description="Difference between 1st and 2nd place nationally." />
                    <StatCard title="Candidates Contested" value={competitivenessData.numCandidates.toString()} description="Total number of presidential candidates." />
                 </div>
                 <div>
                     <h4 className="font-semibold text-md mb-2 text-text-charcoal dark:text-background">Swing Regions</h4>
                     {competitivenessData.swingRegions.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            {competitivenessData.swingRegions.map(region => <li key={region}>{region}</li>)}
                        </ul>
                     ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{selectedYear === 1996 ? 'First election in dataset.' : 'No regions changed their winning party from the previous election.'}</p>
                     )}
                 </div>
             </div>
        )}
        {activeTab === 'context' && politicalContext && (
             <div className="animate-fade-in space-y-2">
                 <h3 className="font-semibold text-lg text-text-charcoal dark:text-background">{politicalContext.title}</h3>
                 <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{politicalContext.description}</p>
             </div>
        )}
      </div>
    </section>
  );
};

export default DeeperAnalysis;
