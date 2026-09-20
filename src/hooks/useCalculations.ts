import { useMemo } from 'react';
import { SimulationParameters, CalculatedValues } from '../lib/types';
import { calculateAll } from '../lib/calculations';

export function useCalculations(params: SimulationParameters): CalculatedValues {
  return useMemo(() => {
    return calculateAll(params);
  }, [
    params.upstreamHead,
    params.downstreamHead,
    params.hydraulicConductivity,
    params.flowChannels,
    params.potentialDrops,
  ]);
}
