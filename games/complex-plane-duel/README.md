# Complex Plane Duel: Argand Orbit Survivor [PlayStation Edition]

An autonomous, zero-bloat mathematical arcade combat game built with pure web standards (Vanilla ES Modules, HTML5 Canvas, Web Audio API, Gamepad API with Dual-Rumble Haptics).

## Mathematical Foundation: Complex Analysis (Moroccan 2BAC PC/SM)
In **Complex Plane Duel**, you pilot a complex core entity $z = x + iy$ in the Argand-Cauchy plane $\mathbb{C}$. Your mission is to survive incoming mathematical singularities (Cauchy poles, Mandelbrot seeds, and Moebius transforms) by unleashing complex geometric transformations:

### 1. Complex Affix & Modulus
- **Affix representation**: $z = a + bi$ where $\text{Re}(z) = a$ and $\text{Im}(z) = b$.
- **Modulus (Norm)**: $|z| = \sqrt{a^2 + b^2}$, represented on the arena by concentric concentric coordinate circles ($r = 1, 2, 3, 4, 5$).
- **Argument (Phase Angle)**: $\theta = \arg(z) = \text{atan2}(b, a)$, determining your angular orientation in polar coordinates:
  $$z = r e^{i\theta} = r (\cos\theta + i\sin\theta)$$

### 2. Euler Rotation ($z \mapsto z \cdot e^{i\theta}$)
- Multiplying any complex number $z$ by $e^{i\phi}$ rotates it around the origin $O$ by angle $\phi$ while preserving its modulus:
  $$|z \cdot e^{i\phi}| = |z| \cdot |e^{i\phi}| = |z| \cdot 1 = |z|$$
- In combat, pressing `✕ (Cross)` triggers an instantaneous phase shift of $+60^\circ$ ($\frac{\pi}{3}$ radians), warping your craft along its orbital radius and dodging singularities with invulnerability!

### 3. Roots of Unity Barrier ($z^n = 1$)
- The $n$-th roots of unity are given by:
  $$z_k = e^{i \frac{2k\pi}{n}} \quad \text{for } k \in \{0, 1, \dots, n-1\}$$
- When `◯ (Circle)` is pressed, your core projects $n$ conjugate shield satellites that form a rotating regular polygon:
  - $n=3$: Equilateral Trigon
  - $n=4$: Gaussian Square
  - $n=6$: Hexagonal Lattice
  - $n=8$: Octagonal Fortress
- The barrier deflects and annihilates any singularity entering the rotating polygon.

### 4. Complex Conjugation ($z \mapsto \bar{z}$)
- Conjugating reflects the craft across the Real axis ($\text{Re}$):
  $$\overline{a + bi} = a - bi$$
- Use `L2` / `KeyC` to instantly invert your trajectory.

### 5. Homothety Metric Shockwave ($z \mapsto k \cdot z$)
- Pressing `△ (Triangle)` expands the complex metric, dilating distance by $k = 1.4$ and shattering nearby singularities.

---

## PlayStation DualSense / DualShock Controls
- **✕ (Cross)**: Euler Rotation Dash ($z \cdot e^{i \frac{\pi}{3}}$)
- **▢ (Square)**: Orthogonal Affix Laser Beams ($\text{Re} / \text{Im}$)
- **◯ (Circle)**: Roots of Unity Barrier Shield ($z^n = 1$)
- **△ (Triangle)**: Homothety Metric Shockwave ($z \mapsto k z$)
- **L1 / R1**: Cycle $n$-th Roots of Unity ($n \in \{3, 4, 6, 8\}$)
- **L2**: Complex Conjugate Flip ($z \mapsto \bar{z}$)
- **R2**: Rapid-Fire Affix Laser
- **Left Stick**: 360° Argand Cartesian Flight
- **Right Stick**: 360° Phase Angle Targeting ($\arg(z)$)
- **Haptic Rumble**: Dual-rumble feedback on rotation, laser, shield deflection, and victory.
