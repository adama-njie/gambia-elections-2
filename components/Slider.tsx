
import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  icon?: React.ReactNode;
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  icon,
}) => {
  return (
    <div>
      <label className="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-300">
        <span className="flex items-center">
          {icon}
          {label}
        </span>
        <span className="font-bold text-primary dark:text-accent">
          {value}{unit}
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer mt-1 accent-primary"
      />
    </div>
  );
};

export default Slider;