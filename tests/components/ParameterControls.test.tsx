import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParameterControls } from '../../src/components/ParameterControls';
import { DEFAULTS } from '../../src/lib/constants';

describe('ParameterControls Component', () => {
  it('renders all 5 parameter inputs with labels and symbols', () => {
    const mockUpdate = vi.fn();
    const mockReset = vi.fn();
    const mockToggleAnim = vi.fn();
    const mockSetSpeed = vi.fn();

    render(
      <ParameterControls
        parameters={DEFAULTS}
        onUpdateParameter={mockUpdate}
        onReset={mockReset}
        animation={{ isRunning: true, speed: 1.0 }}
        onToggleAnimation={mockToggleAnim}
        onSetAnimationSpeed={mockSetSpeed}
      />
    );

    // Labels
    expect(screen.getByText(/Upstream Head/i)).toBeInTheDocument();
    expect(screen.getByText(/Downstream Head/i)).toBeInTheDocument();
    expect(screen.getByText(/Hydraulic Conductivity/i)).toBeInTheDocument();
    expect(screen.getByText(/Flow Channels/i)).toBeInTheDocument();
    expect(screen.getByText(/Potential Drops/i)).toBeInTheDocument();

    // Reset button
    expect(screen.getByRole('button', { name: /Reset Defaults/i })).toBeInTheDocument();
  });

  it('triggers onUpdateParameter when sliders or inputs change', () => {
    const mockUpdate = vi.fn();
    const mockReset = vi.fn();
    const mockToggleAnim = vi.fn();
    const mockSetSpeed = vi.fn();

    render(
      <ParameterControls
        parameters={DEFAULTS}
        onUpdateParameter={mockUpdate}
        onReset={mockReset}
        animation={{ isRunning: true, speed: 1.0 }}
        onToggleAnimation={mockToggleAnim}
        onSetAnimationSpeed={mockSetSpeed}
      />
    );

    // Change upstream head slider
    const upstreamSlider = screen.getByLabelText(/Upstream Head/i);
    fireEvent.change(upstreamSlider, { target: { value: '25' } });
    expect(mockUpdate).toHaveBeenCalledWith('upstreamHead', 25);

    // Increase flow channels with + button
    const plusButtons = screen.getAllByLabelText(/Increase/i);
    fireEvent.click(plusButtons[0]);
    expect(mockUpdate).toHaveBeenCalledWith('flowChannels', 5);
  });
});
