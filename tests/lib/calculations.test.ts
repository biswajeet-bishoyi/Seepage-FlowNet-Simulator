import { describe, it, expect } from 'vitest';
import {
  calculateTotalHeadLoss,
  calculateHeadPerDrop,
  calculateSeepageDischarge,
  calculateDischargePerChannel,
  calculateHydraulicGradient,
  calculateAll,
} from '../../src/lib/calculations';
import { DEFAULTS } from '../../src/lib/constants';

describe('Civil Engineering Calculations (calculations.ts)', () => {
  describe('calculateTotalHeadLoss (H = h1 - h2)', () => {
    it('calculates total head loss correctly for standard parameters', () => {
      expect(calculateTotalHeadLoss(20, 14)).toBe(6);
      expect(calculateTotalHeadLoss(30, 15)).toBe(15);
      expect(calculateTotalHeadLoss(25.5, 10.5)).toBe(15.0);
    });

    it('returns difference even when heads are inverted (handled by validation)', () => {
      expect(calculateTotalHeadLoss(14, 20)).toBe(-6);
    });
  });

  describe('calculateHeadPerDrop (Δh = H / Nd)', () => {
    it('calculates head drop per equipotential contour accurately', () => {
      expect(calculateHeadPerDrop(6, 8)).toBe(0.75);
      expect(calculateHeadPerDrop(10, 5)).toBe(2);
      expect(calculateHeadPerDrop(15, 10)).toBe(1.5);
    });

    it('returns 0 when potential drops is zero or negative to prevent divide-by-zero', () => {
      expect(calculateHeadPerDrop(6, 0)).toBe(0);
      expect(calculateHeadPerDrop(6, -2)).toBe(0);
    });
  });

  describe("calculateSeepageDischarge (Terzaghi's Formula: q = k * H * (Nf / Nd))", () => {
    it('matches the Appendix B baseline scenario exactly', () => {
      // k = 0.01 m/s, H = 6 m, Nf = 4, Nd = 8
      // q = 0.01 * 6 * (4 / 8) = 0.03 m³/s per m
      const q = calculateSeepageDischarge(0.01, 6, 4, 8);
      expect(q).toBeCloseTo(0.03, 5);
    });

    it('scales linearly with hydraulic conductivity k', () => {
      const q1 = calculateSeepageDischarge(0.01, 6, 4, 8);
      const q2 = calculateSeepageDischarge(0.02, 6, 4, 8);
      expect(q2).toBeCloseTo(q1 * 2, 5);
    });

    it('scales linearly with total head loss H', () => {
      const q1 = calculateSeepageDischarge(0.01, 6, 4, 8);
      const q2 = calculateSeepageDischarge(0.01, 12, 4, 8);
      expect(q2).toBeCloseTo(q1 * 2, 5);
    });

    it('returns 0 for unphysical boundary conditions', () => {
      expect(calculateSeepageDischarge(0, 6, 4, 8)).toBe(0);
      expect(calculateSeepageDischarge(-0.01, 6, 4, 8)).toBe(0);
      expect(calculateSeepageDischarge(0.01, 0, 4, 8)).toBe(0);
      expect(calculateSeepageDischarge(0.01, -5, 4, 8)).toBe(0);
      expect(calculateSeepageDischarge(0.01, 6, 0, 8)).toBe(0);
      expect(calculateSeepageDischarge(0.01, 6, 4, 0)).toBe(0);
    });
  });

  describe('calculateDischargePerChannel (q_ch = q / Nf)', () => {
    it('computes channel flow correctly for baseline', () => {
      // q = 0.03, Nf = 4 -> q_ch = 0.0075
      expect(calculateDischargePerChannel(0.03, 4)).toBe(0.0075);
    });

    it('handles zero channels safely', () => {
      expect(calculateDischargePerChannel(0.03, 0)).toBe(0);
    });
  });

  describe('calculateHydraulicGradient (i = Δh / L)', () => {
    it('calculates exit hydraulic gradient correctly', () => {
      // Δh = 0.75, L = 10 -> i = 0.075
      expect(calculateHydraulicGradient(0.75, 10)).toBe(0.075);
    });

    it('safely handles non-positive distances or heads', () => {
      expect(calculateHydraulicGradient(0.75, 0)).toBe(0);
      expect(calculateHydraulicGradient(0, 10)).toBe(0);
    });
  });

  describe('calculateAll (Comprehensive Derived State)', () => {
    it('returns complete correct civil engineering results for default inputs', () => {
      const results = calculateAll(DEFAULTS);

      expect(results.isValid).toBe(true);
      expect(results.errors).toHaveLength(0);
      expect(results.totalHeadLoss).toBe(6);
      expect(results.headPerDrop).toBe(0.75);
      expect(results.seepageDischarge).toBeCloseTo(0.03, 5);
      expect(results.dischargePerChannel).toBeCloseTo(0.0075, 5);
      expect(results.hydraulicGradient).toBeCloseTo(0.075, 5);
    });

    it('catches invalid inputs (e.g. h1 <= h2) and returns safe zeroed defaults', () => {
      const invalidParams = {
        ...DEFAULTS,
        upstreamHead: 10,
        downstreamHead: 20, // invalid: h1 < h2
      };
      const results = calculateAll(invalidParams);

      expect(results.isValid).toBe(false);
      expect(results.errors.length).toBeGreaterThan(0);
      expect(results.seepageDischarge).toBe(0);
      expect(results.totalHeadLoss).toBe(0);
    });
  });
});
