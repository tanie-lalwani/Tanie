"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeTabItem = TABS.find((t) => t.id === activeTab) || TABS[0];
  const userInitial = (project.client_name || project.client_email || "C")[0].toUpperCase();

  const getStatusBadge = () => {
    switch (project.booking_status) {
      case "handed_over":
        return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Handed Over</span>;
      case "booked_advance_paid":
        return <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">Booked & Active</span>;
      case "contract_ready":
        return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">Contract Ready</span>;
      case "requested":
        return <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">Requested</span>;
      default:
        return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">Reserve / Not Booked</span>;
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      {/* 1. PROGRESS LINE (out of white background) */}
      <ClientHubHero project={project} />

      {/* 2. NAVIGATION BAR (Tabs + User Icon / Hamburger on mobile) */}
      <div className="relative">
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-sky-200/80 bg-white/80 p-1.5 backdrop-blur-md shadow-xs">
          
          {/* Desktop Tabs */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#0a192f] text-white shadow-sm"
                    : "text-slate-600 hover:bg-sky-100/80 hover:text-slate-900"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="relative flex md:hidden" ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50/70 px-3 py-2 text-xs font-bold text-[#0a192f] hover:bg-sky-100/80 transition cursor-pointer"
            >
              <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
              <span>{activeTabItem.icon}</span>
              <span>{activeTabItem.label}</span>
              <svg className={`w-3 h-3 text-slate-500 transition-transform ${isMobileMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Mobile Tabs Dropdown */}
            {isMobileMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl border border-sky-200 bg-white p-2 shadow-xl z-50 animate-fadeIn">
                <div className="space-y-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-left transition cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-[#0a192f] text-white"
                          : "text-slate-700 hover:bg-sky-50"
                      }`}
                    >
                      <span className="text-sm">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: User Icon Button */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 rounded-xl border border-sky-200/80 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-sky-50 transition cursor-pointer"
              title="Account Details"
            >
              <div className="w-6 h-6 rounded-full bg-[#0a192f] text-white flex items-center justify-center text-[11px] font-black shrink-0">
                {userInitial}
              </div>
              <span className="hidden sm:inline-block max-w-[120px] truncate text-slate-700 text-xs font-semibold">
                {project.client_name || project.client_email}
              </span>
              <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Popover Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-sky-200 bg-white p-4 shadow-2xl z-50 animate-fadeIn">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-[#0a192f] text-white flex items-center justify-center text-sm font-black shrink-0">
                    {userInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    {project.client_name && (
                      <p className="text-xs font-bold text-[#0a192f] truncate">
                        {project.client_name}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 truncate">
                      {project.client_email}
                    </p>
                  </div>
                </div>

                <div className="py-3 border-b border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Sprint Status:</span>
                    {getStatusBadge()}
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <Link
                    href="/pricing"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 transition !no-underline"
                  >
                    <span>📊</span>
                    <span>Open Pricing Calculator</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. ACTIVE TAB PANEL */}
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
