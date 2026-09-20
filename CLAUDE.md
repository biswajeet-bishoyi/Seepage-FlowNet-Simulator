# CLAUDE.md — Flow Net Simulator Implementation Guide

**Project:** Interactive Web-Based Seepage Flow Net Simulator  
**Purpose:** Guide for Claude or future developers implementing the Flow Net Simulator  
**Domain:** Civil Engineering / Soil Mechanics  
**Version:** 1.0  
**Date:** September 2026

---

## 1. Project Overview

The Flow Net Simulator is an interactive web-based educational tool for visualizing groundwater seepage beneath a dam through permeable soil. Users adjust parameters (upstream/downstream water levels, hydraulic conductivity, flow channels, potential drops) and see real-time updates to:

- Visual flow net (flow lines and equipotential lines)
- Engineering calculations (seepage discharge, head loss, hydraulic gradient)
- Educational explanations

The application must feel like a **professional civil engineering simulator**, not a generic dashboard. It should be useful for classroom demonstrations, laboratory presentations, student learning, and viva explanations.

---

## 2. Engineering Context & Domain Knowledge

### 2.1 What Is a Flow Net?
A flow net is a graphical method for analyzing steady-state seepage through soil. It consists of:
- **Flow lines:** Curves showing the path water particles follow during seepage (tangent to the seepage velocity vector)
- **Equipotential lines:** Curves connecting points of equal total hydraulic head (perpendicular to flow lines)

The two sets of lines together form an approximately orthogonal curvilinear grid ("squares"). This grid helps visualize seepage patterns and calculate discharge without solving complex differential equations.

### 2.2 Physical Setup (Dam on Permeable Soil)
```
    UPSTREAM              DOWNSTREAM  
   Water level            Water level  
       h₁ = 20 m              h₂ = 14 m
       ~~~~~                    ~~~~  
       |~~~~|                   |~~~|  
       |~~~~|      DAM          |~~~|  
       |____|___________________!___!
       ┌─────────────────────────────┐
       │                             │
       │   PERMEABLE SOIL/SAND       │  Layer thickness: variable (e.g., 10 m)
       │                             │
       └─────────────────────────────┘
       ═══════════════════════════════
          IMPERMEABLE BASE
```

Water seeps from upstream (higher head) to downstream (lower head) through the permeable soil. The dam blocks surface flow but not subsurface flow.

### 2.3 Core Equations

**Seepage Discharge (Terzaghi's Formula for Flow Nets):**
```
q = k × H × (Nf / Nd)

where:
  q  = seepage discharge per unit width [m³/s per meter]
  k  = hydraulic conductivity [m/s]
  H  = total head loss [m]
  Nf = number of flow channels [dimensionless]
  Nd = number of potential drops [dimensionless]
```

**Head Loss Distribution:**
```
H = h₁ - h₂  (total)
Δh = H / Nd  (per drop)
```

**Darcy's Law (underlying principle):**
```
v = k × i

where:
  v = seepage velocity [m/s]
  k = hydraulic conductivity [m/s]
  i = hydraulic gradient [dimensionless]
```

### 2.4 Why Flow and Equipotential Lines Are Perpendicular
- Seepage velocity is proportional to hydraulic gradient: **v ∝ ∇h**
- The gradient vector points in the direction of decreasing head
- Equipotential lines are perpendicular to the gradient
- Flow lines (velocity direction) are therefore perpendicular to equipotential lines
- This is a consequence of Darcy's law, not a design choice

### 2.5 Important Simplifications (MVP)
- **Not solving Laplace's equation:** We use a parametric/constructed flow-net representation, not a full numerical PDE solver
- **Hydraulic head ≈ water surface elevation:** In reality, head = elevation + pressure/ρg, but at water surfaces (atmospheric pressure), head = elevation
- **Homogeneous, isotropic soil:** Same permeability everywhere, in all directions (future versions can relax)
- **Steady-state seepage:** Flow rates and head distribution do not change with time
- **Linear Darcy flow:** Valid for typical sand/silt; breaks down for clay or very high gradients

**Document these assumptions visibly in the UI (e.g., in the educational panel) so users know what the simulator does and does not represent.**

---

## 3. Core Engineering Equations

### 3.1 Calculation Module (src/lib/calculations.ts)

This is the **single source of truth** for all engineering calculations. All UI components must delegate to this module.

```typescript
// Core calculations

export function calculateTotalHeadLoss(
  upstreamHead: number,
  downstreamHead: number
): number {
  return upstreamHead - downstreamHead;
}

export function calculateHeadPerDrop(
  totalHeadLoss: number,
  potentialDrops: number
): number {
  if (potentialDrops <= 0) return 0;
  return totalHeadLoss / potentialDrops;
}

export function calculateSeepageDischarge(
  hydraulicConductivity: number,
  totalHeadLoss: number,
  flowChannels: number,
  potentialDrops: number
): number {
  // q = k × H × (Nf / Nd)
  if (hydraulicConductivity <= 0 || totalHeadLoss <= 0 || 
      flowChannels <= 0 || potentialDrops <= 0) {
    return 0;
  }
  return hydraulicConductivity * totalHeadLoss * (flowChannels / potentialDrops);
}

export function calculateDischargePerChannel(
  totalDischarge: number,
  flowChannels: number
): number {
  if (flowChannels <= 0) return 0;
  return totalDischarge / flowChannels;
}

export function calculateHydraulicGradient(
  headPerDrop: number,
  flowDistance: number = 10 // approximate, in meters
): number {
  // i = Δh / L; L is approximate flow path length (use 10m as reasonable estimate)
  if (flowDistance <= 0) return 0;
  return headPerDrop / flowDistance;
}
```

### 3.2 Validation & Error Handling

```typescript
// Validation module (src/lib/validation.ts)

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateParameters(params: SimulationParameters): ValidationResult {
  const errors: string[] = [];

  // Head constraints
  if (params.upstreamHead <= params.downstreamHead) {
    errors.push("Upstream head must be greater than downstream head");
  }
  if (params.upstreamHead < 0 || params.downstreamHead < 0) {
    errors.push("Head values must be non-negative");
  }
  if (params.upstreamHead > 100 || params.downstreamHead > 100) {
    errors.push("Head values must not exceed 100 m");
  }

  // Conductivity constraints
  if (params.hydraulicConductivity <= 0) {
    errors.push("Hydraulic conductivity must be positive (k > 0)");
  }
  if (params.hydraulicConductivity > 1) {
    errors.push("Hydraulic conductivity must not exceed 1 m/s");
  }

  // Flow channel constraints
  if (!Number.isInteger(params.flowChannels) || params.flowChannels < 1) {
    errors.push("Flow channels must be an integer ≥ 1");
  }
  if (params.flowChannels > 10) {
    errors.push("Flow channels must not exceed 10");
  }

  // Potential drop constraints
  if (!Number.isInteger(params.potentialDrops) || params.potentialDrops < 2) {
    errors.push("Potential drops must be an integer ≥ 2");
  }
  if (params.potentialDrops > 20) {
    errors.push("Potential drops must not exceed 20");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function getSafeCalculatedValues(
  params: SimulationParameters
): CalculatedValues {
  const validation = validateParameters(params);
  
  if (!validation.isValid) {
    return {
      totalHeadLoss: 0,
      headPerDrop: 0,
      seepageDischarge: 0,
      dischargePerChannel: 0,
      hydraulicGradient: 0,
      isValid: false,
      errors: validation.errors
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
    errors: []
  };
}
```

### 3.3 Unit Consistency Rules
- **Always store values in SI units internally:** meters, m/s, m³/s
- **Display values with explicit units in the UI**
- **Never silently convert units** — if a value is in m/s, label it; if converting to cm/s, do it explicitly
- **Use constants for unit conversions:**
  ```typescript
  export const UNITS = {
    HEAD: 'm',
    CONDUCTIVITY: 'm/s',
    DISCHARGE_PER_WIDTH: 'm³/s per m',
    GRADIENT: 'dimensionless'
  } as const;
  ```

---

## 4. Important Domain Terminology

| Term | Definition | Context |
|------|-----------|---------|
| **Hydraulic Head** | Sum of elevation head and pressure head; measure of total mechanical energy per unit weight of water | At water surface: head ≈ elevation (pressure = 0 gauge) |
| **Total Head Loss (H)** | Difference in hydraulic head between upstream and downstream | Driving force for seepage |
| **Hydraulic Conductivity (k)** | Rate at which water flows through soil under unit hydraulic gradient | Material property; depends on soil grain size, porosity, and fluid properties |
| **Seepage Discharge (q)** | Volume of water flowing through soil per unit time per unit width | Key design parameter; affects piping, stability, etc. |
| **Flow Line** | Curve tangent to the seepage velocity vector at each point | Path of a water particle; originates at upstream, terminates at downstream |
| **Equipotential Line** | Curve connecting points of equal hydraulic head | Perpendicular to flow lines; used to visualize head distribution |
| **Flow Channel** | Region between two adjacent flow lines | All channels carry approximately equal discharge (q / Nf) |
| **Potential Drop** | Region between two adjacent equipotential lines | Represents equal head loss (H / Nd) |
| **Hydraulic Gradient (i)** | Rate of change of hydraulic head with distance; i = Δh / Δl | Directly affects seepage velocity via Darcy's law |
| **Curvilinear Squares** | The approximate "squares" formed by the orthogonal grid of flow and equipotential lines | Used to verify accuracy of hand-drawn flow nets |
| **Darcy's Law** | v = k × i; seepage velocity is proportional to conductivity and gradient | Fundamental equation; assumes laminar flow and linear relationship |

---

## 5. Architecture Rules

### 5.1 Separation of Concerns
**Principle:** Calculations, rendering, state management, and UI are separate.

- **`src/lib/calculations.ts`** — Pure functions; no React, no state, no side effects
- **`src/lib/validation.ts`** — Input validation; no React
- **`src/lib/flowNetGeometry.ts`** — Curve generation; no React
- **`src/hooks/useSimulation.ts`** — State management; React hooks
- **`src/components/`** — UI rendering; consume hooks and props

**Rule:** Never put calculations inside components. If you find yourself doing math in a `.tsx` file, move it to `lib/`.

### 5.2 Unidirectional Data Flow
```
User Input (UI) 
    ↓
updateParameter() action
    ↓
Update state (SimulationState)
    ↓
Derived calculations (via useCalculations hook)
    ↓
Re-render components with new props
    ↓
Visual/calculation output updated
```

**Rule:** State flows down, events flow up. No circular dependencies or bidirectional state sync.

### 5.3 TypeScript as Documentation
Use strict TypeScript. Interfaces document expected data shapes and function contracts.

```typescript
// Good: intent is clear
interface SimulationParameters {
  upstreamHead: number;        // meters
  downstreamHead: number;      // meters
  hydraulicConductivity: number; // m/s
  flowChannels: number;        // count
  potentialDrops: number;      // count
}

// Bad: unclear what units are
interface Params {
  h1: number;
  h2: number;
  k: number;
  nf: number;
  nd: number;
}
```

### 5.4 No Magic Numbers
All constants should live in `src/lib/constants.ts`:

```typescript
export const DEFAULTS = {
  UPSTREAM_HEAD: 20,
  DOWNSTREAM_HEAD: 14,
  HYDRAULIC_CONDUCTIVITY: 0.01,
  FLOW_CHANNELS: 4,
  POTENTIAL_DROPS: 8
} as const;

export const RANGES = {
  UPSTREAM_HEAD: { min: 10, max: 30 },
  DOWNSTREAM_HEAD: { min: 0, max: 25 },
  HYDRAULIC_CONDUCTIVITY: { min: 0.001, max: 0.1 },
  FLOW_CHANNELS: { min: 1, max: 10 },
  POTENTIAL_DROPS: { min: 2, max: 20 }
} as const;

export const CANVAS_DIMENSIONS = {
  WIDTH: 800,
  HEIGHT: 500
} as const;

export const COLORS = {
  FLOW_LINE: '#1E90FF',
  EQUIPOTENTIAL_LINE: '#20B2AA',
  DAM: '#404040',
  SOIL: '#F5DEB3',
  WATER: '#87CEEB'
} as const;
```

**Rule:** If a value appears more than once, it's a constant. If you hardcode a value and later need to change it, you've violated this rule.

### 5.5 SVG for Primary Visualization
Use SVG (not Canvas) for the main flow-net visualization because:
- Semantic and scalable
- Easy to manipulate (add/remove elements, attach event listeners)
- Text labels integrate naturally
- Responsive without rasterization

Canvas can be used for particle animation overlay if performance becomes an issue.

---

## 6. Coding Conventions

### 6.1 Naming
- **Components:** PascalCase (`FlowNetSimulator`, `ParameterControls`)
- **Functions:** camelCase (`calculateSeepageDischarge`, `handleSliderChange`)
- **Variables/Constants:** camelCase for variables, UPPER_SNAKE_CASE for constants
- **Types/Interfaces:** PascalCase (`SimulationParameters`, `CalculatedValues`)
- **Boolean variables:** Start with `is`, `has`, `should` (`isRunning`, `hasError`)

### 6.2 File Organization
```
src/
├── lib/
│   ├── calculations.ts       # Pure calculation functions
│   ├── validation.ts         # Input validation
│   ├── flowNetGeometry.ts    # Flow line / equipotential generation
│   ├── constants.ts          # All constants
│   ├── types.ts              # Shared TypeScript types
│   └── formatting.ts         # Number formatting utilities
├── hooks/
│   ├── useSimulation.ts      # Main state hook
│   ├── useCalculations.ts    # Derived calculations hook
│   ├── useAnimation.ts       # Particle animation
│   └── useResponsive.ts      # Responsive utilities
├── components/
│   ├── FlowNetSimulator.tsx  # Main container
│   ├── SimulationCanvas.tsx  # SVG visualization
│   ├── ParameterControls.tsx # Parameter inputs
│   ├── CalculationPanel.tsx  # Results display
│   ├── EducationalPanel.tsx  # Educational content
│   ├── Legend.tsx            # Legend
│   └── ui/                   # Reusable UI components
│       ├── Slider.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Accordion.tsx
└── context/
    ├── SimulationContext.tsx
    └── useSimulationContext.ts
```

### 6.3 Commenting Guidelines
- **Why, not what:** Comment explains intent, not what the code does
- **Keep comments up-to-date:** Stale comments are worse than no comments
- **Use for non-obvious logic only:** Simple code doesn't need comments
- **Engineering formulas:** Always include the formula and units

```typescript
// Good comment: explains intent and formula
export function calculateSeepageDischarge(k: number, H: number, Nf: number, Nd: number): number {
  // q = k × H × (Nf / Nd)
  // where: k = hydraulic conductivity (m/s), H = total head loss (m)
  //        Nf = flow channels, Nd = potential drops
  // Units: k(m/s) × H(m) × dimensionless = m³/s per meter of width
  if (k <= 0 || H <= 0 || Nf <= 0 || Nd <= 0) return 0;
  return k * H * (Nf / Nd);
}

// Bad comment: states the obvious
export function calculateSeepageDischarge(k: number, H: number, Nf: number, Nd: number): number {
  // multiply k times H times Nf divided by Nd
  return k * H * (Nf / Nd);
}
```

### 6.4 Error Handling
- **Never silently fail:** If something goes wrong, propagate an error or return a safe default
- **Validate early:** Check inputs at the boundary (components or API calls)
- **Use Result/Option patterns where appropriate:**
  ```typescript
  // Instead of returning NaN or null implicitly:
  export function calculateHeadPerDrop(H: number, Nd: number): number | null {
    if (Nd <= 0) return null;
    return H / Nd;
  }
  
  // Or use Result type:
  export function calculateHeadPerDrop(H: number, Nd: number): Result<number> {
    if (Nd <= 0) return { ok: false, error: "Nd must be > 0" };
    return { ok: true, value: H / Nd };
  }
  ```

---

## 7. Component Conventions

### 7.1 Component Structure
Every component should have this structure:

```typescript
import React from 'react';
import { useSimulationContext } from '@/hooks/useSimulationContext';
import { COLORS } from '@/lib/constants';
import './ComponentName.css'; // or use Tailwind

interface ComponentNameProps {
  // Props documented with comments
  /* @param title - Display title */
  title?: string;
  /* @param onClose - Callback when closed */
  onClose?: () => void;
}

/**
 * ComponentName
 * Brief description of what this component does and why.
 * 
 * Example:
 * <ComponentName title="Results" onClose={() => {}} />
 */
export function ComponentName({ title = 'Default', onClose }: ComponentNameProps) {
  const { state, dispatch } = useSimulationContext();

  const handleClick = () => {
    // Logic here
  };

  return (
    <div className="component-name">
      <h2>{title}</h2>
      {/* Component content */}
    </div>
  );
}

export default ComponentName;
```

### 7.2 Props Best Practices
- **Make props explicit:** Don't spread unknown props (`...rest`) unless intentional
- **Document props:** Use JSDoc or TypeScript comments
- **Avoid prop drilling:** If passing props through 3+ levels, use Context
- **Keep components pure:** Same props should always produce the same output

### 7.3 Hooks Best Practices
- **Use hooks, not class components:** Modern React uses functional components
- **One responsibility per hook:** Don't create a "kitchen sink" hook
- **Name custom hooks with `use` prefix:** `useSimulation`, `useCalculations`, `useAnimation`
- **Extract logic from components:** If a component does too much, create a custom hook

```typescript
// Example: useSimulation custom hook
export function useSimulation() {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  const updateParameter = (name: string, value: number) => {
    dispatch({ type: 'UPDATE_PARAMETER', payload: { name, value } });
  };

  const resetSimulation = () => {
    dispatch({ type: 'RESET' });
  };

  return { state, updateParameter, resetSimulation };
}

// Used in a component:
export function ParameterControls() {
  const { state, updateParameter } = useSimulation();
  // ...
}
```

---

## 8. State Management Rules

### 8.1 State Shape
Keep state flat and normalized. Avoid deeply nested structures.

```typescript
// Good: flat state, easy to update
interface SimulationState {
  parameters: SimulationParameters;
  visibility: VisibilityState;
  animation: AnimationState;
  error: ErrorState;
}

// Avoid: deeply nested, hard to update
interface SimulationState {
  simulation: {
    parameters: {
      hydro: {
        upstream: { value: number; unit: string };
        downstream: { value: number; unit: string };
      };
    };
  };
}
```

### 8.2 Actions & Reducers
Define actions clearly. Use discriminated unions (tagged unions) for type safety.

```typescript
type SimulationAction =
  | { type: 'UPDATE_PARAMETER'; payload: { name: keyof SimulationParameters; value: number } }
  | { type: 'TOGGLE_VISIBILITY'; payload: { layer: keyof VisibilityState } }
  | { type: 'PLAY_ANIMATION' }
  | { type: 'PAUSE_ANIMATION' }
  | { type: 'RESET' };

function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'UPDATE_PARAMETER':
      return {
        ...state,
        parameters: {
          ...state.parameters,
          [action.payload.name]: action.payload.value
        }
      };
    case 'TOGGLE_VISIBILITY':
      return {
        ...state,
        visibility: {
          ...state.visibility,
          [action.payload.layer]: !state.visibility[action.payload.layer]
        }
      };
    case 'PLAY_ANIMATION':
      return { ...state, animation: { ...state.animation, isRunning: true } };
    case 'PAUSE_ANIMATION':
      return { ...state, animation: { ...state.animation, isRunning: false } };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
```

### 8.3 Context vs. Props
- **Use Context for:** Global simulation state, theme settings, locale
- **Use Props for:** Component-specific configuration, event callbacks
- **Rule of thumb:** If more than 3 levels of prop drilling, use Context

---

## 9. Simulation Engine Rules

### 9.1 Flow-Net Geometry Generation
The simulator uses a **parametric flow-net representation**, not a full numerical solver (MVP phase).

```typescript
// src/lib/flowNetGeometry.ts

export interface FlowNetGeometry {
  flowLines: Path2D[];        // Array of Path2D objects or SVG path strings
  equipotentialLines: Path2D[];
  flowLinePoints: Point[][];  // For animation reference
  equipotentialPoints: Point[][];
}

export function generateFlowNetGeometry(
  parameters: SimulationParameters,
  canvasWidth: number,
  canvasHeight: number
): FlowNetGeometry {
  // Pseudo-algorithm:
  // 1. Create Nf evenly-spaced flow lines from upstream to downstream
  // 2. Create Nd equipotential lines between upstream and downstream heads
  // 3. Interpolate smooth curves using Bezier or B-splines
  // 4. Apply dam boundary constraint (flow lines tangent to dam)
  // 5. Return geometry objects suitable for SVG or Canvas rendering
  
  // For MVP: Simple linear interpolation with slight curvature
  // Future: Use D3.js splines or numerical solver
}

export function generateFlowLinesPath(
  flowCount: number,
  canvasWidth: number,
  canvasHeight: number
): string[] {
  // Generate SVG path strings for Nf flow lines
  // Curves start at upstream, end at downstream
  // Spacing reflects flow-channel distribution
}

export function generateEquipotentialLinesPath(
  equipotentialCount: number,
  headLoss: number,
  startHead: number,
  canvasWidth: number,
  canvasHeight: number
): string[] {
  // Generate SVG path strings for Nd equipotential lines
  // Lines are perpendicular to flow lines (approximately)
  // Each line represents head drop of headLoss / equipotentialCount
}
```

### 9.2 Boundary Conditions
The simulation enforces:
- **Upstream boundary:** Equipotential (constant head h₁)
- **Downstream boundary:** Equipotential (constant head h₂)
- **Dam surface:** Impermeable; flow tangent to surface (no normal flow)
- **Soil base:** Impermeable; flow tangent to surface (no normal flow)

**Implementation:** Flow lines curve to follow dam/base boundaries; equipotential lines are perpendicular to flow boundaries.

### 9.3 Important Notes on Approximations
**Document prominently:**
- Flow-net curves are **parametrically generated**, not solved from Laplace's equation
- Orthogonality between flow and equipotential lines is **approximate**
- For exact solutions, a numerical solver (FEM/FDM) is required
- This visualization is **accurate for educational purposes** and demonstrates seepage concepts correctly
- **Real design work** should use professional groundwater modeling software

---

## 10. Visualization Rules

### 10.1 SVG Rendering Best Practices
- **Use SVG groups (`<g>`) for layering:** flow lines, equipotential lines, labels, etc.
- **Apply CSS classes for styling:** opacity, stroke-width, dasharray
- **Use viewBox for responsiveness:** `<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">`
- **Avoid inline styles:** Use CSS or Tailwind classes instead
- **Performance:** For large numbers of elements, use Canvas or optimize SVG rendering

Example SVG structure:
```tsx
<svg viewBox="0 0 800 500" className="w-full h-auto">
  {/* Background */}
  <rect width="800" height="500" fill="#FFFFFF" />
  
  {/* Soil and water bodies */}
  <g id="soil-water-layer">
    <rect x="0" y="250" width="800" height="250" fill="#F5DEB3" />
    <rect x="0" y="0" width="200" height="200" fill="#87CEEB" opacity="0.3" />
    <rect x="600" y="100" width="200" height="100" fill="#87CEEB" opacity="0.3" />
  </g>
  
  {/* Dam */}
  <g id="dam">
    <polygon points="300,200 500,200 450,250 350,250" fill="#404040" />
  </g>
  
  {/* Flow lines */}
  <g id="flow-lines">
    {flowLines.map((path, i) => (
      <path key={i} d={path} stroke="#1E90FF" strokeWidth="2" fill="none" />
    ))}
  </g>
  
  {/* Equipotential lines */}
  <g id="equipotential-lines">
    {equipotentialLines.map((path, i) => (
      <path key={i} d={path} stroke="#20B2AA" strokeWidth="2" strokeDasharray="5,5" fill="none" />
    ))}
  </g>
  
  {/* Labels */}
  <g id="labels">
    <text x="100" y="50" fontSize="14" fill="#202124">h₁ = 20 m</text>
    <text x="650" y="150" fontSize="14" fill="#202124">h₂ = 14 m</text>
  </g>
</svg>
```

### 10.2 Color & Visual Hierarchy
- **Primary:** Simulation canvas (largest, centered)
- **Secondary:** Flow and equipotential lines (clear, distinct colors)
- **Tertiary:** Labels, legend, annotations (supporting info)
- **Background:** Grid or scale (very subtle, low opacity)

Use the color palette from PRD:
- Flow lines: `#1E90FF` (royal blue)
- Equipotential lines: `#20B2AA` (light sea green, dashed)
- Dam: `#404040` (dark gray)
- Soil: `#F5DEB3` (wheat/beige)
- Water: `#87CEEB` (sky blue, semi-transparent)

### 10.3 Responsive Canvas
Canvas dimensions scale based on container:
```typescript
const containerRef = useRef<HTMLDivElement>(null);
const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });

useEffect(() => {
  const observer = new ResizeObserver(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setCanvasSize({ width, height: height || 500 });
    }
  });
  observer.observe(containerRef.current!);
  return () => observer.disconnect();
}, []);
```

---

## 11. UI/UX Rules

### 11.1 Input Validation & Error Display
- **Validate on blur, not on keystroke** (to avoid annoying users)
- **Show errors inline** below the input field
- **Highlight invalid fields** with red border
- **Do not block submission** on validation errors in MVP (just warn)
- **Error message format:** "Field name: specific problem"

```typescript
function ValidationError({ error }: { error: string | null }) {
  if (!error) return null;
  return <p className="text-red-600 text-sm mt-1">{error}</p>;
}

// Usage:
<input
  type="number"
  value={upstream}
  onBlur={() => validateInput()}
  className={error ? 'border-red-600' : 'border-gray-300'}
  aria-invalid={!!error}
/>
<ValidationError error={error} />
```

### 11.2 Real-Time Updates
- **Debounce slider input:** 50 ms to avoid excessive re-renders
- **Update calculations immediately** (not debounced)
- **Update visualization immediately** (lazy SVG generation if needed)
- **Provide visual feedback:** Spinner or opacity change during heavy computation

```typescript
const [upstream, setUpstream] = useState(20);

const handleSliderChange = useMemo(
  () => debounce((value: number) => {
    // This callback is called at most once every 50ms
    updateParameter('upstreamHead', value);
  }, 50),
  []
);

return (
  <input
    type="range"
    value={upstream}
    onChange={(e) => {
      setUpstream(+e.target.value); // immediate local state for smooth UI
      handleSliderChange(+e.target.value); // debounced parent update
    }}
  />
);
```

### 11.3 Accessibility Rules
- **Keyboard-accessible:** All controls must work with Tab, Enter, Space, Arrows
- **Focus visible:** Outline on focused element (use `outline: 2px solid #1E90FF`)
- **No color-only encoding:** Use text labels, icons, or patterns in addition to color
- **Semantic HTML:** Use `<label>`, `<button>`, `<input>`, `<fieldset>` correctly
- **ARIA roles:** For custom components, use appropriate ARIA attributes
- **Screen reader friendly:** Descriptive labels, form field associations

```tsx
// Good: semantic, accessible
<div className="control-group">
  <label htmlFor="upstream-slider">Upstream Head (m)</label>
  <input
    id="upstream-slider"
    type="range"
    min="10"
    max="30"
    aria-describedby="upstream-help"
  />
  <small id="upstream-help">Water elevation on upstream side (10–30 m)</small>
</div>

// Avoid: unclear, not accessible
<input type="range" />
```

### 11.4 Mobile-First Design
- **Layout:** Mobile first, then enhance for larger screens
- **Touch targets:** Minimum 48px × 48px
- **Spacing:** Generous padding on mobile
- **Stacking:** Stack controls vertically on mobile, use side-by-side on desktop
- **Readability:** Larger fonts on mobile, more whitespace

---

## 12. Accessibility Rules

### 12.1 WCAG 2.1 AA Compliance (Best Effort)
- **Color contrast:** Text 4.5:1 for normal text, 3:1 for large text
- **Focus indicators:** Visible outline or highlight
- **Keyboard navigation:** All controls reachable via keyboard
- **Form labels:** Every input has associated `<label>`
- **Semantic HTML:** Use correct tags (`<button>`, not `<div>` styled as button)
- **Error messages:** Clear, not just red highlighting
- **Alternative text:** SVG elements have `<title>` and `<desc>`

### 12.2 Screen Reader Support
- Use ARIA labels for SVG: `<title>Flow line 1</title>`, `<desc>Seepage path from upstream to downstream</desc>`
- Use `aria-label` for interactive SVG elements
- Use `aria-describedby` to link inputs to help text
- Avoid empty links or buttons (always have text content or aria-label)

### 12.3 Testing Accessibility
- Manual testing: Tab through all controls, verify order is logical
- Screen reader: Test with NVDA (Windows), VoiceOver (Mac), or browser DevTools
- Color contrast: Use browser DevTools or online tools (WebAIM)
- No automated tool catches all issues; manual review is essential

---

## 13. Validation Rules

### 13.1 Input Constraints (from PRD)
Create a validation schema:
```typescript
export const VALIDATION_SCHEMA = {
  upstreamHead: { min: 10, max: 30, constraint: 'h1 > h2' },
  downstreamHead: { min: 0, max: 25, constraint: 'h2 < h1' },
  hydraulicConductivity: { min: 0.001, max: 0.1, constraint: 'k > 0' },
  flowChannels: { min: 1, max: 10, type: 'integer' },
  potentialDrops: { min: 2, max: 20, type: 'integer' }
} as const;
```

### 13.2 Never Allow Invalid States
```typescript
export function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function ensureInteger(value: number): number {
  return Math.round(value);
}

// Use these in form submission or on blur:
const validUpstream = clampValue(inputValue, 10, 30);
const validNf = ensureInteger(clampValue(inputValue, 1, 10));
```

### 13.3 Error Messages (User-Friendly)
```typescript
export const ERROR_MESSAGES = {
  UPSTREAM_GT_DOWNSTREAM: "Upstream head must be greater than downstream head",
  K_MUST_BE_POSITIVE: "Hydraulic conductivity must be positive (k > 0)",
  NF_MUST_BE_INTEGER: "Flow channels must be a whole number",
  ND_MUST_BE_AT_LEAST_TWO: "Potential drops must be at least 2",
  // ... etc
} as const;
```

---

## 14. Testing Rules

### 14.1 Unit Tests (Calculation Functions)
Test every calculation function in `src/lib/calculations.ts`:

```typescript
// calculations.test.ts
import { calculateSeepageDischarge, calculateTotalHeadLoss } from '@/lib/calculations';

describe('calculateTotalHeadLoss', () => {
  it('should calculate total head loss correctly', () => {
    expect(calculateTotalHeadLoss(20, 14)).toBe(6);
    expect(calculateTotalHeadLoss(30, 15)).toBe(15);
  });

  it('should return 0 if h1 <= h2', () => {
    expect(calculateTotalHeadLoss(14, 20)).toBe(-6); // or return 0, depending on design
  });
});

describe('calculateSeepageDischarge', () => {
  it('should match default parameters', () => {
    // k=0.01, H=6, Nf=4, Nd=8
    const q = calculateSeepageDischarge(0.01, 6, 4, 8);
    expect(q).toBeCloseTo(0.03, 4); // 4 decimal places
  });

  it('should return 0 if k <= 0', () => {
    expect(calculateSeepageDischarge(0, 6, 4, 8)).toBe(0);
  });

  it('should return 0 if Nd = 0', () => {
    expect(calculateSeepageDischarge(0.01, 6, 4, 0)).toBe(0);
  });
});
```

### 14.2 Component Tests (React Testing Library)
Test user interactions:

```typescript
// ParameterControls.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ParameterControls } from '@/components/ParameterControls';
import { SimulationProvider } from '@/context/SimulationContext';

describe('ParameterControls', () => {
  it('should render all parameter inputs', () => {
    render(
      <SimulationProvider>
        <ParameterControls />
      </SimulationProvider>
    );
    expect(screen.getByLabelText(/upstream head/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/downstream head/i)).toBeInTheDocument();
  });

  it('should update state when slider changes', () => {
    render(
      <SimulationProvider>
        <ParameterControls />
      </SimulationProvider>
    );
    const slider = screen.getByLabelText(/upstream head/i);
    fireEvent.change(slider, { target: { value: '25' } });
    // Assert state was updated (via mock context or assertion on displayed value)
  });

  it('should show error if h1 <= h2', () => {
    render(
      <SimulationProvider>
        <ParameterControls />
      </SimulationProvider>
    );
    // Set downstream > upstream
    // Expect error message to appear
  });
});
```

### 14.3 Test Coverage Goals
- **Calculation functions:** 100%
- **Validation functions:** 100%
- **Components:** ≥80%
- **Overall:** ≥85%

---

## 15. Performance Rules

### 15.1 Rendering Performance
- **Memoize expensive calculations:** Use `useMemo` for derived state
- **Memoize components:** Use `React.memo` for components that don't change often
- **Debounce frequent updates:** Slider input at 50 ms
- **Use CSS transforms for animations:** Not JS-driven DOM changes

```typescript
// Good: memoized calculated values
const calculatedValues = useMemo(
  () => calculateAll(parameters),
  [parameters.upstreamHead, parameters.downstreamHead, ...]
);

// Good: memoized component
const Legend = React.memo(function Legend({ items }) {
  return <div>{/* render legend */}</div>;
});
```

### 15.2 SVG Rendering Optimization
- **Group elements with `<g>` tags** for efficient hiding/showing
- **Use CSS classes** instead of inline styles
- **Limit number of elements:** For very large Nf/Nd, consider Canvas
- **Lazy-load:** Only render visible elements (virtualization for long lists)

### 15.3 Animation Performance
- **Use `requestAnimationFrame`** for smooth 60 FPS animations
- **Avoid layout thrashing:** Batch DOM reads and writes
- **Use Canvas for particles:** SVG is too slow for thousands of moving elements

```typescript
function useAnimationFrame(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastTimeRef.current;
      callback(deltaTime);
      lastTimeRef.current = now;
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [callback]);
}
```

---

## 16. What NOT to Do

### 16.1 Calculation Errors
- ❌ **Do NOT** hardcode equations in components
- ❌ **Do NOT** mix units silently (e.g., storing km but displaying m)
- ❌ **Do NOT** return NaN or Infinity without handling
- ❌ **Do NOT** forget to validate inputs before calculating

### 16.2 State Management Errors
- ❌ **Do NOT** mutate state directly (use spreads or Immer)
- ❌ **Do NOT** create circular state dependencies
- ❌ **Do NOT** store calculated values in state (derive them instead)
- ❌ **Do NOT** prop-drill more than 3 levels (use Context)

### 16.3 UI/UX Errors
- ❌ **Do NOT** validate input on every keystroke (use debounce or blur)
- ❌ **Do NOT** use color alone to convey information
- ❌ **Do NOT** disable buttons without explanation
- ❌ **Do NOT** show NaN, Infinity, or undefined in the UI
- ❌ **Do NOT** auto-play animations without user control
- ❌ **Do NOT** hide important information behind clicks (show defaults)

### 16.4 Accessibility Errors
- ❌ **Do NOT** forget `<label>` tags on inputs
- ❌ **Do NOT** use `<div>` styled as a button (use `<button>`)
- ❌ **Do NOT** rely on color alone (use text, icons, or patterns)
- ❌ **Do NOT** skip focus indicators
- ❌ **Do NOT** use generic link text like "Click here"

### 16.5 Architecture Errors
- ❌ **Do NOT** put business logic in components
- ❌ **Do NOT** export default from utility files (use named exports)
- ❌ **Do NOT** hardcode constants in component files
- ❌ **Do NOT** use `any` type in TypeScript (use specific types or generics)

---

## 17. Definition of Done

A feature is "done" when:

1. **Code Quality**
   - [ ] TypeScript strict mode passes
   - [ ] ESLint and Prettier pass
   - [ ] No `// @ts-ignore` or `any` types without justification

2. **Functionality**
   - [ ] Feature works as specified in PRD
   - [ ] All edge cases handled (invalid inputs, boundary values)
   - [ ] No console errors or warnings

3. **Testing**
   - [ ] Unit tests written and passing (calculations, validation)
   - [ ] Component tests written and passing
   - [ ] Manual testing on desktop, tablet, mobile
   - [ ] Test coverage ≥85%

4. **Performance**
   - [ ] No unnecessary re-renders (checked with React DevTools Profiler)
   - [ ] Animation smooth (≥30 FPS, ideally 60 FPS)
   - [ ] No memory leaks (checked with DevTools)

5. **Accessibility**
   - [ ] Keyboard navigation works (Tab, Enter, Arrows)
   - [ ] Color contrast ≥4.5:1
   - [ ] Screen reader compatible (manual check with NVDA/VoiceOver)
   - [ ] No focus traps

6. **Documentation**
   - [ ] Comments explain "why", not "what"
   - [ ] JSDoc on public functions
   - [ ] Component props documented
   - [ ] README updated if needed

7. **UI/UX**
   - [ ] Responsive on all breakpoints
   - [ ] Visual design matches PRD
   - [ ] Error messages clear and actionable
   - [ ] Loading states and edge cases handled

---

## 18. Development Workflow

### 18.1 Development Environment Setup
```bash
# Install dependencies
npm install

# Start dev server (Vite)
npm run dev

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Lint and format
npm run lint
npm run format
```

### 18.2 Git Workflow
- Create a feature branch: `git checkout -b feature/flow-net-visualization`
- Commit small, logical changes: `git commit -m "feat: add flow line rendering component"`
- Push and create a pull request
- Code review before merge
- Squash commits if history is messy

### 18.3 Development Checklist
Before committing:
1. [ ] All tests pass
2. [ ] Code formatted (Prettier)
3. [ ] Linter passes (ESLint)
4. [ ] TypeScript strict mode passes
5. [ ] Manual testing on desktop and mobile
6. [ ] No console errors or warnings
7. [ ] Comments and documentation updated

---

## 19. Future Extensibility Rules

### 19.1 Plugin Architecture for Calculation Engine
Design the simulator to swap between calculation backends:

```typescript
interface FlowNetEngine {
  calculateAll(parameters: SimulationParameters): CalculatedValues;
  generateGeometry(parameters: SimulationParameters): FlowNetGeometry;
  getAccuracy(): 'approximation' | 'numerical' | 'analytical';
  getDescription(): string;
}

class ParametricEngine implements FlowNetEngine {
  // Current MVP implementation
}

class NumericalEngine implements FlowNetEngine {
  // Future FEM/FDM solver
}

// Usage:
const engine: FlowNetEngine = useSelector(state => state.engine) || new ParametricEngine();
const results = engine.calculateAll(parameters);
```

### 19.2 Future Feature Flags
Design the app to support feature flags for A/B testing or gradual rollouts:

```typescript
const FEATURES = {
  NUMERICAL_SOLVER: process.env.REACT_APP_FEATURE_NUMERICAL_SOLVER === 'true',
  ADVANCED_ANALYSIS: process.env.REACT_APP_FEATURE_ADVANCED_ANALYSIS === 'true',
  EXPORT_TO_PDF: process.env.REACT_APP_FEATURE_EXPORT_PDF === 'true'
} as const;

// In components:
{FEATURES.NUMERICAL_SOLVER && <NumericalSolverPanel />}
```

### 19.3 Extensible Component System
Design components to accept plugins or extensions:

```typescript
interface VisualizationLayer {
  name: string;
  render(context: RenderContext): JSX.Element;
  isVisible: boolean;
}

const layers: VisualizationLayer[] = [
  { name: 'flow-lines', render: renderFlowLines, isVisible: true },
  { name: 'equipotential', render: renderEquipotential, isVisible: true },
  // Future layers can be added without changing core
];

export function SimulationCanvas({ layers }) {
  return (
    <svg>
      {layers.map(layer => layer.isVisible && layer.render(...))}
    </svg>
  );
}
```

---

## 20. Summary: Key Principles

1. **Separate concerns:** Calculations, state, UI are independent
2. **Type safety:** Use TypeScript strictly; avoid `any`
3. **Pure functions:** Calculations have no side effects
4. **Validation everywhere:** Validate inputs at boundaries
5. **Responsive design:** Mobile-first, works on all sizes
6. **Accessible by default:** Keyboard navigation, screen readers, color contrast
7. **Educational:** Explain concepts, not just show numbers
8. **Performance:** Smooth animations, debounced updates, optimized rendering
9. **Testable:** Unit tests for functions, component tests for UI
10. **Maintainable:** Clear naming, documentation, consistent patterns
11. **Extensible:** Architecture supports future numerical solvers and advanced features
12. **Professional:** Clean design, no magic numbers, explicit units

---

## Appendix A: Initial Scenario Verification Checklist

When implementation is complete, verify the default scenario:

**Inputs:**
- [ ] h₁ = 20 m (default upstream slider)
- [ ] h₂ = 14 m (default downstream slider)
- [ ] k = 0.01 m/s (default conductivity slider)
- [ ] Nf = 4 (default flow channels)
- [ ] Nd = 8 (default potential drops)

**Expected Outputs:**
- [ ] H = 6 m ✓
- [ ] Δh = 0.75 m ✓
- [ ] q ≈ 0.03 m³/s per m ✓
- [ ] q_channel = 0.0075 m³/s per m ✓
- [ ] i ≈ 0.075 (approx.) ✓

**Visual Verification:**
- [ ] 4 blue flow lines visible from upstream to downstream
- [ ] 8 dashed teal equipotential lines perpendicular to flow lines
- [ ] Water bodies shown at correct elevations
- [ ] Dam structure clearly visible
- [ ] Soil layer clearly visible
- [ ] All labels and units correct

---

## Appendix B: Common Pitfalls & Solutions

| Pitfall | Solution |
|---------|----------|
| **Calculations hardcoded in components** | Move to `src/lib/calculations.ts`; use pure functions |
| **State deeply nested** | Flatten state; use normalized structure |
| **No validation** | Validate at input boundary; return safe defaults |
| **Units mixed silently** | Always store in SI units; label all outputs |
| **Accessibility ignored** | Use semantic HTML; test with keyboard and screen reader |
| **Performance sluggish** | Profile with DevTools; memoize expensive calcs; debounce updates |
| **Hard to test** | Separate logic from UI; use pure functions; inject dependencies |
| **No error handling** | Never let NaN/Infinity leak to UI; show user-friendly errors |
| **Prop drilling** | Use Context for global state; Props for local config |
| **Complex curves inaccurate** | Use Bezier splines or D3.js; document approximations |

---

**Document Version:** 1.0  
**Last Updated:** September 2026  
**Status:** Ready for Implementation  

**Next Steps for Claude (Implementation Phase):**
1. Set up project structure (Vite + React + TypeScript)
2. Implement `src/lib/calculations.ts` with unit tests
3. Implement `src/lib/flowNetGeometry.ts` for curve generation
4. Create state management (Context + useReducer)
5. Build SVG visualization component
6. Implement parameter controls and validation
7. Build calculation panel and educational content
8. Add animations and responsiveness
9. Final testing and accessibility review

