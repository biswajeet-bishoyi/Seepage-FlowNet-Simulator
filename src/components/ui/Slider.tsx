import React, { useId } from 'react';
import clsx from 'clsx';

export interface SliderProps {
  label: string;
  symbol?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  helpText?: string;
  error?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  symbol,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  disabled,
  helpText,
  error,
  className,
}) => {
  const id = useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!Number.isNaN(val)) {
      onChange(val);
    }
  };

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <label htmlFor={id} className="font-medium text-slate-200 flex items-center gap-1.5">
          {symbol && (
            <span className="font-mono px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 font-semibold border border-slate-700">
              {symbol}
            </span>
          )}
          <span>{label}</span>
        </label>
        <span className="font-mono font-semibold text-sky-400 bg-sky-950/50 px-2 py-0.5 rounded border border-sky-800/40">
          {value} <span className="text-slate-400 font-normal text-xs">{unit}</span>
        </span>
      </div>

      <div className="relative flex items-center h-6">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          aria-describedby={clsx(helpText && helpId, error && errorId)}
          className={clsx(
            'w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{
            background: `linear-gradient(to right, #0284c7 0%, #38bdf8 ${percentage}%, #1e293b ${percentage}%, #1e293b 100%)`,
          }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>{min} {unit}</span>
        {helpText && !error && <span className="text-slate-400">{helpText}</span>}
        <span>{max} {unit}</span>
      </div>

      {error && (
        <p id={errorId} className="text-xs text-rose-400 mt-0.5 flex items-center gap-1 font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400" />
          {error}
        </p>
      )}
    </div>
  );
};
