"use client";

import React, { useState } from "react";
import { type AestheticStyle } from "@/data/aestheticDatabase";

interface AestheticPreviewModalProps {
  style: AestheticStyle | null;
  isLiked: boolean;
  onToggleLike: (styleName: string) => void;
  onClose: () => void;
  pkgCopy: any;
}

export default function AestheticPreviewModal({
  style,
  isLiked,
  onToggleLike,
  onClose,
  pkgCopy,
}: AestheticPreviewModalProps) {
  const [activePaletteIdx, setActivePaletteIdx] = useState(0);

  if (!style) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-[2.4rem] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 h-8 w-8 rounded-full border border-black/10 text-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
        >
          ×
        </button>

        <div className="flex items-center justify-between mb-1 pr-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600">
            {style.category}
          </span>
          <button
            type="button"
            onClick={() => onToggleLike(style.name)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition shadow-xs cursor-pointer border ${
              isLiked
                ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-600"
                : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
            }`}
          >
            <span>{isLiked ? "❤️" : "🤍"}</span>
            <span>{isLiked ? "Liked" : "Like This Vibe"}</span>
          </button>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mt-1 mb-1 text-slate-950">
          {style.name}
        </h3>
        <p className="text-xs text-slate-500 mb-4 font-mono">
          {style.vibeSummary || "High-fidelity digital direction · Bespoke typography · Custom shaders"}
        </p>
        <p className="text-sm text-slate-700 leading-relaxed mb-6">
          {style.description}
        </p>

        {/* Visual DNA Principles */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Visual DNA Principles</h4>
          <ul className="space-y-1.5">
            {style.visualDna.map((dna) => (
              <li key={dna} className="flex items-start gap-2 text-xs text-slate-600">
                <span className="text-sky-600 font-bold">✓</span>
                <span>{dna}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive Palette Preview */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Color Palette Swatches</h4>
          <div className="flex flex-wrap gap-2">
            {style.palettes.map((p, idx) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setActivePaletteIdx(idx)}
                className={`flex items-center gap-2 rounded-xl border p-2 text-xs cursor-pointer ${
                  activePaletteIdx === idx ? "border-sky-500 bg-sky-50 ring-1 ring-sky-300" : "border-black/10 bg-slate-50"
                }`}
              >
                <div className="flex items-center -space-x-1">
                  {p.swatches.map((s) => (
                    <div key={s.name} className="h-4 w-4 rounded-full border border-black/20" style={{ backgroundColor: s.hex }} />
                  ))}
                </div>
                <span className="font-bold text-slate-800 text-[11px]">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Bottom Action: Like & Close */}
        <div className="pt-4 border-t border-black/8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onToggleLike(style.name)}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer border shadow-sm ${
              isLiked
                ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-600"
                : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300"
            }`}
          >
            <span>{isLiked ? "❤️" : "🤍"}</span>
            <span>
              {isLiked
                ? "Design Aesthetic Liked!"
                : "Like This Aesthetic"}
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#0a192f] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition cursor-pointer shadow-sm"
          >
            {pkgCopy.intakeModal.close}
          </button>
        </div>
      </div>
    </div>
  );
}
