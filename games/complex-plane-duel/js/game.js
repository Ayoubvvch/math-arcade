/**
 * Complex Plane Duel: Argand Orbit Survivor
 * Master Game Loop & Complex Dynamics Coordinator
 */

import { Complex } from './complex-math.js';
import {
  ARGAND_ARENA,
  PLAYER_CONFIG,
  ROOTS_OF_UNITY_PRESETS,
  toScreenX,
  toScreenY
} from './config.js';
import { audio } from './audio.js';
import { ControlsManager } from './controls.js';
import { createPlayer, ObjectPools } from './entities.js';
import { ArgandRenderer } from './renderer.js';

export class ComplexPlaneGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    this.pools = new ObjectPools();
    this.controls = new ControlsManager(this.canvas);
    this.renderer = new ArgandRenderer(this.canvas, this.ctx);

    this.gameState = 'COUNTDOWN';
    this.countdownTimer = 3.0;
    this.wave = 1;
    this.maxWaves = 4;
    this.isRunning = true;
    this.isPlayerControlled = true;

    this.player = createPlayer();
    this.enemies = [];
    this.nextEnemyId = 1;
    this.screenShake = 0;

    this.lastTime = performance.now();

    this.initDOM();
    this.startWave(this.wave);

    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initDOM() {
    const btnStart = document.getElementById('btnStart');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        this.isRunning = !this.isRunning;
        btnStart.textContent = this.isRunning ? '⏸ PAUSE BATTLE' : '▶ RESUME BATTLE';
      });
    }

    const btnRestart = document.getElementById('btnRestart');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        audio.init();
        this.wave = 1;
        this.player = createPlayer();
        this.pools.reset();
        this.startWave(this.wave);
        this.isRunning = true;
        if (btnStart) btnStart.textContent = '⏸ PAUSE BATTLE';
      });
    }

    const btnAudio = document.getElementById('btnAudio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        const enabled = audio.toggle();
        btnAudio.textContent = enabled ? '🔊 AUDIO: ON' : '🔇 AUDIO: MUTED';
      });
    }

    const btnRoots = document.getElementById('btnRootsOrder');
    if (btnRoots) {
      btnRoots.addEventListener('click', () => {
        this.cycleRootsOrder(1);
      });
    }
  }

  cycleRootsOrder(dir = 1) {
    const total = ROOTS_OF_UNITY_PRESETS.length;
    this.player.rootsIndex = (this.player.rootsIndex + dir + total) % total;
    const preset = ROOTS_OF_UNITY_PRESETS[this.player.rootsIndex];
    audio.play('roots_barrier', 0, 1.2);
    this.pools.spawnPopup(`ROOTS ORDER: n=${preset.n} (${preset.glyph})`, toScreenX(this.player.pos.re), toScreenY(this.player.pos.im) - 30, preset.color);
    const btnRoots = document.getElementById('btnRootsOrder');
    if (btnRoots) btnRoots.textContent = `ROOTS: n=${preset.n} ${preset.glyph}`;
  }

  startWave(waveNum) {
    this.wave = waveNum;
    this.gameState = 'COUNTDOWN';
    this.countdownTimer = 3.0;
    this.enemies = [];

    const enemyCount = 4 + waveNum * 2;
    for (let i = 0; i < enemyCount; i++) {
      const ang = (i * 2 * Math.PI) / enemyCount;
      const r = 2.5 + Math.random() * 2.2;
      const pos = Complex.fromPolar(r, ang);
      const spd = 0.8 + waveNum * 0.25;

      let type = 'spore';
      let label = 'z²';
      let color = '#ff007f';
      let hp = 30 + waveNum * 10;
      let radius = 22;

      if (waveNum === 2) {
        type = 'cauchy';
        label = '1/z';
        color = '#c026d3';
        hp = 45;
        radius = 24;
      } else if (waveNum === 3) {
        type = 'moebius';
        label = 'eᶻ';
        color = '#ffd700';
        hp = 60;
        radius = 26;
      } else if (waveNum >= 4) {
        type = 'sovereign';
        label = 'z⁴=1';
        color = '#ff0055';
        hp = 110;
        radius = 32;
      }

      this.enemies.push({
        id: this.nextEnemyId++,
        type,
        label,
        color,
        pos,
        vel: new Complex((Math.random() - 0.5) * spd, (Math.random() - 0.5) * spd),
        hp,
        maxHp: hp,
        radius,
        angSpeed: (Math.random() - 0.5) * 1.5
      });
    }
  }

  triggerEulerRotate() {
    if (this.player.dashCharges <= 0) return;
    this.player.dashCharges--;
    this.player.isDashing = true;
    this.player.dashTimer = PLAYER_CONFIG.dashDuration;
    this.player.invulnerableTimer = PLAYER_CONFIG.invulnerableDuration;

    // Euler rotation: z' = z * e^(i * pi/3) (60 degree phase shift orbit!)
    const oldPos = this.player.pos;
    this.player.pos = this.player.pos.rotate(Math.PI / 3);

    // Particle arc connecting old and new positions
    for (let k = 0; k < 18; k++) {
      const interp = oldPos.rotate((Math.PI / 3) * (k / 18));
      this.pools.spawnParticle(toScreenX(interp.re), toScreenY(interp.im), '#00f0ff', 2.8, 30);
    }

    audio.play('euler_rotate', this.player.pos.re / 6.0);
    audio.triggerRumble(0.3, 0.6, 140);
    this.pools.spawnPopup('z ↦ z·e^(iπ/3)', toScreenX(this.player.pos.re), toScreenY(this.player.pos.im) - 30, '#00f0ff');
  }

  triggerAffixBeam() {
    if (this.player.beamCooldown > 0) return;
    this.player.beamCooldown = PLAYER_CONFIG.beamCooldown;

    const spd = 16.0;
    const vel = new Complex(Math.cos(this.player.facingAng) * spd, Math.sin(this.player.facingAng) * spd);

    // Spawn dual orthogonal pulses (Real & Imaginary)
    this.pools.spawnBeam(this.player.pos, vel, true);

    audio.play('affix_beam', this.player.pos.re / 6.0);
    audio.triggerRumble(0.12, 0.25, 70);
  }

  triggerRootsBarrier() {
    if (this.player.barrierActive || this.player.barrierCooldown > 0) return;
    this.player.barrierActive = true;
    this.player.barrierTimer = PLAYER_CONFIG.barrierDuration;
    this.player.barrierCooldown = PLAYER_CONFIG.barrierCooldown;

    const preset = ROOTS_OF_UNITY_PRESETS[this.player.rootsIndex];
    audio.play('roots_barrier', 0, 1.0);
    audio.triggerRumble(0.5, 0.8, 220);
    this.pools.spawnShockwave(toScreenX(this.player.pos.re), toScreenY(this.player.pos.im), 180, preset.color);
    this.pools.spawnPopup(`z^${preset.n} = 1 BARRIER`, toScreenX(this.player.pos.re), toScreenY(this.player.pos.im) - 40, preset.color);
  }

  triggerHomothetyBlast() {
    if (this.player.homothetyEnergy < 100) return;
    this.player.homothetyEnergy = 0;
    this.screenShake = 22;

    audio.play('homothety_blast', 0, 1.0);
    audio.triggerRumble(0.8, 1.0, 360);

    this.pools.spawnShockwave(toScreenX(this.player.pos.re), toScreenY(this.player.pos.im), 380, '#b537f2');
    this.pools.spawnPopup('💥 HOMOTHETY METRIC SHOCK', toScreenX(this.player.pos.re), toScreenY(this.player.pos.im) - 45, '#ffd700');

    // Shatter and push all enemy singularities
    this.enemies.forEach(e => {
      const d = this.player.pos.sub(e.pos).modulus();
      if (d <= 5.0) {
        e.hp -= 50;
        e.pos = e.pos.scale(1.4); // Homothety metric dilation
        this.pools.spawnParticle(toScreenX(e.pos.re), toScreenY(e.pos.im), '#b537f2', 4, 40);
      }
    });
    this.cleanupDeadEnemies();
  }

  triggerConjugateFlip() {
    // z -> z_bar (flip imaginary component)
    this.player.pos = this.player.pos.conjugate();
    this.player.vel = this.player.vel.conjugate();
    audio.play('conjugate_flip', this.player.pos.re / 6.0);
    audio.triggerRumble(0.25, 0.5, 120);
    this.pools.spawnPopup('z ↦ z̄ [CONJUGATE]', toScreenX(this.player.pos.re), toScreenY(this.player.pos.im) - 25, '#ffd700');
  }

  cleanupDeadEnemies() {
    const dead = this.enemies.filter(e => e.hp <= 0);
    dead.forEach(e => {
      this.player.score += 150;
      this.player.eliminations++;
      if (this.player.homothetyEnergy < 100) {
        this.player.homothetyEnergy = Math.min(100, this.player.homothetyEnergy + 12);
      }
      audio.play('pole_crush', e.pos.re / 6.0);
      audio.triggerRumble(0.3, 0.6, 150);
      for (let k = 0; k < 25; k++) {
        this.pools.spawnParticle(toScreenX(e.pos.re), toScreenY(e.pos.im), e.color, 3.5, 45);
      }
      this.pools.spawnPopup('+150 | POLE CLEARED', toScreenX(e.pos.re), toScreenY(e.pos.im), '#00ff88');
    });
    this.enemies = this.enemies.filter(e => e.hp > 0);

    if (this.enemies.length === 0) {
      if (this.wave < this.maxWaves) {
        this.startWave(this.wave + 1);
      } else {
        this.gameState = 'VICTORY';
        audio.play('victory');
        audio.triggerRumble(0.7, 1.0, 500);
      }
    }
  }

  updatePlayerPhysics(dt) {
    const p = this.player;

    if (p.invulnerableTimer > 0) p.invulnerableTimer -= dt;
    if (p.beamCooldown > 0) p.beamCooldown -= dt;

    // Dash recharge
    if (p.dashCharges < p.maxDashCharges) {
      p.dashRechargeTimer += dt;
      if (p.dashRechargeTimer >= 0.8) {
        p.dashCharges++;
        p.dashRechargeTimer = 0;
      }
    }

    if (p.isDashing) {
      p.dashTimer -= dt;
      if (p.dashTimer <= 0) p.isDashing = false;
    }

    // Roots Barrier Timers
    p.rootsPhase += dt * 1.8; // Rotate satellite polygon continuously
    if (p.barrierActive) {
      p.barrierTimer -= dt;
      if (p.barrierTimer <= 0) p.barrierActive = false;
    }
    if (p.barrierCooldown > 0) p.barrierCooldown -= dt;

    // Controls
    this.controls.poll(p.pos.re, p.pos.im);
    p.facingAng = this.controls.facingAng;

    if (this.controls.consume('eulerRotate')) this.triggerEulerRotate();
    if (this.controls.consume('affixBeam')) this.triggerAffixBeam();
    if (this.controls.consume('rootsBarrier')) this.triggerRootsBarrier();
    if (this.controls.consume('homothetyBlast')) this.triggerHomothetyBlast();
    if (this.controls.consume('conjugateFlip')) this.triggerConjugateFlip();
    if (this.controls.consume('cycleRootsPrev')) this.cycleRootsOrder(-1);
    if (this.controls.consume('cycleRootsNext')) this.cycleRootsOrder(1);

    // Movement
    if (!p.isDashing) {
      const spd = PLAYER_CONFIG.baseSpeed;
      const targetVx = this.controls.moveX * spd;
      const targetVy = this.controls.moveY * spd;
      p.vel.re += (targetVx - p.vel.re) * Math.min(1.0, 8.0 * dt);
      p.vel.im += (targetVy - p.vel.im) * Math.min(1.0, 8.0 * dt);
    }

    p.pos = p.pos.add(p.vel.scale(dt));

    // Clamp within Argand domain [-5.5, 5.5]
    p.pos.re = Math.max(-5.5, Math.min(5.5, p.pos.re));
    p.pos.im = Math.max(-5.5, Math.min(5.5, p.pos.im));

    // Trail
    p.trail.unshift({ x: toScreenX(p.pos.re), y: toScreenY(p.pos.im) });
    if (p.trail.length > 14) p.trail.pop();
  }

  updateEnemies(dt) {
    this.enemies.forEach(e => {
      // Rotate trajectory in complex orbit
      e.pos = e.pos.add(e.vel.scale(dt));

      // Wall bounce
      if (e.pos.re < ARGAND_ARENA.reMin + 0.6 || e.pos.re > ARGAND_ARENA.reMax - 0.6) {
        e.vel.re = -e.vel.re;
      }
      if (e.pos.im < ARGAND_ARENA.imMin + 0.6 || e.pos.im > ARGAND_ARENA.imMax - 0.6) {
        e.vel.im = -e.vel.im;
      }

      // Orbital gravitational drift towards player
      const diff = this.player.pos.sub(e.pos);
      const dist = diff.modulus();
      if (dist > 0.4) {
        const pull = 0.6 / (dist + 0.5);
        e.vel.re += (diff.re / dist) * pull * dt;
        e.vel.im += (diff.im / dist) * pull * dt;
      }
    });
  }

  updateCollisions() {
    const p = this.player;

    // 1. Beams vs Enemies
    this.pools.beams.forEach(b => {
      if (!b.active) return;
      for (const e of this.enemies) {
        const d = b.pos.sub(e.pos).modulus();
        if (d < (e.radius / 35)) {
          b.active = false;
          e.hp -= 20;
          this.pools.spawnParticle(toScreenX(e.pos.re), toScreenY(e.pos.im), e.color, 2.5, 20);
          audio.triggerRumble(0.15, 0.3, 60);
          break;
        }
      }
    });

    // 2. Roots of Unity Barrier vs Enemies
    if (p.barrierActive) {
      const preset = ROOTS_OF_UNITY_PRESETS[p.rootsIndex];
      const roots = Complex.getRootsOfUnity(preset.n, PLAYER_CONFIG.shieldRadius / 35, p.rootsPhase);

      this.enemies.forEach(e => {
        roots.forEach(rt => {
          const satPos = p.pos.add(rt.z);
          const d = satPos.sub(e.pos).modulus();
          if (d < (e.radius / 35) + 0.4) {
            e.hp -= 40;
            e.vel = e.pos.sub(p.pos).scale(2.0); // Deflect enemy away!
            this.pools.spawnShockwave(toScreenX(satPos.re), toScreenY(satPos.im), 40, preset.color);
            audio.triggerRumble(0.3, 0.6, 120);
          }
        });
      });
    }

    // 3. Player vs Enemies
    this.enemies.forEach(e => {
      const d = p.pos.sub(e.pos).modulus();
      if (d < (p.radius + e.radius) / 35) {
        if (p.isDashing) {
          e.hp -= 35;
          this.pools.spawnParticle(toScreenX(e.pos.re), toScreenY(e.pos.im), '#00f0ff', 3, 30);
        } else if (p.invulnerableTimer <= 0) {
          p.hp = Math.max(0, p.hp - 15);
          p.invulnerableTimer = 0.5;
          this.screenShake = 12;
          audio.play('gameover', 0, 1.5);
          audio.triggerRumble(0.5, 0.8, 200);
          this.pools.spawnPopup('-15 HP', toScreenX(p.pos.re), toScreenY(p.pos.im) - 20, '#ff0055');

          if (p.hp <= 0) {
            this.gameState = 'GAMEOVER';
            audio.play('gameover');
            audio.triggerRumble(0.8, 1.0, 500);
          }
        }
      }
    });

    this.cleanupDeadEnemies();
  }

  loop(timestamp) {
    const rawDt = Math.min(0.08, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    if (this.isRunning) {
      if (this.screenShake > 0) {
        this.screenShake = Math.max(0, this.screenShake - rawDt * 30);
      }

      if (this.gameState === 'COUNTDOWN') {
        this.countdownTimer -= rawDt;
        if (this.countdownTimer <= 0) {
          this.gameState = 'PLAYING';
        }
      } else if (this.gameState === 'PLAYING') {
        this.updatePlayerPhysics(rawDt);
        this.updateEnemies(rawDt);
        this.updateCollisions();
      }

      this.pools.update(rawDt);
    }

    this.renderer.render(
      this.gameState,
      this.player,
      this.enemies,
      this.pools,
      this.countdownTimer,
      this.wave,
      this.screenShake,
      this.controls.touchJoystick
    );

    requestAnimationFrame(this.loop);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.complexPlaneGame = new ComplexPlaneGame();
});
