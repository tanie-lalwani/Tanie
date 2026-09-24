import type { Locale } from "@/context/LanguageContext";

export type PolicyClause = {
  heading: string;
  content: string[];
};

export type PolicySectionData = {
  id: string;
  topic: string;
  topicId: "terms" | "payments" | "ip" | "refunds" | "delivery" | "privacy" | "support";
  title: string;
  badge: string;
  lastUpdated: string;
  clauses: PolicyClause[];
};

export type TermsFilter = {
  id: string;
  label: string;
};

export type TermsPageCopy = {
  badge: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  filterLabel: string;
  noResultsTitle: (query: string) => string;
  noResultsSubtitle: string;
  resetButton: string;
  showingCount: (sectionsCount: number, clausesCount: number) => string;
  sectionLinkLabel: string;
  quickLinks: {
    faq: string;
    pricing: string;
    contact: string;
    supportNote: string;
  };
  filters: TermsFilter[];
  sections: PolicySectionData[];
};

export const termsTranslations: Record<Locale, TermsPageCopy> = {
  en: {
    badge: "Legal, Compliance & Client Agreements",
    title: "Terms & Policies",
    subtitle: "Explore our unified Terms of Service, Privacy Policy, Milestone-Based Refund Rules, and Digital Service Delivery Agreement in one searchable hub.",
    searchPlaceholder: "Search topics & clauses (e.g. refunds, Razorpay, source code, warranty, delivery)...",
    filterLabel: "Filter by Topic:",
    noResultsTitle: (query) => `No clauses match your search for "${query}"`,
    noResultsSubtitle: "Try searching for broader keywords like refunds, payment, warranty, or reset your filters.",
    resetButton: "Reset Search Filters",
    showingCount: (sections, clauses) => `${sections} Sections (${clauses} Clauses)`,
    sectionLinkLabel: "Section Link",
    quickLinks: {
      faq: "View FAQ →",
      pricing: "Cost Calculator & Packages →",
      contact: "Get in Touch →",
      supportNote: "Tanie Lalwani Studio · Direct Support: wordsofvoice2210@gmail.com",
    },
    filters: [
      { id: "all", label: "All Policies" },
      { id: "terms", label: "Terms of Service" },
      { id: "privacy", label: "Privacy Policy" },
      { id: "refunds", label: "Refunds & Cancellations" },
      { id: "delivery", label: "Service Delivery" },
      { id: "payments", label: "Payment Security" },
      { id: "ip", label: "Intellectual Property" },
    ],
    sections: [
      {
        id: "terms",
        topic: "Terms of Service",
        topicId: "terms",
        title: "1. Terms of Engagement & Service Scope",
        badge: "Engagement Agreement",
        lastUpdated: "September 11, 2026",
        clauses: [
          {
            heading: "1.1 Overview & Scope of Services",
            content: [
              "These Terms and Conditions govern the provision of bespoke creative engineering, UI/UX design, 3D WebGL development, interactive web applications, and full-stack software development services provided by Tanie Lalwani (\"Developer\", \"Studio\") to clients (\"Client\").",
              "By commissioning a project, purchasing a package, or submitting a payment through our checkout systems, you acknowledge and agree to these terms in full.",
            ],
          },
          {
            heading: "1.2 Project Milestones & Client Workspace",
            content: [
              "Each engagement is structured into transparent, agreed-upon milestones (e.g. Discovery & Wireframing, 3D Interaction & UI Design, Frontend Development, Staging Review, and Final Production Launch).",
              "Project deliverables, design staging links, sprint statuses, and asset transfers are centrally tracked and recorded inside the Client Workspace.",
            ],
          },
          {
            heading: "1.3 Client Obligations & Timely Feedback",
            content: [
              "To adhere to agreed project timelines, the Client agrees to provide necessary brand assets, copywriting materials, API access credentials, and timely milestone feedback within standard review windows.",
            ],
          },
          {
            heading: "1.4 30-Day Hypercare Warranty & Post-Launch Support",
            content: [
              "All completed website builds and custom web applications include a complimentary 30-day post-launch warranty period commencing immediately upon domain cutover.",
              "This hypercare warranty covers critical bug fixes, layout stability across modern desktop/mobile browsers, and performance stabilization at no additional charge.",
            ],
          },
          {
            heading: "1.5 Limitation of Liability",
            content: [
              "To the maximum extent permitted by law, the Developer shall not be liable for incidental, indirect, or consequential damages resulting from third-party hosting outages (e.g., Vercel, AWS), external API deprecations, or domain registrar DNS delays beyond our direct control.",
            ],
          },
        ],
      },
      {
        id: "payments",
        topic: "Payment Security",
        topicId: "payments",
        title: "2. Payment Terms & Razorpay Processing",
        badge: "Billing & Security",
        lastUpdated: "September 11, 2026",
        clauses: [
          {
            heading: "2.1 Retainer Deposits & Milestone Billing",
            content: [
              "Standard custom engagements require a 50% upfront retainer deposit upon contract execution prior to sprint commencement. The remaining 50% balance is invoiced upon final staging deployment approval prior to production DNS cutover or source repository transfer.",
              "For turnkey packages purchased via our instant checkout funnel, payment is fulfilled securely upfront with instant invoice issuance and automated Client Workspace onboarding.",
            ],
          },
          {
            heading: "2.2 Razorpay Payment Gateway & Compliance",
            content: [
              "All online payments, credit card authorizations, UPI transactions, and international transfers are processed through Razorpay Payments System.",
              "We do NOT store credit card numbers, CVVs, or banking credentials on our local servers. Razorpay is fully PCI-DSS Level 1 compliant and strictly adheres to Reserve Bank of India (RBI) security mandates.",
            ],
          },
          {
            heading: "2.3 Invoicing & Currencies",
            content: [
              "Invoices and payment receipts are issued automatically via email and archived within the Client Workspace. Accepted billing currencies include INR (₹), USD ($), EUR (€), and AED (د.إ).",
            ],
          },
        ],
      },
      {
        id: "ip",
        topic: "Intellectual Property",
        topicId: "ip",
        title: "3. Intellectual Property Rights & Code Ownership",
        badge: "Asset Ownership",
        lastUpdated: "September 11, 2026",
        clauses: [
          {
            heading: "3.1 Source Code & Asset Transfer",
            content: [
              "Upon receipt of 100% full payment for all project milestones, all bespoke source code, visual components, 3D interactive scenes, and custom design tokens authored specifically for the project are permanently transferred to the Client.",
              "The Client owns full commercial usage rights and may modify, deploy, or re-license the deliverable without ongoing royalty obligations.",
            ],
          },
          {
            heading: "3.2 Third-Party & Open Source Libraries",
            content: [
              "Web projects may incorporate open-source libraries (such as React, Next.js, Three.js, Tailwind CSS) distributed under permissive licenses (MIT, Apache 2.0). Client ownership applies to bespoke code authored for the project.",
            ],
          },
          {
            heading: "3.3 Portfolio & Showcase Rights",
            content: [
              "The Developer retains the non-exclusive right to display non-confidential visual previews, design mockups, and video demonstrations of the completed work in professional design portfolios, case studies, and reels.",
            ],
          },
        ],
      },
      {
        id: "refunds",
        topic: "Refunds & Cancellations",
        topicId: "refunds",
        title: "4. Cancellation & Milestone Refund Policy",
        badge: "Refund Guidelines",
        lastUpdated: "September 11, 2026",
        clauses: [
          {
            heading: "4.1 Nature of Digital Engineering Services",
            content: [
              "Tanie Lalwani Studio delivers bespoke digital design, 3D WebGL development, and full-stack software development. Because our work involves custom engineering hours and dedicated sprint allocations, refunds are administered strictly on a milestone-based policy.",
            ],
          },
          {
            heading: "4.2 48-Hour Pre-Sprint Cancellation (Full Refund)",
            content: [
              "If the Client requests cancellation in writing within 48 hours of paying a deposit and prior to the commencement of discovery or wireframing work, a 100% full refund (minus third-party payment gateway processing fees) will be issued immediately.",
            ],
          },
          {
            heading: "4.3 Milestone-Based Refund Structure",
            content: [
              "Discovery & Wireframe Stage: If the Client is dissatisfied with initial wireframes and elects to terminate the contract before code is authored, 50% of the initial deposit is refunded.",
              "Development & Staging Phase: Once software development and 3D scenes have commenced and live staging has been deployed, the initial deposit is non-refundable. However, all subsequent milestone billing is permanently waived and the engagement is concluded.",
              "Fully Completed & Approved Projects: Fees for completed deliverables approved by the Client are strictly non-refundable.",
            ],
          },
          {
            heading: "4.4 Refund Processing Timeline",
            content: [
              "All approved refunds are remitted through Razorpay directly to the original payment method (Credit/Debit Card, NetBanking, UPI, or Bank Account) within 5 to 7 business days, subject to standard banking settlement windows.",
            ],
          },
          {
            heading: "4.5 How to Request a Cancellation or Refund",
            content: [
              "To submit a cancellation or refund inquiry, email us with your project name and Razorpay Payment ID at wordsofvoice2210@gmail.com. We review and acknowledge all requests within 24 to 48 business hours.",
            ],
          },
        ],
      },
      {
        id: "delivery",
        topic: "Service Delivery",
        topicId: "delivery",
        title: "5. Digital Service Delivery & Fulfillment Policy",
        badge: "Fulfillment Policy",
        lastUpdated: "September 11, 2026",
        clauses: [
          {
            heading: "5.1 100% Digital Delivery (No Physical Goods)",
            content: [
              "All services rendered by Tanie Lalwani (including WebGL 3D experiences, responsive websites, design prototypes, and SaaS applications) are delivered 100% digitally. No physical parcels, boxes, or tangible merchandise are shipped.",
            ],
          },
          {
            heading: "5.2 Delivery Channels & Digital Assets",
            content: [
              "Live Staging URL: Deployed preview environment hosted on Vercel or secure custom subdomain for interactive testing.",
              "Source Code Handover: Private GitHub repository ownership transfer or compressed zip archive containing production builds.",
              "Design Kits & Assets: Figma workspace collaborator access, exported 3D GLB/GLTF assets, and optimized vector graphics.",
              "Client Workspace Vault: Central repository for invoices, milestone sign-offs, and documentation.",
            ],
          },
          {
            heading: "5.3 Delivery Timelines by Service Tier",
            content: [
              "High-Converting Landing Pages: 1 to 2 weeks turnaround.",
              "3D Interactive & Brand Web Experiences: 3 to 5 weeks turnaround.",
              "Full-Stack Web Applications & MVPs: 4 to 6 weeks turnaround.",
            ],
          },
          {
            heading: "5.4 Staging Review & Final Acceptance",
            content: [
              "Upon staging deployment, clients are granted a dedicated 7-day review period to test deliverables, request revisions, and sign off prior to production DNS cutover.",
            ],
          },
        ],
      },
      {
        id: "privacy",
        topic: "Privacy Policy",
        topicId: "privacy",
        title: "6. Privacy Policy & Data Security",
        badge: "Data Protection",
        lastUpdated: "September 11, 2026",
        clauses: [
          {
            heading: "6.1 Information We Collect",
            content: [
              "We collect personal and business information provided directly by you when submitting contact forms, requesting project estimates, registering for the Client Workspace, or completing payments via Razorpay.",
              "This includes your full name, business email address, company name, telephone number, project briefs, and technical specifications.",
            ],
          },
          {
            heading: "6.2 How Your Information is Used",
            content: [
              "Your information is utilized strictly to provide digital design and development services, coordinate milestone approvals in the Client Workspace, issue invoices, and communicate project status updates.",
              "We never sell, rent, monetize, or trade your personal information to third-party advertisers or data brokers.",
            ],
          },
          {
            heading: "6.3 Third-Party Infrastructure & Subprocessors",
            content: [
              "We rely on industry-standard infrastructure providers to deliver our services securely: Supabase (encrypted database and authentication), Vercel (secure edge hosting and deployment), and Razorpay (PCI-DSS compliant payment processing).",
            ],
          },
          {
            heading: "6.4 Data Retention & Your Rights",
            content: [
              "You hold the right to review, update, or permanently delete your account data, project briefs, and stored contact details from our systems at any time upon written request.",
            ],
          },
        ],
      },
      {
        id: "support",
        topic: "Contact & Support",
        topicId: "support",
        title: "7. Official Contact & Dispute Resolution",
        badge: "Official Support",
        lastUpdated: "September 11, 2026",
        clauses: [
          {
            heading: "7.1 Contact Information",
            content: [
              "For inquiries regarding terms, privacy inquiries, milestone questions, or payment receipts, reach out directly at: wordsofvoice2210@gmail.com",
              "Website: https://tanie.me | Operating from India, serving clients worldwide.",
            ],
          },
        ],
      },
    ],
  },

  es: {
    badge: "Legal, Cumplimiento y Acuerdos de Cliente",
    title: "Términos y Políticas",
    subtitle: "Explore nuestros Términos de Servicio unificados, Política de Privacidad, Reglas de Reembolso por Hitos y Acuerdo de Entrega de Servicios Digitales en un centro de búsqueda.",
    searchPlaceholder: "Buscar temas y cláusulas (ej. reembolsos, Razorpay, código fuente, garantía, entrega)...",
    filterLabel: "Filtrar por Tema:",
    noResultsTitle: (query) => `No hay cláusulas que coincidan con "${query}"`,
    noResultsSubtitle: "Intente buscar términos más amplios como reembolsos, pagos, garantía o restablezca los filtros.",
    resetButton: "Restablecer Filtros de Búsqueda",
    showingCount: (sections, clauses) => `${sections} Secciones (${clauses} Cláusulas)`,
    sectionLinkLabel: "Enlace a la Sección",
    quickLinks: {
      faq: "Ver Preguntas Frecuentes →",
      pricing: "Calculadora de Costos y Paquetes →",
      contact: "Ponerse en Contacto →",
      supportNote: "Tanie Lalwani Studio · Soporte Directo: wordsofvoice2210@gmail.com",
    },
    filters: [
      { id: "all", label: "Todas las Políticas" },
      { id: "terms", label: "Términos de Servicio" },
      { id: "privacy", label: "Política de Privacidad" },
      { id: "refunds", label: "Reembolsos y Cancelaciones" },
      { id: "delivery", label: "Entrega de Servicios" },
      { id: "payments", label: "Seguridad de Pagos" },
      { id: "ip", label: "Propiedad Intelectual" },
    ],
    sections: [
      {
        id: "terms",
        topic: "Términos de Servicio",
        topicId: "terms",
        title: "1. Términos de Contratación y Alcance del Servicio",
        badge: "Acuerdo de Contratación",
        lastUpdated: "11 de septiembre de 2026",
        clauses: [
          {
            heading: "1.1 Descripción General y Alcance de los Servicios",
            content: [
              "Estos Términos y Condiciones rigen la prestación de servicios de ingeniería creativa a medida, diseño UI/UX, desarrollo 3D WebGL, aplicaciones web interactivas y desarrollo de software full-stack proporcionados por Tanie Lalwani (\"Desarrollador\", \"Estudio\") a los clientes (\"Cliente\").",
              "Al encargar un proyecto, adquirir un paquete o realizar un pago a través de nuestros sistemas, usted reconoce y acepta estos términos en su totalidad.",
            ],
          },
          {
            heading: "1.2 Hitos del Proyecto y Área de Clientes",
            content: [
              "Cada contratación se estructura en hitos transparentes y acordados (ej. Descubrimiento y Wireframing, Interacción 3D y Diseño UI, Desarrollo Frontend, Revisión en Staging y Lanzamiento Final en Producción).",
              "Los entregables del proyecto, enlaces de prueba de diseño, estados de sprint y transferencias de activos se registran centralizadamente dentro del Área de Clientes.",
            ],
          },
          {
            heading: "1.3 Obligaciones del Cliente y Retroalimentación Oportuna",
            content: [
              "Para cumplir con los plazos acordados del proyecto, el Cliente se compromete a proporcionar los activos de marca requeridos, materiales de redacción, credenciales de API y comentarios oportunos dentro de las ventanas de revisión estándar.",
            ],
          },
          {
            heading: "1.4 Garantía Hypercare de 30 Días y Soporte Posterior al Lanzamiento",
            content: [
              "Todos los sitios web y aplicaciones web a medida finalizados incluyen un período de garantía complementario de 30 días posteriores al lanzamiento, a partir del despliegue en el dominio de producción.",
              "Esta garantía cubre la corrección de errores críticos, la estabilidad de diseño en navegadores modernos de escritorio y móviles, y la estabilización de rendimiento sin costo adicional.",
            ],
          },
          {
            heading: "1.5 Limitación de Responsabilidad",
            content: [
              "En la medida máxima permitida por la ley, el Desarrollador no será responsable de daños indirectos, incidentales o consecuentes derivados de interrupciones en proveedores de alojamiento externos (ej. Vercel, AWS), obsolescencia de APIs externas o retrasos en DNS fuera de nuestro control directo.",
            ],
          },
        ],
      },
      {
        id: "payments",
        topic: "Seguridad de Pagos",
        topicId: "payments",
        title: "2. Condiciones de Pago y Procesamiento con Razorpay",
        badge: "Facturación y Seguridad",
        lastUpdated: "11 de septiembre de 2026",
        clauses: [
          {
            heading: "2.1 Depósitos de Reserva y Facturación por Hitos",
            content: [
              "Los proyectos personalizados estándar requieren un depósito de reserva del 50% al formalizar el contrato antes de iniciar el sprint. El 50% restante se factura tras la aprobación final en staging antes de la migración de DNS de producción o la entrega del repositorio.",
              "Para paquetes adquiridos directamente mediante nuestro checkout, el pago se procesa de forma segura por adelantado con emisión inmediata de factura e incorporación automática al Área de Clientes.",
            ],
          },
          {
            heading: "2.2 Pasarela de Pago Razorpay y Cumplimiento Normativo",
            content: [
              "Todos los pagos en línea, autorizaciones de tarjetas de crédito, transacciones UPI y transferencias internacionales se procesan a través del sistema Razorpay Payments.",
              "NO almacenamos números de tarjeta, CVVs ni credenciales bancarias en nuestros servidores locales. Razorpay cuenta con certificación PCI-DSS Nivel 1 y cumple rigurosamente con las directrices de seguridad del Banco de la Reserva de la India (RBI).",
            ],
          },
          {
            heading: "2.3 Facturación y Divisas",
            content: [
              "Las facturas y recibos de pago se generan automáticamente por correo electrónico y quedan archivados en el Área de Clientes. Las monedas de facturación aceptadas incluyen INR (₹), USD ($), EUR (€) y AED (د.إ).",
            ],
          },
        ],
      },
      {
        id: "ip",
        topic: "Propiedad Intelectual",
        topicId: "ip",
        title: "3. Derechos de Propiedad Intelectual y Titularidad del Código",
        badge: "Propiedad de Activos",
        lastUpdated: "11 de septiembre de 2026",
        clauses: [
          {
            heading: "3.1 Transferencia de Código Fuente y Activos",
            content: [
              "Una vez recibido el pago del 100% de todos los hitos del proyecto, todo el código fuente personalizado, componentes visuales, escenas interactivas en 3D y tokens de diseño creados específicamente para el proyecto se transfieren de forma permanente al Cliente.",
              "El Cliente ostenta los derechos comerciales plenos y puede modificar, desplegar o sublicenciar los entregables sin obligaciones de regalías continuas.",
            ],
          },
          {
            heading: "3.2 Librerías de Terceros y Código Abierto",
            content: [
              "Los proyectos web pueden incorporar librerías de código abierto (como React, Next.js, Three.js, Tailwind CSS) bajo licencias permisivas (MIT, Apache 2.0). La titularidad del Cliente aplica al código bespoke desarrollado expresamente para el encargo.",
            ],
          },
          {
            heading: "3.3 Derechos de Portafolio y Exhibición",
            content: [
              "El Desarrollador conserva el derecho no exclusivo de exhibir avances visuales no confidenciales, prototipos de diseño y demostraciones en video del trabajo finalizado en portafolios profesionales, estudios de caso y presentaciones.",
            ],
          },
        ],
      },
      {
        id: "refunds",
        topic: "Reembolsos y Cancelaciones",
        topicId: "refunds",
        title: "4. Política de Cancelación y Reembolso por Hitos",
        badge: "Directrices de Reembolso",
        lastUpdated: "11 de septiembre de 2026",
        clauses: [
          {
            heading: "4.1 Naturaleza de los Servicios de Ingeniería Digital",
            content: [
              "Tanie Lalwani Studio crea diseño digital a medida, desarrollo 3D WebGL y aplicaciones full-stack. Debido a que el trabajo involucra horas de ingeniería personalizadas y dedicación exclusiva de sprint, los reembolsos se administran estrictamente mediante una política basada en hitos.",
            ],
          },
          {
            heading: "4.2 Cancelación Previa al Sprint en 48 Horas (Reembolso Total)",
            content: [
              "Si el Cliente solicita la cancelación por escrito dentro de las 48 horas posteriores al pago de un depósito y antes del inicio de los trabajos de descubrimiento o wireframing, se emitirá un reembolso completo del 100% (descontando comisiones de la pasarela de pago).",
            ],
          },
          {
            heading: "4.3 Estructura de Reembolso Basada en Hitos",
            content: [
              "Etapa de Descubrimiento y Wireframing: Si el Cliente no está satisfecho con los wireframes iniciales y decide cancelar el contrato antes de escribir código, se reembolsa el 50% del depósito inicial.",
              "Fase de Desarrollo y Staging: Una vez que el desarrollo de software y escenas 3D ha comenzado y se ha desplegado el entorno de pruebas, el depósito inicial no es reembolsable. Sin embargo, se exime permanentemente todo cobro de hitos futuros y la colaboración finaliza sin cargos adicionales.",
              "Proyectos Completados y Aprobados: Los pagos por entregables completados y aprobados por el Cliente no son reembolsables bajo ninguna circunstancia.",
            ],
          },
          {
            heading: "4.4 Plazo de Procesamiento de Reembolsos",
            content: [
              "Todos los reembolsos aprobados se emiten a través de Razorpay directamente al método de pago original (Tarjeta de Crédito/Débito, NetBanking, UPI o Cuenta Bancaria) en un plazo de 5 a 7 días hábiles, sujeto a los plazos bancarios habituales.",
            ],
          },
          {
            heading: "4.5 Cómo Solicitar una Cancelación o Reembolso",
            content: [
              "Para enviar una solicitud de cancelación o reembolso, escriba un correo indicando el nombre de su proyecto y el ID de pago de Razorpay a wordsofvoice2210@gmail.com. Revisamos y respondemos a todas las solicitudes en 24 a 48 horas hábiles.",
            ],
          },
        ],
      },
      {
        id: "delivery",
        topic: "Entrega de Servicios",
        topicId: "delivery",
        title: "5. Política de Entrega y Cumplimiento Digital",
        badge: "Política de Cumplimiento",
        lastUpdated: "11 de septiembre de 2026",
        clauses: [
          {
            heading: "5.1 Entrega 100% Digital (Sin Envíos Físicos)",
            content: [
              "Todos los servicios provistos por Tanie Lalwani (incluyendo experiencias 3D WebGL, sitios web responsivos, prototipos de diseño y aplicaciones SaaS) se entregan 100% de manera digital. No se realizan envíos de paquetes ni mercancías físicas.",
            ],
          },
          {
            heading: "5.2 Canales de Entrega y Activos Digitales",
            content: [
              "URL de Staging en Vivo: Entorno de prueba interactivo desplegado en Vercel o subdominio seguro para pruebas del cliente.",
              "Traspaso de Código Fuente: Transferencia de titularidad del repositorio privado de GitHub o archivo comprimido con las compilaciones de producción.",
              "Kits y Recursos de Diseño: Acceso como colaborador en el espacio de trabajo de Figma, activos 3D GLB/GLTF exportados y gráficos vectoriales optimizados.",
              "Bóveda del Área de Clientes: Depósito central para facturas, aprobaciones de hitos y documentación técnica.",
            ],
          },
          {
            heading: "5.3 Plazos Típicos de Entrega según el Nivel",
            content: [
              "Landing Pages de Alta Conversión: 1 a 2 semanas de desarrollo.",
              "Experiencias Web Interactivas 3D: 3 a 5 semanas de desarrollo.",
              "Aplicaciones Web Full-Stack y MVPs: 4 a 6 semanas de desarrollo.",
            ],
          },
          {
            heading: "5.4 Revisión en Staging y Aceptación Final",
            content: [
              "Tras el despliegue en staging, los clientes disponen de un período dedicado de 7 días para probar los entregables, solicitar revisiones y dar su conformidad antes del lanzamiento en producción.",
            ],
          },
        ],
      },
      {
        id: "privacy",
        topic: "Política de Privacidad",
        topicId: "privacy",
        title: "6. Política de Privacidad y Seguridad de Datos",
        badge: "Protección de Datos",
        lastUpdated: "11 de septiembre de 2026",
        clauses: [
          {
            heading: "6.1 Información que Recopilamos",
            content: [
              "Recopilamos información personal y empresarial proporcionada directamente por usted al rellenar formularios de contacto, solicitar presupuestos, registrarse en el Área de Clientes o completar pagos a través de Razorpay.",
              "Esto incluye su nombre completo, correo electrónico corporativo, nombre de empresa, teléfono de contacto, requerimientos de proyecto y especificaciones técnicas.",
            ],
          },
          {
            heading: "6.2 Finalidad del Uso de la Información",
            content: [
              "Su información se utiliza estrictamente para prestar los servicios de diseño y desarrollo, coordinar aprobaciones en el Área de Clientes, emitir facturas oficiales y comunicar el progreso del proyecto.",
              "Nunca vendemos, alquilamos, monetizamos ni transferimos sus datos personales a intermediarios o anunciantes externos.",
            ],
          },
          {
            heading: "6.3 Infraestructura de Terceros y Subprocesadores",
            content: [
              "Confiamos en proveedores de infraestructura líderes en la industria para operar con máxima seguridad: Supabase (base de datos encriptada y autenticación), Vercel (alojamiento seguro de alto rendimiento) y Razorpay (procesamiento de pagos con certificación PCI-DSS).",
            ],
          },
          {
            heading: "6.4 Conservación de Datos y Derechos del Usuario",
            content: [
              "Usted conserva en todo momento el derecho de consultar, modificar o solicitar la eliminación total de sus datos de cuenta, briefs y datos de contacto de nuestros sistemas mediante solicitud por escrito.",
            ],
          },
        ],
      },
      {
        id: "support",
        topic: "Contacto y Soporte",
        topicId: "support",
        title: "7. Contacto Oficial y Resolución de Disputas",
        badge: "Soporte Oficial",
        lastUpdated: "11 de septiembre de 2026",
        clauses: [
          {
            heading: "7.1 Datos de Contacto",
            content: [
              "Para cualquier consulta sobre estos términos, dudas de privacidad, preguntas sobre hitos o comprobantes de pago, comuníquese directamente a: wordsofvoice2210@gmail.com",
              "Sitio Web: https://tanie.me | Operando desde la India, atendiendo a clientes a nivel global.",
            ],
          },
        ],
      },
    ],
  },

  fr: {
    badge: "Juridique, Conformité et Contrats Clients",
    title: "Conditions & Politiques",
    subtitle: "Consultez nos Conditions Générales de Service unifiées, notre Politique de Confidentialité, nos Règles de Remboursement par Jalon et notre Accord de Livraison Numérique dans un hub interactif.",
    searchPlaceholder: "Rechercher des sujets et clauses (ex. remboursements, Razorpay, code source, garantie, livraison)...",
    filterLabel: "Filtrer par Thème :",
    noResultsTitle: (query) => `Aucune clause ne correspond à "${query}"`,
    noResultsSubtitle: "Essayez des mots-clés plus larges comme remboursements, paiement, garantie ou réinitialisez les filtres.",
    resetButton: "Réinitialiser les Filtres",
    showingCount: (sections, clauses) => `${sections} Sections (${clauses} Clauses)`,
    sectionLinkLabel: "Lien de Section",
    quickLinks: {
      faq: "Voir la FAQ →",
      pricing: "Calculateur de Coûts & Forfaits →",
      contact: "Prendre Contact →",
      supportNote: "Studio Tanie Lalwani · Support Direct : wordsofvoice2210@gmail.com",
    },
    filters: [
      { id: "all", label: "Toutes les Politiques" },
      { id: "terms", label: "Conditions de Service" },
      { id: "privacy", label: "Confidentialité" },
      { id: "refunds", label: "Remboursements & Annulations" },
      { id: "delivery", label: "Livraison de Service" },
      { id: "payments", label: "Sécurité des Paiements" },
      { id: "ip", label: "Propriété Intellectuelle" },
    ],
    sections: [
      {
        id: "terms",
        topic: "Conditions de Service",
        topicId: "terms",
        title: "1. Modalités d'Engagement & Périmètre des Services",
        badge: "Accord d'Engagement",
        lastUpdated: "11 septembre 2026",
        clauses: [
          {
            heading: "1.1 Présentation Générale & Périmètre des Prestations",
            content: [
              "Les présentes Conditions Générales régissent la fourniture de services d'ingénierie créative sur mesure, de design UI/UX, de développement 3D WebGL, d'applications web interactives et de développement full-stack réalisés par Tanie Lalwani (\"Développeur\", \"Studio\") pour ses clients (\"Client\").",
              "En passant commande, en réservant un forfait ou en procédant à un règlement via nos passerelles, vous acceptez l'intégralité de ces conditions.",
            ],
          },
          {
            heading: "1.2 Jalons de Projet & Espace Client",
            content: [
              "Chaque projet est découpé en jalons transparents convenus ensemble (ex. Découverte & Wireframing, Interaction 3D & Design UI, Développement Frontend, Validation sur Staging et Déploiement Final en Production).",
              "Les livrables, liens de prévisualisation, statuts des sprints et transferts d'actifs sont consignés de manière centralisée au sein de l'Espace Client.",
            ],
          },
          {
            heading: "1.3 Obligations du Client & Retours en Temps Utile",
            content: [
              "Afin de garantir le respect des calendriers convenus, le Client s'engage à fournir les ressources graphiques requises, les contenus éditoriaux, les accès API nécessaires ainsi que ses retours de validation dans des délais raisonnables.",
            ],
          },
          {
            heading: "1.4 Garantie Hypercare de 30 Jours & Support Post-Lancement",
            content: [
              "Toutes les réalisations web et applications sur mesure bénéficient d'une période de garantie offerte de 30 jours dès la mise en ligne sur le domaine de production.",
              "Cette garantie hypercare couvre la correction des anomalies critiques, la stabilité de l'affichage sur navigateurs modernes (desktop et mobile) et la stabilisation des performances, sans frais supplémentaires.",
            ],
          },
          {
            heading: "1.5 Limitation de Responsabilité",
            content: [
              "Dans toute la mesure permise par la loi, le Développeur ne saurait être tenu responsable des dommages indirects ou accessoires résultant de pannes d'hébergeurs tiers (ex. Vercel, AWS), de dépréciations d'APIs externes ou de délais de propagation DNS échappant à son contrôle direct.",
            ],
          },
        ],
      },
      {
        id: "payments",
        topic: "Sécurité des Paiements",
        topicId: "payments",
        title: "2. Conditions de Paiement & Traitement via Razorpay",
        badge: "Facturation & Sécurité",
        lastUpdated: "11 septembre 2026",
        clauses: [
          {
            heading: "2.1 Acomptes de Réservation & Facturation par Jalon",
            content: [
              "Les prestations sur mesure nécessitent un acompte standard de 50 % à la signature du contrat avant le démarrage des sprints. Le solde de 50 % est facturé à l'approbation finale sur l'environnement de staging, avant la bascule DNS ou le transfert du dépôt Git.",
              "Pour les forfaits acquis via notre tunnel de commande directe, le paiement est sécurisé immédiatement avec émission instantanée de facture et ouverture automatique de l'Espace Client.",
            ],
          },
          {
            heading: "2.2 Passerelle Razorpay & Conformité Réglementaire",
            content: [
              "L'ensemble des transactions en ligne, autorisations de cartes bancaires, paiements UPI et virements internationaux est traité par la plateforme Razorpay Payments.",
              "Nous ne stockons aucun numéro de carte, code CVV ou identifiant bancaire sur nos serveurs. Razorpay est certifié PCI-DSS Niveau 1 et se conforme scrupuleusement aux normes bancaires de la Reserve Bank of India (RBI).",
            ],
          },
          {
            heading: "2.3 Facturation & Devises Acceptées",
            content: [
              "Les factures et justificatifs sont expédiés par courriel et archivés dans l'Espace Client. Les devises prises en charge comprennent l'INR (₹), l'USD ($), l'EUR (€) et l'AED (د.إ).",
            ],
          },
        ],
      },
      {
        id: "ip",
        topic: "Propriété Intellectuelle",
        topicId: "ip",
        title: "3. Droits de Propriété Intellectuelle & Cession du Code",
        badge: "Cession d'Actifs",
        lastUpdated: "11 septembre 2026",
        clauses: [
          {
            heading: "3.1 Cession du Code Source & des Éléments Créatifs",
            content: [
              "Dès encaissement intégral des montants dus pour l'ensemble des jalons, le code source sur mesure, les éléments graphiques, les scènes 3D interactives et les design tokens développés spécifiquement pour le projet sont intégralement cédés au Client.",
              "Le Client dispose des droits d'exploitation commerciale complets et peut modifier, déployer ou redistribuer le produit sans redevance ultérieure.",
            ],
          },
          {
            heading: "3.2 Bibliothèques Tierces & Open Source",
            content: [
              "Les solutions développées peuvent intégrer des dépendances open source (telles que React, Next.js, Three.js, Tailwind CSS) soumises à des licences libres (MIT, Apache 2.0). La cession de propriété s'applique au code sur mesure rédigé pour le Client.",
            ],
          },
          {
            heading: "3.3 Droits de Présentation en Portefeuille",
            content: [
              "Le Développeur conserve le droit non exclusif de présenter des aperçus visuels non confidentiels, des captures et des vidéos de démonstration du travail accompli au sein de ses portfolios professionnels et études de cas.",
            ],
          },
        ],
      },
      {
        id: "refunds",
        topic: "Remboursements & Annulations",
        topicId: "refunds",
        title: "4. Politique d'Annulation & de Remboursement par Jalon",
        badge: "Règles de Remboursement",
        lastUpdated: "11 septembre 2026",
        clauses: [
          {
            heading: "4.1 Nature des Prestations d'Ingénierie Numérique",
            content: [
              "Le Studio Tanie Lalwani réalise des prestations de design numérique sur mesure, de développement WebGL 3D et d'ingénierie logicielle. Le travail mobilisant des heures d'expertise dédiée et une allocation de sprint exclusive, les remboursements obéissent strictement à une grille basée sur l'avancement.",
            ],
          },
          {
            heading: "4.2 Annulation sous 48 Heures avant Démarrage (Remboursement Intégral)",
            content: [
              "Si le Client formule une demande d'annulation par écrit dans les 48 heures suivant le versement de l'acompte et avant tout début des travaux de wireframing, un remboursement à 100 % (déduction faite des frais bancaires de la passerelle) est opéré sans délai.",
            ],
          },
          {
            heading: "4.3 Barème de Remboursement par Jalon",
            content: [
              "Étape de Découverte & Wireframing : En cas d'insatisfaction sur les wireframes préliminaires menant à l'arrêt du projet avant codage, 50 % de l'acompte initial est remboursé.",
              "Phase de Développement & Staging : Une fois le développement logiciel et les scènes 3D entamés avec déploiement sur staging, l'acompte initial n'est plus remboursable. Toutefois, la totalité des jalons ultérieurs est annulée sans aucun frais résiduel.",
              "Projets Achevés et Approuvés : Tout livrable finalisé et validé par le Client ne donne lieu à aucun remboursement.",
            ],
          },
          {
            heading: "4.4 Délais de Traitement des Remboursements",
            content: [
              "Les remboursements accordés sont retransmis via Razorpay sur le mode de paiement d'origine (Carte bancaire, UPI, NetBanking) sous 5 à 7 jours ouvrés, selon les délais interbancaires habituels.",
            ],
          },
          {
            heading: "4.5 Modalités de Demande de Remboursement",
            content: [
              "Pour solliciter une annulation ou un remboursement, adressez un message mentionnant l'intitulé de votre projet et l'identifiant Razorpay à wordsofvoice2210@gmail.com. Nous traitons l'ensemble des demandes sous 24 à 48 heures ouvrées.",
            ],
          },
        ],
      },
      {
        id: "delivery",
        topic: "Livraison de Service",
        topicId: "delivery",
        title: "5. Modalités de Livraison & Exécution Numérique",
        badge: "Politique de Livraison",
        lastUpdated: "11 septembre 2026",
        clauses: [
          {
            heading: "5.1 Livraison 100 % Dématérialisée (Aucun Colis Physique)",
            content: [
              "L'ensemble des services conçus par Tanie Lalwani (expériences WebGL 3D, sites web réactifs, maquettes UI et applications SaaS) est fourni sous forme 100 % dématérialisée. Aucun envoi postal physique n'est effectué.",
            ],
          },
          {
            heading: "5.2 Canaux de Livraison & Actifs Transférés",
            content: [
              "Lien de Staging Actif : Environnement de démonstration interactif hébergé sur Vercel ou sous-domaine dédié pour les recettes.",
              "Transfert du Répertoire Source : Cession de propriété sur dépôt GitHub privé ou archive compressée des builds de production.",
              "Ressources Figma & 3D : Invitations d'accès collaborateur aux maquettes Figma, fichiers GLB/GLTF optimisés et graphismes vectoriels.",
              "Coffre-fort Espace Client : Espace de centralisation des factures, fiches d'approbation et documentations.",
            ],
          },
          {
            heading: "5.3 Délais Indicatifs de Réalisation",
            content: [
              "Landing Pages à Forte Conversion : 1 à 2 semaines.",
              "Expériences Web Interactives 3D : 3 à 5 semaines.",
              "Applications Web Full-Stack & MVPs : 4 à 6 semaines.",
            ],
          },
          {
            heading: "5.4 Recette & Période d'Acceptation",
            content: [
              "Dès le déploiement sur staging, le Client dispose d'une fenêtre de recette de 7 jours pour tester les fonctionnalités, soumettre ses demandes d'ajustement et acter la mise en production.",
            ],
          },
        ],
      },
      {
        id: "privacy",
        topic: "Confidentialité",
        topicId: "privacy",
        title: "6. Politique de Confidentialité & Protection des Données",
        badge: "Protection des Données",
        lastUpdated: "11 septembre 2026",
        clauses: [
          {
            heading: "6.1 Données Recueillies",
            content: [
              "Nous collectons les données professionnelles et personnelles que vous nous transmettez directement lors de prises de contact, de demandes de devis, d'inscriptions sur l'Espace Client ou de règlements via Razorpay.",
              "Celles-ci comprennent votre nom, courriel professionnel, nom de structure, coordonnées téléphoniques et cahiers des charges.",
            ],
          },
          {
            heading: "6.2 Utilisation des Données & Engagement de Non-Revente",
            content: [
              "Vos informations sont rigoureusement réservées à la réalisation de vos prestations de design et de développement, au suivi des jalons, à l'émission de la facturation et aux échanges opérationnels.",
              "Nous ne vendons, ne louons et ne cédons aucune donnée personnelle à des fins publicitaires ou à des courtiers de données.",
            ],
          },
          {
            heading: "6.3 Sous-Traitants & Infrastructures Sécurisées",
            content: [
              "Nous faisons appel à des prestataires d'infrastructure reconnus pour leur niveau élevé de sécurité : Supabase (base de données chiffrée et gestion des accès), Vercel (hébergement edge haute résilience) et Razorpay (passerelle certifiée PCI-DSS).",
            ],
          },
          {
            heading: "6.4 Conservation & Exercice de Vos Droits",
            content: [
              "Vous conservez à tout moment le droit de consulter, rectifier ou réclamer la suppression définitive de vos données personnelles et briefs archivés sur simple demande écrite.",
            ],
          },
        ],
      },
      {
        id: "support",
        topic: "Contact & Support",
        topicId: "support",
        title: "7. Contact Officiel & Résolution des Différends",
        badge: "Assistance Officielle",
        lastUpdated: "11 septembre 2026",
        clauses: [
          {
            heading: "7.1 Coordonnées de Contact",
            content: [
              "Pour toute question relative aux présentes conditions, à la confidentialité ou à vos facturations, écrivez directement à : wordsofvoice2210@gmail.com",
              "Site officiel : https://tanie.me | Basé en Inde, au service d'entreprises du monde entier.",
            ],
          },
        ],
      },
    ],
  },

  hi: {
    badge: "कानूनी, अनुपालन एवं ग्राहक अनुबंध",
    title: "नियम एवं नीतियां",
    subtitle: "हमारी एकीकृत सेवा शर्तें, गोपनीयता नीति, माइलस्टोन रिफंड नियम और डिजिटल सेवा वितरण अनुबंध को एक ही स्थान पर खोजें।",
    searchPlaceholder: "विषय और शर्तें खोजें (उदा. रिफंड, Razorpay, सोर्स कोड, वारंटी, डिलीवरी)...",
    filterLabel: "विषय अनुसार फ़िल्टर करें:",
    noResultsTitle: (query) => `"${query}" के लिए कोई शर्त नहीं मिली`,
    noResultsSubtitle: "रिफंड, भुगतान, वारंटी जैसे व्यापक कीवर्ड खोजें या फ़िल्टर रीसेट करें।",
    resetButton: "फ़िल्टर रीसेट करें",
    showingCount: (sections, clauses) => `${sections} अनुभाग (${clauses} धाराएँ)`,
    sectionLinkLabel: "अनुभाग लिंक",
    quickLinks: {
      faq: "सामान्य प्रश्न देखें →",
      pricing: "लागत कैलकुलेटर एवं पैकेज →",
      contact: "संपर्क करें →",
      supportNote: "टानी लालवानी स्टूडियो · सीधा समर्थन: wordsofvoice2210@gmail.com",
    },
    filters: [
      { id: "all", label: "सभी नीतियां" },
      { id: "terms", label: "सेवा की शर्तें" },
      { id: "privacy", label: "गोपनीयता नीति" },
      { id: "refunds", label: "रिफंड एवं रद्दीकरण" },
      { id: "delivery", label: "सेवा वितरण" },
      { id: "payments", label: "भुगतान सुरक्षा" },
      { id: "ip", label: "बौद्धिक संपदा" },
    ],
    sections: [
      {
        id: "terms",
        topic: "सेवा की शर्तें",
        topicId: "terms",
        title: "1. सेवा की शर्तें एवं कार्यक्षेत्र",
        badge: "अनुबंध समझौता",
        lastUpdated: "11 सितंबर, 2026",
        clauses: [
          {
            heading: "1.1 अवलोकन एवं सेवाओं का दायरा",
            content: [
              "ये नियम एवं शर्तें टानी लालवानी (\"डेवलपर\", \"स्टूडियो\") द्वारा ग्राहकों (\"क्लाइंट\") को प्रदान की जाने वाली कस्टम क्रिएटिव इंजीनियरिंग, UI/UX डिज़ाइन, 3D WebGL डेवलपमेंट, इंटरैक्टिव वेब ऐप्लिकेशन और फ़ुल-स्टैक सॉफ़्टवेयर सेवाओं को नियंत्रित करती हैं।",
              "किसी प्रोजेक्ट की शुरुआत करने, पैकेज खरीदने या भुगतान जमा करने पर आप इन शर्तों से पूर्णतः सहमत होते हैं।",
            ],
          },
          {
            heading: "1.2 प्रोजेक्ट माइलस्टोन एवं क्लाइंट वर्कस्पेस",
            content: [
              "प्रत्येक प्रोजेक्ट पारदर्शी और पूर्व-निर्धारित माइलस्टोन में विभाजित होता है (जैसे डिस्कवरी, 3D इंटरैक्शन और UI डिज़ाइन, फ्रंटएंड डेवलपमेंट, स्टेजिंग समीक्षा और अंतिम प्रोडक्शन लॉन्च)।",
              "सभी प्रोजेक्ट डिलिवरेबल्स, डिज़ाइन स्टेजिंग लिंक और एसेट ट्रांसफर क्लाइंट वर्कस्पेस में सुरक्षित रूप से रिकॉर्ड किए जाते हैं।",
            ],
          },
          {
            heading: "1.3 क्लाइंट के दायित्व और समय पर फीडबैक",
            content: [
              "प्रोजेक्ट की निर्धारित समयसीमा बनाए रखने के लिए, क्लाइंट आवश्यक ब्रांड एसेट्स, कंटेंट सामग्री और समय पर फीडबैक समीक्षा अवधि के भीतर प्रदान करने के लिए सहमत होता है।",
            ],
          },
          {
            heading: "1.4 30-दिवसीय हाइपरकेयर वारंटी एवं लॉन्च के बाद सहायता",
            content: [
              "सभी पूर्ण वेबसाइट और कस्टम वेब ऐप्लिकेशन में लाइव डोमेन लॉन्च के बाद 30 दिनों की निःशुल्क वारंटी अवधि शामिल होती है।",
              "यह वारंटी महत्वपूर्ण बग्स को ठीक करने, आधुनिक ब्राउज़रों पर लेआउट स्थिरता और प्रदर्शन सुधार को बिना किसी अतिरिक्त शुल्क के कवर करती है।",
            ],
          },
          {
            heading: "1.5 दायित्व की सीमा",
            content: [
              "लागू कानून के अनुसार, डेवलपर तीसरे पक्ष के होस्टिंग आउटेज (उदा. Vercel, AWS), बाहरी API बदलाव या डोमेन DNS समस्याओं से होने वाले किसी भी अप्रत्यक्ष नुकसान के लिए उत्तरदायी नहीं होगा।",
            ],
          },
        ],
      },
      {
        id: "payments",
        topic: "भुगतान सुरक्षा",
        topicId: "payments",
        title: "2. भुगतान की शर्तें एवं Razorpay प्रोसेसिंग",
        badge: "बिलिंग एवं सुरक्षा",
        lastUpdated: "11 सितंबर, 2026",
        clauses: [
          {
            heading: "2.1 रिटेनर डिपॉज़िट एवं माइलस्टोन बिलिंग",
            content: [
              "कस्टम प्रोजेक्ट्स में स्प्रिंट शुरू होने से पहले अनुबंध के समय 50% अग्रिम रिटेनर डिपॉज़िट आवश्यक होता है। शेष 50% राशि अंतिम स्टेजिंग समीक्षा की स्वीकृति पर और लाइव डोमेन लॉन्च से पहले देय होती है।",
              "सीधे खरीदे गए रेडीमेड पैकेजों के लिए तुरंत सुरक्षित भुगतान लिया जाता है और क्लाइंट वर्कस्पेस का तत्काल ऐक्सेस प्रदान किया जाता है।",
            ],
          },
          {
            heading: "2.2 Razorpay पेमेंट गेटवे एवं सुरक्षा अनुपालन",
            content: [
              "सभी ऑनलाइन भुगतान, क्रेडिट कार्ड, UPI और अंतरराष्ट्रीय ट्रांसफर Razorpay पेमेंट्स सिस्टम के ज़रिए सुरक्षित रूप से प्रोसेस किए जाते हैं।",
              "हम अपने सर्वर पर क्रेडिट कार्ड नंबर या बैंकिंग पासवर्ड कभी स्टोर नहीं करते। Razorpay पूर्णतः PCI-DSS लेवल 1 प्रमाणित है और भारतीय रिज़र्व बैंक (RBI) के सुरक्षा नियमों का पालन करता है।",
            ],
          },
          {
            heading: "2.3 इनवॉइस एवं स्वीकृत मुद्राएं",
            content: [
              "सभी इनवॉइस और रसीदें ईमेल द्वारा भेजी जाती हैं और क्लाइंट वर्कस्पेस में उपलब्ध रहती हैं। स्वीकृत मुद्राओं में INR (₹), USD ($), EUR (€) और AED (د.إ) शामिल हैं।",
            ],
          },
        ],
      },
      {
        id: "ip",
        topic: "बौद्धिक संपदा",
        topicId: "ip",
        title: "3. बौद्धिक संपदा अधिकार एवं कोड स्वामित्व",
        badge: "एसेट स्वामित्व",
        lastUpdated: "11 सितंबर, 2026",
        clauses: [
          {
            heading: "3.1 सोर्स कोड एवं एसेट ट्रांसफर",
            content: [
              "सभी प्रोजेक्ट माइलस्टोन के पूर्ण भुगतान के बाद, विशेष रूप से तैयार किया गया पूरा सोर्स कोड, 3D सीन्स और कस्टम डिज़ाइन कंपोनेंट्स स्थायी रूप से क्लाइंट को स्थानांतरित कर दिए जाते हैं।",
              "क्लाइंट के पास पूर्ण व्यावसायिक अधिकार होते हैं और वह बिना किसी रॉयल्टी के कोड को संशोधित या तैनात कर सकता है।",
            ],
          },
          {
            heading: "3.2 थर्ड-पार्टी एवं ओपन-सोर्स लाइब्रेरीज़",
            content: [
              "वेब प्रोजेक्ट्स में ओपन-सोर्स लाइब्रेरीज़ (जैसे React, Next.js, Three.js, Tailwind CSS) का उपयोग किया जा सकता है जो MIT या Apache 2.0 लाइसेंस के तहत आती हैं।",
            ],
          },
          {
            heading: "3.3 पोर्टफोलियो प्रदर्शन अधिकार",
            content: [
              "डेवलपर के पास तैयार किए गए कार्य के गैर-गोपनीय वीडियो, स्क्रीनशॉट और डिज़ाइन पूर्वावलोकन को अपने पेशेवर पोर्टफोलियो और केस स्टडी में प्रदर्शित करने का अधिकार सुरक्षित रहता है।",
            ],
          },
        ],
      },
      {
        id: "refunds",
        topic: "रिफंड एवं रद्दीकरण",
        topicId: "refunds",
        title: "4. रद्दीकरण एवं माइलस्टोन रिफंड नीति",
        badge: "रिफंड दिशानिर्देश",
        lastUpdated: "11 सितंबर, 2026",
        clauses: [
          {
            heading: "4.1 डिजिटल इंजीनियरिंग सेवाओं की प्रकृति",
            content: [
              "टानी लालवानी स्टूडियो कस्टम डिजिटल डिज़ाइन, 3D WebGL और सॉफ़्टवेयर डेवलपमेंट प्रदान करता है। चूंकि इसमें समर्पित इंजीनियरिंग समय शामिल होता है, रिफंड माइलस्टोन के आधार पर दिए जाते हैं।",
            ],
          },
          {
            heading: "4.2 स्प्रिंट शुरू होने से पहले 48 घंटे में रद्दीकरण (पूर्ण रिफंड)",
            content: [
              "यदि क्लाइंट डिपॉज़िट जमा करने के 48 घंटों के भीतर और कोई भी कार्य शुरू होने से पहले लिखित में रद्दीकरण का अनुरोध करता है, तो 100% पूरा रिफंड (पेमेंट गेटवे शुल्क घटाकर) तुरंत वापस कर दिया जाएगा।",
            ],
          },
          {
            heading: "4.3 माइलस्टोन-आधारित रिफंड नियम",
            content: [
              "डिस्कवरी एवं वायरफ़्रेम चरण: यदि क्लाइंट शुरुआती वायरफ़्रेम से संतुष्ट नहीं होता और कोडिंग से पहले प्रोजेक्ट समाप्त करना चाहता है, तो शुरुआती डिपॉज़िट का 50% वापस कर दिया जाता है।",
              "डेवलपमेंट एवं स्टेजिंग चरण: एक बार कोड लिखा जाने और स्टेजिंग पर लाइव होने के बाद, शुरुआती डिपॉज़िट गैर-वापसी योग्य होता है, लेकिन भविष्य के सभी माइलस्टोन शुल्क हमेशा के लिए रद्द कर दिए जाते हैं।",
              "स्वीकृत पूर्ण प्रोजेक्ट्स: क्लाइंट द्वारा स्वीकृत और पूर्ण किए गए प्रोजेक्ट्स की फीस किसी भी स्थिति में वापस नहीं की जा सकती।",
            ],
          },
          {
            heading: "4.4 रिफंड प्रोसेसिंग समयसीमा",
            content: [
              "सभी स्वीकृत रिफंड Razorpay के माध्यम से 5 से 7 व्यावसायिक दिनों के भीतर सीधे मूल भुगतान माध्यम में वापस कर दिए जाते हैं।",
            ],
          },
          {
            heading: "4.5 रद्दीकरण या रिफंड का अनुरोध कैसे करें",
            content: [
              "प्रोजेक्ट का नाम और Razorpay पेमेंट आईडी के साथ wordsofvoice2210@gmail.com पर ईमेल करें। हम 24 से 48 व्यावसायिक घंटों में जवाब देते हैं।",
            ],
          },
        ],
      },
      {
        id: "delivery",
        topic: "सेवा वितरण",
        topicId: "delivery",
        title: "5. डिजिटल सेवा वितरण एवं पूर्ति नीति",
        badge: "पूर्ति नीति",
        lastUpdated: "11 सितंबर, 2026",
        clauses: [
          {
            heading: "5.1 100% डिजिटल डिलीवरी (कोई भौतिक सामान नहीं)",
            content: [
              "टानी लालवानी द्वारा प्रदान की जाने वाली सभी सेवाएं (WebGL 3D वेबसाइट्स, वेब ऐप्स, डिज़ाइन फ़ाइलें) 100% डिजिटल रूप से वितरित की जाती हैं। कोई भी भौतिक कूरियर या पार्सल नहीं भेजा जाता।",
            ],
          },
          {
            heading: "5.2 डिलीवरी माध्यम एवं डिजिटल एसेट्स",
            content: [
              "लाइव स्टेजिंग लिंक: परीक्षण के लिए Vercel या सुरक्षित कस्टम सबडोमेन पर डिप्लॉय किया गया पूर्वावलोकन।",
              "सोर्स कोड हैंडओवर: निजी GitHub रिपॉजिटरी का स्वामित्व ट्रांसफर या प्रोडक्शन बिल्ड की ज़िप फ़ाइल।",
              "डिज़ाइन किट्स: Figma वर्कस्पेस ऐक्सेस, एक्सपोर्ट की गई 3D GLB फ़ाइलें और वेक्टर ग्राफ़िक्स।",
              "क्लाइंट वर्कस्पेस वॉल्ट: इनवॉइस और दस्तावेज़ों का सुरक्षित डिजिटल संग्रह।",
            ],
          },
          {
            heading: "5.3 डिलीवरी समयसीमा",
            content: [
              "उच्च-रूपांतरण लैंडिंग पेज: 1 से 2 सप्ताह।",
              "3D इंटरैक्टिव वेब अनुभव: 3 से 5 सप्ताह।",
              "फ़ुल-स्टैक वेब ऐप्लिकेशन और MVP: 4 से 6 सप्ताह।",
            ],
          },
          {
            heading: "5.4 स्टेजिंग समीक्षा एवं अंतिम स्वीकृति",
            content: [
              "स्टेजिंग पर कार्य लाइव होने के बाद क्लाइंट को 7 दिनों की समीक्षा अवधि दी जाती है ताकि वे सभी फ़ीचर्स की जांच कर सकें और अंतिम लॉन्च से पहले बदलाव मांग सकें।",
            ],
          },
        ],
      },
      {
        id: "privacy",
        topic: "गोपनीयता नीति",
        topicId: "privacy",
        title: "6. गोपनीयता नीति एवं डेटा सुरक्षा",
        badge: "डेटा सुरक्षा",
        lastUpdated: "11 सितंबर, 2026",
        clauses: [
          {
            heading: "6.1 जानकारी जो हम एकत्र करते हैं",
            content: [
              "हम केवल वही व्यक्तिगत या व्यावसायिक जानकारी एकत्र करते हैं जो आप सीधे संपर्क फ़ॉर्म, प्रोजेक्ट ब्रीफ, क्लाइंट वर्कस्पेस पंजीकरण या Razorpay भुगतान के दौरान प्रदान करते हैं।",
              "इसमें आपका नाम, ईमेल, कंपनी का नाम, फ़ोन नंबर और प्रोजेक्ट आवश्यकताएं शामिल हैं।",
            ],
          },
          {
            heading: "6.2 आपकी जानकारी का उपयोग",
            content: [
              "आपकी जानकारी का उपयोग केवल सेवाएं प्रदान करने, क्लाइंट वर्कस्पेस में प्रोजेक्ट अपडेट साझा करने और इनवॉइस जारी करने के लिए किया जाता है।",
              "हम आपकी जानकारी किसी भी तीसरे पक्ष या विज्ञापनदाता को कभी नहीं बेचते हैं।",
            ],
          },
          {
            heading: "6.3 थर्ड-पार्टी इंफ्रास्ट्रक्चर",
            content: [
              "हम उद्योग-अग्रणी सुरक्षित प्रदाताओं का उपयोग करते हैं: Supabase (एन्क्रिप्टेड डेटाबेस), Vercel (सुरक्षित एज होस्टिंग) और Razorpay (PCI-DSS प्रमाणित भुगतान)।",
            ],
          },
          {
            heading: "6.4 आपका अधिकार",
            content: [
              "आप किसी भी समय अपने व्यक्तिगत डेटा को देखने, बदलने या हमारे सिस्टम से स्थायी रूप से हटाने का अनुरोध कर सकते हैं।",
            ],
          },
        ],
      },
      {
        id: "support",
        topic: "संपर्क एवं सहायता",
        topicId: "support",
        title: "7. आधिकारिक संपर्क एवं सहायता",
        badge: "आधिकारिक सहायता",
        lastUpdated: "11 सितंबर, 2026",
        clauses: [
          {
            heading: "7.1 संपर्क जानकारी",
            content: [
              "नियमों, गोपनीयता या इनवॉइस से जुड़े प्रश्नों के लिए सीधे संपर्क करें: wordsofvoice2210@gmail.com",
              "वेबसाइट: https://tanie.me | भारत से संचालित, विश्वभर के ग्राहकों की सेवा में।",
            ],
          },
        ],
      },
    ],
  },

  ja: {
    badge: "法的規約・コンプライアンス・顧客契約",
    title: "利用規約とポリシー",
    subtitle: "利用規約、プライバシーポリシー、マイルストーン返金規定、デジタル納品契約を一元化した検索ハブでご確認いただけます。",
    searchPlaceholder: "トピックや条項を検索 (例: 返金、Razorpay、ソースコード、保証、納期)...",
    filterLabel: "トピックで絞り込む:",
    noResultsTitle: (query) => `"${query}" に一致する条項が見つかりません`,
    noResultsSubtitle: "返金、支払い、保証などのより一般的なキーワードで検索するか、フィルターをリセットしてください。",
    resetButton: "検索フィルターをリセット",
    showingCount: (sections, clauses) => `${sections} セクション (${clauses} 条項)`,
    sectionLinkLabel: "セクションリンク",
    quickLinks: {
      faq: "よくある質問を見る →",
      pricing: "料金シミュレーター・パッケージ →",
      contact: "お問い合わせ →",
      supportNote: "Tanie Lalwani Studio · お問い合わせ: wordsofvoice2210@gmail.com",
    },
    filters: [
      { id: "all", label: "すべてのポリシー" },
      { id: "terms", label: "利用規約" },
      { id: "privacy", label: "プライバシーポリシー" },
      { id: "refunds", label: "返金・キャンセル規定" },
      { id: "delivery", label: "納品ポリシー" },
      { id: "payments", label: "決済とセキュリティ" },
      { id: "ip", label: "知的財産権・著作権" },
    ],
    sections: [
      {
        id: "terms",
        topic: "利用規約",
        topicId: "terms",
        title: "1. 業務委託規約およびサービス範囲",
        badge: "契約合意書",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "1.1 概要および提供サービスの範囲",
            content: [
              "本利用規約は、Tanie Lalwani（以下「開発者」「当スタジオ」）がクライアント（以下「クライアント」）に対して提供する、オーダーメイドのクリエイティブエンジニアリング、UI/UXデザイン、3D WebGL開発、インタラクティブWebアプリ、フルスタック開発業務に適用されます。",
              "プロジェクトの依頼、パッケージの購入、または決済の完了をもって、本規約の全条項に同意したものとみなされます。",
            ],
          },
          {
            heading: "1.2 マイルストーン管理およびクライアントワークスペース",
            content: [
              "すべての案件は合意に基づく透明なマイルストーン（要件定義・ワイヤーフレーム、3D演出・UIデザイン、フロントエンド実装、ステージング検証、本番公開）に沿って進行します。",
              "成果物、検証環境リンク、進捗ステータスは専用の「クライアントワークスペース」内で一元的に記録・共有されます。",
            ],
          },
          {
            heading: "1.3 クライアントの責務および迅速なフィードバック",
            content: [
              "合意した納期を遵守するため、クライアントは必要なブランド素材、原稿、API認証情報、および各フェーズにおける確認・フィードバックを所定の期間内に提供するものとします。",
            ],
          },
          {
            heading: "1.4 30日間の無料ハイパーケア保証と保守サポート",
            content: [
              "納品されたすべてのWebサイトおよびWebアプリケーションには、本番ドメインへの公開日から30日間の無償ハイパーケア保証が付帯します。",
              "この保証には、重大な不具合の修正、最新ブラウザ（デスクトップ・モバイル）における表示安定化、パフォーマンスの調整が追加費用なしで含まれます。",
            ],
          },
          {
            heading: "1.5 責任の制限",
            content: [
              "法律上認められる最大限の範囲において、外部ホスティング事業者（Vercel、AWS等）の障害、サードパーティAPIの仕様変更、ドメインレジストラのDNS遅延など、当方の直接の管理が及ばない事象に起因する損害について、開発者は責任を負いません。",
            ],
          },
        ],
      },
      {
        id: "payments",
        topic: "決済とセキュリティ",
        topicId: "payments",
        title: "2. お支払い条件およびRazorpay決済処理",
        badge: "請求とお支払い",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "2.1 着手金デポジットおよび分割請求",
            content: [
              "オーダーメイド案件では、開発スプリント着手時に契約金額の50%を着手金としてお支払いいただきます。残金50%はステージング環境での最終検収後、本番ドメイン反映またはリポジトリ移管前にお支払いいただきます。",
              "オンライン即時購入パッケージの場合は、事前決済完了後に正式な領収書が即時発行され、ワークスペースへの案内が自動で行われます。",
            ],
          },
          {
            heading: "2.2 Razorpay決済ゲートウェイとセキュリティ基準",
            content: [
              "オンライン決済、各種クレジットカード、UPI、海外送金はすべてRazorpay Paymentsを通じて安全に処理されます。",
              "当スタジオのサーバー上にカード番号やセキュリティコード（CVV）が保存されることは一切ありません。Razorpayは国際基準であるPCI-DSS Level 1に準拠し、厳格な金融セキュリティ規格を満たしています。",
            ],
          },
          {
            heading: "2.3 請求書と対応通貨",
            content: [
              "請求書および決済領収書はメールで送付され、ワークスペース内でも随時ダウンロード可能です。対応通貨はINR (₹)、USD ($)、EUR (€)、AED (د.إ) となります。",
            ],
          },
        ],
      },
      {
        id: "ip",
        topic: "知的財産権・著作権",
        topicId: "ip",
        title: "3. 知的財産権およびソースコードの権利移転",
        badge: "権利と著作権",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "3.1 ソースコードおよびアセットの完全譲渡",
            content: [
              "すべてのマイルストーンに対するお支払いが100%完了した時点で、本案件のために独自制作されたソースコード、デザインコンポーネント、3Dシーン、デザイントークンの全権利がクライアントに恒久的に移転されます。",
              "クライアントは成果物を商業目的で自由に変更、展開、運用する権利を有し、追加のロイヤリティ義務は発生しません。",
            ],
          },
          {
            heading: "3.2 オープンソースライブラリの利用",
            content: [
              "制作物には寛容なライセンス（MIT、Apache 2.0等）に基づくオープンソース技術（React、Next.js、Three.js、Tailwind CSS等）が含まれる場合があります。権利譲渡は当案件のために書き下ろされた独自コードに適用されます。",
            ],
          },
          {
            heading: "3.3 実績掲載・プロモーション権",
            content: [
              "開発者は、制作したWebサイトの非機密情報（スクリーンショット、動画デモ等）を自身の制作実績、ケーススタディ、ポートフォリオとして掲載する非独占的権利を保持します。",
            ],
          },
        ],
      },
      {
        id: "refunds",
        topic: "返金・キャンセル規定",
        topicId: "refunds",
        title: "4. キャンセルおよびマイルストーン別返金規定",
        badge: "返金ポリシー",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "4.1 デジタル制作・開発業務の性質",
            content: [
              "当スタジオの業務はオーダーメイドの設計、3D演出、独自プログラミングを伴います。エンジニアリング工数とスケジュールを専任で確保するため、返金はマイルストーンの進捗状況に応じて厳格に処理されます。",
            ],
          },
          {
            heading: "4.2 スプリント開始前・48時間以内のキャンセル（全額返金）",
            content: [
              "着手金のお支払いから48時間以内で、かつ要件定義やワイヤーフレーム作業が開始されていない段階でキャンセル申請があった場合、決済手数料を差し引いた100%全額を速やかに返金いたします。",
            ],
          },
          {
            heading: "4.3 進捗段階に応じた返金基準",
            content: [
              "要件定義・ワイヤーフレーム段階：初期ワイヤーフレーム提示時点で意図と合致せず、コード実装前に契約終了を希望される場合、着手金の50%を返金いたします。",
              "実装・ステージング段階：プログラミングおよび3D開発が着手され、検証環境が提供された後の着手金は返金不可となります。ただし、以降のマイルストーン残金の請求はすべて免除され契約終了となります。",
              "納品完了・検収後：クライアントの検収を経て正式に納品された案件の料金は、理由の如何を問わず一切返金できません。",
            ],
          },
          {
            heading: "4.4 返金の処理期間",
            content: [
              "承認された返金は、Razorpayを通じて5〜7営業日以内にご利用のお支払い元（クレジットカード、銀行口座等）へ返金処理されます。",
            ],
          },
          {
            heading: "4.5 キャンセル・返金のお手続き方法",
            content: [
              "案件名とお支払い時のRazorpay決済IDを明記の上、wordsofvoice2210@gmail.com までメールにてご連絡ください。24〜48営業時間以内に対応いたします。",
            ],
          },
        ],
      },
      {
        id: "delivery",
        topic: "納品ポリシー",
        topicId: "delivery",
        title: "5. デジタルサービスの納品・履行ポリシー",
        badge: "納品ポリシー",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "5.1 100%デジタル納品（物理的な配送なし）",
            content: [
              "当スタジオが提供するすべての制作物（3D WebGLサイト、レスポンシブWeb、SaaSアプリ等）は、すべて電磁的記録（デジタルデータ）として提供されます。物理的な郵便物等の発送はございません。",
            ],
          },
          {
            heading: "5.2 納品方法と提供データ形式",
            content: [
              "ステージング検証環境：Vercelまたは安全なサブドメイン上に構築されたプレビューリンクでの動作検証。",
              "ソースコード移管：非公開GitHubリポジトリのオーナー権限譲渡、または本番ビルドのZIPアーカイブ提供。",
              "デザイン・3Dデータ：Figma編集権限、最適化済み3Dデータ（GLB/GLTF）、高解像度ベクター素材。",
              "クライアントワークスペース：請求書、合意記録、ドキュメントのデジタル保管庫。",
            ],
          },
          {
            heading: "5.3 プラン別納期の目安",
            content: [
              "ハイクオリティLP（ランディングページ）：約1〜2週間。",
              "3DインタラクティブWebサイト：約3〜5週間。",
              "フルスタックWebアプリ・MVP：約4〜6週間。",
            ],
          },
          {
            heading: "5.4 検収期間と最終承認",
            content: [
              "ステージング公開後、クライアントには7日間の検収期間が付与されます。この期間中に機能や表示の確認、修正要望を提出いただき、承認後に本番ドメインへの切り替えを実施します。",
            ],
          },
        ],
      },
      {
        id: "privacy",
        topic: "プライバシーポリシー",
        topicId: "privacy",
        title: "6. プライバシーポリシーおよびデータセキュリティ",
        badge: "個人情報保護",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "6.1 取得する個人情報",
            content: [
              "お問い合わせ、お見積もり依頼、ワークスペース登録、決済時に直接ご提供いただくお客様のお名前、メールアドレス、会社名、電話番号、プロジェクト要件等を収集します。",
            ],
          },
          {
            heading: "6.2 情報の利用目的および第三者非提供",
            content: [
              "収集した情報は、受託業務の履行、成果物の納品、進捗のご連絡、請求書発行のためにのみ使用されます。",
              "お客様の個人情報を広告事業者や第三者に販売、貸与、譲渡することは一切ございません。",
            ],
          },
          {
            heading: "6.3 採用している安全なインフラ基盤",
            content: [
              "高水準のセキュリティ基準を満たす信頼性の高い事業者を採用しています：Supabase（暗号化データベースと認証機能）、Vercel（安全なエッジホスティング環境）、Razorpay（PCI-DSS準拠決済）。",
            ],
          },
          {
            heading: "6.4 開示・訂正・削除のご請求",
            content: [
              "お客様は、ご自身の登録情報について、いつでも開示、更新、または当スタジオのシステムからの完全な削除を書面により求めることができます。",
            ],
          },
        ],
      },
      {
        id: "support",
        topic: "お問い合わせ・サポート",
        topicId: "support",
        title: "7. 公式窓口および紛争解決",
        badge: "公式サポート",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "7.1 お問い合わせ先",
            content: [
              "規約、プライバシー、お支払いに関するお問い合わせは、担当窓口まで直接ご連絡ください: wordsofvoice2210@gmail.com",
              "公式Webサイト: https://tanie.me | インド拠点の開発スタジオとして世界中のお客様に対応しています。",
            ],
          },
        ],
      },
    ],
  },

  ur: {
    badge: "قانونی شرائط، ضوابط اور کلائنٹ معاہدے",
    title: "شرائط و پالیسیاں",
    subtitle: "ہماری سروس کی متفقہ شرائط، رازداری کی پالیسی، مائل اسٹون ریفنڈ کے اصول، اور ڈیجیٹل سروس ڈیلیوری کا معاہدہ ایک ہی سرچ ایبل پلیٹ فارم پر دیکھیں۔",
    searchPlaceholder: "موضوعات یا شقیں تلاش کریں (مثلاً: ریفنڈ، ریزرپے، سورس کوڈ، وارنٹی، ڈیلیوری)...",
    filterLabel: "موضوع کے لحاظ سے فلٹر کریں:",
    noResultsTitle: (query) => `"${query}" کے لیے کوئی شق نہیں ملی`,
    noResultsSubtitle: "ریفنڈ، ادائیگی، وارنٹی جیسے عام الفاظ تلاش کریں یا فلٹر دوبارہ ترتیب دیں۔",
    resetButton: "فلٹرز ری سیٹ کریں",
    showingCount: (sections, clauses) => `${sections} سیکشنز (${clauses} شقیں)`,
    sectionLinkLabel: "سیکشن لنک",
    quickLinks: {
      faq: "عمومی سوالات دیکھیں →",
      pricing: "لاگت کیلکولیٹر اور پیکیجز →",
      contact: "رابطہ کریں →",
      supportNote: "ٹانی لالوانی اسٹوڈیو · براہ راست سپورٹ: wordsofvoice2210@gmail.com",
    },
    filters: [
      { id: "all", label: "تمام پالیسیاں" },
      { id: "terms", label: "سروس کی شرائط" },
      { id: "privacy", label: "رازداری کی پالیسی" },
      { id: "refunds", label: "ریفنڈ اور منسوخی" },
      { id: "delivery", label: "ڈیلیوری پالیسی" },
      { id: "payments", label: "ادائیگی اور سیکیورٹی" },
      { id: "ip", label: "ملکیتی حقوق" },
    ],
    sections: [
      {
        id: "terms",
        topic: "سروس کی شرائط",
        topicId: "terms",
        title: "1. کام کے قواعد اور سروس کا دائرہ کار",
        badge: "معاہدہ برائے سروس",
        lastUpdated: "11 ستمبر 2026",
        clauses: [
          {
            heading: "1.1 جائزہ اور خدمات کا دائرہ",
            content: [
              "یہ شرائط و ضوابط ٹانی لالوانی (\"ڈویلپر\"، \"اسٹوڈیو\") کی جانب سے کلائنٹس کو فراہم کی جانے والی کسٹم کریئیٹو انجینئرنگ، UI/UX ڈیزائن، تھری ڈی WebGL ڈیولپمنٹ، انٹرایکٹو ویب ایپس اور فل اسٹیک سافٹ ویئر ڈیولپمنٹ خدمات پر لاگو ہوتے ہیں۔",
              "کسی بھی پروجیکٹ کا آرڈر دے کر، پیکیج خرید کر، یا ادائیگی جمع کروا کر آپ ان تمام شرائط سے مکمل طور پر اتفاق کرتے ہیں۔",
            ],
          },
          {
            heading: "1.2 پروجیکٹ مائل اسٹونز اور کلائنٹ ورک اسپیس",
            content: [
              "ہر پروجیکٹ واضح اور پہلے سے طے شدہ مراحل (جیسے ڈسکوری و وائر فریم، 3D انٹرایکشن اور UI ڈیزائن، فرنٹ اینڈ کوڈنگ، اسٹیجنگ ریویو، اور فائنل پروڈکشن لانچ) میں تقسیم ہوتا ہے۔",
              "پروجیکٹ کے ڈیلیوریبلز، لائیو اسٹیجنگ لنکس، اسپرنٹ کے مراحل اور اثاثہ جات کی منتقلی کلائنٹ ورک اسپیس کے اندر باضابطہ طور پر محفوظ کی جاتی ہے۔",
            ],
          },
          {
            heading: "1.3 کلائنٹ کی ذمہ داریاں اور بروقت فیڈ بیک",
            content: [
              "پروجیکٹ کو وقت پر مکمل کرنے کے لیے کلائنٹ برانڈ کے مطلوبہ اثاثے، کاپی رائٹنگ مواد، ضروری API کریڈینشلز اور باقاعدہ فیڈ بیک مقررہ وقت کے اندر فراہم کرنے کا پابند ہوگا۔",
            ],
          },
          {
            heading: "1.4 تیس دن کی مفت ہائپر کیئر وارنٹی اور سپورٹ",
            content: [
              "ہماری تیار کردہ ہر ویب سائٹ اور کسٹم ویب ایپلی کیشن کے لائیو ہونے کے بعد 30 دن کی اعزازی وارنٹی دی جاتی ہے۔",
              "اس وارنٹی کے تحت کسی بھی غیر متوقع بگ کو فکس کرنا، مختلف موبائل و ڈیسک ٹاپ براؤزرز پر لے آؤٹ کی درستگی اور کارکردگی کی بہتری بغیر کسی اضافی فیس کے شامل ہے۔",
            ],
          },
          {
            heading: "1.5 ذمہ داری کی حدود",
            content: [
              "قانون کے دائرے میں رہتے ہوئے، ڈویلپر تھرڈ پارٹی ہوسٹنگ سروسز (جیسے Vercel، AWS)، بیرونی APIs میں تبدیلیوں یا ڈومین سرور میں تاخیر کے باعث پیدا ہونے والے نقصانات کا ذمہ دار نہیں ہوگا۔",
            ],
          },
        ],
      },
      {
        id: "payments",
        topic: "ادائیگی اور سیکیورٹی",
        topicId: "payments",
        title: "2. ادائیگی کی شرائط اور Razorpay سیکیورٹی",
        badge: "بلنگ اور تحفظ",
        lastUpdated: "11 ستمبر 2026",
        clauses: [
          {
            heading: "2.1 ڈپازٹ ریٹینر اور مائل اسٹون بلنگ",
            content: [
              "کسٹم پروجیکٹس کے لیے کام شروع کرنے سے قبل 50% ایڈوانس ریٹینر ڈپازٹ ادا کرنا لازمی ہوتا ہے۔ باقی 50% رقم اسٹیجنگ پر مکمل کام کے جائزے کے بعد اور ڈومین لائیو کرنے یا سورس کوڈ دینے سے پہلے وصول کی جاتی ہے۔",
              "آن لائن فوری خریدے گئے پیکیجز کی رقم پیشگی مکمل وصول کی جاتی ہے جس کی فوری خودکار رسید اور کلائنٹ ورک اسپیس لاگ ان فراہم کر دیا جاتا ہے۔",
            ],
          },
          {
            heading: "2.2 ریزرپے (Razorpay) پیمنٹ گیٹ وے اور معیار",
            content: [
              "تمام آن لائن ٹرانزیکشنز، کریڈٹ کارڈز، UPI اور بین الاقوامی ادائیگیاں Razorpay کے ذریعے محفوظ طریقے سے پروسیس ہوتی ہیں۔",
              "ہم اپنے سرور پر کریڈٹ کارڈ کے نمبرز، CVV یا بینک پاس ورڈز بالکل محفوظ نہیں کرتے۔ Razorpay بین الاقوامی PCI-DSS لیول 1 سرٹیفائیڈ ہے اور ریزرو بینک آف انڈیا کے سخت قوانین کا پابند ہے۔",
            ],
          },
          {
            heading: "2.3 انوائس اور کرنسی کی سہولت",
            content: [
              "رسیدیں اور انوائس خودکار طور پر ای میل اور کلائنٹ ورک اسپیس میں محفوظ ہو جاتی ہیں۔ ہم INR (₹)، USD ($)، EUR (€)، اور AED (د.إ) میں ادائیگیاں قبول کرتے ہیں۔",
            ],
          },
        ],
      },
      {
        id: "ip",
        topic: "ملکیتی حقوق",
        topicId: "ip",
        title: "3. دانشورانہ ملکیت اور سورس کوڈ کے حقوق",
        badge: "اثاثوں کی ملکیت",
        lastUpdated: "11 ستمبر 2026",
        clauses: [
          {
            heading: "3.1 سورس کوڈ اور ڈیزائن کی مکمل منتقلی",
            content: [
              "تمام مراحل کی 100% ادائیگی موصول ہونے کے بعد، پروجیکٹ کے لیے لکھا گیا تمام کسٹم سورس کوڈ، ویژول اجزاء، تھری ڈی سینز اور ڈیزائن ٹوکنز ہمیشہ کے لیے کلائنٹ کی ملکیت بن جاتے ہیں۔",
              "کلائنٹ کو اسے کمرشل طور پر استعمال کرنے، تبدیل کرنے یا تقسیم کرنے کا مکمل حق حاصل ہوتا ہے اور اس پر کوئی اضافی رائلٹی نہیں ہوتی۔",
            ],
          },
          {
            heading: "3.2 اوپن سورس لائبریریوں کا استعمال",
            content: [
              "پروجیکٹس میں معروف اوپن سورس لائبریریاں (جیسے React، Next.js، Three.js، Tailwind CSS) استعمال ہو سکتی ہیں جن کے حقوق ان کے آزاد لائسنس (MIT، Apache) کے تحت ہوتے ہیں۔",
            ],
          },
          {
            heading: "3.3 پورٹ فولیو میں نمائش کا حق",
            content: [
              "ڈویلپر کے پاس تیار کردہ کام کی غیر خفیہ جھلکیاں، ویڈیوز اور ڈیزائن اسکرین شاٹس اپنے پورٹ فولیو اور کیس اسٹڈیز میں دکھانے کا حق محفوظ رہتا ہے۔",
            ],
          },
        ],
      },
      {
        id: "refunds",
        topic: "ریفنڈ اور منسوخی",
        topicId: "refunds",
        title: "4. پروجیکٹ کی منسوخی اور مائل اسٹون ریفنڈ پالیسی",
        badge: "ریفنڈ کے قواعد",
        lastUpdated: "11 ستمبر 2026",
        clauses: [
          {
            heading: "4.1 ڈیجیٹل سروسز کی حساس نوعیت",
            content: [
              "ٹانی لالوانی اسٹوڈیو کسٹم ڈیجیٹل حل تیار کرتا ہے جس میں محنت اور انجینئرنگ کے گھنٹے وقف ہوتے ہیں، اس لیے ریفنڈ کا عمل مراحل کی بنیاد پر طے کیا گیا ہے۔",
            ],
          },
          {
            heading: "4.2 کام شروع ہونے سے قبل 48 گھنٹوں میں 100% فل ریفنڈ",
            content: [
              "اگر کلائنٹ ایڈوانس ڈپازٹ کے 48 گھنٹوں کے اندر اور وائر فریم یا کوڈنگ شروع ہونے سے پہلے تحریری طور پر منسوخی کی درخواست کرے تو پوری رقم (سوائے گیٹ وے فیس کے) فوری واپس کر دی جائے گی۔",
            ],
          },
          {
            heading: "4.3 مرحلہ وار ریفنڈ کا فارمولا",
            content: [
              "وائر فریم مرحلہ: اگر کلائنٹ ابتدائی خاکوں سے مطمئن نہ ہو اور کوڈنگ سے پہلے معاہدہ ختم کرنا چاہے تو 50% ایڈوانس ڈپازٹ واپس کر دیا جائے گا۔",
              "ڈیولپمنٹ و اسٹیجنگ مرحلہ: ایک بار کوڈنگ شروع ہونے اور اسٹیجنگ پر کام دکھائی دینے کے بعد ابتدائی ڈپازٹ ناقابل واپسی ہوتا ہے، تاہم آئندہ کی تمام ادائیگیاں منسوخ کر کے پروجیکٹ ختم کر دیا جائے گا۔",
              "مکمل منظور شدہ پروجیکٹس: کلائنٹ کی طرف سے منظور اور مکمل کر دیے گئے کام کی فیس کسی صورت واپس نہیں ہو سکتی۔",
            ],
          },
          {
            heading: "4.4 ریفنڈ کی منتقلی کا دورانیہ",
            content: [
              "منظور شدہ رقم 5 سے 7 کاروباری دنوں کے اندر Razorpay کے ذریعے براہ راست اسی اکاؤنٹ یا کارڈ میں واپس بھیج دی جاتی ہے جس سے ادائیگی کی گئی تھی۔",
            ],
          },
          {
            heading: "4.5 منسوخی یا ریفنڈ کی درخواست کا طریقہ",
            content: [
              "اپنے پروجیکٹ کا نام اور پیمنٹ آئی ڈی کے ہمراہ wordsofvoice2210@gmail.com پر ای میل کریں۔ ہم 24 سے 48 گھنٹوں میں جواب دیتے ہیں۔",
            ],
          },
        ],
      },
      {
        id: "delivery",
        topic: "ڈیلیوری پالیسی",
        topicId: "delivery",
        title: "5. ڈیجیٹل ڈیلیوری اور تکمیل کی شرائط",
        badge: "ڈیلیوری کا طریقہ",
        lastUpdated: "11 ستمبر 2026",
        clauses: [
          {
            heading: "5.1 سو فیصد ڈیجیٹل ڈیلیوری (کوئی فزیکل پارسل نہیں)",
            content: [
              "ہماری تمام پروڈکٹس اور سروسز (ویب سائٹس، 3D ماڈلز، گرافکس اور کوڈ) 100% ڈیجیٹل شکل میں فراہم کی جاتی ہیں۔ کوئی فزیکل سامان یا پارسل نہیں بھیجا جاتا۔",
            ],
          },
          {
            heading: "5.2 ڈیلیوری کے محفوظ راستے",
            content: [
              "لائیو اسٹیجنگ لنک: جانچ پڑتال کے لیے Vercel پر فعال پریویو لنک۔",
              "سورس کوڈ کی منتقلی: GitHub کے پرائیویٹ ریپوزیٹری کی مکمل اونرشپ ٹرانسفر یا کوڈ کی زپ فائل۔",
              "ڈیزائن کی فائلز: Figma کا لائیو ایکسس اور 3D GLB فارمیٹ فائلیں۔",
              "کلائنٹ ورک اسپیس والٹ: تمام انوائسز اور دستاویزات کا مستقل ریکارڈ۔",
            ],
          },
          {
            heading: "5.3 کام کی تکمیل کا تخمینہ وقت",
            content: [
              "ہائی کنورٹنگ لینڈنگ پیجز: 1 سے 2 ہفتے۔",
              "تھری ڈی انٹرایکٹو برانڈ ویب سائٹس: 3 سے 5 ہفتے۔",
              "فل اسٹیک ویب ایپس اور کسٹم پروڈکٹس: 4 سے 6 ہفتے۔",
            ],
          },
          {
            heading: "5.4 ٹیسٹنگ اور حتمی منظوری کی مدت",
            content: [
              "اسٹیجنگ لنک ملنے کے بعد کلائنٹ کے پاس 7 دن کی ریویو مہلت ہوتی ہے تاکہ وہ ہر چیز اچھی طرح چیک کر لے اور لائیو کرنے کی حتمی منظوری دے سکے۔",
            ],
          },
        ],
      },
      {
        id: "privacy",
        topic: "رازداری کی پالیسی",
        topicId: "privacy",
        title: "6. پرائیویسی پالیسی اور ڈیٹا کا تحفظ",
        badge: "ڈیٹا تحفظ",
        lastUpdated: "11 ستمبر 2026",
        clauses: [
          {
            heading: "6.1 معلومات جو ہم حاصل کرتے ہیں",
            content: [
              "ہم صرف وہی معلومات حاصل کرتے ہیں جو آپ فارم بھرتے وقت، پروجیکٹ ڈسکشن، ورک اسپیس رجسٹریشن یا آن لائن پیمنٹ کرتے ہوئے خود فراہم کرتے ہیں۔",
              "اس میں نام، بزنس ای میل، کمپنی کا نام، فون نمبر اور پروجیکٹ کے تقاضے شامل ہیں۔",
            ],
          },
          {
            heading: "6.2 معلومات کا استعمال اور سیکیورٹی کی ضمانت",
            content: [
              "یہ معلومات صرف آپ کی ویب سائٹ بنانے، آپ سے رابطہ رکھنے اور رسید جاری کرنے کے لیے استعمال ہوتی ہے۔",
              "ہم کلائنٹ کی ذاتی معلومات کبھی کسی تیسرے فریق یا اشتہاری کمپنی کو فروخت یا شیئر نہیں کرتے۔",
            ],
          },
          {
            heading: "6.3 سیکیور انفراسٹرکچر",
            content: [
              "ہم دنیا کے معروف اور انتہائی محفوظ ترین پلیٹ فارمز استعمال کرتے ہیں: Supabase (محفوظ ڈیٹا بیس)، Vercel (تیز رفتار ہوسٹنگ)، اور Razorpay (محفوظ ادائیگی)۔",
            ],
          },
          {
            heading: "6.4 آپ کے حقوق",
            content: [
              "آپ کسی بھی وقت ہم سے رابطہ کر کے اپنے اکاؤنٹ اور پروجیکٹ کی تفصیلات دیکھنے، تبدیل کرنے یا سسٹم سے مستقل حذف کروانے کا پورا حق رکھتے ہیں۔",
            ],
          },
        ],
      },
      {
        id: "support",
        topic: "رابطہ اور مدد",
        topicId: "support",
        title: "7. باضابطہ رابطہ اور معاونت",
        badge: "آفیشل رابطہ",
        lastUpdated: "11 ستمبر 2026",
        clauses: [
          {
            heading: "7.1 رابطے کی تفصیلات",
            content: [
              "کسی بھی سوال، ریفنڈ استفسار یا قانونی رہنمائی کے لیے بلا جھجھک لکھیں: wordsofvoice2210@gmail.com",
              "آفیشل ویب سائٹ: https://tanie.me | بھارت سے آپریٹنگ، پوری دنیا کے کلائنٹس کے ساتھ کام۔",
            ],
          },
        ],
      },
    ],
  },

  zh: {
    badge: "法律合规与客户协议",
    title: "条款与政策",
    subtitle: "在一个可搜索的中心轻松查阅我们的服务条款、隐私政策、里程碑退款规则及数字化服务交付协议。",
    searchPlaceholder: "搜索主题与条款（例如：退款、Razorpay、源码归属、质保期、交付周期）...",
    filterLabel: "按主题筛选：",
    noResultsTitle: (query) => `未找到与 "${query}" 匹配的条款`,
    noResultsSubtitle: "请尝试使用更广泛的关键词（如退款、付款、质保、交付），或重置筛选器。",
    resetButton: "重置筛选条件",
    showingCount: (sections, clauses) => `${sections} 个章节（${clauses} 条条款）`,
    sectionLinkLabel: "章节链接",
    quickLinks: {
      faq: "查看常见问题 →",
      pricing: "费用估算器与套餐 →",
      contact: "联系我们 →",
      supportNote: "Tanie Lalwani Studio · 官方支持：wordsofvoice2210@gmail.com",
    },
    filters: [
      { id: "all", label: "全部政策" },
      { id: "terms", label: "服务条款" },
      { id: "privacy", label: "隐私政策" },
      { id: "refunds", label: "退款与取消" },
      { id: "delivery", label: "服务交付" },
      { id: "payments", label: "支付安全" },
      { id: "ip", label: "知识产权" },
    ],
    sections: [
      {
        id: "terms",
        topic: "服务条款",
        topicId: "terms",
        title: "1. 合作条款与服务范围",
        badge: "合作协议",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "1.1 概述与服务范围",
            content: [
              "本条款与条件适用于 Tanie Lalwani（以下简称“开发者”或“工作室”）向客户（以下简称“客户”）提供的定制创意工程、UI/UX设计、3D WebGL开发、交互式Web应用及全栈软件开发服务。",
              "委托项目、购买套餐或通过我们的结账系统支付款项，即表示您完全认可并同意遵守本条款的所有内容。",
            ],
          },
          {
            heading: "1.2 项目里程碑与客户工作区",
            content: [
              "每个合作项目均划分为公开透明且双方认可的阶段性里程碑（例如：需求调研与线框原型、3D交互与视觉UI设计、前端代码开发、测试环境验收、正式上线部署）。",
              "交付物、测试环境链接、冲刺进度及资产移交均在专属的“客户工作区”内集中归档与呈现。",
            ],
          },
          {
            heading: "1.3 客户职责与反馈时限",
            content: [
              "为确保按时交付，客户应在约定的审核周期内，按时提供必要的品牌资产、文案内容、API凭证以及审查反馈意见。",
            ],
          },
          {
            heading: "1.4 30天免费质保期与上线后支持",
            content: [
              "所有交付的定制网站和Web应用在正式上线切换域名后，均享有30天的免费贴心质保期。",
              "该质保涵盖修复严重代码缺陷、主流移动端与桌面端浏览器的布局兼容性以及性能微调，无需支付任何额外费用。",
            ],
          },
          {
            heading: "1.5 责任限制",
            content: [
              "在法律允许的最大范围内，因第三方托管商（如 Vercel、AWS）故障、外部API废弃或域名DNS解析延误等不可控原因造成的间接损失，开发者概不负责。",
            ],
          },
        ],
      },
      {
        id: "payments",
        topic: "支付安全",
        topicId: "payments",
        title: "2. 付款条件与 Razorpay 支付安全",
        badge: "账单与安全",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "2.1 定金与里程碑阶段付款",
            content: [
              "常规定制开发项目需在签署协议后支付50%的前期定金方可启动开发。剩余50%款项将在测试环境最终验收合格、正式上线绑定域名或交付源码仓库前结清。",
              "对于在线直接购买的即时开箱套餐，客户预先安全支付全款，系统将立即出具正式发票并自动开通客户工作区权限。",
            ],
          },
          {
            heading: "2.2 Razorpay 支付网关与合规资质",
            content: [
              "所有在线支付、国际信用卡扣款、UPI交易均通过 Razorpay 支付系统进行加密处理。",
              "我们绝不在本地服务器存储任何信用卡号、CVV码或银行密码。Razorpay 具备国际最高标准的 PCI-DSS Level 1 资质认证，严格符合印度储备银行（RBI）金融安全监管标准。",
            ],
          },
          {
            heading: "2.3 发票开具与支持币种",
            content: [
              "发票及支付凭证将自动发送至客户邮箱，并保存在客户工作区供随时下载。结算支持的货币包括：INR (₹)、USD ($)、EUR (€) 和 AED (د.إ)。",
            ],
          },
        ],
      },
      {
        id: "ip",
        topic: "知识产权",
        topicId: "ip",
        title: "3. 知识产权与源代码归属",
        badge: "资产所有权",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "3.1 源代码与设计资产完全移交",
            content: [
              "在客户付清所有项目里程碑的100%款项后，专门为本项目编写的所有定制源代码、视觉组件、3D交互场景和设计变量的所有权均永久归客户所有。",
              "客户享有完整的商业开发与使用权益，可自行修改、部署或商用，无需支付任何额外版税。",
            ],
          },
          {
            heading: "3.2 第三方与开源技术栈",
            content: [
              "项目中可能采用遵循宽松开源协议（如 MIT、Apache 2.0）的前端库（如 React、Next.js、Three.js、Tailwind CSS）。客户的所有权适用于为本项目专属编写的定制代码。",
            ],
          },
          {
            heading: "3.3 案例展示权",
            content: [
              "开发者保留在其专业作品集、案例分析与社交平台上展示已完成项目非保密视觉预览和视频演示的非排他性权利。",
            ],
          },
        ],
      },
      {
        id: "refunds",
        topic: "退款与取消",
        topicId: "refunds",
        title: "4. 取消项目与分阶段退款政策",
        badge: "退款准则",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "4.1 数字化工程服务的特殊性",
            content: [
              "Tanie Lalwani 工作室提供定制化视觉设计、3D WebGL工程与全栈软件开发。鉴于每项工作均投入了专属工时与开发资源，退款将严格根据进度里程碑执行。",
            ],
          },
          {
            heading: "4.2 启动前48小时内取消（全额退款）",
            content: [
              "若客户在支付定金后48小时内且在原型或设计工作尚未展开之前以书面形式提出终止，我们将扣除支付网关手续费后全额退还100%定金。",
            ],
          },
          {
            heading: "4.3 里程碑退款梯度规则",
            content: [
              "原型线框阶段：如客户对初版线框不满意并决定在代码编写前终止合同，可退还首付定金的50%。",
              "开发与测试阶段：一旦前端编码与3D场景已进入开发并在测试环境部署，前期定金将不予退还，但后续所有剩余里程碑费用全部免除，合作正式终止。",
              "已验收完成的项目：经客户最终验收通过的交付物，所有款项概不退还。",
            ],
          },
          {
            heading: "4.4 退款到账时限",
            content: [
              "所有经核准的退款将在5至7个工作日内通过 Razorpay 沿原支付渠道（信用卡、储蓄卡、UPI等）返还至客户账户。",
            ],
          },
          {
            heading: "4.5 如何申请取消或退款",
            content: [
              "请将您的项目名称及 Razorpay 付款订单号发送至 wordsofvoice2210@gmail.com。我们将在24至48个工作小时内予以审核并答复。",
            ],
          },
        ],
      },
      {
        id: "delivery",
        topic: "服务交付",
        topicId: "delivery",
        title: "5. 数字化服务交付与履约协议",
        badge: "交付准则",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "5.1 100%数字化交付（无实物邮寄）",
            content: [
              "Tanie Lalwani 提供的所有技术与设计成果（包括 WebGL 3D 网站、响应式页面、设计原型与 SaaS 应用）均为100%在线数字化交付，不产生任何实物包裹运输。",
            ],
          },
          {
            heading: "5.2 交付渠道与数字资产",
            content: [
              "实时测试环境：部署于 Vercel 或专属测试子域名的交互式测试环境，供客户随时测试体验。",
              "源代码移交：GitHub 私有仓库所有权移交，或提供编译好的生产环境 ZIP 压缩包。",
              "设计资产：Figma 协作空间权限、导出的 3D GLB/GLTF 模型资产及高清矢量素材。",
              "客户工作区文档库：集中归档电子发票、项目验收记录及技术说明书。",
            ],
          },
          {
            heading: "5.3 常见交付周期参考",
            content: [
              "高转化率着陆页（Landing Page）：1 至 2 周。",
              "3D 交互式品牌展示网站：3 至 5 周。",
              "全栈 Web 应用与 MVP：4 至 6 周。",
            ],
          },
          {
            heading: "5.4 测试期与最终验收",
            content: [
              "测试环境上线后，客户享有7天的专属测试验收期，可测试功能并提出修改意见，确认无误后配合上线部署。",
            ],
          },
        ],
      },
      {
        id: "privacy",
        topic: "隐私政策",
        topicId: "privacy",
        title: "6. 隐私保护与数据安全政策",
        badge: "数据安全",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "6.1 我们收集的信息",
            content: [
              "我们仅收集您在提交咨询表单、评估需求、注册客户工作区或通过 Razorpay 结账时主动提供的个人与企业信息。",
              "这包括您的姓名、企业邮箱、公司名称、联系电话以及项目技术要求。",
            ],
          },
          {
            heading: "6.2 信息用途与绝不出售承诺",
            content: [
              "您的信息仅用于项目实施、客户工作区协作、开具账单发票及沟通项目进度。",
              "我们绝不会向任何第三方广告商或数据中介出售、出租或交易您的个人隐私数据。",
            ],
          },
          {
            heading: "6.3 基础设施安全伙伴",
            content: [
              "我们选用业界高安全性基础设施伙伴服务客户：Supabase（加密数据库与鉴权）、Vercel（安全边缘部署平台）以及 Razorpay（PCI-DSS 合规支付网关）。",
            ],
          },
          {
            heading: "6.4 客户权益与数据删除请求",
            content: [
              "您随时有权通过书面邮件查询、更新或要求我们从数据库中彻底注销并删除您的个人数据及项目资料。",
            ],
          },
        ],
      },
      {
        id: "support",
        topic: "联系与支持",
        topicId: "support",
        title: "7. 官方联络与争议处理",
        badge: "官方支持",
        lastUpdated: "2026年9月11日",
        clauses: [
          {
            heading: "7.1 联系方式",
            content: [
              "关于条款解释、隐私事宜或付款发票，请直接联络官方信箱：wordsofvoice2210@gmail.com",
              "官方网站：https://tanie.me | 立足印度，服务全球客户。",
            ],
          },
        ],
      },
    ],
  },
};
