"use client";

import { useState } from "react";
import { ClientHubProject } from "./types";
import ClientHubHero from "./ClientHubHero";
import CalculatedPricesTile from "./CalculatedPricesTile";
import BookingContractTile from "./BookingContractTile";
import AssetManagerTile from "./AssetManagerTile";
import DeliverablesProgressTile from "./DeliverablesProgressTile";
import PaymentAndInvoicesTile from "./PaymentAndInvoicesTile";
import HandoverAndAddonsTile from "./HandoverAndAddonsTile";
import SavedAestheticsTile from "./SavedAestheticsTile";

interface TabbedWorkspaceProps {
  project: ClientHubProject;
  onUpdateProject: (p: ClientHubProject) => void;
  onSignOut: () => void;
  scrollToSection: (id: string) => void;
}

const TABS = [
  { id: "booking",  label: "Booking",  icon: "📋" },
  { id: "pricing",  label: "Pricing",  icon: "💰" },
  { id: "assets",   label: "Assets",   icon: "📁" },
  { id: "progress", label: "Progress", icon: "📊" },
  { id: "invoices", label: "Invoices", icon: "🧾" },
  { id: "style",    label: "Style",    icon: "🎨" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TabbedWorkspace({
  project,
  onUpdateProject,
  onSignOut,
}: TabbedWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<TabId>("booking");

  return (
    <div className="animate-fadeIn space-y-6">
      {/* HERO */}
      <ClientHubHero
        project={project}
        onScrollToSection={(id) => {
          const map: Record<string, TabId> = {
            "booking-contract-tile": "booking",
            "calculated-prices-tile": "pricing",
            "asset-manager-tile": "assets",
            "deliverables-progress-tile": "progress",
            "payments-invoices-tile": "invoices",
          };
          if (map[id]) setActiveTab(map[id]);
        }}
        onSignOut={onSignOut}
      />

      {/* TAB BAR */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-sky-200/80 bg-white/70 p-1.5 backdrop-blur-sm">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#0a192f] text-white shadow-md"
                : "text-slate-600 hover:bg-sky-100/80 hover:text-slate-900"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB PANELS */}
      <div key={activeTab} className="animate-fadeIn">
        {activeTab === "booking" && (
          <BookingContractTile
            project={project}
            onUpdateProject={onUpdateProject}
            onScrollToSection={(id) => {
              const map: Record<string, TabId> = {
                "calculated-prices-tile": "pricing",
                "payments-invoices-tile": "invoices",
              };
              if (map[id]) setActiveTab(map[id]);
            }}
          />
        )}
        {activeTab === "pricing" && (
          <CalculatedPricesTile
            quote={project.calculated_quote}
            onProceedToBooking={() => setActiveTab("booking")}
          />
        )}
        {activeTab === "assets" && (
          <AssetManagerTile project={project} onUpdateProject={onUpdateProject} />
        )}
        {activeTab === "progress" && (
          <DeliverablesProgressTile
            project={project}
            onScrollToSection={(id) => {
              if (id === "payments-invoices-tile") setActiveTab("invoices");
            }}
          />
        )}
        {activeTab === "invoices" && (
          <div className="space-y-6">
            <PaymentAndInvoicesTile
              project={project}
              onUpdateProject={onUpdateProject}
              onScrollToSection={() => {}}
            />
            <HandoverAndAddonsTile
              project={project}
              onUpdateProject={onUpdateProject}
              onScrollToSection={() => {}}
            />
          </div>
        )}
        {activeTab === "style" && (
          <SavedAestheticsTile project={project} onUpdateProject={onUpdateProject} />
        )}
      </div>
    </div>
  );
}
