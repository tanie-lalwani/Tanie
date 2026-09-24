"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const notFoundTranslations = {
  en: {
    title: "Page Not Found",
    desc: "The page you are looking for might have been moved, deleted, or never existed.",
    returnHome: "Return to Home",
  },
  es: {
    title: "Página No Encontrada",
    desc: "La página que buscas puede haber sido movida, eliminada o nunca haber existido.",
    returnHome: "Volver al Inicio",
  },
  fr: {
    title: "Page Introuvable",
    desc: "La page que vous recherchez a peut-être été déplacée, supprimée ou n'a jamais existé.",
    returnHome: "Retour à l'Accueil",
  },
  hi: {
    title: "पृष्ठ नहीं मिला",
    desc: "आप जिस पृष्ठ की तलाश कर रहे हैं उसे स्थानांतरित, हटाया या कभी मौजूद नहीं किया गया हो सकता है।",
    returnHome: "होम पर लौटें",
  },
  ja: {
    title: "ページが見つかりません",
    desc: "お探しのページは移動、削除されたか、存在しない可能性があります。",
    returnHome: "ホームに戻る",
  },
  ur: {
    title: "صفحہ نہیں ملا",
    desc: "جو صفحہ آپ تلاش کر رہے ہیں وہ منتقل، حذف یا کبھی موجود نہیں ہوا ہو سکتا ہے۔",
    returnHome: "ہوم پر واپس جائیں",
  },
  zh: {
    title: "页面未找到",
    desc: "您访问的页面可能已被移动、删除或从未存在。",
    returnHome: "返回首页",
  },
};

export default function NotFound() {
  const { locale } = useLanguage();
  const copy = notFoundTranslations[locale] || notFoundTranslations.en;

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#04111b] px-6 text-center text-sky-100"
      dir={locale === "ur" ? "rtl" : "ltr"}
    >
      <h1 className="mb-4 text-7xl font-bold tracking-tight text-white sm:text-9xl">404</h1>
      <h2 className="mb-4 text-2xl font-medium sm:text-3xl">{copy.title}</h2>
      <p className="mb-8 max-w-md text-sky-200/70">
        {copy.desc}
      </p>

      {/* Helpful shortcuts */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2 max-w-lg">
        <Link
          href="/"
          className="rounded-full border border-sky-400/30 bg-sky-500/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-500/25 !no-underline"
        >
          {copy.returnHome}
        </Link>
        <Link
          href="/pricing"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white !no-underline"
        >
          Pricing &amp; Packages
        </Link>
        <Link
          href="/projects"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white !no-underline"
        >
          Featured Works
        </Link>
        <Link
          href="/client"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white !no-underline"
        >
          Client Hub
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white !no-underline"
        >
          Contact Studio
        </Link>
      </div>
    </div>
  );
}
