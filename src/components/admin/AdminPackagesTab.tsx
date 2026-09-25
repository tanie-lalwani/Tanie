"use client";

import React from "react";
import Link from "next/link";
import { type WebsitePackage, saveWebsitePackage } from "@/lib/portalServices";

interface AdminPackagesTabProps {
  packages: WebsitePackage[];
  setPackages: React.Dispatch<React.SetStateAction<WebsitePackage[]>>;
}

export default function AdminPackagesTab({ packages, setPackages }: AdminPackagesTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
        <div>
          <h3 className="text-xl font-bold text-white">Website Packages & Pricing Tiers</h3>
          <p className="text-xs text-slate-400">
            Configure your public offerings, timelines, deliverables, and add-on pricing.
          </p>
        </div>
        <Link
          href="/pricing"
          target="_blank"
          className="rounded-full border border-sky-400/40 bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-500/30"
        >
          View Public Pricing Page ↗
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white">{pkg.name}</h4>
                {pkg.badge && (
                  <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-400/30">
                    {pkg.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">{pkg.tagline}</p>

              <div className="my-4 font-mono">
                <span className="text-2xl font-black text-white">
                  ${pkg.price_usd.toLocaleString("en-US")}
                </span>{" "}
                <span className="text-xs text-slate-400">USD / ₹{pkg.price_inr.toLocaleString("en-IN")}</span>
              </div>

              <div className="text-xs text-sky-300 mb-3 font-semibold">
                Turnaround: {pkg.turnaround_weeks}
              </div>

              <ul className="space-y-1.5 text-xs text-slate-300">
                {pkg.features?.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-sky-400">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-white/8 pt-4">
              <button
                type="button"
                onClick={() => {
                  const newPrice = prompt("Enter new price in USD:", pkg.price_usd.toString());
                  if (newPrice && !isNaN(Number(newPrice))) {
                    const updated = { ...pkg, price_usd: Number(newPrice) };
                    saveWebsitePackage(updated);
                    setPackages((prev) => prev.map((p) => (p.id === pkg.id ? updated : p)));
                  }
                }}
                className="w-full rounded-xl bg-slate-900 py-2 text-center text-xs font-semibold text-slate-300 border border-white/10 hover:bg-slate-800 hover:text-white"
              >
                Quick Edit Price
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
