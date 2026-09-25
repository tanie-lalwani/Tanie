"use client";

import React, { useState } from "react";
import { ClientHubProject, PostHandoverOrder } from "./types";

interface HandoverAndAddonsTileProps {
  project: ClientHubProject;
  onUpdateProject: (updated: ClientHubProject) => void;
  onScrollToSection: (sectionId: string) => void;
}

export default function HandoverAndAddonsTile({
  project,
  onUpdateProject,
  onScrollToSection,
}: HandoverAndAddonsTileProps) {
  const isHandedOver = project.completion_paid || project.booking_status === "handed_over";
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderType, setOrderType] = useState<"changes" | "addon">("changes");
  const [orderTitle, setOrderTitle] = useState("");
  const [orderDesc, setOrderDesc] = useState("");

  if (!isHandedOver) {
    return (
      <div
        id="handover-addons-tile"
        className="rounded-[2.4rem] border border-slate-200 bg-slate-50/70 p-6 sm:p-10 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center text-xl font-bold">
              📦
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Production Release & Post-Launch
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Handover Vault & Post-Launch Add-ons
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Unlocks upon final completion payment. Production source code, credentials, and revision / add-on order requests activate here once the project status transitions to Handed Over.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onScrollToSection("payments-invoices-tile")}
            className="shrink-0 rounded-2xl bg-[#0a192f] px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-800 transition cursor-pointer shadow-md"
          >
            Settle Balance to Handover →
          </button>
        </div>
      </div>
    );
  }

  // Handle submitting new changes or add-on request (New Micro-Order)
  const handleCreatePostOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderTitle.trim()) return;

    const newOrder: PostHandoverOrder = {
      id: `order-${Date.now()}`,
      type: orderType,
      title: orderTitle.trim(),
      description: orderDesc.trim(),
      status: "pending_review",
      quoted_price: orderType === "addon" ? 450 : 150,
      currency: project.currency,
      created_at: new Date().toISOString(),
    };

    onUpdateProject({
      ...project,
      post_orders: [newOrder, ...project.post_orders],
    });

    setOrderTitle("");
    setOrderDesc("");
    setShowOrderModal(false);
  };

  return (
    <div
      id="handover-addons-tile"
      className="rounded-[2.4rem] border border-purple-300/80 bg-gradient-to-br from-white via-purple-50/40 to-sky-50/50 p-6 sm:p-10 shadow-lg backdrop-blur-xl space-y-8"
    >
      {/* Handover Celebration Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-900 bg-purple-100 border border-purple-200 px-3 py-1 rounded-full shadow-2xs">
              🎉 Official Status: Handed Over
            </span>
            <span className="text-xs text-slate-500 font-mono">
              100% IP Transferred
            </span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[#0a192f]">
            Production Handover Vault & Post-Launch Orders
          </h2>
          <p className="mt-0.5 text-xs text-slate-600 max-w-2xl leading-relaxed">
            Your project has been successfully completed, fully paid, and handed over. Access all production code deliverables below, or commission new revision sprints &amp; add-ons.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowOrderModal(true)}
          className="shrink-0 rounded-2xl bg-[#0a192f] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:bg-slate-800 transition cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <span>Ask for Changes or Add-ons</span>
          <span>✨</span>
        </button>
      </div>

      {/* Production Handover Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-purple-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="rounded-lg bg-purple-100 text-purple-900 px-2 py-0.5 text-[10px] font-black uppercase">
                Production Code
              </span>
              <span className="text-lg">💻</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Private GitHub Repository
            </h4>
            <p className="text-[11px] text-slate-600">
              Clean TypeScript / Next.js codebase transferred to your GitHub organization.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href={project.github_repo || "https://github.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-purple-700 hover:text-purple-950 flex items-center gap-1"
            >
              <span>Access GitHub Repo</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="rounded-lg bg-purple-100 text-purple-900 px-2 py-0.5 text-[10px] font-black uppercase">
                Cloud Deployment
              </span>
              <span className="text-lg">🚀</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Live Production Domain
            </h4>
            <p className="text-[11px] text-slate-600">
              Configured on Vercel/Cloudflare with automated SSL certificate and edge CDN caching.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href={project.live_preview_url || "https://tanie.me"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-purple-700 hover:text-purple-950 flex items-center gap-1"
            >
              <span>Visit Live Website</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="rounded-lg bg-purple-100 text-purple-900 px-2 py-0.5 text-[10px] font-black uppercase">
                Deliverables Bundle
              </span>
              <span className="text-lg">📦</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Production Export (.ZIP)
            </h4>
            <p className="text-[11px] text-slate-600">
              Compressed build artifacts, optimized 3D assets, vector logos, and environment templates.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => alert("Downloading production deliverables bundle (ZIP)...")}
              className="text-xs font-bold text-purple-700 hover:text-purple-950 flex items-center gap-1 cursor-pointer"
            >
              <span>Download Deliverables ZIP</span>
              <span>↓</span>
            </button>
          </div>
        </div>
      </div>

      {/* Post-Handover Orders / Changes List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Post-Handover Orders &amp; Add-on Sprints ({project.post_orders.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Managed as discrete micro-orders with clear pricing
          </span>
        </div>

        {project.post_orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-purple-200 bg-white/70 p-6 text-center text-xs text-slate-500">
            No active post-handover orders. Need copy tweaks, new landing pages, or an e-commerce integration? Click &quot;Ask for Changes or Add-ons&quot; above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            {project.post_orders.map((order) => (
              <div
                key={order.id}
                className="p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                        order.type === "addon"
                          ? "bg-purple-100 text-purple-900"
                          : "bg-sky-100 text-sky-900"
                      }`}
                    >
                      {order.type === "addon" ? "⚡ New Feature Add-on" : "✍️ Scope Revisions"}
                    </span>
                    <span className="font-bold text-xs text-slate-900">
                      {order.title}
                    </span>
                  </div>
                  {order.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {order.description}
                    </p>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                    Created {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {order.quoted_price && (
                    <span className="text-xs font-mono font-bold text-slate-800">
                      Est. +{project.symbol}{order.quoted_price.toLocaleString()}
                    </span>
                  )}
                  <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1 text-[10px] font-black uppercase">
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Ask for Changes or Add-on */}
      {showOrderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowOrderModal(false);
          }}
        >
          <div className="relative w-full max-w-lg rounded-[2.2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowOrderModal(false)}
              className="absolute right-5 top-5 h-8 w-8 rounded-full border border-slate-200 text-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              ×
            </button>

            <span className="text-[10px] font-black uppercase tracking-widest text-purple-700">
              New Commission Order
            </span>
            <h3 className="text-2xl font-bold text-[#0a192f] mt-1 mb-1">
              Ask for Changes or Add-ons
            </h3>
            <p className="text-xs text-slate-600 mb-5">
              Submit your scope requirements. Tanie will quote an exact flat-rate add-on fee and milestone delivery window.
            </p>

            <form onSubmit={handleCreatePostOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Order Category:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType("changes")}
                    className={`rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
                      orderType === "changes"
                        ? "border-sky-500 bg-sky-50 text-sky-950 ring-1 ring-sky-300"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    ✍️ Scope Changes / Revisions
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("addon")}
                    className={`rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
                      orderType === "addon"
                        ? "border-purple-500 bg-purple-50 text-purple-950 ring-1 ring-purple-300"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    ⚡ New Feature Add-on
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title of Change / Feature:
                </label>
                <input
                  type="text"
                  required
                  value={orderTitle}
                  onChange={(e) => setOrderTitle(e.target.value)}
                  placeholder="e.g. Add Razorpay payment gateway, update portfolio copy"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Scope Details &amp; Specifics:
                </label>
                <textarea
                  rows={3}
                  required
                  value={orderDesc}
                  onChange={(e) => setOrderDesc(e.target.value)}
                  placeholder="Describe the changes or feature requirement in detail..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0a192f] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-800 transition cursor-pointer shadow-md"
                >
                  Submit Order →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
