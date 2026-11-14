/**
 * Complex Plane Duel: Argand Orbit Survivor
 * High-DPI Argand Plane Canvas Renderer & Complex Affix Gauge
 */

import { Complex } from './complex-math.js';
import {
  ARGAND_ARENA,
  ROOTS_OF_UNITY_PRESETS,
  PLAYER_CONFIG,
  toScreenX,
  toScreenY
} from './config.js';

export class ArgandRenderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  render(gameState, player, enemies, pools, countdownTimer, wave, screenShake, touchJoystick) {
    const ctx = this.ctx;

    ctx.save();
    if (screenShake > 0) {
      ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
    }

    // Pure black cosmic background
    ctx.fillStyle = '#020409';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Top Cyber Console Header
    this.drawTopHeader(wave, player.score);

    // 2. Real-Time Complex Affix Gauge (Pedagogical Core!)
    this.drawAffixGauge(player);

    // 3. Argand Coordinate Plane Grid & Concentric Modulus Rings
    this.drawArgandPlane();

    // 4. Projectile Beams & Shockwaves
    this.drawBeams(pools.beams);
    this.drawShockwaves(pools.shockwaves);

    // 5. Enemy Complex Singularities
    this.drawEnemies(enemies);

    // 6. Player Craft & Roots of Unity Orbital Barrier
    this.drawPlayer(player);

    // 7. Virtual Touch Joystick
    if (touchJoystick && touchJoystick.active) {
      this.drawTouchJoystick(touchJoystick);
    }

    // 8. Particles & Popups
    this.drawParticles(pools.particles);
    this.drawPopups(pools.popups);

    // 9. PlayStation DualSense Bottom HUD
    this.drawBottomHUD(player, enemies.length, gameState);

    // 10. Overlays (Countdown, Victory, Game Over)
    this.drawOverlays(gameState, countdownTimer, wave);

    ctx.restore();
  }

  drawTopHeader(wave, score) {
    const ctx = this.ctx;
    const px = 90, py = 72, r = 32;

    // Player Complex Craft Avatar
    ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.beginPath(); ctx.arc(px, py, r + 5, 0, Math.PI * 2); ctx.fill();

    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = '#010f1c'; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = '#00f0ff'; ctx.stroke();

    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = 'italic bold 20px "Cambria Math", serif';
    ctx.fillText('z', px, py - 2);

    ctx.font = '900 10px -apple-system, sans-serif';
    ctx.fillText('ARGAND PILOT', px, py + r + 14);

    // Wave Indicator
    ctx.font = '900 20px -apple-system, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`WAVE ${wave}`, 270, py - 8);
    ctx.font = '800 11px -apple-system, sans-serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(`SCORE: ${score}`, 270, py + 14);

    // Enemy Complex Singularity Avatar
    const bx = 450, by = 72;
    ctx.fillStyle = 'rgba(255, 0, 127, 0.08)';
    ctx.beginPath(); ctx.arc(bx, by, r + 5, 0, Math.PI * 2); ctx.fill();

    ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fillStyle = '#18020c'; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = '#ff007f'; ctx.stroke();

    ctx.fillStyle = '#ff007f';
    ctx.font = 'italic bold 18px "Cambria Math", serif';
    ctx.fillText('1/z', bx, by - 2);

    ctx.font = '900 10px -apple-system, sans-serif';
    ctx.fillText('SINGULARITY', bx, by + r + 14);
  }

  drawAffixGauge(player) {
    const ctx = this.ctx;
    const startY = 142;
    const barWidth = ARGAND_ARENA.width;
    const startX = ARGAND_ARENA.x;

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(startX, startY, barWidth, 30, 6);
    ctx.fill();
    ctx.stroke();

    // Cartesian Affix
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = 'italic bold 12px "Cambria Math", serif';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText(`z = ${player.pos.formatCartesian(2)}`, startX + 12, startY + 15);

    // Modulus |z|
    const mod = player.pos.modulus().toFixed(2);
    ctx.textAlign = 'center';
    ctx.font = 'bold 11px "Cambria Math", serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(`|z| = ${mod}`, startX + barWidth / 2, startY + 15);

    // Argument theta
    const deg = Math.round((player.pos.arg() * 180) / Math.PI);
    ctx.textAlign = 'right';
    ctx.font = 'italic bold 12px "Cambria Math", serif';
    ctx.fillStyle = '#b537f2';
    ctx.fillText(`arg(z) = ${deg}°`, startX + barWidth - 12, startY + 15);

    ctx.restore();
  }

  drawArgandPlane() {
    const ctx = this.ctx;
    const cx = toScreenX(0);
    const cy = toScreenY(0);

    // Arena border
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.lineWidth = 2.0;
    ctx.strokeRect(ARGAND_ARENA.x, ARGAND_ARENA.y, ARGAND_ARENA.width, ARGAND_ARENA.height);

    // Concentric Modulus Rings (|z| = 1, 2, 3, 4, 5)
    ctx.save();
    ctx.beginPath();
    ctx.rect(ARGAND_ARENA.x, ARGAND_ARENA.y, ARGAND_ARENA.width, ARGAND_ARENA.height);
    ctx.clip();

    const scale = ARGAND_ARENA.width / (ARGAND_ARENA.reMax - ARGAND_ARENA.reMin);

    [1, 2, 3, 4, 5].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
      ctx.strokeStyle = r === 1 ? 'rgba(0, 240, 255, 0.35)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = r === 1 ? 1.5 : 1.0;
      ctx.stroke();

      // Label on Real axis
      ctx.fillStyle = r === 1 ? '#00f0ff' : 'rgba(255, 255, 255, 0.25)';
      ctx.font = '9px -apple-system, sans-serif';
      ctx.fillText(`r=${r}`, cx + r * scale + 2, cy - 4);
    });

    // Polar Rays (Multiples of pi/4)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let k = 0; k < 8; k++) {
      const ang = (k * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(ang) * 350, cy - Math.sin(ang) * 350);
      ctx.stroke();
    }

    // Main Axes: Re (Horizontal) and Im (Vertical)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.8;
    // Re Axis
    ctx.moveTo(ARGAND_ARENA.x, cy);
    ctx.lineTo(ARGAND_ARENA.x + ARGAND_ARENA.width, cy);
    // Im Axis
    ctx.moveTo(cx, ARGAND_ARENA.y + ARGAND_ARENA.height);
    ctx.lineTo(cx, ARGAND_ARENA.y);
    ctx.stroke();

    // Axis designations
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'italic bold 13px "Cambria Math", serif';
    ctx.textAlign = 'right';
    ctx.fillText('Re', ARGAND_ARENA.x + ARGAND_ARENA.width - 8, cy + 16);

    ctx.fillStyle = '#ff007f';
    ctx.fillText('Im (i)', cx - 8, ARGAND_ARENA.y + 14);

    // Origin O
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 11px "Cambria Math", serif';
    ctx.fillText('O', cx - 6, cy + 12);

    ctx.restore();
  }

  drawBeams(beams) {
    const ctx = this.ctx;
    beams.forEach(b => {
      if (!b.active) return;
      const sx = toScreenX(b.pos.re);
      const sy = toScreenY(b.pos.im);
      const ang = Math.atan2(-b.vel.im, b.vel.re);
      const len = 22;

      ctx.save();
      ctx.strokeStyle = b.isReal ? '#00f0ff' : '#ff007f';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - Math.cos(ang) * len, sy - Math.sin(ang) * len);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });
  }

  drawShockwaves(shockwaves) {
    const ctx = this.ctx;
    shockwaves.forEach(sw => {
      ctx.save();
      ctx.globalAlpha = sw.alpha;
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    });
  }

  drawEnemies(enemies) {
    const ctx = this.ctx;
    enemies.forEach(e => {
      const sx = toScreenX(e.pos.re);
      const sy = toScreenY(e.pos.im);

      // Outer Halo
      ctx.fillStyle = `${e.color}25`;
      ctx.beginPath(); ctx.arc(sx, sy, e.radius + 6, 0, Math.PI * 2); ctx.fill();

      // Core Circle
      ctx.beginPath(); ctx.arc(sx, sy, e.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#100108'; ctx.fill();
      ctx.lineWidth = 2.2; ctx.strokeStyle = e.color; ctx.stroke();

      // Math Label
      ctx.fillStyle = e.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `italic bold ${Math.round(e.radius * 0.85)}px "Cambria Math", serif`;
      ctx.fillText(e.label, sx, sy + 1);

      // Mini Health Bar above enemy
      const hpPct = Math.max(0, e.hp / e.maxHp);
      const bw = e.radius * 1.6;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(sx - bw / 2, sy - e.radius - 8, bw, 3);
      ctx.fillStyle = e.color;
      ctx.fillRect(sx - bw / 2, sy - e.radius - 8, bw * hpPct, 3);
    });
  }

  drawPlayer(player) {
    const ctx = this.ctx;
    const sx = toScreenX(player.pos.re);
    const sy = toScreenY(player.pos.im);

    // Aim Pointer
    ctx.save();
    const faceX = sx + Math.cos(player.facingAng) * 38;
    const faceY = sy - Math.sin(player.facingAng) * 38;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(faceX, faceY);
    ctx.stroke();
    ctx.restore();

    // Silky Trail
    if (player.trail.length > 2) {
      ctx.beginPath();
      ctx.moveTo(player.trail[0].x, player.trail[0].y);
      for (let i = 1; i < player.trail.length; i++) ctx.lineTo(player.trail[i].x, player.trail[i].y);
      ctx.strokeStyle = player.isDashing ? 'rgba(0, 240, 255, 0.95)' : 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = player.isDashing ? 5.5 : 2.0;
      ctx.stroke();
    }

    // Roots of Unity Orbital Satellites (z^n = 1)
    const preset = ROOTS_OF_UNITY_PRESETS[player.rootsIndex];
    const n = preset.n;
    const roots = Complex.getRootsOfUnity(n, PLAYER_CONFIG.shieldRadius, player.rootsPhase);

    ctx.save();
    // Connecting Polygon Wireframe (Triangle, Square, Hexagon, Octagon)
    ctx.beginPath();
    roots.forEach((rt, idx) => {
      const rx = sx + rt.z.re;
      const ry = sy - rt.z.im; // Invert for canvas Y
      if (idx === 0) ctx.moveTo(rx, ry); else ctx.lineTo(rx, ry);
    });
    ctx.closePath();
    ctx.strokeStyle = player.barrierActive ? preset.color : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = player.barrierActive ? 2.5 : 1.0;
    if (player.barrierActive) {
      ctx.fillStyle = `${preset.color}20`;
      ctx.fill();
    }
    ctx.stroke();

    // Draw individual Root Nodes
    roots.forEach((rt) => {
      const rx = sx + rt.z.re;
      const ry = sy - rt.z.im;
      ctx.beginPath();
      ctx.arc(rx, ry, player.barrierActive ? 7 : 4.5, 0, Math.PI * 2);
      ctx.fillStyle = player.barrierActive ? preset.color : '#ffffff';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
    });
    ctx.restore();

    // Player Core Craft
    ctx.save();
    if (player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer * 20) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    ctx.fillStyle = player.isDashing ? 'rgba(0, 240, 255, 0.45)' : 'rgba(0, 240, 255, 0.12)';
    ctx.beginPath(); ctx.arc(sx, sy, player.radius + 6, 0, Math.PI * 2); ctx.fill();

    ctx.beginPath(); ctx.arc(sx, sy, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#01111f'; ctx.fill();
    ctx.lineWidth = player.isDashing ? 4.5 : 2.5;
    ctx.strokeStyle = '#00f0ff';
    ctx.stroke();

    // Complex z glyph
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'italic bold 15px "Cambria Math", serif';
    ctx.fillText('z', sx, sy - 1);
    ctx.restore();
  }

  drawTouchJoystick(touchJoystick) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(touchJoystick.startX, touchJoystick.startY, 50, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    const stickX = touchJoystick.startX + touchJoystick.dx * 45;
    const stickY = touchJoystick.startY + touchJoystick.dy * 45;
    ctx.beginPath();
    ctx.arc(stickX, stickY, 22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  drawParticles(particles) {
    const ctx = this.ctx;
    particles.forEach(pt => {
      if (!pt.active) return;
      ctx.save();
      ctx.globalAlpha = pt.alpha;
      ctx.fillStyle = pt.color;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
  }

  drawPopups(popups) {
    const ctx = this.ctx;
    popups.forEach(p => {
      if (!p.active) return;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'italic bold 16px "Cambria Math", serif';
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.x, p.y);
      ctx.restore();
    });
  }

  drawBottomHUD(player, enemyCount, gameState) {
    const ctx = this.ctx;
    const barY = 670, bw = 215, bh = 20;
    const leftX = ARGAND_ARENA.x;
    const hpPct = Math.max(0, player.hp / player.maxHp);

    // Player Health
    ctx.fillStyle = '#111827'; ctx.fillRect(leftX, barY, bw, bh);
    ctx.fillStyle = '#00f0ff'; ctx.fillRect(leftX, barY, bw * hpPct, bh);
    ctx.fillStyle = '#000000';
    ctx.font = '900 11px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`CORE HP: ${player.hp} / ${player.maxHp}`, leftX + bw / 2, barY + bh / 2);

    // Dash & Roots Barrier Status
    ctx.font = '800 11px -apple-system, sans-serif';
    ctx.textAlign = 'left';

    let dashTxt = `DASH: `;
    for (let i = 0; i < player.maxDashCharges; i++) {
      dashTxt += (i < player.dashCharges ? '⚡ ' : '○ ');
    }
    ctx.fillStyle = player.dashCharges > 0 ? '#00f0ff' : '#64748b';
    ctx.fillText(dashTxt, leftX, barY + bh + 16);

    const preset = ROOTS_OF_UNITY_PRESETS[player.rootsIndex];
    const barrierReady = (player.barrierCooldown <= 0 && !player.barrierActive);
    ctx.fillStyle = player.barrierActive ? preset.color : (barrierReady ? '#ffd700' : '#64748b');
    const barrierTxt = player.barrierActive
      ? `◯ SHIELD [${player.barrierTimer.toFixed(1)}s]`
      : (barrierReady ? `◯ ${preset.glyph} SHIELD [READY]` : `◯ SHIELD [${player.barrierCooldown.toFixed(1)}s]`);
    ctx.fillText(barrierTxt, leftX + 105, barY + bh + 16);

    // Right Side: Homothety Energy & Active Enemies
    const rightX = ARGAND_ARENA.x + ARGAND_ARENA.width - bw;
    const energyPct = Math.max(0, player.homothetyEnergy / player.maxHomothetyEnergy);
    ctx.fillStyle = '#111827'; ctx.fillRect(rightX, barY, bw, bh);
    ctx.fillStyle = '#b537f2'; ctx.fillRect(rightX, barY, bw * energyPct, bh);
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText(`HOMOTHETY SHOCK: ${Math.floor(player.homothetyEnergy)}%`, rightX + bw / 2, barY + bh / 2);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`[POLES ACTIVE: ${enemyCount}]`, rightX + bw, barY + bh + 16);

    // PlayStation Ribbon Guide
    const ribbonY = 730;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(ARGAND_ARENA.x, ribbonY, ARGAND_ARENA.width, 24);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeRect(ARGAND_ARENA.x, ribbonY, ARGAND_ARENA.width, 24);

    ctx.font = '800 10px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#00f0ff';
    ctx.fillText('✕ EULER ROTATE', ARGAND_ARENA.x + 55, ribbonY + 12);

    ctx.fillStyle = '#b537f2';
    ctx.fillText('▢ AFFIX BEAM', ARGAND_ARENA.x + 155, ribbonY + 12);

    ctx.fillStyle = '#ffd700';
    ctx.fillText(`◯ ROOTS [${preset.glyph} ${preset.n}]`, ARGAND_ARENA.x + 265, ribbonY + 12);

    ctx.fillStyle = '#00ff88';
    ctx.fillText('△ HOMOTHETY', ARGAND_ARENA.x + 365, ribbonY + 12);

    ctx.fillStyle = '#64748b';
    ctx.fillText('L1/R1 CYCLE n', ARGAND_ARENA.x + 435, ribbonY + 12);
  }

  drawOverlays(gameState, countdownTimer, wave) {
    const cx = ARGAND_ARENA.x + ARGAND_ARENA.width / 2;
    const cy = ARGAND_ARENA.y + ARGAND_ARENA.height / 2;
    const ctx = this.ctx;
    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    if (gameState === 'COUNTDOWN') {
      if (countdownTimer > 2.0) {
        ctx.font = '900 100px -apple-system, sans-serif'; ctx.fillStyle = '#f8fafc'; ctx.fillText('3', cx, cy);
      } else if (countdownTimer > 1.0) {
        ctx.font = '900 100px -apple-system, sans-serif'; ctx.fillStyle = '#f8fafc'; ctx.fillText('2', cx, cy);
      } else {
        ctx.font = '900 100px -apple-system, sans-serif'; ctx.fillStyle = '#00f0ff'; ctx.fillText('1', cx, cy);
      }
    } else if (gameState === 'VICTORY') {
      ctx.font = '900 38px -apple-system, sans-serif'; ctx.fillStyle = '#00f0ff';
      ctx.fillText('COMPLEX PLANE CONQUERED!', cx, cy - 20);
      ctx.font = '800 16px -apple-system, sans-serif'; ctx.fillStyle = '#10b981';
      ctx.fillText(`WAVE ${wave} POLES ELIMINATED`, cx, cy + 18);
    } else if (gameState === 'GAMEOVER') {
      ctx.font = '900 42px -apple-system, sans-serif'; ctx.fillStyle = '#ff0055';
      ctx.fillText('COMPLEX SINGULARITY', cx, cy - 20);
      ctx.font = '800 16px -apple-system, sans-serif'; ctx.fillStyle = '#94a3b8';
      ctx.fillText('PRESS [✕] TO RE-ENTER ORBIT', cx, cy + 18);
    }
    ctx.restore();
  }
}
