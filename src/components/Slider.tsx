import { useId } from 'react';

export default function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  help,
  format,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  help?: string;
  format?: (value: number) => string;
}) {
  const id = useId();
  const helpId = `${id}-help`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <output htmlFor={id} className="tabular text-sm font-semibold">
          {format ? format(value) : `${value}${unit}`}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-describedby={help ? helpId : undefined}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-black/10 accent-primary dark:bg-white/15 dark:accent-accent"
      />
      {help && (
        <p id={helpId} className="muted mt-1 text-xs leading-snug">
          {help}
        </p>
      )}
    </div>
  );
}
