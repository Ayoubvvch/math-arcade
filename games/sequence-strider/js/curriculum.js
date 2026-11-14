/**
 * Sequence Strider (عدّاء المتتاليات): Suites Numériques Curriculum Engine (KaTeX Edition)
 * Covers 100% of Topics 39 through 50:
 *   Section A (39-44): Induction, Bounds, Monotonicity, Arithmetic, Geometric, Auxiliary (1.1.1)
 *   Section B (45-50): Reference & q^n Limits, Monotone Convergence, Squeeze/Criteria (1.1.2),
 *                      Function Composition (1.1.3), Recursive u_{n+1}=f(u_n) (1.1.4), Modeling (1.1.5)
 */

window.SEQ_TOPICS = {
  39: 'البرهان بالترجع (Récurrence)',
  40: 'المتتالية المكبورة والمصغورة والمحدودة',
  41: 'رتابة متتالية وإشارة الفرق / $f(x)-x$',
  42: 'المتتالية الحسابية ومجموع حدودها',
  43: 'المتتالية الهندسية ومجموع حدودها',
  44: 'المتتالية المساعدة للتآلفية والمتخاطة (1.1.1)',
  45: 'نهايات المتتاليات المرجعية و $q^n$ (1.1.2)',
  46: 'مبرهنات التقارب الرتيب',
  47: 'مصاديق التقارب والدركيين والحصر (1.1.2)',
  48: 'نهاية مركب متتالية ودالة متصلة (1.1.3)',
  49: 'المتتالية الترجعية $u_{n+1} = f(u_n)$ (1.1.4)',
  50: 'توظيف المتتاليات في مسائل متنوعة (1.1.5)'
};

window.SEQ_SECTORS = [
  { id: 1, name: 'القطاع 1 — الترجع، المحدودية والرتابة (39–41)', topics: [39, 40, 41], color: '#38bdf8' },
  { id: 2, name: 'القطاع 2 — الحسابية، الهندسية والمساعدة (42–44)', topics: [42, 43, 44], color: '#a855f7' },
  { id: 3, name: 'القطاع 3 — النهايات، التقارب الرتيب والدركيين (45–47)', topics: [45, 46, 47], color: '#10b981' },
  { id: 4, name: 'القطاع 4 — النقطة الصامدة والنمذجة (48–50)', topics: [48, 49, 50], color: '#f59e0b' }
];

window.SEQ_QUESTION_BANK = [
  // ================= SECTION A: BASIC CONCEPTS & PROGRESSION (39 - 44) =================
  {
    id: 't39_steps',
    section: 'A',
    topic: 39,
    prompt: 'ما الترتيب المنطقي الصحيح لمراحل البرهان بالترجع لإثبات خاصية $P(n)$ لجميع $n \\ge n_0$؟',
    hint: 'تبدأ بالتحقق عند الحد الأول $n_0$، ثم تفترض الصحة عند $n$، ثم تبرهن عليها عند $n+1$: $P(n) \\implies P(n+1)$.',
    options: [
      'الافتراض ثم التحقق البدئي ثم نهاية المتتالية',
      'التحقق من $P(n_0)$، افتراض $P(n)$ لـ $n$ ثابت، ثم إثبات $P(n+1)$',
      'إثبات $P(n+1)$ مباشرة دون شرط بدئي',
      'حساب $u_1$ و $u_2$ يكفي لجميع $n \\in \\mathbb{N}$'
    ],
    correctIndex: 1
  },
  {
    id: 't39_induction_rec',
    section: 'A',
    topic: 39,
    prompt: 'لتكن $u_0 = 2$ و $u_{n+1} = \\sqrt{2 + u_n}$. نريد بالترجع إثبات أن $u_n > 1$.\nبعد افتراض $u_n > 1$، كيف نبرهن على $u_{n+1} > 1$؟',
    hint: 'نؤطر $2 + u_n$ انطلاقاً من افتراض الترجع $u_n > 1$ ثم ندخل الجذر المربع.',
    options: [
      '$2 + u_n > 3 > 1 \\implies \\sqrt{2 + u_n} > 1$',
      '$u_{n+1} - u_n > 0$ مباشرة',
      '$2 + u_n < 4 \\implies u_{n+1} < 1$',
      'نحسب $u_0 = 2 > 1$ وهذا يكفي للمرتبة $n+1$'
    ],
    correctIndex: 0
  },
  {
    id: 't39_divisibility',
    section: 'A',
    topic: 39,
    prompt: 'لإثبات أن $4^n - 1$ مضاعف للعدد $3$ بالترجع: نفترض $4^n - 1 = 3k$.\nما التبسيط الصحيح للعبارة $4^{n+1} - 1$؟',
    hint: 'اكتب $4^{n+1} = 4 \\times 4^n$ وعوض $4^n = 3k + 1$.',
    options: [
      '$4(3k) - 1 = 12k - 1$',
      '$4(3k + 1) - 1 = 12k + 3 = 3(4k + 1)$',
      '$3(4^n - 1) - 4$',
      '$4^n + 3k$'
    ],
    correctIndex: 1
  },
  {
    id: 't40_bounds_def',
    section: 'A',
    topic: 40,
    prompt: 'لاحظ المبيان المرفق للمتتالية $(u_n)$ المحصورة بين المستقيمين $y = 4$ و $y = -1$.\nماذا نقول عن المتتالية $(u_n)$؟',
    hint: 'إذا وُجد $m$ و $M$ بحيث $\\forall n \\in \\mathbb{N}: m \\le u_n \\le M$ فهي مكبورة ومصغورة معاً.',
    options: [
      'مكبورة فقط بالعدد $4$ وغير مصغورة',
      'مصغورة فقط بالعدد $-1$',
      'محدودة (Bornée): مصغورة بـ $-1$ ومكبورة بـ $4$',
      'متباعدة نحو $+\\infty$'
    ],
    correctIndex: 2,
    graphSpec: { type: 'bounded_scatter' }
  },
  {
    id: 't40_fraction_bound',
    section: 'A',
    topic: 40,
    prompt: 'نعتبر المتتالية $u_n = \\frac{2n + 3}{n + 1}$ لكل $n \\in \\mathbb{N}$.\nبملاحظة أن $u_n = 2 + \\frac{1}{n + 1}$، ما التأطير الدقيق لـ $u_n$؟',
    hint: 'بما أن $n \\ge 0$ فإن $0 < \\frac{1}{n + 1} \\le 1$.',
    options: [
      '$0 < u_n \\le 2$',
      '$2 < u_n \\le 3$ (ومنه محدودة)',
      '$3 \\le u_n < 5$',
      '$(u_n)$ غير مكبورة'
    ],
    correctIndex: 1
  },
  {
    id: 't41_monotone_fx',
    section: 'A',
    topic: 41,
    prompt: 'لتكن $u_{n+1} = f(u_n)$ حيث $\\forall n \\in \\mathbb{N}: u_n \\in [1, 3]$.\nعلى المبيان نلاحظ أن منحنى $(C_f)$ يقع تحت المستقيم $y = x$ على $[1, 3]$ أي $f(x) \\le x$.\nما رتابة $(u_n)$؟',
    hint: '$u_{n+1} - u_n = f(u_n) - u_n \\le 0$ لجميع $n \\in \\mathbb{N}$.',
    options: [
      '$(u_n)$ متزايدة',
      '$(u_n)$ متناقصة',
      '$(u_n)$ ثابتة دائماً',
      '$(u_n)$ متناوبة الإشارة'
    ],
    correctIndex: 1,
    graphSpec: { type: 'fx_below_x' }
  },
  {
    id: 't41_diff_quad',
    section: 'A',
    topic: 41,
    prompt: 'إذا تحقق لكل $n \\in \\mathbb{N}$: $1 < u_n < 2$ و $$u_{n+1} - u_n = \\frac{(u_n - 1)(2 - u_n)}{u_n + 1}$$ فإن المتتالية $(u_n)$:',
    hint: 'بما أن $1 < u_n < 2$ فإن $(u_n - 1) > 0$ و $(2 - u_n) > 0$ و $(u_n + 1) > 0$.',
    options: [
      'متزايدة قطعاً لأن $u_{n+1} - u_n > 0$',
      'متناقصة قطعاً لأن $u_{n+1} - u_n < 0$',
      'ثابتة على $\\mathbb{N}$',
      'ليست رتيبة'
    ],
    correctIndex: 0
  },
  {
    id: 't42_arith_term',
    section: 'A',
    topic: 42,
    prompt: '$(u_n)$ متتالية حسابية أساسها $r = -3$ بحيث $u_2 = 10$.\nباستعمال صيغة الحد العام $u_n = u_p + (n - p)r$، ما قيمة $u_9$؟',
    hint: 'نعوض $n = 9$ و $p = 2$: $u_9 = 10 + (9 - 2)\\times(-3)$.',
    options: ['$-11$', '$-17$', '$31$', '$-8$'],
    correctIndex: 0
  },
  {
    id: 't42_arith_sum',
    section: 'A',
    topic: 42,
    prompt: 'احسب مجموع الحدود الحسابية $$S = u_2 + u_3 + \\dots + u_{11}$$ علماً أن $u_2 = 4$ و $u_{11} = 22$:',
    hint: 'عدد الحدود هو $(11 - 2 + 1) = 10$، ثم نطبق $S = \\frac{(n - p + 1)(u_p + u_n)}{2}$.',
    options: ['$117$', '$130$', '$260$', '$104$'],
    correctIndex: 1
  },
  {
    id: 't43_geo_term',
    section: 'A',
    topic: 43,
    prompt: '$(v_n)$ متتالية هندسية أساسها $q = 2$ بحيث $v_1 = 3$.\nباستعمال $v_n = v_p \\cdot q^{n-p}$، ما قيمة $v_5$؟',
    hint: 'الأس هو $5 - 1 = 4$ وليس $5$: $v_5 = 3 \\times 2^4$.',
    options: ['$96$', '$48$', '$24$', '$30$'],
    correctIndex: 1
  },
  {
    id: 't43_geo_sum',
    section: 'A',
    topic: 43,
    prompt: 'ما القيمة المضبوطة للمجموع الهندسي: $$S = 1 + \\frac{1}{2} + \\left(\\frac{1}{2}\\right)^2 + \\dots + \\left(\\frac{1}{2}\\right)^5$$',
    hint: 'عدد الحدود هو $5 - 0 + 1 = 6$ وحدها الأول $u_0 = 1$ و $q = \\frac{1}{2}$: $S = \\frac{1 - q^6}{1 - q}$.',
    options: ['$\\frac{63}{32}$', '$\\frac{31}{16}$', '$\\frac{63}{64}$', '$\\frac{33}{16}$'],
    correctIndex: 0
  },
  {
    id: 't44_affine_aux',
    section: 'A',
    topic: 44,
    prompt: 'نعتبر التآلفية $u_{n+1} = \\frac{1}{3}u_n + 4$ و $u_0 = 10$ (البند 1.1.1).\nنضع $v_n = u_n - \\alpha$ بحيث $(v_n)$ هندسية. ما قيمة $\\alpha$ وما نهاية $u_n$؟',
    hint: 'النقطة الصامدة $\\alpha$ تحقق $\\alpha = \\frac{1}{3}\\alpha + 4$، وبما أن $q = \\frac{1}{3} \\in ]-1, 1[$ فإن $\\lim v_n = 0$.',
    options: [
      '$\\alpha = 6$ و $\\lim u_n = 6$',
      '$\\alpha = 4$ و $\\lim u_n = 4$',
      '$\\alpha = 12$ و $\\lim u_n = +\\infty$',
      '$\\alpha = -6$ و $\\lim u_n = 0$'
    ],
    correctIndex: 0
  },
  {
    id: 't44_homographic_two',
    section: 'A',
    topic: 44,
    prompt: 'في المتتالية المتخاطة $u_{n+1} = \\frac{3u_n - 2}{u_n}$، تقبل $f(x) = x$ حلين هما $2$ و $1$.\nما المتتالية المساعدة الهندسية القياسية لدراستها (البند 1.1.1)؟',
    hint: 'نكوّن النسبة $v_n = \\frac{u_n - \\alpha}{u_n - \\beta}$ باستعمال الجذرين $\\alpha$ و $\\beta$.',
    options: [
      '$v_n = u_n - 2$',
      '$v_n = \\frac{u_n - 2}{u_n - 1}$',
      '$v_n = \\frac{1}{u_n}$',
      '$v_n = u_n^2 - 1$'
    ],
    correctIndex: 1,
    graphSpec: { type: 'homographic_curve' }
  },
  {
    id: 't44_homographic_one',
    section: 'A',
    topic: 44,
    prompt: 'لتكن المتتالية المتخاطة $u_{n+1} = \\frac{4u_n - 4}{u_n}$ حيث المعادلة $f(x) = x$ تقبل حلاً وحيداً $\\alpha = 2$.\nما طبيعة المتتالية المساعدة $v_n = \\frac{1}{u_n - 2}$؟',
    hint: 'عند وجود حل وحيد $\\alpha$ لـ $f(x) = x$، المقلوب $v_n = \\frac{1}{u_n - \\alpha}$ يعطي متتالية حسابية!',
    options: [
      'هندسية أساسها $q = 4$',
      'حسابية أساسها $r = \\frac{1}{2}$',
      'ثابتة تساوي $2$',
      'متباعدة متناوبة'
    ],
    correctIndex: 1
  },
  {
    id: 't44_explicit_un',
    section: 'A',
    topic: 44,
    prompt: 'إذا كان لدينا $v_n = \\frac{u_n - 1}{u_n + 2}$ ووجدنا $v_n = \\left(\\frac{1}{2}\\right)^n$،\nفما التعبير الصريح لـ $u_n$ بدلالة $v_n$؟',
    hint: 'ننشر $u_n - 1 = v_n u_n + 2v_n$ ثم نعزل $u_n$.',
    options: [
      '$u_n = \\frac{1 + 2v_n}{1 - v_n}$',
      '$u_n = \\frac{1 - 2v_n}{1 + v_n}$',
      '$u_n = \\frac{v_n - 1}{v_n + 2}$',
      '$u_n = 2v_n + 1$'
    ],
    correctIndex: 0
  },

  // ================= SECTION B: LIMITS & CONVERGENCE (45 - 50) =================
  {
    id: 't45_ref_power',
    section: 'B',
    topic: 45,
    prompt: 'باستعمال المتتاليات المرجعية $n^r$ و $\\frac{1}{n^r}$ ($r \\in \\mathbb{Q}_+^*$)، احسب النهاية: $$\\lim_{n\\to+\\infty} \\frac{4\\sqrt{n} + 5}{2\\sqrt{n} - \\frac{1}{\\sqrt{n}}}$$',
    hint: 'نعمل بـ $\\sqrt{n}$ في البسط والمقام ثم نستعمل $\\lim \\frac{1}{\\sqrt{n}} = 0$ و $\\lim \\frac{1}{n} = 0$.',
    options: ['$+\\infty$', '$0$', '$2$', '$4$'],
    correctIndex: 2
  },
  {
    id: 't45_qn_converge',
    section: 'B',
    topic: 45,
    prompt: 'احسب نهاية المتتالية: $$\\lim_{n\\to+\\infty} \\left(3 - 5\\left(-\\frac{2}{3}\\right)^n + \\frac{4}{n\\sqrt{n}}\\right)$$',
    hint: 'بما أن $-1 < -\\frac{2}{3} < 1$ فإن $\\lim \\left(-\\frac{2}{3}\\right)^n = 0$، وكذلك $\\lim \\frac{1}{n^{3/2}} = 0$.',
    options: ['$+\\infty$', '$3$', '$-2$', 'ليس لها نهاية'],
    correctIndex: 1,
    graphSpec: { type: 'geo_limits' }
  },
  {
    id: 't45_qn_cases',
    section: 'B',
    topic: 45,
    prompt: 'متى تكون المتتالية الهندسية $(q^n)$ لا تقبل أي نهاية عند $+\\infty$ (البند 1.1.2)؟',
    hint: 'عندما تتناوب الإشارة دون أن تقترب من $0$.',
    options: [
      'عندما $-1 < q < 1$',
      'عندما $q > 1$',
      'عندما $q \\le -1$ (مثل $(-1)^n$ أو $(-2)^n$)',
      'عندما $q = 1$'
    ],
    correctIndex: 2
  },
  {
    id: 't46_monotone_conv',
    section: 'B',
    topic: 46,
    prompt: 'نعلم أن $(u_n)$ متزايدة ومكبورة بالعدد $5$ (أي $u_n \\le 5$ لكل $n \\in \\mathbb{N}$).\nما الاستنتاج الدقيق وفق مبرهنة التقارب الرتيب؟',
    hint: 'انتبه: المكبر $M$ يضمن وجود نهاية $L$، لكن $L$ ليس بالضرورة مساوياً لـ $M$!',
    options: [
      '$(u_n)$ متقاربة ونهايتها تساوي $5$ حتماً',
      '$(u_n)$ متقاربة نحو نهاية $L$ تحقق $L \\le 5$',
      '$(u_n)$ تؤول إلى $+\\infty$',
      '$(u_n)$ متناقصة نحو $0$'
    ],
    correctIndex: 1
  },
  {
    id: 't46_dec_minor',
    section: 'B',
    topic: 46,
    prompt: 'أي الشروط التالية يضمن تقارب المتتالية $(u_n)$ دون معرفة تعبيرها الصريح؟',
    hint: 'طابق مع مبرهنتي التقارب الرتيب.',
    options: [
      '$(u_n)$ تناقصية فقط دون مصغر',
      '$(u_n)$ مصغورة بـ $0$ فقط دون رتابة',
      '$(u_n)$ تناقصية ومصغورة بالعدد $m = 1$',
      '$(u_n)$ تزايدية ومصغورة بالعدد $1$'
    ],
    correctIndex: 2
  },
  {
    id: 't47_squeeze_graph',
    section: 'B',
    topic: 47,
    prompt: 'في المبيان المرفق: المتتالية $u_n = 2 + \\frac{\\sin(n)}{\\sqrt{n}}$ محصورة بين $v_n$ و $w_n$: $$2 - \\frac{1}{\\sqrt{n}} \\le u_n \\le 2 + \\frac{1}{\\sqrt{n}}$$ ما نهاية $(u_n)$ حسب مبرهنة الدركيين؟',
    hint: 'نهايتا الحدين المحيطين متساويتان عند $+\\infty$: $\\lim \\left(2 - \\frac{1}{\\sqrt{n}}\\right) = \\lim \\left(2 + \\frac{1}{\\sqrt{n}}\\right) = 2$.',
    options: ['$0$', '$2$', '$+\\infty$', 'ليس لها نهاية'],
    correctIndex: 1,
    graphSpec: { type: 'squeeze_envelope' }
  },
  {
    id: 't47_abs_criterion',
    section: 'B',
    topic: 47,
    prompt: 'إذا تحقق لجميع $n \\in \\mathbb{N}$: $$|u_n - 3| \\le 5 \\cdot \\left(\\frac{1}{4}\\right)^n$$ فإن المتتالية $(u_n)$ حسب مصداق القيمة المطلقة (البند 1.1.2):',
    hint: 'بما أن $-1 < \\frac{1}{4} < 1$ فإن $\\lim 5\\cdot\\left(\\frac{1}{4}\\right)^n = 0$.',
    options: [
      'تؤول إلى $5$',
      'متقاربة ونهايتها $L = 3$',
      'متباعدة نحو $+\\infty$',
      'تؤول إلى $\\frac{1}{4}$'
    ],
    correctIndex: 1
  },
  {
    id: 't47_comp_inf',
    section: 'B',
    topic: 47,
    prompt: 'نعلم أن لجميع $n \\ge 1$: $u_n \\ge 2^n + \\cos(n) \\ge 2^n - 1$.\nماذا نستنتج عن نهاية $(u_n)$؟',
    hint: 'بما أن $2 > 1$ فإن $\\lim (2^n - 1) = +\\infty$.',
    options: [
      '$\\lim u_n = -1$',
      '$\\lim u_n = 0$',
      '$\\lim u_n = +\\infty$ (بالمقارنة عند اللانهاية)',
      'متقاربة نحو $2$'
    ],
    correctIndex: 2
  },
  {
    id: 't48_comp_limit',
    section: 'B',
    topic: 48,
    prompt: 'نعلم أن $\\lim_{n\\to+\\infty} u_n = 4$، ونضع $v_n = \\sqrt{u_n + 5}$ (البند 1.1.3).\nلماذا وما قيمة $\\lim v_n$؟',
    hint: 'الدالة $f(x) = \\sqrt{x + 5}$ متصلة عند $x = 4$، إذن $\\lim f(u_n) = f(4)$.',
    options: [
      '$9$ لأن $4 + 5 = 9$',
      '$3$ لأن $f(x)=\\sqrt{x+5}$ متصلة في $4$ و $f(4)=3$',
      '$2$ لأن $\\sqrt{4} = 2$',
      '$+\\infty$'
    ],
    correctIndex: 1
  },
  {
    id: 't48_trig_exp_comp',
    section: 'B',
    topic: 48,
    prompt: 'إذا كان $\\lim_{n\\to+\\infty} u_n = 0$، فإن نهاية المتتالية $v_n = e^{u_n} + 2\\cos(u_n)$ هي:',
    hint: 'الدالة $f(x) = e^x + 2\\cos(x)$ متصلة عند $0$، احسب $f(0)$.',
    options: ['$1$', '$2$', '$3$', '$e + 2$'],
    correctIndex: 2
  },
  {
    id: 't49_five_conditions',
    section: 'B',
    topic: 49,
    prompt: 'لتحديد نهاية متتالية ترجعية $u_{n+1} = f(u_n)$ بحل المعادلة $f(L) = L$ (البند 1.1.4)،\nأي الشروط الخمسة يجب تحققها كاملة على المجال $I$؟',
    hint: 'الاتصال على $I$، الاستقرار $f(I) \\subset I$، $u_0 \\in I$، تقارب $(u_n)$، وحل $f(L)=L$ في $I$.',
    options: [
      'يكفي فقط أن تكون $f(L) = L$',
      '$f$ متصلة على $I$، $f(I)\\subset I$، $u_0\\in I$، و $(u_n)$ متقاربة $\\implies L\\in I$ تحقق $f(L)=L$',
      'يجب أن تكون $f$ دالة خطية فقط',
      '$u_0 > L$ وفقط'
    ],
    correctIndex: 1,
    graphSpec: { type: 'cobweb_converge' }
  },
  {
    id: 't49_root_selection',
    section: 'B',
    topic: 49,
    prompt: 'في المبيان العنكبوتي لـ $u_{n+1} = \\sqrt{u_n + 2}$ مع $\\forall n: u_n \\in I = [1, 3]$ و $(u_n)$ متقاربة.\nحلول $f(L) = L$ هي $L = 2$ و $L = -1$. ما نهاية $(u_n)$؟',
    hint: 'يجب أن تنتمي النهاية $L$ إلى المجال المستقر $I = [1, 3]$!',
    options: [
      '$L = -1$',
      '$L = 2$ لأن $2 \\in [1, 3]$ بينما $-1 \\notin [1, 3]$',
      '$L = 1$',
      'تقبل نهايتين $2$ و $-1$'
    ],
    correctIndex: 1,
    graphSpec: { type: 'cobweb_converge' }
  },
  {
    id: 't50_modeling_pop',
    section: 'B',
    topic: 50,
    prompt: 'مسألة نمذجة (البند 1.1.5): خزان يفقد يومياً $20\\%$ من مائه ويُضاف إليه $40\\text{ L}$:\n$$u_{n+1} = 0.8 u_n + 40$$\nعلى المدى الطويل ($n \\to +\\infty$)، كم سيستقر حجم الماء في الخزان؟',
    hint: 'نحل معادلة الاستقرار $L = 0.8 L + 40$ (أو نضع متتالية مساعدة هندسية $q = 0.8$).',
    options: ['$160\\text{ L}$', '$200\\text{ L}$', '$320\\text{ L}$', '$40\\text{ L}$'],
    correctIndex: 1
  },
  {
    id: 't50_implicit_seq',
    section: 'B',
    topic: 50,
    prompt: 'لكل $n \\ge 1$، المعادلة $x^n + x - 1 = 0$ تقبل حلاً وحيداً $x_n \\in ]0, 1[$ (متتالية ضمنية 1.1.5).\nبتزايد $(x_n)$ وتقاربها، علماً أن $x_n^n = 1 - x_n < 1 - x_1$، ماذا نستنتج عن $\\lim x_n$؟',
    hint: 'بما أن $(x_n)$ تزايدية في $]0, 1[$ فهي تتقارب نحو $L \\in ]0, 1]$؛ لو كان $L < 1$ لآل $x_n^n \\to 0$ مما يناقض $1 - L > 0$.',
    options: [
      '$\\lim x_n = 0$',
      '$\\lim x_n = \\frac{1}{2}$',
      '$\\lim x_n = 1$',
      '$\\lim x_n = +\\infty$'
    ],
    correctIndex: 2
  }
];

window.pickSequenceChallenge = function(filterMode = 'all', sectorTopics = null, recentIds = []) {
  let pool = window.SEQ_QUESTION_BANK;

  if (filterMode === 'sectionA') {
    pool = pool.filter(q => q.section === 'A');
  } else if (filterMode === 'sectionB') {
    pool = pool.filter(q => q.section === 'B');
  } else if (Array.isArray(sectorTopics) && sectorTopics.length > 0) {
    const secPool = pool.filter(q => sectorTopics.includes(q.topic));
    if (secPool.length > 0) pool = secPool;
  }

  let fresh = pool.filter(q => !recentIds.includes(q.id));
  if (fresh.length === 0) fresh = pool;
  return fresh[Math.floor(Math.random() * fresh.length)];
};
