/**
 * Asymptote Asylum - Living Orthonormal Coordinate Plane (O, i, j) World & Biomechanical Horror Engine
 * The player walks inside an orthonormal coordinate frame (O, i, j) along the curve (Cf): y = f(x),
 * constructs walkable Tangent Bridges (T): y = f'(x0)(x - x0) + f(x0), reflects across the First Bisector Δ: y = x,
 * crosses Vertical Asymptote Rifts x = a, and dismembers articulated biomechanical horrors at 60 FPS.
 */

window.WORLD_CONFIG = {
  WIDTH: 1920,
  HEIGHT: 1280,
  ORIGIN_X: 960,
  ORIGIN_Y: 640,
  UNIT_PX: 120, // 1 mathematical unit in (O, i, j) = 120px
  MAX_DECALS: 165,
  MAX_PARTICLES: 145
};

// Coordinate conversion helpers between World Pixels (x, y) and Orthonormal Frame (X, Y) in (O, i, j)
window.worldToMath = function(wx, wy) {
  const cfg = window.WORLD_CONFIG;
  return {
    X: (wx - cfg.ORIGIN_X) / cfg.UNIT_PX,
    Y: (cfg.ORIGIN_Y - wy) / cfg.UNIT_PX
  };
};

window.mathToWorld = function(X, Y) {
  const cfg = window.WORLD_CONFIG;
  return {
    x: cfg.ORIGIN_X + X * cfg.UNIT_PX,
    y: cfg.ORIGIN_Y - Y * cfg.UNIT_PX
  };
};

// Analytical Primary Curve f(X), First Derivative f'(X), and Second Derivative f''(X) in (O, i, j)
window.evalCurveF = function(X) {
  // Rich differentiable wave with extrema, inflection near X=0, and steep branches
  return 1.65 * Math.sin(0.55 * X) + 0.18 * X * Math.cos(0.35 * X);
};

window.evalCurveFPrime = function(X) {
  return 1.65 * 0.55 * Math.cos(0.55 * X) + 0.18 * Math.cos(0.35 * X) - 0.18 * 0.35 * X * Math.sin(0.35 * X);
};

window.evalCurveFSecond = function(X) {
  return -1.65 * 0.55 * 0.55 * Math.sin(0.55 * X) - 2 * 0.18 * 0.35 * Math.sin(0.35 * X) - 0.18 * 0.35 * 0.35 * X * Math.cos(0.35 * X);
};

// Secondary Auxiliary Curve g(X) for relative position & intersection (Topics 31, 32, 36)
window.evalCurveG = function(X) {
  return 0.32 * X - 0.4;
};

window.createInitialAsylumState = function(topicFilter = 'all') {
  const W = window.WORLD_CONFIG.WIDTH;
  const H = window.WORLD_CONFIG.HEIGHT;

  // Coordinate-plane structural monoliths (Asymptote Anchors)
  const pillars = [
    { x: 640, y: 420, w: 86, h: 150, label: 'x = -2.3' },
    { x: 1194, y: 420, w: 86, h: 150, label: 'x = +2.3' },
    { x: 640, y: 710, w: 86, h: 150, label: 'f\'(x)=0' },
    { x: 1194, y: 710, w: 86, h: 150, label: 'f\'\'(x)=0' }
  ];

  // Vertical Asymptote Plasma Rifts (x = -3.8 and x = +3.8 in math coords)
  const asymptoteRifts = [
    { mathX: -3.8, worldX: window.WORLD_CONFIG.ORIGIN_X - 3.8 * window.WORLD_CONFIG.UNIT_PX, label: 'x = -3.8 (lim f = ±∞)' },
    { mathX: 3.8, worldX: window.WORLD_CONFIG.ORIGIN_X + 3.8 * window.WORLD_CONFIG.UNIT_PX, label: 'x = +3.8 (lim f = ±∞)' }
  ];

  const wards = window.ASYLUM_WARDS || [];
  // 4 Coordinate Fracture Nodes at strategic quadrants of (O, i, j)
  const sealCoords = [
    { x: 410, y: 270, mathLabel: 'A(-4.6, 3.1)' },
    { x: 1510, y: 270, mathLabel: 'B(4.6, 3.1)' },
    { x: 1510, y: 1010, mathLabel: 'C(4.6, -3.1)' },
    { x: 410, y: 1010, mathLabel: 'D(-4.6, -3.1)' }
  ];

  const seals = sealCoords.map((pos, idx) => {
    const ward = wards[idx] || { id: idx + 1, name: `عقدة المعلم ${idx + 1}`, topics: [23 + idx], sealColor: '#ef4444' };
    return {
      id: idx,
      x: pos.x,
      y: pos.y,
      mathLabel: pos.mathLabel,
      radius: 42,
      wardName: ward.name,
      topics: ward.topics,
      color: ward.sealColor,
      broken: false,
      pulse: idx * 1.4
    };
  });

  // Tangent Forge Nodes (مرتكزات التقريب التآلفي وجسور المماس) replacing old prisoner cages
  const forgeCoords = [
    { x: 560, y: 260, x0: '-3.3', label: 'مرتكز مماس $x_0 = -3.3$' },
    { x: 1360, y: 260, x0: '+3.3', label: 'مرتكز مماس $x_0 = +3.3$' },
    { x: 960, y: 470, x0: '0.0', label: 'نقطة انعطاف $I(0, 0)$' },
    { x: 560, y: 1020, x0: '-3.3', label: 'مرتكز الدالة المساعدة $g(x)$' },
    { x: 1360, y: 1020, x0: '+3.3', label: 'مرتكز الدالة العكسية $f^{-1}$' },
    { x: 960, y: 810, x0: '0.0', label: 'مركز التماثل $\\Omega(a, b)$' }
  ];

  const captives = forgeCoords.map((c, idx) => ({
    id: idx,
    x: c.x,
    y: c.y,
    x0: c.x0,
    radius: 20,
    label: c.label,
    alive: true,
    shiverPhase: Math.random() * Math.PI * 2
  }));

  // Initial ambient blood & bone decals along the coordinate plane
  const decals = [];
  for (let i = 0; i < 24; i++) {
    decals.push({
      kind: i % 5 === 0 ? 'bones' : 'blood',
      x: 220 + Math.random() * (W - 440),
      y: 180 + Math.random() * (H - 360),
      r: 14 + Math.random() * 26,
      rot: Math.random() * Math.PI * 2,
      alpha: 0.34 + Math.random() * 0.32
    });
  }

  return {
    mode: 'intro', // 'intro' | 'play' | 'ritual' | 'pause' | 'end'
    topicFilter,   // 'all' | 'sectionA' | 'sectionB'
    time: 0,
    worldTimeScale: 1,
    screenShake: 0,
    damageFlash: 0,
    jumpscareTimer: 0,
    heartbeatTimer: 0,
    bannerText: 'المعلم المتعامد الممنظم (O, i, j) — اسلك المنحنى (Cf) وحطّم عقد الانشقاق الأربعة',
    bannerTimer: 4.5,

    player: {
      x: W / 2,
      y: H / 2,
      vx: 0,
      vy: 0,
      walkCycle: 0,
      radius: 19,
      aimAngle: 0,
      hp: 100,
      maxHp: 100,
      sanity: 100,
      maxSanity: 100,
      speed: 295,
      invulnTimer: 0,
      dashTimer: 0,
      dashCooldown: 0,
      dashVx: 0,
      dashVy: 0,
      slashCooldown: 0,
      slashAnim: 0,
      boltCooldown: 0,
      flareCooldown: 0,
      flareTimer: 0,
      sacrificeCooldown: 0,
      frenzyTimer: 0,
      onCurveBonus: false,
      mathX: 0,
      mathY: 0,
      curveY: 0,
      derivFPrime: 0.9,
      derivFSecond: 0,
      coatNodes: [
        { x: W / 2, y: H / 2 },
        { x: W / 2 - 12, y: H / 2 + 6 },
        { x: W / 2 - 24, y: H / 2 + 12 }
      ]
    },

    // Active player-constructed Tangent Line Bridges (T): y = f'(x0)(x - x0) + f(x0)
    tangentBridges: [
      { x0: 0, y0: 0, slope: 1.09, span: 2.8, timer: 999, permanent: true }
    ],

    pillars,
    asymptoteRifts,
    seals,
    captives,
    enemies: [],
    projectiles: [],
    enemyProjectiles: [],
    pickups: [
      { id: 1, kind: 'blood', x: 760, y: 640, radius: 13 },
      { id: 2, kind: 'battery', x: 1160, y: 640, radius: 13 },
      { id: 3, kind: 'blood', x: 960, y: 340, radius: 13 },
      { id: 4, kind: 'battery', x: 960, y: 940, radius: 13 }
    ],
    decals,
    particles: [],
    floatingTexts: [],

    spawnTimer: 1.4,
    nextEnemyId: 1,
    bossSpawned: false,
    bossDefeated: false,

    stats: {
      brokenSeals: 0,
      kills: 0,
      combo: 0,
      comboTimer: 0,
      sacrifices: 0,
      questionsAnswered: 0,
      questionsCorrect: 0,
      score: 0
    },

    recentQuestionIds: [],
    activeRitual: null
  };
};

window.addBloodDecal = function(state, x, y, r = 24, kind = 'blood') {
  const decals = state.decals;
  decals.push({
    kind,
    x,
    y,
    r,
    rot: Math.random() * Math.PI * 2,
    alpha: kind === 'bones' ? 0.72 : 0.45 + Math.random() * 0.35
  });
  if (decals.length > window.WORLD_CONFIG.MAX_DECALS) {
    decals.shift();
  }
};

window.spawnGoreParticles = function(state, x, y, count = 12, color = '#dc2626', speedMax = 240) {
  const parts = state.particles;
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const spd = 45 + Math.random() * speedMax;
    parts.push({
      x,
      y,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd,
      size: 2.2 + Math.random() * 4.5,
      life: 0.35 + Math.random() * 0.45,
      maxLife: 0.8,
      color
    });
  }
  while (parts.length > window.WORLD_CONFIG.MAX_PARTICLES) {
    parts.shift();
  }
};

window.addFloatingText = function(state, x, y, text, color = '#fca5a5', life = 1.15) {
  state.floatingTexts.push({ x, y, text, color, life, maxLife: life });
  if (state.floatingTexts.length > 26) state.floatingTexts.shift();
};

window.setWardBanner = function(state, text, dur = 3.2) {
  state.bannerText = text;
  state.bannerTimer = dur;
};

function resolveCircleRect(ent, rect) {
  const closestX = Math.max(rect.x, Math.min(ent.x, rect.x + rect.w));
  const closestY = Math.max(rect.y, Math.min(ent.y, rect.y + rect.h));
  const dx = ent.x - closestX;
  const dy = ent.y - closestY;
  const distSq = dx * dx + dy * dy;
  const rad = ent.radius;
  if (distSq >= rad * rad) return;

  if (distSq > 0.0001) {
    const dist = Math.sqrt(distSq);
    const push = rad - dist;
    ent.x += (dx / dist) * push;
    ent.y += (dy / dist) * push;
  } else {
    const left = Math.abs(ent.x - rect.x);
    const right = Math.abs(rect.x + rect.w - ent.x);
    const top = Math.abs(ent.y - rect.y);
    const bottom = Math.abs(rect.y + rect.h - ent.y);
    const m = Math.min(left, right, top, bottom);
    if (m === left) ent.x = rect.x - rad;
    else if (m === right) ent.x = rect.x + rect.w + rad;
    else if (m === top) ent.y = rect.y - rad;
    else ent.y = rect.y + rect.h + rad;
  }
}

function clampToAsylum(ent) {
  const pad = ent.radius + 26;
  ent.x = Math.max(pad, Math.min(window.WORLD_CONFIG.WIDTH - pad, ent.x));
  ent.y = Math.max(pad, Math.min(window.WORLD_CONFIG.HEIGHT - pad, ent.y));
}

window.spawnAsylumEnemy = function(state, forceType = null) {
  const p = state.player;
  const broken = state.stats.brokenSeals;

  let sx = p.x;
  let sy = p.y;
  for (let tries = 0; tries < 8; tries++) {
    const ang = Math.random() * Math.PI * 2;
    const dist = 460 + Math.random() * 240;
    const tx = Math.max(80, Math.min(window.WORLD_CONFIG.WIDTH - 80, p.x + Math.cos(ang) * dist));
    const ty = Math.max(80, Math.min(window.WORLD_CONFIG.HEIGHT - 80, p.y + Math.sin(ang) * dist));
    if (Math.hypot(tx - p.x, ty - p.y) > 360) {
      sx = tx;
      sy = ty;
      break;
    }
  }

  let kind = forceType;
  if (!kind) {
    const roll = Math.random();
    if (roll < 0.52) kind = 'stalker';      // Cusp Arachnid (عنكبوت النقطة المزواة)
    else if (roll < 0.80) kind = 'wisp';    // Asymptote Seraph (طيف المقارب المائل)
    else kind = 'butcher';                  // Inflection Executioner (جزّار نقطة الانعطاف)
  }

  const scale = 1 + broken * 0.16;
  let radius = 20;
  let hp = Math.round(52 * scale);
  let speed = 166 + broken * 8;
  let dmg = 14 + broken * 2;
  let name = 'عنكبوت النقطة المزواة';
  let mathTag = 'f\'d ≠ f\'g';

  if (kind === 'butcher') {
    radius = 28;
    hp = Math.round(115 * scale);
    speed = 112 + broken * 5;
    dmg = 22 + broken * 3;
    name = 'جزّار الانعطاف';
    mathTag = 'f\'\'(x₀)=0';
  } else if (kind === 'wisp') {
    radius = 18;
    hp = Math.round(38 * scale);
    speed = 192 + broken * 9;
    dmg = 11 + broken * 2;
    name = 'طيف المقارب';
    mathTag = 'y = ax+b';
  } else if (kind === 'boss') {
    radius = 46;
    hp = 460;
    speed = 148;
    dmg = 26;
    name = 'عملاق الفرع الشلجمي اللانهائي';
    mathTag = 'lim f(x)/x = ∞';
  }

  // Multi-segment trail for Boss & articulated animation phase
  const segments = [];
  if (kind === 'boss') {
    for (let s = 0; s < 6; s++) {
      segments.push({ x: sx - s * 28, y: sy });
    }
  }

  state.enemies.push({
    id: state.nextEnemyId++,
    kind,
    name,
    mathTag,
    x: sx,
    y: sy,
    radius,
    hp,
    maxHp: hp,
    speed,
    dmg,
    hitFlash: 0,
    staggered: false,
    shootTimer: kind === 'boss' ? 1.8 : 99,
    twitchPhase: Math.random() * Math.PI * 2,
    segments
  });
};

window.spawnBossFiend = function(state) {
  if (state.bossSpawned) return;
  state.bossSpawned = true;
  window.spawnAsylumEnemy(state, 'boss');
  state.screenShake = Math.max(state.screenShake, 18);
  state.jumpscareTimer = 0.45;
  window.HorrorAudio?.playJumpscare?.();
  window.setWardBanner(state, '⚠ تحررت عقد المعلم (O,i,j) — عملاق الفرع الشلجمي يطاردك!', 5.0);
  window.addFloatingText(state, state.player.x, state.player.y - 46, 'BOSS: عملاق الفرع اللانهائي!', '#ef4444', 2.4);
};

window.damageEnemy = function(state, enemy, dmg, knockAngle, forceExecution = false) {
  enemy.hp -= dmg;
  enemy.hitFlash = 0.16;
  const kForce = enemy.kind === 'boss' ? 14 : 34;
  enemy.x += Math.cos(knockAngle) * kForce;
  enemy.y += Math.sin(knockAngle) * kForce;
  window.spawnGoreParticles(state, enemy.x, enemy.y, 10, '#dc2626', 210);
  window.addBloodDecal(state, enemy.x, enemy.y, 14 + Math.random() * 14, 'blood');

  if (!enemy.staggered && enemy.hp > 0 && enemy.hp <= enemy.maxHp * 0.42 && (enemy.kind === 'butcher' || enemy.kind === 'boss')) {
    enemy.staggered = true;
    window.addFloatingText(state, enemy.x, enemy.y - enemy.radius - 12, 'مشلول! [✕/▢] للتشريح', '#fbbf24', 1.6);
  }

  if (enemy.hp <= 0 || forceExecution) {
    window.killEnemy(state, enemy, forceExecution);
    return true;
  }
  return false;
};

window.killEnemy = function(state, enemy, wasExecuted = false) {
  const idx = state.enemies.indexOf(enemy);
  if (idx !== -1) state.enemies.splice(idx, 1);

  state.stats.kills++;
  state.stats.combo++;
  state.stats.comboTimer = 4.2;
  const mult = Math.min(5, 1 + Math.floor(state.stats.combo / 3));
  const basePts = enemy.kind === 'boss' ? 1200 : enemy.kind === 'butcher' ? 180 : 90;
  state.stats.score += basePts * mult * (wasExecuted ? 2 : 1);

  window.addBloodDecal(state, enemy.x, enemy.y, enemy.kind === 'boss' ? 58 : 28, 'blood');
  window.addBloodDecal(state, enemy.x + 8, enemy.y - 6, enemy.radius * 0.8, 'bones');
  window.spawnGoreParticles(state, enemy.x, enemy.y, wasExecuted ? 26 : 16, '#ef4444', 300);
  window.spawnGoreParticles(state, enemy.x, enemy.y, 6, '#e5e7eb', 160);

  if (wasExecuted) {
    state.screenShake = Math.max(state.screenShake, 12);
    window.HorrorAudio?.playExecuteGore?.();
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 15);
    state.player.sanity = Math.min(state.player.maxSanity, state.player.sanity + 20);
    window.addFloatingText(state, enemy.x, enemy.y - 26, 'تشريح مشتق +15 دم!', '#34d399', 1.4);
  } else {
    window.addFloatingText(state, enemy.x, enemy.y - 18, `تمزيق +${basePts}`, '#fca5a5', 0.9);
  }

  if (enemy.kind !== 'boss' && Math.random() < 0.36) {
    state.pickups.push({
      id: Date.now() + Math.random(),
      kind: Math.random() < 0.58 ? 'blood' : 'battery',
      x: enemy.x,
      y: enemy.y,
      radius: 13
    });
  }

  if (enemy.kind === 'boss') {
    state.bossDefeated = true;
    window.HorrorAudio?.playSealBreak?.();
    window.triggerVictoryOrDeath(state, true);
  }
};

window.performSlashAttack = function(state) {
  const p = state.player;
  if (p.slashCooldown > 0) return false;

  const execTarget = state.enemies.find(e => e.staggered && Math.hypot(e.x - p.x, e.y - p.y) < 105);
  if (execTarget) {
    window.openRitualChallenge(state, { kind: 'execute', enemy: execTarget });
    return true;
  }

  p.slashCooldown = p.frenzyTimer > 0 ? 0.22 : 0.34;
  p.slashAnim = 0.24;
  window.HorrorAudio?.playSlash?.();

  const range = 108;
  const dmg = p.frenzyTimer > 0 ? 78 : 44;
  let hitAny = false;

  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const e = state.enemies[i];
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= range + e.radius) {
      let diff = Math.atan2(dy, dx) - p.aimAngle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      if (Math.abs(diff) <= 1.3 || dist < 44) {
        hitAny = true;
        window.damageEnemy(state, e, dmg, Math.atan2(dy, dx), false);
      }
    }
  }

  if (hitAny) {
    state.screenShake = Math.max(state.screenShake, 5);
    window.triggerGamepadHaptic?.(55, 0.4, 0.55);
  }
  return true;
};

window.performBloodDash = function(state, moveX, moveY) {
  const p = state.player;
  if (p.dashCooldown > 0) return false;
  let dx = moveX;
  let dy = moveY;
  if (Math.hypot(dx, dy) < 0.2) {
    dx = Math.cos(p.aimAngle);
    dy = Math.sin(p.aimAngle);
  } else {
    const mag = Math.hypot(dx, dy);
    dx /= mag;
    dy /= mag;
  }
  p.dashTimer = 0.19;
  p.dashCooldown = 1.0;
  p.invulnTimer = Math.max(p.invulnTimer, 0.34);
  p.dashVx = dx * 770;
  p.dashVy = dy * 770;
  window.HorrorAudio?.playDash?.();
  window.addBloodDecal(state, p.x, p.y, 16, 'blood');
  window.spawnGoreParticles(state, p.x, p.y, 10, '#991b1b', 140);
  return true;
};

window.performBloodBolt = function(state) {
  const p = state.player;
  if (p.boltCooldown > 0) return false;
  p.boltCooldown = p.frenzyTimer > 0 ? 0.16 : 0.25;
  const spd = 700;
  state.projectiles.push({
    x: p.x + Math.cos(p.aimAngle) * 22,
    y: p.y + Math.sin(p.aimAngle) * 22,
    vx: Math.cos(p.aimAngle) * spd,
    vy: Math.sin(p.aimAngle) * spd,
    dmg: p.frenzyTimer > 0 ? 54 : 32,
    life: 1.15
  });
  window.HorrorAudio?.playBolt?.();
  return true;
};

window.performFlare = function(state) {
  const p = state.player;
  if (p.flareCooldown > 0) return false;
  p.flareCooldown = 5.2;
  p.flareTimer = 4.0;
  p.sanity = Math.min(p.maxSanity, p.sanity + 35);
  window.HorrorAudio?.playFlare?.();
  window.spawnGoreParticles(state, p.x, p.y, 20, '#34d399', 260);
  window.addFloatingText(state, p.x, p.y - 34, 'انعكاس المنصف Δ: y=x ➔ كشف (Cf⁻¹) وتبطيء الوحوش!', '#34d399', 1.7);
  return true;
};

/**
 * Coordinate Tangent Bridge & Affine Linearization Overdrive [L2 / F]:
 * Constructs a physical walkable Tangent Line Bridge (T): y = f'(x0)(x - x0) + f(x0) at player's x0
 * and unleashes a high-velocity Derivative Wave d/dx across nearby monsters!
 */
window.performForbiddenSacrificeWorld = function(state) {
  const p = state.player;
  if (p.sacrificeCooldown > 0) return false;

  const forge = state.captives.find(c => c.alive && Math.hypot(c.x - p.x, c.y - p.y) <= 145);
  if (!forge && p.hp <= 22) {
    window.addFloatingText(state, p.x, p.y - 26, 'تحتاج طاقة حيوية لبناء جسر المماس!', '#fbbf24', 1.1);
    return false;
  }

  p.sacrificeCooldown = 2.6;
  state.stats.sacrifices++;
  window.HorrorAudio?.playSacrifice?.();
  window.triggerGamepadHaptic?.(150, 0.75, 0.9);
  state.screenShake = Math.max(state.screenShake, 14);

  // Build physical Tangent Bridge (T): y = f'(x0)(x - x0) + f(x0) in (O, i, j)
  const x0 = p.mathX;
  const y0 = window.evalCurveF(x0);
  const slope = window.evalCurveFPrime(x0);
  state.tangentBridges.push({
    x0,
    y0,
    slope,
    span: 2.6,
    timer: 18.0,
    permanent: false
  });
  if (state.tangentBridges.length > 5) {
    state.tangentBridges.splice(1, 1);
  }

  if (forge) {
    forge.alive = false;
    p.hp = Math.min(p.maxHp, p.hp + 35);
    p.sanity = Math.min(p.maxSanity, p.sanity + 50);
    p.frenzyTimer = 7.0;
    window.spawnGoreParticles(state, forge.x, forge.y, 28, '#38bdf8', 320);
    window.addFloatingText(state, forge.x, forge.y - 28, `جسر المماس (T) عند x₀=${x0.toFixed(1)} +35 دم!`, '#38bdf8', 2.0);
  } else {
    p.hp -= 15;
    p.sanity = Math.min(p.maxSanity, p.sanity + 35);
    p.frenzyTimer = 5.5;
    window.spawnGoreParticles(state, p.x, p.y, 26, '#ef4444', 310);
    window.addFloatingText(state, p.x, p.y - 28, `تقريب تآلفي y = ${slope.toFixed(1)}(x - ${x0.toFixed(1)}) + ${y0.toFixed(1)}!`, '#f87171', 1.9);
  }

  const blastRadius = 340;
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const e = state.enemies[i];
    const dist = Math.hypot(e.x - p.x, e.y - p.y);
    if (dist <= blastRadius) {
      const ang = Math.atan2(e.y - p.y, e.x - p.x);
      window.damageEnemy(state, e, 115, ang, e.kind !== 'boss');
    }
  }
  return true;
};

window.findNearestInteractable = function(state) {
  const p = state.player;
  for (const e of state.enemies) {
    if (e.staggered && Math.hypot(e.x - p.x, e.y - p.y) <= 115) {
      return { kind: 'execute', enemy: e };
    }
  }
  for (const s of state.seals) {
    if (!s.broken && Math.hypot(s.x - p.x, s.y - p.y) <= 115) {
      return { kind: 'seal', seal: s };
    }
  }
  return null;
};

window.updateAsylumWorld = function(state, rawDt, moveVec, aimVec) {
  if (state.mode !== 'play' && state.mode !== 'ritual') return;

  state.worldTimeScale = state.mode === 'ritual' ? 0.035 : 1.0;
  const dt = rawDt * state.worldTimeScale;
  state.time += rawDt;

  const p = state.player;

  if (state.bannerTimer > 0) state.bannerTimer = Math.max(0, state.bannerTimer - rawDt);
  if (state.damageFlash > 0) state.damageFlash = Math.max(0, state.damageFlash - rawDt * 2.4);
  if (state.jumpscareTimer > 0) state.jumpscareTimer = Math.max(0, state.jumpscareTimer - rawDt);
  if (state.screenShake > 0) state.screenShake = Math.max(0, state.screenShake - rawDt * 38);

  if (state.mode === 'play') {
    p.invulnTimer = Math.max(0, p.invulnTimer - dt);
    p.dashCooldown = Math.max(0, p.dashCooldown - dt);
    p.slashCooldown = Math.max(0, p.slashCooldown - dt);
    p.slashAnim = Math.max(0, p.slashAnim - dt);
    p.boltCooldown = Math.max(0, p.boltCooldown - dt);
    p.flareCooldown = Math.max(0, p.flareCooldown - dt);
    p.flareTimer = Math.max(0, p.flareTimer - dt);
    p.sacrificeCooldown = Math.max(0, p.sacrificeCooldown - dt);
    p.frenzyTimer = Math.max(0, p.frenzyTimer - dt);

    if (state.stats.comboTimer > 0) {
      state.stats.comboTimer -= dt;
      if (state.stats.comboTimer <= 0) state.stats.combo = 0;
    }

    p.sanity = Math.max(12, Math.min(p.maxSanity, p.sanity - dt * 0.95));

    if (aimVec && Math.hypot(aimVec.x, aimVec.y) > 0.15) {
      p.aimAngle = Math.atan2(aimVec.y, aimVec.x);
    } else if (Math.hypot(moveVec.x, moveVec.y) > 0.22) {
      p.aimAngle = Math.atan2(moveVec.y, moveVec.x);
    }

    // Compute live Orthonormal Coordinates (X, Y) and Curve calculus state
    const mCoord = window.worldToMath(p.x, p.y);
    p.mathX = mCoord.X;
    p.mathY = mCoord.Y;
    p.curveY = window.evalCurveF(p.mathX);
    p.derivFPrime = window.evalCurveFPrime(p.mathX);
    p.derivFSecond = window.evalCurveFSecond(p.mathX);

    // Check if Survivor is walking directly on (Cf) or on a constructed Tangent Bridge (T)
    let onBridge = false;
    for (const tb of state.tangentBridges) {
      if (Math.abs(p.mathX - tb.x0) <= tb.span) {
        const ty = tb.y0 + tb.slope * (p.mathX - tb.x0);
        if (Math.abs(p.mathY - ty) < 0.75) {
          onBridge = true;
          break;
        }
      }
    }
    p.onCurveBonus = Math.abs(p.mathY - p.curveY) < 0.72 || onBridge;
    if (p.onCurveBonus) {
      p.sanity = Math.min(p.maxSanity, p.sanity + dt * 2.2);
    }

    // Player movement with Curve Traction bonus when walking along (Cf) or (T)
    if (p.dashTimer > 0) {
      p.dashTimer -= dt;
      p.x += p.dashVx * dt;
      p.y += p.dashVy * dt;
    } else {
      const curveBoost = p.onCurveBonus ? 1.18 : 1.0;
      const spd = p.speed * (p.frenzyTimer > 0 ? 1.25 : 1.0) * curveBoost;
      p.x += moveVec.x * spd * dt;
      p.y += moveVec.y * spd * dt;
      if (Math.hypot(moveVec.x, moveVec.y) > 0.1) {
        p.walkCycle += dt * 11 * curveBoost;
      }
    }

    for (const pil of state.pillars) resolveCircleRect(p, pil);
    clampToAsylum(p);

    // Update Verlet cloth coat nodes trailing behind Survivor
    if (p.coatNodes && p.coatNodes.length) {
      p.coatNodes[0].x = p.x - Math.cos(p.aimAngle) * 8;
      p.coatNodes[0].y = p.y - Math.sin(p.aimAngle) * 8;
      for (let c = 1; c < p.coatNodes.length; c++) {
        const prev = p.coatNodes[c - 1];
        const cur = p.coatNodes[c];
        const dx = cur.x - prev.x;
        const dy = cur.y - prev.y;
        const d = Math.hypot(dx, dy) || 1;
        const targetDist = 11;
        cur.x = prev.x + (dx / d) * targetDist - Math.cos(p.aimAngle) * 1.4;
        cur.y = prev.y + (dy / d) * targetDist + Math.sin(state.time * 9 + c) * 0.9;
      }
    }

    // Pickup collection
    for (let i = state.pickups.length - 1; i >= 0; i--) {
      const pk = state.pickups[i];
      if (Math.hypot(pk.x - p.x, pk.y - p.y) <= p.radius + pk.radius + 10) {
        if (pk.kind === 'blood') {
          p.hp = Math.min(p.maxHp, p.hp + 22);
          window.addFloatingText(state, p.x, p.y - 24, '+22 دم', '#f87171', 1.0);
        } else {
          p.sanity = Math.min(p.maxSanity, p.sanity + 32);
          window.addFloatingText(state, p.x, p.y - 24, '+32% طاقة المعلم', '#34d399', 1.0);
        }
        window.HorrorAudio?.playUiTick?.();
        state.pickups.splice(i, 1);
      }
    }

    // Spawner (cap max simultaneous enemies at 10 for locked 60FPS)
    state.spawnTimer -= dt;
    const cap = state.bossSpawned ? 8 : 6 + state.stats.brokenSeals;
    if (state.spawnTimer <= 0 && state.enemies.length < cap) {
      window.spawnAsylumEnemy(state);
      state.spawnTimer = Math.max(1.35, 3.0 - state.stats.brokenSeals * 0.35);
    }
  }

  // Update player projectiles
  for (let i = state.projectiles.length - 1; i >= 0; i--) {
    const b = state.projectiles[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    let removed = b.life <= 0 || b.x < 24 || b.x > window.WORLD_CONFIG.WIDTH - 24 || b.y < 24 || b.y > window.WORLD_CONFIG.HEIGHT - 24;

    if (!removed) {
      for (const pil of state.pillars) {
        if (b.x >= pil.x && b.x <= pil.x + pil.w && b.y >= pil.y && b.y <= pil.y + pil.h) {
          removed = true;
          break;
        }
      }
    }
    if (!removed) {
      for (let j = state.enemies.length - 1; j >= 0; j--) {
        const e = state.enemies[j];
        if (Math.hypot(e.x - b.x, e.y - b.y) <= e.radius + 7) {
          window.damageEnemy(state, e, b.dmg, Math.atan2(b.vy, b.vx), false);
          removed = true;
          break;
        }
      }
    }
    if (removed) state.projectiles.splice(i, 1);
  }

  // Update boss crimson orbs
  for (let i = state.enemyProjectiles.length - 1; i >= 0; i--) {
    const ep = state.enemyProjectiles[i];
    ep.x += ep.vx * dt;
    ep.y += ep.vy * dt;
    ep.life -= dt;
    let rm = ep.life <= 0;
    if (!rm && Math.hypot(ep.x - p.x, ep.y - p.y) <= p.radius + 8 && p.invulnTimer <= 0 && state.mode === 'play') {
      p.hp = Math.max(0, p.hp - 14);
      p.invulnTimer = 0.65;
      state.damageFlash = 1.0;
      state.screenShake = Math.max(state.screenShake, 10);
      window.HorrorAudio?.playDamage?.();
      rm = true;
      if (p.hp <= 0) window.triggerVictoryOrDeath(state, false);
    }
    if (rm) state.enemyProjectiles.splice(i, 1);
  }

  // Update enemies & Boss multi-segment centipede kinematics
  let nearestEnemyDist = 9999;
  const enemySlowFactor = p.flareTimer > 0 ? 0.42 : 1.0;

  for (const e of state.enemies) {
    e.hitFlash = Math.max(0, e.hitFlash - dt);
    e.twitchPhase += rawDt * 8.0;
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const dist = Math.hypot(dx, dy);
    nearestEnemyDist = Math.min(nearestEnemyDist, dist);

    if (state.mode === 'play' && dist > 1) {
      const spd = (e.staggered ? e.speed * 0.25 : e.speed) * enemySlowFactor;
      e.x += (dx / dist) * spd * dt;
      e.y += (dy / dist) * spd * dt;
      for (const pil of state.pillars) resolveCircleRect(e, pil);
      clampToAsylum(e);

      // Update boss centipede body segments
      if (e.segments && e.segments.length) {
        let leadX = e.x;
        let leadY = e.y;
        for (const seg of e.segments) {
          const sdx = seg.x - leadX;
          const sdy = seg.y - leadY;
          const sd = Math.hypot(sdx, sdy) || 1;
          const gap = 26;
          seg.x = leadX + (sdx / sd) * gap;
          seg.y = leadY + (sdy / sd) * gap;
          leadX = seg.x;
          leadY = seg.y;
        }
      }

      if (e.kind === 'boss') {
        e.shootTimer -= dt;
        if (e.shootTimer <= 0) {
          e.shootTimer = e.staggered ? 2.6 : 1.7;
          const baseAng = Math.atan2(dy, dx);
          for (const off of [-0.22, 0, 0.22]) {
            state.enemyProjectiles.push({
              x: e.x,
              y: e.y,
              vx: Math.cos(baseAng + off) * 320,
              vy: Math.sin(baseAng + off) * 320,
              life: 2.2
            });
          }
        }
      }

      if (!e.staggered && dist <= p.radius + e.radius + 3 && p.invulnTimer <= 0) {
        p.hp = Math.max(0, p.hp - e.dmg);
        p.sanity = Math.max(6, p.sanity - 8);
        p.invulnTimer = 0.72;
        state.damageFlash = 1.0;
        state.screenShake = Math.max(state.screenShake, 12);
        window.HorrorAudio?.playDamage?.();
        window.triggerGamepadHaptic?.(120, 0.7, 0.8);
        window.addBloodDecal(state, p.x, p.y, 22, 'blood');
        window.spawnGoreParticles(state, p.x, p.y, 12, '#ef4444', 200);
        if (p.hp <= 0) {
          window.triggerVictoryOrDeath(state, false);
          return;
        }
      }
    }
  }

  const threatFactor = Math.max(nearestEnemyDist < 340 ? (340 - nearestEnemyDist) / 340 : 0, p.hp < 40 ? (40 - p.hp) / 40 : 0);
  if (threatFactor > 0.15) {
    state.heartbeatTimer -= rawDt;
    if (state.heartbeatTimer <= 0) {
      window.HorrorAudio?.playHeartbeat?.(threatFactor);
      state.heartbeatTimer = Math.max(0.45, 1.15 - threatFactor * 0.65);
    }
  }

  for (const s of state.seals) s.pulse += rawDt * 2.4;

  for (let i = state.particles.length - 1; i >= 0; i--) {
    const pt = state.particles[i];
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.vx *= 0.92;
    pt.vy *= 0.92;
    pt.life -= rawDt;
    if (pt.life <= 0) state.particles.splice(i, 1);
  }

  for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
    const ft = state.floatingTexts[i];
    ft.y -= 26 * rawDt;
    ft.life -= rawDt;
    if (ft.life <= 0) state.floatingTexts.splice(i, 1);
  }
};
