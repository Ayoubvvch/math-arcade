/**
 * دروس ومفاهيم الدالة اللوغاريتمية ln والدالة الأسية eˣ والتكامل من الصفر
 * موجهة لتلاميذ الثانية باكالوريا علوم فيزيائية (المغرب)
 */

window.QUEST_LESSONS = {
  // ======================= LEVEL 1: ln(x) =======================
  ln_intro: {
    id: 'ln_intro',
    stepLabel: 'الدرس 1 • خطوة 1 / 3',
    title: 'ما هي الدالة اللوغاريتمية $\\ln(x)$؟ (من البداية!)',
    body: 'نعرف من الإشتقاق أن $(x^2)\' = 2x$ و $(x^3)\' = 3x^2$. لكن العلماء تساءلوا: ما هي الدالة التي مشتقتها $\\frac{1}{x}$؟ الجواب هو دالة جديدة اسمها **اللوغاريتم النيبيري** ونرمز لها بـ $\\ln(x)$.\n• شرط أساسي (مجموعة التعريف): $\\ln(x)$ لا تقبل أبداً الصفر ولا الأعداد السالبة! يجب دائماً أن يكون ما بداخلها **موجباً قطعاً**: $x > 0$.\n• القاعدة الذهبية الأولى: عند $x = 1$، تنعدم الدالة دائماً: $\\ln(1) = 0$.',
    formula: '$$D_{\\ln} = ]0, +\\infty[ \\quad\\bullet\\quad \\ln(1) = 0 \\\\[4pt] (\\ln x)\' = \\frac{1}{x}$$',
    example: 'أمثلة سريعة: $\\ln(5)$ موجودة لأن $5 > 0$. أما $\\ln(0)$ أو $\\ln(-2)$ فغير موجودة أبداً (ممنوعة)!',
    visualType: 'ln_curve',
    caption: 'منحنى ln(x): يعيش فقط في الجهة اليمنى (x > 0) ويمر من النقطة (1, 0)'
  },

  ln_e_sign: {
    id: 'ln_e_sign',
    stepLabel: 'الدرس 1 • خطوة 2 / 3',
    title: 'ما هو العدد العجيب $e$؟ ومتى تكون $\\ln(x)$ سالبة أو موجبة؟',
    body: 'العدد $e$ (يُسمى عدد أويلر أو ثابت نيبير) هو عدد مشهور مثل $\\pi$، قيمته التقريبية $e \\approx 2.718$. تم اختياره بدقة لكي يساوي لوغاريتمه $1$ تماماً: $\\ln(e) = 1$.\n• إشارة $\\ln(x)$ بسيطة جداً من خلال الرسم:\n  - بين $0$ و $1$ ($0 < x < 1$): المنحنى تحت المحور، إذن $\\ln(x) < 0$ (سالبة).\n  - عند $x = 1$: $\\ln(1) = 0$.\n  - أكبر من $1$ ($x > 1$): المنحنى فوق المحور، إذن $\\ln(x) > 0$ (موجبة).',
    formula: '$$e \\approx 2.718 \\implies \\ln(e) = 1 \\\\[4pt] 0 < x < 1 \\iff \\ln(x) < 0$$',
    example: 'مثال: $\\ln(0.5) < 0$ لأن $0.5 < 1$، بينما $\\ln(3) > 1$ لأن $3 > e \\approx 2.718$.',
    visualType: 'ln_curve',
    caption: 'تأمل النقطة (e, 1) وإشارة المنحنى حول العدد 1'
  },

  ln_props_deriv: {
    id: 'ln_props_deriv',
    stepLabel: 'الدرس 1 • خطوة 3 / 3',
    title: 'سحر $\\ln$ في الحساب، المشتقة والنهايات الأولى',
    body: 'الميزة الخارقة لـ $\\ln$ أنها **تحوّل الضرب إلى جمع والقسمة إلى طرح**!\n• إذا كان $a > 0$ و $b > 0$:\n  1) $\\ln(a \\times b) = \\ln(a) + \\ln(b)$\n  2) $\\ln\\left(\\frac{a}{b}\\right) = \\ln(a) - \\ln(b)$ و $\\ln\\left(\\frac{1}{a}\\right) = -\\ln(a)$\n  3) $\\ln(a^n) = n\\ln(a)$ (الأس ينزل أمام $\\ln$!).\n• وللتركيب: مشتقة $\\ln(u(x))$ هي $\\frac{u\'(x)}{u(x)}$. ونهايتها عند $0^+$ هي $-\\infty$ وعند $+\\infty$ هي $+\\infty$.',
    formula: '$$\\ln(ab) = \\ln a + \\ln b \\quad\\bullet\\quad \\ln(a^n) = n\\ln a \\\\[4pt] (\\ln u)\' = \\frac{u\'}{u}$$',
    example: 'مثال: $\\ln(2) + \\ln(3) = \\ln(2\\times 3) = \\ln(6)$، وكذلك $\\ln(e^5) = 5\\ln(e) = 5 \\times 1 = 5$.',
    visualType: 'ln_props',
    caption: 'اللوغاريتم يحوّل الضرب إلى جمع بسيط'
  },

  // ======================= LEVEL 2: e^x =======================
  exp_intro: {
    id: 'exp_intro',
    stepLabel: 'الدرس 2 • خطوة 1 / 3',
    title: 'ما هي الدالة الأسية $e^x$؟ (التوأم العكسي لـ $\\ln$)',
    body: 'الدالة الأسية النيبيرية $\\exp(x) = e^x$ هي بكل بساطة **الدالة العكسية** لـ $\\ln(x)$!\nتخيلها مثل مفتاح وقفل عكس بعضهما:\n• مجموعة تعريفها هي $\\mathbb{R}$ كلها (تقبل أي عدد حقيقي: موجب، سالب، أو صفر).\n• **أقوى قاعدة في البكالوريا**: $e^x$ **موجبة دائماً قطعاً** لكل $x \\in \\mathbb{R}$ ($e^x > 0$). مستحيل أن تساوي صفراً أو عدداً سالباً!\n• قيمتان للحفظ فوراً: $e^0 = 1$ و $e^1 = e \\approx 2.718$.',
    formula: '$$\\forall x \\in \\mathbb{R},\\; e^x > 0 \\\\[4pt] e^0 = 1 \\qquad\\bullet\\qquad e^1 = e$$',
    example: 'مثال: مهما كان $x$ (حتى $x = -1000$)، فإن $e^{-1000} > 0$! لهذا في المنحنى يطفو $e^x$ دائماً فوق المحور $y=0$.',
    visualType: 'exp_curve',
    caption: 'منحنى eˣ يطفو دائماً فوق المحور y = 0 ويمر من (0, 1)'
  },

  exp_inverse: {
    id: 'exp_inverse',
    stepLabel: 'الدرس 2 • خطوة 2 / 3',
    title: 'كيف تلغي $e^x$ و $\\ln$ بعضهما؟ + خصائص القوى',
    body: 'لأن $e^x$ و $\\ln$ متعاكستان، فإنهما تلغيان بعضهما البعض فوراً:\n• $\\ln(e^x) = x$ (لكل $x \\in \\mathbb{R}$)\n• $e^{\\ln(y)} = y$ (لكل $y > 0$)\n• لحل المعادلات ننتقل من واحدة لأخرى: $e^x = y \\iff x = \\ln(y)$ (بشرط $y > 0$).\nكما تحترم $e^x$ قواعد القوى المألوفة: $e^{a+b} = e^a \\cdot e^b$ و $e^{-a} = \\frac{1}{e^a}$.',
    formula: '$$\\ln(e^x) = x \\qquad e^{\\ln(y)} = y \\; (y>0) \\\\[4pt] e^{a+b} = e^a e^b$$',
    example: 'مثال: $e^{\\ln 7} = 7$، و $\\ln(e^{-3}) = -3$. وإذا أردنا حل $e^x = 5$ نُدخل $\\ln$ فنحصل على $x = \\ln(5)$.',
    visualType: 'exp_mirror',
    caption: 'التماثل العكسي: منحنى eˣ هو صورة منحنى ln(x) بالنسبة للمستقيم y = x'
  },

  exp_deriv_limits: {
    id: 'exp_deriv_limits',
    stepLabel: 'الدرس 2 • خطوة 3 / 3',
    title: 'معجزة الاشتقاق: $(e^x)\' = e^x$ والنهايات الأساسية',
    body: 'الدالة $e^x$ هي الدالة الوحيدة (مع مضاعفاتها) التي إذا اشتققتها **تبقى نفسها تماماً**: $(e^x)\' = e^x$!\nوإذا كان الأس دالة $u(x)$، فننزل مشتقة الأس أمامها: $(e^{u(x)})\' = u\'(x)\\, e^{u(x)}$.\n• **النهايات الأساسية (الطيران السريع)**:\n  - عند $-\\infty$: تقترب من $0$: $\\lim_{x\\to -\\infty} e^x = 0$ (مقارب أفقي $y=0$).\n  - عند $+\\infty$: تطير بقوة نحو $+\\infty$ وتغلب أي قوة $x^n$: $\\lim_{x\\to+\\infty}\\frac{e^x}{x} = +\\infty$.',
    formula: '$$(e^x)\' = e^x \\qquad (e^{u})\' = u\' e^{u} \\\\[4pt] \\lim_{x\\to -\\infty} e^x = 0 \\quad\\bullet\\quad \\lim_{x\\to +\\infty} \\frac{e^x}{x} = +\\infty$$',
    example: 'مثال: مشتقة $e^{3x}$ هي $3e^{3x}$. ونهاية $\\lim_{x\\to 0}\\frac{e^x - 1}{x} = 1$.',
    visualType: 'exp_tangent',
    caption: 'في كل نقطة، ميل المماس لمنحنى eˣ يساوي ارتفاع النقطة نفسها!'
  },

  // ======================= LEVEL 3: INTEGRAL ∫ =======================
  int_area_intro: {
    id: 'int_area_intro',
    stepLabel: 'الدرس 3 • خطوة 1 / 3',
    title: 'ما هو التكامل $\\int$؟ (مجرد حساب مساحة!)',
    body: 'لا تخف من الرمز $\\int$! هو في الأصل حرف S ممدود من كلمة **Sum (مجموع)**.\nعندما تكون الدالة $f(x) \\ge 0$ موجبة على مجال $[a, b]$، فإن التكامل $\\int_a^b f(x)\\,dx$ يعني ببساطة: **ما هي مساحة الحيز الملوّن تحت المنحنى $(C_f)$ بين $x = a$ و $x = b$؟**\nيمكن تقريب هذه المساحة بتقسيمها إلى مستطيلات صغيرة وجمع مساحاتها!',
    formula: '$$f(x) \\ge 0 \\;\\text{on}\\; [a, b] \\\\[4pt] \\int_a^b f(x)\\,dx = \\mathcal{A}\\text{ (المساحة)}$$',
    example: 'مثال سهل جداً: تحت المستقيم الأفقي $f(x) = 2$ بين $x = 1$ و $x = 4$ يوجد مستطيل عرضه $4-1=3$ وارتفاعه $2$، إذن $\\int_1^4 2\\,dx = 3 \\times 2 = 6$!',
    visualType: 'int_riemann',
    caption: 'تجميع المستطيلات يقربنا من المساحة الدقيقة تحت المنحنى'
  },

  int_primitive: {
    id: 'int_primitive',
    stepLabel: 'الدرس 3 • خطوة 2 / 3',
    title: 'الدالة الأصلية وصيغة الحساب: $F(b) - F(a)$',
    body: 'بدل حساب مستطيلات لا نهائية، اكتشف نيوتن ولايبنتز طريقة سحرية:\n1) نبحث عن **دالة أصلية** $F(x)$ للدالة $f(x)$ (أي الدالة التي إذا اشتققناها نجد $f$: $F\'(x) = f(x)$).\n   • أصلية $x^n$ هي $\\frac{x^{n+1}}{n+1}$ (لـ $n \\ne -1$).\n   • أصلية $\\frac{1}{x}$ على $]0, +\\infty[$ هي $\\ln(x)$!\n   • أصلية $e^x$ هي $e^x$ نفسها!\n2) ثم نعوّض بالحد الأعلى $b$ ناقص الحد الأدنى $a$:\n   $$\\int_a^b f(x)\\,dx = \\big[F(x)\\big]_a^b = F(b) - F(a)$$',
    formula: '$$\\int_a^b f(x)\\,dx = F(b) - F(a) \\\\[4pt] \\int_1^e \\frac{1}{x}\\,dx = [\\ln x]_1^e = 1 - 0 = 1$$',
    example: 'مثال: $\\int_0^1 e^x\\,dx = [e^x]_0^1 = e^1 - e^0 = e - 1$.',
    visualType: 'int_ln_area',
    caption: 'المساحة تحت منحنى 1/x بين 1 و e تساوي 1 بالضبط!'
  },

  int_chasles_basic: {
    id: 'int_chasles_basic',
    stepLabel: 'الدرس 3 • خطوة 3 / 3',
    title: 'الخصائص الأساسية: شال والخطانية وتغيير الحدين',
    body: 'بما أن التكامل يقيس المساحة بين $a$ و $b$، فكل خصائصه منطقية جداً:\n• إذا لم تتحرك ($a = b$): $\\int_a^a f(x)\\,dx = 0$.\n• إذا قلبت الحدين تتغير الإشارة: $\\int_b^a f(x)\\,dx = -\\int_a^b f(x)\\,dx$.\n• **علاقة شال (جمع المساحات المتجاورة)**:\n  $$\\int_a^c f(x)\\,dx + \\int_c^b f(x)\\,dx = \\int_a^b f(x)\\,dx$$\n• **الخطانية**: $\\int_a^b (\\alpha f + \\beta g) = \\alpha \\int_a^b f + \\beta \\int_a^b g$.',
    formula: '$$\\int_a^c f + \\int_c^b f = \\int_a^b f \\quad\\bullet\\quad \\int_a^a f = 0$$',
    example: 'إذا كانت المساحة من $0$ إلى $2$ تساوي $3$، ومن $2$ إلى $5$ تساوي $4$، فالمساحة الكلية من $0$ إلى $5$ هي $3 + 4 = 7$.',
    visualType: 'int_chasles',
    caption: 'علاقة شال: مساحة الكل = مجموع مساحتي الجزئين'
  },

  // ======================= LEVEL 4: SYNTHESIS & IBP =======================
  mix_equations: {
    id: 'mix_equations',
    stepLabel: 'الدرس 4 • خطوة 1 / 3',
    title: 'ربط $\\ln$ و $e^x$ في حل المعادلات البسيطة',
    body: 'تذكر دائماً القاعدة الذهبية لتحويل المعادلات:\n• لإزالة $\\ln$، نُطبّق $e^{(\\cdot)}$ على الطرفين (مع التحقق من أن داخل $\\ln$ موجب قطعاً!):\n  $$\\ln(A) = k \\iff A = e^k$$\n• لإزالة $e^{(\\cdot)}$، نُطبّق $\\ln$ على الطرفين (بشرط الطرف الثاني موجب قطعاً):\n  $$e^B = m \\; (m>0) \\iff B = \\ln(m)$$',
    formula: '$$\\ln(x-1) = 0 \\iff x - 1 = e^0 = 1 \\\\[4pt] \\iff x = 2$$',
    example: 'وكذلك: $e^{2x} = 1 \\iff 2x = \\ln(1) = 0 \\iff x = 0$. وأيضاً $\\int_0^{\\ln 3} e^x\\,dx = e^{\\ln 3} - e^0 = 3 - 1 = 2$.',
    visualType: 'exp_mirror',
    caption: 'التنقل بين ln و e يحل المعادلات بسهولة تامة'
  },

  mix_ibp: {
    id: 'mix_ibp',
    stepLabel: 'الدرس 4 • خطوة 2 / 3',
    title: 'مقدمة مبسطة: المكاملة بالأجزاء (ALPES)',
    body: 'عندما نجد داخل التكامل **جُداء دالتين** مثل $x \\ln(x)$ أو $x e^x$، لا نعرف أصليته مباشرة! فنستعمل تقنية **المكاملة بالأجزاء**:\nنسمي دالة $v(x)$ نشتقها، والأخرى $u\'(x)$ نبحث عن أصليتها $u(x)$:\n$$\\int_a^b u\'(x)\\,v(x)\\,dx = \\big[u(x)\\,v(x)\\big]_a^b - \\int_a^b u(x)\\,v\'(x)\\,dx$$\n• كيف نختار $v(x)$ (التي نشتقها)؟ تذكّر كلمة **ALPES** من اليسار لليمين: $\\ln$ أولاً، ثم الحدوديات $P(x)$، ثم $e^x$!',
    formula: '$$\\int_a^b u\'v = [uv]_a^b - \\int_a^b u v\' \\\\[4pt] (\\text{ALPES: } \\ln \\to x^n \\to e^x)$$',
    example: 'في $\\int_1^e \\ln(x)\\,dx$: نضع $v(x) = \\ln x \\implies v\' = \\frac{1}{x}$ و $u\'(x) = 1 \\implies u = x$.\nنجد: $[x\\ln x]_1^e - \\int_1^e x\\cdot\\frac{1}{x}\\,dx = e - (e - 1) = 1$!',
    visualType: 'mix_ibp',
    caption: 'المكاملة بالأجزاء تحسب حتى المساحة تحت ln(x) بسهولة!'
  },

  mix_area_between: {
    id: 'mix_area_between',
    stepLabel: 'الدرس 4 • خطوة 3 / 3',
    title: 'حساب المساحة المحصورة بين منحنيين (2BAC PC)',
    body: 'في تمارين الامتحان الوطني، يُطلب غالباً حساب مساحة الحيز المحصور بين منحنيين $(C_f)$ و $(C_g)$ ومستقيمين $x = a$ و $x = b$.\n• القاعدة: نطرح الدالة العليا من الدالة السفلى (أو نستعمل القيمة المطلقة $|f(x) - g(x)|$) ثم نضرب في وحدة المساحة $\\|\\vec{i}\\| \\cdot \\|\\vec{j}\\|$:\n$$\\mathcal{A} = \\left(\\int_a^b |f(x) - g(x)|\\,dx\\right) \\cdot \\|\\vec{i}\\| \\cdot \\|\\vec{j}\\|$$',
    formula: '$$\\mathcal{A} = \\int_a^b \\big(f(x) - g(x)\\big)\\,dx \\qquad (f \\ge g)$$',
    example: 'بما أن $e^x > x$ على $[0, 1]$، فالمساحة بينهما هي $\\int_0^1 (e^x - x)\\,dx = [e^x - \\frac{x^2}{2}]_0^1 = e - \\frac{3}{2}$.',
    visualType: 'mix_area_between',
    caption: 'المساحة بين منحنى eˣ والمستقيم y = x على المجال [0, 1]'
  }
};

// ======================= NOTEBOOK (دفتر الدروس من الصفر) =======================
window.QUEST_NOTEBOOK = {
  ln: [
    {
      title: '1️⃣ ما هي الدالة ln(x)؟ ولماذا وُجدت؟',
      body: 'عند دراسة الدوال الأصلية، نعرف أن أصلية $x^2$ هي $\\frac{x^3}{3}$، وأصلية $1$ هي $x$... لكن لم نجد من قبل دالة حدودية مشتقتها $\\frac{1}{x}$! لذا عرّف الرياضيون دالة جديدة على $]0, +\\infty[$ اسمها **اللوغاريتم النيبيري $\\ln$** بحيث مشتقتها هي $\\frac{1}{x}$ وتنعدم في $1$.',
      formula: '$$D_{\\ln} = ]0, +\\infty[ \\qquad \\bullet \\qquad \\ln(1) = 0 \\qquad \\bullet \\qquad (\\ln x)\' = \\frac{1}{x}$$'
    },
    {
      title: '2️⃣ مجموعة التعريف وإشارة ln(x)',
      body: '• **تنبيه مهم**: ما بداخل $\\ln(\\dots)$ يجب أن يكون دائماً **موجباً قطعاً** ($> 0$). مثلاً $\\ln(x-2)$ معرفة فقط عندما $x-2 > 0$ أي $x > 2$.\n• العدد **$e \\approx 2.718$** هو العدد الوحيد الذي يحقق $\\ln(e) = 1$.\n• **الإشارة**: $\\ln(x) < 0$ عندما $0 < x < 1$، و $\\ln(x) = 0$ عند $x=1$، و $\\ln(x) > 0$ عندما $x > 1$.',
      formula: '$$\\ln(e) = 1 \\qquad | \\qquad 0<x<1 \\implies \\ln(x)<0 \\qquad | \\qquad x>1 \\implies \\ln(x)>0$$'
    },
    {
      title: '3️⃣ الخصائص الجبرية والنهايات الاعتيادية (للحفظ والفهم)',
      body: 'لكل $a > 0$ و $b > 0$ و $n \\in \\mathbb{Q}$:\n• $\\ln(a\\times b) = \\ln(a) + \\ln(b)$\n• $\\ln\\left(\\frac{a}{b}\\right) = \\ln(a) - \\ln(b)$ و $\\ln\\left(\\frac{1}{a}\\right) = -\\ln(a)$\n• $\\ln(a^n) = n\\ln(a)$ و $\\ln(\\sqrt{a}) = \\frac{1}{2}\\ln(a)$\n• إذا كانت $u(x) > 0$: $(\\ln u(x))\' = \\frac{u\'(x)}{u(x)}$.',
      formula: '$$\\lim_{x\\to 0^+} \\ln x = -\\infty \\quad\\bullet\\quad \\lim_{x\\to +\\infty} \\ln x = +\\infty \\\\[6pt] \\lim_{x\\to +\\infty}\\frac{\\ln x}{x} = 0 \\quad\\bullet\\quad \\lim_{x\\to 0^+} x\\ln x = 0 \\quad\\bullet\\quad \\lim_{x\\to 1}\\frac{\\ln x}{x-1} = 1$$'
    }
  ],

  exp: [
    {
      title: '1️⃣ ما هي الدالة الأسية eˣ؟',
      body: 'الدالة الأسية $\\exp(x) = e^x$ هي **الدالة العكسية** لدالة $\\ln$ من $]0, +\\infty[$ نحو $\\mathbb{R}$. أي أنهما تلغيان بعضهما البعض! وهي معرفة على $\\mathbb{R}$ كلها ومجال قيمها هو $]0, +\\infty[$ فقط.',
      formula: '$$\\forall x \\in \\mathbb{R},\\; e^x > 0 \\quad\\bullet\\quad e^0 = 1 \\quad\\bullet\\quad e^1 = e \\approx 2.718 \\\\[6pt] \\ln(e^x) = x \\qquad\\bullet\\qquad e^{\\ln y} = y\\; (y>0)$$'
    },
    {
      title: '2️⃣ قواعد الحساب وحل المعادلات والمتراجحات',
      body: '• **قواعد القوى**: $e^{a+b} = e^a \\cdot e^b$ ، $e^{a-b} = \\frac{e^a}{e^b}$ ، $e^{-a} = \\frac{1}{e^a}$ ، $(e^a)^n = e^{na}$.\n• **لأن $e^x$ تزايدية قطعاً**: $e^a = e^b \\iff a = b$ و $e^a < e^b \\iff a < b$.\n• **التحويل الذهبي**: $e^x = m \\iff x = \\ln(m)$ (لـ $m > 0$).',
      formula: '$$e^{a+b} = e^a e^b \\qquad e^{-x} = \\frac{1}{e^x} \\qquad e^x = y \\iff x = \\ln y\\; (y>0)$$'
    },
    {
      title: '3️⃣ الاشتقاق والنهايات الاعتيادية لـ eˣ',
      body: '• مشتقة $e^x$ هي نفسها $e^x$! وبشكل عام: $(e^{u(x)})\' = u\'(x)\\,e^{u(x)}$.\n• الأسية تنمو أسرع من كل القوى $x^n$ عند $+\\infty$ وتؤول لـ $0$ بسرعة عند $-\\infty$.',
      formula: '$$(e^x)\' = e^x \\quad\\bullet\\quad (e^u)\' = u\'e^u \\quad\\bullet\\quad \\lim_{x\\to -\\infty} e^x = 0 \\\\[6pt] \\lim_{x\\to +\\infty} \\frac{e^x}{x^n} = +\\infty \\quad\\bullet\\quad \\lim_{x\\to -\\infty} x e^x = 0 \\quad\\bullet\\quad \\lim_{x\\to 0} \\frac{e^x - 1}{x} = 1$$'
    }
  ],

  integral: [
    {
      title: '1️⃣ الفهم البديهي: ما هي الدالة الأصلية وما هو التكامل؟',
      body: '• **الدالة الأصلية $F$** لـ $f$ هي عكس الاشتقاق: $F\'(x) = f(x)$.\n• **التكامل المحدود $\\int_a^b f(x)\\,dx$** عندما تكون $f \\ge 0$ يمثل **مساحة الحيز** تحت منحنى $f$ بين $x=a$ و $x=b$. ونحسبه مباشرة بالصيغة الأساسية:',
      formula: '$$\\int_a^b f(x)\\,dx = \\big[F(x)\\big]_a^b = F(b) - F(a)$$'
    },
    {
      title: '2️⃣ الدوال الأصلية الأكثر استعمالاً في البكالوريا',
      body: 'احفظ هذه الأصليات الأربع فهي مفتاح 90% من التمارين:\n1) $x^n \\longrightarrow \\frac{x^{n+1}}{n+1}$ ($n \\ne -1$)\n2) $\\frac{1}{x} \\longrightarrow \\ln|x|$ وبوجه عام $\\frac{u\'}{u} \\longrightarrow \\ln|u|$\n3) $e^x \\longrightarrow e^x$ وبوجه عام $u\'e^u \\longrightarrow e^u$\n4) $e^{ax} \\longrightarrow \\frac{1}{a}e^{ax}$ ($a \\ne 0$).',
      formula: '$$\\int_1^e \\frac{1}{x}\\,dx = [\\ln x]_1^e = 1 \\qquad \\bullet \\qquad \\int_0^1 e^x\\,dx = [e^x]_0^1 = e - 1$$'
    },
    {
      title: '3️⃣ خصائص التكامل، المكاملة بالأجزاء، وحساب المساحات',
      body: '• **شال**: $\\int_a^c f + \\int_c^b f = \\int_a^b f$ ، و $\\int_a^a f = 0$ ، و $\\int_b^a f = -\\int_a^b f$.\n• **المكاملة بالأجزاء**: $\\int_a^b u\'(x)v(x)\\,dx = [u(x)v(x)]_a^b - \\int_a^b u(x)v\'(x)\\,dx$ (نختار $v$ وفق ترتيب **ALPES**: $\\ln$ قبل الحدوديات قبل $e^x$).\n• **المساحة بين منحنيين**: $\\mathcal{A} = \\left(\\int_a^b |f(x) - g(x)|\\,dx\\right) \\cdot \\|\\vec{i}\\| \\cdot \\|\\vec{j}\\|$.',
      formula: '$$\\int_1^e \\ln(x)\\,dx = 1 \\qquad \\bullet \\qquad \\int_0^1 x e^x\\,dx = 1$$'
    }
  ],

  cheatsheet: [
    {
      title: '📌 جدول القيم المرجعية السريع',
      body: 'هذه القيم الخمس ستحل لك معظم الأسئلة في لمح البصر:',
      formula: '$$\\ln(1) = 0 \\quad \\bullet \\quad \\ln(e) = 1 \\quad \\bullet \\quad e^0 = 1 \\quad \\bullet \\quad e^1 = e \\approx 2.72 \\quad \\bullet \\quad \\int_1^e \\frac{1}{x}dx = 1$$'
    },
    {
      title: '📌 مقارنة سريعة: الاشتقاق ⇄ الأصلية',
      body: 'تذكّر أن الاشتقاق والتكامل عمليتان متعاكستان:',
      formula: '$$\\ln(x) \\xrightarrow{\\text{اشتقاق}} \\frac{1}{x} \\xrightarrow{\\text{أصلية}} \\ln|x| \\qquad\\qquad e^{ax} \\xrightarrow{\\text{اشتقاق}} a e^{ax} \\xrightarrow{\\text{أصلية}} \\frac{1}{a}e^{ax}$$'
    },
    {
      title: '📌 3 أخطاء شائعة احذر منها!',
      body: '❌ الخطأ 1: $\\ln(a + b) = \\ln a + \\ln b$ — خطأ! الصح هو $\\ln(a \\times b) = \\ln a + \\ln b$.\n❌ الخطأ 2: $e^0 = 0$ — خطأ! الصح $e^0 = 1$ و $e^x > 0$ دائماً.\n❌ الخطأ 3: نسيان طرح $F(a)$ في $\\int_0^1 e^x dx$ وكتابة $e$ بدل $e - 1$ لأن $e^0 = 1$ وليس $0$!',
      formula: '$$\\int_0^1 e^x\\,dx = e^1 - e^0 = e - 1 \\neq e$$'
    }
  ]
};

// ======================= CASTLE GATE INTERACTIVE PUZZLES =======================
window.GATE_PUZZLES = {
  1: [
    {
      prompt: 'تأمل منحنى $y = \\ln(x)$ في الرسم أعلاه. عند أي قيمة لـ $x$ يقطع المنحنى محور الأفاصيل (أي $\\ln(x) = 0$) وعند أي قيمة يبلغ الارتفاع $1$؟',
      options: [
        'ينعدم عند $x = 0$ ويبلغ $1$ عند $x = 1$',
        'ينعدم عند $x = 1$ ويبلغ $1$ عند $x = e \\approx 2.72$',
        'ينعدم عند $x = e$ ويبلغ $1$ عند $x = 1$',
        'ينعدم عند $x = -1$ ويبلغ $1$ عند $x = 0$'
      ],
      correctIndex: 1,
      visualType: 'ln_curve',
      hint: 'تذكّر: $\\ln(x)$ لا تقبل $x = 0$ أصلاً! المنحنى يمر دوماً من النقطتين $(1, 0)$ و $(e, 1)$.',
      successMsg: 'ممتاز! $\\ln(1) = 0$ و $\\ln(e) = 1$ هما نقطتا الأساس لرسم منحنى اللوغاريتم!'
    },
    {
      prompt: 'باستعمال خصائص اللوغاريتم البسيطة، ما قيمة التعبير: $$\\ln(e^2) + \\ln(1)$$ لكي تنفتح بوابة القلعة؟',
      options: ['$2$', '$e^2$', '$0$', '$3$'],
      correctIndex: 0,
      visualType: 'ln_props',
      hint: 'تذكّر: $\\ln(1) = 0$، والأس $2$ ينزل أمام $\\ln$: $\\ln(e^2) = 2\\ln(e) = 2 \\times 1$.',
      successMsg: 'أحسنت! $\\ln(e^2) + \\ln(1) = 2 + 0 = 2$. لقد أتقنت أساسيات $\\ln$!'
    }
  ],

  2: [
    {
      prompt: 'تأمل منحنى الدالة الأسية $y = e^x$ في الرسم: ما هي مجموعة حلول المعادلة $e^x = -2$؟',
      options: [
        '$x = \\ln(-2)$',
        '$x = -e^2$',
        '$S = \\emptyset$ (لا توجد حلول لأن $e^x > 0$ دائماً!)',
        '$x = 0$'
      ],
      correctIndex: 2,
      visualType: 'exp_curve',
      hint: 'انظر إلى الرسم: منحنى $e^x$ يقع بالكامل فوق محور الأفاصيل $y = 0$. هل يمكن لـ $e^x$ أن تساوي عدداً سالباً؟',
      successMsg: 'رائع جداً! هذه القاعدة الذهبية: $e^x > 0$ دائماً، لذا يستحيل أن تساوي $-2$ أو $0$!'
    },
    {
      prompt: 'ما هي مشتقة الدالة $f(x) = e^{2x} + 3$؟',
      options: [
        '$f\'(x) = e^{2x}$',
        '$f\'(x) = 2e^{2x}$',
        '$f\'(x) = 2x e^{2x} + 3$',
        '$f\'(x) = e^2$'
      ],
      correctIndex: 1,
      visualType: 'exp_tangent',
      hint: 'مشتقة العدد الثابت $3$ هي $0$، ومشتقة $e^{u(x)}$ هي $u\'(x) e^{u(x)}$ حيث $u(x) = 2x \\implies u\'(x) = 2$.',
      successMsg: 'ممتاز! $(e^{2x})\' = 2e^{2x}$. أنت جاهز للطيران إلى معبد التكامل!'
    }
  ],

  3: [
    {
      prompt: 'حرّك شريط المستطيلات في الرسم لترى كيف تقترب المستطيلات من المساحة الحقيقية تحت منحنى $y = \\frac{1}{x}$ من $x=1$ إلى $x=e$.\nما القيمة المضبوطة لهذه المساحة: $$I = \\int_1^e \\frac{1}{x}\\,dx$$',
      options: ['$0$', '$e$', '$1$', '$e - 1$'],
      correctIndex: 2,
      visualType: 'int_ln_area',
      hasRiemannSlider: true,
      hint: 'الدالة الأصلية لـ $\\frac{1}{x}$ على $]0, +\\infty[$ هي $\\ln(x)$. إذن نطبق $[\\ln x]_1^e = \\ln(e) - \\ln(1)$.',
      successMsg: 'مذهل! $\\ln(e) - \\ln(1) = 1 - 0 = 1$. المساحة تساوي $1$ بالضبط!'
    },
    {
      prompt: 'احسب التكامل التالي باستعمال الدالة الأصلية لـ $e^x$: $$J = \\int_0^1 e^x\\,dx$$ (انتبه جيداً للحد السفلي $0$!)',
      options: ['$e$', '$e - 1$', '$1$', '$e + 1$'],
      correctIndex: 1,
      visualType: 'int_riemann',
      hint: 'أصلية $e^x$ هي $e^x$ نفسها. احسب $F(1) - F(0) = e^1 - e^0$ ولا تنسَ أن $e^0 = 1$!',
      successMsg: 'أحسنت! هذا من أكثر الأخطاء شيوعاً وقد تفاديته: $e^1 - e^0 = e - 1$!'
    }
  ],

  4: [
    {
      prompt: 'توليفة $\\ln$ و $e^x$ والتكامل: احسب قيمة التكامل التالي: $$K = \\int_0^{\\ln 5} e^x\\,dx$$',
      options: ['$5$', '$4$', '$\\ln 5$', '$5 - e$'],
      correctIndex: 1,
      visualType: 'exp_mirror',
      hint: '$K = [e^x]_0^{\\ln 5} = e^{\\ln 5} - e^0$. تذكّر أن $e^{\\ln 5} = 5$ و $e^0 = 1$!',
      successMsg: 'ذكي جداً! $e^{\\ln 5} - e^0 = 5 - 1 = 4$.'
    },
    {
      prompt: 'تحدي الختام (المكاملة بالأجزاء): لحساب $\\int_1^e \\ln(x)\\,dx$، اخترنا $v(x)=\\ln x$ و $u\'(x)=1$ (ومنه $u(x)=x$).\nما النتيجة النهائية لهذا التكامل؟',
      options: ['$e$', '$1$', '$e - 1$', '$0$'],
      correctIndex: 1,
      visualType: 'mix_ibp',
      hint: 'طبّق $[x\\ln x]_1^e - \\int_1^e x\\cdot\\frac{1}{x}\\,dx = (e\\ln e - 1\\ln 1) - \\int_1^e 1\\,dx = e - (e - 1)$.',
      successMsg: 'عبقري! $\\int_1^e \\ln(x)\\,dx = 1$ تماماً! تهانينا يا بطل التحليل الرياضي 2BAC!'
    }
  ]
};

// ======================= VISUAL DIAGRAM RENDERER =======================
window.drawLessonDiagram = function(canvas, visualType, sliderVal = 4) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Dark Blueprint background
  ctx.fillStyle = '#050c17';
  ctx.fillRect(0, 0, W, H);
  ctx.direction = 'ltr';

  let xmin = -1.2, xmax = 4.5, ymin = -2.0, ymax = 3.2;
  if (visualType === 'exp_curve') { xmin = -2.2; xmax = 2.2; ymin = -0.6; ymax = 5.0; }
  else if (visualType === 'exp_mirror') { xmin = -1.8; xmax = 4.2; ymin = -1.8; ymax = 4.2; }
  else if (visualType === 'exp_tangent') { xmin = -1.5; xmax = 2.0; ymin = -0.5; ymax = 4.5; }
  else if (visualType === 'int_riemann') { xmin = -0.3; xmax = 3.4; ymin = -0.4; ymax = 4.0; }
  else if (visualType === 'int_ln_area') { xmin = 0; xmax = 3.5; ymin = -0.3; ymax = 1.6; }
  else if (visualType === 'int_chasles') { xmin = -0.4; xmax = 5.6; ymin = -0.4; ymax = 3.0; }
  else if (visualType === 'mix_ibp') { xmin = 0; xmax = 3.3; ymin = -0.3; ymax = 1.5; }
  else if (visualType === 'mix_area_between') { xmin = -0.3; xmax = 1.5; ymin = -0.3; ymax = 3.2; }
  else if (visualType === 'ln_props') { xmin = 0; xmax = 7.0; ymin = -0.6; ymax = 2.6; }

  const pad = 26;
  const toX = x => pad + ((x - xmin) / (xmax - xmin)) * (W - pad * 2);
  const toY = y => H - pad - ((y - ymin) / (ymax - ymin)) * (H - pad * 2);

  // Grid lines
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let gx = Math.ceil(xmin); gx <= Math.floor(xmax); gx++) {
    ctx.moveTo(toX(gx), pad * 0.4);
    ctx.lineTo(toX(gx), H - pad * 0.4);
  }
  for (let gy = Math.ceil(ymin); gy <= Math.floor(ymax); gy++) {
    ctx.moveTo(pad * 0.4, toY(gy));
    ctx.lineTo(W - pad * 0.4, toY(gy));
  }
  ctx.stroke();

  // Axes
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.55)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  if (ymin <= 0 && ymax >= 0) {
    ctx.moveTo(pad * 0.4, toY(0));
    ctx.lineTo(W - pad * 0.4, toY(0));
  }
  if (xmin <= 0 && xmax >= 0) {
    ctx.moveTo(toX(0), pad * 0.4);
    ctx.lineTo(toX(0), H - pad * 0.4);
  }
  ctx.stroke();

  const plotFn = (fn, color, dashed = false, x0 = xmin, x1 = xmax, lw = 2.6) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    if (dashed) ctx.setLineDash([5, 4]);
    ctx.beginPath();
    let started = false;
    const steps = 160;
    for (let i = 0; i <= steps; i++) {
      const x = x0 + ((x1 - x0) * i) / steps;
      const y = fn(x);
      if (!Number.isFinite(y) || y < ymin - 0.5 || y > ymax + 0.5) {
        started = false;
        continue;
      }
      const px = toX(x);
      const py = toY(y);
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  };

  const dot = (x, y, label, color = '#fbbf24', dx = 7, dy = -7) => {
    const px = toX(x), py = toY(y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#050c17';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    if (label) {
      ctx.fillStyle = color;
      ctx.font = '800 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(label, px + dx, py + dy);
    }
  };

  if (visualType === 'ln_curve') {
    // Forbidden zone x <= 0
    ctx.fillStyle = 'rgba(244, 63, 94, 0.16)';
    ctx.fillRect(pad * 0.4, pad * 0.4, Math.max(0, toX(0) - pad * 0.4), H - pad * 0.8);
    ctx.fillStyle = '#fda4af';
    ctx.font = '700 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('x ≤ 0 (X)', (pad * 0.4 + toX(0)) / 2, toY(1.2));

    plotFn(x => x > 0.08 ? Math.log(x) : NaN, '#34d399', false, 0.08, xmax);
    dot(1, 0, '(1, 0)', '#fbbf24', 6, 14);
    dot(Math.E, 1, '(e, 1)', '#38bdf8', 6, -8);
    ctx.fillStyle = '#34d399';
    ctx.font = '800 12px monospace';
    ctx.fillText('y = ln(x)', toX(3.0), toY(1.8));
  } else if (visualType === 'ln_props') {
    plotFn(x => x > 0.2 ? Math.log(x) : NaN, '#34d399', false, 0.25, xmax);
    dot(2, Math.log(2), 'ln(2)≈0.69', '#38bdf8', -10, -10);
    dot(3, Math.log(3), 'ln(3)≈1.10', '#c084fc', -10, -10);
    dot(6, Math.log(6), 'ln(6)≈1.79', '#fbbf24', -54, -10);
  } else if (visualType === 'exp_curve') {
    plotFn(() => 0, '#fb7185', true);
    plotFn(x => Math.exp(x), '#fbbf24');
    dot(0, 1, '(0, 1)', '#38bdf8', 8, 4);
    dot(1, Math.E, '(1, e)', '#34d399', 8, 2);
    ctx.fillStyle = '#fbbf24';
    ctx.font = '800 12px monospace';
    ctx.fillText('y = e^x > 0', toX(-1.9), toY(3.6));
  } else if (visualType === 'exp_mirror') {
    plotFn(x => x, 'rgba(148,163,184,0.6)', true);
    plotFn(x => Math.exp(x), '#fbbf24');
    plotFn(x => x > 0.08 ? Math.log(x) : NaN, '#34d399', false, 0.08, xmax);
    dot(0, 1, '(0,1)', '#fbbf24', -34, -6);
    dot(1, 0, '(1,0)', '#34d399', 6, 13);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 11px monospace';
    ctx.fillText('y = x', toX(3.0), toY(3.3));
  } else if (visualType === 'exp_tangent') {
    plotFn(x => Math.exp(x), '#fbbf24');
    // Tangent at x=0: y = x + 1
    plotFn(x => x + 1, '#38bdf8', true, -1.2, 1.4, 2);
    dot(0, 1, 'slope=1', '#38bdf8', 8, 10);
    dot(1, Math.E, 'slope=e', '#34d399', 8, 0);
  } else if (visualType === 'int_riemann') {
    const f = x => Math.exp(x * 0.45);
    const a = 0.2, b = 2.8;
    const n = Math.max(1, Math.min(16, Number(sliderVal) || 4));
    const dx = (b - a) / n;
    for (let i = 0; i < n; i++) {
      const xi = a + i * dx;
      const h = f(xi + dx * 0.5);
      const rx = toX(xi);
      const rw = toX(xi + dx) - rx;
      const ry = toY(h);
      const rh = toY(0) - ry;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.34)';
      ctx.fillRect(rx, ry, Math.max(1, rw - 1), rh);
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(rx, ry, Math.max(1, rw - 1), rh);
    }
    plotFn(f, '#fbbf24', false, 0, 3.2);
    ctx.fillStyle = '#fbbf24';
    ctx.font = '800 11px monospace';
    ctx.fillText(`n = ${n} slices`, toX(0.25), toY(3.3));
  } else if (visualType === 'int_ln_area') {
    const a = 1, b = Math.E;
    const n = Math.max(1, Math.min(20, Number(sliderVal) || 6));
    const dx = (b - a) / n;
    for (let i = 0; i < n; i++) {
      const xi = a + i * dx;
      const h = 1 / (xi + dx * 0.5);
      const rx = toX(xi);
      const rw = toX(xi + dx) - rx;
      const ry = toY(h);
      const rh = toY(0) - ry;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
      ctx.fillRect(rx, ry, Math.max(1, rw - 1), rh);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(rx, ry, Math.max(1, rw - 1), rh);
    }
    plotFn(x => x > 0.4 ? 1 / x : NaN, '#fbbf24', false, 0.5, 3.4);
    dot(1, 1, '1', '#fbbf24', 8, -8);
    dot(Math.E, 1 / Math.E, 'e', '#34d399', 6, -9);
    ctx.fillStyle = '#e0f2fe';
    ctx.font = '800 11px monospace';
    ctx.fillText('y = 1/x, Area = 1', toX(1.3), toY(1.25));
  } else if (visualType === 'int_chasles') {
    const f = x => 1.2 + 0.5 * Math.sin(x * 0.9);
    const fillRange = (x0, x1, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(toX(x0), toY(0));
      for (let i = 0; i <= 40; i++) {
        const x = x0 + ((x1 - x0) * i) / 40;
        ctx.lineTo(toX(x), toY(f(x)));
      }
      ctx.lineTo(toX(x1), toY(0));
      ctx.closePath();
      ctx.fill();
    };
    fillRange(0, 2, 'rgba(56, 189, 248, 0.35)');
    fillRange(2, 5, 'rgba(16, 185, 129, 0.35)');
    plotFn(f, '#fbbf24', false, 0, 5.2);
    ctx.fillStyle = '#bae6fd';
    ctx.font = '800 11px monospace';
    ctx.fillText('a=0', toX(0), toY(-0.28));
    ctx.fillText('c=2', toX(1.85), toY(-0.28));
    ctx.fillText('b=5', toX(4.85), toY(-0.28));
  } else if (visualType === 'mix_ibp') {
    ctx.fillStyle = 'rgba(168, 85, 247, 0.32)';
    ctx.beginPath();
    ctx.moveTo(toX(1), toY(0));
    for (let i = 0; i <= 50; i++) {
      const x = 1 + ((Math.E - 1) * i) / 50;
      ctx.lineTo(toX(x), toY(Math.log(x)));
    }
    ctx.lineTo(toX(Math.E), toY(0));
    ctx.closePath();
    ctx.fill();
    plotFn(x => x > 0.5 ? Math.log(x) : NaN, '#e879f9', false, 0.6, 3.2);
    dot(1, 0, '1', '#fbbf24', -4, 14);
    dot(Math.E, 1, '(e, 1)', '#34d399', -26, -8);
    ctx.fillStyle = '#f3e8ff';
    ctx.font = '800 11px monospace';
    ctx.fillText('∫₁ᵉ ln(x)dx = 1', toX(1.4), toY(1.2));
  } else if (visualType === 'mix_area_between') {
    ctx.fillStyle = 'rgba(251, 191, 36, 0.28)';
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const x = i / 40;
      const px = toX(x), py = toY(Math.exp(x));
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    for (let i = 40; i >= 0; i--) {
      const x = i / 40;
      ctx.lineTo(toX(x), toY(x));
    }
    ctx.closePath();
    ctx.fill();
    plotFn(x => Math.exp(x), '#fbbf24', false, -0.2, 1.25);
    plotFn(x => x, '#38bdf8', false, -0.2, 1.4);
    ctx.fillStyle = '#fbbf24';
    ctx.font = '800 11px monospace';
    ctx.fillText('e^x', toX(0.9), toY(2.7));
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('y = x', toX(1.05), toY(0.95));
  }
};
