/**
 * Asymptote Asylum - 60 FPS Living Orthonormal Coordinate Plane (O, i, j) & Articulated Biomechanical Horror Renderer
 * Renders:
 *  - Orthonormal Coordinate Grid (Ox, Oy, O, unit vectors i, j)
 *  - Living Curve (Cf): y = f(x), Auxiliary Line (Cg), First Bisector Δ: y = x, Inverse Curve (Cf^-1)
 *  - Vertical Asymptote Rifts x = ±3.8 & Player-Constructed Tangent Bridges (T): y = f'(x0)(x - x0) + f(x0)
 *  - Live Abscissa/Ordinate Projections & Tangent Vector T(1, f'(x0))
 *  - Articulated 2-Bone IK Survivor with Verlet Coat & Toothed Derivative Chainsaw
 *  - Articulated 8-Legged Cusp Arachnids, Winged Asymptote Seraphs, Dual-Scythe Executioners & 6-Segment Boss Leviathan
 */

window.renderAsylumFrame = function(ctx, viewW, viewH, state) {
  const p = state.player;
  const time = state.time;
  const cfg = window.WORLD_CONFIG;

  const shakeX = state.screenShake > 0.2 ? (Math.random() - 0.5) * state.screenShake : 0;
  const shakeY = state.screenShake > 0.2 ? (Math.random() - 0.5) * state.screenShake : 0;
  const camX = p.x - viewW / 2 + shakeX;
  const camY = p.y - viewH / 2 + shakeY;

  // Base Void Fill
  ctx.fillStyle = '#05040a';
  ctx.fillRect(0, 0, viewW, viewH);

  ctx.save();
  ctx.translate(-camX, -camY);

  const W = cfg.WIDTH;
  const H = cfg.HEIGHT;
  const ox = cfg.ORIGIN_X;
  const oy = cfg.ORIGIN_Y;
  const unit = cfg.UNIT_PX;

  // Coordinate Plane Floor
  ctx.fillStyle = '#090710';
  ctx.fillRect(0, 0, W, H);

  // Sub-unit millimeter grid (every 0.25 unit = 30px)
  const subStep = unit / 4;
  const minSubX = Math.max(0, Math.floor(camX / subStep) * subStep);
  const maxSubX = Math.min(W, camX + viewW + subStep);
  const minSubY = Math.max(0, Math.floor(camY / subStep) * subStep);
  const maxSubY = Math.min(H, camY + viewH + subStep);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.035)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let gx = minSubX; gx <= maxSubX; gx += subStep) {
    ctx.moveTo(gx, minSubY);
    ctx.lineTo(gx, maxSubY);
  }
  for (let gy = minSubY; gy <= maxSubY; gy += subStep) {
    ctx.moveTo(minSubX, gy);
    ctx.lineTo(maxSubX, gy);
  }
  ctx.stroke();

  // Integer Orthonormal Grid Lines (every 1.0 unit = 120px)
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.11)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let k = -8; k <= 8; k++) {
    const wx = ox + k * unit;
    if (wx >= camX - 20 && wx <= camX + viewW + 20) {
      ctx.moveTo(wx, Math.max(0, camY));
      ctx.lineTo(wx, Math.min(H, camY + viewH));
    }
  }
  for (let m = -5; m <= 5; m++) {
    const wy = oy - m * unit;
    if (wy >= camY - 20 && wy <= camY + viewH + 20) {
      ctx.moveTo(Math.max(0, camX), wy);
      ctx.lineTo(Math.min(W, camX + viewW), wy);
    }
  }
  ctx.stroke();

  // First Bisector Mirror (Δ): y = x across (O, i, j)
  ctx.save();
  ctx.strokeStyle = p.flareTimer > 0 ? 'rgba(52, 211, 153, 0.65)' : 'rgba(148, 163, 184, 0.18)';
  ctx.lineWidth = p.flareTimer > 0 ? 2.6 : 1.5;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  const p1 = window.mathToWorld(-5.5, -5.5);
  const p2 = window.mathToWorld(5.5, 5.5);
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Vertical Asymptote Plasma Rifts (x = -3.8 and x = +3.8)
  if (state.asymptoteRifts) {
    for (const rift of state.asymptoteRifts) {
      if (rift.worldX < camX - 60 || rift.worldX > camX + viewW + 60) continue;
      ctx.fillStyle = 'rgba(220, 38, 38, 0.09)';
      ctx.fillRect(rift.worldX - 14, 0, 28, H);
      ctx.strokeStyle = 'rgba(248, 113, 113, 0.55)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 6]);
      ctx.beginPath();
      ctx.moveTo(rift.worldX, 0);
      ctx.lineTo(rift.worldX, H);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.direction = 'ltr';
      ctx.fillStyle = '#fca5a5';
      ctx.font = '800 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(rift.label, rift.worldX + 8, oy - 180);
    }
  }

  // Primary Orthonormal Axes (Ox) and (Oy)
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.42)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(0, oy);
  ctx.lineTo(W, oy);
  ctx.moveTo(ox, 0);
  ctx.lineTo(ox, H);
  ctx.stroke();

  // Integer Tick Numbers on (Ox) and (Oy)
  ctx.direction = 'ltr';
  ctx.fillStyle = 'rgba(203, 213, 225, 0.55)';
  ctx.font = '800 11px monospace';
  ctx.textAlign = 'center';
  for (let k = -7; k <= 7; k++) {
    if (k === 0) continue;
    const wx = ox + k * unit;
    if (wx < camX - 30 || wx > camX + viewW + 30) continue;
    ctx.beginPath();
    ctx.moveTo(wx, oy - 5);
    ctx.lineTo(wx, oy + 5);
    ctx.stroke();
    ctx.fillText(String(k), wx, oy + 18);
  }
  ctx.textAlign = 'right';
  for (let m = -4; m <= 4; m++) {
    if (m === 0) continue;
    const wy = oy - m * unit;
    if (wy < camY - 30 || wy > camY + viewH + 30) continue;
    ctx.beginPath();
    ctx.moveTo(ox - 5, wy);
    ctx.lineTo(ox + 5, wy);
    ctx.stroke();
    ctx.fillText(String(m), ox - 9, wy + 4);
  }

  // Origin O(0,0) and Orthonormal Basis Vectors i(1,0) & j(0,1)
  ctx.save();
  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 13px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('O(0,0)', ox - 8, oy + 18);

  // Vector i -> (ox + unit, oy)
  ctx.strokeStyle = '#22d3ee';
  ctx.fillStyle = '#22d3ee';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(ox + unit, oy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ox + unit, oy);
  ctx.lineTo(ox + unit - 10, oy - 5);
  ctx.lineTo(ox + unit - 10, oy + 5);
  ctx.closePath();
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.fillText('i', ox + unit * 0.5, oy - 9);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(ox + unit * 0.5 - 4, oy - 21);
  ctx.lineTo(ox + unit * 0.5 + 5, oy - 21);
  ctx.lineTo(ox + unit * 0.5 + 2, oy - 23.5);
  ctx.stroke();

  // Vector j -> (ox, oy - unit)
  ctx.strokeStyle = '#f43f5e';
  ctx.fillStyle = '#f43f5e';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(ox, oy - unit);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ox, oy - unit);
  ctx.lineTo(ox - 5, oy - unit + 10);
  ctx.lineTo(ox + 5, oy - unit + 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillText('j', ox - 16, oy - unit * 0.5);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(ox - 20, oy - unit * 0.5 - 12);
  ctx.lineTo(ox - 11, oy - unit * 0.5 - 12);
  ctx.lineTo(ox - 14, oy - unit * 0.5 - 14.5);
  ctx.stroke();
  ctx.restore();

  // Auxiliary Straight Line (Cg): y = 0.32x - 0.4
  ctx.save();
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.28)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  const gStart = window.mathToWorld(-7.5, window.evalCurveG(-7.5));
  const gEnd = window.mathToWorld(7.5, window.evalCurveG(7.5));
  ctx.moveTo(gStart.x, gStart.y);
  ctx.lineTo(gEnd.x, gEnd.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Inverse Curve (Cf^-1) reflected across Δ: y = x (brightens when Bisector Mirror △ is active)
  ctx.save();
  ctx.strokeStyle = p.flareTimer > 0 ? 'rgba(52, 211, 153, 0.85)' : 'rgba(52, 211, 153, 0.18)';
  ctx.lineWidth = p.flareTimer > 0 ? 3.2 : 1.6;
  ctx.beginPath();
  for (let i = 0; i <= 140; i++) {
    const t = -6.5 + (13.0 * i) / 140;
    const ft = window.evalCurveF(t);
    // Reflected point M'(f(t), t)
    const wp = window.mathToWorld(ft, t);
    if (i === 0) ctx.moveTo(wp.x, wp.y);
    else ctx.lineTo(wp.x, wp.y);
  }
  ctx.stroke();
  ctx.restore();

  // Primary Biomechanical Curve (Cf): y = f(x)
  ctx.save();
  // Outer crimson track
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.28)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  for (let i = 0; i <= 160; i++) {
    const X = -7.5 + (15.0 * i) / 160;
    const Y = window.evalCurveF(X);
    const wp = window.mathToWorld(X, Y);
    if (i === 0) ctx.moveTo(wp.x, wp.y);
    else ctx.lineTo(wp.x, wp.y);
  }
  ctx.stroke();

  // Core nerve spine of (Cf)
  ctx.strokeStyle = p.onCurveBonus ? '#38bdf8' : '#ef4444';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Vertebrae ticks along (Cf)
  ctx.strokeStyle = 'rgba(254, 202, 202, 0.45)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  for (let X = -7; X <= 7; X += 0.5) {
    const Y = window.evalCurveF(X);
    const dY = window.evalCurveFPrime(X);
    const wp = window.mathToWorld(X, Y);
    const normLen = Math.hypot(1, dY) || 1;
    const nx = (-dY / normLen) * 7;
    const ny = (-1 / normLen) * 7;
    ctx.moveTo(wp.x - nx, wp.y - ny);
    ctx.lineTo(wp.x + nx, wp.y + ny);
  }
  ctx.stroke();
  ctx.restore();

  // Player-Constructed Walkable Tangent Bridges (T): y = f'(x0)(x - x0) + f(x0)
  if (state.tangentBridges) {
    for (const tb of state.tangentBridges) {
      const xA = tb.x0 - tb.span;
      const yA = tb.y0 + tb.slope * (xA - tb.x0);
      const xB = tb.x0 + tb.span;
      const yB = tb.y0 + tb.slope * (xB - tb.x0);
      const wA = window.mathToWorld(xA, yA);
      const wB = window.mathToWorld(xB, yB);
      const wPivot = window.mathToWorld(tb.x0, tb.y0);

      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.24)';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(wA.x, wA.y);
      ctx.lineTo(wB.x, wB.y);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(wA.x, wA.y);
      ctx.lineTo(wB.x, wB.y);
      ctx.stroke();

      // Anchor point M0(x0, f(x0))
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(wPivot.x, wPivot.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.direction = 'ltr';
      ctx.fillStyle = '#bae6fd';
      ctx.font = '800 10.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`(T): y = ${tb.slope.toFixed(2)}(x - ${tb.x0.toFixed(1)}) + ${tb.y0.toFixed(1)}`, wPivot.x, wPivot.y - 10);
      ctx.restore();
    }
  }

  // Live Coordinate Projections from Player M(x0, y0) to (Ox), (Oy) and Curve Point P(x0, f(x0))
  {
    const curvePt = window.mathToWorld(p.mathX, p.curveY);
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    // Projection to (Ox)
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, oy);
    // Projection to (Oy)
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(ox, p.y);
    // Vertical secant link to P(x0, f(x0)) on (Cf)
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(curvePt.x, curvePt.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Live Tangent Vector Arrow T(1, f'(x0)) on (Cf) at x0
    const slope = p.derivFPrime;
    const tWorldNext = window.mathToWorld(p.mathX + 0.75, p.curveY + slope * 0.75);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(curvePt.x, curvePt.y);
    ctx.lineTo(tWorldNext.x, tWorldNext.y);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(curvePt.x, curvePt.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Outer Coordinate Boundary
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 14;
  ctx.strokeRect(14, 14, W - 28, H - 28);

  // Gore & Bone Decals on Coordinate Plane
  for (const d of state.decals) {
    if (d.x + d.r < camX - 40 || d.x - d.r > camX + viewW + 40 || d.y + d.r < camY - 40 || d.y - d.r > camY + viewH + 40) continue;
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.rot);
    if (d.kind === 'bones') {
      ctx.globalAlpha = d.alpha;
      ctx.strokeStyle = '#d6d3d1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-d.r * 0.45, -4);
      ctx.lineTo(d.r * 0.45, 5);
      ctx.moveTo(-d.r * 0.25, 6);
      ctx.lineTo(d.r * 0.3, -6);
      ctx.stroke();
      ctx.fillStyle = '#e7e5e4';
      ctx.beginPath();
      ctx.arc(0, -d.r * 0.25, 4.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalAlpha = d.alpha;
      ctx.fillStyle = '#6b0f14';
      ctx.beginPath();
      ctx.ellipse(0, 0, d.r, d.r * 0.72, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(d.r * 0.45, -d.r * 0.2, d.r * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 4 Coordinate Fracture Nodes (Seals I, II, III, IV)
  const sealNumerals = ['I', 'II', 'III', 'IV'];
  for (const s of state.seals) {
    const pulseR = s.radius + Math.sin(s.pulse) * 5;
    const dist = Math.hypot(s.x - p.x, s.y - p.y);

    ctx.save();
    ctx.translate(s.x, s.y);
    if (s.broken) {
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 7]);
      ctx.beginPath();
      ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.direction = 'ltr';
      ctx.fillStyle = '#34d399';
      ctx.font = '800 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CALIBRATED', 0, 4);
    } else {
      ctx.fillStyle = 'rgba(127, 29, 29, 0.22)';
      ctx.beginPath();
      ctx.arc(0, 0, pulseR + 10, 0, Math.PI * 2);
      ctx.fill();

      // Octagonal Coordinate Portal Frame
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      for (let i = 0; i <= 8; i++) {
        const a = (i * Math.PI) / 4 + time * 0.35;
        const rx = Math.cos(a) * s.radius;
        const ry = Math.sin(a) * s.radius;
        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.stroke();

      // Inner Tangent Crosshair
      ctx.save();
      ctx.rotate(-time * 0.6);
      ctx.strokeStyle = 'rgba(254, 202, 202, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-s.radius * 0.7, 0); ctx.lineTo(s.radius * 0.7, 0);
      ctx.moveTo(0, -s.radius * 0.7); ctx.lineTo(0, s.radius * 0.7);
      ctx.stroke();
      ctx.restore();

      ctx.direction = 'ltr';
      ctx.fillStyle = '#fef2f2';
      ctx.font = '900 15px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sealNumerals[s.id] || '∑', 0, -4);
      ctx.font = '700 9.5px monospace';
      ctx.fillStyle = '#fde68a';
      ctx.fillText(s.mathLabel || '', 0, 12);

      if (dist <= 125) {
        ctx.direction = 'rtl';
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 12px Tahoma, sans-serif';
        ctx.fillText('[▢ / L] معايرة عقدة المعلم', 0, -s.radius - 14);
      }
    }
    ctx.restore();
  }

  // Tangent Forge Pylons (مرتكزات بناء المماس والتقريب التآلفي)
  for (const c of state.captives) {
    if (!c.alive) continue;
    const dist = Math.hypot(c.x - p.x, c.y - p.y);
    const pulse = Math.sin(time * 5 + c.shiverPhase) * 3;

    ctx.save();
    ctx.translate(c.x, c.y);
    // Diamond Geometric Pylon
    ctx.strokeStyle = '#38bdf8';
    ctx.fillStyle = 'rgba(14, 116, 144, 0.28)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -20 - pulse);
    ctx.lineTo(20 + pulse, 0);
    ctx.lineTo(0, 20 + pulse);
    ctx.lineTo(-20 - pulse, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.direction = 'ltr';
    ctx.fillStyle = '#e0f2fe';
    ctx.font = '900 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('f\'(x₀)', 0, 0);

    if (dist <= 145) {
      ctx.direction = 'rtl';
      ctx.fillStyle = '#38bdf8';
      ctx.font = '800 11.5px Tahoma, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('[L2 / F] بناء جسر المماس +35 دم', 0, -28);
    }
    ctx.restore();
  }

  // Pickups (Blood Vials & Coordinate Cells)
  for (const pk of state.pickups) {
    ctx.save();
    ctx.translate(pk.x, pk.y + Math.sin(time * 5 + pk.id) * 2.5);
    if (pk.kind === 'blood') {
      // Crimson Cross Vial
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-4, -11, 8, 22);
      ctx.fillRect(-11, -4, 22, 8);
      ctx.strokeStyle = '#fecaca';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-4, -11, 8, 22);
    } else {
      // Emerald Coordinate Battery
      ctx.fillStyle = '#10b981';
      ctx.fillRect(-8, -10, 16, 20);
      ctx.strokeStyle = '#a7f3d0';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(-8, -10, 16, 20);
      ctx.direction = 'ltr';
      ctx.fillStyle = '#064e3b';
      ctx.font = '900 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Δx', 0, 1);
    }
    ctx.restore();
  }

  // Coordinate Monoliths
  for (const pil of state.pillars) {
    if (pil.x + pil.w < camX - 20 || pil.x > camX + viewW + 20 || pil.y + pil.h < camY - 20 || pil.y > camY + viewH + 20) continue;
    ctx.fillStyle = '#13111c';
    ctx.fillRect(pil.x, pil.y, pil.w, pil.h);
    ctx.strokeStyle = '#4c1d95';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(pil.x, pil.y, pil.w, pil.h);
    ctx.direction = 'ltr';
    ctx.fillStyle = '#c4b5fd';
    ctx.font = '800 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(pil.label || 'f\'=0', pil.x + pil.w / 2, pil.y + pil.h / 2 + 4);
  }

  // =========================================================================
  // ARTICULATED BIOMECHANICAL HORRORS (Zero plain circle bodies!)
  // =========================================================================
  for (const e of state.enemies) {
    if (e.x + 120 < camX || e.x - 120 > camX + viewW || e.y + 120 < camY || e.y - 120 > camY + viewH) continue;
    const ang = Math.atan2(p.y - e.y, p.x - e.x);

    // Draw Boss Multi-Segment Centipede Tail first
    if (e.kind === 'boss' && e.segments) {
      for (let s = e.segments.length - 1; s >= 0; s--) {
        const seg = e.segments[s];
        const segR = Math.max(18, e.radius * (1 - s * 0.11));
        ctx.save();
        ctx.translate(seg.x, seg.y);
        ctx.rotate(time * 3 + s);
        // Ribbed spine plates + lateral legs
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-segR * 1.4, -segR * 0.5);
        ctx.lineTo(segR * 1.4, segR * 0.5);
        ctx.moveTo(-segR * 1.4, segR * 0.5);
        ctx.lineTo(segR * 1.4, -segR * 0.5);
        ctx.stroke();

        ctx.fillStyle = '#3b0712';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(segR, 0);
        ctx.lineTo(0, segR * 0.8);
        ctx.lineTo(-segR, 0);
        ctx.lineTo(0, -segR * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.save();
    ctx.translate(e.x, e.y);

    ctx.save();
    ctx.rotate(ang);

    if (e.kind === 'stalker') {
      // 8-Legged Articulated Cusp Arachnid (عنكبوت النقطة المزواة)
      ctx.strokeStyle = e.hitFlash > 0 ? '#ffffff' : '#ef4444';
      ctx.lineWidth = 2.4;
      for (let side = -1; side <= 1; side += 2) {
        for (let leg = 0; leg < 4; leg++) {
          const baseAng = side * (0.45 + leg * 0.36);
          const stride = Math.sin(e.twitchPhase + leg * 1.3) * 0.28;
          const kneeX = Math.cos(baseAng + stride) * (e.radius * 0.95);
          const kneeY = Math.sin(baseAng + stride) * (e.radius * 1.15);
          const footX = Math.cos(baseAng - stride * 0.5) * (e.radius * 1.65);
          const footY = Math.sin(baseAng - stride * 0.5) * (e.radius * 1.65);
          ctx.beginPath();
          ctx.moveTo(0, side * 4);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.stroke();
        }
      }
      // Segmented Abdomen & Cephalothorax (Angular Polygon)
      ctx.fillStyle = e.hitFlash > 0 ? '#ffffff' : '#2e0812';
      ctx.strokeStyle = e.staggered ? '#fbbf24' : '#f87171';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(e.radius * 0.9, 0);
      ctx.lineTo(e.radius * 0.2, e.radius * 0.65);
      ctx.lineTo(-e.radius * 1.1, e.radius * 0.5);
      ctx.lineTo(-e.radius * 1.35, 0);
      ctx.lineTo(-e.radius * 1.1, -e.radius * 0.5);
      ctx.lineTo(e.radius * 0.2, -e.radius * 0.65);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Pincer Mandibles
      ctx.strokeStyle = '#fca5a5';
      ctx.beginPath();
      ctx.moveTo(e.radius * 0.8, -5);
      ctx.lineTo(e.radius * 1.4, -2);
      ctx.moveTo(e.radius * 0.8, 5);
      ctx.lineTo(e.radius * 1.4, 2);
      ctx.stroke();
    } else if (e.kind === 'wisp') {
      // Winged Asymptote Seraph (طيف المقارب المائل)
      const flap = Math.sin(e.twitchPhase * 1.2) * 10;
      ctx.fillStyle = e.hitFlash > 0 ? '#ffffff' : 'rgba(88, 28, 135, 0.85)';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      // Sweeping Bat/Skeletal Wings
      ctx.beginPath();
      ctx.moveTo(4, 0);
      ctx.lineTo(-8, -e.radius * 1.8 - flap);
      ctx.lineTo(-e.radius * 1.2, -e.radius * 0.9);
      ctx.lineTo(-e.radius * 1.5, 0);
      ctx.lineTo(-e.radius * 1.2, e.radius * 0.9);
      ctx.lineTo(-8, e.radius * 1.8 + flap);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Armored Inflection Executioner / Leviathan Head with Twin Curved Cleaver Scythes
      const swing = Math.sin(e.twitchPhase) * 0.35;
      ctx.strokeStyle = e.hitFlash > 0 ? '#ffffff' : '#fca5a5';
      ctx.lineWidth = e.kind === 'boss' ? 5 : 3.5;
      // Twin Scythe Arms
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(0, side * e.radius * 0.75);
        ctx.lineTo(e.radius * 1.2, side * e.radius * (1.05 + swing * side));
        ctx.lineTo(e.radius * 1.75, side * e.radius * (0.25 + swing * side));
        ctx.stroke();
      }
      // Armored Hexagonal Torso / Skull
      ctx.fillStyle = e.hitFlash > 0 ? '#ffffff' : e.kind === 'boss' ? '#450a0a' : '#5b0e14';
      ctx.strokeStyle = e.staggered ? '#fbbf24' : '#ef4444';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(e.radius, 0);
      ctx.lineTo(e.radius * 0.4, e.radius * 0.92);
      ctx.lineTo(-e.radius * 0.85, e.radius * 0.78);
      ctx.lineTo(-e.radius, 0);
      ctx.lineTo(-e.radius * 0.85, -e.radius * 0.78);
      ctx.lineTo(e.radius * 0.4, -e.radius * 0.92);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Glowing Ocular Visor / Eyes
    ctx.fillStyle = e.staggered ? '#fbbf24' : '#ff2a2a';
    ctx.fillRect(e.radius * 0.35, -5, 5, 3);
    ctx.fillRect(e.radius * 0.35, 2, 5, 3);
    ctx.restore();

    // Mathematical Tag & HP Bar above Horror
    ctx.direction = 'ltr';
    ctx.fillStyle = '#fda4af';
    ctx.font = '800 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(e.mathTag || 'f\'(x)', 0, -e.radius - 17);

    const bw = e.radius * 2;
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-bw / 2, -e.radius - 12, bw, 4.5);
    ctx.fillStyle = e.staggered ? '#fbbf24' : '#ef4444';
    ctx.fillRect(-bw / 2, -e.radius - 12, bw * Math.max(0, e.hp / e.maxHp), 4.5);

    if (e.staggered) {
      ctx.direction = 'rtl';
      ctx.fillStyle = '#fde047';
      ctx.font = '900 11.5px Tahoma, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('مشلول! [✕/▢] تشريح', 0, -e.radius - 28);
    }
    ctx.restore();
  }

  // Projectiles (Secant Harpoon Bolts & Boss Spikes)
  for (const b of state.projectiles) {
    const bAng = Math.atan2(b.vy, b.vx);
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(bAng);
    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(11, 0);
    ctx.lineTo(-8, -4.5);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-8, 4.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  for (const ep of state.enemyProjectiles) {
    ctx.save();
    ctx.translate(ep.x, ep.y);
    ctx.rotate(time * 9);
    ctx.fillStyle = '#c084fc';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(0, 8);
    ctx.lineTo(-8, 0);
    ctx.lineTo(0, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // =========================================================================
  // ARTICULATED SURVIVOR IN (O, i, j) (2-Bone IK Legs + Verlet Coat + Chainsaw)
  // =========================================================================
  if (p.slashAnim > 0) {
    const progress = 1 - p.slashAnim / 0.24;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.aimAngle);
    ctx.strokeStyle = p.frenzyTimer > 0 ? '#ef4444' : '#38bdf8';
    ctx.lineWidth = 7 * (1 - progress * 0.5);
    ctx.beginPath();
    ctx.arc(0, 0, 92, -1.15, 1.15);
    ctx.stroke();
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 76, -0.95, 0.95);
    ctx.stroke();
    ctx.restore();
  }

  // Draw Verlet Crimson Trenchcoat trailing behind Survivor
  if (p.coatNodes && p.coatNodes.length >= 3) {
    ctx.save();
    ctx.fillStyle = p.frenzyTimer > 0 ? 'rgba(185, 28, 28, 0.85)' : 'rgba(127, 29, 29, 0.78)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.6;
    const perpX = -Math.sin(p.aimAngle);
    const perpY = Math.cos(p.aimAngle);
    const n0 = p.coatNodes[0];
    const n1 = p.coatNodes[1];
    const n2 = p.coatNodes[2];
    ctx.beginPath();
    ctx.moveTo(n0.x + perpX * 9, n0.y + perpY * 9);
    ctx.lineTo(n1.x + perpX * 12, n1.y + perpY * 12);
    ctx.lineTo(n2.x + perpX * 15, n2.y + perpY * 15);
    ctx.lineTo(n2.x - perpX * 15, n2.y - perpY * 15);
    ctx.lineTo(n1.x - perpX * 12, n1.y - perpY * 12);
    ctx.lineTo(n0.x - perpX * 9, n0.y - perpY * 9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.aimAngle);

  // Articulated 2-Bone Stepping Legs
  const strideA = Math.sin(p.walkCycle) * 11;
  const strideB = -strideA;
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-2, -8);
  ctx.lineTo(strideA, -12);
  ctx.moveTo(-2, 8);
  ctx.lineTo(strideB, 12);
  ctx.stroke();

  // Toothed Derivative Ripper Chainsaw (Right Arm)
  ctx.fillStyle = '#334155';
  ctx.fillRect(6, 5, 12, 7);
  ctx.fillStyle = p.frenzyTimer > 0 ? '#ef4444' : '#e2e8f0';
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 1.5;
  ctx.fillRect(14, 6, 22, 5);
  ctx.strokeRect(14, 6, 22, 5);
  // Animated chainsaw teeth
  const toothShift = (time * 40) % 5;
  ctx.fillStyle = '#fbbf24';
  for (let tx = 15 + toothShift; tx < 34; tx += 5) {
    ctx.fillRect(tx, 4, 2.5, 2);
    ctx.fillRect(tx, 11, 2.5, 2);
  }

  // Shoulder Coordinate Lantern (Left Arm)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(4, -12, 14, 6);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(16, -12, 4, 6);

  // Armored Biomechanical Torso & Shoulders
  ctx.fillStyle = p.invulnTimer > 0 && Math.floor(time * 24) % 2 === 0 ? '#fca5a5' : '#0f172a';
  ctx.strokeStyle = p.onCurveBonus ? '#38bdf8' : '#f43f5e';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(4, 13);
  ctx.lineTo(-11, 11);
  ctx.lineTo(-14, 0);
  ctx.lineTo(-11, -11);
  ctx.lineTo(4, -13);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cyber-Visor Helmet
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(9, 0);
  ctx.lineTo(0, 7);
  ctx.lineTo(-7, 0);
  ctx.lineTo(0, -7);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(3, -4, 4, 8);
  ctx.restore();

  // Gore & Spark Particles
  for (const pt of state.particles) {
    ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
    ctx.fillStyle = pt.color;
    ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
  }
  ctx.globalAlpha = 1;

  // Floating Texts
  for (const ft of state.floatingTexts) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, ft.life / 0.35);
    ctx.direction = 'rtl';
    ctx.fillStyle = ft.color;
    ctx.font = '900 13px Tahoma, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }

  ctx.restore(); // Exit World Camera Transform

  // =========================================================================
  // HORROR FLASHLIGHT CONE & COORDINATE VISIBILITY
  // =========================================================================
  const cx = viewW / 2;
  const cy = viewH / 2;

  if (p.flareTimer > 0) {
    ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.fillRect(0, 0, viewW, viewH);
  } else {
    const reach = (viewW * 0.52) * (0.62 + 0.38 * (p.sanity / p.maxSanity));
    const darkGrad = ctx.createRadialGradient(cx, cy, 90, cx, cy, Math.max(250, reach));
    darkGrad.addColorStop(0, 'rgba(4, 2, 5, 0.0)');
    darkGrad.addColorStop(0.6, 'rgba(4, 2, 5, 0.32)');
    darkGrad.addColorStop(1, 'rgba(2, 1, 4, 0.72)');
    ctx.fillStyle = darkGrad;
    ctx.fillRect(0, 0, viewW, viewH);
  }

  // Visible Flashlight Cone Ray
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(p.aimAngle);
  const coneGrad = ctx.createRadialGradient(0, 0, 12, 0, 0, 350);
  coneGrad.addColorStop(0, 'rgba(254, 243, 199, 0.20)');
  coneGrad.addColorStop(1, 'rgba(254, 243, 199, 0.0)');
  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 350, -0.44, 0.44);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Damage & Low-HP Crimson Vignette
  const lowHpAlpha = p.hp < 40 ? ((40 - p.hp) / 40) * (0.28 + Math.sin(time * 9) * 0.1) : 0;
  const flashAlpha = Math.max(lowHpAlpha, state.damageFlash * 0.42, state.jumpscareTimer > 0 ? 0.35 : 0);
  if (flashAlpha > 0.01) {
    ctx.strokeStyle = `rgba(220, 38, 38, ${Math.min(0.85, flashAlpha)})`;
    ctx.lineWidth = 28;
    ctx.strokeRect(0, 0, viewW, viewH);
  }

  // Compact Seal & Boss Radar Compass around player
  const compassTargets = [];
  for (const s of state.seals) {
    if (!s.broken) compassTargets.push({ x: s.x, y: s.y, color: s.color, label: sealNumerals[s.id] });
  }
  const boss = state.enemies.find(e => e.kind === 'boss');
  if (boss) compassTargets.push({ x: boss.x, y: boss.y, color: '#ef4444', label: 'BOSS' });

  for (const tgt of compassTargets) {
    const dx = tgt.x - p.x;
    const dy = tgt.y - p.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 170) continue;
    const ang = Math.atan2(dy, dx);
    const r = Math.min(viewW, viewH) * 0.22;
    const px = cx + Math.cos(ang) * r;
    const py = cy + Math.sin(ang) * r;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(ang);
    ctx.fillStyle = tgt.color;
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-6, -6);
    ctx.lineTo(-6, 6);
    ctx.closePath();
    ctx.fill();
    ctx.rotate(-ang);
    ctx.direction = 'ltr';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(tgt.label, 0, -10);
    ctx.restore();
  }
};

/**
 * Renders Crisp Mathematical Curves for Visual Questions (Topics 24, 25, 30, 32, 34, 35, 36, 38)
 */
window.drawRitualGraph = function(canvas, graphSpec) {
  if (!canvas || !graphSpec) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, W, H);
  ctx.direction = 'ltr';

  let xmin = -4, xmax = 4, ymin = -3, ymax = 4;
  if (graphSpec.type === 'intersect_fg') { xmin = -3; xmax = 4; ymin = -2; ymax = 5; }
  else if (graphSpec.type === 'cubic_ox_sign') { xmin = -3.5; xmax = 3.5; ymin = -3; ymax = 3; }
  else if (graphSpec.type === 'inflection_cubic') { xmin = -1.5; xmax = 3.5; ymin = -1; ymax = 6; }
  else if (graphSpec.type === 'branch_parabolic_ox') { xmin = -0.5; xmax = 8; ymin = -0.5; ymax = 4.5; }
  else if (graphSpec.type === 'oblique_asymptote') { xmin = -1; xmax = 5; ymin = -4; ymax = 8; }
  else if (graphSpec.type === 'relative_position') { xmin = -3.5; xmax = 3.5; ymin = -4; ymax = 4; }
  else if (graphSpec.type === 'inverse_curve_sym') { xmin = -1.5; xmax = 4.5; ymin = -1.5; ymax = 4.5; }
  else if (graphSpec.type === 'vertical_half_tangent') { xmin = -0.8; xmax = 4.2; ymin = -0.5; ymax = 2.8; }

  const toX = (x) => ((x - xmin) / (xmax - xmin)) * W;
  const toY = (y) => H - ((y - ymin) / (ymax - ymin)) * H;

  // Faint Grid
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let gx = Math.ceil(xmin); gx <= Math.floor(xmax); gx++) {
    const px = toX(gx);
    ctx.moveTo(px, 0); ctx.lineTo(px, H);
  }
  for (let gy = Math.ceil(ymin); gy <= Math.floor(ymax); gy++) {
    const py = toY(gy);
    ctx.moveTo(0, py); ctx.lineTo(W, py);
  }
  ctx.stroke();

  // Axes (Ox, Oy)
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.52)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  if (ymin <= 0 && ymax >= 0) { ctx.moveTo(0, toY(0)); ctx.lineTo(W, toY(0)); }
  if (xmin <= 0 && xmax >= 0) { ctx.moveTo(toX(0), 0); ctx.lineTo(toX(0), H); }
  ctx.stroke();

  const plotCurve = (fn, color, dashed = false, startX = xmin, endX = xmax) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    if (dashed) ctx.setLineDash([6, 5]);
    ctx.beginPath();
    let started = false;
    const steps = 160;
    for (let i = 0; i <= steps; i++) {
      const x = startX + ((endX - startX) * i) / steps;
      const y = fn(x);
      if (!Number.isFinite(y) || y < ymin - 2 || y > ymax + 2) {
        started = false;
        continue;
      }
      const px = toX(x);
      const py = toY(y);
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  };

  const dot = (x, y, color, label) => {
    const px = toX(x);
    const py = toY(y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();
    if (label) {
      ctx.fillStyle = '#f8fafc';
      ctx.font = '800 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(label, px + 6, py - 6);
    }
  };

  switch (graphSpec.type) {
    case 'tangent_parabola':
      plotCurve(x => x * x - 2 * x + 3, '#38bdf8');
      plotCurve(x => 2 * x - 1, '#f87171', true);
      dot(2, 3, '#fbbf24', 'A(2,3)');
      break;
    case 'point_anguleux':
      plotCurve(x => Math.abs(x - 1), '#38bdf8');
      dot(1, 0, '#fbbf24', 'A(1,0)');
      break;
    case 'vertical_half_tangent':
      plotCurve(x => x >= 0 ? Math.sqrt(x) : NaN, '#38bdf8', false, 0, xmax);
      plotCurve(() => 0, '#fbbf24');
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(toX(0), toY(0));
      ctx.lineTo(toX(0), toY(1.6));
      ctx.stroke();
      dot(0, 0, '#ef4444', '(0,0) ↑');
      break;
    case 'sign_fprime':
      plotCurve(x => x * x - 4, '#34d399');
      dot(-2, 0, '#fbbf24', '-2');
      dot(2, 0, '#fbbf24', '2');
      break;
    case 'intersect_fg':
      plotCurve(x => x * x - 2, '#38bdf8');
      plotCurve(x => x, '#f87171');
      dot(-1, -1, '#fbbf24', '-1');
      dot(2, 2, '#fbbf24', '2');
      break;
    case 'cubic_ox_sign':
      plotCurve(x => 0.25 * x * (x - 2) * (x + 2), '#38bdf8');
      dot(-2, 0, '#fbbf24', '-2');
      dot(0, 0, '#fbbf24', '0');
      dot(2, 0, '#fbbf24', '2');
      break;
    case 'inflection_cubic':
      plotCurve(x => x * x * x - 3 * x * x + 4, '#c084fc');
      dot(1, 2, '#fbbf24', 'I(1,2)');
      break;
    case 'branch_parabolic_ox':
      plotCurve(x => x >= 0 ? 1.45 * Math.sqrt(x) : NaN, '#34d399', false, 0, xmax);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '800 11px monospace';
      ctx.fillText('lim f(x)/x = 0', toX(3.8), toY(1.2));
      break;
    case 'oblique_asymptote':
      plotCurve(x => 2 * x - 3, '#fbbf24', true);
      plotCurve(x => 2 * x - 3 + 1.8 / (x + 1.6), '#38bdf8');
      ctx.fillStyle = '#fbbf24';
      ctx.font = '800 11px monospace';
      ctx.fillText('y = 2x - 3', toX(2.1), toY(0.2));
      break;
    case 'relative_position':
      plotCurve(x => x - 1, '#fbbf24', true);
      plotCurve(x => x - 1 + (1.2 * x) / (x * x + 0.8), '#38bdf8');
      dot(0, -1, '#ef4444', '0');
      break;
    case 'inverse_curve_sym':
      plotCurve(x => x, '#94a3b8', true);
      plotCurve(x => x >= -0.4 ? Math.exp(x * 0.45) - 0.5 : NaN, '#38bdf8');
      plotCurve(x => x >= 0.4 ? Math.log(x + 0.5) / 0.45 : NaN, '#f472b6');
      ctx.fillStyle = '#94a3b8';
      ctx.font = '800 11px monospace';
      ctx.fillText('y = x', toX(3.1), toY(3.4));
      break;
  }
};
