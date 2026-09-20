import React from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { FlowNetSimulator } from './components/FlowNetSimulator';

export const App: React.FC = () => {
  return (
    <SimulationProvider>
      <FlowNetSimulator />
    </SimulationProvider>
  );
};

export default App;
