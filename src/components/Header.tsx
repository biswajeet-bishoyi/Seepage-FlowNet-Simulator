import React from 'react';
import { Waves, RotateCcw, Play, Pause, Bookmark } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { PRESETS } from '../lib/constants';

interface HeaderProps {
  activePresetId: string | null;
  onSelectPreset: (id: string) => void;
  isAnimationRunning: boolean;
  onToggleAnimation: () => void;
  onReset: () => void;
  isValid: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activePresetId,
  onSelectPreset,
  isAnimationRunning,
  onToggleAnimation,
  onReset,
  isValid,
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white shrink-0">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Seepage Flow Net Simulator
              </h1>
              <Badge variant={isValid ? 'success' : 'error'}>
                {isValid ? 'Steady-State Active' : 'Check Parameters'}
              </Badge>
              <Badge variant="neutral" className="hidden sm:inline-flex">
                v1.0 CE
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Civil Engineering Soil Mechanics & Groundwater Potential Analysis
            </p>
          </div>
        </div>

        {/* Right: Presets & Simulation Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Preset Selector */}
          <div className="relative flex items-center text-xs">
            <label htmlFor="preset-select" className="sr-only">Preset Scenario</label>
            <Bookmark className="w-3.5 h-3.5 text-sky-400 absolute left-2.5 pointer-events-none" />
            <select
              id="preset-select"
              value={activePresetId || ''}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="pl-8 pr-8 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer transition-colors"
            >
              <option value="" disabled>
                Select Scenario Preset...
              </option>
              {PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Play/Pause Animation */}
          <Button
            size="sm"
            variant={isAnimationRunning ? 'secondary' : 'primary'}
            icon={isAnimationRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            onClick={onToggleAnimation}
            title={isAnimationRunning ? 'Pause particle animation' : 'Start particle animation'}
          >
            {isAnimationRunning ? 'Pause Flow' : 'Animate Flow'}
          </Button>

          {/* Reset Defaults */}
          <Button
            size="sm"
            variant="ghost"
            icon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
            onClick={onReset}
            title="Reset parameters to default civil engineering values"
          >
            Reset
          </Button>
        </div>
      </div>
    </header>
  );
};
