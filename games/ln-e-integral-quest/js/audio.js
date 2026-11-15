/**
 * Zero-Asset Mario-Inspired Web Audio Synthesizer
 */

window.QuestAudio = {
  ctx: null,
  muted: false,

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        try {
          this.ctx = new AC();
        } catch (e) {}
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  },

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  },

  _ok() {
    return !this.muted && this.ctx && this.ctx.state === 'running';
  },

  tone(f1, f2, dur, type = 'sine', vol = 0.1, delay = 0) {
    if (!this._ok()) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(30, f1), t);
    if (f2 && f2 !== f1) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, f2), t + dur);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  },

  playJump() {
    this.init();
    this.tone(240, 560, 0.14, 'square', 0.07);
  },

  playWingFlap() {
    this.init();
    this.tone(360, 540, 0.09, 'sine', 0.07);
  },

  playCoin() {
    this.init();
    this.tone(987.77, 987.77, 0.07, 'square', 0.06, 0);
    this.tone(1318.51, 1318.51, 0.19, 'square', 0.06, 0.065);
  },

  playBlockBump() {
    this.init();
    this.tone(420, 840, 0.11, 'triangle', 0.12, 0);
    this.tone(840, 1080, 0.14, 'sine', 0.09, 0.06);
  },

  playSpring() {
    this.init();
    this.tone(220, 880, 0.22, 'triangle', 0.12);
  },

  playStomp() {
    this.init();
    this.tone(320, 110, 0.11, 'triangle', 0.12, 0);
    this.tone(440, 620, 0.1, 'sine', 0.08, 0.05);
  },

  playPuzzleSolved() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      this.tone(n, n, 0.16, 'triangle', 0.11, i * 0.07);
    });
  },

  playWrong() {
    this.init();
    this.tone(220, 165, 0.18, 'triangle', 0.09);
  },

  playHurt() {
    this.init();
    this.tone(240, 80, 0.22, 'sawtooth', 0.1);
  },

  playVictory() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    const delays = [0, 0.09, 0.18, 0.27, 0.42, 0.54];
    notes.forEach((n, i) => {
      this.tone(n, n, i === notes.length - 1 ? 0.36 : 0.14, 'triangle', 0.12, delays[i]);
    });
  },

  playUiTick() {
    this.init();
    this.tone(620, 820, 0.045, 'sine', 0.06);
  }
};
