import { useContext } from 'react';
import { SimulationContext, SimulationContextValue } from './SimulationContext';

export function useSimulationContext(): SimulationContextValue {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulationContext must be used within a SimulationProvider');
  }
  return context;
}
