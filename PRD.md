# Flow Net Simulator — Product Requirements Document

**Project:** Interactive Web-Based Seepage Flow Net Simulator  
**Domain:** Civil Engineering / Soil Mechanics  
**Version:** 1.0  
**Date:** September 2026

---

## 1. Product Overview

The Flow Net Simulator is a professional, interactive web-based educational tool that visualizes and simulates groundwater seepage beneath a dam structure through a permeable soil layer. The application allows students, educators, and civil engineers to explore the mathematical and physical principles of flow nets, hydraulic gradients, and seepage discharge through dynamic visualization and real-time parameter adjustment.

The simulator represents a cross-sectional view of a dam/foundation on permeable soil, showing:
- Water bodies at different upstream and downstream elevations
- An impermeable dam structure
- A permeable soil layer with flowing groundwater
- An impermeable base boundary
- Flow lines (seepage paths)
- Equipotential lines (equal hydraulic head)
- Seepage discharge calculations

---

## 2. Problem Statement

Civil engineering students often struggle to understand flow nets and seepage behavior conceptually. Traditional textbooks use static diagrams, and hand-drawn flow nets are time-consuming and error-prone. Classroom demonstrations require physical models. There is no accessible, interactive, real-time tool that allows students to:

- Visualize seepage paths and equipotential lines simultaneously
- Understand how parameter changes affect seepage discharge
- See the orthogonal curvilinear grid structure of a flow net
- Calculate and verify engineering equations interactively
- Learn why flow and equipotential lines are perpendicular
- Understand head loss distribution along seepage paths

**Solution:** An interactive, responsive, visually professional simulator that makes flow-net concepts tangible and testable in seconds.

---

## 3. Objectives

1. **Educational:** Enable students to visualize and understand flow-net construction, interpretation, and seepage calculations
2. **Interactive:** Provide real-time feedback on parameter changes with instant visualization updates
3. **Professional:** Present a clean, technically accurate interface suitable for classroom, laboratory, and professional contexts
4. **Extensible:** Create a foundation for future numerical seepage solvers and advanced analysis
5. **Accessible:** Work seamlessly across desktop, tablet, and mobile devices
6. **Correct:** Implement civil engineering equations with explicit units and proper validation

---

## 4. Target Users

1. **Undergraduate Civil Engineering Students** — Learning soil mechanics, groundwater flow, and flow-net analysis
2. **Laboratory / Project Presenters** — Using the simulator in reports, presentations, and viva explanations
3. **Educators** — Classroom demonstrations and homework assignments
4. **Graduate Students / Researchers** — Foundation for advanced groundwater analysis
5. **Professional Engineers** — Quick reference tool and teaching aid in consulting or design contexts

---

## 5. Educational Goals

Upon using the simulator, a student should understand:

- **What is a flow net?** A graphical representation of equipotential and flow lines in a seepage region
- **Flow lines:** Show the path water particles follow during seepage (tangent to seepage velocity)
- **Equipotential lines:** Connect points of equal total hydraulic head
- **Flow channels:** Regions between adjacent flow lines; all carry approximately equal discharge
- **Potential drop:** Head loss between adjacent equipotential lines
- **Orthogonality:** Flow and equipotential lines intersect at approximately right angles due to Darcy's law
- **Seepage discharge:** Calculated using q = k × H × (Nf / Nd)
- **Hydraulic head:** Sum of elevation head and pressure head; independent of flow direction
- **Head loss:** Total potential difference driving flow; distributed across potential drops
- **Gradient:** Steeper spacing = higher gradient = higher seepage velocity
- **Physical meaning:** Why flow occurs, how permeability affects seepage, how head difference drives flow

---

## 6. User Stories

### Story 1: Classroom Demonstration
**As a** civil engineering professor  
**I want** to demonstrate how seepage works beneath a dam  
**So that** students can visualize abstract concepts in real-time during a lecture

**Acceptance Criteria:**
- I can adjust upstream and downstream water levels and see the visualization update instantly
- Flow lines and equipotential lines are clearly visible and orthogonal where appropriate
- I can toggle visibility of annotations and educational text
- The display is large enough to see from the back of a classroom (responsive layout)

### Story 2: Laboratory Report Verification
**As a** civil engineering student preparing a report  
**I want** to verify my hand-drawn flow net and seepage calculations  
**So that** I can check my answers and understand discrepancies

**Acceptance Criteria:**
- I can input my Nf, Nd, and k values
- The simulator displays both the visual flow net and calculated seepage discharge
- I can compare my hand-drawn net to the simulated one
- All calculations are shown with units and formulas

### Story 3: Viva / Presentation Explanation
**As a** student in an exam or presentation  
**I want** to quickly explain flow-net concepts using an interactive tool  
**So that** I can demonstrate understanding in real-time

**Acceptance Criteria:**
- I can modify parameters on the fly and immediately show the effect
- The interface is intuitive enough that I don't need to refer to instructions
- Educational explanations are present but not cluttering the main display
- I can pause or resume animations without resetting the simulation

### Story 4: Parameter Exploration
**As a** student learning soil mechanics  
**I want** to experiment with different permeability values and head differences  
**So that** I can understand how each parameter affects seepage

**Acceptance Criteria:**
- I can adjust k, upstream level, downstream level, Nf, and Nd independently
- Changes are reflected immediately in calculations and visualization
- Constraints prevent invalid inputs (e.g., negative k, upstream < downstream)
- I see clear error messages for invalid inputs

---

## 7. Functional Requirements

### 7.1 Simulation Canvas
- **Requirement:** Display a cross-sectional diagram of a dam on permeable soil
- **Details:**
  - Water bodies represented at upstream and downstream elevations
  - Dam/impermeable structure in the middle
  - Permeable soil layer below the dam
  - Impermeable base boundary
  - Scale bar or dimension labels
  - Clear legend identifying all visual elements

### 7.2 Flow Lines
- **Requirement:** Render flow lines representing seepage paths
- **Details:**
  - Smooth blue curves (or consistent color)
  - Approximately Nf curves based on user input
  - Originate from upstream water body
  - Terminate at downstream water body
  - Should not cross each other
  - Arrows or animation showing direction of flow
  - Thickness should indicate relative seepage velocity in advanced versions

### 7.3 Equipotential Lines
- **Requirement:** Render equipotential lines representing points of equal hydraulic head
- **Details:**
  - Dashed or contrasting visual style
  - Approximately Nd lines based on user input
  - Connect regions of equal head
  - Should not cross each other
  - Optional labels showing hydraulic head values at each line
  - Should be approximately perpendicular to flow lines

### 7.4 Water Levels
- **Requirement:** Show upstream and downstream water elevations
- **Details:**
  - Upstream level: Default 20 m (adjustable via slider)
  - Downstream level: Default 14 m (adjustable via slider)
  - Labels on both sides showing elevation (m)
  - Water surface animated or clearly indicated
  - Optional water particle animation showing seepage

### 7.5 Parameter Controls
- **Requirement:** Provide UI controls to adjust simulation parameters
- **Controls:**
  - **Upstream Head (h₁):** Slider range 10–30 m, default 20 m
  - **Downstream Head (h₂):** Slider range 0–25 m, default 14 m
  - **Hydraulic Conductivity (k):** Slider range 0.001–0.1 m/s, default 0.01 m/s
  - **Number of Flow Channels (Nf):** Numeric input, default 4, range 1–10
  - **Number of Potential Drops (Nd):** Numeric input, default 8, range 2–20
- **Behavior:**
  - Real-time update on slider change
  - Numeric inputs validated on blur or enter
  - Clear labels with units (m, m/s, unitless)
  - Reset button to restore defaults
  - Play/Pause button for animation

### 7.6 Calculation Panel
- **Requirement:** Display engineering calculations in real-time
- **Calculated Values:**
  - **Total Head Loss:** H = h₁ − h₂ (m)
  - **Head Loss Per Potential Drop:** Δh = H / Nd (m)
  - **Seepage Discharge:** q = k × H × (Nf / Nd) (m²/s or m³/s per unit width)
  - **Hydraulic Gradient (at exit):** i ≈ Δh / L (dimensionless or %)
  - **Flow per Channel:** q_channel = q / Nf (m²/s or m³/s per unit width)
- **Display:**
  - All calculations shown with units
  - Formulas visible or accessible via tooltip
  - Values update in real-time
  - Color coding: green for valid, yellow for warnings, red for errors

### 7.7 Animations
- **Seepage Particle Animation:**
  - Optional colored particles flowing along flow lines
  - Velocity proportional to hydraulic gradient
  - Can be toggled on/off
  - Play/Pause button
- **Water Level Animation:**
  - Subtle wave effect at water surfaces (optional)
  - Does not distract from main simulator

### 7.8 Visibility Toggles
- **Requirement:** Allow users to show/hide visualization layers
- **Toggles:**
  - Show/Hide Flow Lines
  - Show/Hide Equipotential Lines
  - Show/Hide Hydraulic Head Labels
  - Show/Hide Flow Direction Arrows
  - Show/Hide Particle Animation
  - Show/Hide Educational Panel
- **Default:** All enabled except particle animation

### 7.9 Educational Information Panel
- **Requirement:** Provide context-sensitive educational explanations
- **Content:**
  - "What is a Flow Net?" — Definition and purpose
  - "Flow Lines vs. Equipotential Lines" — Distinction and roles
  - "Why Orthogonal?" — Explanation based on Darcy's law
  - "Interpreting the Results" — How to read the visualization
  - "Calculation Details" — Formulas and assumptions
  - "Real-World Applications" — Examples in dam design, pollution transport, etc.
- **Behavior:**
  - Expandable/collapsible sections
  - Not visible by default on desktop (toggleable)
  - Always visible on mobile below the simulator
  - Links to further resources (optional)

### 7.10 Legend
- **Requirement:** Clarify all visual symbols and colors
- **Legend Should Show:**
  - Blue solid curves = Flow lines
  - Dashed lines = Equipotential lines
  - Arrow = Flow direction
  - Color = Water bodies
  - Color = Soil
  - Color = Dam/impermeable

### 7.11 Units Management
- **Requirement:** Make units explicit and consistent
- **Units:**
  - Distances: meters (m)
  - Hydraulic conductivity: m/s
  - Discharge: m³/s per unit width (or m²/s for 2D cross-section)
  - Hydraulic gradient: dimensionless (or as percentage if preferred)
  - Head: meters of water column
- **Implementation:**
  - All input labels include units
  - All output values include units
  - No unit conversion errors allowed
  - Clearly state cross-section width assumption (1 m) for 2D calculations

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Canvas rendering: <16 ms (60 FPS animations)
- Parameter update response: <100 ms
- No lag during slider adjustment
- Mobile: Smooth performance on devices from 2019 onwards

### 8.2 Responsiveness
- **Desktop (>1024px):** Simulation canvas on left/center, controls on right or below, educational panel accessible
- **Tablet (768px–1024px):** Stacked layout, simulation takes priority, controls below
- **Mobile (<768px):** Full-width simulation, collapsed controls with expand toggles, educational panel scrollable

### 8.3 Accessibility
- WCAG 2.1 AA compliant where applicable
- Keyboard-accessible sliders, buttons, and inputs
- Proper `<label>` tags for form controls
- Color not the only means of information (also use patterns, labels, text)
- High contrast for text (4.5:1 minimum for normal text)
- Focus indicators on interactive elements
- Screen reader friendly: descriptive labels, ARIA roles where needed
- No flashing or auto-playing content that could cause seizures

### 8.4 Usability
- No instruction needed for basic operation (intuitive defaults)
- Clear error messages with actionable solutions
- Undo/Reset available
- Consistent terminology (flow line, equipotential, flow channel, etc.)
- Educational text uses plain language with technical terms defined

### 8.5 Robustness
- Handles invalid inputs gracefully (no NaN, Infinity, or crashes)
- Prevents division by zero (e.g., Nd = 0)
- Prevents negative seepage discharge
- Validates constraints (e.g., k > 0, Nd > 1, Nf > 0)
- Clear error messages guide user to valid input ranges

### 8.6 Maintainability
- Separation of concerns: simulation logic, rendering, UI, state management
- Well-documented code with comments on non-obvious engineering logic
- Reusable components with clear props and exports
- TypeScript for type safety
- Unit tests for calculation functions
- Integration tests for UI workflows

### 8.7 Extensibility
- Architecture allows addition of numerical seepage solver (FDM/FEM)
- Modular design supports future features (variable soil layers, anisotropy, etc.)
- No hard-coded values in core calculation functions
- Clear interfaces for adding new visualization layers

---

## 9. Simulation Requirements

### 9.1 Mathematical Basis
The simulator is based on the standard flow-net analysis method for seepage through soil. The core relationship is:

**q = k × H × (Nf / Nd)**

Where:
- **q** = seepage discharge per unit width (m³/s per meter of dam length, or equivalently m²/s for 2D cross-section)
- **k** = coefficient of permeability (m/s)
- **H** = total head loss = h_upstream − h_downstream (m)
- **Nf** = number of flow channels (dimensionless)
- **Nd** = number of potential drops (dimensionless)

### 9.2 Head Loss Distribution
Head is distributed uniformly across potential drops:

**Δh = H / Nd** (head loss per potential drop, m)

Equipotential lines are drawn such that the head difference between consecutive lines is Δh.

### 9.3 Hydraulic Gradient (Local)
At any location, the local hydraulic gradient is:

**i = (head loss over a distance) / distance**

The gradient is highest where equipotential lines are closest together and lowest where they are far apart. This visualization helps students understand velocity variation.

### 9.4 Flow-Net Properties
The visualization should enforce or illustrate:
- Flow lines and equipotential lines should be approximately orthogonal
- Flow lines should not cross (each represents a unique stream)
- Equipotential lines should not cross (each represents a unique head value)
- The number of flow channels (Nf) and potential drops (Nd) are geometric properties of the grid, not arbitrary
- In a properly constructed flow net, flow channels all carry approximately equal discharge (q / Nf per channel)

### 9.5 Simplified Visualization Model
**Assumption:** The simulator uses a **parametric/constructed flow-net representation** rather than solving Laplace's equation numerically. This means:
- Flow lines are interpolated smooth curves based on Nf count and boundary conditions
- Equipotential lines are similarly interpolated based on Nd count
- The orthogonality is approximate and enforced through interpolation, not from a full PDE solution
- This is sufficient for educational purposes and clearly labeled as such

**Future Enhancement:** A numerical seepage module (FDM or FEM) could solve for flow lines and equipotential lines exactly, replacing the parametric model while keeping the UI identical.

### 9.6 Boundary Conditions
- **Upstream boundary (left):** Equipotential at hydraulic head h_upstream (constant head)
- **Downstream boundary (right):** Equipotential at hydraulic head h_downstream (constant head)
- **Dam/Impermeable structure:** Boundary condition: no normal flow (flow lines tangent)
- **Impermeable base:** Boundary condition: no normal flow (flow lines tangent)
- **Soil/water interface at upstream:** Flow enters perpendicular (approximately)
- **Soil/water interface at downstream:** Flow exits perpendicular (approximately)

---

## 10. Engineering Equations

### 10.1 Core Seepage Discharge Formula
```
q = k × H × (Nf / Nd)

where:
  q    = seepage discharge per unit width [m³/s per meter]
  k    = hydraulic conductivity [m/s]
  H    = total head loss [m]
  Nf   = number of flow channels [dimensionless]
  Nd   = number of potential drops [dimensionless]
```

### 10.2 Total Head Loss
```
H = h₁ - h₂

where:
  H    = total head loss [m]
  h₁   = upstream hydraulic head [m]
  h₂   = downstream hydraulic head [m]
```

Note: In this simplified model, hydraulic head ≈ water surface elevation (assuming atmospheric pressure at water surfaces). In more general seepage, head = elevation + pressure/ρg.

### 10.3 Head Loss Per Potential Drop
```
Δh = H / Nd

where:
  Δh   = head loss between consecutive equipotential lines [m]
  H    = total head loss [m]
  Nd   = number of potential drops [dimensionless]
```

### 10.4 Discharge Per Flow Channel
```
q_channel = q / Nf

where:
  q_channel = discharge through one flow channel [m³/s per meter]
  q          = total discharge [m³/s per meter]
  Nf         = number of flow channels [dimensionless]
```

### 10.5 Local Hydraulic Gradient (Approximate)
```
i ≈ Δh / L

where:
  i    = local hydraulic gradient [dimensionless]
  Δh   = head loss over distance L [m]
  L    = flow distance (length of flow line segment) [m]
```

This is locally variable along the flow path but is shown as an average or at the exit for educational purposes.

### 10.6 Darcy's Law (Reference)
For completeness, the underlying principle:
```
v = k × i

where:
  v = seepage velocity [m/s]
  k = hydraulic conductivity [m/s]
  i = hydraulic gradient [dimensionless]
```

The flow-net method is a graphical application of Darcy's law.

---

## 11. Input Parameters

| Parameter | Symbol | Type | Range | Default | Unit | Description |
|-----------|--------|------|-------|---------|------|-------------|
| Upstream Head | h₁ | Slider | 10–30 | 20 | m | Water elevation on upstream side |
| Downstream Head | h₂ | Slider | 0–25 | 14 | m | Water elevation on downstream side |
| Hydraulic Conductivity | k | Slider | 0.001–0.1 | 0.01 | m/s | Soil permeability |
| Number of Flow Channels | Nf | Integer Input | 1–10 | 4 | — | Flow lines dividing seepage region |
| Number of Potential Drops | Nd | Integer Input | 2–20 | 8 | — | Equipotential lines dividing head |

### 11.1 Input Constraints & Validation
- **h₁ > h₂:** Upstream must be higher than downstream; if not, display error: "Upstream head must be greater than downstream head"
- **h₁ ≥ 0, h₂ ≥ 0:** Both heads non-negative; if negative, display error: "Head values must be non-negative"
- **k > 0:** Permeability must be positive; if ≤0, display error: "Permeability must be positive"
- **Nf ≥ 1:** At least one flow channel; if <1, display error: "Flow channels must be ≥ 1"
- **Nd ≥ 2:** At least two potential drops; if <2, display error: "Potential drops must be ≥ 2"
- **H > 0:** Total head loss must be positive (automatic consequence of h₁ > h₂)

### 11.2 Slider Behavior
- Sliders should update visualization and calculations in real-time
- Debouncing to avoid excessive re-renders: 50 ms
- Numeric inputs (Nf, Nd) update on blur or Enter key
- Reset button restores all parameters to defaults

---

## 12. Output Parameters / Calculated Values

| Parameter | Symbol | Formula | Units | Display Format |
|-----------|--------|---------|-------|-----------------|
| Total Head Loss | H | h₁ − h₂ | m | 0.00 m |
| Head Loss Per Drop | Δh | H / Nd | m | 0.000 m |
| Seepage Discharge | q | k × H × (Nf / Nd) | m³/s per m | 0.0000 m³/s per m |
| Hydraulic Gradient (approx.) | i | Δh / L_avg | — | 0.000 (or 0.0%) |
| Discharge Per Channel | q_ch | q / Nf | m³/s per m | 0.0000 m³/s per m |

### 12.1 Display Precision
- Head values: 0.00 m (2 decimal places)
- Conductivity: 0.000 m/s (3 decimal places) in inputs; as given in outputs
- Discharge: 0.0000 m³/s per m (4 significant figures or 4 decimal places)
- Gradient: 0.000 (3 decimal places) or 0% (as percentage)

### 12.2 Color Coding
- **Green:** All values valid and within expected ranges
- **Yellow:** Values valid but unusual (e.g., very small k, large Nf/Nd ratio)
- **Red:** Invalid or erroneous (e.g., q = NaN, constraints violated)

---

## 13. Visualization Requirements

### 13.1 Canvas Dimensions
- **Desktop:** 800px wide × 500px tall minimum
- **Tablet:** Responsive to fit available width
- **Mobile:** Full width, max 95% of viewport width
- **Aspect Ratio:** Approximately 16:9 or 4:3 (configurable)

### 13.2 Color Scheme
- **Background:** Light gray or white (high contrast)
- **Water:** Light blue (#87CEEB or similar, semi-transparent where overlapping)
- **Flow lines:** Blue (#1E90FF or darker blue)
- **Equipotential lines:** Dashed blue or teal (#20B2AA)
- **Dam/Impermeable:** Dark gray (#404040) or hatching pattern
- **Soil:** Light tan (#F5DEB3) or similar earth tone with subtle hatching
- **Text:** Dark gray or black (#333 or #000)
- **Arrows:** Dark blue or orange for contrast

### 13.3 Visual Hierarchy
1. **Primary:** Simulation canvas (largest, central)
2. **Secondary:** Flow and equipotential lines (clearly visible)
3. **Tertiary:** Annotations, labels, legend (supporting)
4. **Background:** Grid or measurement scale (subtle)

### 13.4 Annotations
- **Water Level Labels:** "h₁ = 20 m" (upstream), "h₂ = 14 m" (downstream)
- **Head Labels on Equipotential Lines:** "Head = 19 m", "Head = 18 m", etc. (toggleable)
- **Dimension Lines:** Show dam width, soil depth (optional)
- **Legend:** Embedded or sidebar

### 13.5 SVG vs. Canvas Decision
- **Preferred: SVG** for primary visualization (scalable, semantic, easier to manipulate)
- **Canvas:** For performance-heavy particle animations if needed
- **Hybrid:** SVG for geometry, Canvas for particle rendering overlay

### 13.6 Responsive Behavior
- **Desktop:** Simulation left/center (70%), controls right (30%), or all in one column
- **Tablet:** Stacked layout with simulation on top
- **Mobile:** Full-width simulation, controls collapsed/expandable below
- **Typography:** Scales proportionally; readable at all sizes

---

## 14. Interaction Requirements

### 14.1 Slider Interactions
- Click anywhere on slider track to jump to that value
- Drag handle smoothly
- Keyboard: Left/Right arrows (1% increment), Home/End (min/max)
- Tooltip shows current value while dragging

### 14.2 Numeric Input Interactions
- Type to edit
- Validate on blur or Enter
- Show error inline if invalid
- Do not allow submission of invalid values

### 14.3 Button Interactions
- **Reset:** Restores all parameters to defaults; asks confirmation if animation is running
- **Play/Pause:** Toggles seepage animation
- **Toggle Visibility:** Clicking visibility icons shows/hides corresponding layers

### 14.4 Keyboard Navigation
- Tab through all controls in logical order
- Enter to activate buttons
- Space to toggle checkboxes
- Arrows to adjust sliders (if focused)
- No keyboard traps

### 14.5 Mobile Touch Interactions
- Sliders work with touch drag
- Tap buttons to activate
- Swipe (optional) to reveal hidden panels
- Double-tap to zoom in on simulation (optional)

### 14.6 Undo / Reset
- Reset button clears all changes and restores defaults
- No explicit undo (keep it simple for MVP)
- Animation state is not affected by parameter reset (optional: add confirmation dialog)

---

## 15. Educational Mode

### 15.1 Context-Sensitive Explanations
When toggled on, the application shows:

**Section 1: What is a Flow Net?**
```
A flow net is a graphical representation of the flow of groundwater through soil.
It consists of flow lines and equipotential lines that divide the seepage region
into small "squares" (curvilinear squares). Flow nets are used to estimate seepage
discharge, hydraulic gradients, and pressure distributions in soil.
```

**Section 2: Flow Lines & Equipotential Lines**
```
FLOW LINES (solid blue curves):
- Show the path followed by water particles (seepage paths)
- Tangent to the velocity vector at each point
- Originate from the upstream water surface
- Terminate at the downstream water surface
- Never cross each other (unique path per line)

EQUIPOTENTIAL LINES (dashed curves):
- Connect points of equal total hydraulic head
- Perpendicular to flow lines (consequence of Darcy's law)
- Represent equal potential energy
- Never cross each other (unique head per line)
```

**Section 3: Flow Channels & Potential Drops**
```
FLOW CHANNELS:
- Regions between two adjacent flow lines
- All channels carry approximately equal discharge
- Number of channels = Nf (user-specified)

POTENTIAL DROPS:
- Regions between two adjacent equipotential lines
- All drops represent equal head loss (H / Nd)
- Number of drops = Nd (user-specified)
- The grid of flow channels × potential drops forms "curvilinear squares"
```

**Section 4: Why Are They Perpendicular?**
```
Flow lines and equipotential lines intersect at right angles because:
1. Seepage velocity is proportional to hydraulic gradient (Darcy's law: v = k·i)
2. The hydraulic gradient points in the direction of decreasing head
3. Equipotential lines are perpendicular to the head gradient
4. Therefore, flow lines (velocity direction) are perpendicular to equipotential lines
```

**Section 5: Reading the Results**
```
SEEPAGE DISCHARGE (q):
The total volume of water flowing through the soil per unit time per unit width.
Calculated as: q = k × H × (Nf / Nd)

HEAD LOSS PER DROP (Δh):
Each equipotential line represents a head drop of H / Nd.
Spacing between equipotential lines indicates local gradient:
- Closer spacing = higher gradient = higher seepage velocity
- Wider spacing = lower gradient = lower seepage velocity

INTERPRETING THE GRID:
If the grid is "square" (flow channels and potential drops have similar width),
the construction is accurate. Distortions near the dam indicate boundary effects.
```

**Section 6: Real-World Applications**
```
Flow nets are used in:
- Dam design and stability analysis
- Contaminant transport prediction
- Dewatering and groundwater control during construction
- Piping and exit gradient analysis
- Uplift pressure estimation
- Slope stability assessment in seepage zones
```

### 15.2 Educational Panel Behavior
- Collapsible accordion or tabs on desktop
- Always visible on mobile (scrollable section)
- Toggle button to show/hide on desktop
- Color-coded sections (optional)
- Links to further reading (external resources, textbook sections)
- Printable version (optional)

### 15.3 Tooltips
- Brief explanations on hover for all technical terms
- Example: Hover on "Nf" → "Number of flow channels: lines dividing the seepage region"
- No tooltip spam; only on labels and non-obvious UI elements

### 15.4 Examples / Presets
- Dropdown with preset scenarios:
  - "Default (Dam)" — 20 m upstream, 14 m downstream, k=0.01, Nf=4, Nd=8
  - "High Permeability" — Same head, k=0.05, Nf=6, Nd=10
  - "Steep Gradient" — 25 m upstream, 10 m downstream
  - "Low Flow" — 15 m upstream, 14 m downstream, k=0.001
- Clicking preset loads those values

---

## 16. UI/UX Specification

### 16.1 Layout Structure (Desktop)
```
┌─────────────────────────────────────────────────────────┐
│ Flow Net Simulator | Interactive Seepage Analysis      │  (Header)
├──────────────────────────┬──────────────────────────────┤
│                          │                              │
│   SIMULATION CANVAS      │   PARAMETER PANEL            │
│   (800×500px)            │                              │
│                          │   [ Upstream Slider ]        │
│   [Flow visualization]   │   [ Downstream Slider ]      │
│                          │   [ k Slider ]               │
│                          │   [ Nf Input ]               │
│   (Legend at bottom)     │   [ Nd Input ]               │
│                          │   [Reset]  [Play/Pause]      │
│                          │                              │
├──────────────────────────┼──────────────────────────────┤
│ CALCULATION RESULTS      │ VISIBILITY TOGGLES           │
│ ┌────────────────────┐   │ ☑ Flow Lines                 │
│ │ H = 6 m            │   │ ☑ Equipotential Lines        │
│ │ Δh = 0.75 m        │   │ ☑ Particle Animation         │
│ │ q = 0.03 m³/s per m│   │ ☑ Head Labels               │
│ │ i ≈ 0.0375         │   │ ☐ Educational Panel          │
│ └────────────────────┘   │                              │
├──────────────────────────┴──────────────────────────────┤
│ EDUCATIONAL PANEL (Collapsible)                         │
│ ▼ What is a Flow Net?                                   │
│ ▼ Flow Lines vs. Equipotential Lines                    │
│ ▼ Why Perpendicular?                                    │
│ ▼ Real-World Applications                               │
└──────────────────────────────────────────────────────────┘
```

### 16.2 Layout Structure (Mobile)
```
┌──────────────────────────────┐
│ Flow Net Simulator           │  (Header)
├──────────────────────────────┤
│                              │
│   SIMULATION CANVAS          │
│   (Full width, scaled)       │
│                              │
├──────────────────────────────┤
│ [▼] PARAMETERS              │  (Collapsible)
│ Upstream: 20 m               │
│ [========●========]          │
│ Downstream: 14 m             │
│ [======●==========]          │
│ ...                          │
├──────────────────────────────┤
│ [▼] RESULTS                  │  (Collapsible)
│ H = 6 m                      │
│ q = 0.03 m³/s per m          │
│ ...                          │
├──────────────────────────────┤
│ [▼] EDUCATIONAL PANEL        │  (Scrollable)
│ What is a Flow Net?          │
│ (Long text...)               │
└──────────────────────────────┘
```

### 16.3 Component Hierarchy
1. **Page Layout** — Main container, responsive grid
2. **Header** — Title, version, info icon
3. **Simulation Canvas** — SVG/Canvas rendering area
4. **Parameter Controls** — Sliders and inputs
5. **Calculation Panel** — Results display
6. **Visibility Toggles** — Checkboxes for layers
7. **Educational Panel** — Accordion or tabs
8. **Legend** — Color/symbol reference
9. **Footer** — Credits, resources (optional)

### 16.4 Typography
- **Heading:** Roboto or system sans-serif, 24–28px, bold, dark gray
- **Subheading:** 16–18px, semi-bold, dark gray
- **Body Text:** 14–16px, regular, dark gray
- **Label:** 13–14px, medium, dark gray
- **Input/Slider Label:** 12–13px, medium, dark gray (#555)
- **Units:** 11–12px, regular, light gray (#999), inline with value
- **Code/Formula:** Monospace (Courier, Monaco), 12px, light background

### 16.5 Color Palette
- **Primary Blue:** #1E90FF (flow lines)
- **Secondary Teal:** #20B2AA (equipotential lines)
- **Background Light:** #F8F9FA (page background)
- **Background Dark:** #FFFFFF (canvas background)
- **Text Primary:** #202124 (main text)
- **Text Secondary:** #5F6368 (secondary text, labels)
- **Text Tertiary:** #999999 (units, helper text)
- **Success Green:** #34A853 (valid values)
- **Warning Yellow:** #FBBC04 (caution states)
- **Error Red:** #EA4335 (invalid, errors)
- **Border:** #DADCE0 (subtle separators)
- **Water:** #87CEEB with 0.3 opacity
- **Soil:** #F5DEB3 (beige)
- **Dam:** #404040 (dark gray) or diagonal hatching pattern

### 16.6 Spacing & Sizing
- Grid: 8px base unit
- Padding: 16px (2×) for panels, 8px (1×) for internal elements
- Margin: 16–24px between major sections
- Button size: 40–48px height (touch-friendly)
- Input field height: 40px
- Slider height: 6px track, 20px handle

### 16.7 Visual Style
- **Aesthetic:** Clean, academic, modern professional
- **Borders:** Subtle gray (#DADCE0), 1px, not rounded unless buttons
- **Shadows:** Minimal; card shadow only: 0 1px 3px rgba(0,0,0,0.12)
- **Rounded Corners:** Buttons only: 4px
- **Animations:** Smooth transitions (200–300ms) for visibility toggles, parameter updates
- **Grid:** Optional subtle background grid on canvas (very light gray, low opacity)
- **Emphasis:** Bold or color, never flashing

---

## 17. Responsive Behavior

### 17.1 Breakpoints
- **Mobile:** max-width 480px
- **Tablet:** 481px to 1023px
- **Desktop:** 1024px and above

### 17.2 Mobile (< 480px)
- Single-column layout
- Simulation canvas: 100% width, max 95vw
- Controls: Stacked vertically, full width
- Collapsible accordion for parameters and results
- Educational panel: Scrollable section at bottom
- No sidebar
- Buttons and sliders: Touch-friendly sizing (48px min)

### 17.3 Tablet (481px–1023px)
- Two-column layout or single-column with side-by-side controls
- Simulation canvas: ~60% width
- Controls panel: ~40% width or stacked below
- Results displayed in a row or compact card
- Educational panel: Collapsible below or in sidebar

### 17.4 Desktop (≥1024px)
- Multi-column layout (simulation, controls, results, education)
- Optimal use of screen real estate
- Educational panel collapsible or fixed sidebar
- Stable layout, no reflow during interaction

---

## 18. Accessibility

### 18.1 WCAG 2.1 Level AA Compliance
- Contrast: Text 4.5:1 (normal), 3:1 (large)
- Touch targets: 48px × 48px minimum
- Focus indicators: Visible (outline: 2px solid #1E90FF)
- No color-only information encoding
- No auto-playing audio or video

### 18.2 Keyboard Navigation
- Tab order: logical (left-to-right, top-to-bottom)
- All controls keyboard-accessible
- No keyboard traps
- Shortcuts: Spacebar for play/pause, R for reset (optional)

### 18.3 Screen Reader Support
- Semantic HTML: `<label>`, `<button>`, `<input>` with proper associations
- ARIA labels for SVG elements: `<title>`, `<desc>` tags
- Descriptions for complex visualizations
- Form validation errors announced
- Canvas content: Fallback text or ARIA description

### 18.4 Visual Accessibility
- Dyslexia-friendly font options (optional, e.g., OpenDyslexic)
- Adjustable text size (browser zoom + optional UI control)
- High contrast mode support
- No animation in critical content; only decorative animations can auto-play

### 18.5 Semantic HTML
- Use `<form>` for input groups
- Use `<fieldset>` and `<legend>` for grouped controls
- Use `<table>` for calculation results (if displayed as table)
- Proper heading hierarchy: h1 (title), h2 (sections), h3 (subsections)

---

## 19. Validation & Error Handling

### 19.1 Input Validation Rules

| Input | Validation Rule | Error Message | Recovery |
|-------|-----------------|---------------|----------|
| h₁ (Upstream) | h₁ > h₂ | "Upstream head must be higher than downstream head" | Highlight field, suggest valid value |
| h₂ (Downstream) | h₂ < h₁ | "Downstream head must be lower than upstream head" | Highlight field, suggest valid value |
| h₁, h₂ | ≥ 0, ≤ 100 | "Head must be between 0 and 100 m" | Clamp to range or reject |
| k | > 0, ≤ 1 | "Permeability must be positive (0 to 1 m/s)" | Clamp or reject |
| Nf | ≥ 1, ≤ 10, integer | "Flow channels must be integer between 1 and 10" | Round or reject |
| Nd | ≥ 2, ≤ 20, integer | "Potential drops must be integer ≥ 2 and ≤ 20" | Round or reject |

### 19.2 Calculation Error Prevention
- Check H > 0 before calculating (automatic if h₁ > h₂)
- Check Nd > 0 before division (H / Nd)
- Check k > 0 before multiplying
- Check Nf > 0 before division (q / Nf)
- Return null or default value if any constraint violated

### 19.3 Error Display
- Inline error message below input field
- Field highlight with red border
- Icon (!) next to label
- Clear, actionable guidance
- Do not block entire UI; allow user to continue (soft validation)
- On hard validation (submission), prevent action and highlight all errors

### 19.4 Fallback Behavior
- If all inputs valid: Display results
- If any input invalid: Show error, display last-valid results in gray/disabled state
- If critical error (e.g., k undefined): Show alert and reset to defaults
- No NaN, Infinity, undefined in UI; always show a valid or zero value

---

## 20. Component Architecture

### 20.1 Component Decomposition
```
<FlowNetSimulator> (main container)
  ├── <Header>
  ├── <div className="content">
  │   ├── <SimulationCanvas>
  │   │   ├── <SVGVisualization>
  │   │   │   ├── <WaterBodies>
  │   │   │   ├── <DamStructure>
  │   │   │   ├── <SoilLayer>
  │   │   │   ├── <FlowLines>
  │   │   │   ├── <EquipotentialLines>
  │   │   │   ├── <SeepageParticles> (optional)
  │   │   │   └── <Labels>
  │   │   └── <Legend>
  │   ├── <ControlPanel>
  │   │   ├── <ParameterControls>
  │   │   │   ├── <SliderInput> (upstream)
  │   │   │   ├── <SliderInput> (downstream)
  │   │   │   ├── <SliderInput> (k)
  │   │   │   ├── <NumberInput> (Nf)
  │   │   │   └── <NumberInput> (Nd)
  │   │   ├── <ActionButtons>
  │   │   │   ├── <Button>Reset</Button>
  │   │   │   └── <Button>Play/Pause</Button>
  │   │   └── <VisibilityToggles>
  │   ├── <CalculationPanel>
  │   │   └── <ResultsDisplay> (table or cards)
  │   └── <EducationalPanel>
  │       ├── <Accordion>
  │       │   ├── <Section>What is a Flow Net?</Section>
  │       │   ├── <Section>Flow Lines vs. Equipotential</Section>
  │       │   └── ...
  │       └── <Presets>
  └── <Footer>
```

### 20.2 Component Props & Responsibilities

**FlowNetSimulator** (Main)
- Props: None (container)
- State: simulation parameters, visibility toggles, animation state
- Responsibility: Orchestrate child components, manage global state

**SimulationCanvas**
- Props: `parameters`, `visibility`, `animationRunning`
- State: None (receive props only)
- Responsibility: Render SVG visualization

**ParameterControls**
- Props: `parameters`, `onParameterChange`, `onReset`
- State: Temporary input values during editing
- Responsibility: Handle user input, validate, call callbacks

**CalculationPanel**
- Props: `parameters`
- State: None
- Responsibility: Display calculated results, format units

**EducationalPanel**
- Props: `parameters` (optional, for context-sensitive content)
- State: Expanded sections, selected preset
- Responsibility: Display educational content

---

## 21. Data & State Architecture

### 21.1 State Shape (Global/Context)
```typescript
interface SimulationState {
  parameters: {
    upstreamHead: number;      // meters
    downstreamHead: number;    // meters
    hydraulicConductivity: number; // m/s
    flowChannels: number;      // count
    potentialDrops: number;    // count
  };
  visibility: {
    flowLines: boolean;
    equipotentialLines: boolean;
    particleAnimation: boolean;
    headLabels: boolean;
    legend: boolean;
    educationalPanel: boolean;
  };
  animation: {
    isRunning: boolean;
    speed: number; // 0.5–2.0
  };
  error: {
    fieldName: string | null;
    message: string | null;
  };
}
```

### 21.2 Calculated Values (Derived State)
```typescript
interface CalculatedValues {
  totalHeadLoss: number;       // H = h₁ - h₂
  headPerDrop: number;         // Δh = H / Nd
  seepageDischarge: number;    // q = k × H × (Nf / Nd)
  dischargePerChannel: number; // q / Nf
  hydraulicGradient: number;   // approximated
  isValid: boolean;            // all constraints met
  errors: string[];            // validation messages
}
```

### 21.3 State Management Strategy
- **Context API** (recommended for small app) or **Zustand** (lightweight alternative)
- Single source of truth: `SimulationState`
- Derived state calculated on demand in a custom hook
- Actions: `updateParameter()`, `toggleVisibility()`, `playAnimation()`, `resetSimulation()`
- Listeners: Components subscribe to state slices they need

### 21.4 Immutability
- Use TypeScript strict mode
- Never mutate state directly
- Use spreads or Immer for state updates
- Example:
```typescript
setState(prev => ({
  ...prev,
  parameters: { ...prev.parameters, upstreamHead: 21 }
}));
```

---

## 22. Calculation Engine Architecture

### 22.1 Calculation Module (Separate File)
Create `src/lib/calculations.ts` with pure functions:

```typescript
export function calculateTotalHeadLoss(h1: number, h2: number): number {
  return h1 - h2;
}

export function calculateHeadPerDrop(H: number, Nd: number): number {
  if (Nd <= 0) return 0;
  return H / Nd;
}

export function calculateSeepageDischarge(
  k: number,
  H: number,
  Nf: number,
  Nd: number
): number {
  if (k <= 0 || H <= 0 || Nf <= 0 || Nd <= 0) return 0;
  return k * H * (Nf / Nd);
}

export function validateParameters(params: Parameters): ValidationResult {
  const errors: string[] = [];
  if (params.upstreamHead <= params.downstreamHead) {
    errors.push("Upstream head must be greater than downstream head");
  }
  if (params.hydraulicConductivity <= 0) {
    errors.push("Hydraulic conductivity must be positive");
  }
  // ... more validations
  return { isValid: errors.length === 0, errors };
}

export function calculateAll(params: Parameters): CalculatedValues {
  const validation = validateParameters(params);
  if (!validation.isValid) {
    return { ...initialValues, isValid: false, errors: validation.errors };
  }
  
  const H = calculateTotalHeadLoss(params.upstreamHead, params.downstreamHead);
  const deltaH = calculateHeadPerDrop(H, params.potentialDrops);
  const q = calculateSeepageDischarge(
    params.hydraulicConductivity,
    H,
    params.flowChannels,
    params.potentialDrops
  );
  
  return {
    totalHeadLoss: H,
    headPerDrop: deltaH,
    seepageDischarge: q,
    dischargePerChannel: q / params.flowChannels,
    hydraulicGradient: deltaH / 10, // approximation; L ≈ 10m
    isValid: true,
    errors: []
  };
}
```

### 22.2 Calculation Testing
- Unit tests for all functions
- Test edge cases: k=0, Nd=0, H=0, negative values
- Test precision: results rounded to expected decimal places
- Test consistency: q = k × H × (Nf / Nd) always holds

---

## 23. Animation Architecture

### 23.1 Seepage Particle Animation
- Particles spawn on upstream boundary (uniformly distributed along flow lines)
- Travel along flow lines at velocity proportional to hydraulic gradient
- Exit at downstream boundary
- Respawn and repeat (looping)
- Color: transparent blue or semi-transparent white
- Size: small circles (4–8px diameter)
- Density: adjustable (or fixed at ~Nf particles per flow channel)

### 23.2 Animation Implementation
- Use `requestAnimationFrame` for smooth 60 FPS rendering
- Track particle positions in state
- Update positions based on flow-line geometry and elapsed time
- Canvas or SVG overlay for particle rendering (Canvas recommended for performance)

### 23.3 Play/Pause Control
- Button toggles `isRunning` state
- While running: call `requestAnimationFrame` each frame to update positions
- While paused: stop frame requests, keep particles at current position
- Reset: clears particle positions, restarts animation if running

---

## 24. Technical Stack

### 24.1 Frontend Framework
- **React 18+** — Component-based UI
- **TypeScript** — Static typing, better IDE support
- **Vite** — Fast build tool and dev server

### 24.2 Styling
- **Tailwind CSS** — Utility-first styling
- **CSS Modules** (optional, for scoped styles) — Complex components
- **shadcn/ui** (optional) — Pre-built accessible components (Button, Input, Slider, etc.)

### 24.3 Visualization
- **SVG** — Primary rendering (flow net geometry, lines, labels)
- **Canvas** (optional) — Particle animation overlay if performance needed
- **D3.js** (optional) — For advanced curve interpolation (spline fitting for flow lines)

### 24.4 State Management
- **Context API + useReducer** — Lightweight state
- Alternative: **Zustand** — Even lighter weight library

### 24.5 Forms & Validation
- **React Hook Form** (optional) — Form management and validation
- Or: Manual state + custom hooks

### 24.6 Testing
- **Vitest** — Unit testing framework (calculation functions, components)
- **React Testing Library** — Component testing
- **Cypress** or **Playwright** (optional) — E2E testing

### 24.7 Build & Deployment
- **Vite** — Build to static files (dist/)
- **GitHub Pages**, **Vercel**, or **Netlify** — Hosting
- **Environment variables** — API endpoints, feature flags (if applicable)

### 24.8 Development Tools
- **ESLint** — Code linting
- **Prettier** — Code formatting
- **Pre-commit hooks** (Husky) — Run linter/formatter before commit

---

## 25. Folder Structure

```
flownet-simulator/
├── src/
│   ├── components/
│   │   ├── FlowNetSimulator.tsx (main container)
│   │   ├── SimulationCanvas.tsx
│   │   ├── ParameterControls.tsx
│   │   ├── CalculationPanel.tsx
│   │   ├── EducationalPanel.tsx
│   │   ├── Legend.tsx
│   │   └── ui/ (reusable UI primitives)
│   │       ├── Button.tsx
│   │       ├── Slider.tsx
│   │       ├── Input.tsx
│   │       ├── Accordion.tsx
│   │       └── Toggle.tsx
│   ├── lib/
│   │   ├── calculations.ts (pure calculation functions)
│   │   ├── flowNetGeometry.ts (flow line & equipotential curve generation)
│   │   ├── validation.ts (input validation)
│   │   ├── constants.ts (defaults, ranges, units)
│   │   └── types.ts (TypeScript interfaces)
│   ├── hooks/
│   │   ├── useSimulation.ts (main state hook)
│   │   ├── useCalculations.ts (derived calculations)
│   │   ├── useAnimation.ts (particle animation)
│   │   └── useResponsive.ts (responsive utilities)
│   ├── context/
│   │   ├── SimulationContext.tsx
│   │   └── useSimulationContext.ts
│   ├── styles/
│   │   ├── globals.css (Tailwind setup, global styles)
│   │   ├── variables.css (CSS custom properties for colors, spacing)
│   │   └── animations.css (custom animations)
│   ├── App.tsx (root component)
│   └── main.tsx (React entry point)
├── tests/
│   ├── lib/
│   │   ├── calculations.test.ts
│   │   ├── validation.test.ts
│   │   └── flowNetGeometry.test.ts
│   └── components/
│       ├── ParameterControls.test.tsx
│       └── CalculationPanel.test.tsx
├── public/
│   ├── index.html
│   └── favicon.ico
├── .env (development environment variables)
├── vite.config.ts (Vite configuration)
├── tsconfig.json (TypeScript configuration)
├── tailwind.config.ts (Tailwind configuration)
├── package.json (dependencies, scripts)
└── README.md (project documentation)
```

---

## 26. Testing Strategy

### 26.1 Unit Tests (Calculation Functions)
- **File:** `tests/lib/calculations.test.ts`
- **Tests:**
  - `calculateTotalHeadLoss(20, 14)` === 6
  - `calculateHeadPerDrop(6, 8)` === 0.75
  - `calculateSeepageDischarge(0.01, 6, 4, 8)` ≈ 0.03
  - Edge cases: k=0, Nd=0, H=0, negative values
  - Precision: results match expected decimal places

### 26.2 Validation Tests
- **File:** `tests/lib/validation.test.ts`
- **Tests:**
  - Invalid inputs are caught
  - Valid inputs pass
  - Error messages are clear
  - Boundary values handled correctly

### 26.3 Component Tests (React Testing Library)
- **File:** `tests/components/ParameterControls.test.tsx`
- **Tests:**
  - Sliders update state
  - Numeric inputs validate
  - Error messages display
  - Reset button works
  - Keyboard navigation works

### 26.4 Visual / Integration Tests (Manual or Cypress)
- Flow net renders without errors
- Parameters update visualization
- Calculations are correct
- Responsive layout works on different screen sizes
- Accessibility: keyboard navigation, screen reader compatible

### 26.5 Test Coverage Goal
- Calculation functions: 100%
- Validation: 100%
- Components: ≥80%
- Overall: ≥85%

---

## 27. Acceptance Criteria

### 27.1 Functional Acceptance Criteria

1. **Visualization**
   - [ ] Canvas displays without errors
   - [ ] Flow lines render (Nf curves)
   - [ ] Equipotential lines render (Nd lines, dashed style)
   - [ ] Lines are approximately orthogonal
   - [ ] Water bodies visible at correct elevations
   - [ ] Dam and soil layers clearly distinguished
   - [ ] Legend present and accurate

2. **Parameters & Controls**
   - [ ] Upstream slider works: 10–30 m range, default 20 m
   - [ ] Downstream slider works: 0–25 m range, default 14 m
   - [ ] Hydraulic conductivity slider works: 0.001–0.1 m/s, default 0.01 m/s
   - [ ] Nf numeric input: 1–10, default 4
   - [ ] Nd numeric input: 2–20, default 8
   - [ ] Reset button restores defaults
   - [ ] Play/Pause animates particles

3. **Calculations**
   - [ ] H = 6 m when h₁=20, h₂=14 (default)
   - [ ] Δh = 0.75 m when H=6, Nd=8
   - [ ] q ≈ 0.03 m³/s per m when k=0.01, H=6, Nf=4, Nd=8
   - [ ] Results update in real-time when parameters change
   - [ ] All values displayed with correct units
   - [ ] All values displayed with correct precision

4. **Validation & Error Handling**
   - [ ] Error shown if h₁ ≤ h₂
   - [ ] Error shown if k ≤ 0
   - [ ] Error shown if Nf < 1
   - [ ] Error shown if Nd < 2
   - [ ] Invalid inputs do not crash or produce NaN/Infinity
   - [ ] Error messages are clear and actionable

5. **Responsiveness**
   - [ ] Desktop layout: simulation + controls visible simultaneously
   - [ ] Tablet layout: stacked appropriately
   - [ ] Mobile layout: full-width simulation, collapsible controls
   - [ ] No horizontal scrolling on any screen size
   - [ ] Touch-friendly button/slider sizes on mobile

6. **Accessibility**
   - [ ] All controls keyboard-accessible (Tab, Enter, Arrows)
   - [ ] No keyboard traps
   - [ ] Color not the only means of information
   - [ ] Text contrast ≥ 4.5:1
   - [ ] Focus indicators visible
   - [ ] Semantic HTML used

7. **Educational Content**
   - [ ] "What is a Flow Net?" section present and accurate
   - [ ] "Flow Lines vs. Equipotential" explained
   - [ ] "Why Perpendicular?" explained
   - [ ] Educational panel togglable
   - [ ] Content readable and jargon explained

8. **Performance**
   - [ ] Canvas renders at ≥30 FPS (ideally 60 FPS)
   - [ ] Parameter changes reflected in <100 ms
   - [ ] No lag during slider drag
   - [ ] Particle animation smooth

9. **User Experience**
   - [ ] No instructions needed for basic operation
   - [ ] Defaults are reasonable and demonstrate the simulator well
   - [ ] Preset scenarios load correctly
   - [ ] Undo/Reset functionality available
   - [ ] Visual design feels professional and academic

---

## 28. MVP Scope (Phase 1)

### 28.1 In Scope
- Core visualization: flow lines, equipotential lines, water bodies, dam, soil
- Parameter controls: 5 sliders/inputs as specified
- Basic animations: particle animation (simplified) or static visualization
- Calculation panel: H, Δh, q, hydraulic gradient
- Educational panel: collapsible accordion with key explanations
- Responsive design (desktop, tablet, mobile)
- Validation and error handling
- Accessibility: keyboard navigation, WCAG AA compliance (best effort)
- Testing: unit tests for calculations, basic component tests

### 28.2 Out of Scope (Phase 2+)
- Numerical seepage solver (FDM/FEM)
- Variable soil layers / permeability zones
- Anisotropic soil
- Piping / exit gradient analysis
- Uplift pressure distribution
- Multiple dams or complex geometries
- Advanced 3D visualization
- Cloud save/export (export to PDF, SVG)
- Collaborative features
- Mobile app (native)

---

## 29. Future Scope

### 29.1 Potential Enhancements
1. **Numerical Solver:** Implement FDM or FEM to calculate exact flow lines and equipotential lines
2. **Advanced Analysis:**
   - Piping failure indicators
   - Exit gradient calculation
   - Seepage velocity profiles
   - Uplift force distribution
3. **Extended Geometries:**
   - Multiple dams
   - Sloped soil layers
   - Stratified soil (variable k)
   - Cutoff walls or foundation drains
4. **Educational Features:**
   - Step-by-step construction guide (how to draw a flow net by hand)
   - Quiz mode
   - Comparison tool (user's hand-drawn net vs. simulator)
5. **Advanced UI:**
   - 3D cross-section view
   - Time-dependent seepage (consolidation)
   - Contaminant transport visualization
   - Thermal effects
6. **Professional Tools:**
   - Export results (PDF report)
   - Sensitivity analysis (tornado diagram)
   - Batch simulations
   - Integration with design software (AutoCAD, etc.)

---

## 30. Risks & Technical Considerations

### 30.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Flow-net curve interpolation inaccuracy** | Visual representation may not match true solution | Start with simple parametric curves; plan for FEM upgrade; document assumptions in UI |
| **Performance on mobile** | Sluggish rendering, animation lag | Optimize SVG rendering, use Canvas for particles, test on real devices early |
| **Accessibility compliance** | Non-compliant with WCAG, excludes users | Regular a11y audits, use semantic HTML, test with screen readers early |
| **Unit consistency errors** | Incorrect calculations | Centralize calculation functions, comprehensive unit tests, explicit unit labels in UI |
| **Complex state management** | Bug propagation, hard to maintain | Use Context API with clear action types, avoid deeply nested state |
| **Curve math complexity** | Difficult to generate smooth, realistic curves | Use Bezier curves or splines; offload to D3.js if needed |

### 30.2 Engineering Simplifications
- **Assumption 1:** Flow lines and equipotential lines are approximated via interpolation, not solved from Laplace's equation
- **Assumption 2:** Hydraulic head is assumed equal to water surface elevation (ignoring pressure head within soil for simplicity; valid for steady-state seepage)
- **Assumption 3:** Darcy's law is linear (valid for typical sand/silt, not very fine soils)
- **Assumption 4:** Soil is homogeneous and isotropic (future versions can relax this)
- **Assumption 5:** Seepage is steady-state (time-independent; transient seepage in Phase 2+)

### 30.3 Performance Considerations
- SVG is good for static or slowly-animated graphics but may struggle with thousands of nodes
- If Nf and Nd become very large (e.g., Nf=100, Nd=100), consider Canvas-only rendering or simplified mesh
- Particle animation: use Canvas overlay for thousands of particles; SVG for <100 particles

### 30.4 Extensibility Hooks
- Create an abstract `FlowNetEngine` interface to swap between parametric and numerical solvers
- Store all state in a serializable format to enable future export/import
- Design components to accept `FlowNetData` objects so new calculation methods can be plugged in

---

## 31. Glossary

| Term | Definition |
|------|-----------|
| **Flow Net** | Graphical representation of groundwater flow through soil using flow lines and equipotential lines |
| **Flow Line** | Curve showing the path followed by a water particle during seepage |
| **Equipotential Line** | Curve connecting points of equal total hydraulic head |
| **Flow Channel** | Region between two adjacent flow lines; carries approximately equal discharge |
| **Potential Drop** | Head loss between two adjacent equipotential lines |
| **Hydraulic Head** | Sum of elevation head and pressure head; measure of total mechanical energy per unit weight of water |
| **Head Loss** | Reduction in total hydraulic head along a flow path; due to friction/viscous dissipation in porous media |
| **Hydraulic Conductivity (k)** | Rate at which water flows through soil; depends on soil grain size and fluid properties; units m/s |
| **Seepage Discharge (q)** | Volume of water flowing through soil per unit time per unit width |
| **Hydraulic Gradient (i)** | Rate of change of hydraulic head with distance; dimensionless or expressed as percentage |
| **Darcy's Law** | v = k × i; seepage velocity is proportional to hydraulic conductivity and gradient |
| **Isotropic Soil** | Soil with same permeability in all directions |
| **Homogeneous Soil** | Soil with same properties throughout |
| **Steady-State Seepage** | Flow rate and hydraulic head distribution do not change with time |
| **Laminar Flow** | Flow regime where flow lines are smooth and parallel (typical in soils) |

---

## Appendix A: Default Configuration

```json
{
  "defaults": {
    "upstreamHead": 20,
    "downstreamHead": 14,
    "hydraulicConductivity": 0.01,
    "flowChannels": 4,
    "potentialDrops": 8
  },
  "ranges": {
    "upstreamHead": { "min": 10, "max": 30 },
    "downstreamHead": { "min": 0, "max": 25 },
    "hydraulicConductivity": { "min": 0.001, "max": 0.1 },
    "flowChannels": { "min": 1, "max": 10 },
    "potentialDrops": { "min": 2, "max": 20 }
  },
  "units": {
    "head": "m",
    "conductivity": "m/s",
    "discharge": "m³/s per m",
    "gradient": "dimensionless"
  }
}
```

---

## Appendix B: Initial Scenario Verification

**Default Parameters:**
- h₁ = 20 m
- h₂ = 14 m
- k = 0.01 m/s
- Nf = 4
- Nd = 8

**Expected Calculations:**
- H = 20 − 14 = **6 m** ✓
- Δh = 6 / 8 = **0.75 m** ✓
- q = 0.01 × 6 × (4/8) = 0.01 × 6 × 0.5 = **0.03 m³/s per m** ✓
- q_channel = 0.03 / 4 = **0.0075 m³/s per m** ✓
- i ≈ 0.75 / 10 = **0.075** (approx., assuming ~10m flow distance) ✓

---

**Document Version:** 1.0  
**Last Updated:** September 2026  
**Status:** Ready for Implementation
