import type { Locale } from "@/context/LanguageContext";

export type FaqItemData = {
  id: string;
  category: "services" | "pricing" | "timeline" | "tech" | "portal" | "warranty";
  categoryLabel: string;
  question: string;
  answer: string[];
  keyPoints?: string[];
};

export type FaqCategoryData = {
  id: string;
  label: string;
};

export type FaqPageCopy = {
  badge: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  questionsFound: (count: number) => string;
  expandAll: string;
  collapseAll: string;
  noQuestionsTitle: (query: string) => string;
  noQuestionsSubtitle: string;
  resetButton: string;
  keyTakeawaysLabel: string;
  categories: FaqCategoryData[];
  items: FaqItemData[];
  bottomCta: {
    title: string;
    description: string;
    explorePricing: string;
    contactDirectly: string;
    termsLink: string;
  };
};

export const faqTranslations: Record<Locale, FaqPageCopy> = {
  en: {
    badge: "Help Center & Frequently Asked Questions",
    title: "Frequently Asked Questions",
    subtitle: "Clear answers to common questions about project scopes, pricing, 3D WebGL experiences, delivery timelines, and client deliverables.",
    searchPlaceholder: "Search questions & topics (e.g. pricing, timeline, 3D, Razorpay, warranty)...",
    questionsFound: (count) => `${count} questions found`,
    expandAll: "Expand All",
    collapseAll: "Collapse All",
    noQuestionsTitle: (query) => `No questions match "${query}"`,
    noQuestionsSubtitle: "Have a specific question not covered here? Feel free to reach out directly.",
    resetButton: "Reset Search",
    keyTakeawaysLabel: "Key Takeaways:",
    categories: [
      { id: "all", label: "All Questions" },
      { id: "services", label: "Services & Scope" },
      { id: "pricing", label: "Pricing & Payments" },
      { id: "timeline", label: "Timeline & Delivery" },
      { id: "tech", label: "3D & Tech Stack" },
      { id: "portal", label: "Client Workspace" },
      { id: "warranty", label: "Warranty & Support" },
    ],
    items: [
      {
        id: "services-offered",
        category: "services",
        categoryLabel: "Services & Scope",
        question: "What kind of websites and digital experiences do you build?",
        answer: [
          "I specialize in high-converting bespoke digital experiences: high-performance landing pages, luxury product showcases, interactive 3D WebGL websites, and full-stack Next.js web applications with authenticated client dashboards.",
          "Every project is crafted from scratch using clean code and modern aesthetics without bloated WordPress templates or generic page builders.",
        ],
        keyPoints: [
          "Custom UI/UX designed in Figma with fluid micro-interactions",
          "Interactive 3D WebGL scenes using Three.js and React Three Fiber",
          "Ultra-fast Next.js architecture with instant page transitions",
        ],
      },
      {
        id: "custom-vs-packages",
        category: "services",
        categoryLabel: "Services & Scope",
        question: "What is the difference between turnkey packages and custom scope?",
        answer: [
          "Turnkey packages (like our High-Converting Landing Page or 3D Brand Experience) offer fixed pricing and predefined deliverables ideal for fast launch.",
          "Our interactive Cost Calculator allows you to dynamically configure custom requirements, page counts, bespoke 3D physics models, backend authentication, and multi-currency billing tailored exactly to your business.",
        ],
      },
      {
        id: "payment-milestones",
        category: "pricing",
        categoryLabel: "Pricing & Payments",
        question: "How do payment milestones and deposits work?",
        answer: [
          "Custom projects are split into a standard 50% upfront retainer deposit upon contract signing, and the remaining 50% upon final staging review prior to production DNS cutover.",
          "For turnkey packages purchased directly through the site, payment is securely captured upfront with automated invoice issuance and instant onboarding to your private Client Workspace.",
        ],
        keyPoints: [
          "50% deposit to commence sprint discovery and wireframing",
          "50% balance upon final staging approval before domain cutover",
          "Official tax receipts and invoices generated automatically",
        ],
      },
      {
        id: "turnaround-timeline",
        category: "timeline",
        categoryLabel: "Timeline & Delivery",
        question: "How long does a website take from start to launch?",
        answer: [
          "Typical delivery schedules depend on package scope:",
        ],
        keyPoints: [
          "High-Converting Landing Pages: 1 to 2 weeks",
          "3D Interactive & Brand Web Experiences: 3 to 5 weeks",
          "Full-Stack Web Applications & MVPs: 4 to 6 weeks",
          "Rush turnaround options are available for urgent product launches",
        ],
      },
      {
        id: "tech-stack-details",
        category: "tech",
        categoryLabel: "3D & Tech Stack",
        question: "What technologies and frameworks do you build with?",
        answer: [
          "We build with an ultra-modern, battle-tested engineering stack: Next.js 15 (App Router, Server Components, SSR for peak SEO), TypeScript for type-safe code architecture, Three.js & React Three Fiber for WebGL graphics, and Tailwind CSS for responsive styling.",
        ],
        keyPoints: [
          "Next.js 15, React, TypeScript, and Tailwind CSS",
          "Three.js & React Three Fiber for real-time 3D experiences",
          "Supabase (PostgreSQL, row-level security, auth) for dynamic apps",
        ],
      },
      {
        id: "warranty-period",
        category: "warranty",
        categoryLabel: "Warranty & Support",
        question: "What happens after the website is launched? Is there a warranty?",
        answer: [
          "Yes! Every project includes a 30-day complimentary post-launch hypercare warranty. If any unexpected bugs, cross-browser rendering quirks, or layout shifts arise, they are resolved immediately at zero additional cost.",
          "Ongoing monthly retainer partnerships are also available for continuous feature updates, AB testing, and performance tuning.",
        ],
      },
    ],
    bottomCta: {
      title: "Have a unique project or custom inquiry?",
      description: "Let's build something memorable together. Schedule a discovery discussion or calculate your custom project investment.",
      explorePricing: "Explore Pricing & Packages →",
      contactDirectly: "Contact Directly",
      termsLink: "Terms & Policies →",
    },
  },

  es: {
    badge: "Centro de Ayuda y Preguntas Frecuentes",
    title: "Preguntas Frecuentes",
    subtitle: "Respuestas claras sobre alcances de proyectos, precios, experiencias 3D WebGL, plazos de entrega y entregables para clientes.",
    searchPlaceholder: "Buscar preguntas y temas (ej. precios, plazos, 3D, Razorpay, garantía)...",
    questionsFound: (count) => `${count} preguntas encontradas`,
    expandAll: "Expandir Todo",
    collapseAll: "Cerrar Todo",
    noQuestionsTitle: (query) => `No hay preguntas que coincidan con "${query}"`,
    noQuestionsSubtitle: "¿Tiene una pregunta específica no resuelta aquí? Contáctenos directamente.",
    resetButton: "Restablecer Búsqueda",
    keyTakeawaysLabel: "Puntos Clave:",
    categories: [
      { id: "all", label: "Todas las Preguntas" },
      { id: "services", label: "Servicios y Alcance" },
      { id: "pricing", label: "Precios y Pagos" },
      { id: "timeline", label: "Plazos y Entrega" },
      { id: "tech", label: "3D y Tecnología" },
      { id: "portal", label: "Área de Clientes" },
      { id: "warranty", label: "Garantía y Soporte" },
    ],
    items: [
      {
        id: "services-offered",
        category: "services",
        categoryLabel: "Servicios y Alcance",
        question: "¿Qué tipo de sitios web y experiencias digitales desarrolla?",
        answer: [
          "Me especializo en experiencias digitales personalizadas de alta conversión: landing pages de alto rendimiento, catálogos de lujo, sitios web 3D interactivos con WebGL y aplicaciones web full-stack en Next.js con paneles autenticados.",
          "Cada proyecto se elabora desde cero con código limpio y diseño contemporáneo, sin plantillas pesadas de WordPress ni constructores genéricos.",
        ],
        keyPoints: [
          "Diseño UI/UX en Figma con microinteracciones fluidas",
          "Escenas 3D interactivas con Three.js y React Three Fiber",
          "Arquitectura Next.js ultrarrápida con transiciones instantáneas",
        ],
      },
      {
        id: "custom-vs-packages",
        category: "services",
        categoryLabel: "Servicios y Alcance",
        question: "¿Cuál es la diferencia entre paquetes cerrados y alcance personalizado?",
        answer: [
          "Los paquetes cerrados (como nuestra Landing Page de Alta Conversión o Experiencia de Marca 3D) ofrecen precios fijos y entregables predefinidos ideales para un lanzamiento rápido.",
          "Nuestra Calculadora de Costos interactiva le permite configurar dinámicamente requisitos a medida, número de páginas, modelos 3D y autenticación según las necesidades de su negocio.",
        ],
      },
      {
        id: "payment-milestones",
        category: "pricing",
        categoryLabel: "Precios y Pagos",
        question: "¿Cómo funcionan los hitos de pago y los depósitos?",
        answer: [
          "Los proyectos a medida se dividen en un depósito de reserva del 50% al firmar el contrato, y el 50% restante tras la aprobación final en staging antes del despliegue en producción.",
          "Para paquetes adquiridos online, el pago se realiza de forma segura por adelantado con factura automática e incorporación inmediata a su Área de Clientes.",
        ],
        keyPoints: [
          "Depósito del 50% para iniciar descubrimiento y wireframes",
          "Saldo del 50% tras aprobación en staging antes de publicar",
          "Emisión automática de recibos fiscales oficiales",
        ],
      },
      {
        id: "turnaround-timeline",
        category: "timeline",
        categoryLabel: "Plazos y Entrega",
        question: "¿Cuánto tiempo toma construir un sitio web desde cero?",
        answer: [
          "Los plazos típicos de entrega dependen del alcance del proyecto:",
        ],
        keyPoints: [
          "Landing Pages de Alta Conversión: 1 a 2 semanas",
          "Experiencias Web Interactivas 3D: 3 a 5 semanas",
          "Aplicaciones Web Full-Stack y MVPs: 4 a 6 semanas",
          "Opciones de entrega acelerada disponibles bajo solicitud",
        ],
      },
      {
        id: "tech-stack-details",
        category: "tech",
        categoryLabel: "3D y Tecnología",
        question: "¿Qué tecnologías y frameworks utiliza?",
        answer: [
          "Construimos con un stack tecnológico moderno y probado: Next.js 15 (App Router, SSR para óptimo SEO), TypeScript para código robusto, Three.js y React Three Fiber para gráficos 3D WebGL, y Tailwind CSS para diseño responsivo.",
        ],
        keyPoints: [
          "Next.js 15, React, TypeScript y Tailwind CSS",
          "Three.js y React Three Fiber para 3D en tiempo real",
          "Supabase (PostgreSQL, seguridad RLS, autenticación)",
        ],
      },
      {
        id: "warranty-period",
        category: "warranty",
        categoryLabel: "Garantía y Soporte",
        question: "¿Qué ocurre después del lanzamiento? ¿Hay garantía?",
        answer: [
          "¡Sí! Todo proyecto incluye una garantía hypercare gratuita de 30 días posteriores al lanzamiento. Cualquier corrección de errores imprevistos o ajuste de compatibilidad en navegadores se resuelve de inmediato sin costo.",
          "También ofrecemos planes de mantenimiento mensual continuo para nuevas funcionalidades y optimización constante.",
        ],
      },
    ],
    bottomCta: {
      title: "¿Tiene un proyecto especial o consulta personalizada?",
      description: "Construyamos algo memorable juntos. Agende una conversación o calcule la inversión de su proyecto personalizado.",
      explorePricing: "Explorar Precios y Paquetes →",
      contactDirectly: "Contactar Directamente",
      termsLink: "Términos y Políticas →",
    },
  },

  fr: {
    badge: "Centre d'Aide & Foire Aux Questions",
    title: "Foire Aux Questions (FAQ)",
    subtitle: "Des réponses transparentes sur les périmètres de projets, la tarification, la 3D WebGL, les délais de livraison et le suivi client.",
    searchPlaceholder: "Rechercher des questions et sujets (ex. tarifs, délais, 3D, Razorpay, garantie)...",
    questionsFound: (count) => `${count} questions trouvées`,
    expandAll: "Tout Développer",
    collapseAll: "Tout Réduire",
    noQuestionsTitle: (query) => `Aucune question ne correspond à "${query}"`,
    noQuestionsSubtitle: "Vous avez une question spécifique non traitée ici ? Contactez-nous directement.",
    resetButton: "Réinitialiser la Recherche",
    keyTakeawaysLabel: "Points Clés :",
    categories: [
      { id: "all", label: "Toutes les Questions" },
      { id: "services", label: "Services & Périmètre" },
      { id: "pricing", label: "Tarifs & Règlements" },
      { id: "timeline", label: "Délais & Livraison" },
      { id: "tech", label: "3D & Technologies" },
      { id: "portal", label: "Espace Client" },
      { id: "warranty", label: "Garantie & Support" },
    ],
    items: [
      {
        id: "services-offered",
        category: "services",
        categoryLabel: "Services & Périmètre",
        question: "Quels types de sites web et d'expériences créez-vous ?",
        answer: [
          "Je conçois des expériences numériques sur mesure à fort impact : landing pages haute conversion, vitrines de prestige, sites interactifs 3D WebGL et applications web full-stack Next.js dotées d'espaces clients sécurisés.",
          "Chaque création est développée de zéro avec un code propre, sans templates WordPress lourds ni constructeurs de pages génériques.",
        ],
        keyPoints: [
          "Conception UI/UX sur mesure dans Figma avec micro-interactions",
          "Scènes 3D interactives via Three.js et React Three Fiber",
          "Architecture Next.js ultra-rapide et optimisée pour le SEO",
        ],
      },
      {
        id: "payment-milestones",
        category: "pricing",
        categoryLabel: "Tarifs & Règlements",
        question: "Comment s'organisent les acomptes et le paiement par jalon ?",
        answer: [
          "Les projets sur mesure prévoient un acompte initial de 50 % à la signature du contrat, et le solde de 50 % à la validation finale sur staging avant la mise en ligne définitive.",
          "Pour les forfaits commandés directement en ligne, le règlement s'effectue de manière sécurisée en amont avec émission immédiate de facture et ouverture de votre Espace Client.",
        ],
      },
      {
        id: "turnaround-timeline",
        category: "timeline",
        categoryLabel: "Délais & Livraison",
        question: "Quels sont les délais de conception et de mise en ligne ?",
        answer: [
          "Les délais de livraison varient selon le forfait choisi :",
        ],
        keyPoints: [
          "Landing Pages à Forte Conversion : 1 à 2 semaines",
          "Expériences Web Interactives 3D : 3 à 5 semaines",
          "Applications Web Full-Stack & MVPs : 4 à 6 semaines",
        ],
      },
      {
        id: "warranty-period",
        category: "warranty",
        categoryLabel: "Garantie & Support",
        question: "Que se passe-t-il après la mise en ligne ? Y a-t-il une garantie ?",
        answer: [
          "Oui ! Chaque réalisation comprend 30 jours de garantie hypercare offerte. Tout bug inattendu ou ajustement de compatibilité navigateur est corrigé sans frais supplémentaires.",
        ],
      },
    ],
    bottomCta: {
      title: "Vous avez un projet spécifique ou une question sur mesure ?",
      description: "Construisons ensemble un produit mémorable. Échangeons directement ou estimez le coût de votre projet.",
      explorePricing: "Découvrir les Tarifs & Forfaits →",
      contactDirectly: "Contacter Directement",
      termsLink: "Conditions & Politiques →",
    },
  },

  hi: {
    badge: "Help Center & Frequently Asked Questions",
    title: "Aksar Pooche Jaane Wale Sawal (FAQ)",
    subtitle: "Project scopes, pricing, 3D WebGL experiences, delivery timelines aur client deliverables se jude sabhi sawalon ke clear answers.",
    searchPlaceholder: "Sawal ya topic search karein (e.g. pricing, timeline, 3D, Razorpay, warranty)...",
    questionsFound: (count) => `${count} sawal mile`,
    expandAll: "Sab Kholein",
    collapseAll: "Sab Band Karein",
    noQuestionsTitle: (query) => `"${query}" ke liye koi sawal nahi mila`,
    noQuestionsSubtitle: "Kya aapka koi specific sawal hai jo yahan nahi mila? Bejhijhak direct contact karein.",
    resetButton: "Search Reset Karein",
    keyTakeawaysLabel: "Key Takeaways:",
    categories: [
      { id: "all", label: "Sabhi Sawal" },
      { id: "services", label: "Services & Scope" },
      { id: "pricing", label: "Pricing & Payments" },
      { id: "timeline", label: "Timeline & Delivery" },
      { id: "tech", label: "3D & Tech Stack" },
      { id: "portal", label: "Client Workspace" },
      { id: "warranty", label: "Warranty & Support" },
    ],
    items: [
      {
        id: "services-offered",
        category: "services",
        categoryLabel: "Services & Scope",
        question: "Aap kis type ki websites aur digital experiences banate hain?",
        answer: [
          "Main custom high-converting landing pages, luxury product showcases, 3D WebGL interactive websites aur secure client portals ke saath full-stack Next.js web applications build karne mein specialize karta hoon.",
          "Har project bina kisi bloated WordPress template ke clean code aur bespoke modern aesthetics ke saath zero se design hota hai.",
        ],
        keyPoints: [
          "Figma mein custom UI/UX design with fluid micro-interactions",
          "Three.js aur React Three Fiber ke saath interactive 3D WebGL scenes",
          "Ultra-fast Next.js architecture with instant page transitions",
        ],
      },
      {
        id: "payment-milestones",
        category: "pricing",
        categoryLabel: "Pricing & Payments",
        question: "Payment milestones aur deposits kaise kaam karte hain?",
        answer: [
          "Custom projects mein 50% upfront retainer deposit agreement sign karte time, aur baki 50% final staging review ke baad production launch se pehle pay hota hai.",
          "Website se directly choose kiye gaye packages ka payment securely upfront process hota hai aur automatic invoice ke saath client portal access turant mil jata hai.",
        ],
      },
      {
        id: "turnaround-timeline",
        category: "timeline",
        categoryLabel: "Timeline & Delivery",
        question: "Website banne mein kitna time lagta hai?",
        answer: [
          "Timeline project ke scope aur complexity par depend karta hai:",
        ],
        keyPoints: [
          "Landing Pages: 1 se 2 weeks",
          "3D Interactive & Brand Web Experiences: 3 se 5 weeks",
          "Full-Stack Web Apps & MVPs: 4 se 6 weeks",
        ],
      },
      {
        id: "warranty-period",
        category: "warranty",
        categoryLabel: "Warranty & Support",
        question: "Website launch ke baad kya support aur warranty milti hai?",
        answer: [
          "Haan! Har project mein 30 days ki complimentary post-launch hypercare warranty included hoti hai. Koi bhi unexpected bug ya responsiveness issue bina kisi extra cost ke turant resolve hota hai.",
        ],
      },
    ],
    bottomCta: {
      title: "Kya aapka koi specific project ya sawal hai?",
      description: "Chalo saath milkar kuch memorable banayein. Direct discussion schedule karein ya cost calculator use karein.",
      explorePricing: "Pricing & Packages Dekhein →",
      contactDirectly: "Direct Contact Karein",
      termsLink: "Terms & Policies →",
    },
  },

  ja: {
    badge: "ヘルプセンター・よくあるご質問",
    title: "よくあるご質問 (FAQ)",
    subtitle: "制作プラン、料金体系、3D WebGL開発、納期、納品データに関する疑問に分かりやすくお答えします。",
    searchPlaceholder: "質問やトピックを検索 (例: 料金、納期、3D、Razorpay、保証)...",
    questionsFound: (count) => `${count}件の質問が見つかりました`,
    expandAll: "すべて開く",
    collapseAll: "すべて閉じる",
    noQuestionsTitle: (query) => `"${query}" に一致する質問は見つかりませんでした`,
    noQuestionsSubtitle: "掲載されていないご質問がございましたら、お気軽にお問い合わせください。",
    resetButton: "検索をリセット",
    keyTakeawaysLabel: "ポイント:",
    categories: [
      { id: "all", label: "すべての質問" },
      { id: "services", label: "制作内容・スコープ" },
      { id: "pricing", label: "料金・お支払い" },
      { id: "timeline", label: "納期・納品" },
      { id: "tech", label: "3D・技術スタック" },
      { id: "portal", label: "ワークスペース" },
      { id: "warranty", label: "保証・サポート" },
    ],
    items: [
      {
        id: "services-offered",
        category: "services",
        categoryLabel: "制作内容・スコープ",
        question: "どのようなWebサイトやデジタル体験を制作していますか？",
        answer: [
          "成果に直結するLP、ブランド世界観を表現する高級感あるサイト、Three.jsによる3D WebGL体験、そして認証機能を備えたフルスタックNext.js Webアプリの受託開発を専門としています。",
          "汎用テンプレートは一切使用せず、洗練されたモダンコードでゼロから構築します。",
        ],
        keyPoints: [
          "Figmaによる細部までこだわったUI/UX設計",
          "Three.js / React Three Fiberを活用した軽量3D演出",
          "Next.js 15による高速表示と最高水準のSEO対策",
        ],
      },
      {
        id: "payment-milestones",
        category: "pricing",
        categoryLabel: "料金・お支払い",
        question: "お支払いのタイミングや着手金について教えてください。",
        answer: [
          "オーダーメイド開発では、ご契約時に着手金50%、ステージング環境での最終確認後に残金50%をお支払いいただきます。",
          "Web上で直接購入いただけるパッケージは事前決済となり、領収書発行と同時にクライアントワークスペースへご案内します。",
        ],
      },
      {
        id: "turnaround-timeline",
        category: "timeline",
        categoryLabel: "納期・納品",
        question: "制作から公開までの期間はどのくらいかかりますか？",
        answer: [
          "制作プランに応じた標準納期は以下の通りです:",
        ],
        keyPoints: [
          "高品質ランディングページ: 1〜2週間",
          "3DインタラクティブWebサイト: 3〜5週間",
          "フルスタックWebアプリ・MVP: 4〜6週間",
        ],
      },
      {
        id: "warranty-period",
        category: "warranty",
        categoryLabel: "保証・サポート",
        question: "公開後のアフターサポートや保証はありますか？",
        answer: [
          "はい！全案件に公開後30日間の無償ハイパーケア保証が付帯します。不具合の修正やブラウザ対応を追加費用なしで速やかに行います。",
        ],
      },
    ],
    bottomCta: {
      title: "個別のご相談やカスタム案件のお見積もりはこちら",
      description: "記憶に残るデジタル体験をご一緒に創り上げましょう。お気軽にお問い合わせください。",
      explorePricing: "料金プラン・シミュレーター →",
      contactDirectly: "お問い合わせフォーム",
      termsLink: "利用規約とポリシー →",
    },
  },

  ur: {
    badge: "مدد اور عمومی سوالات",
    title: "عام پوچھے جانے والے سوالات (FAQ)",
    subtitle: "پروجیکٹ اسکوپ، قیمتیں، ڈیلیوری کا وقت، تھری ڈی ویب گل، اور کلائنٹ ورک اسپیس کے بارے میں اپنے سوالات کے فوری جوابات تلاش کریں۔",
    searchPlaceholder: "کوئی بھی سوال یا موضوع تلاش کریں (مثلاً: قیمت، ٹائم لائن، 3D، ریفنڈ)...",
    questionsFound: (count) => `${count} سوالات ملے`,
    expandAll: "سب کھولیں",
    collapseAll: "سب بند کریں",
    noQuestionsTitle: (query) => `"${query}" سے ملتا کوئی سوال نہیں ملا`,
    noQuestionsSubtitle: "کیا آپ کا کوئی مخصوص سوال ہے جو یہاں موجود نہیں؟ بلا جھجھک براہ راست رابطہ کریں۔",
    resetButton: "تلاش ری سیٹ کریں",
    keyTakeawaysLabel: "اہم نکات:",
    categories: [
      { id: "all", label: "تمام سوالات" },
      { id: "services", label: "خدمات اور اسکوپ" },
      { id: "pricing", label: "قیمتیں اور ادائیگی" },
      { id: "timeline", label: "وقت اور ڈیلیوری" },
      { id: "tech", label: "تھری ڈی اور ٹیکنالوجی" },
      { id: "portal", label: "کلائنٹ ورک اسپیس" },
      { id: "warranty", label: "وارنٹی اور مدد" },
    ],
    items: [
      {
        id: "services-offered",
        category: "services",
        categoryLabel: "خدمات اور اسکوپ",
        question: "آپ کس قسم کی ویب سائٹس اور ڈیجیٹل مصنوعات تیار کرتے ہیں؟",
        answer: [
          "میں اعلیٰ معیار کے لینڈنگ پیجز، لگژری برانڈ شوکیسز، تھری ڈی WebGL انٹرایکٹو ویب سائٹس، اور جدید سیکیور کلائنٹ پورٹل کے ساتھ فل اسٹیک Next.js ویب ایپلی کیشنز بنانے میں مہارت رکھتا ہوں۔",
          "ہر پروجیکٹ بغیر کسی تیار شدہ ورڈپریس ٹیمپلیٹ کے بالکل نئے اور صاف ستھرے کوڈ کے ساتھ تیار کیا جاتا ہے۔",
        ],
        keyPoints: [
          "Figma میں تیار کردہ خوبصورت UI/UX ڈیزائن",
          "Three.js اور React Three Fiber کے ذریعے انٹرایکٹو 3D مناظر",
          "Next.js 15 کے ساتھ انتہائی تیز رفتار لوڈنگ اور SEO",
        ],
      },
      {
        id: "payment-milestones",
        category: "pricing",
        categoryLabel: "قیمتیں اور ادائیگی",
        question: "ادائیگی کے مراحل اور ڈپازٹ کا طریقہ کار کیا ہے؟",
        answer: [
          "کسٹم پروجیکٹس میں کام شروع کرتے وقت 50% ایڈوانس ڈپازٹ اور بقیہ 50% کام مکمل ہونے اور اسٹیجنگ پر جانچ کے بعد ڈومین لائیو کرنے سے پہلے لیا جاتا ہے۔",
          "آن لائن پیکجز کا مکمل پیشگی بل ہوتا ہے جس کی خودکار رسید اور ورک اسپیس رسائی فوراً مل جاتی ہے۔",
        ],
      },
      {
        id: "turnaround-timeline",
        category: "timeline",
        categoryLabel: "وقت اور ڈیلیوری",
        question: "ایک ویب سائٹ بننے میں کتنا وقت لگتا ہے؟",
        answer: [
          "تکمیل کا دورانیہ پروجیکٹ کے سائز پر منحصر ہوتا ہے:",
        ],
        keyPoints: [
          "لینڈنگ پیجز: 1 سے 2 ہفتے",
          "3D انٹرایکٹو ویب تجربات: 3 سے 5 ہفتے",
          "فل اسٹیک ویب ایپس اور MVPs: 4 سے 6 ہفتے",
        ],
      },
      {
        id: "warranty-period",
        category: "warranty",
        categoryLabel: "وارنٹی اور مدد",
        question: "ویب سائٹ لائیو ہونے کے بعد کیا سپورٹ ملتی ہے؟",
        answer: [
          "جی ہاں! ہر پروجیکٹ کے ساتھ 30 دن کی مفت ہائپر کیئر وارنٹی ملتی ہے جس کے دوران کسی بھی مسئلے یا بگ کو بغیر کسی فیس کے فوری درست کیا جاتا ہے۔",
        ],
      },
    ],
    bottomCta: {
      title: "کیا آپ کا کوئی منفرد پروجیکٹ یا سوال ہے؟",
      description: "آئیے مل کر کچھ شاندار بناتے ہیں۔ اپنے پروجیکٹ پر بات کریں یا لاگت کا تخمینہ لگائیں۔",
      explorePricing: "قیمتیں اور پیکجز دیکھیں →",
      contactDirectly: "براہ راست رابطہ کریں",
      termsLink: "شرائط و پالیسیاں →",
    },
  },

  zh: {
    badge: "帮助中心与常见问题",
    title: "常见问题解答 (FAQ)",
    subtitle: "清晰解答有关项目范围、定价方案、3D WebGL体验、交付周期及最终成果交付的常见疑问。",
    searchPlaceholder: "搜索问题与主题（例如：价格、工期、3D、Razorpay、质保）...",
    questionsFound: (count) => `找到 ${count} 个相关问题`,
    expandAll: "全部展开",
    collapseAll: "全部收起",
    noQuestionsTitle: (query) => `未找到与 "${query}" 匹配的问题`,
    noQuestionsSubtitle: "有任何未在此涵盖的具体问题？欢迎随时直接与我们取得联系。",
    resetButton: "重置搜索",
    keyTakeawaysLabel: "核心要点：",
    categories: [
      { id: "all", label: "全部问题" },
      { id: "services", label: "服务与范围" },
      { id: "pricing", label: "价格与支付" },
      { id: "timeline", label: "周期与交付" },
      { id: "tech", label: "3D与技术栈" },
      { id: "portal", label: "客户工作区" },
      { id: "warranty", label: "质保与支持" },
    ],
    items: [
      {
        id: "services-offered",
        category: "services",
        categoryLabel: "服务与范围",
        question: "您主要设计和开发哪些类型的网站与数字化产品？",
        answer: [
          "我专注于打造高转化率的高端定制数字化产品：高性能营销着陆页、高端品牌交互展示页、基于 Three.js 的 3D WebGL 网站，以及具备安全鉴权客户仪表盘的全栈 Next.js 应用程序。",
          "每个项目均从底层手工编写优质代码，杜绝臃肿的 WordPress 模版或低质的页面拖拽生成器。",
        ],
        keyPoints: [
          "基于 Figma 进行像素级 UI/UX 原型定制与动效设计",
          "借助 Three.js 与 React Three Fiber 打造流畅的 3D Web 场景",
          "基于 Next.js 15 打造毫秒级加载与卓越 SEO 性能",
        ],
      },
      {
        id: "payment-milestones",
        category: "pricing",
        categoryLabel: "价格与支付",
        question: "付款阶段和定金机制是如何运作的？",
        answer: [
          "定制开发项目通常按照 50% 启动定金（签署协议后）+ 50% 最终尾款（在测试环境全面验收后、正式上线部署前）分期支付。",
          "对于官网直接购买的标准化套餐，支持在线全额安全付款，系统将自动出具发票并即刻为您开通客户工作区权限。",
        ],
      },
      {
        id: "turnaround-timeline",
        category: "timeline",
        categoryLabel: "周期与交付",
        question: "网站从立项到正式上线通常需要多长时间？",
        answer: [
          "具体工期取决于项目的复杂度与功能体量：",
        ],
        keyPoints: [
          "高转化着陆页：1 至 2 周",
          "3D 交互式品牌展示页：3 至 5 周",
          "全栈 Web 应用与 MVP：4 至 6 周",
        ],
      },
      {
        id: "warranty-period",
        category: "warranty",
        categoryLabel: "质保与支持",
        question: "网站上线后是否有售后保障和技术维护？",
        answer: [
          "当然！所有项目交付均享有 30 天无偿专属质保期。任何不可预期的 Bug 或跨设备浏览器适配微调，均免费立即修复。",
        ],
      },
    ],
    bottomCta: {
      title: "有定制化开发需求或特定疑问？",
      description: "让我们携手打造令人难忘的数字产品。预约需求沟通或使用计算器估算开发预算。",
      explorePricing: "查看价格与套餐 →",
      contactDirectly: "直接联络我们",
      termsLink: "条款与政策 →",
    },
  },
};
