import React from 'react';
import { Sliders, RotateCcw, Play, Pause } from 'lucide-react';
import { SimulationParameters, AnimationState } from '../lib/types';
import { RANGES } from '../lib/constants';
import { Slider } from './ui/Slider';
import { NumberInput } from './ui/Input';
import { Button } from './ui/Button';

interface ParameterControlsProps {
  parameters: SimulationParameters;
  onUpdateParameter: (name: keyof SimulationParameters, value: number) => void;
  onReset: () => void;
  animation: AnimationState;
  onToggleAnimation: () => void;
  onSetAnimationSpeed: (speed: number) => void;
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({
  parameters,
  onUpdateParameter,
  onReset,
  animation,
  onToggleAnimation,
  onSetAnimationSpeed,
}) => {
  // Validate upstream > downstream locally for instant visual feedback
  const headError =
    parameters.upstreamHead <= parameters.downstreamHead
      ? 'Upstream head (h₁) must be strictly greater than downstream head (h₂)'
      : undefined;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Simulation Parameters
            </h2>
            <p className="text-xs text-slate-400">
              Boundary heads, soil permeability, and grid density
            </p>
          </div>
        </div>
      </div>

      {/* Hydraulic Heads Section */}
      <div className="flex flex-col gap-3.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          1. Water Elevations (Hydraulic Head)
        </span>

        {/* Upstream Head */}
        <Slider
          label="Upstream Head"
          symbol="h₁"
          unit="m"
          value={parameters.upstreamHead}
          min={RANGES.upstreamHead.min}
          max={RANGES.upstreamHead.max}
          step={RANGES.upstreamHead.step}
          onChange={(val) => onUpdateParameter('upstreamHead', val)}
          helpText="Reservoir water surface elevation"
          error={headError}
        />

        {/* Downstream Head */}
        <Slider
          label="Downstream Head (Tailwater)"
          symbol="h₂"
          unit="m"
          value={parameters.downstreamHead}
          min={RANGES.downstreamHead.min}
          max={RANGES.downstreamHead.max}
          step={RANGES.downstreamHead.step}
          onChange={(val) => onUpdateParameter('downstreamHead', val)}
          helpText="Tailwater surface elevation"
        />
      </div>

      {/* Soil Permeability Section */}
      <div className="flex flex-col gap-3.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          2. Geotechnical Material Property
        </span>

        {/* Hydraulic Conductivity */}
        <Slider
          label="Hydraulic Conductivity (Permeability)"
          symbol="k"
          unit="m/s"
          value={parameters.hydraulicConductivity}
          min={RANGES.hydraulicConductivity.min}
          max={RANGES.hydraulicConductivity.max}
          step={RANGES.hydraulicConductivity.step}
          onChange={(val) => onUpdateParameter('hydraulicConductivity', val)}
          helpText="Soil permeability (sand / silt matrix)"
        />
      </div>

      {/* Flow Net Grid Discretization */}
      <div className="flex flex-col gap-3.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          3. Flow Net Discretization Grid
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Flow Channels Nf */}
          <NumberInput
            label="Flow Channels"
            symbol="Nf"
            value={parameters.flowChannels}
            min={RANGES.flowChannels.min}
            max={RANGES.flowChannels.max}
            step={RANGES.flowChannels.step}
            onChange={(val) => onUpdateParameter('flowChannels', val)}
            helpText="Channels between streamlines"
          />

          {/* Potential Drops Nd */}
          <NumberInput
            label="Potential Drops"
            symbol="Nd"
            value={parameters.potentialDrops}
            min={RANGES.potentialDrops.min}
            max={RANGES.potentialDrops.max}
            step={RANGES.potentialDrops.step}
            onChange={(val) => onUpdateParameter('potentialDrops', val)}
            helpText="Head loss intervals"
          />
        </div>
      </div>

      {/* Seepage Animation & Speed Controls */}
      <div className="flex flex-col gap-2.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          4. Seepage Streamline Animation
        </span>

        <div className="flex items-center justify-between gap-3">
          <Button
            size="sm"
            variant={animation.isRunning ? 'secondary' : 'primary'}
            icon={animation.isRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            onClick={onToggleAnimation}
            className="flex-1"
          >
            {animation.isRunning ? 'Pause Animation' : 'Start Flow Animation'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={onReset}
          >
            Reset Defaults
          </Button>
        </div>

        {/* Speed adjustment */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Flow Velocity Multiplier:</span>
          <div className="flex items-center gap-1.5">
            {[0.5, 1.0, 1.5, 2.0].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => onSetAnimationSpeed(spd)}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                  animation.speed === spd
                    ? 'bg-sky-500 text-white font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
