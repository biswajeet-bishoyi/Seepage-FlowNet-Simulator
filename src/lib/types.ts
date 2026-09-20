/**
 * Core type definitions for the Flow Net Simulator
 * Follows guidelines from CLAUDE.md and PRD.md
 */

export interface SimulationParameters {
  /** Upstream water surface elevation / hydraulic head [m] */
  upstreamHead: number;
  /** Downstream water surface elevation / hydraulic head [m] */
  downstreamHead: number;
  /** Hydraulic conductivity (soil permeability) [m/s] */
  hydraulicConductivity: number;
  /** Number of flow channels (flow paths) [dimensionless integer >= 1] */
  flowChannels: number;
  /** Number of potential drops (equipotential intervals) [dimensionless integer >= 2] */
  potentialDrops: number;
}

export interface CalculatedValues {
  /** Total hydraulic head loss H = h1 - h2 [m] */
  totalHeadLoss: number;
  /** Head loss per equipotential drop Δh = H / Nd [m] */
  headPerDrop: number;
  /** Total seepage discharge per unit dam width q = k * H * (Nf / Nd) [m³/s per m] */
  seepageDischarge: number;
  /** Discharge carried through each individual flow channel q_ch = q / Nf [m³/s per m] */
  dischargePerChannel: number;
  /** Approximate exit hydraulic gradient i ≈ Δh / L [dimensionless] */
  hydraulicGradient: number;
  /** Flag indicating whether the current parameters satisfy physical constraints */
  isValid: boolean;
  /** List of human-readable error messages if invalid */
  errors: string[];
}

export interface VisibilityState {
  flowLines: boolean;
  equipotentialLines: boolean;
  particleAnimation: boolean;
  headLabels: boolean;
  flowArrows: boolean;
  grid: boolean;
  legend: boolean;
  educationalPanel: boolean;
}

export interface AnimationState {
  isRunning: boolean;
  speed: number; // 0.5x to 2.0x
}

export interface SimulationState {
  parameters: SimulationParameters;
  visibility: VisibilityState;
  animation: AnimationState;
  activePresetId: string | null;
}

export type SimulationAction =
  | { type: 'UPDATE_PARAMETER'; payload: { name: keyof SimulationParameters; value: number } }
  | { type: 'SET_PARAMETERS'; payload: Partial<SimulationParameters> }
  | { type: 'SET_PRESET'; payload: { id: string; parameters: SimulationParameters } }
  | { type: 'TOGGLE_VISIBILITY'; payload: { key: keyof VisibilityState } }
  | { type: 'SET_ANIMATION_RUNNING'; payload: boolean }
  | { type: 'SET_ANIMATION_SPEED'; payload: number }
  | { type: 'RESET' };

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  parameters: SimulationParameters;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface FlowLineGeometry {
  id: number;
  pathString: string;
  points: Point2D[];
  channelIndex: number;
}

export interface EquipotentialLineGeometry {
  id: number;
  headValue: number;
  pathString: string;
  points: Point2D[];
  labelPosition: Point2D;
}

export interface FlowNetGeometry {
  flowLines: FlowLineGeometry[];
  equipotentialLines: EquipotentialLineGeometry[];
  damPolygon: Point2D[];
  soilRect: { x: number; y: number; width: number; height: number };
  impermeableBaseY: number;
  upstreamWaterRect: { x: number; y: number; width: number; height: number };
  downstreamWaterRect: { x: number; y: number; width: number; height: number };
  upstreamWaterPolygon: Point2D[];
  downstreamWaterPolygon: Point2D[];
  upstreamSurface: { x1: number; y1: number; x2: number; y2: number };
  downstreamSurface: { x1: number; y1: number; x2: number; y2: number };
}
