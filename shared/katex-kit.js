/**
 * MathKaTeX - High-Performance Cached KaTeX Rendering Engine for Math Arcade
 * Provides zero-thrash 60FPS HUD formula rendering and Bidi-safe Arabic + LaTeX ($...$) typesetting.
 */

(function() {
  const htmlCache = new Map();
  const MAX_CACHE = 600;

  function toKaTeXHtml(latex, displayMode = false) {
    const clean = String(latex || '').trim();
    if (!clean) return '';
    const key = (displayMode ? 'D|' : 'I|') + clean;
    if (htmlCache.has(key)) return htmlCache.get(key);

    let out = clean;
    if (window.katex && typeof window.katex.renderToString === 'function') {
      try {
        out = window.katex.renderToString(clean, {
          displayMode: !!displayMode,
          throwOnError: false,
          strict: false,
          trust: true
        });
      } catch (err) {
        out = `<span class="math-ltr" dir="ltr">${clean}</span>`;
      }
    } else {
      out = `<span class="math-ltr" dir="ltr">${clean}</span>`;
    }

    if (htmlCache.size >= MAX_CACHE) {
      const firstKey = htmlCache.keys().next().value;
      htmlCache.delete(firstKey);
    }
    htmlCache.set(key, out);
    return out;
  }

  /**
   * Renders a pure LaTeX string into `el`, skipping DOM updates if unchanged.
   */
  function renderLatex(el, latex, displayMode = false) {
    if (!el) return;
    const key = (displayMode ? 'D|' : 'I|') + String(latex || '');
    if (el.dataset && el.dataset.katexCacheKey === key) return;
    if (el.dataset) el.dataset.katexCacheKey = key;
    el.innerHTML = `<bdi dir="ltr" class="katex-bdi">${toKaTeXHtml(latex, displayMode)}</bdi>`;
  }

  /**
   * Renders mixed Arabic/English text containing $...$ (inline) or $$...$$ (display) LaTeX segments.
   * If a string has no $...$ delimiters, falls back to isolating math tokens with KaTeX.
   */
  function renderMixed(el, text) {
    if (!el) return;
    const raw = String(text || '');
    const cacheKey = 'M|' + raw;
    if (el.dataset && el.dataset.katexCacheKey === cacheKey) return;
    if (el.dataset) el.dataset.katexCacheKey = cacheKey;

    el.textContent = '';

    if (raw.includes('$')) {
      const tokenRe = /(\$\$[\s\S]+?\$\$|\$[^$\n]+\$)/g;
      let lastIdx = 0;
      let match;
      while ((match = tokenRe.exec(raw)) !== null) {
        if (match.index > lastIdx) {
          el.appendChild(document.createTextNode(raw.slice(lastIdx, match.index)));
        }
        const token = match[0];
        const isDisplay = token.startsWith('$$') && token.endsWith('$$');
        const inner = isDisplay ? token.slice(2, -2) : token.slice(1, -1);
        const bdi = document.createElement('bdi');
        bdi.dir = 'ltr';
        bdi.className = isDisplay ? 'katex-bdi katex-display-bdi' : 'katex-bdi';
        bdi.innerHTML = toKaTeXHtml(inner, isDisplay);
        el.appendChild(bdi);
        lastIdx = tokenRe.lastIndex;
      }
      if (lastIdx < raw.length) {
        el.appendChild(document.createTextNode(raw.slice(lastIdx)));
      }
      return;
    }

    // Fallback for plain strings without $ delimiters
    const mathRe = /(?:[+\-](?=[A-Za-z0-9\u00C0-\u024F\]\[(){}|√ⁿʳˣᵖ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻₀₁₂₃₄₅₆₇₈₉₊₋ₙₚΩΔαβπℚℝℕ∞∀∃∈∉⊂⊃∪∩→↔⇒⇔≤≥≠·×÷±≈'′∘^_\\])|[A-Za-z0-9\u00C0-\u024F\]\[(){}|√ⁿʳˣᵖ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻₀₁₂₃₄₅₆₇₈₉₊₋ₙₚΩΔαβπℚℝℕ∞∀∃∈∉⊂⊃∪∩→↔⇒⇔≤≥≠·×÷±≈'′∘^_\\])(?:[ +\-*/=<>≤≥≠∈∉⊂⊃∪∩∀∃→↔⇒⇔·×÷±≈'′∘^_:,.\\]*[A-Za-z0-9\u00C0-\u024F\]\[(){}|√ⁿʳˣᵖ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻₀₁₂₃₄₅₆₇₈₉₊₋ₙₚΩΔαβπℚℝℕ∞∀∃∈∉⊂⊃∪∩→↔⇒⇔≤≥≠·×÷±≈'′∘^_\\])*/g;
    let last = 0;
    let m;
    while ((m = mathRe.exec(raw)) !== null) {
      let sIdx = m.index;
      let eIdx = m.index + m[0].length;
      while (eIdx > sIdx) {
        const sub = raw.slice(sIdx, eIdx);
        const op = (sub.match(/\(/g) || []).length;
        const cl = (sub.match(/\)/g) || []).length;
        if ((sub.endsWith('(') && op > cl) || (sub.endsWith(')') && cl > op) || /\s$/.test(sub)) eIdx--;
        else break;
      }
      while (sIdx < eIdx) {
        const sub = raw.slice(sIdx, eIdx);
        const op = (sub.match(/\(/g) || []).length;
        const cl = (sub.match(/\)/g) || []).length;
        if ((sub.startsWith('(') && op > cl) || (sub.startsWith(')') && cl > op) || /^\s/.test(sub)) sIdx++;
        else break;
      }
      const tok = raw.slice(sIdx, eIdx);
      if (!tok || /^[()\[\]\s]+$/.test(tok)) continue;
      if (sIdx > last) el.appendChild(document.createTextNode(raw.slice(last, sIdx)));
      const bdi = document.createElement('bdi');
      bdi.dir = 'ltr';
      bdi.className = 'katex-bdi math-ltr';
      bdi.textContent = tok;
      el.appendChild(bdi);
      last = eIdx;
    }
    if (last < raw.length) el.appendChild(document.createTextNode(raw.slice(last)));
  }

  /**
   * Scans DOM for `[data-katex]` and `[data-katex-mixed]` attributes and renders them.
   */
  function scanPage(root = document) {
    if (!root) return;
    root.querySelectorAll('[data-katex]').forEach(el => {
      renderLatex(el, el.getAttribute('data-katex'), el.hasAttribute('data-katex-display'));
    });
    root.querySelectorAll('[data-katex-mixed]').forEach(el => {
      const attr = el.getAttribute('data-katex-mixed');
      renderMixed(el, attr || el.textContent);
    });
  }

  window.MathKaTeX = {
    toKaTeXHtml,
    renderLatex,
    renderMixed,
    scanPage
  };
})();
