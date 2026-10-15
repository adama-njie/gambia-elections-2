import React, { useState, useMemo, useCallback } from 'react';
import { ELECTION_DATA } from '../data/electionData';
import { PARTY_COLORS } from '../constants';
import GambiaSVG from './GambiaSVG';
import MapTooltip from './MapTooltip';
import { MapPinIcon } from './icons/MapPinIcon';
import { CandidateVote } from '../types';

interface TooltipData {
  region: string;
  results: CandidateVote[];
  position: { x: number; y: number };
}

interface InteractiveMapProps {
  selectedYear: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ selectedYear }) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const electionYearData = useMemo(() => ELECTION_DATA.find(e => e.year === selectedYear), [selectedYear]);

  const regionWinners = useMemo<{ [key: string]: { party: string; fill: string } }>(() => {
    if (!electionYearData) return {};
    const winners: { [key: string]: { party: string; fill: string } } = {};
    for (const region in electionYearData.results) {
      if (region !== 'National') {
        const sortedResults = [...electionYearData.results[region]].sort((a, b) => b.votes - a.votes);
        if (sortedResults.length > 0) {
          const winnerParty = sortedResults[0].party;
          winners[region] = {
            party: winnerParty,
            fill: PARTY_COLORS[winnerParty] || '#B0BEC5'
          };
        }
      }
    }
    return winners;
  }, [electionYearData]);
  
  const mapParties = useMemo(() => {
    if (!electionYearData) return [];
    const parties = new Set<string>();
    // Fix: Explicitly type `winner` because `Object.values` on a type with an index signature can result in an `unknown` type.
    Object.values(regionWinners).forEach((winner: { party: string }) => parties.add(winner.party));
    return Array.from(parties);
  }, [regionWinners, electionYearData]);


  const handleRegionHover = useCallback((region: string | null, e?: React.MouseEvent) => {
    if (!region || !electionYearData || !e) {
      setTooltip(null);
      return;
    }
    const results = electionYearData.results[region];
    if (results) {
      setTooltip({
        region,
        results,
        position: { x: e.clientX, y: e.clientY },
      });
    }
  }, [electionYearData]);


  if (!electionYearData) return null;

  return (
    <section className="bg-white dark:bg-secondary p-6 rounded-lg shadow-lg animate-fade-in">
       <div className="flex items-center gap-3 mb-4">
        <MapPinIcon className="h-6 w-6 text-primary dark:text-accent" />
        <h2 className="text-2xl font-bold text-text-charcoal dark:text-background">Regional Results Map for {selectedYear}</h2>
      </div>

      <div className="relative">
        <GambiaSVG
          regionData={regionWinners}
          onRegionHover={handleRegionHover}
          hoveredRegion={tooltip?.region || null}
        />
        {tooltip && <MapTooltip data={tooltip} />}
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Winning Party Legend:</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
            {mapParties.map(party => (
                 <div key={party} className="flex items-center text-xs">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PARTY_COLORS[party] || '#B0BEC5' }}></span>
                    <span className="dark:text-gray-300">{party}</span>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;