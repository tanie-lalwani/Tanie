"use client";

import React from "react";
import { AESTHETIC_STYLES, type AestheticStyle } from "@/data/aestheticDatabase";

interface AestheticsGridSectionProps {
  likedAesthetics: string[];
  onToggleLike: (styleName: string) => void;
  onSelectPreview: (style: AestheticStyle) => void;
  pkgCopy: any;
}

export default function AestheticsGridSection({
  likedAesthetics,
  onToggleLike,
  onSelectPreview,
  pkgCopy,
}: AestheticsGridSectionProps) {
  return (
    <div className="space-y-8">
      {/* Section 2 Header: Pure Design Aesthetics & Inspirations */}
      <div className="text-center max-w-2xl mx-auto pt-4">
        <h2 className="text-3xl sm:text-4xl font-black text-[#0a192f] tracking-tight">
          Choose Your Design Aesthetic
        </h2>
        {likedAesthetics.length > 0 && (
          <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-rose-50/90 border border-rose-200/90 px-4 py-1.5 text-xs text-rose-900 shadow-2xs">
            <span className="font-bold flex items-center gap-1.5 text-rose-700">
              <span>❤️</span>
              <span>Liked Aesthetics ({likedAesthetics.length}):</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {likedAesthetics.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 rounded-lg bg-white border border-rose-200 px-2 py-0.5 text-[11px] font-bold text-rose-800 shadow-2xs"
                >
                  <span>{name}</span>
                  <button
                    type="button"
                    onClick={() => onToggleLike(name)}
                    className="text-rose-400 hover:text-rose-700 ml-0.5 text-xs font-black cursor-pointer"
                    title="Remove like"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DIRECT AESTHETICS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {AESTHETIC_STYLES.map((style) => {
          const isLiked = likedAesthetics.includes(style.name);
          return (
            <div
              key={style.id}
              onClick={() => onSelectPreview(style)}
              className={`flex flex-col justify-between rounded-[2.2rem] border p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer ${
                isLiked
                  ? "border-rose-300/90 bg-rose-50/30 hover:bg-rose-50/50 ring-2 ring-rose-400/40"
                  : "border-sky-300/80 bg-[#c8ecff]/30 hover:bg-[#c8ecff]/50"
              }`}
            >
              <div>
                {/* Badge, Category & Direct Like Button */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="rounded-full bg-sky-100 border border-sky-200 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-sky-950">
                    {style.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-sky-800/80 hidden sm:inline">
                      {style.badge}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(style.name);
                      }}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition shadow-2xs cursor-pointer border ${
                        isLiked
                          ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-600 shadow-rose-200"
                          : "bg-white/85 hover:bg-white text-slate-700 border-black/10 hover:text-rose-600"
                      }`}
                      title={isLiked ? "Unlike this design aesthetic" : "Like this design aesthetic"}
                    >
                      <span>{isLiked ? "❤️" : "🤍"}</span>
                      <span>{isLiked ? "Liked" : "Like"}</span>
                    </button>
                  </div>
                </div>

                {/* Mock Mini Wireframe Preview */}
                <div
                  className="rounded-2xl p-4 mb-5 border border-black/10 overflow-hidden"
                  style={{ backgroundColor: style.mockWireframe.bgColor, color: style.mockWireframe.textColor }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="h-2 w-12 rounded-full" style={{ backgroundColor: style.mockWireframe.accentColor }} />
                    <span className="text-[9px] font-mono opacity-60">{style.mockWireframe.badgeText}</span>
                  </div>
                  <h4 className="text-xs font-bold line-clamp-1 mb-1" style={{ color: style.mockWireframe.textColor }}>
                    {style.mockWireframe.heroHeading}
                  </h4>
                  <p className="text-[10px] opacity-70 line-clamp-2 leading-relaxed mb-3">
                    {style.mockWireframe.heroSubheading}
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-md px-2.5 py-1 text-[9px] font-bold"
                      style={{
                        backgroundColor: style.mockWireframe.accentColor,
                        color:
                          style.mockWireframe.bgColor === "#02040a" || style.mockWireframe.bgColor.includes("#0")
                            ? "#fff"
                            : "#000",
                      }}
                    >
                      {style.mockWireframe.ctaText}
                    </div>
                  </div>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-bold mb-1 text-[#0a192f] flex items-center justify-between">
                  <span>{style.name}</span>
                  {isLiked && <span className="text-sm text-rose-500 font-normal">❤️</span>}
                </h3>
                <p className="text-xs mb-4 leading-relaxed text-sky-950/80 line-clamp-2">
                  {style.tagline}
                </p>

                {/* Color Palette Swatches */}
                <div className="mb-4">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-sky-800 mb-1.5">
                    {pkgCopy.aesthetics.colorDna}
                  </span>
                  <div className="flex items-center gap-2">
                    {style.defaultPalette.map((swatch) => (
                      <div
                        key={swatch.name}
                        className="h-6 w-6 rounded-full border border-black/15 shadow-2xs"
                        style={{ backgroundColor: swatch.hex }}
                        title={`${swatch.name} (${swatch.hex})`}
                      />
                    ))}
                  </div>
                </div>

                {/* Tech Stack Badges */}
                <div className="mb-6 flex flex-wrap gap-1.5">
                  {style.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-sky-200/60 bg-sky-100/70 px-2 py-0.5 text-[10px] font-semibold text-sky-900"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Inspect & Like */}
              <div className="pt-4 border-t border-sky-200/80 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPreview(style);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0a192f] py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer shadow-xs"
                >
                  <span>Inspect Design Vibe</span>
                  <span>👁️</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike(style.name);
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border shadow-xs ${
                    isLiked
                      ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-600"
                      : "bg-white hover:bg-rose-50 text-slate-800 border-sky-300 hover:text-rose-600"
                  }`}
                >
                  <span>{isLiked ? "❤️" : "🤍"}</span>
                  <span>{isLiked ? "Liked" : "Like"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
