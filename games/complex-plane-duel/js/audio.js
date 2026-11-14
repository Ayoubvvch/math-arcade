/**
 * Complex Plane Duel: Argand Orbit Survivor
 * Web Audio Synthesizer with Celestial Harmonics & Dual-Rumble Haptics
 */

class ComplexAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.lastTimes = { beam: 0, hit: 0 };
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    } catch {
      // Audio unsupported
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  triggerRumble(weak = 0.3, strong = 0.5, duration = 120) {
    if (!navigator.getGamepads) return;
    try {
      const gamepads = navigator.getGamepads();
      for (const gp of gamepads) {
        if (gp && gp.vibrationActuator && typeof gp.vibrationActuator.playEffect === 'function') {
          gp.vibrationActuator.playEffect('dual-rumble', {
            startDelay: 0,
            duration,
            weakMagnitude: Math.min(1.0, weak),
            strongMagnitude: Math.min(1.0, strong)
          }).catch(() => {});
        }
      }
    } catch {
      // Haptics unavailable
    }
  }

  play(type, panX = 0, pitchMod = 1.0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const now = this.ctx.currentTime;
    let dest = this.ctx.destination;

    if (this.ctx.createStereoPanner) {
      try {
        const panner = this.ctx.createStereoPanner();
        panner.pan.value = Math.max(-1, Math.min(1, panX));
        panner.connect(dest);
        dest = panner;
      } catch {
        // Fallback
      }
    }

    try {
      if (type === 'euler_rotate') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440 * pitchMod, now);
        osc.frequency.exponentialRampToValueAtTime(1320 * pitchMod, now + 0.16);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.19);
      } else if (type === 'roots_barrier') {
        // Polyphonic celestial chime
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + idx * 0.04;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq * pitchMod, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.36);
        });
      } else if (type === 'conjugate_flip') {
        // Inverted two-tone frequency shift
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'affix_beam') {
        if (now - this.lastTimes.beam < 0.07) return;
        this.lastTimes.beam = now;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(980 * pitchMod, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.09);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.11);
      } else if (type === 'homothety_blast') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.56);
      } else if (type === 'pole_crush') {
        if (now - this.lastTimes.hit < 0.04) return;
        this.lastTimes.hit = now;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(340 * pitchMod, now);
        osc.frequency.exponentialRampToValueAtTime(680 * pitchMod, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.19);
      } else if (type === 'victory') {
        const chord = [392.00, 523.25, 659.25, 783.99, 1046.50];
        chord.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + idx * 0.08;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.42);
        });
      } else if (type === 'gameover') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.6);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.66);
      }
    } catch {
      // Audio safety catch
    }
  }
}

export const audio = new ComplexAudioEngine();
