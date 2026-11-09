# Matthew // Intelligent Hardware & Autonomous Systems Portfolio

Live Site: **[https://matthewchongg.github.io](https://matthewchongg.github.io)**

An interactive 3D engineering portfolio built for **Matthew** — a Data Science and Artificial Intelligence (`DSAI`) student at the **Hong Kong Polytechnic University (HKPolyU)** building intelligent hardware, autonomous systems, and software architectures.

---

## Key Features

- **Interactive 3D Industrial Robotic Arm (`.01 // ABOUT ME`)**:
  - Real-time 2-link analytical Inverse Kinematics (`IK`) + smooth 3D base turret rotation (`Joint 1`) with zero singularity snapping.
  - High-contrast ceramic white and brushed silver mechanical claw where the exact finger pocket tracks the cursor.
  - Physical base-pedestal boundary deflection so the claw slides along the base plate without clipping.
- **Interactive Squishy Physics Block & Physical Red Reset Button (`PHY-01`)**:
  - Grab, squish, carry, and toss the physics block across the workspace floor.
  - Touching the **3D Red Reset Button** (with either the block or the claw) when the block is displaced triggers a two-stage **64-voxel ($4 \times 4 \times 4$) pixelation disappearance & appearance animation** returning the block to its home position.
- **Horizontally Panning 3D Engineered Modules Deck (`.02 // PROJECTS`)**:
  - Showcases deployed systems (`GA-01 // LoopDay`, `GR-01 // Friendly-Feud`) alongside ongoing hardware & AI lab modules (`WIP-03` through `WIP-08`).
  - Hovering any module extends an articulated upper robotic arm limb down from the top of the viewport to clamp the card.
  - Single-line auto-scrolling language/toolchain tags and full specification modal on click.
- **Direct Uplink & Contact Transmission (`.03 // CONTACT`)**:
  - Direct links to GitHub (`github.com/matthewchongg`), LinkedIn, and Electronic Mail (`matthew.chong.dev@gmail.com`).

---

## Tech Stack

- **Frontend & UI**: React 18, Tailwind CSS, Framer Motion
- **3D & Physics Simulation**: Three.js, React Three Fiber (`@react-three/fiber`)
- **Deployment**: Zero-build ES Module Import Map (`index.html`) compatible out-of-the-box with **GitHub Pages**, plus modular Vite source structure under `src/`.

---

## Running Locally

### Option 1: Direct Static Server (No Node.js Required)
```bash
python -m http.server 5173
```
Then open `http://localhost:5173` in your browser.

### Option 2: Vite Development Server
```bash
npm install
npm run dev
```
