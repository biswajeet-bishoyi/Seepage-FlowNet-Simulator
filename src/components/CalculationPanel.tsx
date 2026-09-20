import React from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Droplets,
  Layers,
  ArrowDownRight,
} from 'lucide-react';
import { CalculatedValues, SimulationParameters } from '../lib/types';
import {
  formatHead,
  formatDischarge,
  formatGradient,
} from '../lib/formatting';

interface CalculationPanelProps {
  parameters: SimulationParameters;
  calculatedValues: CalculatedValues;
}

export const CalculationPanel: React.FC<CalculationPanelProps> = ({
  parameters,
  calculatedValues,
}) => {
  const {
    totalHeadLoss,
    headPerDrop,
    seepageDischarge,
    dischargePerChannel,
    hydraulicGradient,
    isValid,
    errors,
  } = calculatedValues;

  // Civil engineering safety check:
  // Critical exit gradient in sands is typically i_crit ≈ 1.0.
  // Working safe gradient is i_allowable ≈ 0.15 - 0.20 with safety factor ~ 5-6.
  const isHighGradient = hydraulicGradient >= 0.15;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Engineering Calculations
            </h2>
            <p className="text-xs text-slate-400">
              Terzaghi Flow Net Analysis per unit dam width (B = 1.0 m)
            </p>
          </div>
        </div>

        {/* Validation Status Indicator */}
        {isValid ? (
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Valid State</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Invalid Input</span>
          </div>
        )}
      </div>

      {/* Error Alert if inputs invalid */}
      {!isValid && errors.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 text-xs text-rose-200 flex flex-col gap-1">
          <span className="font-bold flex items-center gap-1.5 text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Constraint Violation:
          </span>
          <ul className="list-disc list-inside space-y-0.5 text-rose-300/90 pl-1">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Critical Exit Gradient Warning (Piping / Quick Condition) */}
      {isValid && isHighGradient && (
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">High Exit Gradient Warning (i ≥ 0.15):</span>{' '}
            Approaching critical exit gradient. High risk of geotechnical piping, soil boiling, or sand boils at downstream toe!
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Card 1: Total Head Loss */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              Total Head Loss (H)
            </span>
            <span className="font-mono text-[11px] text-slate-500">h₁ - h₂</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400">
            {isValid ? formatHead(totalHeadLoss) : '—'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total potential difference driving seepage flow
          </p>
        </div>

        {/* Card 2: Seepage Discharge q */}
        <div className="bg-slate-950/70 border border-sky-900/40 rounded-xl p-3.5 flex flex-col justify-between hover:border-sky-700/60 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium text-sky-300">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              Seepage Discharge (q)
            </span>
            <span className="font-mono text-[11px] text-sky-400/70">k·H·(Nf/Nd)</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {isValid ? formatDischarge(seepageDischarge) : '—'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Terzaghi volumetric rate per meter dam length
          </p>
        </div>

        {/* Card 3: Head Loss per Drop */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <ArrowDownRight className="w-3.5 h-3.5 text-teal-400" />
              Head Loss Per Drop (Δh)
            </span>
            <span className="font-mono text-[11px] text-slate-500">H / Nd</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-teal-400">
            {isValid ? formatHead(headPerDrop) : '—'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Uniform potential loss across adjacent lines
          </p>
        </div>

        {/* Card 4: Discharge Per Channel */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Discharge per Channel (q_ch)
            </span>
            <span className="font-mono text-[11px] text-slate-500">q / Nf</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-200">
            {isValid ? formatDischarge(dischargePerChannel) : '—'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Equal flow partition carried by each stream channel
          </p>
        </div>

        {/* Card 5: Exit Hydraulic Gradient */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors sm:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Exit Hydraulic Gradient (i)
            </span>
            <span className="font-mono text-[11px] text-slate-500">i ≈ Δh / L</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-xl sm:text-2xl font-bold font-mono ${
                isHighGradient ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {isValid ? formatGradient(hydraulicGradient) : '—'}
            </span>
            <span className="text-xs text-slate-400 font-sans">
              {hydraulicGradient < 0.15 ? '(Safe against quicksand)' : '(Critical threshold)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Local driving gradient at downstream soil exit (estimated L ≈ 10.0 m)
          </p>
        </div>
      </div>

      {/* Terzaghi Seepage Formula Viva Banner */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-slate-300">
            <strong className="text-white">Terzaghi Seepage Equation:</strong>{' '}
            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300 font-mono text-xs">
              q = k × H × (Nf / Nd)
            </code>
          </span>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          q = ({parameters.hydraulicConductivity}) × ({totalHeadLoss.toFixed(1)}) × ({parameters.flowChannels}/{parameters.potentialDrops}) = {isValid ? seepageDischarge.toFixed(4) : '0'} m³/s per m
        </div>
      </div>
    </div>
  );
};
