"use client";

import React, { useState } from "react";
import { ClientHubProject, InvoiceData } from "./types";
import InvoiceModal from "./InvoiceModal";

interface PaymentAndInvoicesTileProps {
  project: ClientHubProject;
  onUpdateProject: (updated: ClientHubProject) => void;
  onScrollToSection: (sectionId: string) => void;
}

export default function PaymentAndInvoicesTile({
  project,
  onUpdateProject,
  onScrollToSection,
}: PaymentAndInvoicesTileProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [isProcessingFinal, setIsProcessingFinal] = useState(false);

  const isAdvancePaid = project.advance_paid;
  const isCompletionPaid = project.completion_paid;
  const totalAgreed = project.admin_agreed_price || (project.calculated_quote?.calculated_price ?? 2800);
  const advanceAmt = project.admin_advance_required || Math.round(totalAgreed * 0.5);
  const completionBalance = project.admin_completion_balance ?? (totalAgreed - advanceAmt);

  // Handle paying final completion balance
  const handlePayCompletionBalance = () => {
    setIsProcessingFinal(true);

    const invoiceNum = `FIN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentId = `pay_fin_${Date.now()}`;

    const completionInvoice: InvoiceData = {
      id: `inv-fin-${Date.now()}`,
      invoice_number: invoiceNum,
      type: "completion",
      project_title: project.title,
      client_name: project.client_name,
      client_email: project.client_email,
      company_name: project.company_name,
      amount: completionBalance,
      currency: project.currency,
      symbol: project.symbol,
      issued_at: new Date().toISOString(),
      status: "paid",
      payment_method: "Razorpay / Bank Transfer Verified",
      payment_id: paymentId,
      breakdown: [
        {
          description: `Final Milestone Completion Balance for ${project.title}`,
          amount: completionBalance,
        },
      ],
    };

    const updated: ClientHubProject = {
      ...project,
      completion_paid: true,
      completion_paid_at: new Date().toISOString(),
      completion_payment_id: paymentId,
      booking_status: "handed_over",
      status: "Handed Over",
      progress_percent: 100,
      invoices: [completionInvoice, ...project.invoices],
    };

    onUpdateProject(updated);
    setIsProcessingFinal(false);
    onScrollToSection("handover-addons-tile");
  };

  return (
    <div
      id="payments-invoices-tile"
      className="rounded-[2.4rem] border border-sky-300/80 bg-white/95 p-6 sm:p-10 shadow-lg backdrop-blur-xl space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-900 bg-sky-100 border border-sky-200 px-3 py-1 rounded-full">
              Financial Accounting & Invoices
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Dual-Invoice Protection
            </span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[#0a192f]">
            Payments, Balances & Official Invoices
          </h2>
          <p className="mt-0.5 text-xs text-slate-600 max-w-2xl">
            Track your financial milestones. Invoices are automatically generated on both advance payment and completion payment.
          </p>
        </div>
      </div>

      {/* Financial Milestone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Price */}
        <div className="rounded-2xl border border-sky-200/90 bg-sky-50/60 p-5 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Total Commission Fee
          </span>
          <div className="mt-1 text-2xl sm:text-3xl font-black text-[#0a192f]">
            {project.symbol}{totalAgreed.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Contract price set by Tanie
          </p>
        </div>

        {/* Advance Deposit */}
        <div className="rounded-2xl border border-sky-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              50% Advance Deposit
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                isAdvancePaid
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {isAdvancePaid ? "✓ Settled" : "Pending"}
            </span>
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-black text-[#0a192f]">
            {project.symbol}{advanceAmt.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {isAdvancePaid
              ? `Paid on ${new Date(project.advance_paid_at || Date.now()).toLocaleDateString()}`
              : "Required to lock sprint kickoff"}
          </p>
        </div>

        {/* Completion Balance */}
        <div className="rounded-2xl border border-sky-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Completion Balance
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                isCompletionPaid
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-blue-100 text-blue-900"
              }`}
            >
              {isCompletionPaid ? "✓ Fully Settled" : "Pay Whenever Ready"}
            </span>
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-black text-[#0a192f]">
            {project.symbol}{completionBalance.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {isCompletionPaid
              ? `Settled on ${new Date(project.completion_paid_at || Date.now()).toLocaleDateString()}`
              : "Set by admin; payable whenever ready to release files"}
          </p>
        </div>
      </div>

      {/* Completion Payment Call to Action */}
      {isAdvancePaid && !isCompletionPaid && (
        <div className="rounded-3xl border border-sky-300/90 bg-gradient-to-r from-sky-50 via-white to-indigo-50/70 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-900 bg-sky-200/70 px-2.5 py-0.5 rounded-full">
              Final Milestone Settlement
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Ready to Complete Project & Release Files?
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 max-w-xl leading-relaxed">
              Once you pay the remaining completion balance of {project.symbol}{completionBalance.toLocaleString()}, your final Completion Invoice will be generated, your project status will update to &quot;Handed Over&quot;, and your production code &amp; credentials will be unlocked.
            </p>
          </div>

          <button
            type="button"
            disabled={isProcessingFinal}
            onClick={handlePayCompletionBalance}
            className="shrink-0 rounded-2xl bg-[#0a192f] px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:bg-slate-800 transition cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <span>
              {isProcessingFinal
                ? "Processing Settlement..."
                : `Pay Completion Balance (${project.symbol}${completionBalance.toLocaleString()}) →`}
            </span>
            <span>💳</span>
          </button>
        </div>
      )}

      {/* Invoices List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Generated Tax Invoices ({project.invoices.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Available for immediate print and PDF export
          </span>
        </div>

        {project.invoices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-500">
            No invoices generated yet. Your Advance Invoice will appear here immediately after advance deposit payment.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            {project.invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-sm">
                    🧾
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-xs text-slate-900">
                        #{inv.invoice_number}
                      </span>
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.2 text-[10px] font-black uppercase">
                        {inv.type === "advance" ? "Advance Deposit" : "Completion Settlement"}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Issued {new Date(inv.issued_at).toLocaleDateString()} · Transaction: {inv.payment_id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="font-mono font-black text-sm text-[#0a192f]">
                    {inv.symbol}{inv.amount.toLocaleString()} {inv.currency}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(inv)}
                    className="rounded-xl border border-sky-300/80 bg-white px-3.5 py-1.5 text-xs font-bold text-sky-950 hover:bg-sky-50 transition cursor-pointer shadow-xs"
                  >
                    View / Print Invoice ↗
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Modal Preview */}
      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}
