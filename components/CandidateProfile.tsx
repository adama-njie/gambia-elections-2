import React from 'react';
import { Candidate } from '../types';

interface CandidateProfileProps {
  candidate: Candidate;
}

const CandidateProfile: React.FC<CandidateProfileProps> = ({ candidate }) => {
  return (
    <div className="flex items-center space-x-4 bg-background dark:bg-secondary/50 p-3 rounded-lg">
      <img
        className="w-12 h-12 rounded-full object-cover"
        src={candidate.imageUrl}
        alt={candidate.name}
      />
      <div>
        <p className="font-bold text-text-charcoal dark:text-background flex items-center">
          {candidate.name}
          <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${candidate.color}20`, color: candidate.color }}>
            {candidate.partyAcronym}
          </span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.description}</p>
      </div>
    </div>
  );
};

export default CandidateProfile;