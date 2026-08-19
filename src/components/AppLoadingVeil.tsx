"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export function AppLoadingVeil() {
  const { copy } = useLanguage();

  return (
    <motion.div
      className="fixed inset-0 z-[10000] grid place-items-center overflow-hidden px-6 backdrop-blur-[12px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(13, 35, 52, 0.64) 0%, rgba(8, 31, 49, 0.72) 52%, rgba(2, 8, 23, 0.86) 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 22% 18%, rgba(125, 211, 252, 0.14), transparent 32%), linear-gradient(90deg, transparent, rgba(226, 242, 255, 0.06), transparent)",
        }}
        aria-hidden="true"
      />
      <motion.div
        className="relative flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="mb-4 h-8 w-8 rounded-full border border-sky-50/16 border-t-sky-100/70"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
          aria-hidden="true"
        />
        <div
          className="flex text-base font-medium leading-none tracking-normal text-white/70 sm:text-lg"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {copy?.loading?.welcome || "Welcome"}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AppLoadingVeil;
