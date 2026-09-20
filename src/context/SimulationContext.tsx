import React, { createContext, useReducer, ReactNode } from 'react';
import { SimulationState, SimulationAction } from '../lib/types';
import { DEFAULTS } from '../lib/constants';

const initialState: SimulationState = {
  parameters: { ...DEFAULTS },
  visibility: {
    flowLines: true,
    equipotentialLines: true,
    particleAnimation: true,
    headLabels: true,
    flowArrows: true,
    grid: true,
    legend: true,
    educationalPanel: true,
  },
  animation: {
    isRunning: true,
    speed: 1.0,
  },
  activePresetId: 'default',
};

function simulationReducer(
  state: SimulationState,
  action: SimulationAction
): SimulationState {
  switch (action.type) {
    case 'UPDATE_PARAMETER':
      return {
        ...state,
        parameters: {
          ...state.parameters,
          [action.payload.name]: action.payload.value,
        },
        activePresetId: null, // manual modification clears active preset
      };

    case 'SET_PARAMETERS':
      return {
        ...state,
        parameters: {
          ...state.parameters,
          ...action.payload,
        },
        activePresetId: null,
      };

    case 'SET_PRESET':
      return {
        ...state,
        parameters: { ...action.payload.parameters },
        activePresetId: action.payload.id,
      };

    case 'TOGGLE_VISIBILITY':
      return {
        ...state,
        visibility: {
          ...state.visibility,
          [action.payload.key]: !state.visibility[action.payload.key],
        },
      };

    case 'SET_ANIMATION_RUNNING':
      return {
        ...state,
        animation: {
          ...state.animation,
          isRunning: action.payload,
        },
      };

    case 'SET_ANIMATION_SPEED':
      return {
        ...state,
        animation: {
          ...state.animation,
          speed: action.payload,
        },
      };

    case 'RESET':
      return {
        ...initialState,
        parameters: { ...DEFAULTS },
        activePresetId: 'default',
      };

    default:
      return state;
  }
}

export interface SimulationContextValue {
  state: SimulationState;
  dispatch: React.Dispatch<SimulationAction>;
}

export const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  return (
    <SimulationContext.Provider value={{ state, dispatch }}>
      {children}
    </SimulationContext.Provider>
  );
}
