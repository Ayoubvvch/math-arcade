# ⚡ MATH ARCADE (Hub & Playground)

> **The Modular Open-Source Hub for Mathematical Games & Visual Simulators**  
> Play live right in your browser: **[https://ayoubvvch.github.io/math-arcade/](https://ayoubvvch.github.io/math-arcade/)**

---

## 🌟 Overview
**Math Arcade** is a zero-bloat, modular platform designed to host high-performance interactive mathematical games, calculus battles, and geometric physics simulations. 

It is architected specifically for infinite extensibility: new games can be dropped into their own subdirectories and automatically discovered by the central Hub via `games.json` without requiring compilation, bundling, or rebuild steps.

---

## 🏗️ Architecture & Project Structure

```text
math-arcade/
├── index.html              # The Central Hub Homepage (Search, Filters, Game Cards, Modals)
├── games.json              # Single source of truth registry for all games & metadata
├── css/
│   ├── common.css          # Shared design tokens, typography, dark/OLED aesthetics
│   └── hub.css             # Hub layout, animations, responsive cards, glassmorphic UI
├── js/
│   └── hub.js              # Dynamic loader, fuzzy search, category filter & audio hooks
├── shared/                       # Universal shared utilities & engines for games
│   ├── cartesian-world.js        # Unified (O; i, j) world barrel + CartesianWorld lifecycle engine
│   ├── cartesian-config.js       # Orthonormal physics config, themes & math helpers
│   ├── cartesian-grid.js         # Adaptive (O; i, j) grid, vectors, points & projections
│   ├── function-plotter.js       # Safe recursive-descent parser, Path2D plotter & f'(x)/f''(x)
│   ├── cartesian-particles.js    # World-space zero-GC particles (dust, sparks, wind, notes)
│   ├── cartesian-input.js        # Keyboard, W3C analog Gamepad & virtual touch controller
│   ├── stickman-engine.js        # Living IK/FK Stickman (curve surfing, y-climb, dash, free fall)
│   ├── gamepad.js                # PlayStation (✕, ◯, ▢, △) & Xbox gamepad input with dual haptics
│   ├── math-engine.js            # Vector2D, Calculus operators, Coordinate systems
│   ├── canvas-kit.js             # HiDPI auto-scaling, Zero-GC particle pool, Cartesian grid
│   ├── retro-audio.js            # Zero-asset Web Audio API pure synthesizer
│   └── katex-kit.js              # Mixed Arabic RTL + KaTeX inline formula renderer
├── games/                        # Dedicated directory for self-contained games
│   ├── math-battle/              # Calculus marble duel simulator
│   ├── sequence-strider/         # Numerical sequences 2BAC action platformer
│   ├── ln-e-integral-quest/      # ln(x), e^x & integral platforming adventure
│   ├── stickman-cartesian-game/  # Living (O; i, j) Cartesian world, slope surfing & calculus trials
│   └── README.md                 # Game development standard specification
└── .github/workflows/
    └── pages.yml                 # Automated GitHub Pages CI/CD deployment
```

---

## 🚀 Key Engineering Highlights

- **⚡ Zero Build Dependencies**: Built 100% on pure modern Web Standards (HTML5, Vanilla ES Modules, CSS3). No `node_modules`, no Webpack/Vite overhead, zero configuration.
- **🎮 Universal Gamepad Engine**: Full out-of-the-box support for PlayStation (DualSense/DualShock ✕, ◯, ▢, △), Xbox (A, B, X, Y), Nintendo, and standard controllers with analog deadzones and haptic dual-rumble.
- **📱 60-120 FPS on Any Hardware**: Optimized for low-end mobile devices and OLED screens with zero-GC object pooling and lightweight canvas rendering.
- **🔊 Zero-Asset Synthesized Audio**: Real-time sound effects generated directly via the browser's `AudioContext` — 0 MB audio downloads.
- **🔍 Real-Time Fuzzy Search & Filter**: Instantly search by title, mathematical concept (e.g., `d/dx`, `Taylor`, `Matrix`), category, or difficulty level.
- **🌐 GitHub Pages Ready**: Deploys automatically with native HTTPS and zero server maintenance.

---

## 🛠️ How to Add a New Game in 3 Minutes

1. **Create the Game Directory**:
   ```bash
   mkdir -p games/my-new-game/
   ```
   Add your `index.html`, `style.css`, and JavaScript files inside this folder.

2. **Register in `games.json`**:
   Add a new entry to the `games.json` array:
   ```json
   {
     "id": "my-new-game",
     "title": "Fourier Transform Sandbox",
     "slug": "fourier-sandbox",
     "category": "Analysis",
     "difficulty": "Advanced",
     "difficultyLevel": 3,
     "description": "Deconstruct arbitrary waveforms into sinusoidal frequency harmonics.",
     "mathConcepts": ["Fourier Series", "Harmonics", "Orthogonality"],
     "controls": ["Draw with mouse to synthesize waves"],
     "path": "games/my-new-game/index.html",
     "status": "ready"
   }
   ```

3. **Optionally Import Shared Utilities or the Full `(O; i, j)` Cartesian World**:
   ```javascript
   // Spin up a complete (O; i, j) world with the living Stickman & curve plotter:
   import { CartesianWorld, derivAt } from '../../shared/cartesian-world.js';

   const world = new CartesianWorld({
     gridCanvas: 'gridCanvas',
     gameCanvas: 'gameCanvas',
     expression: 'sin(x) + 1.5',
   });

   // Or import lightweight standalone arcade helpers:
   import { Vector2D, Calculus } from '../../shared/math-engine.js';
   import { CanvasKit, ParticlePool } from '../../shared/canvas-kit.js';
   import { sound } from '../../shared/retro-audio.js';
   ```

4. **Commit & Push**:
   ```bash
   git add .
   git commit -m "feat: Add Fourier Transform Sandbox"
   git push origin main
   ```
   The Hub updates immediately!

---

## 📜 License
MIT License • Created by [Ayoub (eulerx0)](https://github.com/Ayoubvvch).
