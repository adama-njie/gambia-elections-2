
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { CandidateVote } from '../types';
import { PARTY_COLORS } from '../constants';

interface ResultsChartProps {
  data: CandidateVote[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded shadow-lg">
        <p className="font-bold text-text-charcoal dark:text-background">{`${payload[0].payload.candidate} (${payload[0].payload.party})`}</p>
        <p className="text-primary dark:text-accent">{`Votes: ${payload[0].value.toFixed(1)}%`}</p>
      </div>
    );
  }
  return null;
};

const ResultsChart: React.FC<ResultsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
        barGap={10}
      >
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="party" tick={{ fill: '#6B7280' }} className="text-xs dark:fill-gray-400" />
        <YAxis unit="%" tick={{ fill: '#6B7280' }} className="text-xs dark:fill-gray-400" />
        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(230, 230, 230, 0.2)'}} />
        <Bar dataKey="votes" name="Vote Percentage" fill="#8884d8" barSize={40}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PARTY_COLORS[entry.party] || PARTY_COLORS['Other']} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResultsChart;
