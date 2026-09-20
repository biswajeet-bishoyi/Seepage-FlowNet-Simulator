# Seepage Flow Net Simulator

**Interactive Web-Based Civil Engineering & Soil Mechanics Simulation**

A modern, responsive, educational application for visualizing and calculating steady-state groundwater seepage beneath concrete dam structures on permeable foundations.

---

## 🌟 Overview

The **Flow Net Simulator** enables civil engineering students, professors, and geotechnical engineers to explore Darcy's law, Laplace's potential flow equation, and Terzaghi's flow net method in real time.

### Key Capabilities:
- **Curvilinear Orthogonal Flow Net**: Dynamically generates streamlines (flow paths) and equipotential lines (contours of equal hydraulic head) that intersect at right angles everywhere.
- **Physical Soil Mechanics Calculations**:
  - Total Head Loss: $H = h_1 - h_2$
  - Head Loss Per Drop: $\Delta h = H / N_d$
  - Seepage Discharge (Terzaghi Formula): $q = k \cdot H \cdot \frac{N_f}{N_d}$
  - Channel Flow: $q_{ch} = q / N_f$
  - Exit Hydraulic Gradient: $i \approx \Delta h / L$
- **High-Performance Seepage Particle Simulation**: HTML5 canvas overlay animating 60 FPS water beads flowing along streamlines with physical velocities proportional to permeability and hydraulic gradient ($v \propto k \cdot i$).
- **Safety Critical Alerts**: Flags high exit gradients ($i \ge 0.15$) warning of potential soil boiling, quick condition, and piping failure at the downstream dam toe.
- **Pre-Configured Geotechnical Presets**:
  - Default Concrete Gravity Dam ($h_1 = 20\text{ m}, h_2 = 14\text{ m}, k = 0.01\text{ m/s}$)
  - High Permeability Sand ($k = 0.05\text{ m/s}$)
  - Critical / Steep Gradient ($h_1 = 26\text{ m}, h_2 = 8\text{ m}$)
  - Low Permeability Silt ($k = 0.002\text{ m/s}$)
- **Soil Mechanics Theory Guide**: Collapsible accordion covering derivations, Darcy's law orthogonal proof, uplift pressure, and exam viva points.

---

## 📐 Governing Civil Engineering Equations

$$q = k \times H \times \left(\frac{N_f}{N_d}\right)$$

Where:
- $q$: Seepage discharge per unit width $[m^3/s\text{ per meter}]$
- $k$: Hydraulic conductivity / permeability $[m/s]$
- $H$: Total hydraulic head loss $[m]$
- $N_f$: Number of flow channels $[dimensionless]$
- $N_d$: Number of potential drops $[dimensionless]$

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```

### 3. Run Automated Unit Test Suite
```bash
npm run test
```

### 4. Build for Production
```bash
npm run build
```

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Civil Engineering Color Palette
- **Visualization**: Dual-layer architecture (SVG Vector Geometry + HTML5 Canvas Particle Engine)
- **Testing**: Vitest + React Testing Library + JSDOM
- **Icons**: Lucide React

---

## 📜 Academic Reference

- Terzaghi, K., Peck, R. B., & Mesri, G. (1996). *Soil Mechanics in Engineering Practice*. John Wiley & Sons.
- Harr, M. E. (1962). *Groundwater and Seepage*. McGraw-Hill.
- Cedergren, H. R. (1989). *Seepage, Drainage, and Flow Nets*. John Wiley & Sons.
