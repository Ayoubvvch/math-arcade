/**
 * Complex Plane Duel: Argand Orbit Survivor
 * Configuration, Coordinates & PlayStation Controls
 */

export const CANVAS_SIZE = {
  width: 540,
  height: 960
};

export const ARGAND_ARENA = {
  x: 35,
  y: 180,
  width: 470,
  height: 470,
  reMin: -6,
  reMax: 6,
  imMin: -6,
  imMax: 6
};

export const PLAYSTATION_MAP = {
  CROSS: 0,      // ✕: Euler Rotation Dash (z * e^(i*pi/3))
  CIRCLE: 1,     // ◯: Roots of Unity Barrier Shield (z^n = 1)
  SQUARE: 2,     // ▢: Orthogonal Affix Beams (Re / Im)
  TRIANGLE: 3,   // △: Homothety Metric Shockwave (z -> k*z)
  L1: 4,         // Cycle Roots Order n down
  R1: 5,         // Cycle Roots Order n up
  L2: 6,         // Complex Conjugate Flip (z -> z_bar)
  R2: 7,         // Rapid Fire Affix Laser
  SELECT: 8,     // Auto Pilot Mode
  START: 9,      // Pause / Resume
  L3: 10,
  R3: 11,
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15
};

export const ROOTS_OF_UNITY_PRESETS = [
  { n: 3, name: '3rd Roots (Equilateral Trigon)', color: '#00f0ff', glyph: '△' },
  { n: 4, name: '4th Roots (Gaussian Square)', color: '#b537f2', glyph: '▢' },
  { n: 6, name: '6th Roots (Hexagonal Lattice)', color: '#00ff88', glyph: '⬡' },
  { n: 8, name: '8th Roots (Octagonal Fortress)', color: '#ffd700', glyph: '⬢' }
];

export const PLAYER_CONFIG = {
  maxHp: 100,
  baseSpeed: 5.0,
  dashSpeed: 12.0,
  dashDuration: 0.2,
  invulnerableDuration: 0.4,
  radius: 18,
  color: '#00f0ff',
  shieldRadius: 52,
  barrierDuration: 4.5,
  barrierCooldown: 7.0,
  beamCooldown: 0.16,
  homothetyEnergyMax: 100
};

export function toScreenX(re) {
  return ARGAND_ARENA.x + ((re - ARGAND_ARENA.reMin) / (ARGAND_ARENA.reMax - ARGAND_ARENA.reMin)) * ARGAND_ARENA.width;
}

export function toScreenY(im) {
  // Imaginary axis points upward in mathematics, downward in screen pixels
  return ARGAND_ARENA.y + ((ARGAND_ARENA.imMax - im) / (ARGAND_ARENA.imMax - ARGAND_ARENA.imMin)) * ARGAND_ARENA.height;
}

export function toComplexRe(sx) {
  return ARGAND_ARENA.reMin + ((sx - ARGAND_ARENA.x) / ARGAND_ARENA.width) * (ARGAND_ARENA.reMax - ARGAND_ARENA.reMin);
}

export function toComplexIm(sy) {
  return ARGAND_ARENA.imMax - ((sy - ARGAND_ARENA.y) / ARGAND_ARENA.height) * (ARGAND_ARENA.imMax - ARGAND_ARENA.imMin);
}
