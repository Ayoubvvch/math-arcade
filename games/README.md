# 🎮 Math Arcade Games Directory

Every game in this arcade lives in its own self-contained subfolder:

```
games/
├── math-battle/
│   ├── index.html       # Standalone game runner
│   ├── style.css        # Game-specific styles
│   ├── js/              # Modular game scripts
│   └── README.md        # Math principles & rules
└── <new-game>/
```

## Guidelines for New Games:
1. **Self-Contained & Lightweight**:
   - Prefer vanilla HTML5, Canvas 2D / WebGL, and modern ES6 modules.
   - Use hardware-accelerated rendering and object pooling to avoid GC pauses on mobile devices.
2. **Back Navigation**:
   - Provide a top-left button linking back to `../../index.html?from=game` (the Math Arcade Hub).
3. **Shared Utilities**:
   - You can import shared modules from `../../shared/`:
     - `cartesian-world.js`: Unified Orthonormal Cartesian Engine `(O; i, j)` (`CartesianWorld`, plus all modules below).
     - `cartesian-config.js`: Physics/scale presets, themes & math helpers (`CARTESIAN_CONFIG`, `CARTESIAN_THEMES`, `cartesianUtils`).
     - `cartesian-grid.js`: Adaptive orthonormal grid `(O; i, j)`, `(x, y)` projections, vectors & points (`CoordinateGrid`).
     - `function-plotter.js`: Safe recursive-descent expression parser, `Path2D` plotter, 1st/2nd derivatives (`FunctionPlotter`, `compileExpression`, `evalScalar`, `derivAt`, `d2At`).
     - `cartesian-particles.js`: Zero-GC world-space particle effects (`ParticleSystem`).
     - `cartesian-input.js`: Unified keyboard, W3C Gamepad, and virtual touch input (`InputManager`).
     - `stickman-engine.js`: Living IK/FK Stickman with `y = f(x)` slope surfing, `x = 0` climbing, free-fall & dash/dance (`Stickman`).
     - `math-engine.js`, `canvas-kit.js`, `gamepad.js`, `retro-audio.js`, `katex-kit.js`.
4. **Quick Start Inside `(O; i, j)`**:
   ```javascript
   import { CartesianWorld } from '../../shared/cartesian-world.js';

   const world = new CartesianWorld({
     gridCanvas: 'gridCanvas',
     gameCanvas: 'gameCanvas',
     expression: '0.3 * x^2 + 0.5',
     onRenderAfterStickman(ctx, w, theme) {
       w.drawPoint(2, 1.7, 'M(2, 1.7)', theme.vecV);
       w.drawVector(0, 0, 2, 1.7, 'OM', theme.vecJ);
     },
   });
   ```
5. **Registration**:
   - Add your game metadata to `games.json` in the root folder so the Hub displays it automatically!
