"use client";

import React from "react";
import { INDUSTRY_PRESETS, type IndustryPreset } from "@/data/featureCatalogDatabase";

interface IndustryPresetsBarProps {
  selectedIndustry: IndustryPreset;
  onApplyPreset: (preset: IndustryPreset) => void;
}

export default function IndustryPresetsBar({
  selectedIndustry,
  onApplyPreset,
}: IndustryPresetsBarProps) {
  return (
    <div className="mt-8">
      <div className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider flex items-center justify-between">
        <span>1. Select Industry Preset (Loads Recommended Core Stack)</span>
        <span className="text-cyan-400 font-sans normal-case text-xs">
          {selectedIndustry.name}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {INDUSTRY_PRESETS.map((preset) => {
          const isSelected = selectedIndustry.id === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between group ${
                isSelected
                  ? "bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/50"
                  : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div className="text-2xl mb-1.5 transform group-hover:scale-110 transition-transform">
                {preset.icon}
              </div>
              <div>
                <div className="text-xs font-medium text-white line-clamp-1">
                  {preset.name.split("/")[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
