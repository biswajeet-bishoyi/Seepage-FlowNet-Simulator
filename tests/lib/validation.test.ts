import { describe, it, expect } from 'vitest';
import {
  validateParameters,
  clampValue,
  ensureInteger,
  ERROR_MESSAGES,
} from '../../src/lib/validation';
import { DEFAULTS } from '../../src/lib/constants';

describe('Parameter Validation (validation.ts)', () => {
  it('accepts valid default parameters without errors', () => {
    const result = validateParameters(DEFAULTS);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects upstream head <= downstream head', () => {
    const resEqual = validateParameters({ ...DEFAULTS, upstreamHead: 14, downstreamHead: 14 });
    expect(resEqual.isValid).toBe(false);
    expect(resEqual.errors).toContain(ERROR_MESSAGES.UPSTREAM_GT_DOWNSTREAM);

    const resLess = validateParameters({ ...DEFAULTS, upstreamHead: 10, downstreamHead: 20 });
    expect(resLess.isValid).toBe(false);
    expect(resLess.errors).toContain(ERROR_MESSAGES.UPSTREAM_GT_DOWNSTREAM);
  });

  it('rejects negative head values', () => {
    const res = validateParameters({ ...DEFAULTS, upstreamHead: -5, downstreamHead: -10 });
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain(ERROR_MESSAGES.HEAD_NON_NEGATIVE);
  });

  it('rejects non-positive hydraulic conductivity', () => {
    const resZero = validateParameters({ ...DEFAULTS, hydraulicConductivity: 0 });
    expect(resZero.isValid).toBe(false);
    expect(resZero.errors).toContain(ERROR_MESSAGES.K_MUST_BE_POSITIVE);

    const resNeg = validateParameters({ ...DEFAULTS, hydraulicConductivity: -0.05 });
    expect(resNeg.isValid).toBe(false);
    expect(resNeg.errors).toContain(ERROR_MESSAGES.K_MUST_BE_POSITIVE);
  });

  it('rejects flow channels < 1 or non-integer', () => {
    const resZero = validateParameters({ ...DEFAULTS, flowChannels: 0 });
    expect(resZero.isValid).toBe(false);
    expect(resZero.errors).toContain(ERROR_MESSAGES.NF_MUST_BE_INTEGER_GE_1);

    const resFloat = validateParameters({ ...DEFAULTS, flowChannels: 3.5 });
    expect(resFloat.isValid).toBe(false);
    expect(resFloat.errors).toContain(ERROR_MESSAGES.NF_MUST_BE_INTEGER_GE_1);
  });

  it('rejects potential drops < 2 or non-integer', () => {
    const resOne = validateParameters({ ...DEFAULTS, potentialDrops: 1 });
    expect(resOne.isValid).toBe(false);
    expect(resOne.errors).toContain(ERROR_MESSAGES.ND_MUST_BE_INTEGER_GE_2);

    const resFloat = validateParameters({ ...DEFAULTS, potentialDrops: 4.8 });
    expect(resFloat.isValid).toBe(false);
    expect(resFloat.errors).toContain(ERROR_MESSAGES.ND_MUST_BE_INTEGER_GE_2);
  });

  describe('Utility clampValue & ensureInteger', () => {
    it('clamps values within bounds', () => {
      expect(clampValue(5, 10, 30)).toBe(10);
      expect(clampValue(35, 10, 30)).toBe(30);
      expect(clampValue(20, 10, 30)).toBe(20);
    });

    it('rounds and clamps integers', () => {
      expect(ensureInteger(4.3, 1, 10)).toBe(4);
      expect(ensureInteger(4.8, 1, 10)).toBe(5);
      expect(ensureInteger(15, 1, 10)).toBe(10);
      expect(ensureInteger(-2, 1, 10)).toBe(1);
    });
  });
});
