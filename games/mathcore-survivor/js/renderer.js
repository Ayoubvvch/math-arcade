/**
 * MathCore: Sandbox Survivor - Lightweight 2D Neon Vector Renderer (Zero shadowBlur)
 */

window.drawGame = function(ctx, canvas) {
    const gs = window.GameState;
    const viewW = gs.viewW || window.innerWidth;
    const viewH = gs.viewH || window.innerHeight;
    const dpr = canvas._dpr || 1;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 1. Deep OLED Cyber Background
    ctx.fillStyle = '#060814';
    ctx.fillRect(0, 0, viewW, viewH);

    // Camera Follow & Screen Shake
    const shakeX = gs.screenShake > 0 ? (Math.random() - 0.5) * gs.screenShake : 0;
    const shakeY = gs.screenShake > 0 ? (Math.random() - 0.5) * gs.screenShake : 0;
    const camOffsetX = viewW / 2 - gs.camera.x + shakeX;
    const camOffsetY = viewH / 2 - gs.camera.y + shakeY;
    ctx.translate(camOffsetX, camOffsetY);

    const minX = gs.camera.x - viewW / 2 - 80;
    const maxX = gs.camera.x + viewW / 2 + 80;
    const minY = gs.camera.y - viewH / 2 - 80;
    const maxY = gs.camera.y + viewH / 2 + 80;

    // 2. Viewport-Culled Parallax Cyber Stars (fast fillRect)
    for (let i = 0; i < gs.stars.length; i++) {
        const st = gs.stars[i];
        if (st.x < minX || st.x > maxX || st.y < minY || st.y > maxY) continue;
        ctx.fillStyle = st.color;
        ctx.globalAlpha = st.alpha;
        const s = st.size * 1.6;
        ctx.fillRect(st.x, st.y, s, s);
    }
    ctx.globalAlpha = 1;

    // 3. Mathematical Coordinate Grid (Cartesian Plane)
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.065)';
    const startX = Math.max(0, Math.floor((gs.camera.x - viewW / 2) / window.GRID_SIZE) * window.GRID_SIZE);
    const endX = Math.min(window.WORLD_SIZE, gs.camera.x + viewW / 2 + window.GRID_SIZE);
    const startY = Math.max(0, Math.floor((gs.camera.y - viewH / 2) / window.GRID_SIZE) * window.GRID_SIZE);
    const endY = Math.min(window.WORLD_SIZE, gs.camera.y + viewH / 2 + window.GRID_SIZE);

    ctx.beginPath();
    for (let x = startX; x <= endX; x += window.GRID_SIZE) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += window.GRID_SIZE) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
    }
    ctx.stroke();

    // World Boundary
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.48)';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, window.WORLD_SIZE, window.WORLD_SIZE);

    // 4. Defense Turret Blueprint Placement Reticle
    const buildCell = window.getTargetBuildCell();
    const activeBlueprint = window.BUILDINGS[gs.selectedBuildIndex];
    if (activeBlueprint) {
        ctx.save();
        ctx.strokeStyle = activeBlueprint.color;
        ctx.fillStyle = `${activeBlueprint.color}18`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.fillRect(buildCell.gx - window.GRID_SIZE / 2 + 3, buildCell.gy - window.GRID_SIZE / 2 + 3, window.GRID_SIZE - 6, window.GRID_SIZE - 6);
        ctx.strokeRect(buildCell.gx - window.GRID_SIZE / 2 + 3, buildCell.gy - window.GRID_SIZE / 2 + 3, window.GRID_SIZE - 6, window.GRID_SIZE - 6);
        ctx.restore();
    }

    // 5. Central Base Core (النواة الأم + هالة الشفاء الهادئة)
    const base = gs.baseCore;
    if (base.x >= minX - 100 && base.x <= maxX + 100 && base.y >= minY - 100 && base.y <= maxY + 100) {
        ctx.save();
        ctx.translate(base.x, base.y);

        // Healing zone boundary ring
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.14)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 110, 0, Math.PI * 2);
        ctx.stroke();

        // Outer subtle core aura
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(0, 0, base.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.rotate(gs.time * 0.012);
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.45)';
        ctx.lineWidth = 2;
        ctx.strokeRect(-base.radius * 0.7, -base.radius * 0.7, base.radius * 1.4, base.radius * 1.4);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#00f3ff';
        ctx.font = 'bold 12px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.direction = 'rtl';
        ctx.fillText('النواة الهندسية (منطقة شفاء)', base.x, base.y - base.radius - 14);
        ctx.restore();
    }

    // 6. Built Structures (Dual-stroke glow, zero shadowBlur)
    for (let i = 0; i < gs.structures.length; i++) {
        const s = gs.structures[i];
        if (s.x < minX || s.x > maxX || s.y < minY || s.y > maxY) continue;

        ctx.save();
        ctx.translate(s.x, s.y);

        if (s.id === 'sine_healer') {
            ctx.beginPath();
            ctx.arc(0, 0, 220, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.14)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        ctx.fillStyle = '#0a1024';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-24, -24, 48, 48, 10);
        else ctx.rect(-24, -24, 48, 48);
        ctx.fill();

        // Soft outer stroke halo
        ctx.globalAlpha = 0.22;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 6;
        ctx.stroke();

        // Crisp core border
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '800 13px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.direction = 'ltr';
        ctx.fillText(s.formula, 0, 0);

        if (s.hp < s.maxHp) {
            ctx.fillStyle = 'rgba(0,0,0,0.72)';
            ctx.fillRect(-20, -32, 40, 4);
            ctx.fillStyle = s.color;
            ctx.fillRect(-20, -32, 40 * Math.max(0, s.hp / s.maxHp), 4);
        }
        ctx.restore();
    }

    // 7. Energy Sparks (Visual only — physics handled in updateGame)
    for (let i = 0; i < gs.sparkOrbs.length; i++) {
        const sp = gs.sparkOrbs[i];
        if (sp.x < minX || sp.x > maxX || sp.y < minY || sp.y > maxY) continue;
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = 0.28;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius * 2.0, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 8. Thruster & Explosion Particles (Fast fillRect)
    for (let i = 0; i < gs.particles.length; i++) {
        const pt = gs.particles[i];
        if (pt.x < minX || pt.x > maxX || pt.y < minY || pt.y > maxY) continue;
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        const sz = pt.radius * 1.9;
        ctx.fillRect(pt.x - sz * 0.5, pt.y - sz * 0.5, sz, sz);
    }
    ctx.globalAlpha = 1;

    // 9. Player Resonance Ring & Pulse
    const p = gs.player;
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, window.SandboxConfig.beamRange, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.13)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 8]);
    ctx.stroke();
    ctx.restore();

    if (p.pulseWaveAlpha > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.pulseWaveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 136, ${Math.max(0, p.pulseWaveAlpha)})`;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // 10. Kinetic Projectiles
    for (let i = 0; i < gs.projectiles.length; i++) {
        const proj = gs.projectiles[i];
        if (proj.x < minX || proj.x > maxX || proj.y < minY || proj.y > maxY) continue;
        ctx.fillStyle = proj.color;
        ctx.globalAlpha = 0.28;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 11. Draw Enemies & Identify Closest Target for Compass
    let closestEnemy = null;
    let minEnemyDist = Infinity;

    for (let i = 0; i < gs.enemies.length; i++) {
        const e = gs.enemies[i];
        const dist = Math.hypot(e.x - p.x, e.y - p.y);
        if (dist < minEnemyDist) {
            minEnemyDist = dist;
            closestEnemy = e;
        }

        if (e.x < minX || e.x > maxX || e.y < minY || e.y > maxY) continue;

        const isMatching = e.answer === p.coreX;

        ctx.save();
        ctx.translate(e.x, e.y);

        // Lock-on Ring
        if (isMatching) {
            const lockR = e.radius + 11 + Math.sin(gs.time * 0.25) * 3.5;
            ctx.beginPath();
            ctx.arc(0, 0, lockR, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.25)';
            ctx.lineWidth = 7;
            ctx.stroke();
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2.5;
            ctx.stroke();
        }

        // Polygon Body
        ctx.save();
        ctx.rotate(e.rotation);
        ctx.fillStyle = e.hitFlash > 0 ? '#ffffff' : '#0b1026';
        const strokeCol = isMatching ? '#00ff88' : e.color;

        ctx.beginPath();
        for (let s = 0; s < e.sides; s++) {
            const a = (s / e.sides) * Math.PI * 2;
            const rx = Math.cos(a) * e.radius;
            const ry = Math.sin(a) * e.radius;
            if (s === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
        }
        ctx.closePath();
        ctx.fill();

        ctx.globalAlpha = 0.24;
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = (e.isBoss ? 4 : 2.5) + 4;
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.lineWidth = e.isBoss ? 3.5 : 2.2;
        ctx.stroke();
        ctx.restore();

        // Equation Badge Above Enemy
        ctx.direction = 'ltr';
        ctx.font = e.isBoss ? '800 16px "JetBrains Mono", monospace' : '800 13px "JetBrains Mono", monospace';
        const textWidth = ctx.measureText(e.expr).width;
        const badgeW = Math.max(40, textWidth + 18);
        const badgeH = 24;
        const badgeY = -e.radius - 28;

        ctx.fillStyle = isMatching ? 'rgba(0, 255, 136, 0.95)' : 'rgba(8, 12, 28, 0.92)';
        ctx.strokeStyle = isMatching ? '#ffffff' : e.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-badgeW / 2, badgeY, badgeW, badgeH, 7);
        else ctx.rect(-badgeW / 2, badgeY, badgeW, badgeH);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isMatching ? '#04120a' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(e.expr, 0, badgeY + badgeH / 2);

        ctx.restore();
    }

    gs.closestEnemy = closestEnemy;

    // 12. Neon Lightning Beams (Dual-stroke glow)
    for (let i = 0; i < gs.lightningBeams.length; i++) {
        const b = gs.lightningBeams[i];
        const alpha = Math.max(0, b.life / b.maxLife);
        const width = alpha * 4;

        ctx.save();
        ctx.beginPath();
        for (let idx = 0; idx < b.points.length; idx++) {
            const pt = b.points[idx];
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        }

        ctx.strokeStyle = b.color;
        ctx.globalAlpha = alpha * 0.28;
        ctx.lineWidth = width * 2.5;
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = alpha;
        ctx.lineWidth = Math.max(1.2, width * 0.85);
        ctx.stroke();
        ctx.restore();
    }

    // 13. Tactical Mathematical Compass (Points to closest enemy)
    if (closestEnemy) {
        const angleToTarget = Math.atan2(closestEnemy.y - p.y, closestEnemy.x - p.x);
        const compassRadius = p.radius + 38;
        const cx = p.x + Math.cos(angleToTarget) * compassRadius;
        const cy = p.y + Math.sin(angleToTarget) * compassRadius;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angleToTarget);
        ctx.fillStyle = 'rgba(255, 184, 0, 0.28)';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffb800';
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-6, -6);
        ctx.lineTo(-2, 0);
        ctx.lineTo(-6, 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Suggested Next PlayStation Button Hint under player (dynamically sized, LTR math order!)
        const suggestedOp = window.findSuggestedPsButton(p.coreX, closestEnemy.answer);
        if (suggestedOp && p.coreX !== closestEnemy.answer) {
            const psInfo = window.PS_ICONS[suggestedOp.psKey] || window.PS_ICONS.cross;
            const hintText = `${psInfo.symbol} (${suggestedOp.label}) -> ${closestEnemy.answer}`;
            ctx.save();
            ctx.direction = 'ltr';
            ctx.font = '800 11px "JetBrains Mono", monospace';
            const hintW = Math.max(100, Math.ceil(ctx.measureText(hintText).width) + 20);
            ctx.fillStyle = 'rgba(8, 13, 28, 0.9)';
            ctx.strokeStyle = psInfo.border;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(p.x - hintW / 2, p.y + p.radius + 14, hintW, 22, 6);
            else ctx.rect(p.x - hintW / 2, p.y + p.radius + 14, hintW, 22);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = psInfo.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(hintText, p.x, p.y + p.radius + 25);
            ctx.restore();
        }
    }

    // 14. The Player Craft — Articulated Twin-Wing Interceptor Starfighter
    ctx.save();
    ctx.translate(p.x, p.y);
    if (p.invulnTimer > 0 && Math.floor(p.invulnTimer / 3) % 2 === 0) {
        ctx.globalAlpha = 0.45;
    }

    // Orbiting PlayStation Drone Pods
    const orbitAngle = gs.time * 0.025;
    const orbitR = p.radius + 16;
    const psGlyphs = [
        { symbol: '✕', color: '#00f3ff', angle: orbitAngle },
        { symbol: '◯', color: '#ff007f', angle: orbitAngle + Math.PI / 2 },
        { symbol: '▢', color: '#b537f2', angle: orbitAngle + Math.PI },
        { symbol: '△', color: '#00ff88', angle: orbitAngle + Math.PI * 1.5 }
    ];

    ctx.direction = 'ltr';
    ctx.font = '900 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < psGlyphs.length; i++) {
        const g = psGlyphs[i];
        const gx = Math.cos(g.angle) * orbitR;
        const gy = Math.sin(g.angle) * orbitR;
        ctx.fillStyle = 'rgba(9, 19, 44, 0.88)';
        ctx.beginPath();
        ctx.arc(gx, gy, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = g.color;
        ctx.fillText(g.symbol, gx, gy);
    }

    // Rotate Starfighter Chassis along aim/flight vector
    ctx.save();
    ctx.rotate(p.aimAngle);

    // Dual Plasma Afterburners
    const flameLen = 10 + Math.sin(gs.time * 0.8) * 4;
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.moveTo(-p.radius + 4, -8);
    ctx.lineTo(-p.radius - flameLen, -5);
    ctx.lineTo(-p.radius + 4, -2);
    ctx.moveTo(-p.radius + 4, 2);
    ctx.lineTo(-p.radius - flameLen, 5);
    ctx.lineTo(-p.radius + 4, 8);
    ctx.closePath();
    ctx.fill();

    // Swept Delta Interceptor Wings
    ctx.fillStyle = '#0a1636';
    ctx.strokeStyle = p.invulnTimer > 0 ? '#ff007f' : '#00f3ff';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(p.radius + 11, 0);          // Nose spear
    ctx.lineTo(-4, -p.radius - 7);        // Port wingtip
    ctx.lineTo(-p.radius + 3, -p.radius + 2);
    ctx.lineTo(-p.radius + 6, 0);         // Tail notch
    ctx.lineTo(-p.radius + 3, p.radius - 2);
    ctx.lineTo(-4, p.radius + 7);         // Starboard wingtip
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Forward Laser Cannons on Wingtips
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-2, -p.radius - 4);
    ctx.lineTo(10, -p.radius - 4);
    ctx.moveTo(-2, p.radius + 4);
    ctx.lineTo(10, p.radius + 4);
    ctx.stroke();
    ctx.restore();

    // Central Cockpit Hub (upright for readable X=coreX)
    ctx.fillStyle = '#061024';
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, p.radius - 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Player X Value Display
    ctx.direction = 'ltr';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 12px "JetBrains Mono", monospace';
    ctx.fillText(`X=${p.coreX}`, 0, 0);
    ctx.restore();

    // 15. Fast-Dissolving Floating Texts (Dark outline instead of shadowBlur)
    for (let i = 0; i < gs.floatingTexts.length; i++) {
        const ft = gs.floatingTexts[i];
        if (ft.x < minX || ft.x > maxX || ft.y < minY || ft.y > maxY) continue;
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.direction = /[\u0600-\u06FF]/.test(ft.text) ? 'rtl' : 'ltr';
        ctx.font = `800 ${ft.size}px Cairo, "JetBrains Mono", sans-serif`;
        ctx.textAlign = 'center';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = 'rgba(4, 7, 16, 0.9)';
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
    }

    ctx.restore();
};
