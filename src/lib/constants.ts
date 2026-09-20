import { SimulationParameters, PresetScenario } from './types';

export const DEFAULTS: SimulationParameters = {
  upstreamHead: 20,
  downstreamHead: 14,
  hydraulicConductivity: 0.01,
  flowChannels: 4,
  potentialDrops: 8,
};

export const RANGES = {
  upstreamHead: { min: 10, max: 30, step: 0.5 },
  downstreamHead: { min: 0, max: 25, step: 0.5 },
  hydraulicConductivity: { min: 0.001, max: 0.1, step: 0.001 },
  flowChannels: { min: 1, max: 10, step: 1 },
  potentialDrops: { min: 2, max: 20, step: 1 },
} as const;

export const UNITS = {
  HEAD: 'm',
  CONDUCTIVITY: 'm/s',
  DISCHARGE: 'm³/s per m',
  DISCHARGE_PER_CHANNEL: 'm³/s per m',
  GRADIENT: 'dimensionless',
} as const;

export const CANVAS_CONFIG = {
  VIEWBOX_WIDTH: 900,
  VIEWBOX_HEIGHT: 520,
  SOIL_TOP_Y: 260,
  SOIL_BOTTOM_Y: 470,
  DAM_LEFT_X: 350,
  DAM_RIGHT_X: 550,
  DAM_CREST_Y: 100,
  DAM_CREST_WIDTH: 80,
  GROUND_LEFT_X: 0,
  GROUND_RIGHT_X: 900,
  FLOW_DISTANCE_ESTIMATE: 10, // Approx seepage path length in meters for gradient calculation
} as const;

export const COLORS = {
  FLOW_LINE: '#1E90FF',
  EQUIPOTENTIAL_LINE: '#20B2AA',
  DAM_FILL: '#334155',
  DAM_STROKE: '#1E293B',
  SOIL_FILL: '#E6C280',
  SOIL_DARK: '#D4A359',
  WATER_BODY: 'rgba(56, 189, 248, 0.45)',
  WATER_DEEP: 'rgba(14, 165, 233, 0.65)',
  WATER_SURFACE: '#0284C7',
  ROCK_BASE: '#1E293B',
  ARROW: '#0284C7',
} as const;

export const PRESETS: PresetScenario[] = [
  {
    id: 'default',
    name: 'Default (Concrete Gravity Dam)',
    description: 'Standard textbook seepage problem with 6m total head difference under an impermeable dam foundation.',
    parameters: {
      upstreamHead: 20,
      downstreamHead: 14,
      hydraulicConductivity: 0.01,
      flowChannels: 4,
      potentialDrops: 8,
    },
  },
  {
    id: 'high-perm',
    name: 'High Permeability Sand',
    description: 'Coarse sand foundation (k = 0.05 m/s) with dense flow network illustrating higher seepage flux.',
    parameters: {
      upstreamHead: 20,
      downstreamHead: 14,
      hydraulicConductivity: 0.05,
      flowChannels: 6,
      potentialDrops: 10,
    },
  },
  {
    id: 'steep-gradient',
    name: 'Critical / Steep Gradient',
    description: 'High reservoir elevation (26m) vs low tailwater (8m), demonstrating increased risk of downstream quicksand/piping.',
    parameters: {
      upstreamHead: 26,
      downstreamHead: 8,
      hydraulicConductivity: 0.02,
      flowChannels: 5,
      potentialDrops: 12,
    },
  },
  {
    id: 'low-flow',
    name: 'Low Permeability Silt',
    description: 'Fine silt / tight foundation layer with small differential head and minimal seepage discharge.',
    parameters: {
      upstreamHead: 16,
      downstreamHead: 14,
      hydraulicConductivity: 0.002,
      flowChannels: 3,
      potentialDrops: 6,
    },
  },
];
