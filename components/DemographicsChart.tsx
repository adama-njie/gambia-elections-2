
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { PARTY_COLORS } from '../constants';

interface DemographicsChartProps {
  data: any[];
  bars: { key: string; name: string; color: string }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-700 p-3 border border-gray-200 dark:border-gray-600 rounded shadow-lg text-sm">
        <p className="font-bold text-gray-800 dark:text-white mb-2">{`${label} (${payload[0].payload.party})`}</p>
        {payload.map((p: any) => (
            <p key={p.dataKey} style={{ color: p.color }}>{`${p.name}: ${p.value.toFixed(1)}%`}</p>
        ))}
      </div>
    );
  }
  return null;
};

const DemographicsChart: React.FC<DemographicsChartProps> = ({ data, bars }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis 
            dataKey="candidate" 
            tick={{ fill: '#6B7280' }} 
            className="text-xs dark:fill-gray-400"
            angle={-25}
            textAnchor="end"
            height={60}
            interval={0}
        />
        <YAxis unit="%" tick={{ fill: '#6B7280' }} className="text-xs dark:fill-gray-400" />
        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(230, 230, 230, 0.2)'}} />
        <Legend wrapperStyle={{ paddingTop: '20px' }}/>
        {bars.map(bar => (
          <Bar key={bar.key} dataKey={bar.key} name={bar.name} fill={bar.color} barSize={20} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DemographicsChart;
