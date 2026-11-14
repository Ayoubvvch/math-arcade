/**
 * Sequence Strider - 60 FPS Discrete Sequence Coordinate Renderer & Articulated Cyber-Runner
 * Renders:
 *   1. Discrete Sequence Plane (n in N, u_n in [m, M]) with Term Pillars (n, u_n) & Induction Dominoes P(n) => P(n+1)
 *   2. Squeeze Gendarme Envelopes v_n <= u_n <= w_n converging toward Limit Line y = L = 2
 *   3. Sector 4 Live Cobweb Attractor (C_f, y = x)
 *   4. Articulated 2D Cyber-Runner (2-bone IK running legs, Verlet neon scarf, jetpack thrusters, railgun)
 *   5. Geometric Sequence Mechs (Saw-Star q^n, Bipole (-1)^n, Clamp Gendarme, Multi-Ring Gyroscope Boss f(L)=L)
 */

window.renderStriderFrame = function(ctx, viewW, viewH, state) {
  const p = state.player;
  const time = state.time;
  const W = window.SEQ_WORLD;

  const shakeX = state.screenShake > 0.2 ? (Math.random() - 0.5) * state.screenShake : 0;
  const shakeY = state.screenShake > 0.2 ? (Math.random() - 0.5) * state.screenShake : 0;

  const camX = Math.max(0, Math.min(W.WIDTH - viewW, p.x - viewW * 0.44)) + shakeX;
  const camY = Math.max(0, Math.min(W.HEIGHT - viewH, p.y - viewH * 0.52)) + shakeY;

  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, viewW, viewH);

  ctx.save();
  ctx.translate(-camX, -camY);

  // =========================================================================
  // 1. DISCRETE COORDINATE PLANE (n in N, u_n in [m, M]) & SQUEEZE ENVELOPES
  // =========================================================================
  const gx0 = Math.max(0, Math.floor(camX / 60) * 60);
  const gx1 = Math.min(W.WIDTH, camX + viewW + 60);
  const gy0 = W.BOUND_M;
  const gy1 = W.BOUND_m;

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let gx = gx0; gx <= gx1; gx += 60) {
    ctx.moveTo(gx, gy0); ctx.lineTo(gx, gy1);
  }
  for (let gy = gy0; gy <= gy1; gy += 60) {
    ctx.moveTo(gx0, gy); ctx.lineTo(gx1, gy);
  }
  ctx.stroke();

  // Horizontal Limit Line y = L = 2.0
  const limitY = W.LIMIT_Y;
  ctx.save();
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 7]);
  ctx.beginPath();
  ctx.moveTo(gx0, limitY);
  ctx.lineTo(gx1, limitY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.direction = 'ltr';
  ctx.fillStyle = 'rgba(52, 211, 153, 0.78)';
  ctx.font = '800 11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('LIMIT HORIZON: lim u_n = L = 2', Math.max(36, camX + 18), limitY - 7);
  ctx.restore();

  // Squeeze Gendarme Envelope Curves v_n = L - A/sqrt(n+1) and w_n = L + A/sqrt(n+1)
  ctx.save();
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.34)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 5]);
  for (const sign of [-1, 1]) {
    ctx.beginPath();
    let started = false;
    for (let wx = Math.max(80, gx0); wx <= gx1; wx += 18) {
      const nCont = Math.max(0, (wx - 80) / 120);
      const envVal = 2.0 + sign * (2.6 / Math.sqrt(nCont + 1));
      const wy = W.seqToWorldY(envVal);
      if (!started) { ctx.moveTo(wx, wy); started = true; }
      else ctx.lineTo(wx, wy);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();

  // Discrete Index Pillars (n, u_n) & Induction Domino Bridges P(n) => P(n+1)
  if (state.termPillars) {
    ctx.save();
    ctx.direction = 'ltr';
    // Induction Domino connecting polyline
    ctx.beginPath();
    let started = false;
    for (const pil of state.termPillars) {
      if (pil.x < camX - 140 || pil.x > camX + viewW + 140) continue;
      if (!started) { ctx.moveTo(pil.x, pil.topY); started = true; }
      else ctx.lineTo(pil.x, pil.topY);
    }
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < state.termPillars.length; i++) {
      const pil = state.termPillars[i];
      if (pil.x < camX - 60 || pil.x > camX + viewW + 60) continue;

      // Vertical stem from floor m up to (n, u_n)
      ctx.strokeStyle = pil.activated ? 'rgba(34, 211, 238, 0.32)' : 'rgba(148, 163, 184, 0.14)';
      ctx.lineWidth = pil.activated ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(pil.x, W.BOUND_m);
      ctx.lineTo(pil.x, pil.topY);
      ctx.stroke();

      // Node (n, u_n)
      ctx.fillStyle = pil.activated ? '#22d3ee' : '#475569';
      ctx.beginPath();
      ctx.arc(pil.x, pil.topY, pil.activated ? 4.5 : 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Index label n on floor
      ctx.fillStyle = pil.activated ? '#67e8f9' : '#64748b';
      ctx.font = '800 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`n=${pil.n}`, pil.x, W.BOUND_m - 12);
    }
    ctx.restore();
  }

  // Sector 4 Background Cobweb Attractor (C_f and y = x around x = 2200)
  if (camX + viewW > 1860) {
    ctx.save();
    const ox = 2020, oy = 520, scale = 95;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.lineWidth = 2;
    // Bisector y = x
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + 3.4 * scale, oy - 3.4 * scale);
    ctx.stroke();
    // Curve C_f: y = sqrt(x + 2)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.28)';
    ctx.beginPath();
    for (let u = 0; u <= 3.4; u += 0.1) {
      const fu = Math.sqrt(u + 2);
      const px = ox + u * scale;
      const py = oy - fu * scale;
      if (u === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    // Cobweb staircase
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    let u = 0.25;
    ctx.moveTo(ox + u * scale, oy);
    for (let k = 0; k < 5; k++) {
      const fu = Math.sqrt(u + 2);
      ctx.lineTo(ox + u * scale, oy - fu * scale);
      ctx.lineTo(ox + fu * scale, oy - fu * scale);
      u = fu;
    }
    ctx.stroke();
    ctx.restore();
  }

  // Upper Majorant M Ceiling & Lower Minorant m Floor Laser Barriers
  ctx.fillStyle = 'rgba(244, 63, 94, 0.16)';
  ctx.fillRect(camX, 0, viewW + 20, W.BOUND_M);
  ctx.fillRect(camX, W.BOUND_m, viewW + 20, W.HEIGHT - W.BOUND_m);

  ctx.strokeStyle = '#fb7185';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(camX, W.BOUND_M); ctx.lineTo(camX + viewW + 20, W.BOUND_M);
  ctx.moveTo(camX, W.BOUND_m); ctx.lineTo(camX + viewW + 20, W.BOUND_m);
  ctx.stroke();

  ctx.direction = 'ltr';
  ctx.fillStyle = '#fda4af';
  ctx.font = '800 12px monospace';
  ctx.textAlign = 'left';
  const upperLabelY = viewW <= 640 ? Math.max(W.BOUND_M + 16, camY + 98) : W.BOUND_M + 16;
  ctx.fillText('UPPER BOUND: y = M = 5 (Majorant)', Math.max(40, camX + 20), upperLabelY);
  ctx.fillText('LOWER BOUND: y = m = -1 (Minorant)', Math.max(40, camX + 20), W.BOUND_m - 26);

  // =========================================================================
  // 2. PLATFORMS & 4 SECTOR OVERRIDE GATES
  // =========================================================================
  for (const plat of state.platforms) {
    if (plat.x + plat.w < camX - 20 || plat.x > camX + viewW + 20) continue;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
    ctx.strokeStyle = plat.oscAmp > 0 ? '#a855f7' : '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);

    // Thruster notches under platform
    ctx.fillStyle = plat.oscAmp > 0 ? '#c084fc' : '#22d3ee';
    ctx.fillRect(plat.x + 8, plat.y + plat.h, 14, 3);
    ctx.fillRect(plat.x + plat.w - 22, plat.y + plat.h, 14, 3);

    ctx.direction = 'ltr';
    ctx.fillStyle = plat.oscAmp > 0 ? '#e9d5ff' : '#bae6fd';
    ctx.font = '800 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(plat.label, plat.x + plat.w / 2, plat.y + 13);
  }

  const numerals = ['S1', 'S2', 'S3', 'S4'];
  for (const g of state.gates) {
    if (g.x + 80 < camX || g.x - 80 > camX + viewW) continue;
    const dist = Math.hypot(g.x - p.x, g.y - p.y);
    ctx.save();
    ctx.translate(g.x, g.y);
    if (g.broken) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, g.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.direction = 'ltr';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
      ctx.font = '800 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('OPENED', 0, 4);
    } else {
      // Rotating hexagonal cyber portal
      ctx.fillStyle = 'rgba(14, 165, 233, 0.16)';
      ctx.beginPath();
      ctx.arc(0, 0, g.radius + Math.sin(g.pulse) * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.rotate(time * 1.1 + g.id);
      ctx.strokeStyle = g.color;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI) / 3;
        const rx = Math.cos(a) * g.radius;
        const ry = Math.sin(a) * g.radius;
        if (k === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      ctx.direction = 'ltr';
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 15px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(numerals[g.id] || '∑', 0, 0);

      if (dist <= 125) {
        ctx.direction = 'rtl';
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 12px Tahoma, sans-serif';
        ctx.fillText('[▢ / E] اختراق البوابة', 0, -g.radius - 14);
      }
    }
    ctx.restore();
  }

  // Pickups
  for (const o of state.orbs) {
    ctx.save();
    ctx.translate(o.x, o.y + Math.sin(time * 5 + o.id) * 3);
    ctx.rotate(time * 2.5);
    ctx.fillStyle = o.kind === 'hp' ? '#38bdf8' : '#c084fc';
    ctx.beginPath();
    ctx.moveTo(0, -o.radius);
    ctx.lineTo(o.radius, 0);
    ctx.lineTo(0, o.radius);
    ctx.lineTo(-o.radius, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.restore();
  }

  // =========================================================================
  // 3. ARTICULATED GEOMETRIC SEQUENCE MECHS (DRONES & FIXED-POINT BOSS)
  // =========================================================================
  for (const d of state.drones) {
    drawArticulatedSeqDrone(ctx, d, time);
  }

  // Projectiles
  for (const b of state.projectiles) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(Math.atan2(b.vy, b.vx));
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(-9, -2.5, 18, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, -1.5, 7, 3);
    ctx.restore();
  }
  for (const ep of state.enemyProjectiles) {
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(ep.x, ep.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fecdd3';
    ctx.beginPath();
    ctx.arc(ep.x, ep.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // =========================================================================
  // 4. LIVE COORDINATE PROJECTION & ARTICULATED 2D CYBER-RUNNER
  // =========================================================================
  // Vertical error bar from player (n, u_n) to Limit Line y = L
  ctx.save();
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.36)';
  ctx.lineWidth = 1.4;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.x, W.LIMIT_Y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(p.x, W.LIMIT_Y, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawArticulatedCyberRunner(ctx, p, time);

  // Particles
  for (const pt of state.particles) {
    ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
    ctx.fillStyle = pt.color;
    ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
  }
  ctx.globalAlpha = 1;

  // Floating text
  for (const ft of state.floatingTexts) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, ft.life / 0.3);
    ctx.direction = 'rtl';
    ctx.fillStyle = ft.color;
    ctx.font = '900 13px Tahoma, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }

  ctx.restore();

  // Damage flash vignette
  if (state.damageFlash > 0.02) {
    ctx.strokeStyle = `rgba(244, 63, 94, ${state.damageFlash * 0.6})`;
    ctx.lineWidth = 24;
    ctx.strokeRect(0, 0, viewW, viewH);
  }

  // Horizon Radar Arrow for Next Gate or Boss
  let nextTgt = state.gates.find(g => !g.broken);
  const boss = state.drones.find(d => d.kind === 'boss');
  if (boss) nextTgt = boss;
  if (nextTgt) {
    const sx = nextTgt.x - camX;
    const sy = nextTgt.y - camY;
    if (sx < 0 || sx > viewW || sy < 0 || sy > viewH) {
      const ang = Math.atan2(nextTgt.y - p.y, nextTgt.x - p.x);
      const ax = Math.max(36, Math.min(viewW - 36, viewW / 2 + Math.cos(ang) * (viewW * 0.42)));
      const ay = Math.max(76, Math.min(viewH - 76, viewH / 2 + Math.sin(ang) * (viewH * 0.34)));
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(ang);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(11, 0); ctx.lineTo(-7, -7); ctx.lineTo(-7, 7); ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
};

/**
 * Draws the Articulated 2D Cyber-Runner (Scarf, 2-bone IK legs, Jetpack, Armor, Visor, Railgun)
 */
function drawArticulatedCyberRunner(ctx, p, time) {
  // 1. Flowing Verlet Neon Energy Scarf
  if (p.scarfNodes && p.scarfNodes.length > 1) {
    ctx.save();
    ctx.strokeStyle = p.aegisTimer > 0 ? '#34d399' : '#e879f9';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(p.scarfNodes[0].x, p.scarfNodes[0].y);
    for (let i = 1; i < p.scarfNodes.length; i++) {
      ctx.lineTo(p.scarfNodes[i].x, p.scarfNodes[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(p.x, p.y);

  // Induction Aegis Hex-Shield
  if (p.aegisTimer > 0) {
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = time * 2.5 + (k * Math.PI) / 3;
      const rx = Math.cos(a) * (p.radius + 11);
      const ry = Math.sin(a) * (p.radius + 11);
      if (k === 0) ctx.moveTo(rx, ry);
      else ctx.lineTo(rx, ry);
    }
    ctx.closePath();
    ctx.stroke();
  }

  const dir = p.facing || 1;
  const flash = p.invulnTimer > 0 && Math.floor(time * 24) % 2 === 0;

  // Jetpack Flame Thrusters when airborne or dashing
  if (!p.grounded || p.dashTimer > 0) {
    ctx.fillStyle = p.dashTimer > 0 ? '#fb7185' : '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-dir * 8, 2);
    ctx.lineTo(-dir * 18, 14 + Math.sin(time * 40) * 4);
    ctx.lineTo(-dir * 4, 9);
    ctx.closePath();
    ctx.fill();
  }

  // 2. Articulated 2-Bone IK Running Legs
  const stride = p.grounded ? Math.sin(p.walkCycle) : 0.65;
  for (const side of [-1, 1]) {
    const phase = stride * side;
    const hipX = side * 3;
    const hipY = 5;
    const kneeX = hipX + dir * (4 + phase * 6);
    const kneeY = hipY + 7 - Math.abs(phase) * 2;
    const footX = hipX + dir * phase * 10;
    const footY = hipY + 13 - Math.max(0, phase * side) * 3;

    ctx.strokeStyle = side === 1 ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(kneeX, kneeY);
    ctx.lineTo(footX, footY);
    ctx.stroke();

    // Cyber boot
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(footX - 3, footY - 1.5, 6, 3);
  }

  // 3. Cybernetic Torso & Jetpack
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-dir * 10, -8, 6, 13);

  ctx.fillStyle = flash ? '#bae6fd' : '#0f172a';
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-7, -9);
  ctx.lineTo(7, -9);
  ctx.lineTo(5, 7);
  ctx.lineTo(-5, 7);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Core reactor emblem on chest
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(dir * 2, -2, 2.8, 0, Math.PI * 2);
  ctx.fill();

  // 4. Sleek Cyber Helmet & Glowing Visor
  ctx.fillStyle = flash ? '#ffffff' : '#0f172a';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -14, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glowing Cyan Visor
  ctx.fillStyle = '#22d3ee';
  ctx.fillRect(dir > 0 ? 0 : -7, -16, 7, 3.5);

  // 5. Aimable Induction Railgun Arm
  ctx.save();
  ctx.translate(0, -3);
  ctx.rotate(p.aimAngle);
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.8;
  ctx.fillRect(3, -3.5, 19, 7);
  ctx.strokeRect(3, -3.5, 19, 7);
  // Glowing railgun barrel core
  ctx.fillStyle = '#67e8f9';
  ctx.fillRect(7, -1.2, 14, 2.4);
  ctx.restore();

  ctx.restore();
}

/**
 * Draws Articulated Geometric Sequence Mechs (Divergent Star, Bipole Oscillator, Clamp Gendarme, Gyroscope Boss)
 */
function drawArticulatedSeqDrone(ctx, d, time) {
  ctx.save();
  ctx.translate(d.x, d.y);
  const flash = d.hitFlash > 0;

  if (d.kind === 'divergent') {
    // Rotating 6-blade Saw-Star (q^n -> +inf)
    ctx.save();
    ctx.rotate(time * 4.2 + d.phase);
    ctx.fillStyle = flash ? '#ffffff' : '#991b1b';
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const r = i % 2 === 0 ? d.radius + 5 : d.radius * 0.55;
      const a = (i * Math.PI) / 6;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#fecdd3';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (d.kind === 'oscillator') {
    // Alternating Bipole Pendulum Mech ((-1)^n)
    const osc = Math.sin(d.phase);
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2.5;
    // Upper & lower polarity wings
    ctx.beginPath();
    ctx.moveTo(-14, -10 - osc * 4);
    ctx.lineTo(0, -d.radius - 4);
    ctx.lineTo(14, -10 - osc * 4);
    ctx.moveTo(-14, 10 - osc * 4);
    ctx.lineTo(0, d.radius + 4);
    ctx.lineTo(14, 10 - osc * 4);
    ctx.stroke();

    ctx.fillStyle = flash ? '#ffffff' : '#4c1d95';
    ctx.strokeStyle = '#e879f9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, d.radius * 0.78, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (d.kind === 'gendarme') {
    // Heavy Squeeze-Shield Sentinel (v_n <= u_n <= w_n) with Upper & Lower Mechanical Clamp Jaws
    const squeeze = Math.sin(time * 5 + d.phase) * 3;
    ctx.fillStyle = flash ? '#ffffff' : '#064e3b';
    ctx.strokeStyle = d.staggered ? '#fbbf24' : '#34d399';
    ctx.lineWidth = 2.5;

    // Upper clamp w_n
    ctx.fillRect(-d.radius, -d.radius - 4 + squeeze, d.radius * 2, 7);
    ctx.strokeRect(-d.radius, -d.radius - 4 + squeeze, d.radius * 2, 7);
    // Lower clamp v_n
    ctx.fillRect(-d.radius, d.radius - 3 - squeeze, d.radius * 2, 7);
    ctx.strokeRect(-d.radius, d.radius - 3 - squeeze, d.radius * 2, 7);

    // Armored octagon core
    ctx.beginPath();
    ctx.arc(0, 0, d.radius * 0.78, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    // BOSS: Multi-Ring Gyroscope Fixed-Point Core f(L) = L
    for (let ring = 0; ring < 3; ring++) {
      ctx.save();
      ctx.rotate(time * (ring % 2 === 0 ? 1.8 : -2.2) + ring);
      ctx.strokeStyle = ring === 0 ? '#f59e0b' : ring === 1 ? '#38bdf8' : '#f43f5e';
      ctx.lineWidth = 2.6;
      ctx.setLineDash([14, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, d.radius + 12 - ring * 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 4 Orbiting Induction Satellites
    for (let k = 0; k < 4; k++) {
      const a = time * 2.4 + (k * Math.PI) / 2;
      const sx = Math.cos(a) * (d.radius + 14);
      const sy = Math.sin(a) * (d.radius + 14);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = flash ? '#ffffff' : '#4c0519';
    ctx.strokeStyle = d.staggered ? '#fbbf24' : '#fb7185';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, d.radius * 0.72, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Formula label
  ctx.direction = 'ltr';
  ctx.fillStyle = '#f8fafc';
  ctx.font = '800 10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(d.kind === 'boss' ? 'f(L)=L' : d.label, 0, 0);

  // HP bar
  const bw = d.radius * 2;
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-bw / 2, -d.radius - 13, bw, 4);
  ctx.fillStyle = d.staggered ? '#fbbf24' : '#34d399';
  ctx.fillRect(-bw / 2, -d.radius - 13, bw * Math.max(0, d.hp / d.maxHp), 4);

  if (d.staggered) {
    ctx.direction = 'rtl';
    ctx.fillStyle = '#fbbf24';
    ctx.font = '800 11px Tahoma, sans-serif';
    ctx.fillText('مشلول! [▢ / E] اختراق', 0, -d.radius - 21);
  }
  ctx.restore();
}

/**
 * Renders Interactive Suites Numériques Graphs inside #seqGraphCanvas
 */
window.drawSequenceGraph = function(canvas, graphSpec) {
  if (!canvas || !graphSpec) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#060b16';
  ctx.fillRect(0, 0, W, H);
  ctx.direction = 'ltr';

  let xmin = -0.5, xmax = 10, ymin = -2, ymax = 5;
  if (graphSpec.type === 'fx_below_x' || graphSpec.type === 'cobweb_converge') {
    xmin = 0; xmax = 4; ymin = 0; ymax = 4;
  } else if (graphSpec.type === 'homographic_curve') {
    xmin = -0.5; xmax = 4.5; ymin = -0.5; ymax = 4.5;
  } else if (graphSpec.type === 'geo_limits') {
    xmin = 0; xmax = 12; ymin = -1.5; ymax = 5;
  } else if (graphSpec.type === 'squeeze_envelope') {
    xmin = 1; xmax = 14; ymin = 0.5; ymax = 3.5;
  }

  const toX = x => ((x - xmin) / (xmax - xmin)) * W;
  const toY = y => H - ((y - ymin) / (ymax - ymin)) * H;

  // Grid
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let gx = Math.ceil(xmin); gx <= Math.floor(xmax); gx++) {
    ctx.moveTo(toX(gx), 0); ctx.lineTo(toX(gx), H);
  }
  for (let gy = Math.ceil(ymin); gy <= Math.floor(ymax); gy++) {
    ctx.moveTo(0, toY(gy)); ctx.lineTo(W, toY(gy));
  }
  ctx.stroke();

  // Axes
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (ymin <= 0 && ymax >= 0) { ctx.moveTo(0, toY(0)); ctx.lineTo(W, toY(0)); }
  if (xmin <= 0 && xmax >= 0) { ctx.moveTo(toX(0), 0); ctx.lineTo(toX(0), H); }
  ctx.stroke();

  const plot = (fn, color, dashed = false) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.3;
    if (dashed) ctx.setLineDash([5, 4]);
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= 140; i++) {
      const x = xmin + ((xmax - xmin) * i) / 140;
      const y = fn(x);
      if (!Number.isFinite(y) || y < ymin - 2 || y > ymax + 2) { started = false; continue; }
      const px = toX(x), py = toY(y);
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  };

  if (graphSpec.type === 'bounded_scatter') {
    plot(() => 4, '#fb7185', true);
    plot(() => -1, '#fb7185', true);
    ctx.fillStyle = '#fda4af';
    ctx.font = '800 11px monospace';
    ctx.fillText('M = 4', toX(0.3), toY(4) - 5);
    ctx.fillText('m = -1', toX(0.3), toY(-1) - 5);
    for (let n = 0; n <= 9; n++) {
      const y = 1.5 + 2.1 * Math.cos(n * 1.1) * Math.pow(0.85, n);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(toX(n), toY(y), 4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (graphSpec.type === 'fx_below_x') {
    plot(x => x, '#94a3b8', true);
    plot(x => 0.4 * x + 0.6, '#38bdf8');
    ctx.fillStyle = '#fbbf24';
    ctx.font = '800 11px monospace';
    ctx.fillText('y = x', toX(3.2), toY(3.4));
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('f(x) ≤ x', toX(2.6), toY(1.4));
  } else if (graphSpec.type === 'homographic_curve') {
    plot(x => x, '#94a3b8', true);
    plot(x => x > 0.25 ? (3 * x - 2) / x : NaN, '#a855f7');
    for (const r of [1, 2]) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(toX(r), toY(r), 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(String(r), toX(r) + 6, toY(r) - 6);
    }
  } else if (graphSpec.type === 'geo_limits') {
    plot(() => 3, '#34d399', true);
    ctx.fillStyle = '#34d399';
    ctx.font = '800 11px monospace';
    ctx.fillText('L = 3', toX(9.2), toY(3.25));
    for (let n = 1; n <= 11; n++) {
      const u = 3 - 5 * Math.pow(-2 / 3, n) + 4 / Math.pow(n, 1.5);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(toX(n), toY(u), 3.6, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (graphSpec.type === 'squeeze_envelope') {
    plot(x => 2 + 1 / Math.sqrt(x), '#fb7185', true);
    plot(x => 2 - 1 / Math.sqrt(x), '#fb7185', true);
    plot(() => 2, '#fbbf24', true);
    for (let n = 1; n <= 13; n++) {
      const u = 2 + Math.sin(n) / Math.sqrt(n);
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(toX(n), toY(u), 3.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#fbbf24';
    ctx.font = '800 11px monospace';
    ctx.fillText('L = 2', toX(11), toY(2.15));
  } else if (graphSpec.type === 'cobweb_converge') {
    plot(x => x, '#94a3b8', true);
    const f = x => Math.sqrt(x + 2);
    plot(f, '#38bdf8');
    // Cobweb staircase from u0 = 0.4 -> L = 2
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    let u = 0.4;
    ctx.moveTo(toX(u), toY(0));
    for (let k = 0; k < 5; k++) {
      const nu = f(u);
      ctx.lineTo(toX(u), toY(nu));
      ctx.lineTo(toX(nu), toY(nu));
      u = nu;
    }
    ctx.stroke();
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(toX(2), toY(2), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 11px monospace';
    ctx.fillText('L=2', toX(2.1), toY(2.2));
  }
};
