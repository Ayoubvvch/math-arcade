/**
 * Asymptote Asylum (مصحّة المقاربات: كابوس المعلم المتعامد (O, i, j))
 * Main 60FPS Game Loop, Live KaTeX Coordinate Scanner & Calibration Orchestrator
 */

(function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });

  let state = window.createInitialAsylumState('all');
  window.asymptoteGame = state;

  let viewW = window.innerWidth;
  let viewH = window.innerHeight;
  let lastTs = performance.now();
  let hudCache = {};

  function resizeCanvas() {
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(viewW * dpr);
    canvas.height = Math.round(viewH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Filter Labels
  const FILTER_MODES = [
    { key: 'all', hud: 'المحاور: 23–38', pause: 'محور الأسئلة: الكل (23–38)' },
    { key: 'sectionA', hud: 'القسم أ: 23–29', pause: 'محور الأسئلة: الاشتقاق فقط (23–29)' },
    { key: 'sectionB', hud: 'القسم ب: 30–38', pause: 'محور الأسئلة: الدوال والمنحنيات (30–38)' }
  ];

  function updateFilterUI() {
    const cur = FILTER_MODES.find(f => f.key === state.topicFilter) || FILTER_MODES[0];
    const chip = document.getElementById('filterChipLabel');
    const pauseBtn = document.getElementById('btnCycleFilterPause');
    if (chip) chip.textContent = cur.hud;
    if (pauseBtn) pauseBtn.textContent = cur.pause;

    document.querySelectorAll('#introFilterGrid .filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === state.topicFilter);
    });
  }

  window.cycleTopicFilter = function(dir = 1) {
    const idx = FILTER_MODES.findIndex(f => f.key === state.topicFilter);
    const nextIdx = (idx + dir + FILTER_MODES.length) % FILTER_MODES.length;
    state.topicFilter = FILTER_MODES[nextIdx].key;
    updateFilterUI();
    window.HorrorAudio?.playUiTick?.();
  };

  window.startAsylumFromIntro = function() {
    window.HorrorAudio?.init?.();
    window.HorrorAudio?.playUiTick?.();
    document.getElementById('introModal')?.classList.add('hidden');
    state.mode = 'play';
    window.lockAsylumInputBriefly(220);
    window.setWardBanner(state, 'اسلك المنحنى (Cf) في المعلم (O,i,j) وحرّر العُقد الأربعة [▢ / L]', 4.5);
  };

  window.triggerNearestInteract = function(s) {
    const target = window.findNearestInteractable(s);
    if (target) {
      window.openRitualChallenge(s, target);
      return true;
    }
    window.addFloatingText(s, s.player.x, s.player.y - 26, 'اقترب من عقدة المعلم أو وحش مشلول!', '#fbbf24', 1.1);
    return false;
  };

  /**
   * Renders mixed Arabic + LaTeX ($...$) strings via KaTeX.
   */
  function setBidiSafeMath(el, text) {
    if (!el) return;
    if (window.MathKaTeX && typeof window.MathKaTeX.renderMixed === 'function') {
      window.MathKaTeX.renderMixed(el, text);
      return;
    }
    el.textContent = String(text || '');
  }
  window.setBidiSafeMath = setBidiSafeMath;

  window.openRitualChallenge = function(s, targetInfo) {
    if (s.mode !== 'play') return;
    s.mode = 'ritual';
    window.lockAsylumInputBriefly(220);

    const wardTopics = targetInfo.kind === 'seal' ? targetInfo.seal.topics : null;
    const q = window.pickRitualChallenge(s.topicFilter, wardTopics, s.recentQuestionIds);
    s.recentQuestionIds.push(q.id);
    if (s.recentQuestionIds.length > 14) s.recentQuestionIds.shift();

    s.activeRitual = {
      targetInfo,
      question: q,
      hintOpen: false,
      lockedWrong: {}
    };

    const modal = document.getElementById('ritualModal');
    const srcTag = document.getElementById('ritualSourceTag');
    const topTag = document.getElementById('ritualTopicTag');
    const promptEl = document.getElementById('ritualPrompt');
    const graphWrap = document.getElementById('ritualGraphWrap');
    const graphCanvas = document.getElementById('ritualGraphCanvas');
    const hintBox = document.getElementById('ritualHintBox');

    if (targetInfo.kind === 'seal') {
      setBidiSafeMath(srcTag, `معايرة العقدة — ${targetInfo.seal.wardName}`);
    } else {
      setBidiSafeMath(srcTag, `تشريح مشتق — ${targetInfo.enemy.name}`);
    }
    setBidiSafeMath(topTag, `البند ${q.topic}: ${window.CURRICULUM_TOPICS[q.topic] || ''}`);
    setBidiSafeMath(promptEl, q.prompt);

    if (q.graphSpec) {
      graphWrap.classList.remove('hidden');
      window.drawRitualGraph(graphCanvas, q.graphSpec);
    } else {
      graphWrap.classList.add('hidden');
    }

    setBidiSafeMath(hintBox, q.hint);
    hintBox.classList.add('hidden');

    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`ritualOpt${i}`);
      btn.classList.remove('opt-correct', 'opt-wrong');
      btn.disabled = false;
      const optSpan = btn.querySelector('.opt-text');
      setBidiSafeMath(optSpan, q.options[i] || '');
    }

    // Check Tangent Linearization Overdrive [L2 / F] availability
    const p = s.player;
    const nearForge = s.captives.find(c => c.alive && Math.hypot(c.x - p.x, c.y - p.y) <= 260);
    const sacBtn = document.getElementById('btnForbiddenSacrifice');
    if (nearForge) {
      sacBtn.disabled = false;
      setBidiSafeMath(sacBtn, `⚡ [L2 / F] تقريب تآلفي عند $x_0 = ${nearForge.x0}$ لبناء جسر المماس $y=f'(x_0)(x-x_0)+f(x_0)$ (+15 دم)`);
    } else if (p.hp > 26) {
      sacBtn.disabled = false;
      setBidiSafeMath(sacBtn, `⚡ [L2 / F] تقريب تآلفي فوري: شحن المشتقة $f'(x_0)$ لتجاوز العقدة (-20 دم)`);
    } else {
      sacBtn.disabled = true;
      sacBtn.textContent = `⚡ [L2 / F] الطاقة الحيوية غير كافية للتقريب التآلفي الفوري`;
    }

    modal.classList.remove('hidden');
    window.HorrorAudio?.playUiTick?.();
  };

  window.toggleRitualHint = function() {
    if (!state.activeRitual) return;
    state.activeRitual.hintOpen = !state.activeRitual.hintOpen;
    document.getElementById('ritualHintBox')?.classList.toggle('hidden', !state.activeRitual.hintOpen);
    window.HorrorAudio?.playUiTick?.();
  };

  window.submitRitualOption = function(optIdx) {
    if (state.mode !== 'ritual' || !state.activeRitual) return;
    const r = state.activeRitual;
    const q = r.question;
    const btn = document.getElementById(`ritualOpt${optIdx}`);
    if (!btn || btn.disabled) return;

    state.stats.questionsAnswered++;

    if (optIdx === q.correctIndex) {
      state.stats.questionsCorrect++;
      btn.classList.add('opt-correct');
      resolveRitualSuccess(false);
    } else {
      btn.classList.add('opt-wrong');
      btn.disabled = true;
      state.player.hp = Math.max(0, state.player.hp - 16);
      state.damageFlash = 1.0;
      state.screenShake = Math.max(state.screenShake, 10);
      window.HorrorAudio?.playDamage?.();
      window.triggerGamepadHaptic?.(110, 0.7, 0.85);
      if (state.player.hp <= 0) {
        closeRitualModalCleanly();
        window.triggerVictoryOrDeath(state, false);
      }
    }
  };

  window.triggerForbiddenRitualBypass = function() {
    if (state.mode !== 'ritual' || !state.activeRitual) return;
    const p = state.player;
    const nearForge = state.captives.find(c => c.alive && Math.hypot(c.x - p.x, c.y - p.y) <= 260);
    if (!nearForge && p.hp <= 26) return;

    state.stats.sacrifices++;
    window.HorrorAudio?.playSacrifice?.();
    window.triggerGamepadHaptic?.(160, 0.85, 0.95);

    // Also spawn a Tangent Line Bridge in the coordinate world at player's x0
    const x0 = p.mathX;
    const y0 = window.evalCurveF(x0);
    const slope = window.evalCurveFPrime(x0);
    state.tangentBridges.push({ x0, y0, slope, span: 2.8, timer: 20, permanent: false });

    if (nearForge) {
      nearForge.alive = false;
      p.hp = Math.min(p.maxHp, p.hp + 15);
      window.spawnGoreParticles(state, nearForge.x, nearForge.y, 28, '#38bdf8', 320);
      window.addFloatingText(state, nearForge.x, nearForge.y - 24, 'جسر التقريب التآلفي (T)!', '#38bdf8', 1.8);
    } else {
      p.hp -= 20;
      window.spawnGoreParticles(state, p.x, p.y, 24, '#dc2626', 280);
      window.addFloatingText(state, p.x, p.y - 24, 'شحن المشتقة -20 دم!', '#f87171', 1.6);
    }

    p.frenzyTimer = Math.max(p.frenzyTimer, 6.0);
    resolveRitualSuccess(true);
  };

  function closeRitualModalCleanly() {
    document.getElementById('ritualModal')?.classList.add('hidden');
    state.activeRitual = null;
    if (state.mode === 'ritual') state.mode = 'play';
    window.lockAsylumInputBriefly(220);
  }

  function resolveRitualSuccess(wasSacrifice) {
    const info = state.activeRitual?.targetInfo;
    closeRitualModalCleanly();
    if (!info) return;

    if (info.kind === 'seal') {
      const s = info.seal;
      if (!s.broken) {
        s.broken = true;
        state.stats.brokenSeals++;
        state.stats.score += wasSacrifice ? 350 : 600;
        window.HorrorAudio?.playSealBreak?.();
        window.spawnGoreParticles(state, s.x, s.y, 28, s.color, 260);
        window.addFloatingText(state, s.x, s.y - 36, `تمت معايرة العقدة (${state.stats.brokenSeals}/4)!`, '#fbbf24', 1.9);

        if (!wasSacrifice) {
          state.player.sanity = Math.min(state.player.maxSanity, state.player.sanity + 35);
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + 15);
        }

        if (state.stats.brokenSeals >= 4) {
          window.spawnBossFiend(state);
        } else {
          window.setWardBanner(state, `بقي ${4 - state.stats.brokenSeals} عُقد في المعلم (O,i,j) — واصل المسار`, 3.5);
        }
      }
    } else if (info.kind === 'execute' && info.enemy) {
      window.killEnemy(state, info.enemy, true);
    }
  }

  window.openAsylumPause = function() {
    if (state.mode === 'end' || state.mode === 'intro') return;
    if (state.mode === 'ritual') {
      closeRitualModalCleanly();
    }
    state.mode = 'pause';
    updateFilterUI();
    const pauseModal = document.getElementById('pauseModal');
    pauseModal?.classList.remove('hidden');
    window.AsylumInput.pauseFocusIdx = 0;
    window.applyPauseMenuFocus();
    window.lockAsylumInputBriefly(200);
    window.HorrorAudio?.playUiTick?.();
  };

  window.closeAsylumPause = function() {
    document.getElementById('pauseModal')?.classList.add('hidden');
    if (state.mode === 'pause') state.mode = 'play';
    window.lockAsylumInputBriefly(200);
    window.HorrorAudio?.playUiTick?.();
  };

  window.triggerVictoryOrDeath = function(s, victory) {
    s.mode = 'end';
    document.getElementById('ritualModal')?.classList.add('hidden');
    document.getElementById('pauseModal')?.classList.add('hidden');

    const title = document.getElementById('endTitle');
    const sub = document.getElementById('endSubtitle');

    if (victory) {
      title.innerHTML = 'سيطرة كاملة على <span>المعلم المتعامد (O, i, j)</span>';
      setBidiSafeMath(sub, 'أتقنت كل قواعد الاشتقاق ودراسة الدوال $(23\\text{–}38)$، شيّدت جسور المماس $(T)$، وسحقت عملاق الفرع الشلجمي اللانهائي!');
    } else {
      title.innerHTML = 'انشطار في <span>المعلم المتعامد</span>';
      setBidiSafeMath(sub, 'انهارت طاقتك قبل معايرة العُقد الأربعة. اسلك المنحنى $(C_f)$ واستعمل جسور المماس $(T)$ ومرآة $y=x$ مجدداً!');
    }

    const acc = s.stats.questionsAnswered > 0
      ? Math.round((s.stats.questionsCorrect / s.stats.questionsAnswered) * 100)
      : 100;

    document.getElementById('endSeals').textContent = `${s.stats.brokenSeals} / 4`;
    document.getElementById('endKills').textContent = String(s.stats.kills);
    document.getElementById('endAccuracy').textContent = `${acc}%`;
    document.getElementById('endSacrifices').textContent = String(s.stats.sacrifices);

    document.getElementById('endModal')?.classList.remove('hidden');
    window.AsylumInput.endFocusIdx = 0;
    window.applyEndMenuFocus();
    window.lockAsylumInputBriefly(250);
  };

  window.resetAsylumGame = function() {
    const keepFilter = state.topicFilter;
    document.getElementById('endModal')?.classList.add('hidden');
    document.getElementById('pauseModal')?.classList.add('hidden');
    document.getElementById('ritualModal')?.classList.add('hidden');
    document.getElementById('introModal')?.classList.add('hidden');

    state = window.createInitialAsylumState(keepFilter);
    state.mode = 'play';
    window.asymptoteGame = state;
    hudCache = {};
    window.lockAsylumInputBriefly(220);
    window.setWardBanner(state, 'جولة جديدة في المعلم (O,i,j) — عاير العُقد الأربعة', 3.5);
  };

  // Wire static DOM buttons once
  document.getElementById('btnStartAsylum')?.addEventListener('click', window.startAsylumFromIntro);
  document.getElementById('filterChip')?.addEventListener('click', () => window.cycleTopicFilter(1));
  document.getElementById('btnCycleFilterPause')?.addEventListener('click', () => window.cycleTopicFilter(1));

  document.querySelectorAll('#introFilterGrid .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.topicFilter = btn.dataset.filter || 'all';
      updateFilterUI();
      window.HorrorAudio?.playUiTick?.();
    });
  });

  document.getElementById('btnAudioToggle')?.addEventListener('click', () => {
    window.HorrorAudio?.init?.();
    const muted = window.HorrorAudio?.toggleMute?.();
    document.getElementById('btnAudioToggle').textContent = muted ? '🔇' : '🔊';
    document.getElementById('btnToggleSoundPause').textContent = muted ? 'الصوت: مكتوم' : 'الصوت: مفعل';
  });

  document.getElementById('btnToggleSoundPause')?.addEventListener('click', () => {
    document.getElementById('btnAudioToggle')?.click();
  });

  document.getElementById('btnHelpToggle')?.addEventListener('click', () => {
    state.mode = 'intro';
    document.getElementById('pauseModal')?.classList.add('hidden');
    document.getElementById('introModal')?.classList.remove('hidden');
    updateFilterUI();
  });

  document.getElementById('btnPauseToggle')?.addEventListener('click', () => {
    if (state.mode === 'pause') window.closeAsylumPause();
    else window.openAsylumPause();
  });

  document.getElementById('btnResumeGame')?.addEventListener('click', window.closeAsylumPause);
  document.getElementById('btnRestartPause')?.addEventListener('click', window.resetAsylumGame);
  document.getElementById('btnRetryEnd')?.addEventListener('click', window.resetAsylumGame);

  // Ritual modal button clicks
  for (let i = 0; i < 4; i++) {
    document.getElementById(`ritualOpt${i}`)?.addEventListener('click', () => window.submitRitualOption(i));
  }
  document.getElementById('btnToggleHint')?.addEventListener('click', window.toggleRitualHint);
  document.getElementById('btnForbiddenSacrifice')?.addEventListener('click', window.triggerForbiddenRitualBypass);

  // Bottom Deck touch/mouse click wiring
  document.getElementById('actSlash')?.addEventListener('click', () => state.mode === 'play' && window.performSlashAttack(state));
  document.getElementById('actDash')?.addEventListener('click', () => {
    if (state.mode !== 'play') return;
    const mv = window.getKeyboardMoveVector();
    window.performBloodDash(state, mv.x, mv.y);
  });
  document.getElementById('actRitual')?.addEventListener('click', () => state.mode === 'play' && window.triggerNearestInteract(state));
  document.getElementById('actFlare')?.addEventListener('click', () => state.mode === 'play' && window.performFlare(state));
  document.getElementById('actBolt')?.addEventListener('click', () => state.mode === 'play' && window.performBloodBolt(state));
  document.getElementById('actSacrifice')?.addEventListener('click', () => state.mode === 'play' && window.performForbiddenSacrificeWorld(state));

  // Render static KaTeX elements in Intro & Action Deck
  window.MathKaTeX?.scanPage?.(document.body);
  document.querySelectorAll('.action-chip span:last-child, .stat-card-k').forEach(el => {
    if (el.textContent.includes('$')) {
      window.MathKaTeX?.renderMixed?.(el, el.textContent);
    }
  });

  // Sync HUD lazily (zero unnecessary DOM writes)
  function syncHUD() {
    const p = state.player;
    const hpStr = `${Math.ceil(p.hp)}/${p.maxHp}`;
    if (hudCache.hp !== hpStr) {
      hudCache.hp = hpStr;
      document.getElementById('hpValue').textContent = hpStr;
      document.getElementById('hpFill').style.width = `${Math.max(0, (p.hp / p.maxHp) * 100)}%`;
    }

    const sanStr = `${Math.round(p.sanity)}%`;
    if (hudCache.san !== sanStr) {
      hudCache.san = sanStr;
      document.getElementById('sanityValue').textContent = sanStr;
      document.getElementById('sanityFill').style.width = `${Math.max(0, (p.sanity / p.maxSanity) * 100)}%`;
    }

    const sealStr = state.bossSpawned ? 'BOSS ☠' : `${state.stats.brokenSeals} / 4`;
    if (hudCache.seal !== sealStr) {
      hudCache.seal = sealStr;
      document.getElementById('sealsValue').textContent = sealStr;
    }

    const killStr = String(state.stats.kills);
    if (hudCache.kills !== killStr) {
      hudCache.kills = killStr;
      document.getElementById('killValue').textContent = killStr;
    }

    // Live KaTeX Coordinate Scanner in (O, i, j)
    const qx = Math.round(p.mathX * 5) / 5;
    const qy = Math.round(p.mathY * 5) / 5;
    const coordKey = `${qx.toFixed(1)},${qy.toFixed(1)}`;
    if (hudCache.coordKey !== coordKey) {
      hudCache.coordKey = coordKey;
      const fp = p.derivFPrime.toFixed(2);
      const mono = p.derivFPrime >= 0 ? '\\nearrow' : '\\searrow';
      const conc = p.derivFSecond >= 0 ? '\\cup' : '\\cap';
      const coordEl = document.getElementById('coordLiveKaTeX');
      if (coordEl && window.MathKaTeX) {
        window.MathKaTeX.renderLatex(
          coordEl,
          `M(${qx.toFixed(1)},${qy.toFixed(1)}) \\;\\vert\\; f'(${qx.toFixed(1)})=${fp}\\,${mono}\\,${conc}`,
          false
        );
      }
    }

    const comboShow = state.stats.combo >= 2;
    if (hudCache.comboShow !== comboShow || hudCache.combo !== state.stats.combo) {
      hudCache.comboShow = comboShow;
      hudCache.combo = state.stats.combo;
      const badge = document.getElementById('comboBadge');
      badge?.classList.toggle('hidden', !comboShow);
      if (comboShow) document.getElementById('comboCount').textContent = String(state.stats.combo);
    }

    const frenzySec = Math.ceil(p.frenzyTimer);
    const frenzyShow = frenzySec > 0;
    if (hudCache.frenzyShow !== frenzyShow || hudCache.frenzySec !== frenzySec) {
      hudCache.frenzyShow = frenzyShow;
      hudCache.frenzySec = frenzySec;
      const fb = document.getElementById('frenzyBadge');
      fb?.classList.toggle('hidden', !frenzyShow);
      if (frenzyShow) document.getElementById('frenzyTimer').textContent = `${frenzySec}s`;
    }

    const bannerEl = document.getElementById('wardBanner');
    if (bannerEl) {
      const showB = state.bannerTimer > 0 && state.mode === 'play';
      bannerEl.classList.toggle('visible', showB);
      if (showB && hudCache.banner !== state.bannerText) {
        hudCache.banner = state.bannerText;
        bannerEl.textContent = state.bannerText;
      }
    }

    const nearInteract = state.mode === 'play' ? window.findNearestInteractable(state) : null;
    document.getElementById('actRitual')?.classList.toggle('highlight-ready', !!nearInteract);
    document.getElementById('actDash')?.classList.toggle('cooldown', p.dashCooldown > 0);
    document.getElementById('actFlare')?.classList.toggle('cooldown', p.flareCooldown > 0);
    document.getElementById('actSacrifice')?.classList.toggle('cooldown', p.sacrificeCooldown > 0);
  }

  window.initAsylumControls(() => state);
  updateFilterUI();

  function tick(ts) {
    const rawDt = Math.min(0.05, Math.max(0.001, (ts - lastTs) / 1000));
    lastTs = ts;

    const { moveVec, aimVec } = window.pollAsylumInputs(state);
    window.updateAsylumWorld(state, rawDt, moveVec, aimVec);
    window.renderAsylumFrame(ctx, viewW, viewH, state);
    syncHUD();

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
