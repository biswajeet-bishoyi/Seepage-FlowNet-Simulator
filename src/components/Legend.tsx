import React from 'react';
import { Info } from 'lucide-react';

export const Legend: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs">
      <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-2">
        <Info className="w-3.5 h-3.5 text-sky-400" />
        <span>Geotechnical & Flow Net Legend</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[11px]">
        {/* Flow lines */}
        <div className="flex items-center gap-2">
          <span className="w-6 h-0.5 bg-sky-400 rounded shrink-0 shadow-sm shadow-sky-500/50" />
          <span className="text-slate-300">Flow Lines (Streamlines)</span>
        </div>

        {/* Equipotential lines */}
        <div className="flex items-center gap-2">
          <span className="w-6 h-0.5 border-t-2 border-dashed border-teal-400 shrink-0" />
          <span className="text-slate-300">Equipotentials (Equal Head)</span>
        </div>

        {/* Water bodies */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-3 bg-sky-400/40 border border-sky-400/80 rounded-sm shrink-0" />
          <span className="text-slate-300">Water Bodies (h₁, h₂)</span>
        </div>

        {/* Concrete Dam */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-3 bg-slate-600 border border-slate-500 rounded-sm shrink-0" />
          <span className="text-slate-300">Impermeable Dam</span>
        </div>

        {/* Permeable Soil */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-3 bg-amber-200/50 border border-amber-300/60 rounded-sm shrink-0" />
          <span className="text-slate-300">Permeable Soil (k)</span>
        </div>

        {/* Impermeable Rock */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-3 bg-slate-800 border border-slate-700 rounded-sm shrink-0" />
          <span className="text-slate-300">Impermeable Bedrock</span>
        </div>
      </div>
    </div>
  );
};
