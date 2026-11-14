/**
 * Complex Plane Duel: Argand Orbit Survivor
 * PlayStation DualSense Controller, Touch Joystick & Input Manager
 */

import { PLAYSTATION_MAP, toScreenX, toScreenY } from './config.js';
import { audio } from './audio.js';

export class ControlsManager {
  constructor(canvas) {
    this.canvas = canvas;

    this.moveX = 0;
    this.moveY = 0;
    this.facingAng = 0;
    this.isBraking = false;

    this.actions = {
      eulerRotate: false,
      affixBeam: false,
      rootsBarrier: false,
      homothetyBlast: false,
      conjugateFlip: false,
      cycleRootsPrev: false,
      cycleRootsNext: false,
      togglePilot: false,
      pauseToggle: false
    };

    this.gamepadConnected = false;
    this.gamepadIndex = -1;
    this.prevButtons = {};

    this.keys = {};

    this.touchJoystick = {
      active: false,
      identifier: null,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      dx: 0,
      dy: 0
    };

    this.initListeners();
  }

  initListeners() {
    window.addEventListener('gamepadconnected', (e) => {
      this.gamepadConnected = true;
      this.gamepadIndex = e.gamepad.index;
      this.updateGamepadBadge(true, e.gamepad.id);
      audio.triggerRumble(0.2, 0.4, 180);
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      if (this.gamepadIndex === e.gamepad.index) {
        this.gamepadConnected = false;
        this.gamepadIndex = -1;
        this.updateGamepadBadge(false);
      }
    });

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      if (e.code === 'Space') {
        this.actions.eulerRotate = true;
        e.preventDefault();
      } else if (e.code === 'KeyF') {
        this.actions.affixBeam = true;
      } else if (e.code === 'KeyE') {
        this.actions.rootsBarrier = true;
      } else if (e.code === 'KeyQ') {
        this.actions.homothetyBlast = true;
      } else if (e.code === 'KeyC') {
        this.actions.conjugateFlip = true;
      } else if (e.code === 'BracketLeft') {
        this.actions.cycleRootsPrev = true;
      } else if (e.code === 'BracketRight') {
        this.actions.cycleRootsNext = true;
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        this.actions.pauseToggle = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    if (this.canvas) {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * this.canvas.width;
        const my = ((e.clientY - rect.top) / rect.height) * this.canvas.height;
        this.lastMousePos = { x: mx, y: my };
      });

      this.canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
          this.actions.affixBeam = true;
        } else if (e.button === 2) {
          this.actions.eulerRotate = true;
          e.preventDefault();
        }
      });

      this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Touch Virtual Joystick
    const touchStickArea = document.getElementById('touchStickArea');
    if (touchStickArea) {
      touchStickArea.addEventListener('touchstart', (e) => {
        if (this.touchJoystick.active) return;
        const touch = e.changedTouches[0];
        this.touchJoystick.active = true;
        this.touchJoystick.identifier = touch.identifier;
        const rect = this.canvas.getBoundingClientRect();
        this.touchJoystick.startX = ((touch.clientX - rect.left) / rect.width) * this.canvas.width;
        this.touchJoystick.startY = ((touch.clientY - rect.top) / rect.height) * this.canvas.height;
        this.touchJoystick.currentX = this.touchJoystick.startX;
        this.touchJoystick.currentY = this.touchJoystick.startY;
        this.touchJoystick.dx = 0;
        this.touchJoystick.dy = 0;
      }, { passive: false });

      touchStickArea.addEventListener('touchmove', (e) => {
        if (!this.touchJoystick.active) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          if (touch.identifier === this.touchJoystick.identifier) {
            const rect = this.canvas.getBoundingClientRect();
            this.touchJoystick.currentX = ((touch.clientX - rect.left) / rect.width) * this.canvas.width;
            this.touchJoystick.currentY = ((touch.clientY - rect.top) / rect.height) * this.canvas.height;
            const maxDist = 65;
            const rx = this.touchJoystick.currentX - this.touchJoystick.startX;
            const ry = this.touchJoystick.currentY - this.touchJoystick.startY;
            const dist = Math.hypot(rx, ry);
            if (dist > 0.001) {
              const clampedDist = Math.min(dist, maxDist);
              this.touchJoystick.dx = (rx / dist) * (clampedDist / maxDist);
              this.touchJoystick.dy = (ry / dist) * (clampedDist / maxDist);
            }
            break;
          }
        }
      }, { passive: false });

      const endTouch = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === this.touchJoystick.identifier) {
            this.touchJoystick.active = false;
            this.touchJoystick.identifier = null;
            this.touchJoystick.dx = 0;
            this.touchJoystick.dy = 0;
            break;
          }
        }
      };
      touchStickArea.addEventListener('touchend', endTouch);
      touchStickArea.addEventListener('touchcancel', endTouch);
    }

    // Touch Buttons
    const bindTouch = (id, action) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        this.actions[action] = true;
        el.classList.add('active');
        e.preventDefault();
      }, { passive: false });
      el.addEventListener('touchend', () => el.classList.remove('active'));
      el.addEventListener('touchcancel', () => el.classList.remove('active'));
    };

    bindTouch('touchRotateBtn', 'eulerRotate');
    bindTouch('touchBeamBtn', 'affixBeam');
    bindTouch('touchShieldBtn', 'rootsBarrier');
    bindTouch('touchHomothetyBtn', 'homothetyBlast');
  }

  updateGamepadBadge(connected, name = '') {
    const padStatus = document.getElementById('padStatus');
    const padDot = document.getElementById('padDot');
    if (!padStatus || !padDot) return;

    if (connected) {
      padStatus.textContent = name.toLowerCase().includes('dualsense') || name.toLowerCase().includes('wireless controller')
        ? 'PS5 DUALSENSE READY'
        : 'PLAYSTATION CONTROLLER ACTIVE';
      padStatus.style.color = '#00ff88';
      padDot.style.background = '#00ff88';
      padDot.style.boxShadow = '0 0 8px #00ff88';
    } else {
      padStatus.textContent = 'DUALSENSE: CONNECT VIA USB / BT';
      padStatus.style.color = '#64748b';
      padDot.style.background = '#64748b';
      padDot.style.boxShadow = 'none';
    }
  }

  poll(playerRe, playerIm) {
    let mx = 0;
    let my = 0;
    let newAimAng = null;
    this.isBraking = false;

    // 1. PlayStation Gamepad Polling
    if (navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      const gp = (this.gamepadIndex >= 0 && gamepads[this.gamepadIndex]) ? gamepads[this.gamepadIndex] : null;

      if (gp && gp.connected) {
        if (!this.gamepadConnected) {
          this.gamepadConnected = true;
          this.updateGamepadBadge(true, gp.id);
        }

        const deadzone = 0.16;
        const stickLx = gp.axes[0] || 0;
        const stickLy = gp.axes[1] || 0;
        if (Math.hypot(stickLx, stickLy) > deadzone) {
          mx += stickLx;
          my -= stickLy; // Invert for complex imaginary plane
        }

        // D-Pad
        if (gp.buttons[PLAYSTATION_MAP.DPAD_UP]?.pressed) my += 1;
        if (gp.buttons[PLAYSTATION_MAP.DPAD_DOWN]?.pressed) my -= 1;
        if (gp.buttons[PLAYSTATION_MAP.DPAD_LEFT]?.pressed) mx -= 1;
        if (gp.buttons[PLAYSTATION_MAP.DPAD_RIGHT]?.pressed) mx += 1;

        // Right Stick Aiming
        const stickRx = gp.axes[2] || 0;
        const stickRy = gp.axes[3] || 0;
        if (Math.hypot(stickRx, stickRy) > deadzone) {
          newAimAng = Math.atan2(-stickRy, stickRx);
        }

        const isPressed = (b) => Boolean(gp.buttons[b]?.pressed);
        const isJustPressed = (b) => isPressed(b) && !this.prevButtons[b];

        // ✕ (Cross): Euler Rotation Dash
        if (isJustPressed(PLAYSTATION_MAP.CROSS)) this.actions.eulerRotate = true;

        // ▢ (Square) or R2: Affix Laser
        if (isJustPressed(PLAYSTATION_MAP.SQUARE) || isPressed(PLAYSTATION_MAP.R2)) {
          this.actions.affixBeam = true;
        }

        // ◯ (Circle): Roots of Unity Barrier
        if (isJustPressed(PLAYSTATION_MAP.CIRCLE)) this.actions.rootsBarrier = true;

        // △ (Triangle): Homothety Shockwave
        if (isJustPressed(PLAYSTATION_MAP.TRIANGLE)) this.actions.homothetyBlast = true;

        // L2: Conjugate Flip
        if (isJustPressed(PLAYSTATION_MAP.L2)) this.actions.conjugateFlip = true;

        // L1 / R1: Cycle Roots Order
        if (isJustPressed(PLAYSTATION_MAP.L1)) this.actions.cycleRootsPrev = true;
        if (isJustPressed(PLAYSTATION_MAP.R1)) this.actions.cycleRootsNext = true;

        // START: Pause
        if (isJustPressed(PLAYSTATION_MAP.START)) this.actions.pauseToggle = true;

        // SELECT: Pilot Mode
        if (isJustPressed(PLAYSTATION_MAP.SELECT)) this.actions.togglePilot = true;

        for (let b = 0; b < gp.buttons.length; b++) {
          this.prevButtons[b] = gp.buttons[b]?.pressed;
        }
      }
    }

    // 2. Keyboard
    if (this.keys['KeyW'] || this.keys['ArrowUp']) my += 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) my -= 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) mx -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) mx += 1;
    if (this.keys['ShiftLeft'] || this.keys['ShiftRight']) this.isBraking = true;

    // 3. Touch
    if (this.touchJoystick.active) {
      mx += this.touchJoystick.dx;
      my -= this.touchJoystick.dy;
    }

    const moveLen = Math.hypot(mx, my);
    if (moveLen > 1) {
      this.moveX = mx / moveLen;
      this.moveY = my / moveLen;
    } else {
      this.moveX = mx;
      this.moveY = my;
    }

    if (newAimAng !== null) {
      this.facingAng = newAimAng;
    } else if (this.lastMousePos && this.canvas) {
      const px = toScreenX(playerRe);
      const py = toScreenY(playerIm);
      this.facingAng = Math.atan2(-(this.lastMousePos.y - py), this.lastMousePos.x - px);
    } else if (moveLen > 0.15) {
      this.facingAng = Math.atan2(this.moveY, this.moveX);
    }
  }

  consume(action) {
    const val = this.actions[action];
    this.actions[action] = false;
    return val;
  }
}
