"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ClientHubProject } from "./types";
import { AESTHETIC_STYLES, type AestheticStyle } from "@/data/aestheticDatabase";
import { getAestheticImages } from "@/data/aestheticCarousels";

interface SavedAestheticsTileProps {
  project: ClientHubProject;
  onUpdateProject?: (updated: ClientHubProject) => void;
}

interface SavedAestheticCardProps {
  name: string;
  styleObj?: AestheticStyle;
  onRemove: (name: string) => void;
}

function SavedAestheticCard({ name, styleObj, onRemove }: SavedAestheticCardProps) {
  const images = getAestheticImages(styleObj ? styleObj.id : name);
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="group flex flex-col rounded-3xl border border-sky-300/80 bg-white/90 overflow-hidden shadow-sm hover:shadow-lg transition-all">
      {/* Carousel Image Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={images[currentIdx]}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay for controls */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        {/* Saved badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-rose-500/90 text-white px-3 py-1 text-[11px] font-bold shadow-md backdrop-blur-xs">
          <span>❤️</span>
          <span>Saved</span>
        </div>

        {/* Remove button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={() => onRemove(name)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-white text-xs font-black transition cursor-pointer backdrop-blur-xs"
            title="Remove from saved"
          >
            ×
          </button>
        </div>

        {/* Chevrons */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
            >
              ›
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIdx ? "w-3 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          {styleObj?.category && (
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-800">
              {styleObj.category}
            </span>
          )}
          <h4 className="text-sm font-bold text-[#0a192f] mt-0.5 line-clamp-1">
            {styleObj?.name || name}
          </h4>
          {styleObj?.tagline && (
            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {styleObj.tagline}
            </p>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">
            {images.length} inspiration slides
          </span>
          <button
            type="button"
            onClick={() => onRemove(name)}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SavedAestheticsTile({
  project,
  onUpdateProject,
}: SavedAestheticsTileProps) {
  const [savedList, setSavedList] = useState<string[]>([]);

  // Load and consolidate saved aesthetics from localStorage, project quote, and project saved list
  useEffect(() => {
    let localSaved: string[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("tanie_liked_aesthetics");
        if (stored) {
          localSaved = JSON.parse(stored);
        }
      } catch {}
    }

    const quoteSaved = project.calculated_quote?.liked_aesthetics || [];
    const directSaved = project.saved_aesthetics || [];
    const primarySelected = project.calculated_quote?.selected_aesthetic
      ? [project.calculated_quote.selected_aesthetic]
      : [];

    const merged = Array.from(
      new Set([...localSaved, ...quoteSaved, ...directSaved, ...primarySelected])
    ).filter(Boolean);

    setSavedList(merged);
  }, [project]);

  const handleRemove = (nameToRemove: string) => {
    const updated = savedList.filter((n) => n !== nameToRemove);
    setSavedList(updated);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("tanie_liked_aesthetics", JSON.stringify(updated));
      } catch {}
    }

    if (onUpdateProject) {
      const updatedProject: ClientHubProject = {
        ...project,
        saved_aesthetics: updated,
        calculated_quote: project.calculated_quote
          ? {
              ...project.calculated_quote,
              liked_aesthetics: project.calculated_quote.liked_aesthetics?.filter(
                (n) => n !== nameToRemove
              ),
            }
          : null,
      };
      onUpdateProject(updatedProject);
    }
  };

  return (
    <div
      id="saved-aesthetics-tile"
      className="rounded-[2.2rem] border border-sky-300/80 bg-[#c8ecff]/35 p-6 sm:p-8 backdrop-blur-xl shadow-md transition hover:shadow-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-900 bg-rose-100 border border-rose-200 px-3 py-1 rounded-full shadow-2xs">
              ❤️ Moodboard & Design Direction
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {savedList.length} Saved {savedList.length === 1 ? "Vibe" : "Vibes"}
            </span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[#0a192f]">
            Saved Design Aesthetics
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Aesthetics you liked while exploring our pricing engine. These guide the UI styling and creative direction of your build.
          </p>
        </div>

        <Link
          href="/pricing#design-aesthetics"
          className="shrink-0 rounded-2xl bg-[#0a192f] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-slate-800 transition text-center"
        >
          Explore More Vibes 🎨
        </Link>
      </div>

      {savedList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sky-300/80 bg-white/60 p-8 text-center">
          <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center text-xl mx-auto mb-3">
            ❤️
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No Saved Aesthetics Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
            Browse our curated aesthetic carousels on the pricing page and tap ❤️ on your favorite visual vibes (Glassmorphism, 3D Spatial, Bento Grid, etc.) to save them to your project hub!
          </p>
          <Link
            href="/pricing#design-aesthetics"
            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 px-4 py-2 text-xs font-bold text-white transition shadow-sm"
          >
            <span>Browse Design Aesthetics</span>
            <span>→</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedList.map((name) => {
            const styleObj = AESTHETIC_STYLES.find(
              (s) => s.name === name || s.id === name
            );
            return (
              <SavedAestheticCard
                key={name}
                name={name}
                styleObj={styleObj}
                onRemove={handleRemove}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
