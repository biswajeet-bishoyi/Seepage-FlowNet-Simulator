import React from 'react';
import { Eye, Check } from 'lucide-react';
import { VisibilityState } from '../lib/types';

interface VisibilityTogglesProps {
  visibility: VisibilityState;
  onToggle: (key: keyof VisibilityState) => void;
}

export const VisibilityToggles: React.FC<VisibilityTogglesProps> = ({
  visibility,
  onToggle,
}) => {
  const toggleItems: {
    key: keyof VisibilityState;
    label: string;
    description: string;
  }[] = [
    {
      key: 'flowLines',
      label: 'Flow Lines (Streamlines)',
      description: 'Solid blue curves showing seepage trajectory',
    },
    {
      key: 'equipotentialLines',
      label: 'Equipotential Contours',
      description: 'Dashed teal curves showing equal hydraulic head',
    },
    {
      key: 'particleAnimation',
      label: 'Water Particle Seepage',
      description: 'Moving particle simulation along streamlines',
    },
    {
      key: 'headLabels',
      label: 'Head Values on Contours',
      description: 'Hydraulic head values (m) along equipotentials',
    },
    {
      key: 'flowArrows',
      label: 'Flow Direction Markers',
      description: 'Directional arrow heads indicating downstream transit',
    },
    {
      key: 'grid',
      label: 'Engineering Grid',
      description: 'Background Cartesian coordinate guide',
    },
    {
      key: 'educationalPanel',
      label: 'Civil Engineering Guide',
      description: 'Theory, derivations, and viva reference panel',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
          <Eye className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Layer Visibility Toggles
          </h2>
          <p className="text-xs text-slate-400">
            Customize visual elements and educational overlays
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {toggleItems.map((item) => {
          const isActive = visibility[item.key];
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onToggle(item.key)}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-slate-800/80 border-sky-500/40 text-slate-100 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                  isActive
                    ? 'bg-sky-500 border-sky-400 text-white'
                    : 'border-slate-600 bg-slate-800'
                }`}
              >
                {isActive && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-tight">
                  {item.label}
                </span>
                <span className="text-[10.5px] text-slate-500 leading-normal mt-0.5">
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
