/**
 * 60 FPS Super Mario-Style Mathematical Adventure Renderer
 */

window.renderQuestFrame = function(ctx, viewW, viewH, state) {
  const world = state.world;
  const hero = state.hero;
  const time = state.time;

  const shakeX = state.shake > 0.2 ? (Math.random() - 0.5) * state.shake : 0;
  const shakeY = state.shake > 0.2 ? (Math.random() - 0.5) * state.shake : 0;

  const camX = Math.max(0, Math.min(world.width - viewW, hero.x - viewW * 0.42)) + shakeX;
  const camY = Math.max(0, Math.min(world.height - viewH, hero.y - viewH * 0.55)) + shakeY;

  // 1. Sky Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, viewH);
  grad.addColorStop(0, world.theme.skyTop);
  grad.addColorStop(1, world.theme.skyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, viewW, viewH);

  // 2. Parallax Stars & Soft Clouds / Hills
  drawParallaxBackdrop(ctx, viewW, viewH, camX, world, time);

  ctx.save();
  ctx.translate(-camX, -camY);

  // 3. Subtle World Curve Watermark (ln, e^x, or shaded ∫)
  drawWorldMathBackdrop(ctx, world, camX, viewW);

  // 4. Left Asymptote Boundary Wall
  drawLeftAsymptoteWall(ctx, world, camX);

  // 5. Updraft Wind Currents (Flying zones)
  for (const up of state.updrafts) {
    if (up.x + up.w < camX - 40 || up.x > camX + viewW + 40) continue;
    drawUpdraft(ctx, up, time);
  }

  // 6. Riemann Area Pillars (World 3 interactive mechanic)
  if (state.areaPillars && state.areaPillars.length > 0) {
    drawRiemannAreaSection(ctx, state.areaPillars, time);
  }

  // 7. Ground & Floating Platforms
  for (const plat of state.platforms) {
    if (plat.x + plat.w < camX - 40 || plat.x > camX + viewW + 40) continue;
    drawPlatform(ctx, plat, world.theme);
  }

  // 8. Puzzle Bridges & Barriers + Connecting Wires
  for (const pz of state.puzzles) {
    drawPuzzleInfrastructure(ctx, pz, time);
  }

  // 9. Ladders (Climbing!)
  for (const lad of state.ladders) {
    if (lad.x + 50 < camX || lad.x - 50 > camX + viewW) continue;
    drawLadder(ctx, lad, hero);
  }

  // 10. Springs & Wings Power-ups
  for (const sp of state.springs) {
    if (sp.x + 60 < camX || sp.x - 60 > camX + viewW) continue;
    drawSpring(ctx, sp, time);
  }
  for (const wg of state.wings) {
    if (wg.collected) continue;
    if (wg.x + 50 < camX || wg.x - 50 > camX + viewW) continue;
    drawWingPickup(ctx, wg, time);
  }

  // 11. Checkpoints
  for (const cp of state.checkpoints) {
    if (cp.x + 60 < camX || cp.x - 60 > camX + viewW) continue;
    drawCheckpoint(ctx, cp, time);
  }

  // 12. Mystery ? Lesson Blocks
  for (const qb of state.questionBlocks) {
    if (qb.x + 60 < camX || qb.x - 60 > camX + viewW) continue;
    drawQuestionBlock(ctx, qb, time);
  }

  // 13. Physical Puzzle Signboards, Choice Blocks & Floor Pads
  for (const pz of state.puzzles) {
    drawPuzzleInteractive(ctx, pz, time);
  }

  // 14. Coins
  for (const c of state.coins) {
    if (c.collected) continue;
    if (c.x + 30 < camX || c.x - 30 > camX + viewW) continue;
    drawCoin(ctx, c, time);
  }

  // 15. Castle Door & Goal Flagpole
  drawCastleAndFlag(ctx, state, time);

  // 16. Math Critters (Mario Goomba-style)
  for (const cr of state.critters) {
    if (!cr.alive && cr.squishTimer <= 0) continue;
    if (cr.x + 60 < camX || cr.x - 60 > camX + viewW) continue;
    drawCritter(ctx, cr, time);
  }

  // 17. Hero Explorer ("لبيب الرياضي")
  drawMarioHero(ctx, hero, time);

  // 18. Particles & Floating Popups
  for (const pt of state.particles) {
    ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (const ft of state.floatingTexts) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, ft.life / 0.35);
    ctx.direction = ft.ltr ? 'ltr' : 'rtl';
    ctx.font = '900 13px Cairo, Tahoma, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#030712';
    ctx.fillText(ft.text, ft.x + 1, ft.y + 1);
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }

  ctx.restore();

  // Soft Damage Vignette
  if (state.hurtFlash > 0.02) {
    ctx.strokeStyle = `rgba(251, 113, 133, ${state.hurtFlash * 0.55})`;
    ctx.lineWidth = 22;
    ctx.strokeRect(0, 0, viewW, viewH);
  }
};

function drawParallaxBackdrop(ctx, viewW, viewH, camX, world, time) {
  ctx.save();
  // Soft distant stars / sparkles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let i = 0; i < 28; i++) {
    const sx = ((i * 197 + 40 - camX * 0.12) % viewW + viewW) % viewW;
    const sy = 45 + ((i * 89) % (viewH * 0.52));
    const r = (i % 3 === 0) ? 2 : 1.3;
    ctx.globalAlpha = 0.25 + 0.3 * Math.sin(time * 2 + i);
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Fluffy Mario-style distant hills / clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let i = -1; i < 7; i++) {
    const hx = i * 360 - ((camX * 0.25) % 360);
    const hy = viewH - 90;
    ctx.beginPath();
    ctx.arc(hx + 180, hy + 40, 190, Math.PI, 0);
    ctx.fill();
  }

  // Floating decorative clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.065)';
  for (let i = 0; i < 6; i++) {
    const cx = ((i * 340 + 80 - camX * 0.35) % (viewW + 240) + (viewW + 240)) % (viewW + 240) - 120;
    const cy = 95 + (i % 3) * 65;
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.arc(cx + 22, cy - 8, 28, 0, Math.PI * 2);
    ctx.arc(cx + 46, cy, 22, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawWorldMathBackdrop(ctx, world, camX, viewW) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  const x0 = Math.max(80, camX - 20);
  const x1 = Math.min(world.width - 40, camX + viewW + 20);
  for (let x = x0; x <= x1; x += 24) {
    const t = (x - 80) / 380;
    let y = 480;
    if (world.theme.curveKind === 'ln') {
      y = 480 - Math.log(Math.max(0.2, t + 0.2)) * 95;
    } else if (world.theme.curveKind === 'exp') {
      y = 540 - Math.min(420, Math.exp(t * 0.75) * 32);
    } else if (world.theme.curveKind === 'integral') {
      y = 440 - Math.sin(t * 1.3) * 75 - t * 24;
    } else {
      y = 470 - Math.sin(t * 1.1) * 60 - Math.log(t + 1) * 45;
    }
    if (x === x0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

function isolateLtrInRtl(str) {
  // Isolate LTR math spans inside Canvas RTL text using Unicode LRI..PDI isolates
  return String(str || '').replace(
    /[A-Za-z0-9\]\[(){}|eˣ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻₀₁₂₃₄₅₆₇₈₉∞∫.,+\-*/=<>≤≥≠∈∉ℝℚℕ⇒⇔→←_]+(?:\s+[A-Za-z0-9\]\[(){}|eˣ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻₀₁₂₃₄₅₆₇₈₉∞∫.,+\-*/=<>≤≥≠∈∉ℝℚℕ⇒⇔→←_]+)*/g,
    (m) => {
      let clean = m.replace(/^\s*[)]+\s*/, '').replace(/\s*[(]+\s*$/, '');
      if (!clean || /^[.,+\-*/=<>()\[\]{}:\s_]+$/.test(clean)) return m;
      const pre = m.slice(0, m.indexOf(clean));
      const post = m.slice(m.indexOf(clean) + clean.length);
      return `${pre}\u2066${clean}\u2069${post}`;
    }
  );
}

function splitPuzzleSignPrompt(pz) {
  if (pz && (pz.signAr || pz.signMath)) {
    return { ar: pz.signAr || '', math: pz.signMath || '' };
  }
  const s = String(pz?.prompt || pz || '');
  const idx = s.indexOf(':');
  if (idx !== -1) {
    return { ar: s.slice(0, idx + 1).trim(), math: s.slice(idx + 1).trim() };
  }
  return { ar: isolateLtrInRtl(s), math: '' };
}

function drawLeftAsymptoteWall(ctx, world, camX) {
  if (camX > 280) return;
  ctx.save();
  ctx.fillStyle = 'rgba(244, 63, 94, 0.16)';
  ctx.fillRect(0, 0, 40, world.height);
  ctx.strokeStyle = '#fb7185';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(40, 0);
  ctx.lineTo(40, world.height);
  ctx.stroke();
  ctx.setLineDash([]);

  if (world.leftWallLabelAr || world.leftWallLabelMath) {
    ctx.textAlign = 'left';
    if (world.leftWallLabelAr) {
      ctx.direction = 'rtl';
      ctx.fillStyle = '#fda4af';
      ctx.font = '800 12px Cairo, Tahoma, sans-serif';
      ctx.fillText(world.leftWallLabelAr, 54, 122);
    }
    if (world.leftWallLabelMath) {
      ctx.direction = 'ltr';
      ctx.fillStyle = '#fecdd3';
      ctx.font = '900 12px monospace';
      ctx.fillText(world.leftWallLabelMath, 54, 142);
    }
  } else {
    ctx.direction = 'rtl';
    ctx.fillStyle = '#fda4af';
    ctx.font = '800 12px Cairo, Tahoma, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(isolateLtrInRtl(world.leftWallLabel || 'بداية المجال'), 280, 130);
  }
  ctx.restore();
}

function drawUpdraft(ctx, up, time) {
  ctx.save();
  const grad = ctx.createLinearGradient(up.x, up.y + up.h, up.x, up.y);
  grad.addColorStop(0, 'rgba(56, 189, 248, 0.04)');
  grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.18)');
  grad.addColorStop(1, 'rgba(251, 191, 36, 0.04)');
  ctx.fillStyle = grad;
  ctx.fillRect(up.x, up.y, up.w, up.h);

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
  ctx.lineWidth = 2;
  const cx = up.x + up.w / 2;
  for (let i = 0; i < 6; i++) {
    const offset = ((time * 95 + i * 65) % up.h);
    const cy = up.y + up.h - offset;
    ctx.beginPath();
    ctx.moveTo(cx - 16, cy + 8);
    ctx.lineTo(cx, cy - 4);
    ctx.lineTo(cx + 16, cy + 8);
    ctx.stroke();
  }

  ctx.direction = 'rtl';
  ctx.fillStyle = '#bae6fd';
  ctx.font = '800 11px Cairo, Tahoma, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(isolateLtrInRtl(up.label || 'تيار صاعد'), cx, up.y + 18);
  ctx.restore();
}

function drawRiemannAreaSection(ctx, pillars, time) {
  ctx.save();
  const first = pillars[0];
  const last = pillars[pillars.length - 1];
  const minX = first.x - 10;
  const maxX = last.x + last.w + 10;

  // Draw target smooth curve above the Riemann pillars
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 30; i++) {
    const px = minX + ((maxX - minX) * i) / 30;
    const py = 468 + Math.sin((px - minX) * 0.015) * 26;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  let litCount = 0;
  for (const pil of pillars) {
    if (pil.lit) litCount++;
    ctx.fillStyle = pil.lit ? 'rgba(16, 185, 129, 0.42)' : 'rgba(56, 189, 248, 0.14)';
    ctx.fillRect(pil.x, pil.y, pil.w, pil.h);
    ctx.strokeStyle = pil.lit ? '#34d399' : 'rgba(125, 211, 252, 0.65)';
    ctx.lineWidth = 2;
    if (!pil.lit) ctx.setLineDash([5, 4]);
    ctx.strokeRect(pil.x, pil.y, pil.w, pil.h);
    ctx.setLineDash([]);

    ctx.direction = 'ltr';
    ctx.fillStyle = pil.lit ? '#ecfdf5' : '#bae6fd';
    ctx.font = '900 13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(pil.lit ? '+1 ✓' : '1', pil.x + pil.w / 2, pil.y + pil.h / 2);
  }

  ctx.direction = 'rtl';
  ctx.fillStyle = litCount === pillars.length ? '#34d399' : '#fde68a';
  ctx.font = '900 13px Cairo, Tahoma, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    litCount === pillars.length
      ? `أحسنت! مجموع المساحة = ${litCount} مستطيلات ✓`
      : `امشِ فوق الأعمدة لتلوين المساحة (${litCount}/${pillars.length})`,
    (minX + maxX) / 2,
    385 + Math.sin(time * 3) * 2
  );
  ctx.restore();
}

function drawPlatform(ctx, plat, theme) {
  ctx.save();
  if (plat.ground) {
    ctx.fillStyle = theme.groundFill;
    ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

    // Brick / stone subtle pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let bx = plat.x; bx < plat.x + plat.w; bx += 48) {
      ctx.beginPath();
      ctx.moveTo(bx, plat.y + 14);
      ctx.lineTo(bx, plat.y + plat.h);
      ctx.stroke();
    }

    // Top turf / cap
    ctx.fillStyle = theme.groundTop;
    ctx.fillRect(plat.x, plat.y, plat.w, 12);
  } else {
    ctx.fillStyle = theme.platFill;
    roundRect(ctx, plat.x, plat.y, plat.w, plat.h, 7, true, false);
    ctx.strokeStyle = theme.platBorder;
    ctx.lineWidth = 2.2;
    roundRect(ctx, plat.x, plat.y, plat.w, plat.h, 7, false, true);
  }
  ctx.restore();
}

function drawPuzzleInfrastructure(ctx, pz, time) {
  ctx.save();
  // Wire from sign to bridge/barrier
  const target = pz.bridge || pz.barrier;
  if (target) {
    ctx.strokeStyle = pz.solved ? 'rgba(52, 211, 153, 0.7)' : 'rgba(251, 191, 36, 0.38)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(pz.signX, pz.signY + 28);
    ctx.lineTo(target.x + target.w / 2, target.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (pz.bridge) {
    const b = pz.bridge;
    if (pz.solved) {
      ctx.fillStyle = '#065f46';
      roundRect(ctx, b.x, b.y, b.w, b.h, 6, true, false);
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.5;
      roundRect(ctx, b.x, b.y, b.w, b.h, 6, false, true);
    } else {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.setLineDash([]);
      ctx.direction = 'rtl';
      ctx.fillStyle = 'rgba(253, 230, 138, 0.8)';
      ctx.font = '800 11px Cairo, Tahoma, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('جسر مقفل — حلّ اللغز للفتح', b.x + b.w / 2, b.y - 10);
    }
  }

  if (pz.barrier && !pz.solved) {
    const bar = pz.barrier;
    if (bar.y > 0) {
      ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
      ctx.fillRect(bar.x + 4, 0, bar.w - 8, bar.y);
      ctx.strokeStyle = 'rgba(251, 113, 133, 0.58)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(bar.x + bar.w / 2, 0);
      ctx.lineTo(bar.x + bar.w / 2, bar.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.fillStyle = 'rgba(244, 63, 94, 0.28)';
    ctx.fillRect(bar.x, bar.y, bar.w, bar.h);
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(bar.x, bar.y, bar.w, bar.h);
    // Laser bars
    for (let ly = bar.y + 18; ly < bar.y + bar.h; ly += 26) {
      ctx.beginPath();
      ctx.moveTo(bar.x + 2, ly);
      ctx.lineTo(bar.x + bar.w - 2, ly);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawPuzzleInteractive(ctx, pz, time) {
  ctx.save();
  // Signboard (supports clean 2-line Arabic RTL + Math LTR display when formula present)
  const parts = splitPuzzleSignPrompt(pz);
  const arText = parts.ar ? (pz.solved ? `✓ ${parts.ar}` : `🧩 ${parts.ar}`) : '';
  ctx.font = '800 11.5px Cairo, Tahoma, sans-serif';
  const arW = arText ? ctx.measureText(arText).width : 0;
  ctx.font = '900 12.5px monospace';
  const mathW = parts.math ? ctx.measureText(parts.math).width : 0;
  const sw = Math.max(288, Math.ceil(Math.max(arW, mathW)) + 36);
  const sh = parts.math ? 56 : 44;
  ctx.fillStyle = pz.solved ? 'rgba(6, 78, 59, 0.92)' : 'rgba(15, 23, 42, 0.94)';
  roundRect(ctx, pz.signX - sw / 2, pz.signY - sh / 2, sw, sh, 10, true, false);
  ctx.strokeStyle = pz.solved ? '#34d399' : '#fbbf24';
  ctx.lineWidth = 2;
  roundRect(ctx, pz.signX - sw / 2, pz.signY - sh / 2, sw, sh, 10, false, true);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (parts.math) {
    ctx.direction = 'rtl';
    ctx.fillStyle = pz.solved ? '#a7f3d0' : '#fde68a';
    ctx.font = '800 11.5px Cairo, Tahoma, sans-serif';
    ctx.fillText(arText, pz.signX, pz.signY - 13);

    ctx.direction = 'ltr';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 12.5px monospace';
    ctx.fillText(parts.math, pz.signX, pz.signY + 13);
  } else {
    ctx.direction = 'rtl';
    ctx.fillStyle = pz.solved ? '#a7f3d0' : '#fef3c7';
    ctx.font = '900 12px Cairo, Tahoma, sans-serif';
    ctx.fillText(arText, pz.signX, pz.signY);
  }

  // Options (pads or floating Mario blocks)
  for (const opt of pz.options) {
    if (pz.kind === 'pads') {
      const pw = 86;
      const ph = opt.triedWrong ? 8 : 13;
      ctx.fillStyle = opt.solved ? '#10b981' : opt.triedWrong ? '#64748b' : '#f59e0b';
      roundRect(ctx, opt.x - pw / 2, opt.y - ph, pw, ph, 5, true, false);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      roundRect(ctx, opt.x - pw / 2, opt.y - ph, pw, ph, 5, false, true);

      // Pill label above pad
      ctx.fillStyle = 'rgba(7, 17, 30, 0.9)';
      roundRect(ctx, opt.x - 36, opt.y - 44, 72, 24, 7, true, false);
      ctx.strokeStyle = opt.solved ? '#34d399' : opt.triedWrong ? '#f43f5e' : '#fbbf24';
      ctx.strokeRect(opt.x - 36, opt.y - 44, 72, 24);
      ctx.direction = 'ltr';
      ctx.fillStyle = opt.triedWrong ? '#94a3b8' : '#ffffff';
      ctx.font = '900 12px monospace';
      ctx.fillText(opt.label, opt.x, opt.y - 32);
    } else {
      // Floating Mario Choice Blocks
      const bw = 72;
      const bh = 38;
      const bob = opt.bumpOffset || 0;
      const bx = opt.x;
      const by = opt.y + bob;
      ctx.fillStyle = opt.solved ? '#059669' : opt.triedWrong ? '#334155' : '#d97706';
      roundRect(ctx, bx, by, bw, bh, 7, true, false);
      ctx.strokeStyle = opt.solved ? '#6ee7b7' : opt.triedWrong ? '#64748b' : '#fde047';
      ctx.lineWidth = 2.2;
      roundRect(ctx, bx, by, bw, bh, 7, false, true);

      ctx.direction = 'ltr';
      ctx.fillStyle = opt.triedWrong ? '#94a3b8' : '#ffffff';
      ctx.font = '900 13px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opt.label, bx + bw / 2, by + bh / 2);
    }
  }
  ctx.restore();
}

function drawLadder(ctx, lad, hero) {
  ctx.save();
  const xL = lad.x - lad.w / 2 + 4;
  const xR = lad.x + lad.w / 2 - 4;
  const near = Math.abs(hero.x - lad.x) < 28 && hero.y >= lad.topY - 24 && hero.y <= lad.bottomY + 12;

  ctx.strokeStyle = near ? '#fde047' : '#d97706';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(xL, lad.topY);
  ctx.lineTo(xL, lad.bottomY);
  ctx.moveTo(xR, lad.topY);
  ctx.lineTo(xR, lad.bottomY);
  ctx.stroke();

  ctx.lineWidth = 3;
  for (let ry = lad.topY + 14; ry < lad.bottomY; ry += 20) {
    ctx.beginPath();
    ctx.moveTo(xL, ry);
    ctx.lineTo(xR, ry);
    ctx.stroke();
  }

  if (near) {
    ctx.direction = 'rtl';
    ctx.fillStyle = '#fde68a';
    ctx.font = '800 11px Cairo, Tahoma, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▲ ▼ تسلق', lad.x, lad.topY - 12);
  }
  ctx.restore();
}

function drawSpring(ctx, sp, time) {
  ctx.save();
  const comp = sp.bounceTimer > 0 ? 6 : 0;
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(sp.x - 16, sp.y - 12 + comp, 32, 12 - comp);
  ctx.fillStyle = '#ef4444';
  roundRect(ctx, sp.x - sp.w / 2, sp.y - 19 + comp, sp.w, 9, 4, true, false);
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.6;
  roundRect(ctx, sp.x - sp.w / 2, sp.y - 19 + comp, sp.w, 9, 4, false, true);
  ctx.restore();
}

function drawWingPickup(ctx, wg, time) {
  ctx.save();
  const wy = wg.y + Math.sin(time * 4) * 5;
  ctx.translate(wg.x, wy);

  // Halo
  ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();

  // Golden Wing Shape
  const flap = Math.sin(time * 7) * 0.22;
  ctx.fillStyle = '#fde047';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  for (const s of [-1, 1]) {
    ctx.save();
    ctx.scale(s, 1);
    ctx.rotate(flap);
    ctx.beginPath();
    ctx.moveTo(2, 2);
    ctx.quadraticCurveTo(18, -14, 22, -4);
    ctx.quadraticCurveTo(14, 6, 3, 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  ctx.direction = 'ltr';
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('eˣ', 0, 2);
  ctx.restore();
}

function drawCheckpoint(ctx, cp, time) {
  ctx.save();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cp.x, cp.y);
  ctx.lineTo(cp.x, cp.y - 46);
  ctx.stroke();

  const wave = Math.sin(time * 5 + cp.x) * 3;
  ctx.fillStyle = cp.activated ? '#10b981' : '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(cp.x, cp.y - 46);
  ctx.lineTo(cp.x + 26, cp.y - 38 + wave);
  ctx.lineTo(cp.x, cp.y - 28);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cp.x, cp.y - 48, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawQuestionBlock(ctx, qb, time) {
  ctx.save();
  const bw = 44;
  const bh = 38;
  const bob = qb.bumpOffset || (!qb.opened ? Math.sin(time * 3.5 + qb.x * 0.02) * 2.5 : 0);
  const bx = qb.x;
  const by = qb.y + bob;

  ctx.fillStyle = qb.opened ? '#78350f' : '#f59e0b';
  roundRect(ctx, bx, by, bw, bh, 7, true, false);
  ctx.strokeStyle = qb.opened ? '#d97706' : '#fef08a';
  ctx.lineWidth = 2.5;
  roundRect(ctx, bx, by, bw, bh, 7, false, true);

  // Corner bolts
  ctx.fillStyle = qb.opened ? '#b45309' : '#b45309';
  for (const rx of [bx + 6, bx + bw - 6]) {
    for (const ry of [by + 6, by + bh - 6]) {
      ctx.beginPath();
      ctx.arc(rx, ry, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.direction = 'ltr';
  ctx.fillStyle = qb.opened ? '#fde68a' : '#1e1b4b';
  ctx.font = '900 16px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(qb.opened ? '✓' : '?', bx + bw / 2, by + bh / 2 - 4);

  ctx.font = '800 9px monospace';
  ctx.fillText(qb.label || '', bx + bw / 2, by + bh - 8);
  ctx.restore();
}

function drawCoin(ctx, c, time) {
  ctx.save();
  const spin = Math.abs(Math.cos(time * 4 + c.x * 0.03));
  const w = Math.max(3, 10 * spin);
  const cy = c.y + Math.sin(time * 4 + c.x * 0.05) * 3;

  ctx.fillStyle = '#fbbf24';
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(c.x, cy, w, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (w > 6) {
    ctx.fillStyle = '#92400e';
    ctx.fillRect(c.x - 1.5, cy - 5, 3, 10);
  }
  ctx.restore();
}

function drawCastleAndFlag(ctx, state, time) {
  const door = state.castleDoor;
  const flag = state.flagpole;
  ctx.save();

  // Castle structure around door
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(door.x - 42, door.y - 108, 84, 108);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.strokeRect(door.x - 42, door.y - 108, 84, 108);

  // Battlements
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#334155';
    ctx.fillRect(door.x - 42 + i * 22, door.y - 122, 16, 14);
  }

  // Arch Door
  ctx.fillStyle = state.gateSolved ? '#10b981' : '#7c3aed';
  ctx.beginPath();
  ctx.arc(door.x, door.y - 38, 22, Math.PI, 0);
  ctx.lineTo(door.x + 22, door.y);
  ctx.lineTo(door.x - 22, door.y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = state.gateSolved ? '#6ee7b7' : '#e9d5ff';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.direction = 'rtl';
  ctx.fillStyle = '#f8fafc';
  ctx.font = '800 11px Cairo, Tahoma, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    state.gateSolved ? 'البوابة مفتوحة ✓' : '[E / ▢] لغز القلعة',
    door.x,
    door.y - 134
  );

  // Towering Flagpole
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(flag.x, flag.y);
  ctx.lineTo(flag.x, flag.y - 175);
  ctx.stroke();

  // Golden Finial Orb
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(flag.x, flag.y - 180, 9, 0, Math.PI * 2);
  ctx.fill();

  // Goal Flag
  const fy = flag.y - 168;
  const wave = Math.sin(time * 5) * 4;
  ctx.fillStyle = state.gateSolved ? '#10b981' : '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(flag.x, fy);
  ctx.lineTo(flag.x - 46, fy + 16 + wave);
  ctx.lineTo(flag.x, fy + 34);
  ctx.closePath();
  ctx.fill();

  ctx.direction = 'ltr';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 12px monospace';
  ctx.fillText('∫', flag.x - 16, fy + 18);

  ctx.restore();
}

function drawCritter(ctx, cr, time) {
  ctx.save();
  ctx.translate(cr.x, cr.y);

  if (!cr.alive) {
    // Squished flat!
    ctx.fillStyle = '#e11d48';
    roundRect(ctx, -18, 8, 36, 10, 4, true, false);
    ctx.restore();
    return;
  }

  const hop = Math.abs(Math.sin(time * 6 + cr.x * 0.04)) * 3;
  ctx.translate(0, -hop);

  // Mushroom/Slime cap body
  ctx.fillStyle = '#be123c';
  ctx.beginPath();
  ctx.arc(0, 0, 17, Math.PI, 0);
  ctx.lineTo(17, 12);
  ctx.lineTo(-17, 12);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#fda4af';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Little feet
  const step = Math.sin(time * 12) * 3;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-12 + step, 12, 8, 6);
  ctx.fillRect(4 - step, 12, 8, 6);

  // Expressive eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-6, -2, 3.8, 0, Math.PI * 2);
  ctx.arc(6, -2, 3.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-5.5, -2, 1.8, 0, Math.PI * 2);
  ctx.arc(6.5, -2, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Angry cute brows
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-10, -7); ctx.lineTo(-2, -4);
  ctx.moveTo(10, -7); ctx.lineTo(2, -4);
  ctx.stroke();

  // Math label floating above critter
  ctx.direction = 'ltr';
  ctx.fillStyle = '#fecdd3';
  ctx.font = '800 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(cr.label || 'err', 0, -23);

  ctx.restore();
}

function drawMarioHero(ctx, h, time) {
  if (h.invulnTimer > 0 && Math.floor(time * 18) % 2 === 0) return;

  ctx.save();
  ctx.translate(h.x, h.y);
  const dir = h.facing || 1;

  // Golden e^x Wings on back when active!
  if (h.hasWings) {
    const flap = h.flying ? Math.sin(time * 24) * 0.45 : Math.sin(time * 4) * 0.12;
    ctx.save();
    ctx.translate(-dir * 7, -2);
    ctx.rotate(-dir * (0.35 + flap));
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-dir * 22, -18, -dir * 26, -3);
    ctx.quadraticCurveTo(-dir * 16, 10, 0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Animated Legs
  const stride = h.onLadder
    ? Math.sin(h.climbCycle) * 5
    : h.grounded
    ? Math.sin(h.walkCycle) * 6
    : 4;

  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-4, 6);
  ctx.lineTo(-5 + stride * 0.6, 17);
  ctx.moveTo(4, 6);
  ctx.lineTo(5 - stride * 0.6, 17);
  ctx.stroke();

  // Shoes
  ctx.fillStyle = '#92400e';
  ctx.fillRect(-9 + stride * 0.6, 15, 8, 4);
  ctx.fillRect(1 - stride * 0.6, 15, 8, 4);

  // Overalls / Torso (Classic Mario-inspired cyan/blue & emerald!)
  ctx.fillStyle = '#2563eb';
  roundRect(ctx, -10, -5, 20, 14, 5, true, false);
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(-5, 0, 2, 0, Math.PI * 2);
  ctx.arc(5, 0, 2, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(0, -11, 9.5, 0, Math.PI * 2);
  ctx.fill();

  // Eyes looking in facing direction
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(dir * 3.5, -11, 2, 0, Math.PI * 2);
  ctx.fill();

  // Iconic Cap
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(0, -14, 10, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  // Cap brim
  ctx.fillRect(dir > 0 ? 0 : -13, -15, 13, 3.5);

  // Cap Badge (∫)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(dir * 2, -18, 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.direction = 'ltr';
  ctx.fillStyle = '#ef4444';
  ctx.font = '900 7px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('∫', dir * 2, -18);

  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
