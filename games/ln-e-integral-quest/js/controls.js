/**
 * Simple Mario-Style Input Manager:
 * Keyboard + Touch D-Pad + PlayStation DualSense / Xbox Controller
 */

window.QuestInput = {
  keys: {},
  touch: { left: false, right: false, up: false, down: false, jump: false },
  prevJumpPressed: false,

  gamepadSlot: -1,
  gamepadConnected: false,
  prevButtons: {},
  prevHat: { up: false, down: false, left: false, right: false },
  inputLockUntil: 0,
  navCooldownAt: 0
};

window.lockQuestInput = function(ms = 200) {
  window.QuestInput.inputLockUntil = performance.now() + ms;
};

function findPad() {
  if (!navigator.getGamepads) return null;
  const pads = navigator.getGamepads();
  if (window.QuestInput.gamepadSlot >= 0) {
    const p = pads[window.QuestInput.gamepadSlot];
    if (p && p.connected) return p;
  }
  for (let i = 0; i < pads.length; i++) {
    if (pads[i] && pads[i].connected) {
      window.QuestInput.gamepadSlot = i;
      return pads[i];
    }
  }
  window.QuestInput.gamepadSlot = -1;
  return null;
}

function updatePadUI(gp) {
  const pill = document.getElementById('gpStatusPill');
  const lbl = document.getElementById('gpStatusLabel');
  if (!pill || !lbl) return;
  if (gp) {
    if (!window.QuestInput.gamepadConnected) {
      window.QuestInput.gamepadConnected = true;
      pill.classList.remove('disconnected');
      const id = String(gp.id || '').toLowerCase();
      lbl.textContent = (id.includes('dualsense') || id.includes('054c') || id.includes('dualshock') || id.includes('playstation'))
        ? 'PS5 متصل'
        : 'يد التحكم متصلة';
    }
  } else if (window.QuestInput.gamepadConnected) {
    window.QuestInput.gamepadConnected = false;
    pill.classList.add('disconnected');
    lbl.textContent = 'كيبورد';
  }
}

window.triggerQuestHaptic = async function(duration = 60, weak = 0.35, strong = 0.5) {
  const gp = findPad();
  if (gp && gp.vibrationActuator && typeof gp.vibrationActuator.playEffect === 'function') {
    try {
      await gp.vibrationActuator.playEffect('dual-rumble', {
        startDelay: 0, duration, weakMagnitude: weak, strongMagnitude: strong
      });
    } catch (e) {}
  }
};

window.initQuestControls = function(getGame) {
  window.addEventListener('keydown', (e) => {
    const g = getGame();
    if (!g) return;
    const isRepeat = !!window.QuestInput.keys[e.code];
    window.QuestInput.keys[e.code] = true;

    if (performance.now() < window.QuestInput.inputLockUntil) return;

    if (e.code === 'KeyM' && !isRepeat) {
      document.getElementById('btnToggleAudio')?.click();
      return;
    }

    if (g.mode === 'start') {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        window.selectStartWorld(Math.min(4, g.selectedWorldId + 1));
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        window.selectStartWorld(Math.max(1, g.selectedWorldId - 1));
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        window.startWorldFromModal(g.selectedWorldId);
      } else if (e.code === 'KeyH') {
        e.preventDefault();
        window.openNotebookModal();
      }
      return;
    }

    if (g.mode === 'lesson') {
      if (e.code === 'Enter' || e.code === 'Space' || e.code === 'Escape') {
        e.preventDefault();
        window.closeLessonModal();
      }
      return;
    }

    if (g.mode === 'gate') {
      if (e.code === 'Digit1') { e.preventDefault(); window.submitGateAnswer(0); }
      else if (e.code === 'Digit2') { e.preventDefault(); window.submitGateAnswer(1); }
      else if (e.code === 'Digit3') { e.preventDefault(); window.submitGateAnswer(2); }
      else if (e.code === 'Digit4') { e.preventDefault(); window.submitGateAnswer(3); }
      else if (e.code === 'KeyH') { e.preventDefault(); window.toggleGateHint(); }
      else if (e.code === 'Escape') { e.preventDefault(); window.closeGateModal(); }
      return;
    }

    if (g.mode === 'notebook') {
      if (e.code === 'Escape' || e.code === 'KeyH') {
        e.preventDefault();
        window.closeNotebookModal();
      }
      return;
    }

    if (g.mode === 'pause') {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        window.resumeFromPause();
      }
      return;
    }

    if (g.mode === 'victory') {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        window.advanceAfterVictory();
      }
      return;
    }

    // Play Mode single-press triggers
    if (g.mode === 'play') {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      if ((e.code === 'Escape' || e.code === 'KeyP') && !isRepeat) {
        e.preventDefault();
        window.openPauseModal();
      } else if (e.code === 'KeyE' && !isRepeat) {
        e.preventDefault();
        window.triggerHeroInteract();
      } else if (e.code === 'KeyH' && !isRepeat) {
        e.preventDefault();
        window.openNotebookModal();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    window.QuestInput.keys[e.code] = false;
  });

  window.addEventListener('blur', () => {
    window.QuestInput.keys = {};
    window.QuestInput.touch = { left: false, right: false, up: false, down: false, jump: false };
  });

  // Bind touch / pointer controls cleanly
  const bindHold = (elId, key) => {
    const el = document.getElementById(elId);
    if (!el) return;
    const on = (e) => {
      e.preventDefault();
      window.QuestAudio?.init?.();
      window.QuestInput.touch[key] = true;
      el.classList.add('active');
    };
    const off = (e) => {
      if (e) e.preventDefault();
      window.QuestInput.touch[key] = false;
      el.classList.remove('active');
    };
    el.addEventListener('pointerdown', on);
    el.addEventListener('pointerup', off);
    el.addEventListener('pointercancel', off);
    el.addEventListener('pointerleave', off);
  };

  bindHold('btnTouchLeft', 'left');
  bindHold('btnTouchRight', 'right');
  bindHold('btnTouchUp', 'up');
  bindHold('btnTouchDown', 'down');
  bindHold('btnTouchJump', 'jump');

  const interactBtn = document.getElementById('btnTouchInteract');
  if (interactBtn) {
    interactBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      window.QuestAudio?.init?.();
      window.triggerHeroInteract();
    });
  }
};

window.pollQuestInputs = function(g) {
  const gp = findPad();
  updatePadUI(gp);

  const k = window.QuestInput.keys;
  const t = window.QuestInput.touch;

  let moveX = 0;
  let moveY = 0;
  if (k.ArrowLeft || k.KeyA || t.left) moveX -= 1;
  if (k.ArrowRight || k.KeyD || t.right) moveX += 1;
  if (k.ArrowUp || k.KeyW || t.up) moveY -= 1;
  if (k.ArrowDown || k.KeyS || t.down) moveY += 1;

  let jumpHeld = !!(k.Space || k.KeyW || k.ArrowUp || t.jump);
  let sprintHeld = !!(k.ShiftLeft || k.ShiftRight);

  const now = performance.now();
  const locked = now < window.QuestInput.inputLockUntil;

  if (gp) {
    const lx = Math.abs(gp.axes[0] || 0) > 0.2 ? gp.axes[0] : 0;
    const ly = Math.abs(gp.axes[1] || 0) > 0.2 ? gp.axes[1] : 0;
    const btnDown = (i) => !!(gp.buttons[i] && (gp.buttons[i].pressed || gp.buttons[i].value > 0.55));
    const edge = (i) => {
      const cur = btnDown(i);
      const prev = !!window.QuestInput.prevButtons[i];
      window.QuestInput.prevButtons[i] = cur;
      return !locked && cur && !prev;
    };

    const eCross = edge(0);
    const eCircle = edge(1);
    const eSquare = edge(2);
    const eTri = edge(3);
    const eR1 = edge(5);
    const eOptions = edge(9);
    const eUp = edge(12);
    const eDown = edge(13);
    const eLeft = edge(14);
    const eRight = edge(15);

    if (Math.abs(lx) > 0.2) moveX = lx;
    else {
      if (btnDown(14)) moveX = -1;
      if (btnDown(15)) moveX = 1;
    }

    if (Math.abs(ly) > 0.2) moveY = ly;
    else {
      if (btnDown(12)) moveY = -1;
      if (btnDown(13)) moveY = 1;
    }

    if (btnDown(0)) jumpHeld = true;
    if (btnDown(7) || btnDown(1)) sprintHeld = true;

    if (g.mode === 'start') {
      if (eLeft) window.selectStartWorld(Math.min(4, g.selectedWorldId + 1));
      else if (eRight) window.selectStartWorld(Math.max(1, g.selectedWorldId - 1));
      else if (eCross) window.startWorldFromModal(g.selectedWorldId);
      else if (eTri) window.openNotebookModal();
    } else if (g.mode === 'lesson') {
      if (eCross || eCircle) window.closeLessonModal();
    } else if (g.mode === 'gate') {
      if (eCross) window.submitGateAnswer(0);
      else if (eCircle) window.submitGateAnswer(1);
      else if (eSquare) window.submitGateAnswer(2);
      else if (eTri) window.submitGateAnswer(3);
      else if (eR1) window.toggleGateHint();
      else if (eOptions) window.closeGateModal();
    } else if (g.mode === 'notebook') {
      if (eCircle || eTri || eOptions) window.closeNotebookModal();
    } else if (g.mode === 'pause') {
      if (eCircle || eOptions) window.resumeFromPause();
      else if (eCross) document.getElementById('btnPauseResume')?.click();
    } else if (g.mode === 'victory') {
      if (eCross) window.advanceAfterVictory();
      else if (eCircle) document.querySelector('#victoryModal a')?.click();
    } else if (g.mode === 'play') {
      if (eSquare) window.triggerHeroInteract();
      if (eTri) window.openNotebookModal();
      if (eOptions) window.openPauseModal();
      if (eUp || eDown) { /* handled via moveY */ }
    }
  }

  const jumpJustPressed = !locked && jumpHeld && !window.QuestInput.prevJumpPressed;
  window.QuestInput.prevJumpPressed = jumpHeld;

  return {
    moveX: Math.max(-1, Math.min(1, moveX)),
    moveY: Math.max(-1, Math.min(1, moveY)),
    jumpHeld,
    jumpJustPressed,
    sprintHeld
  };
};
