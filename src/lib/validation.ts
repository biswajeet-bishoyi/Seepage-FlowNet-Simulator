import { SimulationParameters } from './types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const ERROR_MESSAGES = {
  UPSTREAM_GT_DOWNSTREAM: 'Upstream head must be greater than downstream head',
  HEAD_NON_NEGATIVE: 'Head values must be non-negative',
  HEAD_MAX_EXCEEDED: 'Head values must not exceed 100 m',
  K_MUST_BE_POSITIVE: 'Hydraulic conductivity must be positive (k > 0)',
  K_MAX_EXCEEDED: 'Hydraulic conductivity must not exceed 1 m/s',
  NF_MUST_BE_INTEGER_GE_1: 'Flow channels must be an integer ≥ 1',
  NF_MAX_EXCEEDED: 'Flow channels must not exceed 10',
  ND_MUST_BE_INTEGER_GE_2: 'Potential drops must be an integer ≥ 2',
  ND_MAX_EXCEEDED: 'Potential drops must not exceed 20',
} as const;

/**
 * Validates simulation parameters against geotechnical engineering and physical constraints.
 */
export function validateParameters(params: SimulationParameters): ValidationResult {
  const errors: string[] = [];

  // Head constraints
  if (params.upstreamHead <= params.downstreamHead) {
    errors.push(ERROR_MESSAGES.UPSTREAM_GT_DOWNSTREAM);
  }
  if (params.upstreamHead < 0 || params.downstreamHead < 0) {
    errors.push(ERROR_MESSAGES.HEAD_NON_NEGATIVE);
  }
  if (params.upstreamHead > 100 || params.downstreamHead > 100) {
    errors.push(ERROR_MESSAGES.HEAD_MAX_EXCEEDED);
  }

  // Conductivity constraints
  if (params.hydraulicConductivity <= 0) {
    errors.push(ERROR_MESSAGES.K_MUST_BE_POSITIVE);
  }
  if (params.hydraulicConductivity > 1) {
    errors.push(ERROR_MESSAGES.K_MAX_EXCEEDED);
  }

  // Flow channels
  if (!Number.isInteger(params.flowChannels) || params.flowChannels < 1) {
    errors.push(ERROR_MESSAGES.NF_MUST_BE_INTEGER_GE_1);
  } else if (params.flowChannels > 10) {
    errors.push(ERROR_MESSAGES.NF_MAX_EXCEEDED);
  }

  // Potential drops
  if (!Number.isInteger(params.potentialDrops) || params.potentialDrops < 2) {
    errors.push(ERROR_MESSAGES.ND_MUST_BE_INTEGER_GE_2);
  } else if (params.potentialDrops > 20) {
    errors.push(ERROR_MESSAGES.ND_MAX_EXCEEDED);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Clamps a number between min and max.
 */
export function clampValue(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

/**
 * Rounds a value to the nearest integer within bounds.
 */
export function ensureInteger(value: number, min: number, max: number): number {
  const rounded = Math.round(value);
  return clampValue(rounded, min, max);
}
