/**
 * Asymptote Asylum (كابوس المعلم المتعامد): 2D Coordinate-Plane Calculus Horror Curriculum Engine
 * Full KaTeX ($...$) Typesetting across all 16 Topics (23 through 38):
 *   Section A (23-29): Derivative Rules, Limits, Unilateral Derivatives, Chain & Inverse Rules
 *   Section B (30-38): Variations, Auxiliary Function, Graphical Solving, Optimization/Inequalities,
 *                      Concavity/Inflection, Infinite Branches, Relative Position, Symmetry & Curve Sketching
 */

window.CURRICULUM_TOPICS = {
  23: 'قابلية الاشتقاق في نقطة (1.2.5)',
  24: 'معادلة المماس والتقريب التآلفي',
  25: 'الاشتقاق على اليمين واليسار والنقطة المزواة',
  26: 'جدول مشتقات الدوال الاعتيادية',
  27: 'العمليات على الدوال المشتقة',
  28: 'مشتقة مركب دالتين وجذر الرتبة $n$',
  29: 'مشتقة الدالة العكسية (1.2.11)',
  30: 'الرتابة وجدول التغيرات (1.2.7)',
  31: 'تقنية الدالة المساعدة وإشارتها (1.2.8)',
  32: 'القراءة المبيانية وحل المعادلات (1.2.9 / 1.2.10)',
  33: 'المطاريف والاستمثال وإثبات المتفاوتات (1.2.12 / 1.2.13)',
  34: 'المشتقة الثانية والتحدب ونقط الانعطاف',
  35: 'شجرة الفروع اللانهائية كاملة',
  36: 'الوضع النسبي لمنحنى ومقارب/مماس',
  37: 'الزوجية والدورية وعناصر التماثل (1.2.22)',
  38: 'الإنشاء الهندسي للمنحنى $(C_f)$ و $(C_{f^{-1}})$'
};

window.ASYLUM_WARDS = [
  {
    id: 1,
    name: 'القطاع 1 في $(O,\\vec{i},\\vec{j})$ — المشتقة والمماسات والنقط المزواة (23–26)',
    topics: [23, 24, 25, 26],
    sealColor: '#ef4444'
  },
  {
    id: 2,
    name: 'القطاع 2 في $(O,\\vec{i},\\vec{j})$ — العمليات والتركيب والعكسية (27–29)',
    topics: [27, 28, 29],
    sealColor: '#f59e0b'
  },
  {
    id: 3,
    name: 'القطاع 3 في $(O,\\vec{i},\\vec{j})$ — الرتابة والدالة المساعدة والانعطاف (30–34)',
    topics: [30, 31, 32, 33, 34],
    sealColor: '#10b981'
  },
  {
    id: 4,
    name: 'القطاع 4 في $(O,\\vec{i},\\vec{j})$ — المقاربات والتماثل و $(C_{f^{-1}})$ (35–38)',
    topics: [35, 36, 37, 38],
    sealColor: '#c084fc'
  }
];

window.RITUAL_QUESTION_BANK = [
  // ================= SECTION A: DERIVATIVES (23 - 29) =================
  {
    id: 't23_poly_lim',
    section: 'A',
    topic: 23,
    prompt: 'في المعلم $(O,\\vec{i},\\vec{j})$ نعتبر $f(x) = x^2 + 3x$. احسب النهاية المحددة للعدد المشتق:\n$$\\lim_{x\\to 1} \\frac{f(x) - f(1)}{x - 1} =$$',
    hint: 'النهاية تساوي العدد المشتق $f\'(1)$ حيث $f\'(x) = 2x + 3$.',
    options: ['$5$', '$4$', '$3$', 'غير قابلة للاشتقاق'],
    correctIndex: 0
  },
  {
    id: 't23_sqrt_lim',
    section: 'A',
    topic: 23,
    prompt: 'احسب ميل المماس للمنحنى $(C_f)$ باستعمال العدد المشتق:\n$$\\lim_{x\\to 2} \\frac{\\sqrt{x + 2} - 2}{x - 2} =$$',
    hint: 'ضع $f(x) = \\sqrt{x+2}$، إذن النهاية هي $f\'(2) = \\frac{1}{2\\sqrt{4}}$.',
    options: ['$\\frac{1}{2}$', '$\\frac{1}{4}$', '$2$', '$0$'],
    correctIndex: 1
  },
  {
    id: 't23_trig_lim',
    section: 'A',
    topic: 23,
    prompt: 'باستعمال العدد المشتق للدالة $f(x) = \\cos(x)$ عند $x_0 = 0$:\n$$\\lim_{x\\to 0} \\frac{\\cos(x) - 1}{x} =$$',
    hint: '$f\'(x) = -\\sin(x)$ ومنه $f\'(0) = -\\sin(0) = 0$.',
    options: ['$1$', '$-1$', '$0$', '$+\\infty$'],
    correctIndex: 2
  },
  {
    id: 't24_tangent_eq',
    section: 'A',
    topic: 24,
    prompt: 'لتكن $f(x) = x^2 - 2x + 3$. لبناء جسر المماس $(T)$ للمنحنى $(C_f)$ في النقطة ذات الأفصول $x_0 = 2$، ما معادلته؟',
    hint: '$f(2) = 3$ و $f\'(2) = 2$، نطبق $(T): y = f\'(2)(x - 2) + f(2)$.',
    options: ['$y = 2x + 3$', '$y = 2x - 1$', '$y = 4x - 5$', '$y = x + 1$'],
    correctIndex: 1,
    graphSpec: { type: 'tangent_parabola' }
  },
  {
    id: 't24_affine_approx',
    section: 'A',
    topic: 24,
    prompt: 'باستعمال التقريب التآلفي للدالة $f(x) = \\sqrt{x}$ بجوار $x_0 = 9$:\n$$\\sqrt{9.06} \\approx f\'(9)(9.06 - 9) + f(9) \\approx$$',
    hint: '$f(9) = 3$ و $f\'(9) = \\frac{1}{2\\times 3} = \\frac{1}{6}$، والفرق $h = 0.06$.',
    options: ['$3.06$', '$3.03$', '$3.01$', '$3.005$'],
    correctIndex: 2
  },
  {
    id: 't24_sin_approx',
    section: 'A',
    topic: 24,
    prompt: 'التقريب التآلفي للدالة $f(x) = (1 + x)^3$ بجوار $x_0 = 0$ يعطي $(1.01)^3 \\approx$',
    hint: '$f(0) = 1$ و $f\'(0) = 3(1+0)^2 = 3$، إذن $f(x) \\approx 1 + 3x$.',
    options: ['$1.01$', '$1.03$', '$1.06$', '$1.30$'],
    correctIndex: 1
  },
  {
    id: 't25_point_anguleux',
    section: 'A',
    topic: 25,
    prompt: 'لاحظ المبيان لـ $f(x) = |x - 1|$ عند $x_0 = 1$:\n$$f\'_d(1) = +1 \\quad \\text{و} \\quad f\'_g(1) = -1$$\nما التأويل الهندسي عند $x_0 = 1$؟',
    hint: 'العددان المشتقان على اليمين واليسار مختلفان ($f\'_d(1) \\neq f\'_g(1)$).',
    options: [
      'نقطة انعطاف ومماس أفقي',
      'نصفا مماسين يحددان نقطة مزواة (Point anguleux)',
      'مقارب عمودي $x = 1$',
      'نصف مماس عمودي نحو الأعلى'
    ],
    correctIndex: 1,
    graphSpec: { type: 'point_anguleux' }
  },
  {
    id: 't25_vertical_right',
    section: 'A',
    topic: 25,
    prompt: 'إذا كان $\\lim_{x\\to 0^+} \\frac{f(x) - f(0)}{x - 0} = +\\infty$، فإن $(C_f)$ يقبل على يمين $0$:',
    hint: 'على اليمين ($+$): النهاية $+\\infty$ توافق الاتجاه نحو الأعلى.',
    options: [
      'مماساً أفقياً معادلته $y = f(0)$',
      'نصف مماس عمودي موجه نحو الأسفل',
      'نصف مماس عمودي موجه نحو الأعلى',
      'فرعاً شلجمياً اتجاهه $(Ox)$'
    ],
    correctIndex: 2,
    graphSpec: { type: 'vertical_half_tangent' }
  },
  {
    id: 't25_vertical_left',
    section: 'A',
    topic: 25,
    prompt: 'إذا كان $\\lim_{x\\to 2^-} \\frac{f(x) - f(2)}{x - 2} = +\\infty$، فإن $(C_f)$ يقبل على يسار $2$:',
    hint: 'على اليسار ($x - 2 < 0$): خارج القسمة موجب يعني $f(x) - f(2) < 0$، أي المنحنى نازل نحو الأسفل.',
    options: [
      'نصف مماس عمودي موجه نحو الأسفل',
      'نصف مماس عمودي موجه نحو الأعلى',
      'نقطة مزواة بميلين $1$ و $-1$',
      'نصف مماس أفقي'
    ],
    correctIndex: 0
  },
  {
    id: 't26_usual_tan',
    section: 'A',
    topic: 26,
    prompt: 'ما المشتقة الصحيحة للدالة الاعتيادية $f(x) = \\tan(x)$ على مجال اشتقاقها؟',
    hint: 'تذكر $\\tan(x) = \\frac{\\sin(x)}{\\cos(x)}$ وتطبيق $(\\frac{u}{v})\'$.',
    options: [
      '$\\frac{1}{\\sin^2(x)}$',
      '$-\\frac{1}{\\cos^2(x)}$',
      '$1 + \\tan^2(x) = \\frac{1}{\\cos^2(x)}$',
      '$\\sec(x)$'
    ],
    correctIndex: 2
  },
  {
    id: 't26_usual_mix',
    section: 'A',
    topic: 26,
    prompt: 'احسب مشتقة الدالة الاعتيادية:\n$$f(x) = \\frac{1}{x} + 4\\sqrt{x} - 2\\cos(x) \\implies f\'(x) =$$',
    hint: '$(\\frac{1}{x})\' = -\\frac{1}{x^2}$ ، $(\\sqrt{x})\' = \\frac{1}{2\\sqrt{x}}$ ، $(\\cos x)\' = -\\sin x$.',
    options: [
      '$-\\frac{1}{x^2} + \\frac{2}{\\sqrt{x}} + 2\\sin(x)$',
      '$\\frac{1}{x^2} + \\frac{2}{\\sqrt{x}} - 2\\sin(x)$',
      '$-\\frac{1}{x^2} + \\frac{4}{\\sqrt{x}} + 2\\sin(x)$',
      '$-\\frac{1}{x} + 2\\sqrt{x} + 2\\sin(x)$'
    ],
    correctIndex: 0
  },
  {
    id: 't27_quotient',
    section: 'A',
    topic: 27,
    prompt: 'احسب مشتقة الدالة الكسرية $(\\frac{u}{v})\'$ لـ $f(x) = \\frac{2x + 1}{x - 1}$:',
    hint: '$\\frac{u\'v - uv\'}{v^2} = \\frac{2(x - 1) - 1(2x + 1)}{(x - 1)^2}$.',
    options: [
      '$\\frac{3}{(x - 1)^2}$',
      '$\\frac{-3}{(x - 1)^2}$',
      '$\\frac{2}{(x - 1)^2}$',
      '$\\frac{-1}{(x - 1)^2}$'
    ],
    correctIndex: 1
  },
  {
    id: 't27_power_u',
    section: 'A',
    topic: 27,
    prompt: 'بتطبيق القاعدة $(u^n)\' = n\\cdot u\'\\cdot u^{n-1}$، ما مشتقة $f(x) = (x^2 + 1)^4$؟',
    hint: '$u = x^2 + 1$ و $u\' = 2x$ والأس $n = 4$.',
    options: [
      '$4(x^2 + 1)^3$',
      '$8x(x^2 + 1)^3$',
      '$4x(x^2 + 1)^3$',
      '$8(x^2 + 1)^3$'
    ],
    correctIndex: 1
  },
  {
    id: 't27_rational_exp',
    section: 'A',
    topic: 27,
    prompt: 'بتطبيق $(u^r)\' = r\\cdot u\'\\cdot u^{r-1}$، ما مشتقة $f(x) = (3x + 2)^{\\frac{2}{3}}$ حيث $3x + 2 > 0$؟',
    hint: '$r = \\frac{2}{3}$ و $u\' = 3$؛ لاحظ اختزال $3$ مع المقام $3$!',
    options: [
      '$2(3x + 2)^{-\\frac{1}{3}}$',
      '$\\frac{2}{3}(3x + 2)^{-\\frac{1}{3}}$',
      '$6(3x + 2)^{-\\frac{1}{3}}$',
      '$2(3x + 2)^{\\frac{1}{3}}$'
    ],
    correctIndex: 0
  },
  {
    id: 't28_chain_rule',
    section: 'A',
    topic: 28,
    prompt: 'باستعمال مشتقة مركب دالتين $(v\\circ u)\'(x) = u\'(x)\\cdot v\'(u(x))$:\nما مشتقة $f(x) = \\cos(3x^2 - 1)$؟',
    hint: '$u\'(x) = 6x$ و $v\'(t) = -\\sin(t)$.',
    options: [
      '$-\\sin(3x^2 - 1)$',
      '$6x\\cdot\\sin(3x^2 - 1)$',
      '$-6x\\cdot\\sin(3x^2 - 1)$',
      '$-3\\cdot\\sin(6x)$'
    ],
    correctIndex: 2
  },
  {
    id: 't28_nth_root',
    section: 'A',
    topic: 28,
    prompt: 'مشتقة جذر الرتبة $n$ هي $(\\sqrt[n]{u})\' = \\frac{u\'}{n\\sqrt[n]{u^{n-1}}}$.\nإذن مشتقة $f(x) = \\sqrt[3]{x^2 + 1}$ هي:',
    hint: 'هنا $n = 3$ و $u = x^2 + 1$ و $u\' = 2x$.',
    options: [
      '$\\frac{2x}{3\\sqrt[3]{(x^2 + 1)^2}}$',
      '$\\frac{1}{3\\sqrt[3]{(x^2 + 1)^2}}$',
      '$\\frac{2x}{\\sqrt[3]{x^2 + 1}}$',
      '$\\frac{2x}{2\\sqrt{x^2 + 1}}$'
    ],
    correctIndex: 0
  },
  {
    id: 't28_chain_eval',
    section: 'A',
    topic: 28,
    prompt: 'إذا علمت أن $u(1) = 4$ و $u\'(1) = 3$ و $v\'(4) = -2$، فما قيمة $(v\\circ u)\'(1)$؟',
    hint: '$(v\\circ u)\'(1) = u\'(1) \\times v\'(u(1))$.',
    options: ['$-8$', '$5$', '$-6$', '$-\\frac{2}{3}$'],
    correctIndex: 2
  },
  {
    id: 't29_inv_value',
    section: 'A',
    topic: 29,
    prompt: 'نعتبر $f(x) = x^3 + x$ تقابلاً من $\\mathbb{R}$ نحو $\\mathbb{R}$ (البند 1.2.11).\nبملاحظة أن $f(1) = 2$، احسب $(f^{-1})\'(2)$:',
    hint: 'نطبق $(f^{-1})\'(y_0) = \\frac{1}{f\'(x_0)}$ مع $x_0 = 1$ و $f\'(x) = 3x^2 + 1$.',
    options: ['$\\frac{1}{2}$', '$4$', '$\\frac{1}{4}$', '$\\frac{1}{3}$'],
    correctIndex: 2
  },
  {
    id: 't29_inv_condition',
    section: 'A',
    topic: 29,
    prompt: 'لتكن $f$ قابلة للاشتقاق في $x_0$ حيث $y_0 = f(x_0)$. ما الشرط الضروري لتكون $f^{-1}$ قابلة للاشتقاق في $y_0$؟',
    hint: 'يظهر $f\'(x_0)$ في المقام في صيغة مشتقة الدالة العكسية!',
    options: ['$f\'(x_0) = 0$', '$f\'(x_0) \\neq 0$', '$f(x_0) > 0$', '$f\'\'(x_0) = 0$'],
    correctIndex: 1
  },
  {
    id: 't29_inv_interval',
    section: 'A',
    topic: 29,
    prompt: 'ما التعبير العام لمشتقة الدالة العكسية $(f^{-1})\'(x)$ على مجال $J$؟',
    hint: 'نحافظ على تركيب $f\'$ مع $f^{-1}$ في المقام.',
    options: [
      '$\\frac{1}{f(f^{-1}(x))}$',
      '$f\'(f^{-1}(x))$',
      '$\\frac{1}{f\'(f^{-1}(x))}$',
      '$\\frac{-f\'(x)}{[f(x)]^2}$'
    ],
    correctIndex: 2
  },

  // ================= SECTION B: CURVE STUDY & FUNCTIONS (30 - 38) =================
  {
    id: 't30_monotony_sign',
    section: 'B',
    topic: 30,
    prompt: 'لاحظ إشارة $f\'(x) = x^2 - 4$.\nعلى أي مجال تكون الدالة $f$ تناقصية قطعا؟',
    hint: '$f$ تناقصية عندما تكون المشتقة $f\'(x) \\le 0$.',
    options: ['$]-\\infty, -2]$', '$[-2, 2]$', '$[2, +\\infty[$', '$[0, 4]$'],
    correctIndex: 1,
    graphSpec: { type: 'sign_fprime' }
  },
  {
    id: 't30_extremum_from_deriv',
    section: 'B',
    topic: 30,
    prompt: 'إذا كانت $f\'(x) = \\frac{x - 3}{x^2 + 1}$، فماذا تقبل الدالة $f$ عند $x = 3$؟',
    hint: '$f\'(x)$ سالبة لـ $x < 3$ ثم موجبة لـ $x > 3$.',
    options: [
      'قيمة قصوى مطلقة',
      'قيمة دنوية (Minimum)',
      'نقطة انعطاف دون مطراف',
      'فرعاً شلجمياً عمودياً'
    ],
    correctIndex: 1
  },
  {
    id: 't31_aux_min',
    section: 'B',
    topic: 31,
    prompt: 'الدالة المساعدة $g$ تقبل على $]0, +\\infty[$ قيمة دنوية هي $g(1) = 2 > 0$.\nعلماً أن $f\'(x) = \\frac{g(x)}{x^2}$، ماذا نستنتج عن رتابة $f$؟',
    hint: 'بما أن $g(1) = 2$ هي القيمة الدنوية فإن $\\forall x>0: g(x) \\ge 2 > 0$.',
    options: [
      '$f$ تناقصية قطعا على $]0, +\\infty[$',
      '$f$ تغير رتابتها عند $x = 1$',
      '$f$ تزايدية قطعا على $]0, +\\infty[$',
      '$f$ منعدمة عند $x = 2$'
    ],
    correctIndex: 2
  },
  {
    id: 't31_aux_alpha',
    section: 'B',
    topic: 31,
    prompt: 'في الجزء الأول من مسألة (البند 1.2.8): $g$ متصلة وتزايدية قطعا وتنعدم في $\\alpha$ ($g(\\alpha)=0$).\nإذا كان $f\'(x) = g(x)$، فإن إشارة $f\'(x)$ هي:',
    hint: 'إذا تزايدت $g$ وعبرت الصفر في $\\alpha$، فهي سالبة على اليسار وموجبة على اليمين.',
    options: [
      'سالبة على $]-\\infty, \\alpha]$ وموجبة على $[\\alpha, +\\infty[$',
      'موجبة على $]-\\infty, \\alpha]$ وسالبة على $[\\alpha, +\\infty[$',
      'موجبة دائماً على $\\mathbb{R}$',
      'سالبة دائماً على $\\mathbb{R}$'
    ],
    correctIndex: 0
  },
  {
    id: 't32_graph_ineq',
    section: 'B',
    topic: 32,
    prompt: 'انطلاقاً من المبيان أمامك ($(C_f)$ باللون الأزرق و $(C_g)$ باللون الأحمر):\nما مجموعة حلول المتراجحة $f(x) \\le g(x)$؟',
    hint: 'المجال الذي يقع فيه المنحنى $(C_f)$ تحت المنحنى $(C_g)$ بين نقطتي التقاطع.',
    options: ['$]-\\infty, -1]$', '$[-1, 2]$', '$[2, +\\infty[$', '$]-\\infty, -1] \\cup [2, +\\infty[$'],
    correctIndex: 1,
    graphSpec: { type: 'intersect_fg' }
  },
  {
    id: 't32_graph_sign',
    section: 'B',
    topic: 32,
    prompt: 'من المبيان لـ $(C_f)$ وتقاطعاته مع محور الأفاصيل $(Ox)$ عند $-2$ و $0$ و $2$:\nما مجموعة حلول المتراجحة $f(x) \\ge 0$؟',
    hint: 'ابحث عن المجالات التي يقع فيها $(C_f)$ فوق محور الأفاصيل $(Ox)$.',
    options: [
      '$[-2, 0] \\cup [2, +\\infty[$',
      '$]-\\infty, -2] \\cup [0, 2]$',
      '$[-2, 2]$',
      '$[0, +\\infty[$'
    ],
    correctIndex: 0,
    graphSpec: { type: 'cubic_ox_sign' }
  },
  {
    id: 't33_ineq_exp',
    section: 'B',
    topic: 33,
    prompt: 'بدراسة تغيرات $h(x) = e^x - x - 1$ على $\\mathbb{R}$، ما المتفاوتة الصحيحة لجميع $x \\in \\mathbb{R}$؟',
    hint: '$h\'(x) = e^x - 1$ تنعدم في $0$ وتكون $h(0) = 0$ قيمة دنوية.',
    options: ['$e^x \\le x + 1$', '$e^x \\ge x + 1$', '$e^x \\le x$', '$e^x - x < 0$'],
    correctIndex: 1
  },
  {
    id: 't33_ineq_ln',
    section: 'B',
    topic: 33,
    prompt: 'لتوظيف الرتابة على $]-1, +\\infty[$ مع $h(x) = x - \\ln(1 + x)$:\nبما أن القيمة الدنوية هي $h(0) = 0$، نستنتج:',
    hint: '$h(x) \\ge 0 \\iff x \\ge \\ln(1 + x)$.',
    options: [
      '$\\ln(1 + x) \\ge x$',
      '$\\ln(1 + x) \\le x$',
      '$\\ln(1 + x) > x + 1$',
      '$\\ln(x) \\le x - 2$'
    ],
    correctIndex: 1
  },
  {
    id: 't33_optim_rect',
    section: 'B',
    topic: 33,
    prompt: 'مسألة استمثال (1.2.12): مستطيل محيطه $20\\text{ m}$ (إذن الطول $y = 10 - x$).\nما قيمة $x$ التي تجعل المساحة $S(x) = x(10 - x)$ قصوى؟',
    hint: '$S\'(x) = 10 - 2x = 0$.',
    options: ['$x = 2$', '$x = 4$', '$x = 5 \\; (S = 25\\text{ m}^2)$', '$x = 8$'],
    correctIndex: 2
  },
  {
    id: 't34_concavity_inflect',
    section: 'B',
    topic: 34,
    prompt: 'لتكن $f(x) = x^3 - 3x^2 + 4$ (ومنه $f\'\'(x) = 6x - 6$).\nما نقطة الانعطاف $I$ وما مجال تحدب المنحنى ($f\'\'(x) \\ge 0$)؟',
    hint: '$f\'\'(x) = 0 \\iff x = 1$ وتغير إشارتها، و $f(1) = 2$.',
    options: [
      '$I(1, 2)$ ومحدب على $[1, +\\infty[$',
      '$I(0, 4)$ ومقعر على $[1, +\\infty[$',
      '$I(2, 0)$ ومحدب على $]-\\infty, 1]$',
      'لا توجد نقطة انعطاف'
    ],
    correctIndex: 0,
    graphSpec: { type: 'inflection_cubic' }
  },
  {
    id: 't34_fprime_inflect',
    section: 'B',
    topic: 34,
    prompt: 'بلا حساب $f\'\'$، متى تحدد المشتقة الأولى $f\'$ نقطة انعطاف في $x_0$؟',
    hint: 'مثال كلاسيكي: $f(x) = x^3$ عند $x_0 = 0$ حيث $f\'(x) = 3x^2 \\ge 0$.',
    options: [
      'إذا كانت $f\'$ ثابتة وموجبة',
      'إذا انعدمت $f\'$ في $x_0$ دون أن تغير إشارتها',
      'إذا كانت $f\'$ غير متصلة في $x_0$',
      'إذا انعدمت $f\'$ وغيرت إشارتها من $+$ إلى $-$'
    ],
    correctIndex: 1
  },
  {
    id: 't35_branch_ox',
    section: 'B',
    topic: 35,
    prompt: 'في شجرة الفروع اللانهائية: $\\lim_{x\\to+\\infty} f(x) = +\\infty$ و $\\lim_{x\\to+\\infty} \\frac{f(x)}{x} = 0$.\nما طبيعة الفرع اللانهائي لـ $(C_f)$ بجوار $+\\infty$؟',
    hint: 'نهاية $\\frac{f(x)}{x}$ منعدمة تعني أن النمو أبطأ من أي مستقيم مائل.',
    options: [
      'فرع شلجمي اتجاهه محور الأراتيب $(Oy)$',
      'فرع شلجمي اتجاهه محور الأفاصيل $(Ox)$',
      'مقارب أفقي $y = 0$',
      'مقارب مائل $y = x$'
    ],
    correctIndex: 1,
    graphSpec: { type: 'branch_parabolic_ox' }
  },
  {
    id: 't35_branch_oy',
    section: 'B',
    topic: 35,
    prompt: 'إذا كان $\\lim_{x\\to+\\infty} f(x) = +\\infty$ و $\\lim_{x\\to+\\infty} \\frac{f(x)}{x} = +\\infty$، فإن $(C_f)$ يقبل بجوار $+\\infty$:',
    hint: 'النمو أسرع من كل مستقيم مائل (مثل الدالة الأسية أو $x^2$).',
    options: [
      'فرع شلجمي اتجاهه محور الأراتيب $(Oy)$',
      'فرع شلجمي اتجاهه محور الأفاصيل $(Ox)$',
      'مقارب مائل معامل توجيهه $+\\infty$',
      'مقارب عمودي'
    ],
    correctIndex: 0
  },
  {
    id: 't35_branch_oblique',
    section: 'B',
    topic: 35,
    prompt: 'إذا كان $\\lim_{x\\to+\\infty} \\frac{f(x)}{x} = 2$ و $\\lim_{x\\to+\\infty} [f(x) - 2x] = -3$، فإن $(C_f)$ يقبل:',
    hint: '$\\lim [f(x) - ax] = b \\in \\mathbb{R}$ يعطي مقارباً مائلاً $y = ax + b$.',
    options: [
      'فرعاً شلجمياً اتجاهه المستقيم $y = 2x$',
      'مقارباً مائلاً معادلته $y = 2x - 3$',
      'مقارباً أفقياً $y = -3$',
      'مقارباً مائلاً $y = -3x + 2$'
    ],
    correctIndex: 1,
    graphSpec: { type: 'oblique_asymptote' }
  },
  {
    id: 't35_branch_parab_ax',
    section: 'B',
    topic: 35,
    prompt: 'إذا كان $\\lim_{x\\to+\\infty} \\frac{f(x)}{x} = 3$ و $\\lim_{x\\to+\\infty} [f(x) - 3x] = +\\infty$، فإن $(C_f)$ يقبل:',
    hint: 'وجود $\\pm\\infty$ في المرحلة الثانية $[f(x)-ax]$ يعني فرعاً شلجمياً!',
    options: [
      'مقارباً مائلاً $y = 3x$',
      'فرعاً شلجمياً اتجاهه محور الأراتيب $(Oy)$',
      'فرعاً شلجمياً اتجاهه المستقيم $y = 3x$',
      'مقارباً عمودياً $x = 3$'
    ],
    correctIndex: 2
  },
  {
    id: 't36_rel_pos_calc',
    section: 'B',
    topic: 36,
    prompt: 'ليكن المقارب المائل $(D): y = 2x + 1$ بحيث $f(x) - (2x + 1) = \\frac{x - 3}{x^2 + 1}$.\nمتى يقع المنحنى $(C_f)$ فوق المستقيم $(D)$؟',
    hint: 'يكون $(C_f)$ فوق $(D)$ عندما يكون الفرق $f(x) - y > 0$.',
    options: [
      'على المجال $]-\\infty, 3[$',
      'على المجال $]3, +\\infty[$',
      'على كل $\\mathbb{R}$',
      'على المجال $]-\\infty, 0[$'
    ],
    correctIndex: 1
  },
  {
    id: 't36_rel_pos_graph',
    section: 'B',
    topic: 36,
    prompt: 'في المبيان: يظهر $(C_f)$ والمقارب المائل $(D): y = x - 1$.\nعلى أي مجال يقع المنحنى $(C_f)$ تحت المقارب $(D)$؟',
    hint: 'لاحظ موضع المنحنى $(C_f)$ أسفل الخط المتقطع $(D)$.',
    options: ['$]-\\infty, 0[$', '$]0, +\\infty[$', '$]1, +\\infty[$', '$[-1, 1]$'],
    correctIndex: 0,
    graphSpec: { type: 'relative_position' }
  },
  {
    id: 't37_axis_sym',
    section: 'B',
    topic: 37,
    prompt: 'ما العلاقة التي تثبت أن المستقيم $(\\Delta): x = 3$ محور تماثل للمنحنى $(C_f)$ (البند 1.2.22)؟',
    hint: 'الصيغة لمحور التماثل $x = a$ هي $(2a - x) \\in D_f$ و $f(2a - x) = f(x)$.',
    options: [
      '$f(3 - x) = f(x)$',
      '$f(6 - x) = f(x)$ مع $(6 - x) \\in D_f$',
      '$f(6 - x) + f(x) = 6$',
      '$f(-x) = -f(x)$'
    ],
    correctIndex: 1
  },
  {
    id: 't37_center_sym',
    section: 'B',
    topic: 37,
    prompt: 'إذا تحقق $\\forall x \\in D_f: (4 - x) \\in D_f$ و $f(4 - x) + f(x) = 6$،\nفما إحداثيات مركز التماثل $\\Omega(a, b)$؟',
    hint: 'نطابق مع $2a - x = 4 - x$ و $2b = 6$.',
    options: ['$\\Omega(4, 6)$', '$\\Omega(2, 3)$', '$\\Omega(3, 2)$', '$\\Omega(2, 6)$'],
    correctIndex: 1
  },
  {
    id: 't37_parity_periodic',
    section: 'B',
    topic: 37,
    prompt: 'ادرس زوجية الدالة $f(x) = \\frac{x^3}{\\cos(x)}$ على مجالها المتماثل بالنسبة لـ $0$:',
    hint: '$(-x)^3 = -x^3$ و $\\cos(-x) = \\cos(x)$.',
    options: [
      'زوجية (محور التماثل هو $(Oy)$)',
      'فردية (مركز التماثل هو أصل المعلم $O$)',
      'دورية دورها $T = 3$',
      'لا زوجية ولا فردية'
    ],
    correctIndex: 1
  },
  {
    id: 't38_inverse_sketch',
    section: 'B',
    topic: 38,
    prompt: 'كيف يُنشأ منحنى الدالة العكسية $(C_{f^{-1}})$ انطلاقاً من $(C_f)$ في معلم متعامد ممنظم $(O,\\vec{i},\\vec{j})$؟',
    hint: 'تتبادل إحداثيات كل نقطة: $M(x, y) \\in (C_f) \\iff M\'(y, x) \\in (C_{f^{-1}})$.',
    options: [
      'بالتماثل بالنسبة لمحور الأفاصيل $(Ox)$',
      'بالتماثل بالنسبة لمحور الأراتيب $(Oy)$',
      'بالتماثل المحوري بالنسبة للمنصف الأول $(\\Delta): y = x$',
      'بالإزاحة بالمتجهة $\\vec{u}(1, 1)$'
    ],
    correctIndex: 2,
    graphSpec: { type: 'inverse_curve_sym' }
  },
  {
    id: 't38_transform_features',
    section: 'B',
    topic: 38,
    prompt: 'يقبل $(C_f)$ مقارباً أفقياً $y = 2$ بجوار $+\\infty$ ومماساً عمودياً في $A(0, 1)$.\nما خصائص منحنى الدالة العكسية $(C_{f^{-1}})$ الموافقة؟',
    hint: 'بالتماثل بالنسبة لـ $y = x$ تنقلب $x \\leftrightarrow y$ (الأفقي يصبح عمودياً والعمودي أفقياً!).',
    options: [
      'مقارب عمودي $x = 2$ ومماس أفقي في $A\'(1, 0)$',
      'مقارب أفقي $y = -2$ ومماس عمودي في $A\'(1, 0)$',
      'مقارب مائل $y = 2x$ ومماس في $O(0, 0)$',
      'يبقى المقارب أفقياً $y = 2$'
    ],
    correctIndex: 0
  }
];

window.pickRitualChallenge = function(filterMode = 'all', wardTopics = null, recentIds = []) {
  let pool = window.RITUAL_QUESTION_BANK;

  if (filterMode === 'sectionA') {
    pool = pool.filter(q => q.section === 'A');
  } else if (filterMode === 'sectionB') {
    pool = pool.filter(q => q.section === 'B');
  } else if (Array.isArray(wardTopics) && wardTopics.length > 0) {
    const wardPool = pool.filter(q => wardTopics.includes(q.topic));
    if (wardPool.length > 0) pool = wardPool;
  }

  let fresh = pool.filter(q => !recentIds.includes(q.id));
  if (fresh.length === 0) fresh = pool;
  return fresh[Math.floor(Math.random() * fresh.length)];
};
