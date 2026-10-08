# 💧 Seepage Flow Net Simulator

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Ready-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Testing-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

**An interactive web-based civil engineering and soil mechanics simulation of steady-state groundwater seepage beneath concrete dam structures.**

[Report Bug](https://github.com/biswajeet-bishoyi/Seepage-Flow-Net-Simulator/issues) • [Request Feature](https://github.com/biswajeet-bishoyi/Seepage-Flow-Net-Simulator/issues)

</div>

---

## 🌟 Overview

The **Flow Net Simulator** enables civil engineering students, professors, and geotechnical engineers to explore Darcy's law, Laplace's potential flow equation, and Terzaghi's flow net method in real time. It features a dual-layer visualization combining vector SVG geometry with a 60 FPS HTML5 canvas particle physics engine.

---

## 🚀 Key Capabilities

- **📐 Curvilinear Orthogonal Flow Net**: Dynamically renders streamlines (flow channels $N_f$) and equipotential lines (potential drops $N_d$) intersecting at strict 90° right angles throughout the porous domain.
- **🌊 60 FPS Particle Velocity Simulation**: Real-time canvas particle overlay animating individual water beads flowing along streamlines with velocity vectors directly proportional to local hydraulic gradient and hydraulic conductivity ($v = k \cdot i$).
- **⚠️ Safety Critical Failure Checks**: Automatically calculates downstream exit gradient ($i_e$) and flags hazardous conditions ($i_e \ge 0.15$) warning of piping, boiling, and toe erosion failure.
- **🎛️ Pre-Configured Geotechnical Presets**:
  - Standard Concrete Gravity Dam ($h_1 = 20\text{ m}, h_2 = 14\text{ m}, k = 0.01\text{ m/s}$)
  - High Permeability Clean Sand ($k = 0.05\text{ m/s}$)
  - Critical / Steep Gradient Dam ($h_1 = 26\text{ m}, h_2 = 8\text{ m}$)
  - Low Permeability Silty Sand ($k = 0.002\text{ m/s}$)
- **📖 Soil Mechanics Theory Guide**: In-depth explanations covering Darcy's law derivations, flow net orthogonal proofs, uplift pressure distribution, and exam viva pointers.

---

## 📐 Governing Civil Engineering Equations

The steady-state 2D seepage through isotropic porous media is governed by the Laplace equation:

$$\frac{\partial^2 h}{\partial x^2} + \frac{\partial^2 h}{\partial z^2} = 0$$

### Total Seepage Discharge (Terzaghi Formulation):
$$q = k \cdot H \cdot \left(\frac{N_f}{N_d}\right)$$

Where:
- $q$: Seepage discharge per unit width ($m^3/s \text{ per meter}$)
- $k$: Hydraulic conductivity / permeability ($m/s$)
- $H$: Total hydraulic head loss ($h_1 - h_2$) ($m$)
- $N_f$: Number of flow channels
- $N_d$: Number of potential drops
- $i_e = \frac{\Delta h}{L}$: Downstream exit hydraulic gradient

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
git clone https://github.com/biswajeet-bishoyi/Seepage-Flow-Net-Simulator.git
cd Seepage-Flow-Net-Simulator
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Run Automated Unit Tests
```bash
npm run test
```

### 4. Build for Production
```bash
npm run build
```

---

## 📚 Academic References

- Terzaghi, K., Peck, R. B., & Mesri, G. (1996). *Soil Mechanics in Engineering Practice*. John Wiley & Sons.
- Harr, M. E. (1962). *Groundwater and Seepage*. McGraw-Hill.
- Cedergren, H. R. (1989). *Seepage, Drainage, and Flow Nets*. John Wiley & Sons.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Developed by <a href="https://github.com/biswajeet-bishoyi">Biswajeet Bishoyi</a>
</div>
