import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type Locale = "en" | "es" | "fr" | "hi" | "ja" | "ur" | "zh"

export type LanguageOption = {
  locale: Locale
  code: string
  label: string
}

export type ProjectCopy = {
  title: string
  description: string
  techStack: string[]
  site: string
  code?: string
}

type SiteCopy = {
  nav: {
    qna: string
    languages: string
    interviewPrompt: string
    homeLabel: string
    contactLabel: string
  }
  loading: {
    welcome: string
  }
  home: {
    heroTitle: string
    heroRole: string
    heroDescription: string
    aboutTitle: string
    aboutParagraphs: string[]
    aboutParagraphsMobile?: string[]
    knowMore: string
    projectsTitle: string
    contactTitle: string
    projects: ProjectCopy[]
  }
  qna: {
    questions: string[]
    homeLabel: string
    contactLabel: string
    videoPlaceholder: string
    like: string
    comment: string
    share: string
    save: string
    bot: string
    projectsCountLabel: string
  }
  footer: {
    role: string
    copyright: string
  }
  contact: {
    labels: {
      name: string
      email: string
      subject: string
      message: string
    }
    placeholders: {
      name: string
      email: string
      subject: string
      message: string
    }
    button: string
    sending: string
    success: string
    error: string
    networkError: string
    endpointError: string
  }
  projectCard: {
    view: string
    code: string
    projectsCountSuffix: string
  }
}

const STORAGE_KEY = "site-locale"

export const languageOptions: LanguageOption[] = [
  { locale: "en", code: "EN", label: "English" },
  { locale: "es", code: "ES", label: "Spanish" },
  { locale: "fr", code: "FR", label: "French" },
  { locale: "hi", code: "HI", label: "Hindi" },
  { locale: "ja", code: "JP", label: "Japanese" },
  { locale: "ur", code: "UR", label: "Urdu" },
  { locale: "zh", code: "ZH", label: "Chinese" },
]

const translations: Record<Locale, SiteCopy> = {
  en: {
    nav: {
      qna: "QnA",
      languages: "Languages",
      interviewPrompt: "Interview me here",
      homeLabel: "Home",
      contactLabel: "Contact",
    },
    loading: {
      welcome: "Welcome",
    },
    home: {
      heroTitle: "I'm Tanie!",
      heroRole: "Creative Developer",
      heroDescription:
        "I make interactive websites, 3D web experiences, and modern responsive web applications. Scroll to see my work or jump to contact section",
      aboutTitle: "A bit about me:",
      aboutParagraphs: [
        "Hi, I’m Tanie Lalwani, a creative and full-stack developer based in India. I’m a data science graduate, and I first got into tech at 16. Over time, I found myself interested in almost everything like data, blockchain, ML, dev-rel, and most of the usual tech buzzwords, but the thing that stuck with me the longest was web design.",
        "I liked websites more when they stood out. Not just functional, but memorable. That curiosity slowly pushed me toward interactive and creative web experiences, 3D websites, motion, and frontend work that feels a little more alive.",
        "Over the last few years, that turned into 100+ projects across landing pages, web apps, interactive experiences, and different tech stacks. I’ve spent 2+ years freelancing with founders, creators, startups, and personal brands.",
        "A huge part of my initial growth came from hackathons, tech communities, volunteering, fast deadlines, freelancing and learning in public and lately, from learning through the people around me.",
        "Outside tech, I spend time making music, creating content, experimenting with visuals, business products, fashion, and random hobbies I somehow end up trying at least once. One way or another, we’ll probably have fun working together.",
      ],
      aboutParagraphsMobile: [
        "Hi, I'm Tanie Lalwani, a creative full-stack developer from India and a data science graduate. I started tech at 16, explored data, blockchain, ML, and dev-rel, but kept coming back to web design.",
        "I build memorable websites: interactive UI, 3D web, motion, and frontend work that feels alive.",
        "I've made 100+ projects and spent 2+ years freelancing with founders, creators, startups, and personal brands.",
        "Hackathons, tech communities, volunteering, fast deadlines, freelancing, and learning in public shaped how I work.",
        "Outside tech, I make music, content, visuals, and experiment with products, fashion, and random hobbies.",
      ],
      knowMore: "Know more",
      projectsTitle: "Work & Testimonials:",
      contactTitle: "Let's build together...",
      projects: [
        {
          title: "Viziona",
          description:
            "A responsive web application shaped around clear interaction, UI/UX design, and practical product execution.",
          techStack: ["React", "TypeScript", "UI/UX"],
          site: "https://viziona.com",
          code: "https://github.com/tanie-lalwani/viziona",
        },
        {
          title: "Checkout Performance Overhaul - FinchPay",
          description:
            "A frontend performance optimization pass for faster checkout flows, clearer states, and smoother feedback.",
          techStack: ["React", "TypeScript", "Performance"],
          site: "https://finchpay.app",
        },
        {
          title: "Marketing Site Rebuild - Leafline",
          description:
            "A modern frontend rebuild with tighter content structure, responsive layouts, and a calmer visual system.",
          techStack: ["React", "TypeScript", "Web development"],
          site: "https://leafline.studio",
        },
      ],
    },
    qna: {
      questions: [
        "Tell me about yourself.",
        "Walk me through a project you are proud of.",
        "How do you handle bugs in production?",
        "Describe a time you disagreed with a teammate.",
        "How do you optimize frontend performance?",
        "Why do you want this role?",
      ],
      homeLabel: "Home",
      contactLabel: "Contact",
      videoPlaceholder: "Video Placeholder",
      like: "Like",
      comment: "Comment",
      share: "Share",
      save: "Save",
      bot: "bot",
      projectsCountLabel: "projects",
    },
    footer: {
      role: "Creative Developer",
      copyright: "© 2026 Tanie Lalwani : Built with React, TypeScript, Three.js, and a lot of coffee.",
    },
    contact: {
      labels: {
        name: "Name",
        email: "Email",
        subject: "Subject",
        message: "Message",
      },
      placeholders: {
        name: "Your name",
        email: "your@email.com",
        subject: "What's this about?",
        message: "Tell me about your project...",
      },
      button: "Send message",
      sending: "Sending...",
      success: "Message sent! I'll get back to you soon.",
      error: "Failed to send message. Please try again.",
      networkError: "Network error. Please check your connection and try again.",
      endpointError: "Form endpoint is not configured.",
    },
    projectCard: {
      view: "View",
      code: "Code",
      projectsCountSuffix: "projects",
    },
  },
  es: {
    nav: {
      qna: "QnA",
      languages: "Idiomas",
      interviewPrompt: "Hazme una entrevista aquí",
      homeLabel: "Inicio",
      contactLabel: "Contacto",
    },
    loading: {
      welcome: "Bienvenido",
    },
    home: {
      heroTitle: "¡Soy Tanie!",
      heroRole: "Desarrollador creativo",
      heroDescription:
        "Creo sitios web interactivos, experiencias web en 3D y aplicaciones web modernas y responsive con React, TypeScript e ingeniería frontend cuidadosa.",
      aboutTitle: "Un poco sobre mí:",
      aboutParagraphs: [
        "¿Buscas un portafolio, una experiencia interactiva, una construcción frontend moderna o una landing page con intención?",
        "Soy desarrollador frontend y desarrollador React; llevo los últimos dos años construyendo, experimentando y aprendiendo qué hace que una interfaz sea realmente agradable de usar.",
        "Me gustan los flujos limpios con TypeScript, las interacciones pulidas, los detalles de UI/UX y un desarrollo web útil sin perder personalidad.",
      ],
      knowMore: "Saber más",
      projectsTitle: "Trabajo y testimonios:",
      contactTitle: "Construyamos juntos...",
      projects: [
        {
          title: "Viziona",
          description:
            "Una aplicación web responsive pensada para una interacción clara, diseño UI/UX y ejecución práctica del producto.",
          techStack: ["React", "TypeScript", "UI/UX"],
          site: "https://viziona.com",
          code: "https://github.com/tanie-lalwani/viziona",
        },
        {
          title: "Optimización de Checkout - FinchPay",
          description:
            "Una mejora de rendimiento frontend para flujos de pago más rápidos, estados más claros y feedback más suave.",
          techStack: ["React", "TypeScript", "Rendimiento"],
          site: "https://finchpay.app",
        },
        {
          title: "Rebuild del sitio marketing - Leafline",
          description:
            "Una reconstrucción frontend moderna con estructura de contenido más limpia, layouts responsive y una estética más calma.",
          techStack: ["React", "TypeScript", "Desarrollo web"],
          site: "https://leafline.studio",
        },
      ],
    },
    qna: {
      questions: [
        "Cuéntame sobre ti.",
        "Explícame un proyecto del que estés orgulloso.",
        "¿Cómo manejas bugs en producción?",
        "Describe una vez en la que no estuviste de acuerdo con un compañero.",
        "¿Cómo optimizas el rendimiento frontend?",
        "¿Por qué quieres este puesto?",
      ],
      homeLabel: "Inicio",
      contactLabel: "Contacto",
      videoPlaceholder: "Marcador de video",
      like: "Me gusta",
      comment: "Comentar",
      share: "Compartir",
      save: "Guardar",
      bot: "bot",
      projectsCountLabel: "proyectos",
    },
    footer: {
      role: "Desarrollador creativo",
      copyright: "© 2026 Tanie Lalwani : Hecho con React, TypeScript, Three.js y mucho café.",
    },
    contact: {
      labels: {
        name: "Nombre",
        email: "Correo",
        subject: "Asunto",
        message: "Mensaje",
      },
      placeholders: {
        name: "Tu nombre",
        email: "tu@correo.com",
        subject: "¿De qué se trata?",
        message: "Cuéntame sobre tu proyecto...",
      },
      button: "Enviar mensaje",
      sending: "Enviando...",
      success: "¡Mensaje enviado! Te responderé pronto.",
      error: "No se pudo enviar el mensaje. Intenta otra vez.",
      networkError: "Error de red. Revisa tu conexión e inténtalo de nuevo.",
      endpointError: "El endpoint del formulario no está configurado.",
    },
    projectCard: {
      view: "Ver",
      code: "Código",
      projectsCountSuffix: "proyectos",
    },
  },
  fr: {
    nav: {
      qna: "QnA",
      languages: "Langues",
      interviewPrompt: "Interviewez-moi ici",
      homeLabel: "Accueil",
      contactLabel: "Contact",
    },
    loading: {
      welcome: "Bienvenue",
    },
    home: {
      heroTitle: "Je suis Tanie !",
      heroRole: "Développeur créatif",
      heroDescription:
        "Je crée des sites interactifs, des expériences web 3D et des applications web modernes et responsives avec React, TypeScript et une ingénierie frontend soignée.",
      aboutTitle: "À propos de moi :",
      aboutParagraphs: [
        "Vous cherchez un portfolio, une expérience interactive, une intégration frontend moderne ou une landing page intentionnelle ?",
        "Je suis développeur frontend et React. Depuis deux ans, je construis, j'expérimente et j'apprends ce qui rend une interface vraiment agréable à utiliser.",
        "J'aime les workflows TypeScript clairs, les interactions soignées, les détails UI/UX et un développement web utile sans perdre de personnalité.",
      ],
      knowMore: "En savoir plus",
      projectsTitle: "Travaux et témoignages :",
      contactTitle: "Construisons ensemble...",
      projects: [
        {
          title: "Viziona",
          description:
            "Une application web responsive pensée pour une interaction claire, un design UI/UX et une exécution produit concrète.",
          techStack: ["React", "TypeScript", "UI/UX"],
          site: "https://viziona.com",
          code: "https://github.com/tanie-lalwani/viziona",
        },
        {
          title: "Optimisation Checkout - FinchPay",
          description:
            "Une optimisation des performances frontend pour des parcours de paiement plus rapides, des états plus clairs et un feedback plus fluide.",
          techStack: ["React", "TypeScript", "Performance"],
          site: "https://finchpay.app",
        },
        {
          title: "Refonte du site marketing - Leafline",
          description:
            "Une refonte frontend moderne avec une structure de contenu plus serrée, des layouts responsives et une ambiance plus calme.",
          techStack: ["React", "TypeScript", "Développement web"],
          site: "https://leafline.studio",
        },
      ],
    },
    qna: {
      questions: [
        "Parlez-moi de vous.",
        "Présentez-moi un projet dont vous êtes fier.",
        "Comment gérez-vous les bugs en production ?",
        "Décrivez une fois où vous étiez en désaccord avec un coéquipier.",
        "Comment optimisez-vous les performances frontend ?",
        "Pourquoi voulez-vous ce poste ?",
      ],
      homeLabel: "Accueil",
      contactLabel: "Contact",
      videoPlaceholder: "Espace vidéo",
      like: "Aimer",
      comment: "Commenter",
      share: "Partager",
      save: "Enregistrer",
      bot: "bot",
      projectsCountLabel: "projets",
    },
    footer: {
      role: "Développeur créatif",
      copyright: "© 2026 Tanie Lalwani : Construit avec React, TypeScript, Three.js et beaucoup de café.",
    },
    contact: {
      labels: {
        name: "Nom",
        email: "E-mail",
        subject: "Sujet",
        message: "Message",
      },
      placeholders: {
        name: "Votre nom",
        email: "votre@email.com",
        subject: "De quoi s'agit-il ?",
        message: "Parlez-moi de votre projet...",
      },
      button: "Envoyer",
      sending: "Envoi...",
      success: "Message envoyé ! Je vous répondrai bientôt.",
      error: "Impossible d'envoyer le message. Réessayez.",
      networkError: "Erreur réseau. Vérifiez votre connexion et réessayez.",
      endpointError: "Le point de terminaison du formulaire n'est pas configuré.",
    },
    projectCard: {
      view: "Voir",
      code: "Code",
      projectsCountSuffix: "projets",
    },
  },
  hi: {
    nav: {
      qna: "QnA",
      languages: "भाषाएँ",
      interviewPrompt: "यहाँ इंटरव्यू लें",
      homeLabel: "होम",
      contactLabel: "संपर्क",
    },
    loading: {
      welcome: "स्वागत है",
    },
    home: {
      heroTitle: "मैं टानी हूँ!",
      heroRole: "क्रिएटिव डेवलपर",
      heroDescription:
        "मैं React, TypeScript और thoughtful frontend engineering के साथ interactive websites, 3D web experiences, और modern responsive web applications बनाता हूँ.",
      aboutTitle: "मेरे बारे में थोड़ा:",
      aboutParagraphs: [
        "क्या आप एक portfolio website, interactive web experience, modern frontend build, या intentional landing page खोज रहे हैं?",
        "मैं एक frontend और React developer हूँ; पिछले दो वर्षों से interfaces को genuinely enjoyable बनाने के तरीके सीखते हुए build और experiment कर रहा हूँ.",
        "मुझे clean TypeScript workflows, polished interactions, UI/UX details, और personality खोए बिना useful web development पसंद है.",
      ],
      knowMore: "और जानें",
      projectsTitle: "काम और testimonials:",
      contactTitle: "चलो साथ बनाते हैं...",
      projects: [
        {
          title: "Viziona",
          description:
            "एक responsive web application, जो clear interaction, UI/UX design, और practical product execution के लिए बनाई गई है.",
          techStack: ["React", "TypeScript", "UI/UX"],
          site: "https://viziona.com",
          code: "https://github.com/tanie-lalwani/viziona",
        },
        {
          title: "Checkout Performance Overhaul - FinchPay",
          description:
            "Checkout flows को तेज़, states को स्पष्ट और feedback को smoother बनाने के लिए frontend performance optimization.",
          techStack: ["React", "TypeScript", "Performance"],
          site: "https://finchpay.app",
        },
        {
          title: "Marketing Site Rebuild - Leafline",
          description:
            "Tighter content structure, responsive layouts, और calmer visual system के साथ modern frontend rebuild.",
          techStack: ["React", "TypeScript", "Web development"],
          site: "https://leafline.studio",
        },
      ],
    },
    qna: {
      questions: [
        "अपने बारे में बताइए.",
        "किसी ऐसे प्रोजेक्ट के बारे में बताइए जिस पर आपको गर्व है.",
        "Production में bugs को कैसे handle करते हैं?",
        "कभी teammate से disagreement हुआ हो तो बताइए.",
        "Frontend performance को कैसे optimize करते हैं?",
        "आप यह role क्यों चाहते हैं?",
      ],
      homeLabel: "होम",
      contactLabel: "संपर्क",
      videoPlaceholder: "वीडियो प्लेसहोल्डर",
      like: "पसंद",
      comment: "टिप्पणी",
      share: "साझा करें",
      save: "सहेजें",
      bot: "बॉट",
      projectsCountLabel: "प्रोजेक्ट",
    },
    footer: {
      role: "क्रिएटिव डेवलपर",
      copyright: "© 2026 टानी लालवानी : React, TypeScript, Three.js और बहुत सारी कॉफी के साथ बनाया गया.",
    },
    contact: {
      labels: {
        name: "नाम",
        email: "ईमेल",
        subject: "विषय",
        message: "संदेश",
      },
      placeholders: {
        name: "आपका नाम",
        email: "aap@correo.com",
        subject: "यह किस बारे में है?",
        message: "अपने प्रोजेक्ट के बारे में बताइए...",
      },
      button: "संदेश भेजें",
      sending: "भेजा जा रहा है...",
      success: "संदेश भेज दिया गया! मैं जल्द जवाब दूँगा.",
      error: "संदेश भेजा नहीं जा सका. कृपया फिर कोशिश करें.",
      networkError: "नेटवर्क त्रुटि. कृपया अपना कनेक्शन जांचें और फिर कोशिश करें.",
      endpointError: "फॉर्म endpoint कॉन्फ़िगर नहीं है.",
    },
    projectCard: {
      view: "देखें",
      code: "कोड",
      projectsCountSuffix: "प्रोजेक्ट",
    },
  },
  ja: {
    nav: {
      qna: "QnA",
      languages: "言語",
      interviewPrompt: "ここで面接する",
      homeLabel: "ホーム",
      contactLabel: "お問い合わせ",
    },
    loading: {
      welcome: "ようこそ",
    },
    home: {
      heroTitle: "タニーです！",
      heroRole: "クリエイティブデベロッパー",
      heroDescription:
        "React、TypeScript、丁寧なフロントエンド設計で、インタラクティブなWebサイト、3D体験、モダンなレスポンシブWebアプリを作っています。",
      aboutTitle: "少し自己紹介：",
      aboutParagraphs: [
        "ポートフォリオサイト、インタラクティブなWeb体験、モダンなフロントエンド制作、意図のあるランディングページをお探しですか？",
        "私はフロントエンドとReactの開発者です。この2年間、使っていて本当に心地よいUIとは何かを学びながら、制作と実験を続けてきました。",
        "きれいなTypeScriptのワークフロー、洗練されたインタラクション、UI/UXの細部、そして個性を失わない実用的なWeb開発が好きです。",
      ],
      knowMore: "もっと見る",
      projectsTitle: "制作実績と推薦：",
      contactTitle: "一緒に作りましょう...",
      projects: [
        {
          title: "Viziona",
          description:
            "明確なインタラクション、UI/UXデザイン、実用的なプロダクト実装のために設計されたレスポンシブWebアプリです。",
          techStack: ["React", "TypeScript", "UI/UX"],
          site: "https://viziona.com",
          code: "https://github.com/tanie-lalwani/viziona",
        },
        {
          title: "FinchPay checkout performance overhaul",
          description:
            "チェックアウトをより速く、状態をより明確に、フィードバックをより滑らかにするためのフロントエンド最適化です。",
          techStack: ["React", "TypeScript", "Performance"],
          site: "https://finchpay.app",
        },
        {
          title: "Leafline marketing site rebuild",
          description:
            "より引き締まった構成、レスポンシブなレイアウト、落ち着いたビジュアルで再構築したモダンなフロントエンドです。",
          techStack: ["React", "TypeScript", "Web development"],
          site: "https://leafline.studio",
        },
      ],
    },
    qna: {
      questions: [
        "自己紹介をお願いします。",
        "誇りに思っているプロジェクトを教えてください。",
        "本番環境のバグはどう対応しますか？",
        "チームメイトと意見が合わなかった経験を教えてください。",
        "フロントエンドの性能はどう最適化しますか？",
        "なぜこの役割を希望しますか？",
      ],
      homeLabel: "ホーム",
      contactLabel: "お問い合わせ",
      videoPlaceholder: "動画プレースホルダー",
      like: "いいね",
      comment: "コメント",
      share: "共有",
      save: "保存",
      bot: "ボット",
      projectsCountLabel: "件のプロジェクト",
    },
    footer: {
      role: "クリエイティブデベロッパー",
      copyright: "© 2026 Tanie Lalwani : React、TypeScript、Three.js、そしてたくさんのコーヒーで作成。",
    },
    contact: {
      labels: {
        name: "お名前",
        email: "メール",
        subject: "件名",
        message: "メッセージ",
      },
      placeholders: {
        name: "あなたの名前",
        email: "you@example.com",
        subject: "何についてですか？",
        message: "プロジェクトについて教えてください...",
      },
      button: "送信",
      sending: "送信中...",
      success: "送信しました。後ほど返信します。",
      error: "送信できませんでした。もう一度お試しください。",
      networkError: "ネットワークエラーです。接続を確認して再度お試しください。",
      endpointError: "フォームの送信先が設定されていません。",
    },
    projectCard: {
      view: "表示",
      code: "コード",
      projectsCountSuffix: "件のプロジェクト",
    },
  },
  ur: {
    nav: {
      qna: "QnA",
      languages: "زبانیں",
      interviewPrompt: "یہاں انٹرویو لیں",
      homeLabel: "ہوم",
      contactLabel: "رابطہ",
    },
    loading: {
      welcome: "خوش آمدید",
    },
    home: {
      heroTitle: "میں ٹانی ہوں!",
      heroRole: "تخلیقی ڈویلپر",
      heroDescription:
        "میں React، TypeScript اور سوچ سمجھ کر بنائی گئی frontend engineering کے ساتھ interactive websites، 3D web experiences، اور modern responsive web applications بناتا ہوں۔",
      aboutTitle: "میرے بارے میں تھوڑا سا:",
      aboutParagraphs: [
        "کیا آپ portfolio website، interactive web experience، modern frontend build، یا intentional landing page تلاش کر رہے ہیں؟",
        "میں frontend اور React developer ہوں؛ پچھلے دو سالوں سے میں ایسے interfaces بنانا، آزمانا، اور سیکھنا جاری رکھے ہوئے ہوں جو استعمال میں واقعی خوشگوار ہوں۔",
        "مجھے صاف TypeScript workflows، polished interactions، UI/UX details، اور ایسی web development پسند ہے جو شخصیت کھوئے بغیر کارآمد ہو۔",
      ],
      knowMore: "مزید جانیں",
      projectsTitle: "کام اور تاثرات:",
      contactTitle: "آئیے ساتھ بنائیں...",
      projects: [
        {
          title: "Viziona",
          description:
            "ایک responsive web application جو صاف interaction، UI/UX design، اور practical product execution کے گرد بنائی گئی ہے۔",
          techStack: ["React", "TypeScript", "UI/UX"],
          site: "https://viziona.com",
          code: "https://github.com/tanie-lalwani/viziona",
        },
        {
          title: "Checkout Performance Overhaul - FinchPay",
          description:
            "تیز checkout flows، واضح states، اور smooth feedback کے لیے frontend performance optimization۔",
          techStack: ["React", "TypeScript", "Performance"],
          site: "https://finchpay.app",
        },
        {
          title: "Marketing Site Rebuild - Leafline",
          description:
            "زیادہ مربوط content structure، responsive layouts، اور پرسکون visual system کے ساتھ modern frontend rebuild۔",
          techStack: ["React", "TypeScript", "Web development"],
          site: "https://leafline.studio",
        },
      ],
    },
    qna: {
      questions: [
        "اپنے بارے میں بتائیں۔",
        "کوئی ایسا پروجیکٹ بتائیں جس پر آپ کو فخر ہو۔",
        "Production میں bugs کو کیسے handle کرتے ہیں؟",
        "کسی teammate سے اختلاف کی مثال دیں۔",
        "Frontend performance کو کیسے optimize کرتے ہیں؟",
        "آپ یہ role کیوں چاہتے ہیں؟",
      ],
      homeLabel: "ہوم",
      contactLabel: "رابطہ",
      videoPlaceholder: "ویڈیو پلیس ہولڈر",
      like: "پسند",
      comment: "تبصرہ",
      share: "شیئر",
      save: "محفوظ کریں",
      bot: "بوٹ",
      projectsCountLabel: "پروجیکٹس",
    },
    footer: {
      role: "تخلیقی ڈویلپر",
      copyright: "© 2026 ٹانی لالوانی : React، TypeScript، Three.js، اور کافی کے ساتھ بنایا گیا۔",
    },
    contact: {
      labels: {
        name: "نام",
        email: "ای میل",
        subject: "موضوع",
        message: "پیغام",
      },
      placeholders: {
        name: "آپ کا نام",
        email: "aap@example.com",
        subject: "یہ کس بارے میں ہے؟",
        message: "اپنے پروجیکٹ کے بارے میں بتائیں...",
      },
      button: "پیغام بھیجیں",
      sending: "بھیجا جا رہا ہے...",
      success: "پیغام بھیج دیا گیا! میں جلد جواب دوں گا۔",
      error: "پیغام نہیں بھیجا جا سکا۔ دوبارہ کوشش کریں۔",
      networkError: "نیٹ ورک خرابی۔ براہ کرم کنکشن چیک کریں اور دوبارہ کوشش کریں۔",
      endpointError: "فارم endpoint سیٹ نہیں ہے۔",
    },
    projectCard: {
      view: "دیکھیں",
      code: "کوڈ",
      projectsCountSuffix: "پروجیکٹس",
    },
  },
  zh: {
    nav: {
      qna: "QnA",
      languages: "语言",
      interviewPrompt: "在这里面试我",
      homeLabel: "首页",
      contactLabel: "联系",
    },
    loading: {
      welcome: "欢迎",
    },
    home: {
      heroTitle: "我是 Tanie！",
      heroRole: "创意开发者",
      heroDescription:
        "我使用 React、TypeScript 和细致的前端工程，打造交互式网站、3D Web 体验以及现代响应式 Web 应用。",
      aboutTitle: "关于我：",
      aboutParagraphs: [
        "你在寻找作品集网站、交互式 Web 体验、现代前端项目，还是有明确意图的落地页吗？",
        "我是一名前端和 React 开发者；过去两年里，我一直在构建、实验，并学习什么样的界面才真正让人愿意使用。",
        "我喜欢干净的 TypeScript 工作流、精致的交互、UI/UX 细节，以及既实用又不失个性的 Web 开发。",
      ],
      knowMore: "了解更多",
      projectsTitle: "作品与推荐：",
      contactTitle: "一起开始吧...",
      projects: [
        {
          title: "Viziona",
          description:
            "一个围绕清晰交互、UI/UX 设计和实用产品执行打造的响应式 Web 应用。",
          techStack: ["React", "TypeScript", "UI/UX"],
          site: "https://viziona.com",
          code: "https://github.com/tanie-lalwani/viziona",
        },
        {
          title: "Checkout Performance Overhaul - FinchPay",
          description:
            "一轮前端性能优化，让结账流程更快、状态更清晰、反馈更顺滑。",
          techStack: ["React", "TypeScript", "性能"],
          site: "https://finchpay.app",
        },
        {
          title: "Marketing Site Rebuild - Leafline",
          description:
            "一次现代化前端重建，拥有更紧凑的内容结构、响应式布局和更安静的视觉系统。",
          techStack: ["React", "TypeScript", "Web 开发"],
          site: "https://leafline.studio",
        },
      ],
    },
    qna: {
      questions: [
        "请介绍一下你自己。",
        "讲讲你最自豪的一个项目。",
        "你如何处理生产环境中的 bug？",
        "描述一次你和队友意见不一致的经历。",
        "你如何优化前端性能？",
        "你为什么想要这个职位？",
      ],
      homeLabel: "首页",
      contactLabel: "联系",
      videoPlaceholder: "视频占位",
      like: "喜欢",
      comment: "评论",
      share: "分享",
      save: "保存",
      bot: "机器人",
      projectsCountLabel: "个项目",
    },
    footer: {
      role: "创意开发者",
      copyright: "© 2026 Tanie Lalwani : 使用 React、TypeScript、Three.js 和很多咖啡构建。",
    },
    contact: {
      labels: {
        name: "姓名",
        email: "邮箱",
        subject: "主题",
        message: "消息",
      },
      placeholders: {
        name: "你的名字",
        email: "you@example.com",
        subject: "这是关于什么的？",
        message: "告诉我你的项目...",
      },
      button: "发送消息",
      sending: "发送中...",
      success: "消息已发送！我会尽快回复你。",
      error: "消息发送失败。请再试一次。",
      networkError: "网络错误。请检查连接后重试。",
      endpointError: "表单端点未配置。",
    },
    projectCard: {
      view: "查看",
      code: "代码",
      projectsCountSuffix: "个项目",
    },
  },
}

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  copy: SiteCopy
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "es" || value === "fr" || value === "hi" || value === "ja" || value === "ur" || value === "zh"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en"
    const storedLocale = window.localStorage.getItem(STORAGE_KEY)
    return isLocale(storedLocale) ? storedLocale : "en"
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    setLocale: setLocaleState,
    copy: translations[locale],
  }), [locale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }

  return context
}
