import { useCallback } from 'react';
import { useSimulationContext } from '../context/useSimulationContext';
import { SimulationParameters, VisibilityState } from '../lib/types';
import { PRESETS } from '../lib/constants';

export function useSimulation() {
  const { state, dispatch } = useSimulationContext();

  const updateParameter = useCallback(
    (name: keyof SimulationParameters, value: number) => {
      dispatch({
        type: 'UPDATE_PARAMETER',
        payload: { name, value },
      });
    },
    [dispatch]
  );

  const applyPreset = useCallback(
    (presetId: string) => {
      const preset = PRESETS.find((p) => p.id === presetId);
      if (preset) {
        dispatch({
          type: 'SET_PRESET',
          payload: { id: preset.id, parameters: preset.parameters },
        });
      }
    },
    [dispatch]
  );

  const toggleVisibility = useCallback(
    (key: keyof VisibilityState) => {
      dispatch({
        type: 'TOGGLE_VISIBILITY',
        payload: { key },
      });
    },
    [dispatch]
  );

  const toggleAnimation = useCallback(() => {
    dispatch({
      type: 'SET_ANIMATION_RUNNING',
      payload: !state.animation.isRunning,
    });
  }, [dispatch, state.animation.isRunning]);

  const setAnimationSpeed = useCallback(
    (speed: number) => {
      dispatch({
        type: 'SET_ANIMATION_SPEED',
        payload: speed,
      });
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  return {
    parameters: state.parameters,
    visibility: state.visibility,
    animation: state.animation,
    activePresetId: state.activePresetId,
    updateParameter,
    applyPreset,
    toggleVisibility,
    toggleAnimation,
    setAnimationSpeed,
    reset,
  };
}
