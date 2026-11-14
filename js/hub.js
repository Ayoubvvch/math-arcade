/**
 * Math Arcade - PlayStation 5 Style Console Hub Controller
 * Cinematic boot sequence, zero-scroll horizontal game launcher,
 * smooth DualSense / Xbox / Keyboard navigation with zero dropped inputs.
 */

import { sound } from '../shared/retro-audio.js';
import { gamepad } from '../shared/gamepad.js';

function getGameArtworkSVG(game) {
  const accent = game.accentColor || '#00e5ff';

  if (game.id === 'mathcore-survivor') {
    return `
      <svg class="tile-svg" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="mcGlow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stop-color="#00f3ff" stop-opacity="0.32" />
            <stop offset="100%" stop-color="#060914" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="320" height="200" fill="#070c1a" />
        <circle cx="160" cy="100" r="85" fill="url(#mcGlow)" />
        <circle cx="160" cy="100" r="56" fill="none" stroke="#00f3ff" stroke-opacity="0.28" stroke-dasharray="6 6" stroke-width="1.5" />
        <circle cx="160" cy="100" r="28" fill="#09152e" stroke="#00f3ff" stroke-width="2.5" />
        <text x="160" y="106" text-anchor="middle" fill="#ffffff" font-family="JetBrains Mono, monospace" font-weight="800" font-size="16">X=n</text>
        <path d="M72 58 L134 88 M248 142 L186 112" stroke="#00ff88" stroke-width="2" stroke-linecap="round" stroke-opacity="0.85" />
        <polygon points="72,44 86,68 58,68" fill="none" stroke="#ff007f" stroke-width="2.2" />
        <rect x="234" y="128" width="26" height="26" rx="4" fill="none" stroke="#ffb800" stroke-width="2.2" />
        <text x="247" y="54" text-anchor="middle" fill="#00e5ff" font-family="JetBrains Mono, monospace" font-weight="800" font-size="14">✕ ◯ ▢ △</text>
      </svg>
    `;
  }

  if (game.id === 'math-battle') {
    return `
      <svg class="tile-svg" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="mbGlow" cx="55%" cy="48%" r="55%">
            <stop offset="0%" stop-color="#b537f2" stop-opacity="0.34" />
            <stop offset="100%" stop-color="#070914" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="320" height="200" fill="#090714" />
        <circle cx="165" cy="98" r="88" fill="url(#mbGlow)" />
        <line x1="40" y1="100" x2="280" y2="100" stroke="#ffffff" stroke-opacity="0.14" stroke-width="1" />
        <line x1="160" y1="24" x2="160" y2="176" stroke="#ffffff" stroke-opacity="0.14" stroke-width="1" />
        <path d="M46 155 Q 115 30, 175 100 T 274 45" fill="none" stroke="#ff5500" stroke-width="2.5" stroke-opacity="0.85" />
        <circle cx="105" cy="122" r="19" fill="#001524" stroke="#00f0ff" stroke-width="2.5" />
        <text x="105" y="127" text-anchor="middle" fill="#00f0ff" font-family="Cambria Math, Georgia, serif" font-style="italic" font-weight="700" font-size="14">d/dx</text>
        <circle cx="222" cy="76" r="24" fill="#1b071e" stroke="#ff5500" stroke-width="2.5" />
        <text x="222" y="83" text-anchor="middle" fill="#ff5500" font-family="Cambria Math, Georgia, serif" font-style="italic" font-weight="700" font-size="20">x³</text>
        <text x="255" y="152" text-anchor="middle" fill="#10b981" font-family="JetBrains Mono, monospace" font-weight="800" font-size="13">→ 0</text>
      </svg>
    `;
  }

  if (game.id === 'asymptote-asylum') {
    return `
      <svg class="tile-svg" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="aaGlow" cx="50%" cy="52%" r="55%">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.38" />
            <stop offset="100%" stop-color="#050205" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="320" height="200" fill="#070204" />
        <circle cx="160" cy="104" r="92" fill="url(#aaGlow)" />
        <circle cx="160" cy="100" r="54" fill="none" stroke="#dc2626" stroke-width="2" stroke-opacity="0.55" />
        <circle cx="160" cy="100" r="38" fill="none" stroke="#991b1b" stroke-dasharray="6 5" stroke-width="1.5" />
        <path d="M46 156 Q 112 130 160 88 T 274 36" fill="none" stroke="#38bdf8" stroke-width="2.4" />
        <line x1="78" y1="146" x2="246" y2="30" stroke="#fbbf24" stroke-dasharray="5 4" stroke-width="1.8" />
        <circle cx="160" cy="88" r="5" fill="#fbbf24" />
        <ellipse cx="92" cy="148" rx="18" ry="8" fill="#7f1d1d" fill-opacity="0.8" />
        <ellipse cx="242" cy="146" rx="22" ry="10" fill="#991b1b" fill-opacity="0.72" />
        <circle cx="240" cy="70" r="3.2" fill="#ff2a2a" />
        <circle cx="252" cy="70" r="3.2" fill="#ff2a2a" />
        <text x="160" y="166" text-anchor="middle" fill="#fecaca" font-family="JetBrains Mono, monospace" font-weight="800" font-size="13">f'(x₀) — 23..38</text>
      </svg>
    `;
  }

  if (game.id === 'sequence-strider') {
    return `
      <svg class="tile-svg" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="ssGlow" cx="55%" cy="48%" r="55%">
            <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.34" />
            <stop offset="100%" stop-color="#030712" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="320" height="200" fill="#040916" />
        <circle cx="176" cy="96" r="88" fill="url(#ssGlow)" />
        <line x1="40" y1="36" x2="280" y2="36" stroke="#fb7185" stroke-dasharray="6 4" stroke-width="1.5" />
        <line x1="40" y1="164" x2="280" y2="164" stroke="#fb7185" stroke-dasharray="6 4" stroke-width="1.5" />
        <line x1="45" y1="160" x2="275" y2="42" stroke="#94a3b8" stroke-dasharray="4 4" stroke-width="1.4" />
        <path d="M46 155 Q 130 92, 272 52" fill="none" stroke="#38bdf8" stroke-width="2.5" />
        <polyline points="82,160 82,124 118,124 118,104 156,104 156,88 214,72" fill="none" stroke="#fbbf24" stroke-width="1.8" />
        <circle cx="214" cy="72" r="6" fill="#10b981" />
        <text x="160" y="182" text-anchor="middle" fill="#bae6fd" font-family="JetBrains Mono, monospace" font-weight="800" font-size="12">uₙ₊₁ = f(uₙ) → L (39..50)</text>
      </svg>
    `;
  }

  return `
    <svg class="tile-svg" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="320" height="200" fill="#070c18" />
      <circle cx="160" cy="100" r="46" fill="none" stroke="${accent}" stroke-opacity="0.45" stroke-width="2" />
      <text x="160" y="114" text-anchor="middle" fill="#ffffff" font-family="Cambria Math, serif" font-size="48" font-weight="700">${game.icon || '∫'}</text>
    </svg>
  `;
}

function formatControlEntry(text) {
  const idx = text.indexOf(':');
  if (idx === -1) return { key: 'INPUT', desc: text };
  return {
    key: text.slice(0, idx).trim(),
    desc: text.slice(idx + 1).trim(),
  };
}

class ArcadeConsoleHub {
  constructor() {
    this.games = [];
    this.filteredGames = [];
    this.activeCategory = 'All';
    this.searchQuery = '';
    this.selectedIndex = 0;

    // Navigation state: 'rail' | 'actions' | 'modal'
    this.navZone = 'rail';
    this.actionIndex = 0;
    this.modalFocusIndex = 0;
    this.bootDismissed = false;
    this.isLaunching = false;

    // Gamepad repeat timing (kept separate from face button presses so buttons NEVER get dropped!)
    this.nextDirRepeatAt = 0;
    this.lastDirVector = null;

    // DOM Cache
    this.bootOverlay = document.getElementById('ps5-boot');
    this.consoleShell = document.getElementById('console-shell');
    this.launchCurtain = document.getElementById('launch-curtain');
    this.launchIcon = document.getElementById('launch-icon');
    this.launchLabel = document.getElementById('launch-label');

    this.rail = document.getElementById('games-rail');
    this.consoleMain = document.querySelector('.console-main');
    this.categoryTabs = document.getElementById('category-tabs');
    this.railStatusText = document.getElementById('rail-filter-status');
    this.statsCounter = document.getElementById('stats-counter');

    this.showcase = document.getElementById('ps5-showcase');
    this.showcaseCategory = document.getElementById('showcase-category');
    this.showcaseDiff = document.getElementById('showcase-difficulty');
    this.showcaseVersion = document.getElementById('showcase-version');
    this.showcaseStatus = document.getElementById('showcase-status');
    this.showcaseTitle = document.getElementById('showcase-title');
    this.showcaseDesc = document.getElementById('showcase-desc');
    this.showcaseConcepts = document.getElementById('showcase-concepts');
    this.showcaseControls = document.getElementById('showcase-controls');
    this.blueprintArtBadge = document.getElementById('blueprint-art-badge');
    this.ambientPrimary = document.getElementById('ambient-glow-primary');

    this.btnPlaySelected = document.getElementById('btn-play-selected');
    this.btnInfoSelected = document.getElementById('btn-info-selected');

    this.searchModal = document.getElementById('search-modal');
    this.gameModal = document.getElementById('game-modal');
    this.guideModal = document.getElementById('guide-modal');
    this.searchInput = document.getElementById('search-input');

    this.controllerPill = document.getElementById('controller-pill');
    this.controllerLabel = document.getElementById('controller-label');
    this.soundToggleBtn = document.getElementById('sound-toggle');
    this.soundIcon = document.getElementById('sound-icon');
    this.soundLabel = document.getElementById('sound-label');
    this.clockEl = document.getElementById('console-clock');

    this.init();
  }

  async init() {
    this.startClock();
    this.setupBootSequence();
    this.bindEvents();
    this.initGamepad();
    await this.loadGames();
    this.renderCategories();
    this.applyFilters();
    this.startLoop();
  }

  setupBootSequence() {
    const params = new URLSearchParams(window.location.search);
    const returningFromGame = params.get('from') === 'game' || (document.referrer && document.referrer.includes('/games/'));

    if (returningFromGame && this.bootOverlay) {
      // Fast console wake when coming back from a game (no waiting annoyance!)
      this.bootDismissed = true;
      this.bootOverlay.classList.add('boot-hidden');
      requestAnimationFrame(() => {
        this.consoleShell?.classList.add('ready');
      });
      if (params.has('from')) {
        window.history.replaceState({}, '', window.location.pathname);
      }
      return;
    }

    // Grand cinematic boot reveal (auto completes at 1.4s, skippable anytime)
    const finishBoot = () => this.dismissBoot();
    this.bootTimer = setTimeout(finishBoot, 1400);

    this.bootOverlay?.addEventListener('click', () => {
      sound.init();
      sound.playConsoleBoot();
      this.dismissBoot();
    }, { once: true });
  }

  dismissBoot() {
    if (this.bootDismissed) return;
    this.bootDismissed = true;
    clearTimeout(this.bootTimer);

    if (this.bootOverlay) {
      this.bootOverlay.classList.add('boot-exit');
      setTimeout(() => {
        this.bootOverlay?.classList.add('boot-hidden');
      }, 460);
    }

    requestAnimationFrame(() => {
      this.consoleShell?.classList.add('ready');
    });
  }

  startClock() {
    const update = () => {
      if (!this.clockEl) return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      this.clockEl.textContent = `${hh}:${mm}`;
    };
    update();
    setInterval(update, 15000);
  }

  async loadGames() {
    try {
      const response = await fetch('games.json?t=' + Date.now());
      if (!response.ok) throw new Error('Failed to load games.json');
      this.games = await response.json();
    } catch (err) {
      console.error('Error loading game catalog:', err);
      this.games = [];
    }
  }

  bindEvents() {
    // Unlock Web Audio cleanly on first pointer/key interaction
    const unlockAudio = () => {
      sound.init();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });

    // Top bar triggers
    document.getElementById('btn-search-trigger')?.addEventListener('click', () => {
      sound.playClick();
      this.openSearchModal();
    });

    document.getElementById('btn-add-game-guide')?.addEventListener('click', () => {
      sound.playClick();
      this.openGuideModal();
    });

    this.soundToggleBtn?.addEventListener('click', () => {
      this.toggleAudio();
    });

    // Showcase CTA buttons
    this.btnPlaySelected?.addEventListener('click', () => {
      this.launchSelectedGame();
    });

    this.btnInfoSelected?.addEventListener('click', () => {
      const game = this.filteredGames[this.selectedIndex];
      if (game) {
        sound.playClick();
        this.openGameModal(game);
      }
    });

    // Search input live filter
    this.searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.applyFilters();
    });

    document.getElementById('btn-clear-search')?.addEventListener('click', () => {
      sound.playClick();
      this.searchQuery = '';
      if (this.searchInput) this.searchInput.value = '';
      this.applyFilters();
    });

    document.querySelectorAll('.quick-tag-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playNavTick();
        const q = btn.getAttribute('data-query') || '';
        this.searchQuery = q;
        if (this.searchInput) this.searchInput.value = q;
        this.applyFilters();
        this.closeModals();
      });
    });

    // Modal close buttons & backdrop clicks
    document.getElementById('btn-close-search')?.addEventListener('click', () => this.closeModals());
    document.getElementById('btn-close-game-modal')?.addEventListener('click', () => this.closeModals());
    document.getElementById('btn-close-guide-modal')?.addEventListener('click', () => this.closeModals());
    document.getElementById('btn-guide-done')?.addEventListener('click', () => this.closeModals());

    [this.searchModal, this.gameModal, this.guideModal].forEach((overlay) => {
      overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeModals();
      });
    });

    // Full Keyboard PS5-style Controls
    window.addEventListener('keydown', (e) => {
      if (!this.bootDismissed) {
        if (['Enter', 'Space', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
          e.preventDefault();
          sound.playConsoleBoot();
          this.dismissBoot();
        }
        return;
      }

      const isTyping = document.activeElement === this.searchInput;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (this.getActiveModal()) {
          this.closeModals();
        } else if (this.searchQuery) {
          this.searchQuery = '';
          if (this.searchInput) this.searchInput.value = '';
          this.applyFilters();
        }
        return;
      }

      if (isTyping) {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.closeModals();
        }
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        this.openSearchModal();
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        this.toggleAudio();
        return;
      }

      if (e.key === 'i' || e.key === 'I') {
        const g = this.filteredGames[this.selectedIndex];
        if (g) this.openGameModal(g);
        return;
      }

      if (e.key === 'g' || e.key === 'G') {
        this.openGuideModal();
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        this.cycleCategories(e.shiftKey ? -1 : 1);
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        this.handleDirection('right');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        this.handleDirection('left');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        this.handleDirection('down');
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        this.handleDirection('up');
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleConfirm();
      }
    });
  }

  toggleAudio() {
    const isMuted = sound.toggleMute();
    if (this.soundIcon) this.soundIcon.textContent = isMuted ? '🔇' : '🔊';
    if (this.soundLabel) this.soundLabel.textContent = isMuted ? 'Muted' : 'Audio';
    if (!isMuted) sound.playClick();
  }

  initGamepad() {
    const updateBadge = (connected) => {
      if (!this.controllerPill || !this.controllerLabel) return;
      if (connected) {
        this.controllerPill.classList.add('connected');
        this.controllerLabel.textContent = gamepad.getControllerType();
      } else {
        this.controllerPill.classList.remove('connected');
        this.controllerLabel.textContent = 'Keyboard';
      }
    };

    gamepad.onConnect = () => {
      updateBadge(true);
      sound.playConsoleBoot();
      gamepad.triggerHaptic(70, 0.35, 0.35);
    };

    gamepad.onDisconnect = () => {
      updateBadge(false);
    };
  }

  startLoop() {
    const loop = (timestamp) => {
      this.updateGamepad(timestamp);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  updateGamepad(timestamp) {
    const connected = gamepad.poll();
    if (!connected) return;

    if (this.controllerPill && !this.controllerPill.classList.contains('connected')) {
      this.controllerPill.classList.add('connected');
      if (this.controllerLabel) this.controllerLabel.textContent = gamepad.getControllerType();
    }

    // Skip boot immediately on any controller input
    if (!this.bootDismissed) {
      if (gamepad.isAnyJustPressed() || Math.abs(gamepad.axes.leftX) > 0.5 || Math.abs(gamepad.axes.leftY) > 0.5) {
        sound.init();
        sound.playConsoleBoot();
        this.dismissBoot();
      }
      return;
    }

    // 1. Face & Shoulder Buttons (Edge-triggered, NEVER blocked by directional cooldown!)
    if (gamepad.isJustPressed('cross')) {
      this.handleConfirm();
      gamepad.triggerHaptic(55, 0.45, 0.45);
    }

    if (gamepad.isJustPressed('circle')) {
      this.handleBack();
      gamepad.triggerHaptic(40, 0.25, 0.25);
    }

    if (gamepad.isJustPressed('square')) {
      if (this.getActiveModal() === this.gameModal) {
        this.closeModals();
      } else {
        const game = this.filteredGames[this.selectedIndex];
        if (game) {
          sound.playClick();
          this.openGameModal(game);
        }
      }
      gamepad.triggerHaptic(40, 0.25, 0.25);
    }

    if (gamepad.isJustPressed('triangle')) {
      if (this.getActiveModal() === this.searchModal) {
        this.closeModals();
      } else {
        sound.playClick();
        this.openSearchModal();
      }
      gamepad.triggerHaptic(40, 0.25, 0.25);
    }

    if (gamepad.isJustPressed('l1')) {
      this.cycleCategories(-1);
      gamepad.triggerHaptic(35, 0.2, 0.2);
    }

    if (gamepad.isJustPressed('r1')) {
      this.cycleCategories(1);
      gamepad.triggerHaptic(35, 0.2, 0.2);
    }

    if (gamepad.isJustPressed('start')) {
      this.toggleAudio();
      gamepad.triggerHaptic(35, 0.2, 0.2);
    }

    if (gamepad.isJustPressed('select')) {
      if (this.getActiveModal() === this.guideModal) {
        this.closeModals();
      } else {
        sound.playClick();
        this.openGuideModal();
      }
    }

    // 2. Directional Input with Initial Delay + Smooth Repeat
    const lx = gamepad.axes.leftX;
    const ly = gamepad.axes.leftY;
    let dir = null;

    if (gamepad.buttons.dpadLeft || lx < -0.5) dir = 'left';
    else if (gamepad.buttons.dpadRight || lx > 0.5) dir = 'right';
    else if (gamepad.buttons.dpadUp || ly < -0.5) dir = 'up';
    else if (gamepad.buttons.dpadDown || ly > 0.5) dir = 'down';

    if (!dir) {
      this.lastDirVector = null;
      this.nextDirRepeatAt = 0;
      return;
    }

    if (dir !== this.lastDirVector) {
      this.lastDirVector = dir;
      this.nextDirRepeatAt = timestamp + 270;
      this.handleDirection(dir);
      gamepad.triggerHaptic(28, 0.18, 0.18);
    } else if (timestamp >= this.nextDirRepeatAt) {
      this.nextDirRepeatAt = timestamp + 115;
      this.handleDirection(dir);
      gamepad.triggerHaptic(20, 0.14, 0.14);
    }
  }

  getActiveModal() {
    if (this.searchModal?.classList.contains('active')) return this.searchModal;
    if (this.gameModal?.classList.contains('active')) return this.gameModal;
    if (this.guideModal?.classList.contains('active')) return this.guideModal;
    return null;
  }

  getModalFocusables(modal) {
    if (!modal) return [];
    return Array.from(modal.querySelectorAll('button, a.cta-play, input')).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && !el.disabled;
    });
  }

  clearFocusClasses() {
    document.querySelectorAll('.gp-focused').forEach((el) => el.classList.remove('gp-focused'));
  }

  updateZoneUI() {
    this.clearFocusClasses();
    if (this.consoleMain) {
      this.consoleMain.classList.toggle('zone-rail', this.navZone === 'rail');
    }

    if (this.navZone === 'actions') {
      const actionBtns = [this.btnPlaySelected, this.btnInfoSelected].filter(Boolean);
      const target = actionBtns[this.actionIndex % actionBtns.length];
      target?.classList.add('gp-focused');
    } else if (this.navZone === 'modal') {
      const modal = this.getActiveModal();
      const items = this.getModalFocusables(modal);
      if (items.length > 0) {
        const idx = ((this.modalFocusIndex % items.length) + items.length) % items.length;
        this.modalFocusIndex = idx;
        items[idx].classList.add('gp-focused');
      }
    }
  }

  handleDirection(dir) {
    const activeModal = this.getActiveModal();
    if (activeModal) {
      this.navZone = 'modal';
      const items = this.getModalFocusables(activeModal);
      if (items.length === 0) return;
      const delta = (dir === 'right' || dir === 'down') ? 1 : -1;
      this.modalFocusIndex = (this.modalFocusIndex + delta + items.length) % items.length;
      sound.playNavTick();
      this.updateZoneUI();
      return;
    }

    if (this.navZone === 'rail') {
      if (dir === 'left' || dir === 'right') {
        if (this.filteredGames.length > 1) {
          const delta = dir === 'right' ? 1 : -1;
          this.selectGame((this.selectedIndex + delta + this.filteredGames.length) % this.filteredGames.length);
        }
      } else if (dir === 'down') {
        this.navZone = 'actions';
        this.actionIndex = 0;
        sound.playNavTick();
        this.updateZoneUI();
      }
      return;
    }

    if (this.navZone === 'actions') {
      if (dir === 'up') {
        this.navZone = 'rail';
        sound.playNavTick();
        this.updateZoneUI();
      } else if (dir === 'left' || dir === 'right') {
        this.actionIndex = this.actionIndex === 0 ? 1 : 0;
        sound.playNavTick();
        this.updateZoneUI();
      }
    }
  }

  handleConfirm() {
    const activeModal = this.getActiveModal();
    if (activeModal) {
      const items = this.getModalFocusables(activeModal);
      const target = items[this.modalFocusIndex] || items[0];
      if (target) {
        if (target.tagName === 'INPUT') {
          target.focus();
        } else {
          target.click();
        }
      }
      return;
    }

    if (this.navZone === 'actions') {
      if (this.actionIndex === 0) {
        this.launchSelectedGame();
      } else {
        const game = this.filteredGames[this.selectedIndex];
        if (game) {
          sound.playClick();
          this.openGameModal(game);
        }
      }
      return;
    }

    // In PS5 rail zone: pressing ✕ immediately launches the selected game!
    this.launchSelectedGame();
  }

  handleBack() {
    const activeModal = this.getActiveModal();
    if (activeModal) {
      sound.playBack();
      this.closeModals();
      return;
    }

    if (this.navZone === 'actions') {
      this.navZone = 'rail';
      sound.playBack();
      this.updateZoneUI();
      return;
    }

    if (this.searchQuery || this.activeCategory !== 'All') {
      sound.playBack();
      this.activeCategory = 'All';
      this.searchQuery = '';
      if (this.searchInput) this.searchInput.value = '';
      this.renderCategories();
      this.applyFilters();
    }
  }

  cycleCategories(direction) {
    const tabs = Array.from(document.querySelectorAll('.category-tab'));
    if (tabs.length <= 1) return;
    const currentIdx = tabs.findIndex((t) => t.classList.contains('active'));
    const nextIdx = (currentIdx + direction + tabs.length) % tabs.length;
    tabs[nextIdx].click();
  }

  renderCategories() {
    if (!this.categoryTabs) return;
    const categories = ['All', ...new Set(this.games.map((g) => g.category).filter(Boolean))];

    this.categoryTabs.innerHTML = categories
      .map(
        (cat) => `
          <button class="category-tab ${cat === this.activeCategory ? 'active' : ''}" data-cat="${cat}" type="button">
            ${cat === 'All' ? 'All Games' : cat}
          </button>
        `
      )
      .join('');

    this.categoryTabs.querySelectorAll('.category-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playNavTick();
        this.activeCategory = btn.getAttribute('data-cat') || 'All';
        this.categoryTabs.querySelectorAll('.category-tab').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.applyFilters();
      });
    });
  }

  applyFilters() {
    this.filteredGames = this.games.filter((game) => {
      const matchCat = this.activeCategory === 'All' || game.category === this.activeCategory;
      if (!matchCat) return false;
      if (!this.searchQuery) return true;

      const haystack = [
        game.title,
        game.description,
        game.category,
        ...(game.mathConcepts || []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(this.searchQuery);
    });

    if (this.selectedIndex >= this.filteredGames.length) {
      this.selectedIndex = 0;
    }

    this.renderRail();
    this.renderShowcase();
    this.updateZoneUI();
  }

  renderRail() {
    if (!this.rail) return;

    const filterLabel = this.searchQuery
      ? `FILTER: "${this.searchQuery.toUpperCase()}"`
      : this.activeCategory === 'All'
      ? 'ALL GAMES • READY TO PLAY'
      : `${this.activeCategory.toUpperCase()}`;

    if (this.railStatusText) this.railStatusText.textContent = filterLabel;
    if (this.statsCounter) {
      this.statsCounter.textContent = `${this.filteredGames.length} of ${this.games.length} Games`;
    }

    if (this.filteredGames.length === 0) {
      this.rail.innerHTML = `
        <div class="rail-empty-card">
          <div>
            <div style="font-weight:800; color:#fff; margin-bottom:0.2rem;">No matching games found</div>
            <div style="font-size:0.84rem; color:var(--text-muted);">Clear your filter or add a new game to games.json.</div>
          </div>
          <button id="btn-reset-filters-inline" class="cta-secondary" type="button">Reset Filter</button>
        </div>
      `;
      document.getElementById('btn-reset-filters-inline')?.addEventListener('click', () => {
        this.activeCategory = 'All';
        this.searchQuery = '';
        if (this.searchInput) this.searchInput.value = '';
        this.renderCategories();
        this.applyFilters();
      });
      return;
    }

    this.rail.innerHTML = this.filteredGames
      .map((game, idx) => {
        const isSelected = idx === this.selectedIndex;
        const accent = game.accentColor || '#00e5ff';
        return `
          <button
            class="ps5-tile ${isSelected ? 'selected' : ''}"
            data-index="${idx}"
            role="option"
            aria-selected="${isSelected ? 'true' : 'false'}"
            style="--tile-accent: ${accent};"
            type="button"
          >
            <div class="tile-art-frame">
              ${getGameArtworkSVG(game)}
              <span class="tile-badge-pill">${game.badge || game.category}</span>
            </div>
            <div class="tile-meta">
              <span class="tile-title">${game.title}</span>
              <span class="tile-lvl">Lvl ${game.difficultyLevel || 3}</span>
            </div>
          </button>
        `;
      })
      .join('');

    this.rail.querySelectorAll('.ps5-tile').forEach((tile) => {
      tile.addEventListener('click', () => {
        const idx = parseInt(tile.getAttribute('data-index'), 10);
        if (idx === this.selectedIndex) {
          this.launchSelectedGame();
        } else {
          this.navZone = 'rail';
          this.selectGame(idx);
        }
      });
    });

    this.scrollSelectedTileIntoView();
  }

  selectGame(index) {
    if (index < 0 || index >= this.filteredGames.length) return;
    this.selectedIndex = index;
    sound.playNavTick();

    this.rail?.querySelectorAll('.ps5-tile').forEach((tile, idx) => {
      const sel = idx === index;
      tile.classList.toggle('selected', sel);
      tile.setAttribute('aria-selected', sel ? 'true' : 'false');
    });

    this.scrollSelectedTileIntoView();
    this.renderShowcase(true);
    this.updateZoneUI();
  }

  scrollSelectedTileIntoView() {
    const activeTile = this.rail?.querySelector('.ps5-tile.selected');
    if (activeTile) {
      activeTile.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  renderShowcase(animate = false) {
    const game = this.filteredGames[this.selectedIndex];

    if (!game) {
      if (this.showcaseTitle) this.showcaseTitle.textContent = 'No Game Selected';
      if (this.showcaseDesc) this.showcaseDesc.textContent = 'Clear active filters or register a game in games.json.';
      if (this.showcaseConcepts) this.showcaseConcepts.innerHTML = '';
      if (this.showcaseControls) this.showcaseControls.innerHTML = '';
      if (this.btnPlaySelected) this.btnPlaySelected.disabled = true;
      return;
    }

    if (animate && this.showcase) {
      this.showcase.classList.add('switching');
      setTimeout(() => this.showcase?.classList.remove('switching'), 120);
    }

    if (this.btnPlaySelected) {
      const playable = game.status === 'ready';
      this.btnPlaySelected.disabled = !playable;
      this.btnPlaySelected.classList.toggle('disabled', !playable);
    }

    if (this.showcaseCategory) this.showcaseCategory.textContent = game.category || 'Math';
    if (this.showcaseDiff) this.showcaseDiff.textContent = `Lvl ${game.difficultyLevel || 3} • ${game.difficulty || 'Normal'}`;
    if (this.showcaseVersion) this.showcaseVersion.textContent = `v${game.version || '1.0'}`;
    if (this.showcaseStatus) {
      this.showcaseStatus.textContent = game.status === 'ready' ? '● READY TO PLAY' : '● IN DEVELOPMENT';
    }
    if (this.showcaseTitle) this.showcaseTitle.textContent = game.title;
    if (this.showcaseDesc) {
      if (window.MathKaTeX?.renderMixed) window.MathKaTeX.renderMixed(this.showcaseDesc, game.description);
      else this.showcaseDesc.textContent = game.description;
    }
    if (this.blueprintArtBadge) this.blueprintArtBadge.textContent = game.icon || '∫';

    if (this.showcaseConcepts) {
      this.showcaseConcepts.innerHTML = '';
      (game.mathConcepts || []).forEach((c) => {
        const pill = document.createElement('span');
        pill.className = 'concept-pill';
        if (window.MathKaTeX?.renderMixed) window.MathKaTeX.renderMixed(pill, c);
        else pill.textContent = c;
        this.showcaseConcepts.appendChild(pill);
      });
    }

    if (this.showcaseControls) {
      this.showcaseControls.innerHTML = '';
      (game.controls || ['Left Stick / WASD: Move'])
        .slice(0, 6)
        .forEach((entry) => {
          const { key, desc } = formatControlEntry(entry);
          const li = document.createElement('li');
          li.className = 'blueprint-control-row';
          const keySpan = document.createElement('span');
          keySpan.className = 'ctrl-key';
          keySpan.textContent = key;
          const descSpan = document.createElement('span');
          descSpan.className = 'ctrl-desc';
          if (window.MathKaTeX?.renderMixed) window.MathKaTeX.renderMixed(descSpan, desc);
          else descSpan.textContent = desc;
          li.appendChild(keySpan);
          li.appendChild(descSpan);
          this.showcaseControls.appendChild(li);
        });
    }

    // Shift ambient glow color subtly to match game theme (pure CSS opacity/background, zero blur)
    if (this.ambientPrimary) {
      const accent = game.accentColor || '#00e5ff';
      this.ambientPrimary.style.background = `radial-gradient(circle, ${accent}26 0%, transparent 68%)`;
    }
  }

  launchSelectedGame() {
    if (this.isLaunching) return;
    const game = this.filteredGames[this.selectedIndex];
    if (!game || game.status !== 'ready') return;

    this.isLaunching = true;
    sound.playLaunch();
    gamepad.triggerHaptic(110, 0.7, 0.7);

    if (this.launchIcon) this.launchIcon.textContent = game.icon || '∫';
    if (this.launchLabel) this.launchLabel.textContent = `STARTING ${game.title.toUpperCase()}...`;
    this.launchCurtain?.classList.add('active');

    setTimeout(() => {
      window.location.href = game.path;
    }, 240);
  }

  openSearchModal() {
    this.closeModals(true);
    this.searchModal?.classList.add('active');
    this.searchModal?.setAttribute('aria-hidden', 'false');
    this.navZone = 'modal';
    this.modalFocusIndex = 1; // focus first quick tag or search cleanly
    this.updateZoneUI();
    setTimeout(() => this.searchInput?.focus(), 60);
  }

  openGameModal(game) {
    this.closeModals(true);
    const titleEl = document.getElementById('modal-game-title');
    const descEl = document.getElementById('modal-game-desc');
    const conceptsEl = document.getElementById('modal-game-concepts');
    const controlsEl = document.getElementById('modal-game-controls');
    const actionEl = document.getElementById('modal-game-action');

    if (titleEl) titleEl.textContent = game.title;
    if (descEl) {
      if (window.MathKaTeX?.renderMixed) window.MathKaTeX.renderMixed(descEl, game.description);
      else descEl.textContent = game.description;
    }
    if (conceptsEl) {
      conceptsEl.innerHTML = '';
      (game.mathConcepts || []).forEach((c) => {
        const li = document.createElement('li');
        if (window.MathKaTeX?.renderMixed) window.MathKaTeX.renderMixed(li, c);
        else li.textContent = c;
        conceptsEl.appendChild(li);
      });
    }
    if (controlsEl) {
      controlsEl.innerHTML = '';
      (game.controls || ['Standard Gamepad / Keyboard']).forEach((c) => {
        const li = document.createElement('li');
        if (window.MathKaTeX?.renderMixed) window.MathKaTeX.renderMixed(li, c);
        else li.textContent = c;
        controlsEl.appendChild(li);
      });
    }
    if (actionEl) {
      actionEl.innerHTML = `
        <button id="btn-modal-launch" class="cta-play" type="button">
          <span class="gp-dot gp-cross">✕</span>
          <span>Launch ${game.title}</span>
        </button>
        <button id="btn-modal-back" class="cta-secondary" type="button">
          <span class="gp-dot gp-cir">◯</span>
          <span>Back</span>
        </button>
      `;
      document.getElementById('btn-modal-launch')?.addEventListener('click', () => this.launchSelectedGame());
      document.getElementById('btn-modal-back')?.addEventListener('click', () => this.closeModals());
    }

    this.gameModal?.classList.add('active');
    this.gameModal?.setAttribute('aria-hidden', 'false');
    this.navZone = 'modal';
    this.modalFocusIndex = 1; // Launch button
    this.updateZoneUI();
  }

  openGuideModal() {
    this.closeModals(true);
    this.guideModal?.classList.add('active');
    this.guideModal?.setAttribute('aria-hidden', 'false');
    this.navZone = 'modal';
    this.modalFocusIndex = 1;
    this.updateZoneUI();
  }

  closeModals(silent = false) {
    [this.searchModal, this.gameModal, this.guideModal].forEach((m) => {
      m?.classList.remove('active');
      m?.setAttribute('aria-hidden', 'true');
    });
    if (!silent) {
      this.navZone = 'rail';
      this.updateZoneUI();
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new ArcadeConsoleHub();
});
