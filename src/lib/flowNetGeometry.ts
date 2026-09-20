import {
  SimulationParameters,
  Point2D,
  FlowLineGeometry,
  EquipotentialLineGeometry,
  FlowNetGeometry,
} from './types';
import { CANVAS_CONFIG } from './constants';

/**
 * Generates the civil engineering flow net geometry (streamlines and equipotential lines)
 * using conformal mapping principles (confocal elliptic-hyperbolic transformation).
 * This ensures smooth, non-intersecting, and mathematically orthogonal curvilinear squares.
 */

export function generateFlowNetGeometry(
  params: SimulationParameters,
  width: number = CANVAS_CONFIG.VIEWBOX_WIDTH,
  _height: number = CANVAS_CONFIG.VIEWBOX_HEIGHT
): FlowNetGeometry {
  const { flowChannels, potentialDrops, upstreamHead, downstreamHead } = params;

  const groundY = CANVAS_CONFIG.SOIL_TOP_Y; // 260
  const bedrockY = CANVAS_CONFIG.SOIL_BOTTOM_Y; // 470
  const damLeftX = CANVAS_CONFIG.DAM_LEFT_X; // 350
  const damRightX = CANVAS_CONFIG.DAM_RIGHT_X; // 550
  const damCenterX = (damLeftX + damRightX) / 2; // 450
  const halfDamWidth = (damRightX - damLeftX) / 2; // 100

  // Dam geometry
  const damPolygon: Point2D[] = [
    { x: damCenterX - CANVAS_CONFIG.DAM_CREST_WIDTH / 2, y: CANVAS_CONFIG.DAM_CREST_Y },
    { x: damCenterX + CANVAS_CONFIG.DAM_CREST_WIDTH / 2, y: CANVAS_CONFIG.DAM_CREST_Y },
    { x: damRightX, y: groundY },
    { x: damLeftX, y: groundY },
  ];

  // Soil stratum
  const soilRect = {
    x: 0,
    y: groundY,
    width: width,
    height: bedrockY - groundY,
  };

  // Water elevations (scaled proportionally to head, max head 30m)
  // Ground is at y=260. A 20m head is 100px deep.
  const headToPixels = 5.0; // 5 px per meter
  const upWaterHeight = Math.min(160, Math.max(20, upstreamHead * headToPixels));
  const downWaterHeight = Math.min(160, Math.max(10, downstreamHead * headToPixels));

  const damCrestLeftX = damCenterX - CANVAS_CONFIG.DAM_CREST_WIDTH / 2;
  const damCrestRightX = damCenterX + CANVAS_CONFIG.DAM_CREST_WIDTH / 2;

  const upWaterTopY = groundY - upWaterHeight;
  const upFraction = Math.max(0, Math.min(1, (groundY - upWaterTopY) / (groundY - CANVAS_CONFIG.DAM_CREST_Y)));
  const upDamContactX = damLeftX + upFraction * (damCrestLeftX - damLeftX);

  const downWaterTopY = groundY - downWaterHeight;
  const downFraction = Math.max(0, Math.min(1, (groundY - downWaterTopY) / (groundY - CANVAS_CONFIG.DAM_CREST_Y)));
  const downDamContactX = damRightX - downFraction * (damRightX - damCrestRightX);

  const upstreamWaterRect = {
    x: 0,
    y: upWaterTopY,
    width: upDamContactX,
    height: upWaterHeight,
  };

  const downstreamWaterRect = {
    x: downDamContactX,
    y: downWaterTopY,
    width: width - downDamContactX,
    height: downWaterHeight,
  };

  const upstreamWaterPolygon: Point2D[] = [
    { x: 0, y: upWaterTopY },
    { x: upDamContactX, y: upWaterTopY },
    { x: damLeftX, y: groundY },
    { x: 0, y: groundY },
  ];

  const downstreamWaterPolygon: Point2D[] = [
    { x: downDamContactX, y: downWaterTopY },
    { x: width, y: downWaterTopY },
    { x: width, y: groundY },
    { x: damRightX, y: groundY },
  ];

  const upstreamSurface = {
    x1: 0,
    y1: upWaterTopY,
    x2: upDamContactX,
    y2: upWaterTopY,
  };

  const downstreamSurface = {
    x1: downDamContactX,
    y1: downWaterTopY,
    x2: width,
    y2: downWaterTopY,
  };

  // Conformal parameter limits
  // y = groundY + b * sinh(psi) * sin(phi)
  // At deepest point under center (phi = pi/2): y - groundY = b * sinh(psi)
  const maxDepth = bedrockY - groundY; // 210
  const psiMax = Math.asinh(maxDepth / halfDamWidth); // ~1.487
  const psiMin = 0.15; // Offset from dam base so flow lines don't collide with concrete

  // 1. Generate Flow Lines (Streamlines)
  const flowLines: FlowLineGeometry[] = [];
  const nf = Math.max(1, Math.min(10, flowChannels));

  for (let i = 0; i < nf; i++) {
    // Distribute streamlines evenly across the permeable depth
    const t = (i + 0.65) / (nf + 0.3);
    const psi = psiMin + t * (psiMax - psiMin);

    const points: Point2D[] = [];
    const samples = 80;

    // Flow travels from upstream (phi -> pi) to downstream (phi -> 0)
    //phi from 0.04 * pi up to 0.96 * pi
    for (let s = samples; s >= 0; s--) {
      const u = s / samples; // 1 (upstream) to 0 (downstream)
      // Angle phi from near pi (upstream) to near 0 (downstream)
      const phi = (0.05 + 0.90 * u) * Math.PI;

      // Confocal coordinates
      // x = damCenterX - halfDamWidth * cosh(psi) * cos(phi)
      // When phi ~ pi, cos(phi) ~ -1, so x = damCenterX - ... < damLeftX (upstream)
      // When phi ~ 0, cos(phi) ~ 1, so x = damCenterX + ... > damRightX (downstream)
      let x = damCenterX - halfDamWidth * Math.cosh(psi) * Math.cos(phi);
      let y = groundY + halfDamWidth * Math.sinh(psi) * Math.sin(phi);

      // Clamp y so it doesn't exceed the bedrock boundary
      y = Math.min(bedrockY - 3, Math.max(groundY + 2, y));

      points.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }

    // Build SVG path string (smooth curve)
    const pathString = pointsToSvgPath(points);

    flowLines.push({
      id: i + 1,
      pathString,
      points,
      channelIndex: i,
    });
  }

  // 2. Generate Equipotential Lines (Perpendicular to Flow Lines)
  const equipotentialLines: EquipotentialLineGeometry[] = [];
  const nd = Math.max(2, Math.min(20, potentialDrops));
  const totalHeadLoss = upstreamHead - downstreamHead;
  const deltaH = totalHeadLoss / nd;

  // We have nd potential drops, which corresponds to (nd - 1) interior lines
  for (let j = 1; j < nd; j++) {
    // Progress fraction from upstream (0) to downstream (1)
    const progress = j / nd;
    // phi goes from near pi (upstream) down to near 0 (downstream)
    const phi = (1 - progress) * Math.PI;
    const headValue = upstreamHead - j * deltaH;

    const points: Point2D[] = [];
    const samples = 35;

    // Sweeping along psi from near dam base (psiMin) down to bedrock (psiMax)
    for (let s = 0; s <= samples; s++) {
      const v = s / samples;
      const psi = psiMin * 0.8 + v * (psiMax * 1.05 - psiMin * 0.8);

      let x = damCenterX - halfDamWidth * Math.cosh(psi) * Math.cos(phi);
      let y = groundY + halfDamWidth * Math.sinh(psi) * Math.sin(phi);

      // Bound to soil region
      y = Math.min(bedrockY - 2, Math.max(groundY + 1, y));

      points.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }

    const pathString = pointsToSvgPath(points);
    // Position head label near the middle-upper part of the line
    const labelIdx = Math.min(points.length - 1, Math.floor(points.length * 0.45));
    const labelPosition = points[labelIdx] || { x: 450, y: 300 };

    equipotentialLines.push({
      id: j,
      headValue,
      pathString,
      points,
      labelPosition,
    });
  }

  return {
    flowLines,
    equipotentialLines,
    damPolygon,
    soilRect,
    impermeableBaseY: bedrockY,
    upstreamWaterRect,
    downstreamWaterRect,
    upstreamWaterPolygon,
    downstreamWaterPolygon,
    upstreamSurface,
    downstreamSurface,
  };
}

/**
 * Converts an array of Point2D into a smooth SVG bezier/cardinal path string.
 */
function pointsToSvgPath(points: Point2D[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    // Simple line segments with high point density give high precision without spline artifacts
    d += ` L ${points[i].x} ${points[i].y}`;
  }

  return d;
}
