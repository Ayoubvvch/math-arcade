/**
 * Math Arcade — Unified Orthonormal Cartesian World Engine (O; i, j)
 * Barrel export for all modular Cartesian subsystems + a high-level `CartesianWorld`
 * lifecycle controller so future games can build inside a living (O; i, j) plane
 * with Stickman, function plotting, particles, camera pan/zoom, and input in ~10 lines.
 */

import {
  CARTESIAN_CONFIG,
  CARTESIAN_THEMES,
  cartesianUtils,
  CONFIG,
  THEMES,
  utils,
} from './cartesian-config.js';
import { CoordinateGrid } from './cartesian-grid.js';
import {
  MATH_FUNCS,
  MATH_CONSTS,
  DEFAULT_FUNCTION_PRESETS,
  PRESETS,
  compileExpression,
  evalScalar,
  derivAt,
  d2At,
  FunctionPlotter,
} from './function-plotter.js';
import { ParticleSystem } from './cartesian-particles.js';
import { InputManager } from './cartesian-input.js';
import { Stickman } from './stickman-engine.js';

export {
  CARTESIAN_CONFIG,
  CARTESIAN_THEMES,
  cartesianUtils,
  CONFIG,
  THEMES,
  utils,
  CoordinateGrid,
  MATH_FUNCS,
  MATH_CONSTS,
  DEFAULT_FUNCTION_PRESETS,
  PRESETS,
  compileExpression,
  evalScalar,
  derivAt,
  d2At,
  FunctionPlotter,
  ParticleSystem,
  InputManager,
  Stickman,
};

function resolveCanvas(target) {
  if (!target) return null;
  if (typeof target === 'string') {
    return typeof document !== 'undefined' ? document.getElementById(target) : null;
  }
  return target;
}

/**
 * High-level controller wrapping `#gridCanvas` + `#gameCanvas`, CoordinateGrid,
 * FunctionPlotter, ParticleSystem, InputManager, Stickman, camera damping,
 * pointer pan/wheel zoom, and an idle-sleeping RAF loop.
 */
export class CartesianWorld {
  constructor(options = {}) {
    const cfg = options.config ? { ...CARTESIAN_CONFIG, ...options.config } : CARTESIAN_CONFIG;
    this.config = cfg;
    this.themes = options.themes || CARTESIAN_THEMES;
    this.themeName = options.theme === 'light' ? 'light' : 'black';

    this.gridCanvas = resolveCanvas(options.gridCanvas !== undefined ? options.gridCanvas : 'gridCanvas');
    this.gameCanvas = resolveCanvas(options.gameCanvas !== undefined ? options.gameCanvas : 'gameCanvas');
    this.gridCtx =
      this.gridCanvas && typeof this.gridCanvas.getContext === 'function'
        ? this.gridCanvas.getContext('2d', { alpha: false })
        : null;
    this.ctx =
      this.gameCanvas && typeof this.gameCanvas.getContext === 'function'
        ? this.gameCanvas.getContext('2d', { alpha: true })
        : null;

    this.input = options.input || new InputManager({ config: cfg });
    this.particles = options.particles || new ParticleSystem(options.particleOptions);
    this.grid =
      options.grid ||
      new CoordinateGrid({
        config: cfg,
        targetTickPx: options.targetTickPx || 72,
      });

    const enableFunctions = options.enableFunctions !== false;
    this.functions = enableFunctions
      ? options.functions ||
        new FunctionPlotter({
          presets: options.presets,
          expression: options.expression,
          enabled: options.functionEnabled !== false,
          showDerivative: Boolean(options.showDerivative),
        })
      : null;

    this.stickman =
      options.stickman === false
        ? null
        : options.stickman ||
          new Stickman(this.particles, this.functions, {
            config: cfg,
            ...(options.stickmanOptions || {}),
          });

    this.camera = {
      x: options.cameraX ?? 0,
      y: options.cameraY ?? cfg.DEFAULT_CAM_Y,
      ppu: options.ppu ?? cfg.DEFAULT_PPU,
      targetPpu: options.ppu ?? cfg.DEFAULT_PPU,
    };

    this.followCamera = options.followCamera !== false;
    this.showProjections = options.showProjections !== false;
    this.showVelocity = Boolean(options.showVelocity);
    this.enablePanZoom = options.enablePanZoom !== false;

    this.onUpdate = typeof options.onUpdate === 'function' ? options.onUpdate : null;
    this.onRenderBeforeStickman =
      typeof options.onRenderBeforeStickman === 'function'
        ? options.onRenderBeforeStickman
        : null;
    this.onRenderAfterStickman =
      typeof options.onRenderAfterStickman === 'function'
        ? options.onRenderAfterStickman
        : null;
    this.onHudUpdate = typeof options.onHudUpdate === 'function' ? options.onHudUpdate : null;

    this.dpr = 1;
    this.dragging = false;
    this._dragLastX = 0;
    this._dragLastY = 0;

    this._rafId = 0;
    this._gpIdleTimer = 0;
    this._lastTimestamp = 0;
    this._lastRenderTimestamp = 0;
    this._forceWakeFrame = true;
    this._idleSettleFrames = 6;
    this._destroyed = false;

    this._boundResize = () => this.resize();
    this._boundWake = () => this.wake();
    this._boundVisibility = () => {
      if (typeof document !== 'undefined' && document.hidden) {
        this._stopGamepadIdlePoll();
        if (this._rafId && typeof cancelAnimationFrame === 'function') {
          cancelAnimationFrame(this._rafId);
          this._rafId = 0;
        }
      } else {
        this.wake();
      }
    };

    this.input.setWakeCallback(this._boundWake);
    this._bindWorldEvents();
    this.resize();

    if (options.autoStart !== false && this.ctx) {
      this.start();
    }
  }

  getTheme() {
    return this.themes[this.themeName] || this.themes.black;
  }

  setTheme(name) {
    this.themeName = this.themes[name] ? name : 'black';
    this.grid.cacheValid = false;
    this.wake();
    return this.themeName;
  }

  toggleTheme() {
    return this.setTheme(this.themeName === 'black' ? 'light' : 'black');
  }

  setExpression(expr, enabled = true) {
    if (!this.functions) return { ok: false, error: 'FunctionPlotter disabled' };
    const res = this.functions.setExpression(expr, enabled);
    this.wake();
    return res;
  }

  worldToScreen(wx, wy) {
    return this.grid.worldToScreen(wx, wy, this.camera);
  }

  screenToWorld(sx, sy) {
    return this.grid.screenToWorld(sx, sy, this.camera);
  }

  drawVector(x1, y1, x2, y2, label = '', color = null, opts = {}) {
    if (!this.ctx) return;
    this.grid.drawVector(this.ctx, x1, y1, x2, y2, this.camera, this.getTheme(), label, color, opts);
  }

  drawPoint(wx, wy, label = '', color = null, radius = 4.5) {
    if (!this.ctx) return;
    this.grid.drawPoint(this.ctx, wx, wy, this.camera, this.getTheme(), label, color, radius);
  }

  zoomBy(factor, anchorScreenX, anchorScreenY) {
    const prevTarget = this.camera.targetPpu;
    const nextTarget = cartesianUtils.clamp(
      prevTarget * factor,
      this.config.MIN_PPU,
      this.config.MAX_PPU
    );
    if (!this.followCamera && anchorScreenX !== undefined && anchorScreenY !== undefined) {
      const worldBefore = this.grid.screenToWorld(anchorScreenX, anchorScreenY, this.camera);
      this.camera.targetPpu = nextTarget;
      this.camera.ppu = nextTarget;
      const worldAfter = this.grid.screenToWorld(anchorScreenX, anchorScreenY, this.camera);
      this.camera.x += worldBefore.x - worldAfter.x;
      this.camera.y += worldBefore.y - worldAfter.y;
    } else {
      this.camera.targetPpu = nextTarget;
    }
    this.wake();
  }

  reset(x = 0, y = 0) {
    if (this.stickman) {
      this.stickman.resetTo(x, y);
    }
    this.particles.clear();
    this.camera.x = x;
    this.camera.y = Math.max(this.config.DEFAULT_CAM_Y, y + 1.1);
    this.followCamera = true;
    this.wake();
  }

  _computeDpr(w, h) {
    const raw = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    return w * h > 1300000 ? Math.min(raw, 1.25) : Math.min(raw, 1.5);
  }

  resize() {
    if (!this.gameCanvas) return;
    const rect = this.gameCanvas.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    this.dpr = this._computeDpr(w, h);
    const targetW = Math.floor(w * this.dpr);
    const targetH = Math.floor(h * this.dpr);

    if (this.gameCanvas.width !== targetW || this.gameCanvas.height !== targetH) {
      this.gameCanvas.width = targetW;
      this.gameCanvas.height = targetH;
    }
    if (
      this.gridCanvas &&
      (this.gridCanvas.width !== targetW || this.gridCanvas.height !== targetH)
    ) {
      this.gridCanvas.width = targetW;
      this.gridCanvas.height = targetH;
      this.grid.invalidate();
    }
    this.grid.setViewportSize(w, h, this.dpr);
    this.wake();
  }

  _bindWorldEvents() {
    if (typeof window === 'undefined') return;
    window.addEventListener('resize', this._boundResize);
    window.addEventListener('keydown', this._boundWake, { passive: true });
    window.addEventListener('pointerdown', this._boundWake, { passive: true });
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this._boundVisibility);
    }

    if (!this.gameCanvas || !this.enablePanZoom) return;

    this._onPointerDown = (e) => {
      if (e.button !== 0 && e.button !== 1) return;
      this.dragging = true;
      this._dragLastX = e.clientX;
      this._dragLastY = e.clientY;
      try {
        this.gameCanvas.setPointerCapture(e.pointerId);
      } catch (_) {}
      this.wake();
    };

    this._onPointerMove = (e) => {
      if (!this.dragging) return;
      const dx = e.clientX - this._dragLastX;
      const dy = e.clientY - this._dragLastY;
      this._dragLastX = e.clientX;
      this._dragLastY = e.clientY;
      if (Math.hypot(dx, dy) > 1) {
        this.followCamera = false;
        this.camera.x -= dx / this.camera.ppu;
        this.camera.y += dy / this.camera.ppu;
        this.wake();
      }
    };

    this._onPointerUp = (e) => {
      if (!this.dragging) return;
      this.dragging = false;
      try {
        this.gameCanvas.releasePointerCapture(e.pointerId);
      } catch (_) {}
      this.wake();
    };

    this._onWheel = (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const rect = this.gameCanvas.getBoundingClientRect();
      this.zoomBy(factor, e.clientX - rect.left, e.clientY - rect.top);
    };

    this.gameCanvas.addEventListener('pointerdown', this._onPointerDown);
    this.gameCanvas.addEventListener('pointermove', this._onPointerMove);
    this.gameCanvas.addEventListener('pointerup', this._onPointerUp);
    this.gameCanvas.addEventListener('pointercancel', this._onPointerUp);
    this.gameCanvas.addEventListener('wheel', this._onWheel, { passive: false });
  }

  _stopGamepadIdlePoll() {
    if (this._gpIdleTimer) {
      clearTimeout(this._gpIdleTimer);
      this._gpIdleTimer = 0;
    }
  }

  _scheduleGamepadIdlePoll() {
    this._stopGamepadIdlePoll();
    const isHidden = typeof document !== 'undefined' && document.hidden;
    if (!this.input.hasConnectedGamepad || isHidden || this._rafId || this._destroyed) return;
    this._gpIdleTimer = setTimeout(() => {
      this._gpIdleTimer = 0;
      if (this._destroyed || (typeof document !== 'undefined' && document.hidden) || this._rafId) {
        return;
      }
      if (this.input.isGamepadInputActive()) {
        this.wake();
      } else if (this.input.hasConnectedGamepad) {
        this._scheduleGamepadIdlePoll();
      }
    }, 150);
  }

  start() {
    this._destroyed = false;
    this.wake();
  }

  stop() {
    this._stopGamepadIdlePoll();
    if (this._rafId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this._rafId);
      this._rafId = 0;
    }
  }

  wake() {
    if (this._destroyed) return;
    this._forceWakeFrame = true;
    this._idleSettleFrames = Math.max(this._idleSettleFrames, 4);
    this._stopGamepadIdlePoll();
    const isHidden = typeof document !== 'undefined' && document.hidden;
    if (!isHidden && !this._rafId && typeof requestAnimationFrame === 'function') {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      this._lastTimestamp = now;
      this._lastRenderTimestamp = now - 100;
      this._rafId = requestAnimationFrame((ts) => this._frame(ts));
    }
  }

  _frame(now) {
    this._rafId = 0;
    if (this._destroyed || (typeof document !== 'undefined' && document.hidden)) {
      this._stopGamepadIdlePoll();
      return;
    }

    const elapsedSinceRender = now - this._lastRenderTimestamp;
    if (!this._forceWakeFrame && elapsedSinceRender < 11.5) {
      this._rafId = requestAnimationFrame((ts) => this._frame(ts));
      return;
    }

    this._forceWakeFrame = false;
    this._lastRenderTimestamp = now;
    const rawDt = (now - this._lastTimestamp) / 1000;
    this._lastTimestamp = now;
    const dt = Math.min(Math.max(rawDt, 0.001), 0.05);

    const frameInput = this.input.sampleFrame();
    if (this.stickman) {
      this.stickman.update(dt, frameInput);
    }
    this.particles.update(dt);

    let customKeepAlive = false;
    if (this.onUpdate) {
      customKeepAlive = Boolean(this.onUpdate(dt, frameInput, this));
    }

    const prevCamX = this.camera.x;
    const prevCamY = this.camera.y;
    const prevCamPpu = this.camera.ppu;
    this.camera.ppu = cartesianUtils.damp(this.camera.ppu, this.camera.targetPpu, 12, dt);

    if (this.followCamera && !this.dragging && this.stickman) {
      const targetCamX =
        this.stickman.x + this.stickman.vx * this.config.CAMERA_LOOKAHEAD_FACTOR;
      const fallOffset = this.stickman.vy < -6 ? this.stickman.vy * 0.09 : 0;
      const honoredCamY = this.config.DEFAULT_CAM_Y + 0.45;
      const targetCamY =
        this.stickman.dancing && this.stickman.danceStyle === 2
          ? honoredCamY
          : Math.max(
              this.config.DEFAULT_CAM_Y,
              this.config.DEFAULT_CAM_Y + Math.max(0, this.stickman.y - 1.35) + fallOffset
            );
      const followYSpeed =
        Math.abs(this.stickman.vy) > 10 ? 12 : this.config.CAMERA_FOLLOW_Y_SPEED;
      this.camera.x = cartesianUtils.damp(
        this.camera.x,
        targetCamX,
        this.config.CAMERA_FOLLOW_X_SPEED,
        dt
      );
      this.camera.y = cartesianUtils.damp(this.camera.y, targetCamY, followYSpeed, dt);
    }

    const camSettling =
      Math.abs(this.camera.x - prevCamX) > 1e-4 ||
      Math.abs(this.camera.y - prevCamY) > 1e-4 ||
      Math.abs(this.camera.ppu - prevCamPpu) > 1e-3 ||
      Math.abs(this.camera.ppu - this.camera.targetPpu) > 0.04;

    const movingStick = this.stickman
      ? this.stickman.dancing ||
        this.stickman.climbing ||
        !this.stickman.grounded ||
        Math.abs(this.stickman.vx) > 0.015 ||
        Math.abs(this.stickman.vy) > 0.015 ||
        (this.stickman.surfingCurve &&
          (Math.abs(this.stickman.curveSpeed) > 0.015 ||
            Math.abs(Math.sin(this.stickman.curveSlopeAngle)) > 0.02)) ||
        this.stickman.dashTimer > 0 ||
        this.stickman.flipTimer > 0 ||
        this.stickman.heavyLandTimer > 0 ||
        this.stickman.landSquash > 0.01 ||
        this.stickman.danceBlend > 0.02
      : false;

    const keepLoopRunning =
      movingStick ||
      customKeepAlive ||
      this.particles.hasAny() ||
      this.dragging ||
      camSettling ||
      this.input.hasActiveInput() ||
      this.input.isGamepadInputActive();

    if (keepLoopRunning) {
      this._idleSettleFrames = 6;
    } else if (this._idleSettleFrames > 0) {
      this._idleSettleFrames--;
    }

    const theme = this.getTheme();
    if (this.gridCtx) {
      this.grid.render(this.gridCtx, this.camera, theme);
    }

    if (this.ctx && this.gameCanvas) {
      const ctx = this.ctx;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

      if (this.stickman) {
        this.grid.renderAxisClimbCue(ctx, this.stickman, this.camera, theme);
      }
      if (this.functions) {
        this.functions.render(ctx, this.camera, this.grid, theme, this.stickman);
      }
      if (this.onRenderBeforeStickman) {
        this.onRenderBeforeStickman(ctx, this, theme);
      }
      this.particles.render(ctx, this.camera, this.grid, theme);
      if (this.stickman) {
        this.stickman.render(ctx, this.camera, this.grid, theme);
        this.grid.renderStickmanOverlays(ctx, this.stickman, this.camera, theme, {
          showProjections: this.showProjections,
          showVelocity: this.showVelocity,
        });
      }
      if (this.onRenderAfterStickman) {
        this.onRenderAfterStickman(ctx, this, theme);
      }

      ctx.restore();
    }

    if (this.onHudUpdate) {
      this.onHudUpdate(frameInput, this);
    }

    if (keepLoopRunning || this._idleSettleFrames > 0) {
      this._rafId = requestAnimationFrame((ts) => this._frame(ts));
    } else if (this.input.hasConnectedGamepad) {
      this._scheduleGamepadIdlePoll();
    }
  }

  destroy() {
    this._destroyed = true;
    this.stop();
    this.input.destroy();
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this._boundResize);
      window.removeEventListener('keydown', this._boundWake);
      window.removeEventListener('pointerdown', this._boundWake);
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this._boundVisibility);
    }
    if (this.gameCanvas && this._onPointerDown) {
      this.gameCanvas.removeEventListener('pointerdown', this._onPointerDown);
      this.gameCanvas.removeEventListener('pointermove', this._onPointerMove);
      this.gameCanvas.removeEventListener('pointerup', this._onPointerUp);
      this.gameCanvas.removeEventListener('pointercancel', this._onPointerUp);
      this.gameCanvas.removeEventListener('wheel', this._onWheel);
    }
  }
}

// Expose namespace in browser contexts for console inspection & scripting convenience
if (typeof window !== 'undefined') {
  window.MathStickGame = {
    ...(window.MathStickGame || {}),
    CONFIG: CARTESIAN_CONFIG,
    THEMES: CARTESIAN_THEMES,
    utils: cartesianUtils,
    CARTESIAN_CONFIG,
    CARTESIAN_THEMES,
    cartesianUtils,
    CoordinateGrid,
    FunctionPlotter,
    ParticleSystem,
    InputManager,
    Stickman,
    CartesianWorld,
    compileExpression,
    evalScalar,
    derivAt,
    d2At,
  };
}
