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

type FeaturedProjectCopy = {
  title: string
  description: string
  techStack: string[]
  details: string[]
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
    openToLabel: string
    openToAriaLabel: string
    services: string[]
    projects: ProjectCopy[]
    featuredProject: FeaturedProjectCopy
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
    allProjects: string
    projectDetails: string
    closeDetails: string
    open: string
    demoLabel: string
    defaultProjectDetails: string[]
  }
}

const STORAGE_KEY = "site-locale"

export const languageOptions: LanguageOption[] = [
  { locale: "en", code: "EN", label: "English" },
  { locale: "es", code: "ES", label: "Español" },
  { locale: "fr", code: "FR", label: "Français" },
  { locale: "hi", code: "HI", label: "हिन्दी" },
  { locale: "ja", code: "JP", label: "日本語" },
  { locale: "ur", code: "UR", label: "اردو" },
  { locale: "zh", code: "ZH", label: "中文" },
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
        "I create websites that move, react, and stand out.\nScroll deeper! The fun stuff’s below.",
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
        "I've made 80+ projects and spent 2+ years freelancing with founders, creators, startups, and personal brands.",
        "Hackathons, tech communities, volunteering, fast deadlines, freelancing, and learning in public shaped how I work.",
        "Outside tech, I make music, content, visuals, and experiment with products, fashion, and random hobbies.",
      ],
      knowMore: "Know more",
      projectsTitle: "Work & Testimonials:",
      contactTitle: "Let's build together...",
      openToLabel: "Open to:",
      openToAriaLabel: "Open to web development services",
      services: [
        "Portfolio Websites",
        "Landing Pages",
        "Web Apps",
        "Game Prototyping",
        "Interactive Experiences",
        "Frontend Interfaces",
        "Creative Web Projects",
      ],
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
      featuredProject: {
        title: "Innomedia",
        description:
          "A lightweight 360 degree marketing company website built with basic HTML and CSS, then elevated with motion, animated sections, and flexible layouts.",
        techStack: ["HTML", "CSS", "Flex", "Animation"],
        details: [
          "Innomedia is a generic 360 degree marketing company site shaped around simple service storytelling, clear page flow, and quick visual trust. The base was intentionally lean: HTML, CSS, flexible sections, and direct content structure.",
          "Even with a basic stack, the build adds motion through animated reveals, soft transitions, and layout rhythm so the site feels more alive than a static brochure. It is a practical example of making small frontend decisions feel polished without overengineering.",
        ],
      },
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
      allProjects: "All Projects",
      projectDetails: "Project details",
      closeDetails: "Close project details",
      open: "Open",
      demoLabel: "Demo",
      defaultProjectDetails: [
        "Viziona was built as a polished product surface with a strong focus on responsive layout, clear visual hierarchy, and smooth interaction states. The work balances brand presence with practical usability, keeping the interface easy to scan while still feeling distinctive.",
        "The project highlights frontend execution across structure, motion, spacing, and cross-device behavior. Each section is shaped to guide the user naturally from first impression to action, with careful attention to readable content, reliable components, and a modern React and TypeScript workflow.",
      ],
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
      heroTitle: "Soy Tanie!",
      heroRole: "Desarrolladora creativa",
      heroDescription:
        "Creo sitios web que se mueven, reaccionan y destacan.\nBaja un poco más; lo mejor está abajo.",
      aboutTitle: "Un poco sobre mí:",
      aboutParagraphs: [
        "Hola, soy Tanie Lalwani, desarrolladora creativa y full-stack de India. Soy graduada en ciencia de datos y empecé en tecnología a los 16 años. Con el tiempo me interesé por casi todo: datos, blockchain, ML, dev-rel y muchos temas de tecnología, pero lo que más se quedó conmigo fue el diseño web.",
        "Me gustan más los sitios cuando destacan. No solo funcionales, sino memorables. Esa curiosidad me llevó poco a poco hacia experiencias web interactivas y creativas, sitios 3D, motion y frontend que se siente más vivo.",
        "En los últimos años eso se convirtió en más de 100 proyectos: landing pages, apps web, experiencias interactivas y distintos stacks. Llevo más de 2 años trabajando freelance con founders, creadores, startups y marcas personales.",
        "Gran parte de mi crecimiento inicial vino de hackathons, comunidades tech, voluntariado, plazos rápidos, freelancing, aprender en público y, últimamente, aprender de la gente que me rodea.",
        "Fuera de la tecnología hago música, creo contenido, experimento con visuales, productos, moda y hobbies random que de alguna forma termino probando al menos una vez. De una forma u otra, probablemente nos divertiremos trabajando juntos.",
      ],
      aboutParagraphsMobile: [
        "Hola, soy Tanie Lalwani, desarrolladora creativa full-stack de India y graduada en ciencia de datos. Empecé en tecnología a los 16 años y, tras explorar datos, blockchain, ML y dev-rel, siempre volví al diseño web.",
        "Construyo sitios memorables: UI interactiva, web 3D, motion y frontend que se siente vivo.",
        "He creado más de 80 proyectos y llevo más de 2 años trabajando freelance con founders, creadores, startups y marcas personales.",
        "Hackathons, comunidades tech, voluntariado, plazos rápidos, freelancing y aprender en público moldearon mi forma de trabajar.",
        "Fuera de tech hago música, contenido, visuales y experimento con productos, moda y hobbies random.",
      ],
      knowMore: "Saber más",
      projectsTitle: "Trabajo y testimonios:",
      contactTitle: "Construyamos algo juntos...",
      openToLabel: "Abierta a:",
      openToAriaLabel: "Disponible para servicios de desarrollo web",
      services: [
        "Portafolios web",
        "Landing pages",
        "Apps web",
        "Prototipos de juegos",
        "Experiencias interactivas",
        "Interfaces frontend",
        "Proyectos web creativos",
      ],
      projects: [
        {
          title: "Viziona",
          description:
            "Una aplicación web responsive diseñada alrededor de una interacción clara, diseño UI/UX y ejecución práctica de producto.",
          techStack: ["React", "TypeScript", "UI/UX"],
          site: "https://viziona.com",
          code: "https://github.com/tanie-lalwani/viziona",
        },
        {
          title: "Mejora de rendimiento de checkout - FinchPay",
          description:
            "Una optimización de rendimiento frontend para flujos de checkout más rápidos, estados más claros y feedback más fluido.",
          techStack: ["React", "TypeScript", "Performance"],
          site: "https://finchpay.app",
        },
        {
          title: "Reconstrucción de sitio de marketing - Leafline",
          description:
            "Una reconstrucción frontend moderna con estructura de contenido más precisa, layouts responsive y un sistema visual más calmado.",
          techStack: ["React", "TypeScript", "Web development"],
          site: "https://leafline.studio",
        },
      ],
      featuredProject: {
        title: "Innomedia",
        description:
          "Un sitio web ligero para una empresa de marketing 360, construido con HTML y CSS básicos y elevado con motion, secciones animadas y layouts flexibles.",
        techStack: ["HTML", "CSS", "Flex", "Animación"],
        details: [
          "Innomedia es un sitio genérico para una empresa de marketing 360, pensado alrededor de una narrativa simple de servicios, un flujo claro de página y confianza visual rápida. La base fue intencionalmente ligera: HTML, CSS, secciones flexibles y estructura de contenido directa.",
          "Incluso con un stack básico, el desarrollo añade movimiento con reveals animados, transiciones suaves y ritmo de layout para que el sitio se sienta más vivo que un folleto estático. Es un ejemplo práctico de cómo pequeñas decisiones frontend pueden sentirse pulidas sin sobreingeniería.",
        ],
      },
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
      allProjects: "Todos los proyectos",
      projectDetails: "Detalles del proyecto",
      closeDetails: "Cerrar detalles del proyecto",
      open: "Abrir",
      demoLabel: "Demo",
      defaultProjectDetails: [
        "Viziona se construyó como una superficie de producto pulida, con un enfoque fuerte en layout responsive, jerarquía visual clara y estados de interacción fluidos. El trabajo equilibra presencia de marca con usabilidad práctica, manteniendo la interfaz fácil de escanear y distintiva.",
        "El proyecto destaca ejecución frontend en estructura, motion, espaciado y comportamiento entre dispositivos. Cada sección guía al usuario de forma natural desde la primera impresión hasta la acción, con atención a contenido legible, componentes confiables y un flujo moderno de React y TypeScript.",
      ],
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
      heroTitle: "Moi, Tanie !",
      heroRole: "Développeuse créative",
      heroDescription:
        "Je crée des sites web qui bougent, réagissent et se démarquent.\nDescendez plus bas : le plus intéressant est dessous.",
      aboutTitle: "Un peu sur moi :",
      aboutParagraphs: [
        "Bonjour, je suis Tanie Lalwani, développeuse créative et full-stack basée en Inde. Je suis diplômée en science des données et j’ai commencé la tech à 16 ans. Avec le temps, je me suis intéressée à presque tout : data, blockchain, ML, dev-rel et beaucoup de sujets tech, mais ce qui m’a le plus suivie, c’est le design web.",
        "J’aime davantage les sites quand ils se démarquent. Pas seulement fonctionnels, mais mémorables. Cette curiosité m’a peu à peu menée vers les expériences web interactives et créatives, les sites 3D, le motion et un frontend qui paraît plus vivant.",
        "Ces dernières années, cela s’est transformé en plus de 100 projets : landing pages, apps web, expériences interactives et différents stacks. Je travaille en freelance depuis plus de 2 ans avec des founders, créateurs, startups et marques personnelles.",
        "Une grande partie de ma progression initiale vient des hackathons, communautés tech, missions bénévoles, délais courts, freelancing, apprentissage public et, plus récemment, des personnes qui m’entourent.",
        "En dehors de la tech, je fais de la musique, je crée du contenu, j’expérimente avec des visuels, des produits, la mode et des hobbies aléatoires que je finis toujours par essayer au moins une fois. D’une manière ou d’une autre, on s’amusera probablement à travailler ensemble.",
      ],
      aboutParagraphsMobile: [
        "Bonjour, je suis Tanie Lalwani, développeuse créative full-stack en Inde et diplômée en science des données. J’ai commencé la tech à 16 ans et, après la data, la blockchain, le ML et le dev-rel, je reviens toujours au design web.",
        "Je construis des sites mémorables : UI interactive, web 3D, motion et frontend qui semble vivant.",
        "J’ai réalisé plus de 80 projets et je travaille depuis plus de 2 ans en freelance avec des founders, créateurs, startups et marques personnelles.",
        "Hackathons, communautés tech, bénévolat, délais courts, freelancing et apprentissage public ont façonné ma manière de travailler.",
        "En dehors de la tech, je fais de la musique, du contenu, des visuels et j’expérimente avec des produits, la mode et des hobbies aléatoires.",
      ],
      knowMore: "En savoir plus",
      projectsTitle: "Travaux et témoignages :",
      contactTitle: "Construisons ensemble...",
      openToLabel: "Disponible pour :",
      openToAriaLabel: "Disponible pour des services de développement web",
      services: [
        "Sites portfolio",
        "Landing pages",
        "Apps web",
        "Prototypes de jeux",
        "Expériences interactives",
        "Interfaces frontend",
        "Projets web créatifs",
      ],
      projects: [
        {
          title: "Viziona",
          description:
            "Une application web responsive conçue autour d’interactions claires, du design UI/UX et d’une exécution produit pratique.",
          techStack: ["React", "TypeScript", "UI/UX"],
          site: "https://viziona.com",
          code: "https://github.com/tanie-lalwani/viziona",
        },
        {
          title: "Optimisation des performances checkout - FinchPay",
          description:
            "Une optimisation frontend pour des parcours de checkout plus rapides, des états plus clairs et des retours plus fluides.",
          techStack: ["React", "TypeScript", "Performance"],
          site: "https://finchpay.app",
        },
        {
          title: "Refonte du site marketing - Leafline",
          description:
            "Une refonte frontend moderne avec une structure de contenu plus nette, des layouts responsive et un système visuel plus calme.",
          techStack: ["React", "TypeScript", "Web development"],
          site: "https://leafline.studio",
        },
      ],
      featuredProject: {
        title: "Innomedia",
        description:
          "Un site léger pour une entreprise de marketing 360, construit avec HTML et CSS simples, puis enrichi avec du motion, des sections animées et des layouts flexibles.",
        techStack: ["HTML", "CSS", "Flex", "Animation"],
        details: [
          "Innomedia est un site générique pour une entreprise de marketing 360, structuré autour d’une présentation simple des services, d’un parcours de page clair et d’une confiance visuelle rapide. La base est volontairement légère : HTML, CSS, sections flexibles et structure de contenu directe.",
          "Même avec un stack basique, le build ajoute du mouvement avec des révélations animées, des transitions douces et un rythme de layout pour que le site paraisse plus vivant qu’une brochure statique. C’est un exemple pratique de petites décisions frontend qui donnent un rendu soigné sans suringénierie.",
        ],
      },
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
      allProjects: "Tous les projets",
      projectDetails: "Détails du projet",
      closeDetails: "Fermer les détails du projet",
      open: "Ouvrir",
      demoLabel: "Démo",
      defaultProjectDetails: [
        "Viziona a été construit comme une surface produit soignée, avec un fort accent sur le layout responsive, une hiérarchie visuelle claire et des états d’interaction fluides. Le travail équilibre présence de marque et utilité pratique, pour une interface facile à scanner tout en restant distinctive.",
        "Le projet met en avant l’exécution frontend sur la structure, le motion, l’espacement et le comportement multi-appareils. Chaque section guide naturellement l’utilisateur de la première impression à l’action, avec une attention portée au contenu lisible, aux composants fiables et à un workflow React et TypeScript moderne.",
      ],
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
      heroTitle: "मैं Tanie!",
      heroRole: "क्रिएटिव डेवलपर",
      heroDescription:
        "मैं ऐसी वेबसाइट बनाती हूँ जो चलती हैं, प्रतिक्रिया देती हैं और अलग दिखती हैं.\nथोड़ा और नीचे स्क्रॉल करें; असली मज़ा नीचे है.",
      aboutTitle: "मेरे बारे में:",
      aboutParagraphs: [
        "नमस्ते, मैं Tanie Lalwani हूँ, भारत में रहने वाली क्रिएटिव और full-stack डेवलपर. मैं data science graduate हूँ और 16 साल की उम्र में टेक में आई. समय के साथ मुझे data, blockchain, ML, dev-rel और कई tech topics में रुचि हुई, लेकिन जो चीज़ सबसे ज़्यादा साथ रही, वह web design था.",
        "मुझे वे वेबसाइट्स ज़्यादा पसंद आईं जो अलग दिखती थीं. सिर्फ functional नहीं, बल्कि याद रहने वाली. उसी curiosity ने मुझे interactive और creative web experiences, 3D websites, motion और ऐसे frontend की ओर बढ़ाया जो थोड़ा ज़्यादा जीवंत लगे.",
        "पिछले कुछ सालों में यह 100+ projects में बदल गया: landing pages, web apps, interactive experiences और अलग-अलग tech stacks. मैंने founders, creators, startups और personal brands के साथ 2+ साल freelancing की है.",
        "मेरी शुरुआती growth का बड़ा हिस्सा hackathons, tech communities, volunteering, तेज़ deadlines, freelancing, public learning और हाल ही में अपने आसपास के लोगों से सीखने से आया.",
        "Tech के बाहर मैं music बनाती हूँ, content create करती हूँ, visuals, business products, fashion और random hobbies के साथ experiment करती हूँ जिन्हें मैं किसी न किसी तरह कम से कम एक बार try कर ही लेती हूँ. एक तरह से, साथ काम करना मज़ेदार होगा.",
      ],
      aboutParagraphsMobile: [
        "नमस्ते, मैं Tanie Lalwani हूँ, भारत की creative full-stack developer और data science graduate. मैंने 16 साल की उम्र में tech शुरू किया, data, blockchain, ML और dev-rel explore किया, लेकिन web design पर वापस आती रही.",
        "मैं याद रहने वाली websites बनाती हूँ: interactive UI, 3D web, motion और ऐसा frontend जो जीवंत लगे.",
        "मैंने 80+ projects बनाए हैं और founders, creators, startups और personal brands के साथ 2+ साल freelancing की है.",
        "Hackathons, tech communities, volunteering, fast deadlines, freelancing और public learning ने मेरे काम करने का तरीका बनाया.",
        "Tech के बाहर मैं music, content, visuals बनाती हूँ और products, fashion और random hobbies के साथ experiment करती हूँ.",
      ],
      knowMore: "और जानें",
      projectsTitle: "काम और testimonials:",
      contactTitle: "चलो साथ मिलकर बनाते हैं...",
      openToLabel: "इनके लिए उपलब्ध:",
      openToAriaLabel: "वेब डेवलपमेंट सेवाओं के लिए उपलब्ध",
      services: [
        "Portfolio websites",
        "Landing pages",
        "Web apps",
        "Game prototyping",
        "Interactive experiences",
        "Frontend interfaces",
        "Creative web projects",
      ],
      projects: [
        {
          title: "Viziona",
          description:
            "एक responsive web application, जिसे clear interaction, UI/UX design और practical product execution के around बनाया गया.",
          techStack: ["React", "TypeScript", "UI/UX"],
          site: "https://viziona.com",
          code: "https://github.com/tanie-lalwani/viziona",
        },
        {
          title: "Checkout performance overhaul - FinchPay",
          description:
            "तेज़ checkout flows, clear states और smoother feedback के लिए frontend performance optimization.",
          techStack: ["React", "TypeScript", "Performance"],
          site: "https://finchpay.app",
        },
        {
          title: "Marketing site rebuild - Leafline",
          description:
            "बेहतर content structure, responsive layouts और calm visual system के साथ modern frontend rebuild.",
          techStack: ["React", "TypeScript", "Web development"],
          site: "https://leafline.studio",
        },
      ],
      featuredProject: {
        title: "Innomedia",
        description:
          "एक हल्की 360 degree marketing company website, जिसे basic HTML और CSS से बनाया गया और motion, animated sections और flexible layouts से बेहतर किया गया.",
        techStack: ["HTML", "CSS", "Flex", "Animation"],
        details: [
          "Innomedia एक generic 360 degree marketing company site है, जिसे simple service storytelling, clear page flow और quick visual trust के around बनाया गया. Base intentionally lean था: HTML, CSS, flexible sections और direct content structure.",
          "Basic stack के बावजूद build में animated reveals, soft transitions और layout rhythm के ज़रिए motion जोड़ा गया, ताकि site static brochure से ज़्यादा alive लगे. यह बिना overengineering छोटे frontend decisions को polished महसूस कराने का practical example है.",
        ],
      },
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
      allProjects: "सभी प्रोजेक्ट",
      projectDetails: "प्रोजेक्ट विवरण",
      closeDetails: "प्रोजेक्ट विवरण बंद करें",
      open: "खोलें",
      demoLabel: "डेमो",
      defaultProjectDetails: [
        "Viziona को एक polished product surface की तरह बनाया गया, जिसमें responsive layout, clear visual hierarchy और smooth interaction states पर strong focus था. यह काम brand presence और practical usability को balance करता है, ताकि interface scan करने में आसान और फिर भी distinctive रहे.",
        "यह project structure, motion, spacing और cross-device behavior में frontend execution दिखाता है. हर section user को first impression से action तक naturally guide करता है, readable content, reliable components और modern React और TypeScript workflow पर ध्यान रखते हुए.",
      ],
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
      heroTitle: "Tanie です!",
      heroRole: "クリエイティブ 開発者",
      heroDescription:
        "動き、反応し、印象に残るウェブサイトを作っています。\nもう少し下へ。楽しい部分はこの先にあります。",
      aboutTitle: "私について：",
      aboutParagraphs: [
        "こんにちは、Tanie Lalwani です。インドを拠点にするクリエイティブな full-stack developer です。データサイエンスを学び、16歳でテックの世界に入りました。data、blockchain、ML、dev-rel などいろいろな分野に興味を持ってきましたが、いちばん長く残ったのは web design でした。",
        "私は、ただ機能するだけでなく、記憶に残るウェブサイトが好きです。その好奇心から、interactive な web experiences、3D websites、motion、そして少し生きているように感じる frontend に進んできました。",
        "ここ数年で、それは landing pages、web apps、interactive experiences、さまざまな tech stacks を含む 100+ projects になりました。founders、creators、startups、personal brands と 2年以上 freelancing しています。",
        "初期の成長の大きな部分は、hackathons、tech communities、volunteering、短い締め切り、freelancing、public learning、そして最近では周りの人たちから学ぶことでした。",
        "Tech 以外では、音楽を作ったり、content や visuals を作ったり、business products、fashion、そしてなぜか一度は試してしまう random hobbies を楽しんでいます。きっと一緒に楽しく仕事ができると思います。",
      ],
      aboutParagraphsMobile: [
        "こんにちは、Tanie Lalwani です。インドの creative full-stack developer で、データサイエンスを学びました。16歳で tech を始め、data、blockchain、ML、dev-rel を探りながら、いつも web design に戻ってきました。",
        "interactive UI、3D web、motion、そして生きているように感じる frontend で、記憶に残る websites を作っています。",
        "80+ projects を作り、founders、creators、startups、personal brands と 2年以上 freelancing しています。",
        "Hackathons、tech communities、volunteering、短い締め切り、freelancing、public learning が私の働き方を形づくりました。",
        "Tech 以外では、音楽、content、visuals を作り、products、fashion、random hobbies を試しています。",
      ],
      knowMore: "もっと見る",
      projectsTitle: "実績と声：",
      contactTitle: "一緒に作りましょう...",
      openToLabel: "対応できます：",
      openToAriaLabel: "Web 開発サービスに対応できます",
      services: [
        "ポートフォリオサイト",
        "ランディングページ",
        "Web アプリ",
        "ゲームプロトタイプ",
        "インタラクティブ体験",
        "フロントエンド UI",
        "クリエイティブ Web プロジェクト",
      ],
      projects: [
        {
          title: "Viziona",
          description:
            "明確な interaction、UI/UX design、実用的な product execution を軸に作られた responsive web application。",
          techStack: ["React", "TypeScript", "UI/UX"],
          site: "https://viziona.com",
          code: "https://github.com/tanie-lalwani/viziona",
        },
        {
          title: "Checkout performance overhaul - FinchPay",
          description:
            "より速い checkout flow、わかりやすい state、なめらかな feedback のための frontend performance optimization。",
          techStack: ["React", "TypeScript", "Performance"],
          site: "https://finchpay.app",
        },
        {
          title: "Marketing site rebuild - Leafline",
          description:
            "整理された content structure、responsive layout、落ち着いた visual system を備えた modern frontend rebuild。",
          techStack: ["React", "TypeScript", "Web development"],
          site: "https://leafline.studio",
        },
      ],
      featuredProject: {
        title: "Innomedia",
        description:
          "basic HTML と CSS で作り、motion、animated sections、flexible layouts で引き上げた軽量な 360 degree marketing company website。",
        techStack: ["HTML", "CSS", "Flex", "Animation"],
        details: [
          "Innomedia は generic な 360 degree marketing company site で、シンプルな service storytelling、明確な page flow、すばやい visual trust を軸に設計されています。土台は意図的に lean で、HTML、CSS、flexible sections、直接的な content structure です。",
          "basic stack でも、animated reveals、soft transitions、layout rhythm によって motion を加え、静的な brochure より生きた印象にしています。overengineering なしで小さな frontend decisions を polished に見せる practical example です。",
        ],
      },
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
      allProjects: "すべてのプロジェクト",
      projectDetails: "プロジェクト詳細",
      closeDetails: "プロジェクト詳細を閉じる",
      open: "開く",
      demoLabel: "デモ",
      defaultProjectDetails: [
        "Viziona は polished な product surface として構築され、responsive layout、明確な visual hierarchy、smooth な interaction states に強く焦点を当てています。brand presence と practical usability のバランスを取り、scan しやすく distinctive な interface にしています。",
        "この project は structure、motion、spacing、cross-device behavior における frontend execution を示しています。各 section は first impression から action まで user を自然に導き、readable content、reliable components、modern React と TypeScript workflow を大切にしています。",
      ],
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
      heroTitle: "میں Tanie!",
      heroRole: "تخلیقی ڈویلپر",
      heroDescription:
        "میں ایسی ویب سائٹس بناتی ہوں جو حرکت کرتی ہیں، ردعمل دیتی ہیں، اور الگ نظر آتی ہیں۔\nمزید نیچے اسکرول کریں؛ مزے کی چیزیں نیچے ہیں۔",
      aboutTitle: "میرے بارے میں:",
      aboutParagraphs: [
        "سلام، میں Tanie Lalwani ہوں، بھارت میں رہنے والی creative اور full-stack developer۔ میں data science graduate ہوں اور 16 سال کی عمر میں tech میں آئی۔ وقت کے ساتھ مجھے data، blockchain، ML، dev-rel اور کئی tech topics میں دلچسپی ہوئی، مگر web design سب سے زیادہ میرے ساتھ رہا۔",
        "مجھے وہ websites زیادہ پسند آتی ہیں جو الگ نظر آئیں۔ صرف functional نہیں، بلکہ memorable۔ اسی curiosity نے مجھے interactive اور creative web experiences، 3D websites، motion، اور ایسے frontend کی طرف بڑھایا جو زیادہ زندہ محسوس ہو۔",
        "پچھلے چند سالوں میں یہ 100+ projects میں بدل گیا: landing pages، web apps، interactive experiences، اور مختلف tech stacks۔ میں نے founders، creators، startups، اور personal brands کے ساتھ 2+ سال freelancing کی ہے۔",
        "میری ابتدائی growth کا بڑا حصہ hackathons، tech communities، volunteering، تیز deadlines، freelancing، public learning، اور حال ہی میں اپنے آس پاس کے لوگوں سے سیکھنے سے آیا۔",
        "Tech کے باہر میں music بناتی ہوں، content create کرتی ہوں، visuals، business products، fashion، اور random hobbies کے ساتھ experiment کرتی ہوں جنہیں میں کسی نہ کسی طرح کم از کم ایک بار try کر ہی لیتی ہوں۔ کسی نہ کسی طرح، ساتھ کام کرنا مزے کا ہوگا۔",
      ],
      aboutParagraphsMobile: [
        "سلام، میں Tanie Lalwani ہوں، بھارت کی creative full-stack developer اور data science graduate۔ میں نے 16 سال کی عمر میں tech شروع کیا، data، blockchain، ML، اور dev-rel explore کیا، مگر web design پر واپس آتی رہی۔",
        "میں memorable websites بناتی ہوں: interactive UI، 3D web، motion، اور ایسا frontend جو زندہ محسوس ہو۔",
        "میں نے 80+ projects بنائے ہیں اور founders، creators، startups، اور personal brands کے ساتھ 2+ سال freelancing کی ہے۔",
        "Hackathons، tech communities، volunteering، fast deadlines، freelancing، اور public learning نے میرے کام کا طریقہ بنایا۔",
        "Tech کے باہر میں music، content، visuals بناتی ہوں اور products، fashion، اور random hobbies کے ساتھ experiment کرتی ہوں۔",
      ],
      knowMore: "مزید جانیں",
      projectsTitle: "کام اور testimonials:",
      contactTitle: "آئیں ساتھ بناتے ہیں...",
      openToLabel: "ان کے لیے دستیاب:",
      openToAriaLabel: "ویب ڈویلپمنٹ سروسز کے لیے دستیاب",
      services: [
        "Portfolio websites",
        "Landing pages",
        "Web apps",
        "Game prototyping",
        "Interactive experiences",
        "Frontend interfaces",
        "Creative web projects",
      ],
      projects: [
        {
          title: "Viziona",
          description:
            "ایک responsive web application جو clear interaction، UI/UX design، اور practical product execution کے around بنائی گئی۔",
          techStack: ["React", "TypeScript", "UI/UX"],
          site: "https://viziona.com",
          code: "https://github.com/tanie-lalwani/viziona",
        },
        {
          title: "Checkout performance overhaul - FinchPay",
          description:
            "تیز checkout flows، clear states، اور smoother feedback کے لیے frontend performance optimization۔",
          techStack: ["React", "TypeScript", "Performance"],
          site: "https://finchpay.app",
        },
        {
          title: "Marketing site rebuild - Leafline",
          description:
            "بہتر content structure، responsive layouts، اور calm visual system کے ساتھ modern frontend rebuild۔",
          techStack: ["React", "TypeScript", "Web development"],
          site: "https://leafline.studio",
        },
      ],
      featuredProject: {
        title: "Innomedia",
        description:
          "ایک lightweight 360 degree marketing company website جو basic HTML اور CSS سے بنی، پھر motion، animated sections، اور flexible layouts سے بہتر کی گئی۔",
        techStack: ["HTML", "CSS", "Flex", "Animation"],
        details: [
          "Innomedia ایک generic 360 degree marketing company site ہے جو simple service storytelling، clear page flow، اور quick visual trust کے around بنائی گئی۔ Base intentionally lean تھا: HTML، CSS، flexible sections، اور direct content structure۔",
          "Basic stack کے باوجود build میں animated reveals، soft transitions، اور layout rhythm کے ذریعے motion شامل کیا گیا تاکہ site static brochure سے زیادہ alive محسوس ہو۔ یہ overengineering کے بغیر چھوٹے frontend decisions کو polished محسوس کرانے کی practical مثال ہے۔",
        ],
      },
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
      allProjects: "تمام پروجیکٹس",
      projectDetails: "پروجیکٹ کی تفصیل",
      closeDetails: "پروجیکٹ کی تفصیل بند کریں",
      open: "کھولیں",
      demoLabel: "ڈیمو",
      defaultProjectDetails: [
        "Viziona کو ایک polished product surface کے طور پر بنایا گیا، جس میں responsive layout، clear visual hierarchy، اور smooth interaction states پر مضبوط focus تھا۔ یہ کام brand presence اور practical usability کو balance کرتا ہے تاکہ interface scan کرنا آسان ہو اور پھر بھی distinctive لگے۔",
        "یہ project structure، motion، spacing، اور cross-device behavior میں frontend execution دکھاتا ہے۔ ہر section user کو first impression سے action تک naturally guide کرتا ہے، readable content، reliable components، اور modern React اور TypeScript workflow پر attention کے ساتھ۔",
      ],
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
      heroTitle: "我是 Tanie!",
      heroRole: "创意 开发者",
      heroDescription:
        "我制作会移动、会回应、也足够醒目的网站。\n继续往下滚动，精彩内容就在下面。",
      aboutTitle: "关于我：",
      aboutParagraphs: [
        "你好，我是 Tanie Lalwani，一名来自印度的创意 full-stack developer。我是数据科学毕业生，16 岁开始接触技术。后来我对 data、blockchain、ML、dev-rel 和许多 tech topics 都产生过兴趣，但最让我长期坚持下来的还是 web design。",
        "我更喜欢那些能脱颖而出的网站。不只是能用，而是让人记住。这样的好奇心慢慢把我带向 interactive 和 creative web experiences、3D websites、motion，以及更有生命力的 frontend。",
        "过去几年里，这变成了 100+ projects，涵盖 landing pages、web apps、interactive experiences 和不同的 tech stacks。我已经和 founders、creators、startups、personal brands 合作 freelancing 了 2+ 年。",
        "我早期成长的很大一部分来自 hackathons、tech communities、volunteering、紧迫的 deadlines、freelancing、公开学习，以及最近从身边的人身上学习。",
        "Tech 之外，我会做 music、创作 content、尝试 visuals、business products、fashion，以及各种 random hobbies，反正最后总会至少试一次。无论如何，我们一起工作大概率会很有意思。",
      ],
      aboutParagraphsMobile: [
        "你好，我是 Tanie Lalwani，来自印度的 creative full-stack developer，也是数据科学毕业生。我 16 岁开始 tech，探索过 data、blockchain、ML 和 dev-rel，但总会回到 web design。",
        "我制作让人记住的网站：interactive UI、3D web、motion，以及有生命力的 frontend。",
        "我做过 80+ projects，也和 founders、creators、startups、personal brands freelancing 了 2+ 年。",
        "Hackathons、tech communities、volunteering、fast deadlines、freelancing 和公开学习塑造了我的工作方式。",
        "Tech 之外，我做 music、content、visuals，也尝试 products、fashion 和 random hobbies。",
      ],
      knowMore: "了解更多",
      projectsTitle: "作品与评价：",
      contactTitle: "一起做点东西吧...",
      openToLabel: "可合作：",
      openToAriaLabel: "可提供网页开发服务",
      services: [
        "作品集网站",
        "落地页",
        "Web 应用",
        "游戏原型",
        "交互体验",
        "前端界面",
        "创意 Web 项目",
      ],
      projects: [
        {
          title: "Viziona",
          description:
            "一个围绕清晰交互、UI/UX design 和实际产品执行构建的 responsive web application。",
          techStack: ["React", "TypeScript", "UI/UX"],
          site: "https://viziona.com",
          code: "https://github.com/tanie-lalwani/viziona",
        },
        {
          title: "Checkout performance overhaul - FinchPay",
          description:
            "一次 frontend performance optimization，让 checkout flows 更快、状态更清晰、反馈更顺滑。",
          techStack: ["React", "TypeScript", "Performance"],
          site: "https://finchpay.app",
        },
        {
          title: "Marketing site rebuild - Leafline",
          description:
            "一次 modern frontend rebuild，带来更紧凑的内容结构、responsive layouts 和更平静的视觉系统。",
          techStack: ["React", "TypeScript", "Web development"],
          site: "https://leafline.studio",
        },
      ],
      featuredProject: {
        title: "Innomedia",
        description:
          "一个轻量的 360 degree marketing company website，使用基础 HTML 和 CSS 构建，并通过 motion、animated sections 和 flexible layouts 提升体验。",
        techStack: ["HTML", "CSS", "Flex", "Animation"],
        details: [
          "Innomedia 是一个通用的 360 degree marketing company site，围绕简单的 service storytelling、清晰的 page flow 和快速建立 visual trust 来设计。基础部分刻意保持轻量：HTML、CSS、flexible sections 和直接的 content structure。",
          "即使使用 basic stack，这个 build 也通过 animated reveals、soft transitions 和 layout rhythm 加入 motion，让网站比静态 brochure 更有生命力。这是一个 practical example，展示如何不用 overengineering 也能让小的 frontend decisions 显得 polished。",
        ],
      },
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
      allProjects: "所有项目",
      projectDetails: "项目详情",
      closeDetails: "关闭项目详情",
      open: "打开",
      demoLabel: "演示",
      defaultProjectDetails: [
        "Viziona 被打磨成一个 polished product surface，重点放在 responsive layout、清晰的 visual hierarchy 和顺滑的 interaction states 上。这个作品平衡了 brand presence 和 practical usability，让界面既容易浏览，又有辨识度。",
        "这个 project 展示了 structure、motion、spacing 和 cross-device behavior 上的 frontend execution。每个 section 都自然引导用户从第一印象走向行动，同时关注 readable content、reliable components，以及 modern React 和 TypeScript workflow。",
      ],
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
    document.documentElement.dir = locale === "ur" ? "rtl" : "ltr"
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
