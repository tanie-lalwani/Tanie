"use client";

import React, { useState, useMemo } from "react";
import { useGeoPricing } from "@/context/GeoPricingContext";
import MarketRegionSelector from "@/components/ui/MarketRegionSelector";

export interface MicroFeatureItem {
  id: string;
  name: string;
  detail: string;
  tag?: string;
}

export interface MacroFeatureItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  isEssential: boolean; // true = locked, cannot be removed; false = optional, client can cut down price
  priceInr: number;
  priceUsd: number;
  microFeatures: MicroFeatureItem[];
}

export interface PackageBreakdownDef {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  basePriceInr: number;
  basePriceUsd: number;
  turnaround: string;
  accentGradient: string;
  macroFeatures: MacroFeatureItem[];
}

export const PACKAGE_BREAKDOWN_DATA: PackageBreakdownDef[] = [
  {
    id: "luxury-landing-sprint",
    name: "Luxury Landing Sprint (Base Foundation)",
    badge: "Core Foundation",
    tagline: "Ultra-fast Next.js architecture, bespoke luxury typography, lead capture & 95+ Lighthouse speed.",
    basePriceInr: 4999,
    basePriceUsd: 99,
    turnaround: "5-7 Days",
    accentGradient: "from-sky-500/20 via-blue-500/10 to-indigo-500/20",
    macroFeatures: [
      {
        id: "ls_macro_core_arch",
        name: "Core Responsive Architecture & Luxury Layout",
        category: "Architecture & Performance",
        icon: "🏛️",
        description: "Mobile-first responsive layout with server-rendered Next.js App Router DOM, zero layout shift, and Vercel edge deployment.",
        isEssential: true,
        priceInr: 1500,
        priceUsd: 30,
        microFeatures: [
          { id: "ls_micro_1", name: "Bespoke Mobile, Tablet & 4K Breakpoints", detail: "Tailored viewport layouts with precision padding for phones, tablets, and ultra-wide screens.", tag: "Responsive" },
          { id: "ls_micro_2", name: "Next.js App Router SSR DOM", detail: "Static and server-rendered hydration eliminating content flash and maximizing SEO visibility.", tag: "Engine" },
          { id: "ls_micro_3", name: "Edge CDN Global Caching", detail: "Sub-100ms global static asset delivery via Vercel & Cloudflare Edge network.", tag: "Speed" },
          { id: "ls_micro_4", name: "Strict SSL / TLS & Automated DNS Setup", detail: "Production HTTPS certificate provisioning with custom domain DNS record verification.", tag: "Security" }
        ]
      },
      {
        id: "ls_macro_motion",
        name: "Typography, Fluid Motion & Aesthetics",
        category: "Visual Design & UX",
        icon: "✨",
        description: "Kinetic typography, smooth momentum scrolling with Lenis, and subtle micro-interactions that communicate luxury.",
        isEssential: true,
        priceInr: 1000,
        priceUsd: 20,
        microFeatures: [
          { id: "ls_micro_5", name: "Curated Google / Typekit Font Pairings", detail: "Editorial typographic hierarchy with zero FOIT (flash of invisible text) preloads.", tag: "Typography" },
          { id: "ls_micro_6", name: "Smooth Lenis Momentum Scroll", detail: "Hardware-accelerated inertia scroll preventing jittery trackpad or wheel movement.", tag: "Motion" },
          { id: "ls_micro_7", name: "IntersectionObserver Reveal Animations", detail: "Scroll-triggered staggered text reveals and card fades without CPU overhead.", tag: "Animation" },
          { id: "ls_micro_8", name: "Magnetic Button Pull & Cursor Physics", detail: "Tactile spring physics on primary CTA buttons for elevated interactive engagement.", tag: "Micro-UX" }
        ]
      },
      {
        id: "ls_macro_conversion",
        name: "Lead Capture & Conversion System",
        category: "Conversion Infrastructure",
        icon: "🎯",
        description: "High-converting inquiry forms with real-time validation, instant email alerts to your inbox, and direct WhatsApp routing.",
        isEssential: true,
        priceInr: 800,
        priceUsd: 16,
        microFeatures: [
          { id: "ls_micro_9", name: "Asynchronous Contact Form with Client Validation", detail: "Frictionless form with inline error prevention and zero-page-reload submission.", tag: "Forms" },
          { id: "ls_micro_10", name: "Instant Email Dispatcher to Business Owner", detail: "Automated Resend / SendGrid notification delivering full lead details to your inbox in 2 seconds.", tag: "Alerts" },
          { id: "ls_micro_11", name: "WhatsApp Direct Floating Action Button", detail: "One-tap pre-filled chat link opening WhatsApp with your pre-set greeting message.", tag: "Messaging" },
          { id: "ls_micro_12", name: "Custom Thank-You State & Lead Confirmation", detail: "Branded interactive confirmation toast reassuring prospects their inquiry was safely received.", tag: "Conversion" }
        ]
      },
      {
        id: "ls_macro_accessibility",
        name: "Accessibility & Inclusive Design",
        category: "Usability & Compliance",
        icon: "♿",
        description: "Inclusive design accommodating all users with multi-language switching, theme toggles, font scaling, and screen-reader compliance.",
        isEssential: false,
        priceInr: 600,
        priceUsd: 12,
        microFeatures: [
          { id: "ls_micro_13", name: "Multi-Language Localization Framework (i18n)", detail: "Language switcher allowing international visitors to toggle between languages with URL persistence.", tag: "Language" },
          { id: "ls_micro_14", name: "Dark / Light Mode Aesthetic Theme Switcher", detail: "Smooth color transition toggle with system preference auto-detection and localStorage save.", tag: "Theme" },
          { id: "ls_micro_15", name: "Dynamic Fluid Typography Scaling", detail: "Client font-size adjustment controls (+A / -A) for effortless reading without breaking layout.", tag: "Font" },
          { id: "ls_micro_16", name: "WCAG 2.1 AAA Screen Reader Landmarks", detail: "Semantic ARIA roles, skip-to-content links, and focus rings for complete keyboard accessibility.", tag: "Compliance" },
          { id: "ls_micro_17", name: "Reduced Motion Mode", detail: "Automatically disables motion effects when visitor has OS 'prefers-reduced-motion' enabled.", tag: "Accessibility" }
        ]
      },
      {
        id: "ls_macro_seo",
        name: "SEO, Meta Architecture & Social Sharing",
        category: "Organic Discovery",
        icon: "🔍",
        description: "Complete search engine optimization with OpenGraph preview cards, automated XML sitemaps, and rich schema markup.",
        isEssential: false,
        priceInr: 600,
        priceUsd: 12,
        microFeatures: [
          { id: "ls_micro_18", name: "OpenGraph & Twitter Card Dynamic Previews", detail: "High-res branded card previews when shared on WhatsApp, iMessage, Twitter, and LinkedIn.", tag: "Social" },
          { id: "ls_micro_19", name: "Automated XML Sitemap & Robots.txt", detail: "Self-updating sitemap indexing all canonical routes for Google Search Console crawlers.", tag: "Indexing" },
          { id: "ls_micro_20", name: "Organization JSON-LD Rich Schema", detail: "Structured data telling Google your business name, logo, phone, address, and operating hours.", tag: "Schema" },
          { id: "ls_micro_21", name: "Semantic Heading H1-H6 Hierarchy", detail: "Strict single-H1 semantic structure with keyword-optimized section hierarchy and image alt tags.", tag: "On-Page" }
        ]
      },
      {
        id: "ls_macro_compliance",
        name: "Compliance & Visitor Utilities",
        category: "Trust & Legal",
        icon: "🛡️",
        description: "GDPR/CCPA cookie consent management, sticky scroll-to-top buttons, and smart clipboard copy interactions.",
        isEssential: false,
        priceInr: 499,
        priceUsd: 9,
        microFeatures: [
          { id: "ls_micro_22", name: "GDPR & CCPA Glassmorphic Cookie Consent Banner", detail: "Polished banner with granular Accept / Reject / Preferences options and consent storage.", tag: "Privacy" },
          { id: "ls_micro_23", name: "Sticky Scroll-to-Top Floating Button", detail: "Appears smoothly after 400px of scrolling with dynamic circular scroll-depth progress ring.", tag: "Navigation" },
          { id: "ls_micro_24", name: "Smart Copy-to-Clipboard Interactions", detail: "Clicking your email or phone number copies it instantly with a tactile 'Copied!' tooltip.", tag: "Micro-UX" }
        ]
      }
    ]
  },
  {
    id: "growth-marketing-campaigns",
    name: "BOFU Website Marketing & Sources Package",
    badge: "High Conversion",
    tagline: "Turn paid ads and social traffic into immediate revenue with 1-click checkouts, urgency timers, and UTM attribution.",
    basePriceInr: 19999,
    basePriceUsd: 499,
    turnaround: "2-3 Weeks",
    accentGradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
    macroFeatures: [
      {
        id: "gm_macro_foundation",
        name: "Luxury Landing Sprint Foundation (Included)",
        category: "Base Architecture",
        icon: "🏛️",
        description: "Includes the entire Luxury Landing Sprint foundation (₹4,999 value) built directly under your marketing funnels.",
        isEssential: true,
        priceInr: 4999,
        priceUsd: 99,
        microFeatures: [
          { id: "gm_micro_0a", name: "Complete Next.js App Router Architecture", detail: "Full SSR foundation with edge hosting and CDN delivery.", tag: "Core" },
          { id: "gm_micro_0b", name: "Responsive Layout & Typography System", detail: "Curated typography with 95+ Lighthouse speed benchmarks.", tag: "Core" },
          { id: "gm_micro_0c", name: "Lead Capture & Contact Engine", detail: "Asynchronous forms with instant notifications to owner.", tag: "Core" }
        ]
      },
      {
        id: "gm_macro_checkout",
        name: "Frictionless 1-Click Express Checkout & Payments",
        category: "Revenue & Checkout",
        icon: "💳",
        description: "Zero-friction single-page checkout supporting Apple Pay, Google Pay, UPI, and credit cards with instant order fulfillment.",
        isEssential: true,
        priceInr: 3500,
        priceUsd: 90,
        microFeatures: [
          { id: "gm_micro_1", name: "Multi-Gateway Checkout (Apple Pay, Google Pay, Cards)", detail: "Stripe & Razorpay integrated single-page checkout with native mobile wallet buttons.", tag: "Payment" },
          { id: "gm_micro_2", name: "Dynamic Tax & Discount Coupon Engine", detail: "Real-time promo code validator with automated percent or flat discount calculation.", tag: "Promo" },
          { id: "gm_micro_3", name: "Abandoned Checkout Recovery Hook", detail: "Captures partial email and cart contents to trigger automated abandoned cart recovery.", tag: "Recovery" },
          { id: "gm_micro_4", name: "Instant Digital Fulfillment Handshake", detail: "Immediate redirect to order confirmation with downloadable receipts and delivery tracking.", tag: "Order" }
        ]
      },
      {
        id: "gm_macro_urgency",
        name: "High-Conversion Urgency & Scarcity Mechanics",
        category: "Psychological Triggers",
        icon: "⚡",
        description: "Dynamic countdown timers, top announcement bars, and stock meters that compel visitors to take action immediately.",
        isEssential: true,
        priceInr: 3000,
        priceUsd: 80,
        microFeatures: [
          { id: "gm_micro_5", name: "Real-Time Flash Sale Countdown Clocks", detail: "Localized drop timers showing hours, minutes, and seconds remaining in flash campaign.", tag: "Urgency" },
          { id: "gm_micro_6", name: "Sticky Offer-First Announcement Bar", detail: "Top header banner with 1-click coupon code copy and free shipping progress meter.", tag: "Banner" },
          { id: "gm_micro_7", name: "Dynamic Low-Stock Inventory Indicators", detail: "Urgency badges ('Only 3 left in stock!') that dynamically deplete based on purchase volume.", tag: "Scarcity" },
          { id: "gm_micro_8", name: "Live Social-Proof Purchase Toasts", detail: "Subtle popups showing recent orders from real cities to validate buyer trust.", tag: "Social Proof" }
        ]
      },
      {
        id: "gm_macro_attribution",
        name: "Full-Spectrum UTM Multi-Source Attribution",
        category: "Analytics & Telemetry",
        icon: "📊",
        description: "Captures source, medium, and campaign parameters with every order and passes server-side conversion pixels to Meta and Google.",
        isEssential: true,
        priceInr: 3000,
        priceUsd: 80,
        microFeatures: [
          { id: "gm_micro_9", name: "URL Parameter Parser (UTM Source, Medium, Campaign)", detail: "Automatically extracts marketing query params and persists them across the entire visitor session.", tag: "Attribution" },
          { id: "gm_micro_10", name: "Persistent 30-Day Cookie Source Binding", detail: "Binds origin campaign to checkout payload even if visitor returns weeks later.", tag: "Tracking" },
          { id: "gm_micro_11", name: "Meta Pixel & CAPI Server-Side Telemetry", detail: "Direct Graph API server-side event transmission bypassing ad blockers for accurate ROAS.", tag: "Pixels" },
          { id: "gm_micro_12", name: "GA4 & Google Tag Manager DataLayer Events", detail: "Structured e-commerce events (view_item, begin_checkout, purchase) pushed to DataLayer.", tag: "Analytics" }
        ]
      },
      {
        id: "gm_macro_ugc",
        name: "Social Proof & UGC Video Review Wall",
        category: "Social Trust",
        icon: "📹",
        description: "Mobile-optimized vertical TikTok / Reel video testimonials wall with customer star ratings and before/after comparisons.",
        isEssential: false,
        priceInr: 1500,
        priceUsd: 40,
        microFeatures: [
          { id: "gm_micro_13", name: "Vertical Reel/TikTok Video Player", detail: "Fast-loading muted vertical video player with tap-to-unmute and carousel sliding.", tag: "Video" },
          { id: "gm_micro_14", name: "Verified Customer Star Rating Filters", detail: "Breakdown of 5-star reviews with keyword filtering (Quality, Speed, Customer Service).", tag: "Reviews" },
          { id: "gm_micro_15", name: "Before & After Interactive Split Slider", detail: "Draggable divider showing transformative client results side-by-side.", tag: "Visual" }
        ]
      },
      {
        id: "gm_macro_comparison",
        name: "Interactive Product 360 & Comparison Matrix",
        category: "Product Presentation",
        icon: "🔄",
        description: "Interactive 4K multi-angle viewer and value-anchoring comparison table establishing your offering as superior to alternatives.",
        isEssential: false,
        priceInr: 1500,
        priceUsd: 40,
        microFeatures: [
          { id: "gm_micro_16", name: "4K Multi-Angle Product Zoomer", detail: "Drag-to-rotate multi-frame product viewer with high-resolution lens zoom on hover.", tag: "360 Viewer" },
          { id: "gm_micro_17", name: "Side-by-Side Value-Anchoring Matrix", detail: "Clear checkmark vs X comparison matrix highlighting your unique advantages over competitors.", tag: "Comparison" },
          { id: "gm_micro_18", name: "Live Variant & Material Switcher", detail: "Instant swap of product photos and pricing based on selected color or bundle size.", tag: "Variants" }
        ]
      },
      {
        id: "gm_macro_ai_concierge",
        name: "AI Sales Concierge Bot",
        category: "AI Sales Agent",
        icon: "🤖",
        description: "24/7 intelligent sales assistant that answers buyer questions, handles objections, and guides prospects directly to checkout.",
        isEssential: false,
        priceInr: 1500,
        priceUsd: 40,
        microFeatures: [
          { id: "gm_micro_19", name: "24/7 Context-Aware Sales Assistant", detail: "Trained on your specific product catalogs, FAQs, warranties, and pricing tiers.", tag: "AI Bot" },
          { id: "gm_micro_20", name: "Automated Objection Handling Engine", detail: "Pre-programmed objection handling for shipping times, refund guarantees, and sizing questions.", tag: "Closing" },
          { id: "gm_micro_21", name: "Direct In-Chat 1-Click Checkout Routing", detail: "Recommends relevant packages and generates a direct checkout link inside the conversation.", tag: "Sales" }
        ]
      },
      {
        id: "gm_macro_multilingual",
        name: "Multi-Lingual International Localization (i18n)",
        category: "Global Reach",
        icon: "🌍",
        description: "Language switcher supporting up to 3 global languages with localized currency and Right-to-Left (RTL) support.",
        isEssential: false,
        priceInr: 1000,
        priceUsd: 30,
        microFeatures: [
          { id: "gm_micro_22", name: "Multi-Language Header Switcher", detail: "Seamless toggle supporting English, Arabic, Spanish, or your chosen regional languages.", tag: "i18n" },
          { id: "gm_micro_23", name: "Right-to-Left (RTL) Mirroring Architecture", detail: "Complete layout mirroring support for Arabic and Urdu typography and navigation.", tag: "RTL" },
          { id: "gm_micro_24", name: "Localized Currency Formatting", detail: "Automatically presents figures in INR (₹), USD ($), EUR (€), or AED based on visitor country.", tag: "Currency" }
        ]
      }
    ]
  },
  {
    id: "booking-appointments-engine",
    name: "Smart Appointment & Booking Engine",
    badge: "Booking Suite",
    tagline: "Live slot picker, calendar sync, staff assignment, WhatsApp reminders & pre-payments.",
    basePriceInr: 19999,
    basePriceUsd: 499,
    turnaround: "2-3 Weeks",
    accentGradient: "from-blue-500/20 via-sky-500/10 to-teal-500/20",
    macroFeatures: [
      {
        id: "bk_macro_foundation",
        name: "Luxury Landing Sprint Foundation (Included)",
        category: "Base Architecture",
        icon: "🏛️",
        description: "Includes the entire Luxury Landing Sprint foundation (₹4,999 value) as the baseline for your booking portal.",
        isEssential: true,
        priceInr: 4999,
        priceUsd: 99,
        microFeatures: [
          { id: "bk_micro_0a", name: "Complete Next.js App Router Architecture", detail: "Full SSR foundation with edge hosting and CDN delivery.", tag: "Core" },
          { id: "bk_micro_0b", name: "Mobile Responsive Layout & Typography", detail: "Curated typography with 95+ Lighthouse speed benchmarks.", tag: "Core" }
        ]
      },
      {
        id: "bk_macro_slot_picker",
        name: "Interactive Live Slot Availability Engine",
        category: "Calendar Engine",
        icon: "📅",
        description: "Real-time calendar slot blocking with timezone auto-detection, custom meeting buffers, and operational hours.",
        isEssential: true,
        priceInr: 3500,
        priceUsd: 90,
        microFeatures: [
          { id: "bk_micro_1", name: "Interactive Calendar Date & Slot Grid", detail: "Live availability grid showing morning, afternoon, and evening booking slots.", tag: "Grid" },
          { id: "bk_micro_2", name: "Automatic Timezone Detection & Conversion", detail: "Converts meeting times to client's local timezone automatically to prevent confusion.", tag: "Timezone" },
          { id: "bk_micro_3", name: "Custom Meeting Buffers & Operating Hours", detail: "Configurable buffer gaps (e.g. 15 min cooldown) and holiday blackout dates.", tag: "Buffers" }
        ]
      },
      {
        id: "bk_macro_calendar_sync",
        name: "Bidirectional 2-Way Calendar Synchronization",
        category: "Calendar API",
        icon: "🔄",
        description: "Google Calendar and Outlook 2-way sync that automatically blocks booked slots and eliminates double-booking.",
        isEssential: true,
        priceInr: 3000,
        priceUsd: 80,
        microFeatures: [
          { id: "bk_micro_4", name: "Google Calendar 2-Way API Sync", detail: "Instantly adds bookings to your Google Calendar and blocks dates when you add personal events.", tag: "Google" },
          { id: "bk_micro_5", name: "Microsoft Outlook / Office 365 Sync", detail: "Synchronizes appointment events with enterprise Outlook calendars in real-time.", tag: "Outlook" },
          { id: "bk_micro_6", name: "Automated .ics Calendar File Attachments", detail: "Sends Apple / Google Calendar 1-tap add event links in confirmation messages.", tag: "iCal" }
        ]
      },
      {
        id: "bk_macro_reminders",
        name: "Automated WhatsApp & Email Reminders",
        category: "Notifications",
        icon: "📱",
        description: "Automated confirmation and 24h/2h reminder sequences that reduce appointment no-shows by up to 80%.",
        isEssential: true,
        priceInr: 2500,
        priceUsd: 70,
        microFeatures: [
          { id: "bk_micro_7", name: "Instant Confirmation Email & WhatsApp Dispatch", detail: "Sends calendar link and appointment details immediately upon slot selection.", tag: "Instant" },
          { id: "bk_micro_8", name: "24-Hour & 2-Hour Pre-Appointment Reminders", detail: "Automated reminders sent via WhatsApp Cloud API or Twilio SMS to prevent no-shows.", tag: "Reminders" },
          { id: "bk_micro_9", name: "1-Click Client Reschedule & Cancellation Links", detail: "Self-serve reschedule link freeing up staff from manual appointment coordination.", tag: "Self-Serve" }
        ]
      },
      {
        id: "bk_macro_payments",
        name: "Deposit & Session Pre-Payment Gateway",
        category: "Payments",
        icon: "💳",
        description: "Stripe and Razorpay integration requiring clients to pay a mandatory deposit or full fee before confirming.",
        isEssential: false,
        priceInr: 2500,
        priceUsd: 70,
        microFeatures: [
          { id: "bk_micro_10", name: "Mandatory Booking Deposit Checkout Step", detail: "Requires partial or full prepayment to hold the appointment slot on the calendar.", tag: "Deposit" },
          { id: "bk_micro_11", name: "Razorpay, UPI & Stripe Webhook Verification", detail: "Cryptographically verifies payment completion before confirming the calendar block.", tag: "Webhook" },
          { id: "bk_micro_12", name: "Automated GST / Tax Invoice Receipts", detail: "Generates digital PDF receipt with order number and tax breakdown automatically.", tag: "Invoice" }
        ]
      },
      {
        id: "bk_macro_qualification",
        name: "Pre-Appointment Qualification Questionnaire",
        category: "Intake",
        icon: "📋",
        description: "Multi-step intake questionnaire with file uploads ensuring you only spend time on qualified high-value appointments.",
        isEssential: false,
        priceInr: 1500,
        priceUsd: 40,
        microFeatures: [
          { id: "bk_micro_13", name: "Multi-Step Client Brief Questionnaire", detail: "Collects business budget, goals, medical history, or requirements before booking.", tag: "Form" },
          { id: "bk_micro_14", name: "Reference File & Document Uploads", detail: "Allows clients to attach floor plans, briefs, or medical scans directly into the booking.", tag: "Uploads" },
          { id: "bk_micro_15", name: "Conditional Branching Questions", detail: "Adapts follow-up questions based on the specific service or treatment selected.", tag: "Logic" }
        ]
      },
      {
        id: "bk_macro_multibranch",
        name: "Multi-Branch & Location Routing",
        category: "Location",
        icon: "🏢",
        description: "Routes appointments across up to 3 physical or virtual clinics/branches with independent calendars and staff mapping.",
        isEssential: false,
        priceInr: 2000,
        priceUsd: 50,
        microFeatures: [
          { id: "bk_micro_16", name: "Up to 3 Physical or Virtual Clinic Branches", detail: "Allows clients to select their nearest branch or virtual consultation option.", tag: "Branches" },
          { id: "bk_micro_17", name: "Branch-Specific Operating Hours & Holidays", detail: "Each location manages independent operating days, holidays, and available chairs.", tag: "Schedule" },
          { id: "bk_micro_18", name: "Doctor / Specialist Assignment per Branch", detail: "Filters available team members based on the selected clinic location.", tag: "Staff" }
        ]
      }
    ]
  },
  {
    id: "staff-team-management-portal",
    name: "Staff & Team Management Portal",
    badge: "Operations",
    tagline: "Digital staff directory, weekly shift scheduling, leave approvals, mobile clock-in & payroll summaries.",
    basePriceInr: 24999,
    basePriceUsd: 599,
    turnaround: "3-4 Weeks",
    accentGradient: "from-indigo-500/20 via-purple-500/10 to-pink-500/20",
    macroFeatures: [
      {
        id: "st_macro_foundation",
        name: "Luxury Landing Sprint Foundation (Included)",
        category: "Base Architecture",
        icon: "🏛️",
        description: "Includes the entire Luxury Landing Sprint foundation (₹4,999 value) with enterprise security and mobile responsiveness.",
        isEssential: true,
        priceInr: 4999,
        priceUsd: 99,
        microFeatures: [
          { id: "st_micro_0a", name: "Complete Next.js App Router Architecture", detail: "Full SSR foundation with edge hosting and CDN delivery.", tag: "Core" },
          { id: "st_micro_0b", name: "Mobile Responsive Layout & Typography", detail: "Curated typography with 95+ Lighthouse speed benchmarks.", tag: "Core" }
        ]
      },
      {
        id: "st_macro_directory",
        name: "Digital Staff Directory & Role-Based Access Control",
        category: "Team Directory",
        icon: "👥",
        description: "Searchable employee directory with department categorization, individual profiles, and granular role permissions.",
        isEssential: true,
        priceInr: 4500,
        priceUsd: 110,
        microFeatures: [
          { id: "st_micro_1", name: "Searchable Digital Staff Directory", detail: "Search team members by name, skill, department, or branch with contact info.", tag: "Directory" },
          { id: "st_micro_2", name: "Granular RBAC Security Roles", detail: "Dedicated permission tiers: Super Admin, Branch Manager, Staff, and Contractor.", tag: "RBAC" },
          { id: "st_micro_3", name: "Encrypted Employee Profile Space", detail: "Secure repository for staff certifications, emergency contacts, and contracts.", tag: "Security" }
        ]
      },
      {
        id: "st_macro_roster",
        name: "Interactive Weekly Shift Rostering & Scheduling",
        category: "Rostering",
        icon: "🗓️",
        description: "Drag-and-drop weekly shift calendar builder with automated conflict detection and 1-click roster broadcasting.",
        isEssential: true,
        priceInr: 4000,
        priceUsd: 100,
        microFeatures: [
          { id: "st_micro_4", name: "Weekly & Monthly Shift Calendar Builder", detail: "Visual timetable builder displaying morning, evening, and night duty coverage.", tag: "Calendar" },
          { id: "st_micro_5", name: "Automated Shift Conflict Detection", detail: "Flags double-booking, back-to-back shifts, or overtime violations automatically.", tag: "Safety" },
          { id: "st_micro_6", name: "1-Click Roster Publishing & SMS Alerts", detail: "Broadcasts updated schedules to all staff members with instant notifications.", tag: "Publish" }
        ]
      },
      {
        id: "st_macro_leave",
        name: "Time-Off & Leave Approval Engine",
        category: "Leave Management",
        icon: "🏖️",
        description: "Self-serve leave requests with 1-click manager approvals and automated roster blocking on approved time off.",
        isEssential: true,
        priceInr: 3500,
        priceUsd: 90,
        microFeatures: [
          { id: "st_micro_7", name: "Staff Self-Serve Time-Off Request Portal", detail: "Employees submit vacation, sick leave, or personal days with dates and notes.", tag: "Requests" },
          { id: "st_micro_8", name: "Manager 1-Click Approve / Decline Action", detail: "Managers review pending leave requests with team coverage visibility.", tag: "Approval" },
          { id: "st_micro_9", name: "Automated Roster Blocking on Leave", detail: "Prevents managers from assigning shifts to staff during approved leave days.", tag: "Auto-Block" }
        ]
      },
      {
        id: "st_macro_punchclock",
        name: "Mobile GPS Geolocation Punch Clock Timesheets",
        category: "Time Tracking",
        icon: "⏱️",
        description: "Mobile web punch clock with geofencing verification ensuring staff are physically on-site when clocking in.",
        isEssential: false,
        priceInr: 3000,
        priceUsd: 80,
        microFeatures: [
          { id: "st_micro_10", name: "Mobile Web Geofenced Clock-In Punch Clock", detail: "1-tap clock-in/out button running on smartphones with GPS coordinate logging.", tag: "Punch Clock" },
          { id: "st_micro_11", name: "Branch Geofence Radius Verification", detail: "Confirms employee is within 100 meters of the assigned clinic or office branch.", tag: "Geofence" },
          { id: "st_micro_12", name: "Break Time & Meal Tracking", detail: "Tracks lunch and rest breaks to compute accurate net productive work hours.", tag: "Breaks" }
        ]
      },
      {
        id: "st_macro_payroll",
        name: "1-Click Work-Hour Summary & Payroll CSV Export",
        category: "Payroll",
        icon: "💵",
        description: "Automated work-hour calculation with overtime tracking and 1-click export to Excel, QuickBooks, or Gusto.",
        isEssential: false,
        priceInr: 2500,
        priceUsd: 60,
        microFeatures: [
          { id: "st_micro_13", name: "Automated Regular & Overtime Hour Totals", detail: "Computes total billable hours per employee across weekly or monthly pay periods.", tag: "Totals" },
          { id: "st_micro_14", name: "1-Click Payroll CSV / Excel Export", detail: "Pre-formatted spreadsheet download ready for your accountant or payroll software.", tag: "Export" },
          { id: "st_micro_15", name: "Timesheet Dispute & Edit Audit Trail", detail: "Managers can adjust missed punches with complete audit timestamp logging.", tag: "Audit" }
        ]
      },
      {
        id: "st_macro_notices",
        name: "Internal Company Notice Board & Broadcasts",
        category: "Internal Comms",
        icon: "📢",
        description: "Digital bulletin board for company announcements, safety SOPs, and mandatory read-receipt tracking.",
        isEssential: false,
        priceInr: 2500,
        priceUsd: 60,
        microFeatures: [
          { id: "st_micro_16", name: "Priority Company Announcement Feed", detail: "Broadcasts operational changes, updates, and milestones to all employees.", tag: "Broadcast" },
          { id: "st_micro_17", name: "Mandatory Read-Receipt Tracking", detail: "Shows managers which staff members have read and acknowledged critical notices.", tag: "Receipts" },
          { id: "st_micro_18", name: "Pinned SOP & Safety Document Downloads", detail: "Central hub for downloadable clinic protocols, policy manuals, and guidelines.", tag: "Docs" }
        ]
      }
    ]
  },
  {
    id: "interactive-3d-experience",
    name: "3D Interactive & Brand Experience",
    badge: "3D & WebGL",
    tagline: "Bespoke Three.js viewport, scroll-choreographed camera timelines & interactive 3D product customization.",
    basePriceInr: 39999,
    basePriceUsd: 899,
    turnaround: "3-4 Weeks",
    accentGradient: "from-amber-500/20 via-orange-500/10 to-rose-500/20",
    macroFeatures: [
      {
        id: "td_macro_foundation",
        name: "Luxury Landing Sprint Foundation (Included)",
        category: "Base Architecture",
        icon: "🏛️",
        description: "Includes the entire Luxury Landing Sprint foundation (₹4,999 value) with high-speed Next.js edge deployment.",
        isEssential: true,
        priceInr: 4999,
        priceUsd: 99,
        microFeatures: [
          { id: "td_micro_0a", name: "Complete Next.js App Router Architecture", detail: "Full SSR foundation with edge hosting and CDN delivery.", tag: "Core" },
          { id: "td_micro_0b", name: "Mobile Responsive Layout & Typography", detail: "Curated typography with 95+ Lighthouse speed benchmarks.", tag: "Core" }
        ]
      },
      {
        id: "td_macro_webgl",
        name: "High-Performance WebGL / Three.js 3D Canvas",
        category: "3D Canvas Engine",
        icon: "🎨",
        description: "Three.js WebGL viewport with DRACO compression, studio HDRI lighting, and smooth dampening orbit controls.",
        isEssential: true,
        priceInr: 12000,
        priceUsd: 280,
        microFeatures: [
          { id: "td_micro_1", name: "Three.js / React Three Fiber Viewport", detail: "GPU-accelerated 3D canvas with PBR photorealistic materials and reflections.", tag: "Three.js" },
          { id: "td_micro_2", name: "DRACO & KTX2 Asset Compression Pipeline", detail: "Reduces 3D file sizes by up to 85% for lightning-fast asset downloads.", tag: "Optimization" },
          { id: "td_micro_3", name: "Studio HDRI Environment Map Lighting", detail: "Cinematic image-based lighting creating ultra-realistic reflections and depth.", tag: "Lighting" },
          { id: "td_micro_4", name: "Smooth OrbitControls with Angle Constraints", detail: "Tactile mouse/touch rotation with inertia and bounded angles preventing clipping.", tag: "Controls" }
        ]
      },
      {
        id: "td_macro_choreography",
        name: "Scroll-Driven 3D Camera Choreography",
        category: "Storytelling",
        icon: "🎬",
        description: "Pinned camera trajectory along scroll position with cinematic keyframes and clickable annotation hotspots.",
        isEssential: true,
        priceInr: 9000,
        priceUsd: 200,
        microFeatures: [
          { id: "td_micro_5", name: "GSAP ScrollTrigger Pinned 3D Timeline", detail: "Ties camera orbit coordinates and model rotation directly to page scroll progress.", tag: "Timeline" },
          { id: "td_micro_6", name: "Cinematic Keyframe Camera Transitions", detail: "Flawless transitions between macro close-ups, exploded views, and overview angles.", tag: "Cinematic" },
          { id: "td_micro_7", name: "Interactive 3D Hotspot Annotation Pins", detail: "Clickable pulsating 3D markers revealing product specifications and feature callouts.", tag: "Hotspots" }
        ]
      },
      {
        id: "td_macro_customizer",
        name: "Interactive Real-Time Material & Color Switcher",
        category: "3D Customization",
        icon: "🎨",
        description: "Interactive UI controls allowing visitors to swap model colors, textures, and metallic finishes in real-time.",
        isEssential: false,
        priceInr: 5000,
        priceUsd: 120,
        microFeatures: [
          { id: "td_micro_8", name: "Real-Time Mesh Material Color Switcher", detail: "Palette picker allowing clients to preview products in different custom colorways.", tag: "Colors" },
          { id: "td_micro_9", name: "Metallic & Roughness Finish Toggles", detail: "Swaps between matte, gloss, brushed aluminum, and carbon fiber textures.", tag: "Textures" },
          { id: "td_micro_10", name: "Branded Canvas Loading Preloader", detail: "Sleek glowing progress bar with decompression counter preventing bounce on load.", tag: "Preloader" }
        ]
      },
      {
        id: "td_macro_audio",
        name: "Ambient Spatial Audio & Haptic Sound Design",
        category: "Audio Immersion",
        icon: "🎵",
        description: "Interactive procedural sound design, click feedback, and spatial audio positioning engaging the visitor's senses.",
        isEssential: false,
        priceInr: 4500,
        priceUsd: 100,
        microFeatures: [
          { id: "td_micro_11", name: "Web Audio API Spatial Sound Synthesis", detail: "Ambient low-frequency background drone calibrated to visual aesthetic.", tag: "Synthesis" },
          { id: "td_micro_12", name: "Tactile Haptic Click & Rotation Sound", detail: "Subtle micro-audio clicks on button hovers and 3D object rotation.", tag: "Haptics" },
          { id: "td_micro_13", name: "Persistent Sound Toggle with Waveform", detail: "Unobtrusive sound control button remembering visitor preference in session.", tag: "Controls" }
        ]
      },
      {
        id: "td_macro_mobile",
        name: "Mobile Gyroscope Controls & 60fps Thermal Guard",
        category: "Mobile Performance",
        icon: "📱",
        description: "Smartphone gyroscope tilt controls paired with dynamic resolution scaling maintaining solid 60fps without battery drain.",
        isEssential: false,
        priceInr: 4500,
        priceUsd: 100,
        microFeatures: [
          { id: "td_micro_14", name: "DeviceOrientation Gyroscope Tilt Navigation", detail: "Tilting the phone subtly rotates the 3D model in physical space.", tag: "Gyroscope" },
          { id: "td_micro_15", name: "Adaptive 60fps Thermal & Battery Guard", detail: "Dynamically scales pixelRatio on frame drops to preserve mobile battery.", tag: "Performance" },
          { id: "td_micro_16", name: "WebGL Context Loss Recovery Handler", detail: "Gracefully reinitializes 3D shaders if phone OS suspends memory.", tag: "Resilience" }
        ]
      }
    ]
  },
  {
    id: "fullstack-web-app",
    name: "Full-Stack Web App / SaaS MVP",
    badge: "Enterprise SaaS",
    tagline: "Supabase PostgreSQL database, zero-trust RLS security, multi-provider auth & Stripe webhook billing.",
    basePriceInr: 69999,
    basePriceUsd: 1499,
    turnaround: "4-6 Weeks",
    accentGradient: "from-violet-500/20 via-purple-500/10 to-indigo-500/20",
    macroFeatures: [
      {
        id: "fs_macro_foundation",
        name: "Luxury Landing Sprint Foundation (Included)",
        category: "Base Architecture",
        icon: "🏛️",
        description: "Includes the entire Luxury Landing Sprint foundation (₹4,999 value) as the polished public-facing marketing front.",
        isEssential: true,
        priceInr: 4999,
        priceUsd: 99,
        microFeatures: [
          { id: "fs_micro_0a", name: "Complete Next.js App Router Architecture", detail: "Full SSR foundation with edge hosting and CDN delivery.", tag: "Core" },
          { id: "fs_micro_0b", name: "Mobile Responsive Layout & Typography", detail: "Curated typography with 95+ Lighthouse speed benchmarks.", tag: "Core" }
        ]
      },
      {
        id: "fs_macro_db",
        name: "Supabase PostgreSQL Relational Database Architecture",
        category: "Database Engineering",
        icon: "🗄️",
        description: "Normalized relational schema with foreign key constraints, UUID primary keys, and automated timestamp triggers.",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 330,
        microFeatures: [
          { id: "fs_micro_1", name: "Normalized Relational PostgreSQL DDL Schema", detail: "Production tables with foreign key cascades, unique constraints, and enum types.", tag: "Schema" },
          { id: "fs_micro_2", name: "B-Tree Indexes & Query Optimization", detail: "Optimized indexes on frequent query paths guaranteeing sub-20ms database queries.", tag: "Speed" },
          { id: "fs_micro_3", name: "Automated Updated_at Database Triggers", detail: "PL/pgSQL triggers automatically keeping record update timestamps synchronized.", tag: "Triggers" }
        ]
      },
      {
        id: "fs_macro_auth",
        name: "Zero-Trust Row-Level Security & Multi-Provider Auth",
        category: "Authentication & Security",
        icon: "🔐",
        description: "Postgres RLS policies guaranteeing strict tenant isolation, paired with Google OAuth, Magic Links, and session tokens.",
        isEssential: true,
        priceInr: 14000,
        priceUsd: 300,
        microFeatures: [
          { id: "fs_micro_4", name: "Zero-Trust Postgres Row-Level Security (RLS)", detail: "Database-level security policies guaranteeing clients only access their own records.", tag: "RLS" },
          { id: "fs_micro_5", name: "Multi-Provider OAuth 2.0 (Google, Magic Link, Email)", detail: "PKCE auth flow with HTTP-only cookies eliminating token theft vulnerabilities.", tag: "Auth" },
          { id: "fs_micro_6", name: "Automated Password Reset & Email Verification", detail: "Secure password reset links and automated email verification workflows.", tag: "Workflows" }
        ]
      },
      {
        id: "fs_macro_billing",
        name: "Stripe & Razorpay Webhook Billing Engine",
        category: "Payments & Subscriptions",
        icon: "💳",
        description: "Subscription and recurring billing engine with cryptographic signature verification and automated digital fulfillment.",
        isEssential: true,
        priceInr: 12000,
        priceUsd: 260,
        microFeatures: [
          { id: "fs_micro_7", name: "Recurring Subscriptions & One-Time Payments", detail: "Handles monthly/annual recurring tiers, plan upgrades, downgrades, and cancellations.", tag: "Billing" },
          { id: "fs_micro_8", name: "Cryptographic Webhook Signature Handlers", detail: "Idempotent API webhook handlers with replay protection and transaction integrity.", tag: "Webhooks" },
          { id: "fs_micro_9", name: "Automated Invoice Generation & Customer Portal", detail: "Self-serve Stripe billing portal where customers download invoices and update cards.", tag: "Portal" }
        ]
      },
      {
        id: "fs_macro_storage",
        name: "Encrypted Cloud Storage & Secure Signed Uploads",
        category: "Storage",
        icon: "☁️",
        description: "Direct-to-storage upload pipeline for avatars, documents, and contracts with time-expiring signed download URLs.",
        isEssential: false,
        priceInr: 8000,
        priceUsd: 170,
        microFeatures: [
          { id: "fs_micro_10", name: "Encrypted Cloud Storage Buckets with RLS", detail: "Secure storage buckets with folder-level permissions preventing unauthorized access.", tag: "S3 Buckets" },
          { id: "fs_micro_11", name: "Time-Expiring Cryptographic Signed URLs", detail: "Download links that expire after 15 minutes to keep sensitive files private.", tag: "Signed URLs" },
          { id: "fs_micro_12", name: "Client-Side Image Compression & Validation", detail: "Compresses large files in the browser before upload to save bandwidth and storage.", tag: "Compression" }
        ]
      },
      {
        id: "fs_macro_rbac",
        name: "Role-Based Access Control & Immutable Audit Logging",
        category: "Governance",
        icon: "🛡️",
        description: "Granular administrative roles with an immutable audit log tracking critical account modifications and financial changes.",
        isEssential: false,
        priceInr: 6000,
        priceUsd: 130,
        microFeatures: [
          { id: "fs_micro_13", name: "Multi-Tier Role Permissions (Admin, Manager, Member)", detail: "Configurable role guards on API routes, dashboard views, and database operations.", tag: "RBAC" },
          { id: "fs_micro_14", name: "Immutable Security Audit Log", detail: "Captures IP address, timestamp, actor, and old/new state for every sensitive change.", tag: "Audit" },
          { id: "fs_micro_15", name: "Team Member Invitation & Role Revocation", detail: "Email invitation flow allowing organization owners to add team members with roles.", tag: "Invites" }
        ]
      },
      {
        id: "fs_macro_api_bridge",
        name: "External API & Outbound Webhook Dispatcher",
        category: "Integrations",
        icon: "🔌",
        description: "Exposes secure REST API endpoints with API key authentication or triggers webhooks to Zapier, Make.com, or Slack.",
        isEssential: false,
        priceInr: 5000,
        priceUsd: 110,
        microFeatures: [
          { id: "fs_micro_16", name: "Outbound Webhook Dispatcher to Zapier & Slack", detail: "Fires instant JSON payloads to external services whenever key business events occur.", tag: "Webhooks" },
          { id: "fs_micro_17", name: "HMAC SHA-256 Payload Signature Signing", detail: "Cryptographically signs outbound payloads so receiving servers can verify origin.", tag: "Signing" },
          { id: "fs_micro_18", name: "Automated HTTP Retry Queue with Backoff", detail: "Retries failed webhooks with exponential backoff to prevent dropped notifications.", tag: "Queue" }
        ]
      },
      {
        id: "fs_macro_backups_export",
        name: "Automated Daily Backups & 1-Click CSV Export",
        category: "Operations",
        icon: "💾",
        description: "Automated daily WAL database snapshots with point-in-time recovery and one-click data table export to CSV & Excel.",
        isEssential: false,
        priceInr: 5000,
        priceUsd: 100,
        microFeatures: [
          { id: "fs_micro_19", name: "Automated Daily Database Snapshots & PITR", detail: "Automated pg_dump backup archiving with 7-day emergency rollback capability.", tag: "Snapshots" },
          { id: "fs_micro_20", name: "One-Click Data Export to CSV & Excel Sheets", detail: "Instant data table download button with CSV formula injection sanitization.", tag: "Export" },
          { id: "fs_micro_21", name: "Automated System Health & Error Alerting", detail: "Integrates with error monitors to notify engineers if a database error spikes.", tag: "Monitoring" }
        ]
      }
    ]
  }
];

interface PackagePricingBreakdownProps {
  initialPackageId?: string;
  onProceedWithCustomScope?: (scopeData: {
    packageId: string;
    packageName: string;
    originalPriceInr: number;
    originalPriceUsd: number;
    customPriceInr: number;
    customPriceUsd: number;
    currency: "INR" | "USD";
    includedMacroFeatures: string[];
    removedMacroFeatures: string[];
  }) => void;
}

export default function PackagePricingBreakdown({
  initialPackageId = "growth-marketing-campaigns",
  onProceedWithCustomScope
}: PackagePricingBreakdownProps) {
  const { tierConfig, formatPackagePrice } = useGeoPricing();

  // Active selected package
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackageId);

  // Set of deselected macro feature IDs (only non-essential ones can be deselected)
  const [deselectedFeatureIds, setDeselectedFeatureIds] = useState<Set<string>>(new Set());

  // Currently open macro feature ID for the micro-features drawer (accordion: only one open at a time)
  const [expandedMacroId, setExpandedMacroId] = useState<string | null>(null);

  // Active currency
  const isINR = tierConfig.currencyCode === "INR";

  // Selected package definition
  const currentPackage = useMemo(() => {
    return PACKAGE_BREAKDOWN_DATA.find((p) => p.id === selectedPackageId) || PACKAGE_BREAKDOWN_DATA[0];
  }, [selectedPackageId]);

  // When switching packages, reset the expanded drawer (or keep reasonable)
  const handleSelectPackage = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    setExpandedMacroId(null);
  };

  // Toggle macro feature inclusion (only if not essential)
  const handleToggleFeature = (feature: MacroFeatureItem) => {
    if (feature.isEssential) return; // Non-removable core feature

    setDeselectedFeatureIds((prev) => {
      const next = new Set(prev);
      if (next.has(feature.id)) {
        next.delete(feature.id);
      } else {
        next.add(feature.id);
      }
      return next;
    });
  };

  // Toggle the micro-features accordion (one at a time)
  const handleToggleAccordion = (featureId: string) => {
    setExpandedMacroId((prev) => (prev === featureId ? null : featureId));
  };

  // Price calculations
  const calculation = useMemo(() => {
    // Original package base prices
    const origInr = currentPackage.basePriceInr;
    const origUsd = currentPackage.basePriceUsd;

    // Deductions from deselected optional features
    let deductionInr = 0;
    let deductionUsd = 0;
    const removedNames: string[] = [];
    const includedNames: string[] = [];

    currentPackage.macroFeatures.forEach((feat) => {
      if (deselectedFeatureIds.has(feat.id)) {
        deductionInr += feat.priceInr;
        deductionUsd += feat.priceUsd;
        removedNames.push(feat.name);
      } else {
        includedNames.push(feat.name);
      }
    });

    const customInr = Math.max(4999, origInr - deductionInr);
    const customUsd = Math.max(99, origUsd - deductionUsd);

    // Market pricing calculation
    const marketRatio = tierConfig.packages[selectedPackageId as keyof typeof tierConfig.packages]
      ? tierConfig.packages[selectedPackageId as keyof typeof tierConfig.packages] / (isINR ? origInr : origUsd)
      : 1;

    const customMarket = Math.round((isINR ? customInr : customUsd) * marketRatio);
    const origMarket = tierConfig.packages[selectedPackageId as keyof typeof tierConfig.packages] ?? (isINR ? origInr : origUsd);
    const deductionMarket = Math.max(0, origMarket - customMarket);

    return {
      origInr,
      origUsd,
      customInr,
      customUsd,
      deductionInr,
      deductionUsd,
      origMarket,
      customMarket,
      deductionMarket,
      removedNames,
      includedNames
    };
  }, [currentPackage, deselectedFeatureIds, tierConfig, isINR, selectedPackageId]);

  return (
    <div className="w-full space-y-8 py-6">
      {/* HEADER & PACKAGE SELECTOR TABS */}
      <div className="rounded-3xl border border-sky-300/80 bg-[#c8ecff]/35 p-6 sm:p-8 backdrop-blur-xl shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-200/70 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-[#0a192f] text-white px-3 py-0.5 text-[10px] font-black uppercase tracking-wider">
                Interactive Scope Breakdown
              </span>
              <span className="text-xs font-bold text-sky-800">
                Macro & Micro Feature Architecture
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0a192f] tracking-tight">
              Package Scope & Transparent Pricing Decomposition
            </h2>
            <p className="text-xs sm:text-sm text-sky-950/80 font-medium mt-1 max-w-2xl">
              Every package includes a complete, battle-tested functional architecture. Click the <span className="font-bold text-sky-900">+</span> icon on any macro feature to slide open its granular micro-features. Remove optional modules to trim your investment without sacrificing foundational performance.
            </p>
          </div>

          {/* Market Currency Selector */}
          <div className="shrink-0 flex items-center gap-2">
            <MarketRegionSelector />
          </div>
        </div>

        {/* PACKAGE SELECTOR PILLS */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-sky-900">
            1. Select Package to Inspect & Customize:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PACKAGE_BREAKDOWN_DATA.map((pkg) => {
              const isSelected = pkg.id === selectedPackageId;
              const displayPrice = tierConfig.packages[pkg.id as keyof typeof tierConfig.packages] ?? (isINR ? pkg.basePriceInr : pkg.basePriceUsd);

              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#0a192f] text-white border-[#0a192f] shadow-md scale-[1.02]"
                      : "bg-white/60 hover:bg-white/90 border-sky-200/80 text-slate-800 hover:border-sky-300"
                  }`}
                >
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md mb-1.5 ${
                    isSelected ? "bg-sky-400/20 text-sky-200" : "bg-sky-100 text-sky-800"
                  }`}>
                    {pkg.badge}
                  </span>
                  <span className="text-xs font-black line-clamp-1">
                    {pkg.name}
                  </span>
                  <span className={`text-[11px] font-bold mt-1 ${isSelected ? "text-sky-300" : "text-sky-900"}`}>
                    {tierConfig.currencySymbol}{displayPrice.toLocaleString()} {tierConfig.currencyCode}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SELECTED PACKAGE HEADER BANNER */}
      <div className={`rounded-3xl border border-sky-300/80 bg-gradient-to-r ${currentPackage.accentGradient} p-6 sm:p-7 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-md`}>
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-sky-200 border border-sky-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-sky-950">
              {currentPackage.badge}
            </span>
            <span className="text-xs font-bold text-sky-900">
              ⏱ Turnaround: {currentPackage.turnaround}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0a192f]">
            {currentPackage.name}
          </h3>
          <p className="text-xs text-sky-950/80 font-medium leading-relaxed">
            {currentPackage.tagline}
          </p>
        </div>

        {/* LIVE PRICING SUMMARY TILE */}
        <div className="shrink-0 bg-white/80 border border-sky-200/80 rounded-2xl p-4 sm:p-5 shadow-sm text-center md:text-right min-w-[220px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            {calculation.deductionMarket > 0 ? "Custom Tailored Investment" : "Full Suite Package Investment"}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0a192f] mt-0.5">
            {tierConfig.currencySymbol}{calculation.customMarket.toLocaleString()} <span className="text-xs font-bold text-slate-600">{tierConfig.currencyCode}</span>
          </div>

          {calculation.deductionMarket > 0 && (
            <div className="mt-1 flex items-center justify-center md:justify-end gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span>✂️ Saved:</span>
              <span className="font-black">-{tierConfig.currencySymbol}{calculation.deductionMarket.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* MACRO & MICRO FEATURES LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-sky-900">
            2. Macro Features & Expandable Micro Functionalities:
          </label>
          <span className="text-[11px] font-bold text-sky-800">
            {currentPackage.macroFeatures.length} Macro Modules • Click [+] for micro-breakdown
          </span>
        </div>

        <div className="space-y-3">
          {currentPackage.macroFeatures.map((macro, idx) => {
            const isRemoved = deselectedFeatureIds.has(macro.id);
            const isExpanded = expandedMacroId === macro.id;
            const macroPrice = isINR ? macro.priceInr : macro.priceUsd;
            const macroMarketPrice = Math.round(macroPrice * (calculation.origMarket / (isINR ? currentPackage.basePriceInr : currentPackage.basePriceUsd)));

            return (
              <div
                key={macro.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isRemoved
                    ? "bg-slate-50/70 border-slate-200 opacity-60"
                    : isExpanded
                    ? "bg-white border-sky-400 shadow-md ring-2 ring-sky-400/20"
                    : "bg-[#c8ecff]/30 hover:bg-[#c8ecff]/50 border-sky-300/80 shadow-xs"
                }`}
              >
                {/* MACRO CARD HEADER */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5 flex-1">
                    {/* Checkbox / Removal Toggle */}
                    <div className="pt-0.5 sm:pt-0 shrink-0">
                      {macro.isEssential ? (
                        <div
                          className="h-6 w-6 rounded-lg bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800"
                          title="Essential Core Architecture: Non-removable for foundational performance and compliance."
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleFeature(macro)}
                          className={`h-6 w-6 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                            isRemoved
                              ? "bg-white border-slate-300 text-transparent hover:border-slate-400"
                              : "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                          }`}
                          title={isRemoved ? "Click to add back this feature" : "Click to remove optional feature and reduce price"}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Macro Icon & Titles */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-lg">{macro.icon}</span>
                        <h4 className={`text-sm sm:text-base font-black ${isRemoved ? "line-through text-slate-500" : "text-[#0a192f]"}`}>
                          {macro.name}
                        </h4>
                        {macro.isEssential ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 border border-sky-200 px-2 py-0.5 text-[9px] font-black text-sky-900">
                            🔒 Non-Removable Core
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black ${
                            isRemoved
                              ? "bg-amber-100 text-amber-900 border border-amber-200"
                              : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                          }`}>
                            {isRemoved ? "✂️ Removed from Scope" : "✓ Optional Module Included"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-sky-950/70 font-medium leading-relaxed">
                        {macro.description}
                      </p>
                    </div>
                  </div>

                  {/* Price Tag & Drawer Plus [+] Toggle */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-sky-200/50">
                    <div className="text-right">
                      <span className={`text-xs font-black ${isRemoved ? "line-through text-slate-400" : "text-sky-950"}`}>
                        {tierConfig.currencySymbol}{macroMarketPrice.toLocaleString()} {tierConfig.currencyCode}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 block">
                        {macro.isEssential ? "Built-In Base" : isRemoved ? "Deducted" : "Included"}
                      </span>
                    </div>

                    {/* Plus [+] / Minus [-] Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleAccordion(macro.id)}
                      className={`h-9 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-black transition-all cursor-pointer ${
                        isExpanded
                          ? "bg-[#0a192f] text-white border-[#0a192f] shadow-sm"
                          : "bg-white/80 hover:bg-white text-sky-900 border-sky-300 hover:border-sky-400 shadow-xs"
                      }`}
                      title={isExpanded ? "Close micro-features breakdown" : "Expand micro-features breakdown"}
                    >
                      <span className={`text-sm transition-transform duration-200 font-mono ${isExpanded ? "rotate-45" : "rotate-0"}`}>
                        +
                      </span>
                      <span className="text-[11px]">
                        {macro.microFeatures.length} Micros
                      </span>
                    </button>
                  </div>
                </div>

                {/* EXPANDABLE MICRO-FEATURES BREAKDOWN (ONE AT A TIME ACCORDION) */}
                <div
                  className={`transition-all duration-300 ease-in-out border-t border-sky-200/70 overflow-hidden ${
                    isExpanded ? "max-h-[600px] opacity-100 bg-sky-50/50" : "max-h-0 opacity-0 bg-transparent"
                  }`}
                >
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-sky-900">
                        Granular Micro-Features & Specific Deliverables ({macro.microFeatures.length}):
                      </span>
                      <span className="text-[10px] font-bold text-sky-800">
                        All micro-functionalities verified for this module
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {macro.microFeatures.map((micro) => (
                        <div
                          key={micro.id}
                          className="p-3 rounded-xl bg-white border border-sky-200/80 shadow-2xs space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#0a192f] flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                              {micro.name}
                            </span>
                            {micro.tag && (
                              <span className="rounded bg-sky-100 text-sky-800 font-extrabold text-[9px] px-1.5 py-0.5">
                                {micro.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-normal pl-3">
                            {micro.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STICKY / BOTTOM CUSTOM SCOPE PROCEED BAR */}
      <div className="rounded-3xl border border-sky-300 bg-gradient-to-r from-sky-100 via-white to-blue-50 p-6 sm:p-7 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-200/60 px-2 py-0.5 rounded-full">
            Scope Customization Summary
          </span>
          <h4 className="text-lg sm:text-xl font-black text-[#0a192f] mt-1.5">
            Ready to proceed with this scope?
          </h4>
          <p className="text-xs text-sky-950/80 font-medium mt-0.5">
            {calculation.removedNames.length > 0
              ? `You removed ${calculation.removedNames.length} optional module(s) saving ${tierConfig.currencySymbol}${calculation.deductionMarket.toLocaleString()} ${tierConfig.currencyCode}.`
              : "All macro & micro modules are included for the complete, high-performance experience."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full md:w-auto">
          <div className="text-center sm:text-right w-full sm:w-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Custom Investment</span>
            <span className="text-2xl sm:text-3xl font-black text-[#0a192f]">
              {tierConfig.currencySymbol}{calculation.customMarket.toLocaleString()} {tierConfig.currencyCode}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onProceedWithCustomScope) {
                onProceedWithCustomScope({
                  packageId: currentPackage.id,
                  packageName: currentPackage.name,
                  originalPriceInr: calculation.origInr,
                  originalPriceUsd: calculation.origUsd,
                  customPriceInr: calculation.customInr,
                  customPriceUsd: calculation.customUsd,
                  currency: isINR ? "INR" : "USD",
                  includedMacroFeatures: calculation.includedNames,
                  removedMacroFeatures: calculation.removedNames
                });
              }
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <span>Lock In Scope & Book Consultation</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
