import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CalculationPanel } from '../../src/components/CalculationPanel';
import { DEFAULTS } from '../../src/lib/constants';
import { calculateAll } from '../../src/lib/calculations';

describe('CalculationPanel Component', () => {
  it('renders all calculated metric cards and default values accurately', () => {
    const calculatedValues = calculateAll(DEFAULTS);

    render(
      <CalculationPanel
        parameters={DEFAULTS}
        calculatedValues={calculatedValues}
      />
    );

    // Total Head Loss (H = 6.00 m)
    expect(screen.getByText(/Total Head Loss/i)).toBeInTheDocument();
    expect(screen.getByText('6.00 m')).toBeInTheDocument();

    // Head loss per drop (Δh = 0.75 m)
    expect(screen.getByText(/Head Loss Per Drop/i)).toBeInTheDocument();
    expect(screen.getByText('0.75 m')).toBeInTheDocument();

    // Seepage discharge (q = 0.0300 m³/s per m)
    expect(screen.getByText(/Seepage Discharge/i)).toBeInTheDocument();
    expect(screen.getAllByText(/0.0300 m³/i).length).toBeGreaterThanOrEqual(1);

    // Valid state badge
    expect(screen.getByText(/Valid State/i)).toBeInTheDocument();
  });

  it('displays error notice when parameters are invalid', () => {
    const invalidCalculatedValues = {
      totalHeadLoss: 0,
      headPerDrop: 0,
      seepageDischarge: 0,
      dischargePerChannel: 0,
      hydraulicGradient: 0,
      isValid: false,
      errors: ['Upstream head must be greater than downstream head'],
    };

    render(
      <CalculationPanel
        parameters={{ ...DEFAULTS, upstreamHead: 10, downstreamHead: 20 }}
        calculatedValues={invalidCalculatedValues}
      />
    );

    expect(screen.getByText(/Invalid Input/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Upstream head must be greater than downstream head/i)
    ).toBeInTheDocument();
  });
});
