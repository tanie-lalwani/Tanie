import type { Locale } from "@/context/LanguageContext";

export type QnaPageTranslations = {
  viewTranscript: string;
  hideTranscript: string;
  askTanie: string;
  thinking: string;
  botGreeting: string;
  botPlaceholder: string;
  send: string;
  transcripts: string[];
  nav: {
    home: string;
    projects: string;
    pricing: string;
    clientHub: string;
    qna: string;
    contact: string;
    faq: string;
    terms: string;
  };
};

export const qnaTranslations: Record<Locale, QnaPageTranslations> = {
  en: {
    viewTranscript: "View Transcript",
    hideTranscript: "Hide Transcript",
    askTanie: "Ask Tanie",
    thinking: "Thinking...",
    botGreeting: "hi im tanie",
    botPlaceholder: "Ask anything about Tanie's experience...",
    send: "Send",
    transcripts: [
      "I am Tanie Lalwani, a creative developer focused on React, TypeScript, UI design, full-stack experiments, and interactive web experiences. I got into tech through curiosity: building, redesigning, fixing details, and learning how interfaces can feel memorable instead of just functional.",
      "A project I am proud of is Viziona, because it reflects how I think about product work: responsive layouts, clear interaction, visual hierarchy, and practical execution. I care about making the interface feel polished, readable, and easy to move through.",
      "When I handle bugs in production, I start by reproducing the issue, checking the user impact, reading logs or browser errors, and narrowing the cause before changing code. I prefer small fixes, clear testing, and documenting what broke so the same issue is less likely to return.",
      "When I disagree with a teammate, I try to move the conversation toward the user, the constraints, and the evidence. I explain my reasoning, listen for what I missed, and look for the option that protects the product instead of trying to win the argument.",
      "For frontend performance, I look at bundle size, unnecessary renders, image weight, layout shifts, and slow interactions. I use lazy loading, memoization where it actually helps, cleaner component boundaries, and practical measurement instead of guessing.",
      "I want roles where I can combine engineering, design sensitivity, communication, and product thinking. I like work that lets me build useful things, explain technology clearly, collaborate with people, and create digital experiences that feel intentional.",
    ],
    nav: {
      home: "Home",
      projects: "Projects",
      pricing: "Pricing",
      clientHub: "Client Hub",
      qna: "Q&A",
      contact: "Contact",
      faq: "FAQ",
      terms: "Terms",
    },
  },
  es: {
    viewTranscript: "Ver Transcripción",
    hideTranscript: "Ocultar Transcripción",
    askTanie: "Preguntar a Tanie",
    thinking: "Pensando...",
    botGreeting: "¡Hola! Soy Tanie",
    botPlaceholder: "Pregunta sobre mi experiencia o proyectos...",
    send: "Enviar",
    transcripts: [
      "Soy Tanie Lalwani, desarrolladora creativa enfocada en React, TypeScript, diseño de interfaces, experimentos full-stack y experiencias web interactivas. Entré en la tecnología por curiosidad: construyendo, rediseñando y aprendiendo cómo las interfaces pueden ser memorables y no solo funcionales.",
      "Un proyecto del que estoy muy orgullosa es Viziona, porque refleja mi visión de producto: diseño adaptable, interacción clara, jerarquía visual y ejecución práctica. Me apasiona que las interfaces se sientan pulidas, legibles y fluidas.",
      "Al resolver errores en producción, comienzo reproduciendo el fallo, evaluando el impacto en el usuario, revisando registros y aislando la causa antes de modificar el código. Prefiero soluciones precisas, pruebas claras y documentar lo ocurrido para evitar recurrencias.",
      "Ante discrepancias técnicas con un compañero, oriento el debate hacia las necesidades del usuario, las limitaciones y las evidencias. Explico mis motivos, escucho con atención y elijo la opción que mejor proteja la calidad del producto.",
      "Para el rendimiento frontend, analizo el peso del bundle, renders innecesarios, optimización de imágenes y fluidez de interacción. Aplico lazy loading, memoización estratégica, límites limpios entre componentes y mediciones empíricas.",
      "Busco puestos donde pueda combinar ingeniería, sensibilidad de diseño, comunicación y visión de producto. Me entusiasma crear productos útiles, explicar conceptos con claridad y desarrollar experiencias digitales memorables.",
    ],
    nav: {
      home: "Inicio",
      projects: "Proyectos",
      pricing: "Precios",
      clientHub: "Área Clientes",
      qna: "Preguntas",
      contact: "Contacto",
      faq: "Preguntas Frecuentes",
      terms: "Términos",
    },
  },
  fr: {
    viewTranscript: "Voir la Transcription",
    hideTranscript: "Masquer la Transcription",
    askTanie: "Demander à Tanie",
    thinking: "Réflexion...",
    botGreeting: "Bonjour, je suis Tanie",
    botPlaceholder: "Posez vos questions sur mon parcours...",
    send: "Envoyer",
    transcripts: [
      "Je m'appelle Tanie Lalwani, développeuse créative passionnée par React, TypeScript, le design d'interface, l'ingénierie full-stack et les expériences web interactives. C'est la curiosité qui m'a menée vers la tech : expérimenter, affiner les détails et concevoir des interfaces marquantes.",
      "Un projet dont je suis fière est Viziona, car il incarne ma vision produit : mise en page réactive, interactions soignées, hiérarchie visuelle fluide et exécution rigoureuse.",
      "Face à un bug en production, j'isole d'abord le problème, évalue l'impact utilisateur, examine les logs d'erreurs et identifie la cause racine avant d'ajuster le code. Je privilégie les correctifs ciblés et bien documentés.",
      "En cas de désaccord technique, je recentre toujours l'échange sur l'expérience utilisateur, les contraintes réelles et les faits probants, en privilégiant la meilleure solution pour le produit.",
      "Pour la performance frontend, j'optimise la taille du bundle, élimine les rendus superflus, optimise les médias et surveille les temps de réponse grâce à des mesures concrètes.",
      "Je recherche des opportunités où conjuguer rigueur d'ingénierie, sensibilité esthétique et réflexion produit pour façonner des applications utiles et mémorables.",
    ],
    nav: {
      home: "Accueil",
      projects: "Projets",
      pricing: "Tarifs",
      clientHub: "Espace Client",
      qna: "Questions",
      contact: "Contact",
      faq: "FAQ",
      terms: "Conditions",
    },
  },
  hi: {
    viewTranscript: "Transcript Dekhein",
    hideTranscript: "Transcript Chupayein",
    askTanie: "Tanie Se Poochein",
    thinking: "Soch raha hoon...",
    botGreeting: "Hi! Main hoon Tanie",
    botPlaceholder: "Mere experience ya projects ke baare mein kuch bhi poochein...",
    send: "Bhejein",
    transcripts: [
      "Main Tanie Lalwani hoon, ek creative developer jo React, TypeScript, UI design, full-stack experiments aur interactive web experiences par focused hai. Main curiosity ke through tech mein aaya: build karna, redesign karna, micro details refine karna aur memorable interfaces design karna.",
      "Viziona ek aisa project hai jis par mujhe kaafi proud feel hota hai, kyunki ye mere product mindset ko reflect karta hai: responsive layouts, clear interaction, visual hierarchy aur practical execution.",
      "Production mein bugs solve karte time, main pehle issue reproduce karta hoon, user impact check karta hoon, error logs analyze karta hoon aur code change karne se pehle root cause identify karta hoon.",
      "Technical disagreement ke time, main conversation ko user requirements, practical constraints aur data points ki taraf steer karta hoon taaki best product outcome mile.",
      "Frontend performance ke liye main bundle size, unnecessary re-renders, image optimization aur smooth frame rates par focus karta hoon.",
      "Mujhe aisi roles pasand hain jahan main engineering, design sensitivity, clear communication aur product thinking combine karke impactful digital products bana sakoon.",
    ],
    nav: {
      home: "Home",
      projects: "Projects",
      pricing: "Pricing",
      clientHub: "Client Hub",
      qna: "Q&A",
      contact: "Contact",
      faq: "FAQ",
      terms: "Terms",
    },
  },
  ja: {
    viewTranscript: "文字起こしを表示",
    hideTranscript: "文字起こしを非表示",
    askTanie: "Tanieに質問する",
    thinking: "思考中...",
    botGreeting: "こんにちは、Tanieです",
    botPlaceholder: "経歴やスキルについて何でも聞いてください...",
    send: "送信",
    transcripts: [
      "Tanie Lalwaniと申します。React、TypeScript、UIデザイン、フルスタック開発、そしてインタラクティブなWeb体験を専門とするクリエイティブエンジニアです。機能性だけでなく、記憶に残る美しいインターフェースの追求を大切にしています。",
      "特に誇りに思っているプロジェクトはVizionaです。レスポンシブな構成、明快な操作性、洗練された視覚的ヒエラルキーなど、プロダクトに対する私の設計思想が如実に反映されています。",
      "本番環境でのバグ対応では、まず事象の再現とユーザー影響の把握を行い、ログやブラウザエラーから根本原因を特定した上で最小限かつ確実な修正を施します。",
      "技術的な意見の相違が生じた際は、ユーザー視点、制約条件、事実データに基づいて議論を深め、プロダクトの価値を最大化する選択を重視します。",
      "フロントエンドのパフォーマンス改善においては、バンドルサイズ、不要な再レンダリング、画像最適化、レイアウトシフトなどを計測データに基づき徹底的にチューニングします。",
      "エンジニアリング、デザイン感性、コミュニケーション、そしてプロダクト思考を融合させ、真に価値あるデジタルプロダクトを創造できる環境を求めています。",
    ],
    nav: {
      home: "ホーム",
      projects: "制作実績",
      pricing: "料金プラン",
      clientHub: "クライアント専用",
      qna: "質疑応答",
      contact: "お問い合わせ",
      faq: "よくある質問",
      terms: "利用規約",
    },
  },
  ur: {
    viewTranscript: "ٹرانسکرپٹ دیکھیں",
    hideTranscript: "ٹرانسکرپٹ چھپائیں",
    askTanie: "تانی سے پوچھیں",
    thinking: "سوچ رہا ہے...",
    botGreeting: "ہیلو! میں تانی ہوں",
    botPlaceholder: "میرے تجربے یا منصوبوں کے بارے میں پوچھیں...",
    send: "ارسال کریں",
    transcripts: [
      "میں تانی لعل وانی ہوں، ایک تخلیقی ڈویلپر جو React، TypeScript، UI ڈیزائن، فل اسٹیک تجربات اور انٹرایکٹو ویب پروجیکٹس پر کام کرتی ہوں۔ تجسس اور عمدہ تفصیلات نے مجھے ٹیکنالوجی میں ایک نئی راہ دکھائی۔",
      "ایک منصوبہ جس پر مجھے فخر ہے وہ Viziona ہے، کیونکہ یہ مصنوعات کے ڈیزائن کے بارے میں میری سوچ کی عکاسی کرتا ہے: واضح تعامل، درست لے آؤٹ اور عملی نفاذ۔",
      "پروڈکشن میں خرابیوں کو دور کرتے وقت، میں پہلے مسئلے کو سمجھتی ہوں، صارفین پر اثرات کا جائزہ لیتی ہوں، لاگز پڑھتی ہوں اور کوڈ تبدیل کرنے سے پہلے بنیادی وجہ تک پہنچتی ہوں۔",
      "کسی تکنیکی اختلاف کے دوران، میں گفتگو کو صارف کی ضروریات اور ٹھوس ثبوتوں کی طرف لے جاتی ہوں تاکہ بہترین فیصلے تک پہنچا جا سکے۔",
      "فرنٹ اینڈ کی کارکردگی کے لیے، میں بنڈل سائز، غیر ضروری رینڈرز، تصاویر کے وزن اور عملی پیمائش پر توجہ دیتی ہوں۔",
      "میں ایسے کرداروں کی تلاش میں ہوں جہاں میں انجینئرنگ، ڈیزائن اور مصنوعات کی سوچ کو یکجا کر کے بامقصد ڈیجیٹل تجربات تخلیق کر سکوں۔",
    ],
    nav: {
      home: "ہوم",
      projects: "منصوبے",
      pricing: "قیمتیں",
      clientHub: "کلائنٹ پورٹل",
      qna: "سوال و جواب",
      contact: "رابطہ",
      faq: "عام سوالات",
      terms: "شرائط و ضوابط",
    },
  },
  zh: {
    viewTranscript: "查看文字稿",
    hideTranscript: "收起文字稿",
    askTanie: "向 Tanie 提问",
    thinking: "正在思考...",
    botGreeting: "你好！我是 Tanie",
    botPlaceholder: "随时询问关于我的经历与作品...",
    send: "发送",
    transcripts: [
      "我是 Tanie Lalwani，一名专注于 React、TypeScript、UI 设计、全栈探索与交互式 Web 体验的创意开发者。我因好奇心步入技术领域：热衷于创造、重构细节，让界面不仅具备实用性，更能给人留下深刻印象。",
      "我引以为傲的项目是 Viziona，它充分展现了我对产品的思考：响应式布局、直观清晰的交互、良好的视觉层级与严谨落地。我始终追求打磨得体、清晰易用的交互体验。",
      "处理线上生产环境的 Bug 时，我习惯先复现问题、评估对用户的影响，结合日志深入分析根因，然后再精准改动代码，并做好详尽记录以防复发。",
      "当与团队产生技术分歧时，我会将讨论重心拉回到用户需求、客观约束与实际数据上，以理服人并保持倾听，做出最利于产品的决断。",
      "针对前端性能优化，我重点关注打包体积、非必要重渲染、媒体资源压缩及布局偏移，借助量化指标与实际测量驱动优化。",
      "我期待能将工程技术、设计审美与产品思维深度融合的岗位，携手团队打造真正有用、充满温度且让人印象深刻的数字化体验。",
    ],
    nav: {
      home: "首页",
      projects: "作品案例",
      pricing: "服务定价",
      clientHub: "客户中心",
      qna: "问答专区",
      contact: "联系我们",
      faq: "常见问题",
      terms: "条款政策",
    },
  },
};
