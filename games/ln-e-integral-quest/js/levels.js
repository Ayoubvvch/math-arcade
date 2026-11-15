/**
 * 4 Handcrafted Super Mario-Style Worlds for 2BAC Sciences Physiques:
 *   World 1: وادي اللوغاريتم ln(x)
 *   World 2: سماء الدالة الأسية eˣ
 *   World 3: معبد التكامل ∫
 *   World 4: قلعة البكالوريا الكبرى
 */

window.QUEST_WORLDS = [
  {
    id: 1,
    title: 'المستوى 1: وادي اللوغاريتم ln(x)',
    shortTitle: 'وادي ln(x)',
    badge: 'من الصفر 1',
    desc: 'تعرّف لأول مرة على $\\ln(x)$ و $\\ln(1)=0$ والعدد $e\\approx 2.72$، مع تسلق السلالم وحل ألغاز الجسور.',
    theme: {
      skyTop: '#071b2e',
      skyBottom: '#0f3649',
      groundFill: '#14532d',
      groundTop: '#22c55e',
      platFill: '#1e3a5f',
      platBorder: '#34d399',
      accent: '#34d399',
      curveKind: 'ln'
    },
    width: 2820,
    height: 720,
    spawn: { x: 120, y: 550 },
    leftWallLabelAr: 'حدّ ممنوع — لا تتجاوزه!',
    leftWallLabelMath: 'x = 0  |  D_ln = ]0, +∞[',
    platforms: [
      { x: 40, y: 600, w: 1320, h: 120, ground: true },
      { x: 380, y: 525, w: 130, h: 20 },
      { x: 540, y: 410, w: 280, h: 22 },
      { x: 1580, y: 600, w: 470, h: 120, ground: true },
      { x: 1790, y: 455, w: 180, h: 20 },
      { x: 2230, y: 600, w: 590, h: 120, ground: true }
    ],
    ladders: [
      { x: 610, topY: 410, bottomY: 600, w: 38 }
    ],
    springs: [
      { x: 1640, y: 600, w: 42 }
    ],
    wings: [
      { id: 'w1_1', x: 1925, y: 550 }
    ],
    updrafts: [
      { x: 2075, y: 240, w: 110, h: 380, label: 'تيار صاعد' }
    ],
    questionBlocks: [
      { id: 'qb1_1', x: 250, y: 485, lessonId: 'ln_intro', label: 'ln?' },
      { id: 'qb1_2', x: 685, y: 295, lessonId: 'ln_e_sign', label: 'e?' },
      { id: 'qb1_3', x: 1715, y: 485, lessonId: 'ln_props_deriv', label: 'ln×' }
    ],
    puzzles: [
      {
        id: 'pz1_1',
        kind: 'pads',
        signX: 1050,
        signY: 500,
        signAr: 'أي قيمة تدخل داخل اللوغاريتم؟',
        signMath: 'ln(x)  :  x > 0  ⇒  x = ?',
        prompt: 'أي عدد يدخل داخل ln(x)؟',
        options: [
          { x: 925, y: 600, label: 'x = -3', correct: false, hint: 'انتبه! $\\ln$ لا تقبل الأعداد السالبة ($x > 0$ دائماً).' },
          { x: 1050, y: 600, label: 'x = 0', correct: false, hint: 'انتبه! الصفر ممنوع في $\\ln(x)$، يجب أن يكون موجباً قطعاً!' },
          { x: 1175, y: 600, label: 'x = 4', correct: true }
        ],
        bridge: { x: 1360, y: 600, w: 220, h: 24, label: 'جسر مجموعة التعريف' },
        successMsg: 'أحسنت! $x = 4 > 0$، لذلك ينتمي لـ $D_{\\ln} = ]0, +\\infty[$ وتمتد قنطرة العبور!'
      },
      {
        id: 'pz1_2',
        kind: 'blocks',
        signX: 2410,
        signY: 385,
        signAr: 'احسب مجموع اللوغاريتمين:',
        signMath: 'ln(2) + ln(3) = ?',
        prompt: 'احسب: ln(2) + ln(3) = ?',
        options: [
          { x: 2265, y: 480, label: 'ln(5)', correct: false, hint: 'تذكّر: جمع لوغاريتمين يتحول إلى ضَرب: $\\ln(a) + \\ln(b) = \\ln(a \\times b)$!' },
          { x: 2375, y: 480, label: 'ln(6)', correct: true },
          { x: 2485, y: 480, label: 'ln(23)', correct: false, hint: 'اضرب $2 \\times 3$ وليس دمجهما جنباً إلى جنب!' }
        ],
        barrier: { x: 2580, y: 430, w: 24, h: 170, label: 'بوابة القوة' },
        successMsg: 'ممتاز! $\\ln(2) + \\ln(3) = \\ln(2 \\times 3) = \\ln(6)$!'
      }
    ],
    critters: [
      { id: 'c1_1', x: 460, y: 582, minX: 375, maxX: 575, speed: 68, label: 'x ≤ 0' },
      { id: 'c1_2', x: 1840, y: 582, minX: 1730, maxX: 1980, speed: 74, label: 'ln(0)' }
    ],
    checkpoints: [
      { id: 'cp1_1', x: 1300, y: 600 },
      { id: 'cp1_2', x: 2005, y: 600 }
    ],
    coins: [
      { x: 195, y: 555 }, { x: 415, y: 480 }, { x: 475, y: 480 },
      { x: 610, y: 510 }, { x: 610, y: 460 }, { x: 755, y: 365 },
      { x: 1440, y: 545 }, { x: 1495, y: 545 }, { x: 1850, y: 410 },
      { x: 2110, y: 440 }, { x: 2130, y: 370 }, { x: 2160, y: 315 }
    ],
    castleDoor: { x: 2645, y: 600 },
    flagpole: { x: 2750, y: 600 },
    takeaways: [
      'مجموعة تعريف $\\ln$ هي $]0, +\\infty[$ (موجبة قطعاً).',
      'قيمتان أساسيتان: $\\ln(1) = 0$ و $\\ln(e) = 1$.',
      'خصائص السحر: $\\ln(ab) = \\ln a + \\ln b$ و $(\\ln x)\' = \\frac{1}{x}$.'
    ]
  },

  // ======================= WORLD 2: EXPONENTIAL e^x =======================
  {
    id: 2,
    title: 'المستوى 2: سماء الدالة الأسية eˣ',
    shortTitle: 'سماء eˣ',
    badge: 'الطيران 2',
    desc: 'حلّق بأجنحة $e^x$ فوق السحاب، واكتشف لماذا $e^x > 0$ دائماً وأنها الدالة العكسية لـ $\\ln$.',
    theme: {
      skyTop: '#17153b',
      skyBottom: '#2e1f47',
      groundFill: '#1e293b',
      groundTop: '#fbbf24',
      platFill: '#1e1b4b',
      platBorder: '#fbbf24',
      accent: '#fbbf24',
      curveKind: 'exp'
    },
    width: 2860,
    height: 720,
    spawn: { x: 120, y: 510 },
    leftWallLabelAr: 'مقارب أفقي — موجبة دائماً',
    leftWallLabelMath: 'y = 0  |  eˣ > 0',
    platforms: [
      { x: 40, y: 560, w: 760, h: 160, ground: true },
      { x: 1020, y: 560, w: 670, h: 160, ground: true },
      { x: 1360, y: 340, w: 300, h: 22 },
      { x: 1840, y: 420, w: 160, h: 22 },
      { x: 2170, y: 540, w: 690, h: 180, ground: true }
    ],
    ladders: [
      { x: 1480, topY: 340, bottomY: 560, w: 38 }
    ],
    springs: [
      { x: 1240, y: 560, w: 42 }
    ],
    wings: [
      { id: 'w2_1', x: 390, y: 515 },
      { id: 'w2_2', x: 1625, y: 295 },
      { id: 'w2_3', x: 1920, y: 375 }
    ],
    updrafts: [
      { x: 1715, y: 170, w: 105, h: 430, label: 'نمو أسي eˣ' },
      { x: 2025, y: 170, w: 115, h: 430, label: 'تيار الطيران' }
    ],
    questionBlocks: [
      { id: 'qb2_1', x: 255, y: 445, lessonId: 'exp_intro', label: 'eˣ?' },
      { id: 'qb2_2', x: 1130, y: 445, lessonId: 'exp_inverse', label: '⇄' },
      { id: 'qb2_3', x: 1385, y: 225, lessonId: 'exp_deriv_limits', label: "(eˣ)'" }
    ],
    puzzles: [
      {
        id: 'pz2_1',
        kind: 'blocks',
        signX: 620,
        signY: 345,
        signAr: 'ما القيمة لفتح جسر السماء؟',
        signMath: 'e⁰ = ?',
        prompt: 'ما قيمة e⁰ لفتح جسر السماء؟',
        options: [
          { x: 475, y: 440, label: '0', correct: false, hint: 'انتبه! $e^x > 0$ دائماً، ومستحيل أن تساوي صفراً!' },
          { x: 585, y: 440, label: '1', correct: true },
          { x: 695, y: 440, label: 'e', correct: false, hint: '$e^1$ تساوي $e$، أما $e^0$ فتساوي عدداً أبسط!' }
        ],
        bridge: { x: 800, y: 560, w: 220, h: 24, label: 'الجسر السماوي e⁰ = 1' },
        successMsg: 'رائع! $e^0 = 1$ دائماً لأن $\\ln(1) = 0$!'
      },
      {
        id: 'pz2_2',
        kind: 'pads',
        signX: 2390,
        signY: 435,
        signAr: 'بسّط التعبير العكسي التالي:',
        signMath: 'e^(ln 7) = ?',
        prompt: 'بسّط التعبير: e^(ln 7) = ?',
        options: [
          { x: 2275, y: 540, label: '1', correct: false, hint: 'تذكّر: $e^x$ و $\\ln$ تلغيان بعضهما البعض تماماً!' },
          { x: 2390, y: 540, label: '7', correct: true },
          { x: 2505, y: 540, label: 'e', correct: false, hint: 'عندما تطبق $e$ على $\\ln(7)$ يتبقى العدد الداخلي نفسه!' }
        ],
        barrier: { x: 2595, y: 370, w: 24, h: 170, label: 'بوابة العكسية' },
        successMsg: 'ممتاز! $e^{\\ln(7)} = 7$ لأن الدالتين متعاكستان!'
      }
    ],
    critters: [
      { id: 'c2_1', x: 1320, y: 542, minX: 1180, maxX: 1430, speed: 72, label: 'eˣ = -1?' },
      { id: 'c2_2', x: 1520, y: 322, minX: 1380, maxX: 1620, speed: 62, label: 'e⁰ = 0?' }
    ],
    checkpoints: [
      { id: 'cp2_1', x: 1055, y: 560 },
      { id: 'cp2_2', x: 2205, y: 540 }
    ],
    coins: [
      { x: 195, y: 515 }, { x: 430, y: 420 }, { x: 870, y: 495 },
      { x: 935, y: 495 }, { x: 1245, y: 430 }, { x: 1470, y: 440 },
      { x: 1545, y: 295 }, { x: 1765, y: 350 }, { x: 1765, y: 280 },
      { x: 1915, y: 325 }, { x: 2075, y: 350 }, { x: 2085, y: 270 }
    ],
    castleDoor: { x: 2665, y: 540 },
    flagpole: { x: 2775, y: 540 },
    takeaways: [
      'الدالة $e^x$ موجبة دائماً قطعاً على $\\mathbb{R}$: $e^x > 0$.',
      'التكافؤ الذهبي: $\\ln(e^x) = x$ و $e^{\\ln y} = y$.',
      'معجزة الاشتقاق: $(e^x)\' = e^x$ و $(e^u)\' = u\'e^u$.'
    ]
  },

  // ======================= WORLD 3: INTEGRATION ∫ =======================
  {
    id: 3,
    title: 'المستوى 3: معبد التكامل ∫',
    shortTitle: 'معبد التكامل ∫',
    badge: 'المساحات 3',
    desc: 'اكتشف التكامل كمساحة تحت المنحنى، ولوّن أعمدة ريمان، وتعلم الدوال الأصلية وعلاقة شال!',
    theme: {
      skyTop: '#0d0924',
      skyBottom: '#1c1545',
      groundFill: '#1e1b4b',
      groundTop: '#38bdf8',
      platFill: '#172554',
      platBorder: '#38bdf8',
      accent: '#38bdf8',
      curveKind: 'integral'
    },
    width: 2900,
    height: 720,
    spawn: { x: 110, y: 550 },
    leftWallLabelAr: 'بداية مجال التكامل',
    leftWallLabelMath: '[a, b]',
    platforms: [
      { x: 40, y: 600, w: 1320, h: 120, ground: true },
      { x: 820, y: 390, w: 215, h: 22 },
      { x: 1580, y: 600, w: 480, h: 120, ground: true },
      { x: 2105, y: 425, w: 130, h: 22 },
      { x: 2270, y: 600, w: 630, h: 120, ground: true }
    ],
    ladders: [
      { x: 920, topY: 390, bottomY: 600, w: 38 }
    ],
    springs: [
      { x: 1850, y: 600, w: 42 }
    ],
    wings: [
      { id: 'w3_1', x: 1980, y: 550 }
    ],
    updrafts: [
      { x: 2070, y: 210, w: 120, h: 410, label: 'تيار ∫' }
    ],
    areaPillars: [
      { id: 'ap1', x: 455, y: 495, w: 72, h: 105, val: 1, lit: false },
      { id: 'ap2', x: 535, y: 465, w: 72, h: 135, val: 1, lit: false },
      { id: 'ap3', x: 615, y: 480, w: 72, h: 120, val: 1, lit: false },
      { id: 'ap4', x: 695, y: 510, w: 72, h: 90, val: 1, lit: false }
    ],
    questionBlocks: [
      { id: 'qb3_1', x: 255, y: 485, lessonId: 'int_area_intro', label: '∫?' },
      { id: 'qb3_2', x: 965, y: 275, lessonId: 'int_primitive', label: 'F(x)' },
      { id: 'qb3_3', x: 1710, y: 485, lessonId: 'int_chasles_basic', label: 'شال' }
    ],
    puzzles: [
      {
        id: 'pz3_1',
        kind: 'blocks',
        signX: 1205,
        signY: 385,
        signAr: 'ما الدالة الأصلية للدالة؟',
        signMath: 'f(x) = 1/x  (x > 0)  ⇒  F(x) = ?',
        prompt: 'ما الدالة الأصلية لـ 1/x على ]0,+∞[؟',
        options: [
          { x: 1065, y: 480, label: 'x²', correct: false, hint: 'مشتقة $x^2$ هي $2x$ وليست $\\frac{1}{x}$!' },
          { x: 1170, y: 480, label: 'ln(x)', correct: true },
          { x: 1275, y: 480, label: 'eˣ', correct: false, hint: 'مشتقة $e^x$ هي $e^x$ نفسها وليست $\\frac{1}{x}$!' }
        ],
        bridge: { x: 1360, y: 600, w: 220, h: 24, label: 'جسر الدالة الأصلية' },
        successMsg: 'رائع! $(\\ln x)\' = \\frac{1}{x}$، إذن أصلية $\\frac{1}{x}$ هي $\\ln(x)$!'
      },
      {
        id: 'pz3_2',
        kind: 'pads',
        signX: 2480,
        signY: 495,
        signAr: 'استعمل علاقة شال لحساب التكامل:',
        signMath: '∫₀² f = 3 ,  ∫₂⁵ f = 4  ⇒  ∫₀⁵ f = ?',
        prompt: 'علاقة شال: ∫₀² f = 3 , ∫₂⁵ f = 4 ⇒ ∫₀⁵ f = ?',
        options: [
          { x: 2365, y: 600, label: '1', correct: false, hint: 'نحن نضم المساحتين من $0$ إلى $2$ ثم من $2$ إلى $5$، إذن نجمع!' },
          { x: 2480, y: 600, label: '7', correct: true },
          { x: 2595, y: 600, label: '12', correct: false, hint: 'نجمع المساحتين $3 + 4$ وليس ضربهما!' }
        ],
        barrier: { x: 2675, y: 430, w: 24, h: 170, label: 'بوابة شال' },
        successMsg: 'أحسنت! $3 + 4 = 7$: علاقة شال تجمع المساحات المتجاورة!'
      }
    ],
    critters: [
      { id: 'c3_1', x: 1755, y: 582, minX: 1680, maxX: 1825, speed: 68, label: 'نسيت F(a)!' }
    ],
    checkpoints: [
      { id: 'cp3_1', x: 1615, y: 600 },
      { id: 'cp3_2', x: 2305, y: 600 }
    ],
    coins: [
      { x: 195, y: 555 }, { x: 490, y: 445 }, { x: 570, y: 415 },
      { x: 650, y: 430 }, { x: 730, y: 460 }, { x: 865, y: 345 },
      { x: 1450, y: 545 }, { x: 1500, y: 545 }, { x: 1850, y: 445 },
      { x: 2150, y: 365 }, { x: 2170, y: 300 }, { x: 2210, y: 365 }
    ],
    castleDoor: { x: 2740, y: 600 },
    flagpole: { x: 2840, y: 600 },
    takeaways: [
      'التكامل $\\int_a^b f(x)\\,dx$ (عندما $f \\ge 0$) هو المساحة تحت المنحنى.',
      'صيغة الحساب: $\\int_a^b f(x)\\,dx = F(b) - F(a)$ حيث $F\' = f$.',
      '$\\int_1^e \\frac{1}{x}\\,dx = 1$ و $\\int_0^1 e^x\\,dx = e - 1$، وشال: $\\int_a^c + \\int_c^b = \\int_a^b$.'
    ]
  },

  // ======================= WORLD 4: GRAND SYNTHESIS & IBP =======================
  {
    id: 4,
    title: 'المستوى 4: قلعة البكالوريا الكبرى',
    shortTitle: 'قلعة 2BAC الكبرى',
    badge: 'التوليفة 4',
    desc: 'التحدي الختامي: حل المعادلات، المكاملة بالأجزاء (**ALPES**)، وحساب المساحات بين المنحنيات!',
    theme: {
      skyTop: '#0a0f1f',
      skyBottom: '#1e1b38',
      groundFill: '#1e293b',
      groundTop: '#e879f9',
      platFill: '#1e1b4b',
      platBorder: '#e879f9',
      accent: '#e879f9',
      curveKind: 'synthesis'
    },
    width: 2960,
    height: 720,
    spawn: { x: 110, y: 550 },
    leftWallLabelAr: 'قلعة التحدي النهائي',
    leftWallLabelMath: '2BAC PC • ln & eˣ & ∫',
    platforms: [
      { x: 40, y: 600, w: 1120, h: 120, ground: true },
      { x: 470, y: 440, w: 260, h: 22 },
      { x: 1380, y: 600, w: 590, h: 120, ground: true },
      { x: 1410, y: 365, w: 340, h: 22 },
      { x: 2240, y: 600, w: 720, h: 120, ground: true }
    ],
    ladders: [
      { x: 1495, topY: 365, bottomY: 600, w: 38 }
    ],
    springs: [
      { x: 415, y: 600, w: 42 }
    ],
    wings: [
      { id: 'w4_1', x: 1710, y: 320 },
      { id: 'w4_2', x: 1930, y: 550 }
    ],
    updrafts: [
      { x: 2055, y: 185, w: 125, h: 430, label: 'تيار النجاح' }
    ],
    questionBlocks: [
      { id: 'qb4_1', x: 255, y: 485, lessonId: 'mix_equations', label: '⇄' },
      { id: 'qb4_2', x: 1595, y: 250, lessonId: 'mix_ibp', label: 'IBP' },
      { id: 'qb4_3', x: 1850, y: 485, lessonId: 'mix_area_between', label: 'المساحة' }
    ],
    puzzles: [
      {
        id: 'pz4_1',
        kind: 'blocks',
        signX: 950,
        signY: 385,
        signAr: 'حلّ المعادلة اللوغاريتمية:',
        signMath: 'ln(x - 1) = 0  ⇒  x = ?',
        prompt: 'حل المعادلة: ln(x - 1) = 0',
        options: [
          { x: 805, y: 480, label: 'x = 1', correct: false, hint: 'لو كان $x = 1$ لصارت $\\ln(0)$ وهذا ممنوع! نريد $x - 1 = 1$.' },
          { x: 915, y: 480, label: 'x = 2', correct: true },
          { x: 1025, y: 480, label: 'x = e', correct: false, hint: '$\\ln(A) = 0$ تعني $A = e^0 = 1$، إذن $x - 1 = 1$!' }
        ],
        bridge: { x: 1160, y: 600, w: 220, h: 24, label: 'جسر المعادلة' },
        successMsg: 'ممتاز! $\\ln(x - 1) = 0 \\iff x - 1 = 1 \\iff x = 2$!'
      },
      {
        id: 'pz4_2',
        kind: 'blocks',
        signX: 2580,
        signY: 385,
        signAr: 'احسب قيمة التكامل التالي:',
        signMath: '∫(0 → ln 3) eˣ dx = ?',
        prompt: 'احسب: ∫(0 → ln 3) eˣ dx = ?',
        options: [
          { x: 2435, y: 480, label: '2', correct: true },
          { x: 2545, y: 480, label: '3', correct: false, hint: 'لا تنسَ طرح $e^0 = 1$: الجواب هو $e^{\\ln 3} - e^0$!' },
          { x: 2655, y: 480, label: 'ln(3)', correct: false, hint: 'أصلية $e^x$ هي $e^x$ نفسها، فعوّض بها: $e^{\\ln 3} - e^0$!' }
        ],
        barrier: { x: 2755, y: 430, w: 24, h: 170, label: 'بوابة البكالوريا' },
        successMsg: 'عبقري! $e^{\\ln 3} - e^0 = 3 - 1 = 2$!'
      }
    ],
    critters: [
      { id: 'c4_1', x: 580, y: 422, minX: 485, maxX: 705, speed: 68, label: 'ln(-1)?' },
      { id: 'c4_2', x: 2365, y: 582, minX: 2320, maxX: 2415, speed: 64, label: 'e⁰ = 0?' }
    ],
    checkpoints: [
      { id: 'cp4_1', x: 1410, y: 600 },
      { id: 'cp4_2', x: 2285, y: 600 }
    ],
    coins: [
      { x: 185, y: 555 }, { x: 520, y: 395 }, { x: 600, y: 395 },
      { x: 675, y: 395 }, { x: 1245, y: 545 }, { x: 1295, y: 545 },
      { x: 1500, y: 470 }, { x: 1650, y: 320 }, { x: 2050, y: 360 },
      { x: 2100, y: 290 }, { x: 2150, y: 245 }, { x: 2195, y: 310 }
    ],
    castleDoor: { x: 2820, y: 600 },
    flagpole: { x: 2910, y: 600 },
    takeaways: [
      'حل المعادلات بالانتقال العكسي: $\\ln(A)=k \\iff A=e^k$.',
      'المكاملة بالأجزاء: $\\int u\'v = [uv] - \\int uv\'$ بترتيب **ALPES**.',
      'المساحة بين منحنيين: $\\int_a^b |f(x) - g(x)|\\,dx \\cdot \\|\\vec{i}\\|\\cdot\\|\\vec{j}\\|$.'
    ]
  }
];
