"use client";

import React from "react";
import type { ClientCustomQuote } from "@/lib/portalServices";

interface SavedQuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  savedQuotes: ClientCustomQuote[];
  onLoadQuote: (quote: ClientCustomQuote) => void;
  onDeleteQuote: (quoteId: string) => void;
}

export default function SavedQuotesModal({
  isOpen,
  onClose,
  isLoading,
  savedQuotes,
  onLoadQuote,
  onDeleteQuote,
}: SavedQuotesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-light text-white">Your Saved Quotations</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Draft quotes saved to your browser and client portal account.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs">
            Loading saved quotations...
          </div>
        ) : savedQuotes.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-sans space-y-2">
            <div className="text-4xl">📂</div>
            <div className="text-sm text-slate-300">No saved quotations found</div>
            <p className="text-xs text-slate-500">
              Configure your desired features and click &quot;Save Draft&quot; to store quotations here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedQuotes.map((quote) => (
              <div
                key={quote.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div>
                  <h4 className="text-sm font-medium text-white">{quote.project_name}</h4>
                  <div className="text-xs text-cyan-400 font-mono mt-0.5">
                    {quote.currency === "INR"
                      ? `₹${quote.final_total_inr.toLocaleString()}`
                      : `$${quote.final_total_usd.toLocaleString()}`}
                    <span className="text-slate-500 font-normal ml-2">
                      ({Object.keys(quote.selected_features || {}).length} features)
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    Saved on {new Date(quote.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onLoadQuote(quote)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-mono text-xs font-semibold hover:bg-cyan-400 transition-all"
                  >
                    Load Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteQuote(quote.id)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Quote"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
