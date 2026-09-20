import React, { useRef, useMemo } from 'react';
import {
  SimulationParameters,
  VisibilityState,
  AnimationState,
} from '../lib/types';
import { CANVAS_CONFIG, COLORS } from '../lib/constants';
import { generateFlowNetGeometry } from '../lib/flowNetGeometry';
import { useParticleAnimation } from '../hooks/useAnimation';

interface SimulationCanvasProps {
  parameters: SimulationParameters;
  visibility: VisibilityState;
  animation: AnimationState;
  hydraulicGradient: number;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  parameters,
  visibility,
  animation,
  hydraulicGradient,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute flow net geometry based on current parameters
  const geometry = useMemo(() => {
    return generateFlowNetGeometry(parameters);
  }, [parameters]);

  // Hook up particle animation canvas overlay
  useParticleAnimation(
    canvasRef,
    geometry.flowLines,
    animation.isRunning && visibility.particleAnimation,
    animation.speed,
    hydraulicGradient,
    parameters.hydraulicConductivity
  );

  const {
    flowLines,
    equipotentialLines,
    damPolygon,
    soilRect,
    impermeableBaseY,
    upstreamWaterPolygon,
    downstreamWaterPolygon,
    upstreamSurface,
    downstreamSurface,
  } = geometry;

  const damPolygonPoints = damPolygon.map((p) => `${p.x},${p.y}`).join(' ');
  const upstreamWaterPoints = upstreamWaterPolygon.map((p) => `${p.x},${p.y}`).join(' ');
  const downstreamWaterPoints = downstreamWaterPolygon.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative w-full aspect-[900/520] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none">
      {/* SVG Layer: Dam, Soil, Water, Flow Net, Annotations */}
      <svg
        viewBox={`0 0 ${CANVAS_CONFIG.VIEWBOX_WIDTH} ${CANVAS_CONFIG.VIEWBOX_HEIGHT}`}
        className="w-full h-full block"
        aria-label="Cross-sectional visualization of seepage flow net under a dam"
      >
        <defs>
          {/* Soil speckle pattern */}
          <pattern id="soilPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#2d2216" />
            <circle cx="5" cy="5" r="1.2" fill="#c69b67" opacity="0.4" />
            <circle cx="15" cy="12" r="1.5" fill="#e2ba87" opacity="0.3" />
            <circle cx="8" cy="16" r="1.0" fill="#916c3e" opacity="0.5" />
          </pattern>

          {/* Impermeable rock hatch */}
          <pattern id="rockHatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#475569" strokeWidth="1.5" />
            <rect width="12" height="12" fill="#0f172a" opacity="0.8" />
          </pattern>

          {/* Dam concrete hatch */}
          <pattern id="concreteHatch" width="8" height="8" patternTransform="rotate(30 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#64748b" strokeWidth="0.8" opacity="0.35" />
          </pattern>

          {/* Water gradient */}
          <linearGradient id="waterGradUp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="waterGradDown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.80" />
          </linearGradient>

          {/* Dam gradient */}
          <linearGradient id="damGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Flow line arrow marker */}
          <marker
            id="flowArrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="4.5"
            markerHeight="4.5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
          </marker>

          {/* Subtle grid pattern */}
          <pattern id="canvasGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.4" opacity="0.4" />
          </pattern>
        </defs>

        {/* Optional background grid */}
        {visibility.grid && (
          <rect width="100%" height="100%" fill="url(#canvasGrid)" />
        )}

        {/* 1. Soil Layer (Permeable Sand/Foundation) */}
        <g id="soil-stratum">
          <rect
            x={soilRect.x}
            y={soilRect.y}
            width={soilRect.width}
            height={soilRect.height}
            fill="url(#soilPattern)"
          />
          {/* Ground surface line */}
          <line
            x1="0"
            y1={soilRect.y}
            x2={CANVAS_CONFIG.VIEWBOX_WIDTH}
            y2={soilRect.y}
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4,2"
          />
        </g>

        {/* 2. Impermeable Bedrock Base */}
        <g id="bedrock-base">
          <rect
            x="0"
            y={impermeableBaseY}
            width={CANVAS_CONFIG.VIEWBOX_WIDTH}
            height={CANVAS_CONFIG.VIEWBOX_HEIGHT - impermeableBaseY}
            fill="url(#rockHatch)"
          />
          {/* Bedrock interface boundary line (Flow Boundary: ψ = const) */}
          <line
            x1="0"
            y1={impermeableBaseY}
            x2={CANVAS_CONFIG.VIEWBOX_WIDTH}
            y2={impermeableBaseY}
            stroke="#cbd5e1"
            strokeWidth="2.5"
          />
          <text
            x={CANVAS_CONFIG.VIEWBOX_WIDTH / 2}
            y={impermeableBaseY + 28}
            fill="#94a3b8"
            fontSize="11"
            fontFamily="sans-serif"
            fontWeight="600"
            textAnchor="middle"
            letterSpacing="1.5"
          >
            IMPERMEABLE BASE (NO-FLOW BOUNDARY: ∂h/∂n = 0)
          </text>
        </g>

        {/* 3. Equipotential Lines (Dashed Teal Curves: equal hydraulic head) */}
        {visibility.equipotentialLines && (
          <g id="equipotential-lines">
            {equipotentialLines.map((line) => (
              <g key={`equi-${line.id}`}>
                <path
                  d={line.pathString}
                  stroke={COLORS.EQUIPOTENTIAL_LINE}
                  strokeWidth="2.0"
                  strokeDasharray="6,4"
                  fill="none"
                  className="transition-all duration-150 opacity-90 hover:opacity-100 hover:stroke-teal-300"
                />

                {/* Head value label badge along equipotential */}
                {visibility.headLabels && (
                  <g
                    transform={`translate(${line.labelPosition.x}, ${line.labelPosition.y})`}
                    className="pointer-events-none"
                  >
                    <rect
                      x="-18"
                      y="-9"
                      width="36"
                      height="16"
                      rx="4"
                      fill="#042f2e"
                      stroke="#14b8a6"
                      strokeWidth="0.8"
                      opacity="0.9"
                    />
                    <text
                      x="0"
                      y="3"
                      fill="#5eead4"
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {line.headValue.toFixed(1)}m
                    </text>
                  </g>
                )}
              </g>
            ))}
          </g>
        )}

        {/* 4. Flow Lines (Solid Blue Streamlines: flow paths) */}
        {visibility.flowLines && (
          <g id="flow-lines">
            {flowLines.map((line) => (
              <path
                key={`flow-${line.id}`}
                d={line.pathString}
                stroke={COLORS.FLOW_LINE}
                strokeWidth="2.4"
                fill="none"
                markerMid={visibility.flowArrows ? 'url(#flowArrow)' : undefined}
                markerEnd={visibility.flowArrows ? 'url(#flowArrow)' : undefined}
                className="transition-all duration-150 shadow-sm hover:stroke-sky-300"
              />
            ))}
          </g>
        )}

        {/* 5. Upstream Reservoir Water Body */}
        <g id="upstream-water">
          <polygon
            points={upstreamWaterPoints}
            fill="url(#waterGradUp)"
          />
          {/* Water surface line touching dam face */}
          <line
            x1={upstreamSurface.x1}
            y1={upstreamSurface.y1}
            x2={upstreamSurface.x2}
            y2={upstreamSurface.y2}
            stroke="#e0f2fe"
            strokeWidth="2.5"
          />
          {/* Upstream Head Callout */}
          <g transform={`translate(20, ${upstreamSurface.y1 - 12})`}>
            <rect
              x="-6"
              y="-14"
              width="140"
              height="22"
              rx="6"
              fill="#082f49"
              stroke="#0284c7"
              strokeWidth="1.2"
            />
            <text
              x="64"
              y="1"
              fill="#38bdf8"
              fontSize="11.5"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              h₁ = {parameters.upstreamHead.toFixed(2)} m
            </text>
          </g>
        </g>

        {/* 6. Downstream Tailwater Body */}
        <g id="downstream-water">
          <polygon
            points={downstreamWaterPoints}
            fill="url(#waterGradDown)"
          />
          <line
            x1={downstreamSurface.x1}
            y1={downstreamSurface.y1}
            x2={downstreamSurface.x2}
            y2={downstreamSurface.y2}
            stroke="#e0f2fe"
            strokeWidth="2.5"
          />
          {/* Downstream Head Callout */}
          <g transform={`translate(${CANVAS_CONFIG.VIEWBOX_WIDTH - 160}, ${downstreamSurface.y1 - 12})`}>
            <rect
              x="-6"
              y="-14"
              width="140"
              height="22"
              rx="6"
              fill="#082f49"
              stroke="#0284c7"
              strokeWidth="1.2"
            />
            <text
              x="64"
              y="1"
              fill="#38bdf8"
              fontSize="11.5"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              h₂ = {parameters.downstreamHead.toFixed(2)} m
            </text>
          </g>
        </g>

        {/* 7. Impermeable Concrete Gravity Dam */}
        <g id="dam-structure">
          <polygon
            points={damPolygonPoints}
            fill="url(#damGrad)"
            stroke="#0f172a"
            strokeWidth="2.5"
          />
          <polygon
            points={damPolygonPoints}
            fill="url(#concreteHatch)"
            opacity="0.8"
          />
          {/* Dam Base Contact Line */}
          <line
            x1={CANVAS_CONFIG.DAM_LEFT_X}
            y1={CANVAS_CONFIG.SOIL_TOP_Y}
            x2={CANVAS_CONFIG.DAM_RIGHT_X}
            y2={CANVAS_CONFIG.SOIL_TOP_Y}
            stroke="#0f172a"
            strokeWidth="3.5"
          />
          {/* Dam Text Label */}
          <text
            x={(CANVAS_CONFIG.DAM_LEFT_X + CANVAS_CONFIG.DAM_RIGHT_X) / 2}
            y={CANVAS_CONFIG.DAM_CREST_Y + 70}
            fill="#e2e8f0"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing="1.2"
          >
            CONCRETE DAM
          </text>
          <text
            x={(CANVAS_CONFIG.DAM_LEFT_X + CANVAS_CONFIG.DAM_RIGHT_X) / 2}
            y={CANVAS_CONFIG.DAM_CREST_Y + 86}
            fill="#94a3b8"
            fontSize="10"
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            (Impermeable Structure)
          </text>
        </g>

        {/* 8. Boundary labels & Flow Direction */}
        <g id="annotations">
          {/* Soil label */}
          <text
            x="30"
            y={CANVAS_CONFIG.SOIL_TOP_Y + 28}
            fill="#d4a359"
            fontSize="11"
            fontFamily="sans-serif"
            fontWeight="600"
          >
            PERMEABLE SOIL LAYER (k = {parameters.hydraulicConductivity} m/s)
          </text>

          {/* Upstream equipotential entry bed */}
          <text
            x={180}
            y={CANVAS_CONFIG.SOIL_TOP_Y - 8}
            fill="#7dd3fc"
            fontSize="9.5"
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            Entry Boundary (h = h₁)
          </text>

          {/* Downstream equipotential exit bed */}
          <text
            x={720}
            y={CANVAS_CONFIG.SOIL_TOP_Y - 8}
            fill="#7dd3fc"
            fontSize="9.5"
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            Exit Boundary (h = h₂)
          </text>
        </g>
      </svg>

      {/* High-Performance Canvas Overlay for Seepage Particle Animation */}
      <canvas
        ref={canvasRef}
        width={CANVAS_CONFIG.VIEWBOX_WIDTH}
        height={CANVAS_CONFIG.VIEWBOX_HEIGHT}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};
