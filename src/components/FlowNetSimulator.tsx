import React from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { useCalculations } from '../hooks/useCalculations';
import { Header } from './Header';
import { SimulationCanvas } from './SimulationCanvas';
import { Legend } from './Legend';
import { ParameterControls } from './ParameterControls';
import { CalculationPanel } from './CalculationPanel';
import { VisibilityToggles } from './VisibilityToggles';
import { EducationalPanel } from './EducationalPanel';

export const FlowNetSimulator: React.FC = () => {
  const {
    parameters,
    visibility,
    animation,
    activePresetId,
    updateParameter,
    applyPreset,
    toggleVisibility,
    toggleAnimation,
    setAnimationSpeed,
    reset,
  } = useSimulation();

  const calculatedValues = useCalculations(parameters);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Header
        activePresetId={activePresetId}
        onSelectPreset={applyPreset}
        isAnimationRunning={animation.isRunning}
        onToggleAnimation={toggleAnimation}
        onReset={reset}
        isValid={calculatedValues.isValid}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 flex flex-col gap-6">
        {/* Top Hero Section: Visualization Canvas & Legend */}
        <section className="flex flex-col gap-3" aria-label="Interactive flow net cross-section">
          <SimulationCanvas
            parameters={parameters}
            visibility={visibility}
            animation={animation}
            hydraulicGradient={calculatedValues.hydraulicGradient}
          />
          {visibility.legend && <Legend />}
        </section>

        {/* Middle Section: Parameters & Live Calculations */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Controls and calculations">
          <ParameterControls
            parameters={parameters}
            onUpdateParameter={updateParameter}
            onReset={reset}
            animation={animation}
            onToggleAnimation={toggleAnimation}
            onSetAnimationSpeed={setAnimationSpeed}
          />

          <CalculationPanel
            parameters={parameters}
            calculatedValues={calculatedValues}
          />
        </section>

        {/* Lower Section: Layer Visibility Toggles */}
        <section aria-label="Visual layer visibility settings">
          <VisibilityToggles
            visibility={visibility}
            onToggle={toggleVisibility}
          />
        </section>

        {/* Bottom Section: Educational Theory Guide */}
        {visibility.educationalPanel && (
          <section aria-label="Geotechnical engineering educational reference">
            <EducationalPanel />
          </section>
        )}
      </main>

      {/* Civil Engineering Project Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Civil Engineering Flow Net Simulator &bull; Soil Mechanics Laboratory & Viva Tool
          </p>
          <p className="text-slate-400">
            Terzaghi's Seepage Potential Theory &bull; Orthogonal Curvilinear Squares &bull; Darcy's Law
          </p>
        </div>
      </footer>
    </div>
  );
};
