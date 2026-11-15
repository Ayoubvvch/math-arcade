/**
 * مغامرة ln و e والتكامل — Main Game Engine & Pedagogical UI Controller
 */

(function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });

  let viewW = window.innerWidth;
  let viewH = window.innerHeight;
  let lastTs = performance.now();

  const STORAGE_KEY = 'math_arcade_ln_e_int_v1';
  let progress = loadProgress();
  let state = null;
  let hudCache = {};
  let toastTimer = 0;

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { completed: {} };
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {}
  }

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

  function cloneWorldState(worldId) {
    const tpl = window.QUEST_WORLDS.find(w => w.id === worldId) || window.QUEST_WORLDS[0];
    const world = JSON.parse(JSON.stringify(tpl));

    return {
      mode: 'start', // 'start' | 'play' | 'lesson' | 'gate' | 'notebook' | 'pause' | 'victory'
      selectedWorldId: world.id,
      returnModeAfterNotebook: 'play',
      world,
      time: 0,
      shake: 0,
      hurtFlash: 0,

      hero: {
        x: world.spawn.x,
        y: world.spawn.y,
        vx: 0,
        vy: 0,
        halfW: 12,
        halfH: 19,
        facing: 1,
        grounded: false,
        coyoteTimer: 0,
        jumpBuffer: 0,
        onLadder: false,
        walkCycle: 0,
        climbCycle: 0,
        hasWings: false,
        flying: false,
        wingFuel: 100,
        hearts: 3,
        maxHearts: 3,
        invulnTimer: 0,
        respawnX: world.spawn.x,
        respawnY: world.spawn.y
      },

      platforms: world.platforms,
      ladders: world.ladders || [],
      springs: (world.springs || []).map(s => ({ ...s, bounceTimer: 0 })),
      wings: (world.wings || []).map(w => ({ ...w, collected: false })),
      updrafts: world.updrafts || [],
      areaPillars: (world.areaPillars || []).map(p => ({ ...p, lit: false })),
      questionBlocks: (world.questionBlocks || []).map(qb => ({ ...qb, opened: false, bumpOffset: 0 })),
      puzzles: (world.puzzles || []).map(pz => ({
        ...pz,
        solved: false,
        options: pz.options.map(o => ({ ...o, solved: false, triedWrong: false, bumpOffset: 0 }))
      })),
      critters: (world.critters || []).map(c => ({ ...c, dir: 1, alive: true, squishTimer: 0 })),
      checkpoints: (world.checkpoints || []).map(cp => ({ ...cp, activated: false })),
      coins: (world.coins || []).map(c => ({ ...c, collected: false })),
      castleDoor: world.castleDoor,
      flagpole: world.flagpole,

      gateSolved: false,
      gateStepIdx: 0,
      gateHintShown: false,
      doorAutoPrompted: false,
      areaBonusGiven: false,

      particles: [],
      floatingTexts: [],
      score: 0
    };
  }

  state = cloneWorldState(1);

  // =========================================================================
  // TOASTS & MIXED MATH HELPER
  // =========================================================================
  function setMixed(el, text) {
    if (!el) return;
    const raw = String(text || '');
    if (raw.includes('**') && window.MathKaTeX?.renderMixed) {
      el.innerHTML = '';
      if (el.dataset) delete el.dataset.katexCacheKey;
      const boldRe = /\*\*((?:\$\$[\s\S]+?\$\$|\$[^$\n]+\$|[^*])+?)\*\*/g;
      let lastIdx = 0;
      let match;
      while ((match = boldRe.exec(raw)) !== null) {
        if (match.index > lastIdx) {
          const span = document.createElement('span');
          window.MathKaTeX.renderMixed(span, raw.slice(lastIdx, match.index));
          el.appendChild(span);
        }
        const strong = document.createElement('strong');
        window.MathKaTeX.renderMixed(strong, match[1]);
        el.appendChild(strong);
        lastIdx = boldRe.lastIndex;
      }
      if (lastIdx < raw.length) {
        const span = document.createElement('span');
        window.MathKaTeX.renderMixed(span, raw.slice(lastIdx));
        el.appendChild(span);
      }
      return;
    }
    if (window.MathKaTeX?.renderMixed) window.MathKaTeX.renderMixed(el, raw);
    else el.textContent = raw;
  }

  function showToast(msg, warn = false, duration = 3.6) {
    const el = document.getElementById('worldToast');
    if (!el) return;
    setMixed(el, msg);
    el.classList.toggle('warn', !!warn);
    el.classList.add('visible');
    toastTimer = duration;
  }

  function spawnParticles(x, y, count = 12, color = '#fbbf24', speed = 180) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 40 + Math.random() * speed;
      state.particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 40,
        size: 2.5 + Math.random() * 3.5,
        life: 0.35 + Math.random() * 0.35,
        maxLife: 0.7,
        color
      });
    }
    while (state.particles.length > 140) state.particles.shift();
  }

  function addFloatText(x, y, text, color = '#34d399', ltr = false) {
    state.floatingTexts.push({ x, y, text, color, ltr, life: 1.25 });
    if (state.floatingTexts.length > 20) state.floatingTexts.shift();
  }

  // =========================================================================
  // START / WORLD SELECT MODAL
  // =========================================================================
  function renderWorldCards() {
    const grid = document.getElementById('worldGrid');
    if (!grid) return;
    grid.innerHTML = '';

    window.QUEST_WORLDS.forEach(w => {
      const rec = progress.completed[w.id];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `world-card ${w.id === state.selectedWorldId ? 'selected' : ''}`;
      const starsStr = rec ? '⭐'.repeat(rec.stars) : 'جديد';
      btn.innerHTML = `
        <div class="world-card-top">
          <span class="world-card-title">${w.title}</span>
          <span class="world-card-badge">${w.badge}</span>
        </div>
        <div class="world-card-desc"></div>
        <div class="world-card-meta">${rec ? `مكتمل (${starsStr})` : 'جاهز للاستكشاف من الصفر'}</div>
      `;
      setMixed(btn.querySelector('.world-card-desc'), w.desc);
      btn.addEventListener('click', () => {
        window.QuestAudio?.playUiTick?.();
        window.selectStartWorld(w.id);
      });
      grid.appendChild(btn);
    });

    const lbl = document.getElementById('btnStartLabel');
    if (lbl) {
      const sel = window.QUEST_WORLDS.find(w => w.id === state.selectedWorldId);
      lbl.textContent = `ابدأ ${sel ? sel.shortTitle : 'المستوى 1'}`;
    }
  }

  window.selectStartWorld = function(id) {
    state.selectedWorldId = id;
    renderWorldCards();
  };

  window.startWorldFromModal = function(worldId) {
    window.QuestAudio?.init?.();
    window.QuestAudio?.playUiTick?.();
    document.activeElement?.blur?.();
    const keepId = worldId || state.selectedWorldId || 1;
    state = cloneWorldState(keepId);
    state.mode = 'play';
    hudCache = {};
    hideAllModals();
    window.lockQuestInput(220);
    showToast(`أهلاً بك في ${state.world.shortTitle}! اضرب مكعبات ? لتتعلم من الصفر ✨`, false, 4.5);
  };

  function openStartModal() {
    hideAllModals();
    state.mode = 'start';
    state.selectedWorldId = state.world.id;
    renderWorldCards();
    document.getElementById('startModal')?.classList.remove('hidden');
    window.lockQuestInput(180);
  }

  // =========================================================================
  // MINI LESSON DISCOVERY MODAL (? BLOCKS)
  // =========================================================================
  function openLessonModal(lessonId) {
    const lesson = window.QUEST_LESSONS[lessonId];
    if (!lesson) return;
    state.mode = 'lesson';
    window.lockQuestInput(240);

    document.getElementById('lessonStepTag').textContent = lesson.stepLabel;
    setMixed(document.getElementById('lessonTitle'), lesson.title);
    setMixed(document.getElementById('lessonBody'), lesson.body);
    setMixed(document.getElementById('lessonFormulaBox'), lesson.formula);
    setMixed(document.getElementById('lessonExampleBox'), lesson.example);
    setMixed(document.getElementById('lessonCanvasCaption'), lesson.caption);

    const cvs = document.getElementById('lessonCanvas');
    window.drawLessonDiagram(cvs, lesson.visualType, 6);

    document.getElementById('lessonModal')?.classList.remove('hidden');
  }

  window.closeLessonModal = function() {
    document.getElementById('lessonModal')?.classList.add('hidden');
    document.activeElement?.blur?.();
    if (state.mode === 'lesson') state.mode = 'play';
    window.QuestAudio?.playUiTick?.();
    window.lockQuestInput(200);
  };

  // =========================================================================
  // STUDY NOTEBOOK MODAL (دفتر الدروس من الصفر)
  // =========================================================================
  let activeNotebookTab = 'ln';

  function renderNotebookTab(tabKey) {
    activeNotebookTab = tabKey;
    document.querySelectorAll('.nb-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabKey);
    });
    const container = document.getElementById('notebookContent');
    if (!container) return;
    const blocks = window.QUEST_NOTEBOOK[tabKey] || [];
    container.innerHTML = '';

    blocks.forEach(item => {
      const card = document.createElement('div');
      card.className = 'nb-block';
      const t = document.createElement('div');
      t.className = 'nb-block-title';
      setMixed(t, item.title);
      const b = document.createElement('div');
      b.className = 'nb-block-body';
      setMixed(b, item.body);
      const f = document.createElement('div');
      f.className = 'nb-block-formula';
      setMixed(f, item.formula);
      card.append(t, b, f);
      container.appendChild(card);
    });
  }

  window.openNotebookModal = function() {
    if (state.mode === 'notebook') return;
    state.returnModeAfterNotebook = (state.mode === 'start' || state.mode === 'pause') ? state.mode : 'play';
    state.mode = 'notebook';
    // Default tab matches current world topic!
    const mapTab = { 1: 'ln', 2: 'exp', 3: 'integral', 4: 'cheatsheet' };
    renderNotebookTab(mapTab[state.world.id] || 'ln');
    document.getElementById('pauseModal')?.classList.add('hidden');
    document.getElementById('notebookModal')?.classList.remove('hidden');
    window.QuestAudio?.playUiTick?.();
    window.lockQuestInput(200);
  };

  window.closeNotebookModal = function() {
    document.getElementById('notebookModal')?.classList.add('hidden');
    document.activeElement?.blur?.();
    state.mode = state.returnModeAfterNotebook || 'play';
    if (state.mode === 'pause') {
      document.getElementById('pauseModal')?.classList.remove('hidden');
    }
    window.QuestAudio?.playUiTick?.();
    window.lockQuestInput(180);
  };

  // =========================================================================
  // INTERACTIVE CASTLE GATE PUZZLE MODAL
  // =========================================================================
  function renderGateStep() {
    const list = window.GATE_PUZZLES[state.world.id] || [];
    const step = list[state.gateStepIdx];
    if (!step) return;

    document.getElementById('gateWorldBadge').textContent = `🏰 لغز ${state.world.shortTitle}`;
    document.getElementById('gateStepBadge').textContent = `التحدي ${state.gateStepIdx + 1} / ${list.length}`;
    setMixed(document.getElementById('gatePrompt'), step.prompt);
    setMixed(document.getElementById('gateHintBox'), step.hint);

    state.gateHintShown = false;
    document.getElementById('gateHintBox')?.classList.add('hidden');
    const fb = document.getElementById('gateFeedbackBox');
    if (fb) fb.classList.add('hidden');

    const sliderRow = document.getElementById('gateSliderRow');
    const slider = document.getElementById('gateSlider');
    const gateCvs = document.getElementById('gateCanvas');

    if (step.hasRiemannSlider && sliderRow && slider) {
      sliderRow.classList.remove('hidden');
      slider.value = '6';
      document.getElementById('gateSliderVal').textContent = 'n = 6';
      window.drawLessonDiagram(gateCvs, step.visualType, 6);
    } else {
      sliderRow?.classList.add('hidden');
      window.drawLessonDiagram(gateCvs, step.visualType, 6);
    }

    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`gateOpt${i}`);
      if (!btn) continue;
      btn.classList.remove('opt-right', 'opt-wrong');
      btn.disabled = false;
      setMixed(btn.querySelector('.opt-label'), step.options[i] || '');
    }
  }

  window.openGateModal = function() {
    if (state.gateSolved) {
      showToast('بوابة القلعة مفتوحة بالفعل! المس راية النهاية 🚩', false, 2.5);
      return;
    }
    state.mode = 'gate';
    state.gateStepIdx = 0;
    renderGateStep();
    document.getElementById('gatePuzzleModal')?.classList.remove('hidden');
    window.QuestAudio?.playUiTick?.();
    window.lockQuestInput(220);
  };

  window.closeGateModal = function() {
    document.getElementById('gatePuzzleModal')?.classList.add('hidden');
    document.activeElement?.blur?.();
    if (state.mode === 'gate') state.mode = 'play';
    window.lockQuestInput(200);
  };

  window.toggleGateHint = function() {
    state.gateHintShown = !state.gateHintShown;
    document.getElementById('gateHintBox')?.classList.toggle('hidden', !state.gateHintShown);
    window.QuestAudio?.playUiTick?.();
  };

  window.submitGateAnswer = function(idx) {
    if (state.mode !== 'gate') return;
    const list = window.GATE_PUZZLES[state.world.id] || [];
    const step = list[state.gateStepIdx];
    const btn = document.getElementById(`gateOpt${idx}`);
    const fb = document.getElementById('gateFeedbackBox');
    if (!step || !btn || btn.disabled) return;

    if (idx === step.correctIndex) {
      btn.classList.add('opt-right');
      for (let i = 0; i < 4; i++) {
        const b = document.getElementById(`gateOpt${i}`);
        if (b) b.disabled = true;
      }
      window.QuestAudio?.playPuzzleSolved?.();
      window.triggerQuestHaptic(80, 0.4, 0.5);
      if (fb) {
        fb.className = 'gate-feedback ok';
        setMixed(fb, `✓ ${step.successMsg}`);
        fb.classList.remove('hidden');
      }

      setTimeout(() => {
        if (state.mode !== 'gate') return;
        if (state.gateStepIdx + 1 < list.length) {
          state.gateStepIdx++;
          renderGateStep();
        } else {
          state.gateSolved = true;
          state.score += 400;
          window.closeGateModal();
          spawnParticles(state.castleDoor.x, state.castleDoor.y - 40, 28, '#34d399', 260);
          showToast('🎉 فُتحت بوابة القلعة! تقدم الآن للمس راية النجاح 🚩!', false, 4.5);
        }
      }, 1100);
    } else {
      btn.classList.add('opt-wrong');
      btn.disabled = true;
      window.QuestAudio?.playWrong?.();
      if (fb) {
        fb.className = 'gate-feedback err';
        setMixed(fb, `💡 محاولة قريبة! ${step.hint}`);
        fb.classList.remove('hidden');
      }
    }
  };

  // =========================================================================
  // PAUSE & VICTORY MODALS
  // =========================================================================
  window.openPauseModal = function() {
    if (state.mode !== 'play') return;
    state.mode = 'pause';
    document.getElementById('pauseModal')?.classList.remove('hidden');
    window.QuestAudio?.playUiTick?.();
    window.lockQuestInput(180);
  };

  window.resumeFromPause = function() {
    document.getElementById('pauseModal')?.classList.add('hidden');
    document.activeElement?.blur?.();
    if (state.mode === 'pause') state.mode = 'play';
    window.QuestAudio?.playUiTick?.();
    window.lockQuestInput(180);
  };

  function finishWorldVictory() {
    if (state.mode === 'victory') return;
    state.mode = 'victory';
    window.QuestAudio?.playVictory?.();
    window.triggerQuestHaptic(140, 0.6, 0.8);
    spawnParticles(state.flagpole.x, state.flagpole.y - 110, 42, '#fbbf24', 300);

    const coinsGot = state.coins.filter(c => c.collected).length;
    const totalCoins = state.coins.length;
    const lessonsGot = state.questionBlocks.filter(q => q.opened).length;
    const totalLessons = state.questionBlocks.length;
    const puzzlesGot = state.puzzles.filter(p => p.solved).length;
    const totalPuzzles = state.puzzles.length;

    let stars = 1;
    if (lessonsGot >= 2 && puzzlesGot === totalPuzzles) stars = 2;
    if (lessonsGot === totalLessons && puzzlesGot === totalPuzzles && coinsGot >= Math.ceil(totalCoins * 0.5)) stars = 3;

    const prev = progress.completed[state.world.id];
    progress.completed[state.world.id] = {
      stars: Math.max(stars, prev ? prev.stars : 0),
      coins: coinsGot
    };
    saveProgress();

    document.getElementById('victoryStars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    document.getElementById('victoryTitle').textContent = `أنهيت ${state.world.shortTitle}! 🎉`;
    document.getElementById('victorySubtitle').textContent =
      state.world.id < 4
        ? 'عمل رائع! لقد فهمت مفاهيم هذا العالم ويمكنك الانتقال الآن للمستوى التالي.'
        : 'مبروك! لقد أكملت كل المستويات الأربعة من الصفر وأصبحت مستعداً لتمارين 2BAC علوم فيزيائية!';

    document.getElementById('vCoins').textContent = `${coinsGot} / ${totalCoins}`;
    document.getElementById('vLessons').textContent = `${lessonsGot} / ${totalLessons}`;
    document.getElementById('vPuzzles').textContent = `${puzzlesGot} / ${totalPuzzles}`;

    const tk = document.getElementById('victoryTakeaways');
    if (tk) {
      const lines = (state.world.takeaways || []).map(x => `• ${x}`).join('\n');
      setMixed(tk, `📌 **خلاصة ما تعلمته في هذا المستوى:**\n${lines}`);
      tk.style.whiteSpace = 'pre-line';
    }

    const nextBtnLbl = document.getElementById('btnNextLevelLabel');
    if (nextBtnLbl) {
      nextBtnLbl.textContent = state.world.id < 4
        ? `المستوى ${state.world.id + 1}: ${window.QUEST_WORLDS[state.world.id].shortTitle} ▶`
        : 'إعادة المغامرة من المستوى 1 🔄';
    }

    document.getElementById('victoryModal')?.classList.remove('hidden');
    window.lockQuestInput(260);
  }

  window.advanceAfterVictory = function() {
    const nextId = state.world.id < 4 ? state.world.id + 1 : 1;
    window.startWorldFromModal(nextId);
  };

  function hideAllModals() {
    ['startModal', 'lessonModal', 'gatePuzzleModal', 'notebookModal', 'pauseModal', 'victoryModal'].forEach(id => {
      document.getElementById(id)?.classList.add('hidden');
    });
  }

  // =========================================================================
  // INTERACT BUTTON [E / ▢]
  // =========================================================================
  window.triggerHeroInteract = function() {
    if (state.mode !== 'play') return;
    const h = state.hero;

    // Near Castle Door?
    if (Math.hypot(h.x - state.castleDoor.x, h.y - state.castleDoor.y) <= 75) {
      window.openGateModal();
      return;
    }

    // Near an opened Question Block? (Re-read anytime!)
    for (const qb of state.questionBlocks) {
      const cx = qb.x + 22;
      const cy = qb.y + 19;
      if (Math.hypot(h.x - cx, h.y - cy) <= 75) {
        openLessonModal(qb.lessonId);
        return;
      }
    }
  };

  // =========================================================================
  // MARIO PLATFORMER PHYSICS & INTERACTIONS
  // =========================================================================
  function triggerQuestionBlock(qb) {
    qb.bumpOffset = -9;
    window.QuestAudio?.playBlockBump?.();
    window.triggerQuestHaptic(45, 0.3, 0.35);
    spawnParticles(qb.x + 22, qb.y, 16, '#fbbf24', 170);

    if (!qb.opened) {
      qb.opened = true;
      state.score += 150;
      addFloatText(qb.x + 22, qb.y - 14, '+150 درس جديد!', '#fde047');
    }
    openLessonModal(qb.lessonId);
  }

  function triggerPuzzleOption(pz, opt) {
    if (pz.solved || opt.triedWrong) return;

    if (opt.correct) {
      opt.solved = true;
      pz.solved = true;
      state.score += 250;
      window.QuestAudio?.playPuzzleSolved?.();
      window.triggerQuestHaptic(80, 0.45, 0.55);

      const target = pz.bridge || pz.barrier;
      if (target) {
        spawnParticles(target.x + target.w / 2, target.y + 15, 28, '#34d399', 240);
      }
      addFloatText(opt.x + (pz.kind === 'blocks' ? 36 : 0), opt.y - 45, '✓ أحسنت! +250', '#34d399');
      showToast(pz.successMsg, false, 4.5);
    } else {
      opt.triedWrong = true;
      window.QuestAudio?.playWrong?.();
      addFloatText(opt.x + (pz.kind === 'blocks' ? 36 : 0), opt.y - 45, 'حاول مرة أخرى', '#fbbf24');
      showToast(opt.hint || 'فكّر قليلاً في القاعدة وجرب خياراً آخر!', true, 4.2);
    }
  }

  function hurtHero(msg) {
    const h = state.hero;
    if (h.invulnTimer > 0) return;
    h.hearts--;
    h.invulnTimer = 1.5;
    state.hurtFlash = 1.0;
    state.shake = 10;
    window.QuestAudio?.playHurt?.();
    window.triggerQuestHaptic(90, 0.5, 0.65);

    if (h.hearts <= 0) {
      h.hearts = h.maxHearts;
      h.x = h.respawnX;
      h.y = h.respawnY - 40;
      h.vx = 0;
      h.vy = 0;
      h.onLadder = false;
      h.flying = false;
      h.wingFuel = 100;
      showToast('تم إرجاعك لنقطة الحفظ بقلوب كاملة! ❤️❤️❤️', true, 3.2);
    } else {
      h.vy = -340;
      showToast(msg || 'انتبه من الأخطاء! يمكنك القفز فوقها لتهزمها.', true, 2.4);
    }
  }

  function updateWorld(dt, input) {
    state.time += dt;
    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 34);
    if (state.hurtFlash > 0) state.hurtFlash = Math.max(0, state.hurtFlash - dt * 2.2);

    if (toastTimer > 0) {
      toastTimer -= dt;
      if (toastTimer <= 0) {
        document.getElementById('worldToast')?.classList.remove('visible');
      }
    }

    // Visual bump bounce recovery & spring timer
    for (const qb of state.questionBlocks) {
      if (qb.bumpOffset < 0) qb.bumpOffset = Math.min(0, qb.bumpOffset + dt * 55);
    }
    for (const pz of state.puzzles) {
      for (const opt of pz.options) {
        if (opt.bumpOffset < 0) opt.bumpOffset = Math.min(0, opt.bumpOffset + dt * 55);
      }
    }
    for (const sp of state.springs) {
      if (sp.bounceTimer > 0) sp.bounceTimer = Math.max(0, sp.bounceTimer - dt);
    }

    // Particles & floating text animate even lightly
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const pt = state.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vy += 360 * dt;
      pt.life -= dt;
      if (pt.life <= 0) state.particles.splice(i, 1);
    }
    for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
      const ft = state.floatingTexts[i];
      ft.y -= 28 * dt;
      ft.life -= dt;
      if (ft.life <= 0) state.floatingTexts.splice(i, 1);
    }

    if (state.mode !== 'play') return;

    const h = state.hero;
    const world = state.world;

    if (h.invulnTimer > 0) h.invulnTimer = Math.max(0, h.invulnTimer - dt);
    h.flying = false;

    // 1. Check Ladder Overlap & Climbing
    let activeLadder = null;
    for (const lad of state.ladders) {
      if (Math.abs(h.x - lad.x) <= 22 && h.y + h.halfH >= lad.topY - 6 && h.y - h.halfH <= lad.bottomY + 4) {
        activeLadder = lad;
        break;
      }
    }

    if (activeLadder && Math.abs(input.moveY) > 0.35) {
      const pressingDownAtBottom = input.moveY > 0 && h.y + h.halfH >= activeLadder.bottomY - 3;
      if (!pressingDownAtBottom) {
        h.onLadder = true;
      }
    }
    if (!activeLadder) {
      h.onLadder = false;
    }

    // 2. Jump Buffer & Coyote Time
    if (input.jumpJustPressed) h.jumpBuffer = 0.14;
    else h.jumpBuffer = Math.max(0, h.jumpBuffer - dt);

    if (h.grounded) h.coyoteTimer = 0.12;
    else h.coyoteTimer = Math.max(0, h.coyoteTimer - dt);

    // 3. Movement (Ladder vs Ground/Air)
    const maxSpeed = input.sprintHeld ? 345 : 275;
    if (Math.abs(input.moveX) > 0.1) {
      h.facing = Math.sign(input.moveX);
    }

    const prevX = h.x;
    const prevY = h.y;
    const prevTop = prevY - h.halfH;
    const prevBottom = prevY + h.halfH;

    if (h.onLadder && activeLadder) {
      h.vx = input.moveX * 150;
      h.vy = input.moveY * 215;
      h.x += (activeLadder.x - h.x) * Math.min(1, dt * 6) + h.vx * dt;
      h.y += h.vy * dt;
      h.climbCycle += Math.abs(input.moveY) * dt * 11;
      h.grounded = false;

      if (h.y + h.halfH <= activeLadder.topY + 2 && input.moveY < 0) {
        h.y = activeLadder.topY - h.halfH;
        h.vy = 0;
        h.onLadder = false;
        h.grounded = true;
      }
      if (h.y + h.halfH > activeLadder.bottomY) {
        h.y = activeLadder.bottomY - h.halfH;
        h.vy = 0;
        h.onLadder = false;
      }
      if (input.jumpJustPressed && Math.abs(input.moveY) < 0.35) {
        h.onLadder = false;
        h.vy = -540;
        window.QuestAudio?.playJump?.();
      }
    } else {
      const targetVx = input.moveX * maxSpeed;
      const accel = h.grounded ? 18 : 11;
      h.vx += (targetVx - h.vx) * Math.min(1, dt * accel);
      h.x += h.vx * dt;

      if (h.grounded && Math.abs(h.vx) > 25) {
        h.walkCycle += Math.abs(h.vx) * dt * 0.045;
      }

      // Jump from Ground / Coyote
      if (h.jumpBuffer > 0 && h.coyoteTimer > 0) {
        h.vy = -590;
        h.grounded = false;
        h.coyoteTimer = 0;
        h.jumpBuffer = 0;
        window.QuestAudio?.playJump?.();
        spawnParticles(h.x, h.y + h.halfH, 6, '#e2e8f0', 90);
      } else if (h.hasWings && !h.grounded) {
        // Wing flight!
        if (input.jumpJustPressed && h.wingFuel >= 8) {
          h.vy = Math.min(h.vy, -340);
          h.wingFuel = Math.max(0, h.wingFuel - 8);
          h.flying = true;
          window.QuestAudio?.playWingFlap?.();
          spawnParticles(h.x, h.y + 8, 5, '#fde047', 100);
        } else if (input.jumpHeld && h.wingFuel > 0) {
          h.vy = Math.max(-285, h.vy - 1750 * dt);
          h.wingFuel = Math.max(0, h.wingFuel - 28 * dt);
          h.flying = true;
        }
      }

      // Updraft currents lift hero smoothly!
      for (const up of state.updrafts) {
        if (h.x >= up.x && h.x <= up.x + up.w && h.y >= up.y && h.y <= up.y + up.h) {
          h.vy = Math.max(-360, h.vy - 2100 * dt);
          h.wingFuel = Math.min(100, h.wingFuel + 55 * dt);
          h.flying = true;
        }
      }

      // Gravity
      h.vy = Math.min(820, h.vy + 1350 * dt);
      h.y += h.vy * dt;
    }

    // Clamp Left Wall (x = 40) & Right Edge
    if (h.x - h.halfW < 40) {
      h.x = 40 + h.halfW;
      h.vx = 0;
    }
    if (h.x + h.halfW > world.width - 10) {
      h.x = world.width - 10 - h.halfW;
      h.vx = 0;
    }

    // 4. Solid Barrier Collision (Puzzle 2 Barriers)
    for (const pz of state.puzzles) {
      if (pz.barrier && !pz.solved) {
        const bar = pz.barrier;
        const barTop = 0;
        if (h.y + h.halfH > barTop && h.y - h.halfH < bar.y + bar.h) {
          if (prevX + h.halfW <= bar.x + 4 && h.x + h.halfW > bar.x) {
            h.x = bar.x - h.halfW;
            h.vx = 0;
          } else if (prevX - h.halfW >= bar.x + bar.w - 4 && h.x - h.halfW < bar.x + bar.w) {
            h.x = bar.x + bar.w + h.halfW;
            h.vx = 0;
          }
        }
      }
    }

    // 5. Platforms & Bridges Landing
    h.grounded = false;
    const solids = [...state.platforms];
    for (const pz of state.puzzles) {
      if (pz.bridge && pz.solved) solids.push(pz.bridge);
    }

    if (!h.onLadder) {
      for (const plat of solids) {
        const overlapX = h.x + h.halfW - 3 > plat.x && h.x - h.halfW + 3 < plat.x + plat.w;
        if (plat.ground) {
          // Ground blocks behave solidly from top and sides
          if (overlapX && h.vy >= 0 && prevBottom <= plat.y + 14 && h.y + h.halfH >= plat.y) {
            h.y = plat.y - h.halfH;
            h.vy = 0;
            h.grounded = true;
          } else if (h.y + h.halfH > plat.y + 10 && h.y - h.halfH < plat.y + plat.h) {
            if (prevX + h.halfW <= plat.x + 6 && h.x + h.halfW > plat.x) {
              h.x = plat.x - h.halfW;
              h.vx = 0;
            } else if (prevX - h.halfW >= plat.x + plat.w - 6 && h.x - h.halfW < plat.x + plat.w) {
              h.x = plat.x + plat.w + h.halfW;
              h.vx = 0;
            }
          }
        } else {
          // Floating platforms are one-way so ladders & jumps pass cleanly from below!
          if (overlapX && h.vy >= 0 && prevBottom <= plat.y + 12 && h.y + h.halfH >= plat.y) {
            h.y = plat.y - h.halfH;
            h.vy = 0;
            h.grounded = true;
          }
        }
      }
    }

    // 6. ? Question Blocks & Choice Blocks (Solid 4-way + Head-bump triggers!)
    const bumpables = [];
    for (const qb of state.questionBlocks) {
      bumpables.push({ kind: 'qb', ref: qb, x: qb.x, y: qb.y, w: 44, h: 38 });
    }
    for (const pz of state.puzzles) {
      if (pz.kind === 'blocks') {
        for (const opt of pz.options) {
          bumpables.push({ kind: 'choice', pz, ref: opt, x: opt.x, y: opt.y, w: 72, h: 38 });
        }
      }
    }

    for (const blk of bumpables) {
      const overlapX = h.x + h.halfW - 2 > blk.x && h.x - h.halfW + 2 < blk.x + blk.w;
      if (overlapX) {
        // Head bump from below!
        if (h.vy < 0 && prevTop >= blk.y + blk.h - 10 && h.y - h.halfH <= blk.y + blk.h) {
          h.y = blk.y + blk.h + h.halfH;
          h.vy = 45;
          if (blk.kind === 'qb') {
            triggerQuestionBlock(blk.ref);
          } else {
            blk.ref.bumpOffset = -9;
            triggerPuzzleOption(blk.pz, blk.ref);
          }
        } else if (h.vy >= 0 && prevBottom <= blk.y + 10 && h.y + h.halfH >= blk.y) {
          // Stand on top!
          h.y = blk.y - h.halfH;
          h.vy = 0;
          h.grounded = true;
        }
      }
    }

    // Refill wings on ground
    if (h.grounded && h.hasWings) {
      h.wingFuel = Math.min(100, h.wingFuel + dt * 110);
    }

    // 7. Floor Pressure Pads (Puzzle kind === 'pads')
    for (const pz of state.puzzles) {
      if (pz.kind === 'pads' && !pz.solved) {
        for (const opt of pz.options) {
          if (!opt.triedWrong && Math.abs(h.x - opt.x) < 42 && Math.abs((h.y + h.halfH) - opt.y) < 16) {
            triggerPuzzleOption(pz, opt);
          }
        }
      }
    }

    // 8. Riemann Area Pillars (World 3)
    if (state.areaPillars && state.areaPillars.length > 0) {
      for (const pil of state.areaPillars) {
        if (!pil.lit && h.x >= pil.x && h.x <= pil.x + pil.w && h.y + h.halfH >= pil.y - 8) {
          pil.lit = true;
          state.score += 50;
          window.QuestAudio?.playCoin?.();
          spawnParticles(pil.x + pil.w / 2, pil.y + 20, 10, '#34d399', 130);
        }
      }
      if (!state.areaBonusGiven && state.areaPillars.every(p => p.lit)) {
        state.areaBonusGiven = true;
        state.score += 200;
        showToast('رائع! جمعت 4 مستطيلات لتكوين المساحة الكلية = 4 (+200)!', false, 4.0);
        window.QuestAudio?.playPuzzleSolved?.();
      }
    }

    // 9. Springs
    for (const sp of state.springs) {
      if (Math.abs(h.x - sp.x) < sp.w / 2 + 8 && Math.abs((h.y + h.halfH) - (sp.y - 14)) < 18 && h.vy >= 0) {
        h.vy = -790;
        h.grounded = false;
        sp.bounceTimer = 0.25;
        window.QuestAudio?.playSpring?.();
        spawnParticles(sp.x, sp.y - 16, 12, '#fbbf24', 150);
      }
    }

    // 10. Wing Pickups
    for (const wg of state.wings) {
      if (!wg.collected && Math.hypot(h.x - wg.x, h.y - wg.y) < 32) {
        wg.collected = true;
        h.hasWings = true;
        h.wingFuel = 100;
        state.score += 120;
        window.QuestAudio?.playPuzzleSolved?.();
        spawnParticles(wg.x, wg.y, 20, '#fde047', 200);
        showToast('🪽 حصلت على أجنحة eˣ! اضغط أو استمر بالضغط على [Space / ✕] في الهواء للطيران!', false, 4.8);
      }
    }

    // 11. Coins
    for (const c of state.coins) {
      if (!c.collected && Math.hypot(h.x - c.x, h.y - c.y) < 26) {
        c.collected = true;
        state.score += 40;
        window.QuestAudio?.playCoin?.();
        spawnParticles(c.x, c.y, 8, '#fbbf24', 110);
      }
    }

    // 12. Checkpoints
    for (const cp of state.checkpoints) {
      if (!cp.activated && Math.hypot(h.x - cp.x, (h.y + h.halfH) - cp.y) < 42) {
        cp.activated = true;
        h.respawnX = cp.x;
        h.respawnY = cp.y - 30;
        window.QuestAudio?.playBlockBump?.();
        addFloatText(cp.x, cp.y - 58, '✓ نقطة حفظ', '#34d399');
        spawnParticles(cp.x, cp.y - 36, 14, '#34d399', 150);
      }
    }

    // 13. Critters (Stomp or Hurt)
    for (const cr of state.critters) {
      if (!cr.alive) {
        if (cr.squishTimer > 0) cr.squishTimer -= dt;
        continue;
      }
      cr.x += cr.dir * cr.speed * dt;
      if (cr.x <= cr.minX) { cr.x = cr.minX; cr.dir = 1; }
      if (cr.x >= cr.maxX) { cr.x = cr.maxX; cr.dir = -1; }

      if (Math.abs(h.x - cr.x) < 25 && Math.abs(h.y - cr.y) < 27) {
        if (h.vy > 30 && prevY < cr.y - 2) {
          cr.alive = false;
          cr.squishTimer = 0.6;
          h.vy = -440;
          state.score += 100;
          window.QuestAudio?.playStomp?.();
          spawnParticles(cr.x, cr.y, 16, '#fb7185', 160);
          addFloatText(cr.x, cr.y - 24, '+100', '#34d399', true);
        } else {
          hurtHero('انتبه! اقفز فوق الأعداء لهزمهم مثل Super Mario!');
        }
      }
    }

    // 14. Pit Fall Respawn
    if (h.y > world.height + 65) {
      hurtHero('سقطت في الفجوة! تم إرجاعك لنقطة الحفظ.');
      if (h.hearts > 0) {
        h.x = h.respawnX;
        h.y = h.respawnY - 40;
        h.vx = 0;
        h.vy = 0;
        h.onLadder = false;
        h.flying = false;
        h.wingFuel = 100;
      }
    }

    // 15. Castle Door & Goal Flagpole
    if (!state.gateSolved && !state.doorAutoPrompted && Math.hypot(h.x - state.castleDoor.x, (h.y + h.halfH) - state.castleDoor.y) < 36) {
      state.doorAutoPrompted = true;
      window.openGateModal();
    }

    if (Math.hypot(h.x - state.flagpole.x, (h.y + h.halfH) - state.flagpole.y) < 42) {
      if (state.gateSolved) {
        finishWorldVictory();
      } else {
        showToast('افتح بوابة القلعة [E / ▢] أولاً لفتح الراية!', true, 2.8);
      }
    }
  }

  // =========================================================================
  // HUD SYNC
  // =========================================================================
  function syncHUD() {
    const h = state.hero;
    const w = state.world;

    const wLabel = w.shortTitle;
    if (hudCache.wLabel !== wLabel) {
      hudCache.wLabel = wLabel;
      document.getElementById('hudWorldLabel').textContent = wLabel;
    }

    const heartsStr = '❤️'.repeat(h.hearts) + '🖤'.repeat(Math.max(0, h.maxHearts - h.hearts));
    if (hudCache.hearts !== heartsStr) {
      hudCache.hearts = heartsStr;
      document.getElementById('hudHearts').textContent = heartsStr;
    }

    const coinsStr = `${state.coins.filter(c => c.collected).length} / ${state.coins.length}`;
    if (hudCache.coins !== coinsStr) {
      hudCache.coins = coinsStr;
      document.getElementById('hudCoins').textContent = coinsStr;
    }

    const pzStr = `${state.puzzles.filter(p => p.solved).length} / ${state.puzzles.length}`;
    if (hudCache.pz !== pzStr) {
      hudCache.pz = pzStr;
      document.getElementById('hudPuzzles').textContent = pzStr;
    }

    const lesStr = `${state.questionBlocks.filter(q => q.opened).length} / ${state.questionBlocks.length}`;
    if (hudCache.les !== lesStr) {
      hudCache.les = lesStr;
      document.getElementById('hudLessons').textContent = lesStr;
    }

    const wingWrap = document.getElementById('hudWingWrap');
    if (wingWrap) {
      wingWrap.classList.toggle('hidden', !h.hasWings);
      if (h.hasWings) {
        document.getElementById('hudWingFill').style.width = `${Math.round(h.wingFuel)}%`;
        document.getElementById('touchJumpLabel').textContent = h.grounded ? 'قفز' : 'طيران';
      } else {
        document.getElementById('touchJumpLabel').textContent = 'قفز';
      }
    }

    // Live Math Coordinate Badge
    const xScaled = Math.max(0.2, 1 + (h.x - 120) / 520);
    let coordStr = '';
    if (w.id === 1) {
      coordStr = `x=${xScaled.toFixed(1)}, ln(x)=${Math.log(xScaled).toFixed(2)}`;
    } else if (w.id === 2) {
      const xt = (h.x - 120) / 800;
      coordStr = `x=${xt.toFixed(1)}, eˣ=${Math.exp(xt).toFixed(2)}`;
    } else if (w.id === 3) {
      coordStr = `∫₁^${xScaled.toFixed(1)} (1/t)dt = ${Math.log(xScaled).toFixed(2)}`;
    } else {
      coordStr = `x=${xScaled.toFixed(1)}, eˣ·ln(x) ready`;
    }
    if (hudCache.coord !== coordStr) {
      hudCache.coord = coordStr;
      document.getElementById('hudCoordMath').textContent = coordStr;
    }

    // Context interact prompt
    const ctxPill = document.getElementById('contextPill');
    if (ctxPill) {
      let prompt = '';
      if (state.mode === 'play') {
        if (!state.gateSolved && Math.hypot(h.x - state.castleDoor.x, h.y - state.castleDoor.y) <= 80) {
          prompt = '🏰 اضغط [E / ▢] لفتح لغز القلعة';
        } else {
          const nearQb = state.questionBlocks.find(qb => qb.opened && Math.hypot(h.x - (qb.x + 22), h.y - (qb.y + 19)) <= 70);
          if (nearQb) prompt = '📖 اضغط [E / ▢] لإعادة قراءة هذا الدرس';
        }
      }
      ctxPill.textContent = prompt;
      ctxPill.classList.toggle('hidden', !prompt);
    }
  }

  // =========================================================================
  // WIRE UI BUTTONS
  // =========================================================================
  document.getElementById('btnStartAdventure')?.addEventListener('click', () => window.startWorldFromModal(state.selectedWorldId));
  document.getElementById('btnOpenNotebookFromStart')?.addEventListener('click', window.openNotebookModal);
  document.getElementById('btnOpenNotebook')?.addEventListener('click', window.openNotebookModal);
  document.getElementById('btnCloseNotebook')?.addEventListener('click', window.closeNotebookModal);
  document.getElementById('btnReturnFromNotebook')?.addEventListener('click', window.closeNotebookModal);

  document.querySelectorAll('.nb-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      window.QuestAudio?.playUiTick?.();
      renderNotebookTab(btn.dataset.tab || 'ln');
    });
  });

  document.getElementById('btnCloseLesson')?.addEventListener('click', window.closeLessonModal);
  document.getElementById('btnGateHint')?.addEventListener('click', window.toggleGateHint);
  document.getElementById('btnGateClose')?.addEventListener('click', window.closeGateModal);

  for (let i = 0; i < 4; i++) {
    document.getElementById(`gateOpt${i}`)?.addEventListener('click', () => window.submitGateAnswer(i));
  }

  document.getElementById('gateSlider')?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10) || 4;
    document.getElementById('gateSliderVal').textContent = `n = ${val}`;
    const list = window.GATE_PUZZLES[state.world.id] || [];
    const step = list[state.gateStepIdx];
    if (step) {
      window.drawLessonDiagram(document.getElementById('gateCanvas'), step.visualType, val);
    }
  });

  document.getElementById('btnToggleAudio')?.addEventListener('click', (e) => {
    e.currentTarget?.blur?.();
    window.QuestAudio?.init?.();
    const muted = window.QuestAudio?.toggleMute?.();
    document.getElementById('btnToggleAudio').textContent = muted ? '🔇' : '🔊';
  });

  document.getElementById('btnTogglePause')?.addEventListener('click', (e) => {
    e.currentTarget?.blur?.();
    if (state.mode === 'pause') window.resumeFromPause();
    else window.openPauseModal();
  });

  document.getElementById('btnLevelMenu')?.addEventListener('click', (e) => {
    e.currentTarget?.blur?.();
    openStartModal();
  });
  document.getElementById('btnPauseResume')?.addEventListener('click', window.resumeFromPause);
  document.getElementById('btnPauseNotebook')?.addEventListener('click', window.openNotebookModal);
  document.getElementById('btnPauseLevels')?.addEventListener('click', openStartModal);
  document.getElementById('btnPauseRestart')?.addEventListener('click', () => window.startWorldFromModal(state.world.id));

  document.getElementById('btnNextLevel')?.addEventListener('click', window.advanceAfterVictory);
  document.getElementById('btnVictoryLevels')?.addEventListener('click', openStartModal);

  // Initialize Controls, Start Cards & KaTeX
  window.initQuestControls(() => state);
  window.MathKaTeX?.scanPage?.(document);
  renderWorldCards();

  function tick(ts) {
    const dt = Math.min(0.05, Math.max(0.001, (ts - lastTs) / 1000));
    lastTs = ts;

    const input = window.pollQuestInputs(state);
    updateWorld(dt, input);
    window.renderQuestFrame(ctx, viewW, viewH, state);
    syncHUD();

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
