"use client";

import React, { useState } from "react";
import { AESTHETIC_STYLES, type AestheticStyle } from "@/data/aestheticDatabase";
import { getAestheticImages } from "@/data/aestheticCarousels";

interface AestheticsGridSectionProps {
  likedAesthetics: string[];
  onToggleLike: (styleName: string) => void;
  onSelectPreview?: (style: AestheticStyle) => void;
  pkgCopy?: any;
}

interface AestheticCardCarouselProps {
  style: AestheticStyle;
  isLiked: boolean;
  onToggleLike: (styleName: string) => void;
}

function AestheticCardCarousel({
  style,
  isLiked,
  onToggleLike,
}: AestheticCardCarouselProps) {
  const images = getAestheticImages(style.id);
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setCurrentIdx(idx);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-300 shadow-md hover:shadow-2xl ${
        isLiked
          ? "border-rose-400 ring-2 ring-rose-400/50"
          : "border-sky-300/80 hover:border-sky-400"
      }`}
    >
      {/* Aspect Ratio Container for Pure Image */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-950">
        <img
          src={images[currentIdx]}
          alt={style.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Subtle gradient vignette at top and bottom for controls visibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 opacity-70 group-hover:opacity-90 transition-opacity" />

        {/* Floating Like Icon on Top */}
        <div className="absolute top-3.5 right-3.5 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(style.name);
            }}
            aria-label={isLiked ? "Unlike design aesthetic" : "Like design aesthetic"}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md ${
              isLiked
                ? "bg-rose-500 text-white scale-110 shadow-rose-500/40 ring-2 ring-white/60"
                : "bg-black/40 hover:bg-black/70 text-white/90 hover:text-white border border-white/25 hover:scale-105"
            }`}
            title={isLiked ? "Saved! Click to remove" : "Like to save this design aesthetic"}
          >
            <span className="text-lg leading-none select-none">
              {isLiked ? "❤️" : "🤍"}
            </span>
          </button>
        </div>

        {/* Previous Image Chevron */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={prevImage}
            aria-label="Previous aesthetic example"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all cursor-pointer shadow-md"
          >
            <span className="text-sm font-bold">‹</span>
          </button>
        )}

        {/* Next Image Chevron */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={nextImage}
            aria-label="Next aesthetic example"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all cursor-pointer shadow-md"
          >
            <span className="text-sm font-bold">›</span>
          </button>
        )}

        {/* Slide Indicator Dots at Bottom */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => goToImage(e, idx)}
                aria-label={`Jump to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIdx
                    ? "w-4 bg-white shadow-xs"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AestheticsGridSection({
  likedAesthetics,
  onToggleLike,
}: AestheticsGridSectionProps) {
  return (
    <div className="space-y-8" id="design-aesthetics">
      {/* Section Header: Choose Your Design Aesthetic */}
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

      {/* PURE IMAGE CAROUSEL CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
        {AESTHETIC_STYLES.map((style) => {
          const isLiked = likedAesthetics.includes(style.name);
          return (
            <AestheticCardCarousel
              key={style.id}
              style={style}
              isLiked={isLiked}
              onToggleLike={onToggleLike}
            />
          );
        })}
      </div>
    </div>
  );
}
