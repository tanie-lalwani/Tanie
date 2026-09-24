import type { Locale } from "@/context/LanguageContext";

export type PackagesPageCopy = {
  nav: {
    home: string;
    projects: string;
    pricing: string;
    clientHub: string;
    qna: string;
    contact: string;
    faq: string;
    terms: string;
    mobileBuild: string;
    mobileMarketplace: string;
  };
  hero: {
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    inputPlaceholder: string;
    ctaButton: string;
    trustInstant: string;
    trustTransparent: string;
    trustNoPush: string;
    foundationTitle: string;
    foundations: {
      business: { title: string; desc: string };
      portfolio: { title: string; desc: string };
      ecommerce: { title: string; desc: string };
      saas: { title: string; desc: string };
    };
  };
  funnel: {
    step1Title: string;
    step1Subtitle: string;
    step2Title: string;
    step2Subtitle: string;
    step3Title: string;
    step3Subtitle: string;
    step4Title: string;
    step4Subtitle: string;
    step5Title: string;
    step5Subtitle: string;
    backBtn: string;
    nextBtn: string;
    calculateBtn: string;
    unlockTitle: string;
    unlockSubtitle: string;
    nameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    signupTab: string;
    signinTab: string;
    unlockBtn: string;
    instantDemoBtn: string;
    whatsappShare: string;
    proceedBooking: string;
    includedBase: string;
    totalInvestment: string;
    bundleDiscount: string;
  };
  categories: {
    all: string;
    editorial: string;
    saas: string;
    spatial3d: string;
    brutalist: string;
    tactile: string;
    cyber: string;
    artistic: string;
  };
  aesthetics: {
    showCatalog: string;
    showMatrix: string;
    colorDna: string;
    inspectPreview: string;
    chooseStyle: string;
  };
  addons: {
    tag: string;
    title: string;
    cms: { name: string; desc: string };
    ai: { name: string; desc: string };
    audio: { name: string; desc: string };
  };
  intakeModal: {
    title: string;
    subtitle: string;
    projectName: string;
    clientName: string;
    clientEmail: string;
    companyName: string;
    purpose: string;
    pages: string;
    timeline: string;
    submit: string;
    submitting: string;
    success: string;
    close: string;
  };
};

export const packagesTranslations: Record<Locale, PackagesPageCopy> = {
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
      pricing: "Pricing",
      clientHub: "Client Hub",
      qna: "Q&A",
      contact: "Contact",
      faq: "FAQ",
      terms: "Terms",
      mobileBuild: "✨ Build",
      mobileMarketplace: "Website Marketplace",
    },
    hero: {
      titlePrefix: "Calculate your ",
      titleHighlight: "website cost",
      subtitle: "Get an instant, transparent price estimate tailored to your exact industry and features.",
      inputPlaceholder: "What is your business or website name? (e.g. Acme Studio)",
      ctaButton: "Calculate My Cost ✨",
      trustInstant: "Instant estimates",
      trustTransparent: "100% Transparent",
      trustNoPush: "No sales push",
      foundationTitle: "Or pick your foundation to start customizing:",
      foundations: {
        business: {
          title: "Business / Brand",
          desc: "Establish brand credibility, capture inquiries & showcase work.",
        },
        portfolio: {
          title: "Portfolio / Creator",
          desc: "High-impact visual showcase for artists, agencies & founders.",
        },
        ecommerce: {
          title: "Online Store (E-Commerce)",
          desc: "Full catalog, automated checkout, UPI & card payments.",
        },
        saas: {
          title: "SaaS & Web App",
          desc: "Interactive web app interface with auth, dashboard & APIs.",
        },
      },
    },
    funnel: {
      step1Title: "Select Website Foundation",
      step1Subtitle: "Choose the baseline architecture that fits your project best.",
      step2Title: "Select Your Industry",
      step2Subtitle: "We optimize workflows, layouts, and feature bundles for your vertical.",
      step3Title: "Select Feature Modules",
      step3Subtitle: "Pick modular capabilities. Bundles include automatic discounts.",
      step4Title: "Budget & Timeline Target",
      step4Subtitle: "Tell us about your target launch date and investment range.",
      step5Title: "Your Instant Cost Estimate",
      step5Subtitle: "Itemized breakdown based on your tailored configuration.",
      backBtn: "← Back",
      nextBtn: "Next Step →",
      calculateBtn: "Calculate Estimate ✨",
      unlockTitle: "Save & Unlock Full Quote",
      unlockSubtitle: "Create a free client profile to lock in this estimate and start planning.",
      nameLabel: "Your Name",
      emailLabel: "Work Email",
      passwordLabel: "Password",
      signupTab: "Create Account",
      signinTab: "Sign In",
      unlockBtn: "Unlock & Save Proposal",
      instantDemoBtn: "⚡ 1-Click Instant Demo Proceed",
      whatsappShare: "Share via WhatsApp 💬",
      proceedBooking: "Proceed to Scope Booking →",
      includedBase: "Base Included",
      totalInvestment: "Total Investment",
      bundleDiscount: "Bundle Discount Applied",
    },
    categories: {
      all: "All",
      editorial: "Editorial & Luxury",
      saas: "Modern SaaS & Bento",
      spatial3d: "3D & Spatial",
      brutalist: "Pop & Brutalist",
      tactile: "Tactile & Organic",
      cyber: "Retro, Cyber & Y2K",
      artistic: "Artistic & Avant-Garde",
    },
    aesthetics: {
      showCatalog: "Show Aesthetics Catalog",
      showMatrix: "18-Category Detailed Scope Matrix",
      colorDna: "Signature Color DNA",
      inspectPreview: "Inspect Preview",
      chooseStyle: "Choose Style →",
    },
    addons: {
      tag: "Modular Add-ons",
      title: "Sprint Enhancements",
      cms: {
        name: "Headless CMS (Sanity / Contentful)",
        desc: "Visual self-serve content & blog manager.",
      },
      ai: {
        name: "Gemini / OpenAI AI Copilot",
        desc: "Custom-trained domain assistant & lead capture.",
      },
      audio: {
        name: "Original Soundscape & Micro Audio",
        desc: "Reactive sound design and ambient audio toggle.",
      },
    },
    intakeModal: {
      title: "Project Intake & Scope Request",
      subtitle: "Provide project details to receive a tailored sprint contract.",
      projectName: "Project Name",
      clientName: "Your Full Name",
      clientEmail: "Your Email Address",
      companyName: "Company / Organization",
      purpose: "Project Goal & Vision",
      pages: "Required Page Count",
      timeline: "Target Launch Deadline",
      submit: "Submit Project Scope",
      submitting: "Submitting Proposal...",
      success: "Proposal submitted successfully! Redirecting...",
      close: "Close",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      projects: "Proyectos",
      pricing: "Precios",
      clientHub: "Área de Clientes",
      qna: "Preguntas",
      contact: "Contacto",
      faq: "Preguntas Frecuentes",
      terms: "Términos",
      mobileBuild: "✨ Diseñar",
      mobileMarketplace: "Catálogo de Diseños Web",
    },
    hero: {
      titlePrefix: "Calcula el costo de tu ",
      titleHighlight: "sitio web",
      subtitle: "Obtén un presupuesto inmediato y transparente adaptado a tu sector y funciones deseadas.",
      inputPlaceholder: "¿Cuál es el nombre de tu empresa o proyecto? (ej. Acme Studio)",
      ctaButton: "Calcular Presupuesto ✨",
      trustInstant: "Presupuestos al instante",
      trustTransparent: "100% Transparente",
      trustNoPush: "Sin presiones comerciales",
      foundationTitle: "O elige tu base para empezar a personalizar:",
      foundations: {
        business: {
          title: "Empresa / Marca",
          desc: "Construye credibilidad, capta clientes potenciales y exhibe tus servicios.",
        },
        portfolio: {
          title: "Portafolio / Creador",
          desc: "Exhibición visual de alto impacto para artistas, agencias y fundadores.",
        },
        ecommerce: {
          title: "Tienda Online (E-Commerce)",
          desc: "Catálogo completo, cobro automatizado, pagos con tarjeta y pasarelas.",
        },
        saas: {
          title: "SaaS y App Web",
          desc: "Interfaz interactiva con autenticación, paneles y APIs.",
        },
      },
    },
    funnel: {
      step1Title: "Selecciona la Base del Sitio Web",
      step1Subtitle: "Elige la arquitectura inicial que mejor se adapte a tus objetivos.",
      step2Title: "Selecciona tu Industria",
      step2Subtitle: "Optimizamos flujos de trabajo, layouts y paquetes según tu rubro.",
      step3Title: "Selecciona Módulos y Funciones",
      step3Subtitle: "Elige capacidades modulares. Los paquetes incluyen descuentos automáticos.",
      step4Title: "Presupuesto y Plazos",
      step4Subtitle: "Indícanos tu fecha límite y rango estimado de inversión.",
      step5Title: "Tu Presupuesto Inmediato",
      step5Subtitle: "Desglose pormenorizado según tu configuración a medida.",
      backBtn: "← Atrás",
      nextBtn: "Siguiente →",
      calculateBtn: "Calcular Presupuesto ✨",
      unlockTitle: "Guarda y Desbloquea la Propuesta Completa",
      unlockSubtitle: "Crea tu perfil de cliente gratis para fijar esta cotización y comenzar la planificación.",
      nameLabel: "Tu Nombre",
      emailLabel: "Correo Profesional",
      passwordLabel: "Contraseña",
      signupTab: "Crear Cuenta",
      signinTab: "Iniciar Sesión",
      unlockBtn: "Desbloquear y Guardar Propuesta",
      instantDemoBtn: "⚡ Acceso Demo en 1 Clic",
      whatsappShare: "Compartir por WhatsApp 💬",
      proceedBooking: "Continuar con la Reserva →",
      includedBase: "Base Incluida",
      totalInvestment: "Inversión Total",
      bundleDiscount: "Descuento por Paquete Aplicado",
    },
    categories: {
      all: "Todos",
      editorial: "Editorial y Lujo",
      saas: "SaaS Moderno y Bento",
      spatial3d: "3D y Espacial",
      brutalist: "Pop y Brutalista",
      tactile: "Táctil y Orgánico",
      cyber: "Retro, Cyber y Y2K",
      artistic: "Artístico y Vanguardista",
    },
    aesthetics: {
      showCatalog: "Ver Catálogo de Estilos",
      showMatrix: "Matriz Detallada de 18 Categorías",
      colorDna: "ADN de Color Exclusivo",
      inspectPreview: "Ver Vista Previa",
      chooseStyle: "Elegir Estilo →",
    },
    addons: {
      tag: "Módulos Adicionales",
      title: "Mejoras de Sprint",
      cms: {
        name: "CMS Headless (Sanity / Contentful)",
        desc: "Gestor visual autogestionable para contenido y blog.",
      },
      ai: {
        name: "Copiloto IA Gemini / OpenAI",
        desc: "Asistente entrenado con tus datos para captación de leads.",
      },
      audio: {
        name: "Paisaje Sonoro y Micro-Audio",
        desc: "Diseño de sonido reactivo con control de ambiente.",
      },
    },
    intakeModal: {
      title: "Solicitud y Alcance del Proyecto",
      subtitle: "Facilítanos los detalles para preparar tu contrato de sprint a medida.",
      projectName: "Nombre del Proyecto",
      clientName: "Nombre Completo",
      clientEmail: "Correo Electrónico",
      companyName: "Empresa u Organización",
      purpose: "Objetivo y Visión del Proyecto",
      pages: "Cantidad de Páginas",
      timeline: "Fecha Límite Estimada",
      submit: "Enviar Alcance del Proyecto",
      submitting: "Enviando Propuesta...",
      success: "¡Propuesta enviada con éxito! Redirigiendo...",
      close: "Cerrar",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      projects: "Projets",
      pricing: "Tarifs",
      clientHub: "Espace Client",
      qna: "Questions",
      contact: "Contact",
      faq: "FAQ",
      terms: "Conditions",
      mobileBuild: "✨ Créer",
      mobileMarketplace: "Catalogue Web",
    },
    hero: {
      titlePrefix: "Calculez le coût de votre ",
      titleHighlight: "site web",
      subtitle: "Obtenez un devis instantané, transparent et adapté à votre secteur d'activité et vos fonctionnalités.",
      inputPlaceholder: "Quel est le nom de votre entreprise ou projet ? (ex. Studio Acme)",
      ctaButton: "Calculer mon Devis ✨",
      trustInstant: "Devis instantanés",
      trustTransparent: "100% Transparent",
      trustNoPush: "Aucune pression commerciale",
      foundationTitle: "Ou choisissez votre socle de départ :",
      foundations: {
        business: {
          title: "Entreprise / Marque",
          desc: "Affirmez votre crédibilité, captez des prospects et valorisez vos services.",
        },
        portfolio: {
          title: "Portfolio / Créateur",
          desc: "Présentation visuelle immersive pour artistes, agences et fondateurs.",
        },
        ecommerce: {
          title: "Boutique en Ligne (E-Commerce)",
          desc: "Catalogue complet, commande automatisée et paiements par carte bancaire.",
        },
        saas: {
          title: "SaaS & Application Web",
          desc: "Interface moderne interactive avec authentification, tableaux de bord et APIs.",
        },
      },
    },
    funnel: {
      step1Title: "Sélectionnez le Socle de votre Site",
      step1Subtitle: "Choisissez l'architecture de base adaptée à vos ambitions.",
      step2Title: "Sélectionnez votre Secteur",
      step2Subtitle: "Nous optimisons les flux, les mises en page et les modules selon votre domaine.",
      step3Title: "Sélectionnez les Modules Fonctionnels",
      step3Subtitle: "Sélectionnez les fonctionnalités. Les packs incluent des remises dégressives.",
      step4Title: "Budget et Calendrier",
      step4Subtitle: "Précisez votre date de mise en ligne souhaitée et votre fourchette d'investissement.",
      step5Title: "Votre Estimation Immédiate",
      step5Subtitle: "Détail chiffré basé sur votre configuration personnalisée.",
      backBtn: "← Précédent",
      nextBtn: "Étape Suivante →",
      calculateBtn: "Calculer l'Estimation ✨",
      unlockTitle: "Enregistrez et Débloquez le Devis Complet",
      unlockSubtitle: "Créez votre profil client gratuit pour verrouiller ce tarif et lancer la planification.",
      nameLabel: "Votre Nom",
      emailLabel: "Email Professionnel",
      passwordLabel: "Mot de passe",
      signupTab: "Créer un Compte",
      signinTab: "Se Connecter",
      unlockBtn: "Débloquer et Enregistrer la Proposition",
      instantDemoBtn: "⚡ Démo Immédiate en 1 Clic",
      whatsappShare: "Partager sur WhatsApp 💬",
      proceedBooking: "Passer à la Réservation →",
      includedBase: "Base Incluse",
      totalInvestment: "Investissement Total",
      bundleDiscount: "Remise Pack Appliquée",
    },
    categories: {
      all: "Tous",
      editorial: "Éditorial & Luxe",
      saas: "SaaS Moderne & Bento",
      spatial3d: "3D & Spatial",
      brutalist: "Pop & Brutaliste",
      tactile: "Tactile & Organique",
      cyber: "Rétro, Cyber & Y2K",
      artistic: "Artistique & Avant-Garde",
    },
    aesthetics: {
      showCatalog: "Afficher le Catalogue Visuel",
      showMatrix: "Matrice Détaillée 18 Catégories",
      colorDna: "ADN Couleur Signature",
      inspectPreview: "Aperçu Interactif",
      chooseStyle: "Choisir ce Style →",
    },
    addons: {
      tag: "Modules Complémentaires",
      title: "Extensions de Sprint",
      cms: {
        name: "CMS Headless (Sanity / Contentful)",
        desc: "Gestionnaire visuel de contenus et d'articles en autonomie.",
      },
      ai: {
        name: "Copilote IA Gemini / OpenAI",
        desc: "Assistant entraîné sur votre domaine pour qualifier les prospects.",
      },
      audio: {
        name: "Paysage Sonore & Micro-Audio",
        desc: "Design sonore réactif avec contrôle d'ambiance intégré.",
      },
    },
    intakeModal: {
      title: "Cahier des Charges & Demande de Projet",
      subtitle: "Remplissez vos critères pour obtenir une proposition de sprint adaptée.",
      projectName: "Nom du Projet",
      clientName: "Nom Complet",
      clientEmail: "Adresse Email",
      companyName: "Entreprise / Organisation",
      purpose: "Objectif et Vision",
      pages: "Nombre de Pages Requises",
      timeline: "Délai de Livraison Souhaité",
      submit: "Soumettre le Cahier des Charges",
      submitting: "Envoi en cours...",
      success: "Proposition envoyée avec succès ! Redirection...",
      close: "Fermer",
    },
  },
  hi: {
    nav: {
      home: "होम",
      projects: "प्रोजेक्ट्स",
      pricing: "मूल्य निर्धारण",
      clientHub: "क्लाइंट हब",
      qna: "प्रश्नोत्तरी",
      contact: "संपर्क",
      faq: "सामान्य प्रश्न",
      terms: "नियम व शर्तें",
      mobileBuild: "✨ बनाएं",
      mobileMarketplace: "वेबसाइट मार्केटप्लेस",
    },
    hero: {
      titlePrefix: "अपनी वेबसाइट का ",
      titleHighlight: "खर्च जानें",
      subtitle: "अपने उद्योग और आवश्यक फीचर्स के अनुसार तुरंत और पारदर्शी लागत अनुमान प्राप्त करें।",
      inputPlaceholder: "आपके व्यवसाय या वेबसाइट का नाम क्या है? (उदा. Acme Studio)",
      ctaButton: "लागत कैलकुलेट करें ✨",
      trustInstant: "तुरंत अनुमान",
      trustTransparent: "100% पारदर्शी",
      trustNoPush: "कोई सेल्स दबाव नहीं",
      foundationTitle: "या कस्टमाइज़ करने के लिए अपनी वेबसाइट का आधार चुनें:",
      foundations: {
        business: {
          title: "व्यवसाय / ब्रांड",
          desc: "ब्रांड की विश्वसनीयता बनाएं, पूछताछ प्राप्त करें और कार्य प्रदर्शित करें।",
        },
        portfolio: {
          title: "पोर्टफोलियो / क्रिएटर",
          desc: "कलाकारों, एजेंसियों और संस्थापकों के लिए प्रभावशाली विजुअल शोकेस।",
        },
        ecommerce: {
          title: "ऑनलाइन स्टोर (ई-कॉमर्स)",
          desc: "संपूर्ण उत्पाद कैटलॉग, स्वचालित चेकआउट, यूपीआई और कार्ड भुगतान।",
        },
        saas: {
          title: "SaaS और वेब ऐप",
          desc: "ऑथेंटिकेशन, डैशबोर्ड और एपीआई के साथ इंटरैक्टिव वेब ऐप्लिकेशन।",
        },
      },
    },
    funnel: {
      step1Title: "वेबसाइट की नींव चुनें",
      step1Subtitle: "वह आधारभूत आर्किटेक्चर चुनें जो आपके प्रोजेक्ट के लिए सबसे उपयुक्त हो।",
      step2Title: "अपना उद्योग चुनें",
      step2Subtitle: "हम आपके क्षेत्र के अनुसार वर्कफ़्लो, लेआउट और फीचर्स तैयार करते हैं।",
      step3Title: "फ़ीचर मॉड्यूल्स का चयन करें",
      step3Subtitle: "मॉड्यूलर क्षमताएं चुनें। पैकेज में स्वचालित छूट शामिल है।",
      step4Title: "बजट और लॉन्च की समयसीमा",
      step4Subtitle: "हमें अपनी लक्षित लॉन्च तिथि और निवेश सीमा बताएं।",
      step5Title: "आपका त्वरित लागत अनुमान",
      step5Subtitle: "आपके चुने हुए कॉन्फ़िगरेशन के आधार पर विस्तृत मद-वार विवरण।",
      backBtn: "← पीछे जाएं",
      nextBtn: "अगला चरण →",
      calculateBtn: "अनुमान कैलकुलेट करें ✨",
      unlockTitle: "संपूर्ण कोटेशन सहेजें और अनलॉक करें",
      unlockSubtitle: "इस कोटेशन को सुरक्षित रखने और योजना शुरू करने के लिए निःशुल्क क्लाइंट प्रोफ़ाइल बनाएं।",
      nameLabel: "आपका नाम",
      emailLabel: "कार्य ईमेल",
      passwordLabel: "पासवर्ड",
      signupTab: "खाता बनाएं",
      signinTab: "साइन इन",
      unlockBtn: "प्रस्ताव अनलॉक करें और सहेजें",
      instantDemoBtn: "⚡ 1-क्लिक इंस्टेंट डेमो आगे बढ़ें",
      whatsappShare: "व्हाट्सएप पर साझा करें 💬",
      proceedBooking: "स्कोप बुकिंग की ओर बढ़ें →",
      includedBase: "मूल आधार शामिल",
      totalInvestment: "कुल निवेश",
      bundleDiscount: "बंडल छूट लागू",
    },
    categories: {
      all: "सभी",
      editorial: "संपादकीय और विलासिता",
      saas: "आधुनिक SaaS और बेंटो",
      spatial3d: "3D और स्थानिक",
      brutalist: "पॉप और ब्रूटलिस्ट",
      tactile: "स्पर्शनीय और प्राकृतिक",
      cyber: "रेट्रो, साइबर और Y2K",
      artistic: "कलात्मक और अवांट-गार्डे",
    },
    aesthetics: {
      showCatalog: "एस्थेटिक्स कैटलॉग देखें",
      showMatrix: "18-श्रेणी विस्तृत स्कोप मैट्रिक्स",
      colorDna: "हस्ताक्षर रंग डीएनए",
      inspectPreview: "पूर्वावलोकन देखें",
      chooseStyle: "शैली चुनें →",
    },
    addons: {
      tag: "मॉड्यूलर ऐड-ऑन",
      title: "स्प्रिंट संवर्द्धन",
      cms: {
        name: "हेडलेस CMS (Sanity / Contentful)",
        desc: "सामग्री और ब्लॉग के लिए आसान विज़ुअल एडिटर।",
      },
      ai: {
        name: "Gemini / OpenAI AI कोपायलट",
        desc: "क्लाइंट प्रश्नों और लीड कैप्चर के लिए प्रशिक्षित डोमेन असिस्टेंट।",
      },
      audio: {
        name: "ओरिजिनल साउंडस्केप और माइक्रो ऑडियो",
        desc: "इंटरैक्शन के लिए रिस्पॉन्सिव साउंड डिज़ाइन और एम्बिएंट ऑडियो।",
      },
    },
    intakeModal: {
      title: "प्रोजेक्ट इनटेक और स्कोप अनुरोध",
      subtitle: "अनुकूलित स्प्रिंट अनुबंध प्राप्त करने के लिए प्रोजेक्ट विवरण साझा करें।",
      projectName: "प्रोजेक्ट का नाम",
      clientName: "आपका पूरा नाम",
      clientEmail: "आपका ईमेल पता",
      companyName: "कंपनी / संगठन",
      purpose: "प्रोजेक्ट का लक्ष्य और दृष्टि",
      pages: "आवश्यक पृष्ठों की संख्या",
      timeline: "लक्षित लॉन्च तिथि",
      submit: "प्रोजेक्ट स्कोप सबमिट करें",
      submitting: "प्रस्ताव सबमिट हो रहा है...",
      success: "प्रस्ताव सफलतापूर्वक सबमिट हो गया! रीडायरेक्ट हो रहा है...",
      close: "बंद करें",
    },
  },
  ja: {
    nav: {
      home: "ホーム",
      projects: "制作実績",
      pricing: "料金プラン",
      clientHub: "クライアント専用",
      qna: "質疑応答",
      contact: "お問い合わせ",
      faq: "よくある質問",
      terms: "利用規約",
      mobileBuild: "✨ 作成",
      mobileMarketplace: "ウェブ制作マーケット",
    },
    hero: {
      titlePrefix: "ウェブサイトの",
      titleHighlight: "制作費用を計算",
      subtitle: "業種と必要な機能に合わせた、透明性のある正確な見積もりを瞬時に算出します。",
      inputPlaceholder: "貴社名またはプロジェクト名を入力してください（例: Acme Studio）",
      ctaButton: "見積もりを計算する ✨",
      trustInstant: "即時見積もり",
      trustTransparent: "100% 透明な料金",
      trustNoPush: "強引な営業なし",
      foundationTitle: "または基本構成を選んでカスタマイズを開始：",
      foundations: {
        business: {
          title: "ビジネス / ブランド",
          desc: "信頼性を高め、問い合わせを獲得し、実績を魅力的にアピール。",
        },
        portfolio: {
          title: "ポートフォリオ / クリエイター",
          desc: "アーティスト、エージェンシー、創業者のための印象的なビジュアル演出。",
        },
        ecommerce: {
          title: "オンラインストア（EC）",
          desc: "充実した商品一覧、自動決済、クレジットカード決済対応。",
        },
        saas: {
          title: "SaaS & ウェブアプリ",
          desc: "認証、管理ダッシュボード、API連携を備えたインタラクティブ仕様。",
        },
      },
    },
    funnel: {
      step1Title: "サイトの基本構成を選択",
      step1Subtitle: "目的に最も合致する基盤アーキテクチャをお選びください。",
      step2Title: "業種を選択",
      step2Subtitle: "業界特性に合わせて最適なレイアウトや機能バンドルを設計します。",
      step3Title: "機能モジュールを選択",
      step3Subtitle: "必要な機能を自由に追加。複数選択で自動割引が適用されます。",
      step4Title: "ご予算と納期の目安",
      step4Subtitle: "ご希望の公開時期と想定投資額をお知らせください。",
      step5Title: "算出された見積もり結果",
      step5Subtitle: "ご指定の構成に基づいた詳細な内訳をご確認いただけます。",
      backBtn: "← 戻る",
      nextBtn: "次へ進む →",
      calculateBtn: "見積もりを算出 ✨",
      unlockTitle: "詳細見積もりを保存・確認",
      unlockSubtitle: "無料アカウントを作成して見積価格を確定し、制作準備をスタート。",
      nameLabel: "お名前",
      emailLabel: "業務用メールアドレス",
      passwordLabel: "パスワード",
      signupTab: "新規アカウント作成",
      signinTab: "ログイン",
      unlockBtn: "見積もりを保存して確認",
      instantDemoBtn: "⚡ 1クリックですぐに確認",
      whatsappShare: "WhatsAppで共有 💬",
      proceedBooking: "制作予約へ進む →",
      includedBase: "基本構成込み",
      totalInvestment: "総投資予定額",
      bundleDiscount: "バンドル割引適用済み",
    },
    categories: {
      all: "すべて",
      editorial: "エディトリアル＆ラグジュアリー",
      saas: "モダンSaaS＆ベントー",
      spatial3d: "3D＆空間表現",
      brutalist: "ポップ＆ブルータリスト",
      tactile: "触感＆オーガニック",
      cyber: "レトロ・サイバー＆Y2K",
      artistic: "アーティスティック＆前衛的",
    },
    aesthetics: {
      showCatalog: "デザインカタログを表示",
      showMatrix: "18カテゴリ詳細仕様マトリクス",
      colorDna: "シグネチャーカラーパレット",
      inspectPreview: "プレビューを確認",
      chooseStyle: "このスタイルを選択 →",
    },
    addons: {
      tag: "モジュール拡張",
      title: "スプリント追加オプション",
      cms: {
        name: "ヘッドレスCMS (Sanity / Contentful)",
        desc: "直感的にコンテンツやブログを更新できる管理画面。",
      },
      ai: {
        name: "Gemini / OpenAI AIコパイロット",
        desc: "問い合わせ対応やリード獲得のための独自学習AIアシスタント。",
      },
      audio: {
        name: "オリジナル音響＆マイクロオーディオ",
        desc: "ユーザー操作に反応するサウンドデザインと環境音切替。",
      },
    },
    intakeModal: {
      title: "プロジェクト要件ヒアリング",
      subtitle: "詳細をご共有いただくことで、最適な制作契約プランをご提案します。",
      projectName: "プロジェクト名",
      clientName: "ご氏名",
      clientEmail: "メールアドレス",
      companyName: "貴社名・組織名",
      purpose: "プロジェクトの目的と展望",
      pages: "想定ページ数",
      timeline: "ご希望の公開時期",
      submit: "要件を送信する",
      submitting: "送信中...",
      success: "送信完了しました！専用画面へ移動します...",
      close: "閉じる",
    },
  },
  ur: {
    nav: {
      home: "ہوم",
      projects: "منصوبے",
      pricing: "قیمتیں",
      clientHub: "کلائنٹ پورٹل",
      qna: "سوال و جواب",
      contact: "رابطہ",
      faq: "عام سوالات",
      terms: "شرائط و ضوابط",
      mobileBuild: "✨ بنائیں",
      mobileMarketplace: "ویب سائٹ مارکیٹ",
    },
    hero: {
      titlePrefix: "اپنی ویب سائٹ کی ",
      titleHighlight: "لاگت معلوم کریں",
      subtitle: "اپنی مخصوص صنعت اور مطلوبہ فیچرز کے مطابق فوری اور شفاف لاگت کا تخمینہ حاصل کریں۔",
      inputPlaceholder: "آپ کے کاروبار یا ویب سائٹ کا نام کیا ہے؟ (مثال: Acme Studio)",
      ctaButton: "لاگت کا تخمینہ لگائیں ✨",
      trustInstant: "فوری تخمینہ",
      trustTransparent: "100% شفاف",
      trustNoPush: "کوئی غیر ضروری دباؤ نہیں",
      foundationTitle: "یا اپنی مرضی کے مطابق ترتیب دینے کے لیے بنیاد منتخب کریں:",
      foundations: {
        business: {
          title: "کاروبار / برانڈ",
          desc: "برانڈ کا اعتماد قائم کریں، گاہکوں کے پیغامات حاصل کریں اور کام دکھائیں۔",
        },
        portfolio: {
          title: "پورٹ فولیو / تخلیق کار",
          desc: "فنکاروں، ایجنسیوں اور بانیوں کے لیے شاندار بصری نمائش۔",
        },
        ecommerce: {
          title: "آن لائن اسٹور (ای کامرس)",
          desc: "مکمل مصنوعات کی فہرست، خودکار چیک آؤٹ، اور آن لائن ادائیگیاں۔",
        },
        saas: {
          title: "SaaS اور ویب ایپلیکیشن",
          desc: "لاگ ان، ڈیش بورڈ اور APIs کے ساتھ جدید انٹرایکٹو انٹرفیس۔",
        },
      },
    },
    funnel: {
      step1Title: "ویب سائٹ کی بنیادی ساخت منتخب کریں",
      step1Subtitle: "وہ بنیادی ڈھانچہ منتخب کریں جو آپ کے منصوبے کے لیے موزوں ترین ہو۔",
      step2Title: "اپنی صنعت کا انتخاب کریں",
      step2Subtitle: "ہم آپ کے شعبے کے لحاظ سے لے آؤٹ اور فیچرز کو بہتر بناتے ہیں۔",
      step3Title: "فیچر ماڈیولز منتخب کریں",
      step3Subtitle: "ضروری خصوصیات کا انتخاب کریں۔ بنڈلز پر خودکار رعایت شامل ہے۔",
      step4Title: "بجٹ اور لانچ کا وقت",
      step4Subtitle: "ہمیں اپنی ہدف لانچ کی تاریخ اور متوقع سرمایہ کاری کی حد بتائیں۔",
      step5Title: "آپ کا فوری لاگت کا تخمینہ",
      step5Subtitle: "آپ کی ترجیحات کے مطابق تفصیل سے تیار کردہ تخمینہ۔",
      backBtn: "← واپس",
      nextBtn: "اگلا مرحلہ →",
      calculateBtn: "تخمینہ لگائیں ✨",
      unlockTitle: "مکمل کوٹیشن محفوظ اور ان لاک کریں",
      unlockSubtitle: "اس کوٹیشن کو محفوظ رکھنے اور منصوبہ بندی شروع کرنے کے لیے مفت پروفائل بنائیں۔",
      nameLabel: "آپ کا نام",
      emailLabel: "کاروباری ای میل",
      passwordLabel: "پاس ورڈ",
      signupTab: "نیا اکاؤنٹ بنائیں",
      signinTab: "لاگ ان کریں",
      unlockBtn: "محفوظ کریں اور ان لاک کریں",
      instantDemoBtn: "⚡ 1-کلک فوری ڈیمو آگے بڑھیں",
      whatsappShare: "واٹس ایپ پر شیئر کریں 💬",
      proceedBooking: "بکنگ کی طرف بڑھیں →",
      includedBase: "بنیادی پیکج شامل",
      totalInvestment: "کل سرمایہ کاری",
      bundleDiscount: "بنڈل رعایت لاگو",
    },
    categories: {
      all: "تمام",
      editorial: "ادارتی اور پرتعیش",
      saas: "جدید SaaS اور بینٹو",
      spatial3d: "تھری ڈی اور فضائی",
      brutalist: "پاپ اور بروٹلسٹ",
      tactile: "لمسی اور قدرتی",
      cyber: "ریٹرو، سائبر اور Y2K",
      artistic: "فنکارانہ اور جدید ترین",
    },
    aesthetics: {
      showCatalog: "ڈیزائن کیٹلاگ دیکھیں",
      showMatrix: "18-کیٹیگریز تفصیلی میٹرکس",
      colorDna: "دستخطی رنگوں کا ڈی این اے",
      inspectPreview: "پیش نظارہ دیکھیں",
      chooseStyle: "یہ انداز منتخب کریں ←",
    },
    addons: {
      tag: "ماڈیولر اضافی خصوصیات",
      title: "اسپرنٹ کے اضافے",
      cms: {
        name: "ہیڈ لیس CMS (Sanity / Contentful)",
        desc: "مواد اور بلاگ کے لیے آسان بصری مینیجر۔",
      },
      ai: {
        name: "Gemini / OpenAI AI کوپائلٹ",
        desc: "صارفین کے سوالات کے جوابات اور لیڈز کے لیے تربیت یافتہ اسسٹنٹ۔",
      },
      audio: {
        name: "اصل ساؤنڈ اسکیپ اور مائیکرو آڈیو",
        desc: "صارف کی سرگرمی کے مطابق موسیقی اور ماحولیاتی آوازیں۔",
      },
    },
    intakeModal: {
      title: "پروجیکٹ کی تفصیلات اور درخواست",
      subtitle: "منصوبے کا معاہدہ تیار کرنے کے لیے بنیادی تفصیلات فراہم کریں۔",
      projectName: "پروجیکٹ کا نام",
      clientName: "آپ کا پورا نام",
      clientEmail: "آپ کا ای میل ایڈریس",
      companyName: "کمپنی / تنظیم",
      purpose: "پروجیکٹ کا مقصد اور وژن",
      pages: "صفحات کی مطلوبہ تعداد",
      timeline: "لانچ کی متوقع تاریخ",
      submit: "پروجیکٹ کی تفصیلات بھیجیں",
      submitting: "ارسال کیا جا رہا ہے...",
      success: "درخواست کامیابی کے ساتھ موصول ہو گئی! آگے بڑھا جا رہا ہے...",
      close: "بند کریں",
    },
  },
  zh: {
    nav: {
      home: "首页",
      projects: "作品案例",
      pricing: "服务定价",
      clientHub: "客户中心",
      qna: "问答专区",
      contact: "联系我们",
      faq: "常见问题",
      terms: "条款政策",
      mobileBuild: "✨ 搭建",
      mobileMarketplace: "网站设计市场",
    },
    hero: {
      titlePrefix: "计算您的",
      titleHighlight: "网站定制预算",
      subtitle: "针对您的具体行业与功能需求，快速获取透明、详细的费用估算。",
      inputPlaceholder: "您的公司或项目名称是什么？（例如：Acme Studio）",
      ctaButton: "计算我的费用 ✨",
      trustInstant: "即时精准估算",
      trustTransparent: "100% 价格透明",
      trustNoPush: "绝无推销打扰",
      foundationTitle: "或直接选择基础架构开启定制：",
      foundations: {
        business: {
          title: "企业 / 品牌官网",
          desc: "建立品牌公信力，获取优质客户线索并展示产品服务。",
        },
        portfolio: {
          title: "个人主页 / 创作者",
          desc: "为艺术家、独立创作者与创始人打造的极具视觉冲击力的展示页面。",
        },
        ecommerce: {
          title: "线上商城（独立站）",
          desc: "完整产品目录、自动化结账结算，支持多币种与在线支付。",
        },
        saas: {
          title: "SaaS 与 Web 应用",
          desc: "具备登录权限系统、数据仪表盘与 API 对接的现代化交互界面。",
        },
      },
    },
    funnel: {
      step1Title: "选择网站基础架构",
      step1Subtitle: "选择最符合您项目起步定位的基准架构。",
      step2Title: "选择所属行业",
      step2Subtitle: "我们将针对您的行业垂直领域优化工作流、布局与功能组合。",
      step3Title: "选择所需功能模块",
      step3Subtitle: "按需挑选模块化功能。组合预订享受阶梯式折扣。",
      step4Title: "预算与上线周期",
      step4Subtitle: "请告知您的预期交付日期与投资预算范围。",
      step5Title: "您的即时预算估算",
      step5Subtitle: "基于您所选配置的详细分项核算清单。",
      backBtn: "← 上一步",
      nextBtn: "下一步 →",
      calculateBtn: "生成预算估算 ✨",
      unlockTitle: "保存并解锁完整报价方案",
      unlockSubtitle: "创建免费客户档案以锁定该估算价格并启动项目规划。",
      nameLabel: "您的姓名",
      emailLabel: "工作邮箱",
      passwordLabel: "账户密码",
      signupTab: "创建账号",
      signinTab: "登录账号",
      unlockBtn: "解锁并保存方案",
      instantDemoBtn: "⚡ 1键免密演示进入",
      whatsappShare: "通过 WhatsApp 分享 💬",
      proceedBooking: "前往确认需求与预订 →",
      includedBase: "包含基础配置",
      totalInvestment: "总投资预估",
      bundleDiscount: "已享受组合折扣",
    },
    categories: {
      all: "全部风格",
      editorial: "社论排版与奢华感",
      saas: "现代 SaaS 与 Bento",
      spatial3d: "3D 与空间交互",
      brutalist: "波普与新野兽派",
      tactile: "质感触觉与有机自然",
      cyber: "复古未来、赛博与 Y2K",
      artistic: "艺术表现与先锋实验",
    },
    aesthetics: {
      showCatalog: "查看美学风格目录",
      showMatrix: "18 类详细范围矩阵",
      colorDna: "专属色彩基因",
      inspectPreview: "查看交互预览",
      chooseStyle: "选择该风格 →",
    },
    addons: {
      tag: "模块化扩展",
      title: "冲刺增强包",
      cms: {
        name: "Headless CMS (Sanity / Contentful)",
        desc: "可视化内容与博客自主管理后台。",
      },
      ai: {
        name: "Gemini / OpenAI AI 智能副驾",
        desc: "针对业务知识专属训练的客服问答与获客助手。",
      },
      audio: {
        name: "原创氛围音效与微交互音效",
        desc: "响应用户交互的声音设计与环境背景音切换。",
      },
    },
    intakeModal: {
      title: "项目需求收集与规划",
      subtitle: "填写项目要点，以便为您定制专属交付合同方案。",
      projectName: "项目名称",
      clientName: "您的姓名",
      clientEmail: "您的电子邮箱",
      companyName: "公司 / 团队名称",
      purpose: "项目目标与视觉构想",
      pages: "所需页面数量",
      timeline: "期望上线时间",
      submit: "提交项目需求",
      submitting: "正在提交需求...",
      success: "需求提交成功！正在跳转至客户中心...",
      close: "关闭",
    },
  },
};
