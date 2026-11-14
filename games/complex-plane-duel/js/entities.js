/**
 * Complex Plane Duel: Argand Orbit Survivor
 * Entities, Complex Satellites & Object Pools
 */

import { Complex } from './complex-math.js';
import { PLAYER_CONFIG, ROOTS_OF_UNITY_PRESETS, ARGAND_ARENA } from './config.js';

export function createPlayer() {
  return {
    pos: new Complex(0, -3.2),
    vel: new Complex(0, 0),
    radius: PLAYER_CONFIG.radius,
    color: PLAYER_CONFIG.color,
    facingAng: Math.PI / 2,

    hp: PLAYER_CONFIG.maxHp,
    maxHp: PLAYER_CONFIG.maxHp,
    score: 0,
    eliminations: 0,
    invulnerableTimer: 0,

    // Euler Rotation Dash
    isDashing: false,
    dashTimer: 0,
    dashCharges: 3,
    maxDashCharges: 3,
    dashRechargeTimer: 0,

    // Affix Laser Beams
    beamCooldown: 0,

    // Roots of Unity Shield Barrier
    rootsIndex: 0, // default 3rd roots
    rootsPhase: 0,
    barrierActive: false,
    barrierTimer: 0,
    barrierCooldown: 0,

    // Homothety Shockwave
    homothetyEnergy: 100,
    maxHomothetyEnergy: PLAYER_CONFIG.homothetyEnergyMax,

    trail: []
  };
}

export class ObjectPools {
  constructor() {
    this.MAX_BEAMS = 30;
    this.MAX_PARTICLES = 160;
    this.MAX_POPUPS = 30;

    this.beams = Array.from({ length: this.MAX_BEAMS }, () => ({
      active: false,
      pos: new Complex(0, 0),
      vel: new Complex(0, 0),
      life: 0,
      maxLife: 1.2,
      isReal: true // Re vs Im pulse
    }));

    this.particles = Array.from({ length: this.MAX_PARTICLES }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      color: '#00f0ff',
      size: 2,
      alpha: 1.0,
      life: 0,
      maxLife: 35
    }));

    this.popups = Array.from({ length: this.MAX_POPUPS }, () => ({
      active: false,
      text: '',
      x: 0,
      y: 0,
      vy: -1.6,
      color: '#00f0ff',
      alpha: 1.0,
      life: 0,
      maxLife: 45
    }));

    this.shockwaves = [];
  }

  reset() {
    this.beams.forEach(b => (b.active = false));
    this.particles.forEach(p => (p.active = false));
    this.popups.forEach(p => (p.active = false));
    this.shockwaves = [];
  }

  spawnBeam(pos, vel, isReal = true) {
    const b = this.beams.find(item => !item.active);
    if (!b) return;
    b.active = true;
    b.pos = new Complex(pos.re, pos.im);
    b.vel = new Complex(vel.re, vel.im);
    b.life = 0;
    b.maxLife = 1.2;
    b.isReal = isReal;
  }

  spawnParticle(x, y, color = '#00f0ff', size = 2.5, maxLife = 35) {
    const p = this.particles.find(item => !item.active);
    if (!p) return;
    p.active = true;
    p.x = x;
    p.y = y;
    const ang = Math.random() * Math.PI * 2;
    const spd = Math.random() * 3.5 + 1.0;
    p.vx = Math.cos(ang) * spd;
    p.vy = Math.sin(ang) * spd;
    p.color = color;
    p.size = size;
    p.alpha = 1.0;
    p.life = 0;
    p.maxLife = maxLife;
  }

  spawnPopup(text, x, y, color = '#00f0ff') {
    const p = this.popups.find(item => !item.active);
    if (!p) return;
    p.active = true;
    p.text = text;
    p.x = x;
    p.y = y;
    p.vy = -1.5;
    p.color = color;
    p.alpha = 1.0;
    p.life = 0;
    p.maxLife = 40;
  }

  spawnShockwave(x, y, maxR = 90, color = '#00f0ff') {
    this.shockwaves.push({
      x,
      y,
      r: 10,
      maxR,
      color,
      alpha: 1.0
    });
  }

  update(dt) {
    // 1. Beams
    this.beams.forEach(b => {
      if (!b.active) return;
      b.pos = b.pos.add(b.vel.scale(dt));
      b.life += dt;
      if (
        b.life >= b.maxLife ||
        b.pos.re < ARGAND_ARENA.reMin - 0.5 ||
        b.pos.re > ARGAND_ARENA.reMax + 0.5 ||
        b.pos.im < ARGAND_ARENA.imMin - 0.5 ||
        b.pos.im > ARGAND_ARENA.imMax + 0.5
      ) {
        b.active = false;
      }
    });

    // 2. Particles
    this.particles.forEach(p => {
      if (!p.active) return;
      p.life += dt * 30;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      if (p.life >= p.maxLife) p.active = false;
    });

    // 3. Popups
    this.popups.forEach(p => {
      if (!p.active) return;
      p.life += dt * 30;
      p.y += p.vy;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      if (p.life >= p.maxLife) p.active = false;
    });

    // 4. Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.r += dt * 320;
      sw.alpha = Math.max(0, 1 - sw.r / sw.maxR);
      if (sw.r >= sw.maxR) {
        this.shockwaves.splice(i, 1);
      }
    }
  }
}
