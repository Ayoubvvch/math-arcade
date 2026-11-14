/**
 * Complex Plane Duel: Argand Orbit Survivor
 * Formal Complex Number Mathematics Engine (Moroccan 2BAC PC/SM Standard)
 */

export class Complex {
  constructor(re = 0, im = 0) {
    this.re = Number(re) || 0;
    this.im = Number(im) || 0;
  }

  static fromPolar(r, theta) {
    return new Complex(r * Math.cos(theta), r * Math.sin(theta));
  }

  add(other) {
    return new Complex(this.re + other.re, this.im + other.im);
  }

  sub(other) {
    return new Complex(this.re - other.re, this.im - other.im);
  }

  mul(other) {
    // (a + bi)(c + di) = (ac - bd) + (ad + bc)i
    return new Complex(
      this.re * other.re - this.im * other.im,
      this.re * other.im + this.im * other.re
    );
  }

  scale(k) {
    return new Complex(this.re * k, this.im * k);
  }

  modulus() {
    return Math.hypot(this.re, this.im);
  }

  modulusSquared() {
    return this.re * this.re + this.im * this.im;
  }

  arg() {
    // theta in (-pi, pi]
    return Math.atan2(this.im, this.re);
  }

  conjugate() {
    // z_bar = a - bi
    return new Complex(this.re, -this.im);
  }

  rotate(radians) {
    // z * e^(i * theta)
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return new Complex(
      this.re * cos - this.im * sin,
      this.re * sin + this.im * cos
    );
  }

  static getRootsOfUnity(n, radius = 1, phase = 0) {
    // z_k = R * e^(i * (phase + 2k*pi / n)) for k = 0 ... n-1
    const roots = [];
    for (let k = 0; k < n; k++) {
      const theta = phase + (2 * Math.PI * k) / n;
      roots.push({
        k,
        theta,
        z: Complex.fromPolar(radius, theta)
      });
    }
    return roots;
  }

  formatCartesian(digits = 1) {
    const reStr = this.re.toFixed(digits);
    const absIm = Math.abs(this.im).toFixed(digits);
    if (Math.abs(this.im) < 0.05) return `${reStr}`;
    if (Math.abs(this.re) < 0.05) return `${this.im >= 0 ? '' : '-'}${absIm}i`;
    const sign = this.im >= 0 ? '+' : '-';
    return `${reStr} ${sign} ${absIm}i`;
  }

  formatPolar(digits = 1) {
    const r = this.modulus().toFixed(digits);
    const deg = Math.round((this.arg() * 180) / Math.PI);
    return `|z|=${r}, θ=${deg}°`;
  }
}
