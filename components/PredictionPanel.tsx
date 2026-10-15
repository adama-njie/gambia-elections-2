
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Candidate, PredictionParams, PredictionResult } from '../types';
import { getElectionPrediction } from '../services/geminiService';
import { ELECTION_DATA } from '../data/electionData';
import { PARTY_COLORS } from '../constants';
import CandidateProfile from './CandidateProfile';
import Slider from './Slider';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';

interface PredictionPanelProps {
  candidates: Candidate[];
}

// Set initial values based on the most recent (2021) election data
const latestElection = ELECTION_DATA[ELECTION_DATA.length - 1];
const incumbent2021Vote = latestElection.results.National.find(r => r.candidate === "Adama Barrow")?.votes || 53;

const PredictionPanel: React.FC<PredictionPanelProps> = ({ candidates }) => {
  const [params, setParams] = useState<PredictionParams>({
    youthUnemployment: 40,
    gdpGrowth: 5.5,
    voterTurnout: latestElection.turnout,
    incumbentPerformance: Math.round(incumbent2021Vote),
    inflationRate: 7.6,
    infrastructureRating: 65,
    oppositionUnity: 30,
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeout = useRef<number | null>(null);

  const handleSliderChange = (name: keyof PredictionParams, value: number) => {
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const handlePredict = useCallback(async (currentParams: PredictionParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getElectionPrediction(currentParams, candidates);
      setPrediction(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  }, [candidates]);

  useEffect(() => {
    // Debounce the API call
    if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = window.setTimeout(() => {
        handlePredict(params);
    }, 500); // 500ms delay

    // Cleanup timeout on component unmount or if params change again
    return () => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
    };
  }, [params, handlePredict]);


  const winner = useMemo(() => {
    if (!prediction || !prediction.voteDistribution || prediction.voteDistribution.length === 0) return null;
    return prediction.voteDistribution[0];
  }, [prediction]);
  
  return (
    <aside className="bg-white dark:bg-secondary p-6 rounded-lg shadow-lg space-y-6 animate-slide-in-up sticky top-8">
      <div>
        <h2 className="text-2xl font-bold text-text-charcoal dark:text-background">2026 Election Forecast</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Adjust indicators to automatically predict the outcome.</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-3">Socio-Economic Factors</h3>
          <div className="space-y-4">
              <Slider label="Youth Unemployment" value={params.youthUnemployment} onChange={(val) => handleSliderChange('youthUnemployment', val)} min={10} max={50} unit="%" />
              <Slider label="GDP Growth" value={params.gdpGrowth} onChange={(val) => handleSliderChange('gdpGrowth', val)} min={-5} max={10} unit="%" step={0.5} />
              <Slider label="Voter Turnout" value={params.voterTurnout} onChange={(val) => handleSliderChange('voterTurnout', val)} min={40} max={95} unit="%" />
          </div>
        </div>
         <div>
          <h3 className="text-sm font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-3">Political & Governance</h3>
           <div className="space-y-4">
              <Slider label="Incumbent Performance" value={params.incumbentPerformance} onChange={(val) => handleSliderChange('incumbentPerformance', val)} min={20} max={80} unit="% approval" />
              <Slider label="Inflation Rate" value={params.inflationRate} onChange={(val) => handleSliderChange('inflationRate', val)} min={2} max={25} unit="%" step={0.1} icon={<TrendingUpIcon className="w-4 h-4 mr-2" />} />
              <Slider label="Infrastructure Rating" value={params.infrastructureRating} onChange={(val) => handleSliderChange('infrastructureRating', val)} min={20} max={90} unit="% approval" icon={<BuildingOfficeIcon className="w-4 h-4 mr-2" />} />
              <Slider label="Opposition Unity" value={params.oppositionUnity} onChange={(val) => handleSliderChange('oppositionUnity', val)} min={10} max={100} unit="%" step={5} icon={<UserGroupIcon className="w-4 h-4 mr-2" />} />
           </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4 min-h-[400px]">
        <h3 className="text-lg font-semibold text-center text-text-charcoal dark:text-background">Prediction Result</h3>
        
        {isLoading && (
            <div className="flex justify-center items-center h-64">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        )}

        {error && (
          <div className="text-red-500 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-sm rounded-lg p-3 text-center animate-fade-in space-y-2">
            <p>{error}</p>
            <button
              onClick={() => handlePredict(params)}
              className="mt-1 px-3 py-1 bg-primary hover:bg-primary/90 text-white rounded text-xs font-medium transition cursor-pointer"
            >
              Retry Prediction
            </button>
          </div>
        )}

        {!isLoading && prediction && winner && (
            <div className="animate-fade-in space-y-4">
                <div className="bg-accent-alt/20 dark:bg-accent-alt/30 p-4 rounded-lg text-center">
                    <p className="text-sm text-text-charcoal dark:text-background/80">Predicted Winner</p>
                    <p className="text-2xl font-bold text-primary dark:text-accent">{winner.candidate}</p>
                    <p className="text-md text-secondary dark:text-gray-300">{candidates.find(c => c.name === winner.candidate)?.party}</p>
                    <p className="text-3xl font-bold text-primary dark:text-accent mt-2">{winner.percentage.toFixed(1)}%</p>
                    <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`}>
                        Confidence: {prediction.confidenceLevel}
                    </div>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prediction.voteDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="candidate" width={80} tick={{ fontSize: 12, fill: '#6B7280' }} className="dark:fill-gray-400" interval={0} />
                            <Tooltip cursor={{fill: 'rgba(230, 230, 230, 0.2)'}} contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px' }} />
                            <Bar dataKey="percentage" barSize={20}>
                                <LabelList dataKey="percentage" position="right" formatter={(value: number) => `${value.toFixed(1)}%`} style={{ fill: 'var(--color-text-charcoal)', fontSize: 12 }} className="dark:fill-gray-300" />
                                {prediction.voteDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PARTY_COLORS[entry.party] || PARTY_COLORS['Other']} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <h4 className="font-semibold text-text-charcoal dark:text-background">Analysis:</h4>
                    <p>{prediction.analysis}</p>
                </div>

                {prediction.regionalStrongholds && prediction.regionalStrongholds.length > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <h4 className="font-semibold text-text-charcoal dark:text-background">Potential Regional Strongholds:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {prediction.regionalStrongholds.map((item, index) => (
                            <li key={index}><span className="font-medium">{item.region}:</span> {item.candidate}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-lg font-semibold text-text-charcoal dark:text-background mb-3">Key 2026 Candidates</h3>
        <div className="space-y-3">
          {candidates.map(c => <CandidateProfile key={c.name} candidate={c} />)}
        </div>
      </div>
    </aside>
  );
};

export default PredictionPanel;