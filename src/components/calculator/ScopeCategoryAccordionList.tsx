"use client";

import React from "react";
import type { FEATURE_CATEGORIES, CatalogFeature } from "@/data/featureCatalogDatabase";

type CategoryItem = (typeof FEATURE_CATEGORIES)[0];

interface ScopeCategoryAccordionListProps {
  categories: typeof FEATURE_CATEGORIES;
  expandedCategories: Record<string, boolean>;
  onToggleCategoryExpand: (catId: string) => void;
  selectedItems: Record<string, number>;
  activeCurrency: "INR" | "USD";
  onSelectAllInCategory: (cat: CategoryItem) => void;
  onClearCategory: (cat: CategoryItem) => void;
  onToggleFeature: (feature: CatalogFeature) => void;
  onQuantityChange: (feature: CatalogFeature, delta: number) => void;
}

export default function ScopeCategoryAccordionList({
  categories,
  expandedCategories,
  onToggleCategoryExpand,
  selectedItems,
  activeCurrency,
  onSelectAllInCategory,
  onClearCategory,
  onToggleFeature,
  onQuantityChange,
}: ScopeCategoryAccordionListProps) {
  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const isExpanded = expandedCategories[cat.id] ?? false;
        const selectedCount = cat.features.reduce(
          (sum, f) => sum + (selectedItems[f.id] ? 1 : 0),
          0
        );
        const catSubtotalInr = cat.features.reduce(
          (sum, f) => sum + (selectedItems[f.id] || 0) * f.priceInr,
          0
        );
        const catSubtotalUsd = cat.features.reduce(
          (sum, f) => sum + (selectedItems[f.id] || 0) * f.priceUsd,
          0
        );

        return (
          <div
            key={cat.id}
            className={`rounded-2xl border transition-all overflow-hidden ${
              selectedCount > 0
                ? "bg-slate-900/70 border-slate-700/80 shadow-lg"
                : "bg-slate-950/40 border-slate-800/60 hover:border-slate-700/60"
            }`}
          >
            {/* CATEGORY HEADER */}
            <div
              onClick={() => onToggleCategoryExpand(cat.id)}
              className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none bg-slate-900/30 hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="text-2xl w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                  {cat.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-medium text-white">
                      {cat.name}
                    </h3>
                    {selectedCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold">
                        {selectedCount} selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {selectedCount > 0 && (
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-mono font-semibold text-cyan-400">
                      {activeCurrency === "INR"
                        ? `+₹${catSubtotalInr.toLocaleString()}`
                        : `+$${catSubtotalUsd.toLocaleString()}`}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Category Subtotal
                    </div>
                  </div>
                )}
                <div
                  className={`text-slate-400 transition-transform duration-200 text-sm ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </div>
              </div>
            </div>

            {/* EXPANDED FEATURES GRID */}
            {isExpanded && (
              <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
                {/* Category Quick Batch Select */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pb-2 border-b border-slate-800/40">
                  <span>{cat.features.length} Features Available</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAllInCategory(cat);
                      }}
                      className="text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      + Select All
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearCategory(cat);
                      }}
                      className="text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* FEATURES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                  {cat.features.map((feature) => {
                    const isSelected = (selectedItems[feature.id] || 0) > 0;
                    const currentQty = selectedItems[feature.id] || 0;
                    const hasQuantity = feature.priceType !== "flat";

                    return (
                      <div
                        key={feature.id}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-slate-900 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/20"
                            : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700/80"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Custom Checkbox */}
                          <button
                            type="button"
                            onClick={() => onToggleFeature(feature)}
                            className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                              isSelected
                                ? "bg-cyan-500 border-cyan-400 text-slate-950 font-bold text-xs"
                                : "border-slate-700 bg-slate-900 hover:border-slate-500"
                            }`}
                          >
                            {isSelected && "✓"}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                onClick={() => onToggleFeature(feature)}
                                className={`text-xs sm:text-sm font-medium cursor-pointer ${
                                  isSelected ? "text-white font-semibold" : "text-slate-200"
                                }`}
                              >
                                {feature.name}
                              </span>
                              {feature.isPopular && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                              {feature.description}
                            </p>
                          </div>
                        </div>

                        {/* PRICE & UNIT QUANTITY ROW */}
                        <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                          <div className="text-xs font-mono font-semibold text-cyan-400">
                            {activeCurrency === "INR"
                              ? `₹${feature.priceInr.toLocaleString()}`
                              : `$${feature.priceUsd.toLocaleString()}`}
                            {feature.unitLabel && (
                              <span className="text-[10px] text-slate-500 font-normal ml-1">
                                /{feature.unitLabel}
                              </span>
                            )}
                          </div>

                          {/* Quantity Selector for Unit Features */}
                          {hasQuantity && isSelected && (
                            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-lg p-0.5">
                              <button
                                type="button"
                                onClick={() => onQuantityChange(feature, -1)}
                                className="w-5 h-5 rounded flex items-center justify-center text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                              >
                                -
                              </button>
                              <span className="text-xs font-mono px-1 font-bold text-white min-w-[20px] text-center">
                                {currentQty}
                              </span>
                              <button
                                type="button"
                                onClick={() => onQuantityChange(feature, 1)}
                                className="w-5 h-5 rounded flex items-center justify-center text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
