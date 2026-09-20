import { SimulationParameters, CalculatedValues } from './types';
import { CANVAS_CONFIG } from './constants';
import { validateParameters } from './validation';

/**
 * Pure engineering calculations for the Seepage Flow Net Simulator.
 * Single source of truth according to CLAUDE.md Section 3.1 and PRD.md Section 10.
 */

/**
 * Calculates total hydraulic head loss driving the seepage flow.
 * H = h1 - h2
 * @param upstreamHead - Hydraulic head on upstream side [m]
 * @param downstreamHead - Hydraulic head on downstream side [m]
 * @returns Total head loss H [m]
 */
export function calculateTotalHeadLoss(
  upstreamHead: number,
  downstreamHead: number
): number {
  return upstreamHead - downstreamHead;
}

/**
 * Calculates the uniform head drop between adjacent equipotential lines.
 * Δh = H / Nd
 * @param totalHeadLoss - Total head loss H [m]
 * @param potentialDrops - Number of potential drops Nd [integer >= 2]
 * @returns Head loss per potential drop Δh [m]
 */
export function calculateHeadPerDrop(
  totalHeadLoss: number,
  potentialDrops: number
): number {
  if (potentialDrops <= 0) return 0;
  return totalHeadLoss / potentialDrops;
}

/**
 * Calculates total seepage discharge per unit width beneath the dam using Terzaghi's formula.
 * q = k * H * (Nf / Nd)
 * @param hydraulicConductivity - Soil coefficient of permeability k [m/s]
 * @param totalHeadLoss - Total head loss H [m]
 * @param flowChannels - Number of flow channels Nf [integer >= 1]
 * @param potentialDrops - Number of potential drops Nd [integer >= 2]
 * @returns Total seepage discharge q [m³/s per meter width]
 */
export function calculateSeepageDischarge(
  hydraulicConductivity: number,
  totalHeadLoss: number,
  flowChannels: number,
  potentialDrops: number
): number {
  if (
    hydraulicConductivity <= 0 ||
    totalHeadLoss <= 0 ||
    flowChannels <= 0 ||
    potentialDrops <= 0
  ) {
    return 0;
  }
  return hydraulicConductivity * totalHeadLoss * (flowChannels / potentialDrops);
}

/**
 * Calculates the seepage discharge carried by a single flow channel.
 * q_ch = q / Nf
 * @param totalDischarge - Total seepage discharge q [m³/s per m]
 * @param flowChannels - Number of flow channels Nf
 * @returns Seepage discharge per channel [m³/s per m]
 */
export function calculateDischargePerChannel(
  totalDischarge: number,
  flowChannels: number
): number {
  if (flowChannels <= 0) return 0;
  return totalDischarge / flowChannels;
}

/**
 * Calculates the approximate exit hydraulic gradient.
 * i ≈ Δh / L
 * Where L is the estimated flow path length along the exit drop (~10m).
 * @param headPerDrop - Head loss per potential drop Δh [m]
 * @param flowDistance - Approximate flow distance L [m]
 * @returns Hydraulic gradient i [dimensionless]
 */
export function calculateHydraulicGradient(
  headPerDrop: number,
  flowDistance: number = CANVAS_CONFIG.FLOW_DISTANCE_ESTIMATE
): number {
  if (flowDistance <= 0 || headPerDrop <= 0) return 0;
  return headPerDrop / flowDistance;
}

/**
 * Computes all derived civil engineering metrics from the given simulation parameters.
 * Validates inputs first; returns safe defaults if validation fails.
 * @param params - Current simulation parameters
 * @returns Fully populated CalculatedValues object
 */
export function calculateAll(params: SimulationParameters): CalculatedValues {
  const validation = validateParameters(params);

  if (!validation.isValid) {
    return {
      totalHeadLoss: 0,
      headPerDrop: 0,
      seepageDischarge: 0,
      dischargePerChannel: 0,
      hydraulicGradient: 0,
      isValid: false,
      errors: validation.errors,
    };
  }

  const H = calculateTotalHeadLoss(params.upstreamHead, params.downstreamHead);
  const deltaH = calculateHeadPerDrop(H, params.potentialDrops);
  const q = calculateSeepageDischarge(
    params.hydraulicConductivity,
    H,
    params.flowChannels,
    params.potentialDrops
  );
  const qChannel = calculateDischargePerChannel(q, params.flowChannels);
  const i = calculateHydraulicGradient(deltaH);

  return {
    totalHeadLoss: H,
    headPerDrop: deltaH,
    seepageDischarge: q,
    dischargePerChannel: qChannel,
    hydraulicGradient: i,
    isValid: true,
    errors: [],
  };
}
