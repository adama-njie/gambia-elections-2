import React from 'react';
import { CandidateVote } from '../types';
import { PARTY_COLORS } from '../constants';

interface MapTooltipProps {
  data: {
    region: string;
    results: CandidateVote[];
    position: { x: number; y: number };
  };
}

const MapTooltip: React.FC<MapTooltipProps> = ({ data }) => {
  const { region, results, position } = data;
  
  // Sort results and take top 3
  const topResults = [...results].sort((a, b) => b.votes - a.votes).slice(0, 3);

  return (
    <div
      className="absolute bg-white dark:bg-secondary shadow-lg rounded-md p-3 border border-gray-200 dark:border-gray-600 pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2 z-10 w-48"
      style={{ left: position.x, top: position.y }}
    >
      <h4 className="font-bold text-md mb-2 text-text-charcoal dark:text-background border-b border-gray-200 dark:border-gray-700 pb-1">{region}</h4>
      <ul className="space-y-1 text-sm">
        {topResults.map((result, index) => (
          <li key={index} className="flex justify-between items-center">
            <div className="flex items-center">
               <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: PARTY_COLORS[result.party] || '#B0BEC5' }}></span>
               <span className="text-gray-700 dark:text-gray-300 truncate text-xs">{result.candidate}</span>
            </div>
            <span className="font-semibold text-text-charcoal dark:text-gray-200 text-xs">{result.votes.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MapTooltip;