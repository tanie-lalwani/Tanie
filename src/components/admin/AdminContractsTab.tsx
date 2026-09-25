"use client";

import React from "react";
import { type EContract } from "@/lib/portalServices";

interface AdminContractsTabProps {
  contracts: EContract[];
}

export default function AdminContractsTab({ contracts }: AdminContractsTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
        <h3 className="text-xl font-bold text-white">E-Contracts & Digital Signatures</h3>
        <p className="text-xs text-slate-400">
          Verify legal execution timestamps, IP addresses, and inspect handwritten signatures.
        </p>
      </div>

      <div className="space-y-4">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl shadow-xl flex flex-wrap items-start justify-between gap-6"
          >
            <div className="max-w-xl">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${
                    contract.status === "signed"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {contract.status === "signed" ? "Signed ✓" : "Pending Signature"}
                </span>
                <span className="font-mono text-xs text-slate-500">ID: {contract.id}</span>
              </div>

              <h4 className="mt-2 text-lg font-bold text-white">
                {contract.package_name} — {contract.client_name}
              </h4>
              <p className="text-xs text-slate-400">{contract.client_email}</p>

              <p className="mt-3 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-white/6 leading-relaxed">
                {contract.scope_summary}
              </p>

              <div className="mt-3 font-mono text-xs text-sky-300 font-bold">
                Amount: ${contract.total_amount_usd.toLocaleString("en-US")} USD
              </div>
            </div>

            {/* Signature Inspection Box */}
            <div className="min-w-[240px] rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-right">
              {contract.status === "signed" ? (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block">
                    Verified Signature
                  </span>
                  {contract.signature_url && (
                    <div className="my-2 rounded-xl bg-slate-950 p-2 border border-white/10 flex justify-center">
                      <img
                        src={contract.signature_url}
                        alt="Client Signature"
                        className="h-14 max-w-[180px] object-contain"
                      />
                    </div>
                  )}
                  <div className="text-xs font-bold text-white">{contract.signature_name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Signed: {new Date(contract.signed_at || "").toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">{contract.signed_ip}</div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  Awaiting client digital signature
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
