import React, { useId } from 'react';
import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';

export interface NumberInputProps {
  label: string;
  symbol?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  disabled?: boolean;
  helpText?: string;
  error?: string;
  className?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
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

  const handleDecrement = () => {
    if (value > min) {
      onChange(Math.max(min, value - step));
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(Math.min(max, value + step));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!Number.isNaN(val)) {
      onChange(Math.min(max, Math.max(min, val)));
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
        {unit && <span className="text-xs text-slate-400 font-mono">{unit}</span>}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="w-4 h-4" />
        </button>

        <input
          id={id}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className={clsx(
            'flex-1 h-9 bg-slate-900 border border-slate-700 rounded-lg text-center font-mono font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-colors text-sm',
            error && 'border-rose-500 ring-1 ring-rose-500'
          )}
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label={`Increase ${label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Min: {min}</span>
        {helpText && !error && <span className="text-slate-400">{helpText}</span>}
        <span>Max: {max}</span>
      </div>

      {error && (
        <p className="text-xs text-rose-400 mt-0.5 flex items-center gap-1 font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400" />
          {error}
        </p>
      )}
    </div>
  );
};
