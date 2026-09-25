"use client";

import React from "react";
import { InvoiceData } from "./types";

interface InvoiceModalProps {
  invoice: InvoiceData | null;
  onClose: () => void;
}

export default function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
  if (!invoice) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-[2.2rem] border border-black/10 bg-white p-6 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 h-8 w-8 rounded-full border border-slate-200 text-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
        >
          ×
        </button>

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
          <div>
            <div className="text-xl font-black text-[#0a192f]">
              Tanie Lalwani Studio
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Bespoke Web Engineering & Digital Architecture
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              tanielalwani.work@gmail.com · tanie.me
            </div>
          </div>

          <div className="sm:text-right">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-800 mb-1">
              ✓ Paid Receipt
            </span>
            <div className="text-base font-black text-slate-900 font-mono">
              #{invoice.invoice_number}
            </div>
            <div className="text-xs text-slate-500">
              Date: {new Date(invoice.issued_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-200 mb-6 text-xs">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
              Billed To
            </span>
            <div className="font-bold text-slate-900 text-sm">
              {invoice.client_name}
            </div>
            <div className="text-slate-600 font-mono">{invoice.client_email}</div>
            {invoice.company_name && (
              <div className="text-slate-600">{invoice.company_name}</div>
            )}
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
              Payment Information
            </span>
            <div className="text-slate-800">
              <span className="font-semibold">Type:</span>{" "}
              {invoice.type === "advance" ? "50% Advance Booking Deposit" : "Final Completion Settlement"}
            </div>
            <div className="text-slate-800">
              <span className="font-semibold">Method:</span> {invoice.payment_method}
            </div>
            <div className="text-slate-500 font-mono text-[11px]">
              ID: {invoice.payment_id}
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden mb-6 text-xs">
          <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-700 flex justify-between">
            <span>Description</span>
            <span>Amount</span>
          </div>
          <div className="divide-y divide-slate-100 bg-white">
            {invoice.breakdown.map((item, idx) => (
              <div key={idx} className="px-4 py-3 flex justify-between">
                <span className="text-slate-800 font-medium">{item.description}</span>
                <span className="font-mono font-bold text-slate-900">
                  {invoice.symbol}{item.amount.toLocaleString()} {invoice.currency}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 px-4 py-3 flex justify-between font-black text-sm text-[#0a192f] border-t border-slate-200">
            <span>Total Paid (Settled)</span>
            <span>
              {invoice.symbol}{invoice.amount.toLocaleString()} {invoice.currency}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <span className="text-[11px] text-slate-400 font-mono">
            Cryptographically stamped · Official Studio Tax Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer shadow-xs"
            >
              Print / Save PDF 🖨️
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#0a192f] px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
