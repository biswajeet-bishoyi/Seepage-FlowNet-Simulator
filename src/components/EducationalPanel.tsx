import React, { useState } from 'react';
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Compass,
  BookOpen,
  Layers,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface AccordionSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const EducationalPanel: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'what-is-flownet': true,
    'why-perpendicular': true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sections: AccordionSection[] = [
    {
      id: 'what-is-flownet',
      title: '1. What is a Flow Net in Soil Mechanics?',
      icon: <BookOpen className="w-4 h-4 text-sky-400" />,
      content: (
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            A <strong>flow net</strong> is a graphical and mathematical solution of Laplace’s equation for 2D steady-state groundwater seepage through permeable soil.
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-sky-300 text-[11px]">
            ∇²h = (∂²h / ∂x²) + (∂²h / ∂z²) = 0
          </div>
          <p>
            The flow net consists of two orthogonal sets of curves: <strong>flow lines (streamlines)</strong> that map the direction of pore water movement, and <strong>equipotential lines</strong> that map contours of equal total hydraulic head.
          </p>
          <p>
            The intersections form an orthogonal grid of <em>"curvilinear squares"</em> where the ratio of channel width to drop length is approximately equal ($a/b \approx 1$).
          </p>
        </div>
      ),
    },
    {
      id: 'flow-vs-equi',
      title: '2. Flow Lines vs. Equipotential Lines',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-sky-900/40">
              <h4 className="font-bold text-sky-400 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                Flow Lines (Solid Blue)
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li>Tangent to the seepage velocity vector v at every point.</li>
                <li>Originate at upstream submerged ground (h = h₁).</li>
                <li>Terminate at downstream submerged tailwater (h = h₂).</li>
                <li>Never cross each other; no water crosses a flow line.</li>
                <li>Boundaries: Dam base & impermeable bedrock are streamlines.</li>
              </ul>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-teal-900/40">
              <h4 className="font-bold text-teal-400 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                Equipotential Lines (Dashed Teal)
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li>Connect points of equal total hydraulic energy (head h).</li>
                <li>Piezometers placed anywhere on a line show identical water column height.</li>
                <li>Drop between consecutive lines is constant: Δh = H / Nd.</li>
                <li>Intersect flow lines at exactly 90° right angles.</li>
                <li>Boundaries: Upstream & downstream riverbeds are equipotentials.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'why-perpendicular',
      title: "3. Why Are Flow Lines & Equipotential Lines Perpendicular?",
      icon: <Compass className="w-4 h-4 text-teal-400" />,
      content: (
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            The perpendicularity of flow and equipotential lines is not an artistic choice; it is a fundamental physical consequence of <strong>Darcy’s Law</strong>:
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-emerald-300 text-[11px]">
            v = -k · ∇h
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1 text-[11px]">
            <li>
              The hydraulic gradient ∇h is a vector pointing in the direction of maximum head increase.
            </li>
            <li>
              By definition of scalar contours, the contour of constant head (equipotential line) is orthogonal to ∇h.
            </li>
            <li>
              Darcy’s law states that velocity v is parallel to -∇h in isotropic soil.
            </li>
            <li>
              Therefore, seepage velocity v (which is tangent to the flow lines) is strictly perpendicular to equipotential lines everywhere!
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: 'seepage-discharge',
      title: "4. Terzaghi's Seepage Discharge Formula Derivation",
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      content: (
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            Consider a single curvilinear square element of width b and flow length l in isotropic soil (k_x = k_z = k):
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 text-[11px]">
            <li>By Darcy's Law: Δq = k · i · A = k · (Δh / l) · (b · 1)</li>
            <li>In an orthogonal flow net of curvilinear squares: b ≈ l, so b/l = 1</li>
            <li>Therefore, flow through one channel is: Δq = k · Δh</li>
            <li>Since Δh = H / Nd, we have: Δq = k · (H / Nd)</li>
            <li>With Nf total parallel flow channels, total seepage discharge per unit width is:</li>
          </ul>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-amber-300 text-xs text-center font-bold">
            q = k × H × (Nf / Nd)
          </div>
          <p className="text-[11px] text-slate-400">
            Units: [m/s] × [m] × [dimensionless] = m³/s per linear meter of dam length (or m²/s).
          </p>
        </div>
      ),
    },
    {
      id: 'real-world',
      title: '5. Practical Civil Engineering Applications',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      content: (
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            Flow nets are critical in geotechnical foundation design for:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-1 text-[11px]">
            <li>
              <strong>Piping & Soil Boiling (Quick Condition):</strong> At the downstream toe, water exits vertically. If the exit gradient i_exit = Δh / l approaches the critical gradient i_c = (γ_sat - γ_w) / γ_w ≈ 1.0, effective stress becomes zero, soil fluidizes, and catastrophic dam collapse can occur.
            </li>
            <li>
              <strong>Uplift Pressure Calculations:</strong> Head values along equipotentials beneath the dam base yield the pore water pressure u = γ_w · h_p, used to verify the dam’s safety factor against overturning and sliding.
            </li>
            <li>
              <strong>Seepage Loss Estimation:</strong> Quantifies reservoir volume loss per day through permeable alluvial foundations.
            </li>
            <li>
              <strong>Cutoff Wall & Foundation Grouting Design:</strong> Demonstrates how sheet pile cutoffs elongate seepage paths and reduce exit gradients.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
          <GraduationCap className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Soil Mechanics & Flow Net Theory
          </h2>
          <p className="text-xs text-slate-400">
            Viva concepts, mathematical derivations, and geotechnical exam reference
          </p>
        </div>
      </div>

      <div className="space-y-2 mt-1">
        {sections.map((section) => {
          const isOpen = openSections[section.id];
          return (
            <div
              key={section.id}
              className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40"
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2 font-medium text-xs sm:text-sm text-slate-200">
                  {section.icon}
                  <span>{section.title}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 bg-slate-900/30">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
