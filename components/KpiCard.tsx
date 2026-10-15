import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subValue, icon }) => {
  return (
    <div className="bg-background dark:bg-gray-700/50 p-4 rounded-lg flex items-center space-x-4 shadow-inner">
      <div className="bg-primary/10 dark:bg-accent/20 p-3 rounded-full flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate lg:whitespace-normal">{title}</p>
        <p className="text-lg font-bold text-text-charcoal dark:text-background truncate lg:whitespace-normal">{value}</p>
        {subValue && <p className="text-xs text-gray-500 dark:text-gray-400 truncate lg:whitespace-normal">{subValue}</p>}
      </div>
    </div>
  );
};

export default KpiCard;