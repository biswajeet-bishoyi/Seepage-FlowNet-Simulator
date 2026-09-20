/**
 * Numerical and engineering formatting utilities
 */

/**
 * Formats head value in meters (e.g. "20.00 m")
 */
export function formatHead(value: number): string {
  return `${value.toFixed(2)} m`;
}

/**
 * Formats hydraulic conductivity (e.g. "0.0100 m/s" or scientific for very small)
 */
export function formatConductivity(value: number): string {
  if (value < 0.001) {
    return `${value.toExponential(3)} m/s`;
  }
  return `${value.toFixed(4)} m/s`;
}

/**
 * Formats seepage discharge per unit width (e.g. "0.0300 m³/s per m")
 */
export function formatDischarge(value: number): string {
  if (value < 0.0001 && value > 0) {
    return `${value.toExponential(4)} m³/s per m`;
  }
  return `${value.toFixed(4)} m³/s per m`;
}

/**
 * Formats hydraulic gradient (e.g. "0.075" or as percentage "7.5%")
 */
export function formatGradient(value: number): string {
  return `${value.toFixed(4)} (${(value * 100).toFixed(2)}%)`;
}
