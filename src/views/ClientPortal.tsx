"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { packagesTranslations } from "@/data/packagesTranslations";
import {
  getClientProjects,
  getContractForProject,
  getProjectAssets,
  uploadProjectAsset,
  deleteProjectAsset,
  signContract,
  getWebsitePackages,
  getProjectChangeRequests,
  submitChangeRequest,
  createClientProject,
  type ClientProject,
  type EContract,
  type ProjectAsset,
  type WebsitePackage,
  type ChangeRequest,
} from "@/lib/portalServices";
import {
  openRazorpayCheckout,
  type RazorpayPaymentSuccessResponse,
} from "@/lib/razorpay";
import SignaturePad from "@/components/SignaturePad";

export default function ClientPortal() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const pkgCopy = packagesTranslations[locale] || packagesTranslations.en;
  const {
    user,
    loading: authLoading,
    signInWithPassword,
    signUp,
    signInWithOtp,
    signInWithGoogle,
    signOut,
  } = useAuth();

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup" | "magic">("login");
  const [authMessage, setAuthMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Portal State
  const [activeTab, setActiveTab] = useState<"overview" | "payments" | "assets" | "contracts" | "changes" | "packages">("overview");
  const [isPayingWithRazorpay, setIsPayingWithRazorpay] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<{ paymentId: string; amount: number; date: string } | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [contract, setContract] = useState<EContract | null>(null);
  const [assets, setAssets] = useState<ProjectAsset[]>([]);
  const [packages, setPackages] = useState<WebsitePackage[]>([]);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Asset Upload State
  const [uploadCategory, setUploadCategory] = useState<ProjectAsset["category"]>("brand_assets");
  const [uploadDescription, setUploadDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Change Request Submission State
  const [newChangeTitle, setNewChangeTitle] = useState("");
  const [newChangeDesc, setNewChangeDesc] = useState("");
  const [newChangeCategory, setNewChangeCategory] = useState<ChangeRequest["category"]>("Design");
  const [isSubmittingChange, setIsSubmittingChange] = useState(false);
  const [changeSubmitSuccess, setChangeSubmitSuccess] = useState(false);

  // Contract Signature State
  const [isSigning, setIsSigning] = useState(false);
  const [contractSignedSuccess, setContractSignedSuccess] = useState(false);
  const [legalAgreed, setLegalAgreed] = useState(false);

  // Load project, contract, assets, packages, and change requests when authenticated user changes
  useEffect(() => {
    let isMounted = true;
    async function loadPortalData() {
      setLoadingData(true);
      const email = user?.email || "";

      try {
        const [pkgs, projs] = await Promise.all([
          getWebsitePackages(),
          email ? getClientProjects(email) : Promise.resolve([]),
        ]);

        if (!isMounted) return;
        setPackages(pkgs);
        setProjects(projs);

        const currentProj = projs[0] || null;
        setSelectedProject(currentProj);

        if (currentProj) {
          const [ctr, asts, chgReqs] = await Promise.all([
            getContractForProject(currentProj.id),
            getProjectAssets(currentProj.id),
            getProjectChangeRequests(currentProj.id),
          ]);
          if (!isMounted) return;
          setContract(ctr);
          setAssets(asts);
          setChangeRequests(chgReqs);
        } else {
          setContract(null);
          setAssets([]);
          setChangeRequests([]);
        }
      } catch (err) {
        console.error("Portal data loading error:", err);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    }

    if (user) {
      loadPortalData();
    } else {
      setLoadingData(false);
      setProjects([]);
      setSelectedProject(null);
      setContract(null);
      setAssets([]);
      setChangeRequests([]);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    setAuthMessage(null);
    setIsSubmittingAuth(true);
    try {
      const res = await signInWithGoogle(
        typeof window !== "undefined" ? window.location.href : undefined
      );
      if (res?.error) {
        setAuthMessage({ type: "error", text: res.error.message });
      }
    } catch (err: unknown) {
      setAuthMessage({
        type: "error",
        text: (err as Error)?.message || "Failed to sign in with Google.",
      });
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);

    if (!authEmail.trim()) {
      setAuthMessage({ type: "error", text: "Please enter your email address." });
      return;
    }

    setIsSubmittingAuth(true);

    try {
      if (authMode === "magic") {
        const res = await signInWithOtp(authEmail.trim());
        if (res?.error) throw res.error;
        setAuthMessage({
          type: "success",
          text: "✨ Magic link sent! Check your inbox to sign in directly.",
        });
      } else if (authMode === "signup") {
        if (!authPassword || authPassword.length < 6) {
          setAuthMessage({ type: "error", text: "Password must be at least 6 characters." });
          setIsSubmittingAuth(false);
          return;
        }
        const res = await signUp(authEmail.trim(), authPassword);
        if (res?.error) throw res.error;
        setAuthMessage({ type: "success", text: "🎉 Account created successfully! Signing in..." });
      } else {
        const res = await signInWithPassword(authEmail.trim(), authPassword);
        if (res?.error) throw res.error;
        setAuthMessage(null);
      }
    } catch (err: unknown) {
      setAuthMessage({
        type: "error",
        text: (err as Error)?.message || "Authentication failed. Please check your credentials.",
      });
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Asset Upload Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedProject) return;

    setIsUploading(true);
    setUploadProgress(`Uploading ${files.length} asset(s)...`);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const newAsset = await uploadProjectAsset(
          file,
          selectedProject.id,
          uploadCategory,
          uploadDescription
        );
        setAssets((prev) => [newAsset, ...prev]);
      }
      setUploadDescription("");
      setUploadProgress("Upload complete!");
      setTimeout(() => setUploadProgress(null), 3000);
    } catch (err) {
      console.error("Asset upload failed:", err);
      setUploadProgress("Upload encountered an issue.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteAsset = async (assetId: string, storagePath: string) => {
    if (!confirm("Are you sure you want to remove this asset?")) return;
    try {
      await deleteProjectAsset(assetId, storagePath);
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
    } catch (err) {
      console.error("Delete asset error:", err);
    }
  };

  // Contract Signature Submission
  const handleSaveSignature = async (signatureDataUrl: string, signatureName: string) => {
    if (!contract || !legalAgreed) {
      alert("Please check the box agreeing to the contract terms before signing.");
      return;
    }

    setIsSigning(true);
    try {
      const updated = await signContract(contract.id, signatureDataUrl, signatureName);
      setContract(updated);
      setContractSignedSuccess(true);
    } catch (err) {
      console.error("Error signing contract:", err);
      alert("Failed to submit signature. Please try again.");
    } finally {
      setIsSigning(false);
    }
  };

  // Change Request Submission Handler
  const handleChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !newChangeTitle.trim() || !newChangeDesc.trim()) {
      alert("Please fill in both the title and details for your change request.");
      return;
    }

    setIsSubmittingChange(true);
    try {
      const created = await submitChangeRequest({
        project_id: selectedProject.id,
        client_email: user?.email || selectedProject.client_email || "client@demo.com",
        title: newChangeTitle.trim(),
        description: newChangeDesc.trim(),
        category: newChangeCategory,
      });
      setChangeRequests((prev) => [created, ...prev]);
      setNewChangeTitle("");
      setNewChangeDesc("");
      setChangeSubmitSuccess(true);
      setTimeout(() => setChangeSubmitSuccess(false), 4000);
    } catch (err) {
      console.error("Change request submission error:", err);
      alert("Failed to record change request. Please try again.");
    } finally {
      setIsSubmittingChange(false);
    }
  };

  // Razorpay Checkout for Client Invoices / Retainers
  const handlePayWithRazorpay = async (amount: number, description: string) => {
    setIsPayingWithRazorpay(true);
    try {
      await openRazorpayCheckout({
        amount: Math.round(amount * 100), // convert to paise
        currency: "INR",
        name: "Tanie Lalwani Studio",
        description,
        prefill: {
          name: selectedProject?.client_name || user?.user_metadata?.full_name || "",
          email: user?.email || selectedProject?.client_email || "",
          contact: "",
        },
        notes: {
          project_id: selectedProject?.id || "",
          client_email: user?.email || "",
        },
        onSuccess: (res: RazorpayPaymentSuccessResponse) => {
          setIsPayingWithRazorpay(false);
          setPaidReceipt({
            paymentId: res.razorpay_payment_id,
            amount,
            date: new Date().toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        },
        onFailure: (err) => {
          setIsPayingWithRazorpay(false);
          const msg = "message" in err ? err.message : err.description || "Payment cancelled or failed.";
          alert(msg);
        },
        onDismiss: () => {
          setIsPayingWithRazorpay(false);
        },
      });
    } catch (err: unknown) {
      setIsPayingWithRazorpay(false);
      alert((err as Error)?.message || "Failed to trigger Razorpay checkout.");
    }
  };

  // Project Stage Order Helper
  const stages = ["Discovery", "Design", "Development", "Review", "Launch", "Completed"];
  const currentStageIndex = selectedProject ? stages.indexOf(selectedProject.status) : 0;

  // Sprint Reservation & Advance Deposit Handler
  const [selectedSprintPackageId, setSelectedSprintPackageId] = useState<string>("interactive-3d-experience");
  const [isPayingDeposit, setIsPayingDeposit] = useState(false);

  const handlePayAdvanceDeposit = async (pkg: WebsitePackage) => {
    setIsPayingDeposit(true);
    // 25% deposit in paise (INR)
    const depositAmountInr = Math.round(pkg.price_inr * 0.25 * 100);
    const clientEmail = user?.email || "client@company.com";
    const clientName = user?.user_metadata?.full_name || clientEmail.split("@")[0];

    try {
      await openRazorpayCheckout({
        amount: depositAmountInr,
        currency: "INR",
        name: "Tanie Lalwani Studio",
        description: `25% Advance Sprint Deposit — ${pkg.name}`,
        prefill: {
          email: clientEmail,
          name: clientName,
        },
        onSuccess: async (payment) => {
          setPaidReceipt({
            paymentId: payment.razorpay_payment_id,
            amount: Math.round(pkg.price_inr * 0.25),
            date: new Date().toLocaleDateString(),
          });

          try {
            const newProj = await createClientProject({
              client_name: clientName,
              client_email: clientEmail,
              title: `${clientName} — ${pkg.name}`,
              package_id: pkg.id,
              budget_usd: pkg.price_usd,
              budget_inr: pkg.price_inr,
              description: `Sprint reserved via 25% Advance Deposit (Razorpay ID: ${payment.razorpay_payment_id}).`,
              status: "Discovery",
              progress_percent: 15,
            });
            setProjects([newProj]);
            setSelectedProject(newProj);
          } catch (projErr) {
            console.error("Auto project creation error:", projErr);
          }
          setIsPayingDeposit(false);
        },
        onFailure: (err) => {
          console.error("Payment failure:", err);
          setIsPayingDeposit(false);
        },
        onDismiss: () => {
          setIsPayingDeposit(false);
        },
      });
    } catch (err: unknown) {
      console.error("Deposit trigger error:", err);
      setIsPayingDeposit(false);
    }
  };

  const isGuest = !user;
  const isConfirmedClient = Boolean(user) && (projects.length > 0 || Boolean(paidReceipt));
  const isProspectAwaitingSprint = Boolean(user) && (!selectedProject || projects.length === 0) && !paidReceipt;
  const isAuthenticatedUser = Boolean(user);

  return (
    <main className="min-h-screen bg-[#dff4ff] text-slate-900 font-sans selection:bg-sky-200 selection:text-black" dir={locale === "ur" ? "rtl" : "ltr"}>
      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT VERTICAL NAVIGATION (DESKTOP)                         */}
      {/* ------------------------------------------------------------- */}
      <nav
        aria-label="Side navigation"
        className="fixed left-0 top-0 z-40 hidden h-full w-20 flex-col items-center justify-start gap-6 border-r border-black/10 bg-[#dff4ff]/88 py-8 backdrop-blur-xl md:flex"
      >
        <div className="flex flex-col items-center gap-5">
          <Link
            href="/"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title={pkgCopy.nav.home}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-8 9 8M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
            </svg>
            <span className="text-[10px] font-semibold">{pkgCopy.nav.home}</span>
          </Link>

          <Link
            href="/projects"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/projects" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title={pkgCopy.nav.projects}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-semibold">{pkgCopy.nav.projects}</span>
          </Link>

          <Link
            href="/pricing"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/pricing" || pathname === "/packages" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title={pkgCopy.nav.pricing}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span className="text-[10px] font-semibold">{pkgCopy.nav.pricing}</span>
          </Link>

          <Link
            href="/client"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/client" ? "bg-white !text-black shadow-md border border-sky-300/80" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title={pkgCopy.nav.clientHub}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-bold">{pkgCopy.nav.clientHub}</span>
          </Link>

          <Link
            href="/qna"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/qna" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title={pkgCopy.nav.qna}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-semibold">{pkgCopy.nav.qna}</span>
          </Link>

          <Link
            href="/faq"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/faq" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title={pkgCopy.nav.faq}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-semibold">{pkgCopy.nav.faq}</span>
          </Link>

          <Link
            href="/terms"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/terms" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title={pkgCopy.nav.terms}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[10px] font-semibold">{pkgCopy.nav.terms}</span>
          </Link>

          <Link
            href="/contact"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/contact" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title={pkgCopy.nav.contact}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5l-9 6.5-9-6.5" />
            </svg>
            <span className="text-[10px] font-semibold">{pkgCopy.nav.contact}</span>
          </Link>
        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 2. MOBILE TOP HEADER                                          */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed left-0 top-0 z-30 flex h-14 w-full items-center justify-between border-b border-black/10 bg-[#dff4ff]/90 px-4 backdrop-blur-xl md:hidden">
        <Link href="/" className="flex items-center gap-1.5 !no-underline !text-black font-semibold text-sm">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{pkgCopy.nav.home}</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-800">
          {pkgCopy.nav.clientHub}
        </span>
        <Link
          href="/pricing"
          className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-bold text-white shadow-xs cursor-pointer !no-underline"
        >
          {pkgCopy.nav.pricing}
        </Link>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 3. MAIN PAGE CONTAINER                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="pl-0 md:pl-20 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-8 sm:pt-10 sm:pb-24">
          {/* Top Header Banner */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[2.2rem] border border-sky-300/70 bg-gradient-to-r from-white/95 via-sky-50/80 to-white/95 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-100/70 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-900">
                <span className="h-2 w-2 animate-ping rounded-full bg-sky-500" />
                {isConfirmedClient
                  ? "Active Client Workspace"
                  : isProspectAwaitingSprint
                  ? "Sprint Reservation & Kickoff"
                  : "Private Client Hub & Gateway"}
              </div>
              <h1 className="mt-2.5 text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {isConfirmedClient
                  ? `Welcome, ${selectedProject?.client_name || user?.email?.split("@")[0] || "Partner"}`
                  : isProspectAwaitingSprint
                  ? `Welcome, ${user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Client"}`
                  : "Client Management & Workspace"}
              </h1>
              <p className="mt-1 text-sm text-slate-600 max-w-2xl font-medium">
                {isConfirmedClient
                  ? "Track live project milestones, upload brand assets, access staging deliverables, pay invoices, and sign digital agreements."
                  : isProspectAwaitingSprint
                  ? "Your account is verified! Lock in your production dates by submitting an advance deposit, or await project setup from Tanie."
                  : "A dedicated private engineering portal for sprint tracking, digital contract execution, asset delivery, and milestone settlement."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/pricing"
                className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-xs transition hover:bg-white hover:border-black/20 !no-underline"
              >
                Pricing & Calculator
              </Link>

              {user ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-800 transition hover:bg-rose-100 cursor-pointer"
                >
                  Sign Out ({user?.email})
                </button>
              ) : null}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* VIEW 1: UNAUTHENTICATED GUEST / DISCOVERY UI                   */}
          {/* ------------------------------------------------------------- */}
          {isGuest ? (
            <div className="space-y-10">
              {/* Feature Showcase Grid for Prospective Clients */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl border border-black/8 bg-white/85 p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl border border-sky-200">
                    📊
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-950">Live Sprint Milestones</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Real-time timeline tracking across Discovery, Figma Design, Development, Staging Review, and Production Launch.
                  </p>
                </div>

                <div className="rounded-3xl border border-black/8 bg-white/85 p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl border border-sky-200">
                    📁
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-950">Cloud Asset Dropzone</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Upload logos, vector graphics, typography files, copy docs, and 3D assets directly to secure cloud storage.
                  </p>
                </div>

                <div className="rounded-3xl border border-black/8 bg-white/85 p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl border border-sky-200">
                    ✍️
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-950">Digital E-Contracts</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Review clear scope summaries, legal warranties, milestone payment schedules, and execute signatures with cryptographic IP stamping.
                  </p>
                </div>

                <div className="rounded-3xl border border-black/8 bg-white/85 p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl border border-sky-200">
                    💎
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-950">Deliverables Vault</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Direct one-click access to staging deployment previews, Figma design boards, production code repositories, and documentation.
                  </p>
                </div>
              </div>

              {/* Authentication Card & Demo CTA Section */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
                {/* Left Column: Clean Interactive Auth Card */}
                <div className="lg:col-span-6 rounded-[2rem] border border-sky-300/80 bg-white/95 p-8 backdrop-blur-xl shadow-xl">
                  <div className="text-center">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 border border-sky-300 text-xl text-sky-800 mb-3">
                      🔐
                    </div>
                    <h2 className="text-2xl font-black text-slate-950">Sign In to Your Client Hub</h2>
                    <p className="mt-1 text-xs text-slate-600">
                      Enter your registered client email to access your active workspace.
                    </p>
                  </div>

                  {/* 1-Click Google OAuth */}
                  <button
                    type="button"
                    disabled={isSubmittingAuth || authLoading}
                    onClick={handleGoogleSignIn}
                    className="mt-6 w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-black/15 font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{isSubmittingAuth ? "Connecting to Google..." : "Continue with Google"}</span>
                  </button>

                  <div className="relative my-5 flex items-center justify-center">
                    <div className="w-full border-t border-black/10" />
                    <span className="absolute bg-white px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Or continue with email
                    </span>
                  </div>

                  {/* Auth Mode Tabs */}
                  <div className="flex rounded-full bg-slate-100 p-1 border border-black/5 text-xs">
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className={`flex-1 rounded-full py-2 font-bold transition cursor-pointer ${
                        authMode === "login"
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-600 hover:text-black"
                      }`}
                    >
                      Password Login
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("magic")}
                      className={`flex-1 rounded-full py-2 font-bold transition cursor-pointer ${
                        authMode === "magic"
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-600 hover:text-black"
                      }`}
                    >
                      Magic Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("signup")}
                      className={`flex-1 rounded-full py-2 font-bold transition cursor-pointer ${
                        authMode === "signup"
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-600 hover:text-black"
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  {authMessage && (
                    <div
                      className={`mt-4 rounded-2xl p-3.5 text-xs ${
                        authMessage.type === "success"
                          ? "border border-emerald-300 bg-emerald-50 text-emerald-800 font-medium"
                          : "border border-rose-300 bg-rose-50 text-rose-800 font-medium"
                      }`}
                    >
                      {authMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Client Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="client@company.com"
                        className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      />
                    </div>

                    {authMode !== "magic" && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Password
                        </label>
                        <input
                          type="password"
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingAuth || authLoading}
                      className="w-full rounded-xl bg-slate-950 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmittingAuth
                        ? "Processing..."
                        : authMode === "login"
                        ? "Sign In to Client Workspace"
                        : authMode === "magic"
                        ? "Send Magic Sign-In Link"
                        : "Create Client Account"}
                    </button>
                  </form>
                </div>

                {/* Right Column: Authentic Client Experience Overview */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="rounded-[2rem] border border-sky-300/70 bg-gradient-to-br from-white/95 via-sky-50/70 to-indigo-50/60 p-8 backdrop-blur-xl shadow-lg">
                    <span className="inline-block rounded-md border border-sky-300 bg-sky-100 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-sky-900">
                      Studio Client Workspace
                    </span>
                    <h3 className="mt-3 text-2xl font-black text-slate-950">Bespoke Engineering & Milestone Portal</h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                      Every project commissioned with Tanie Lalwani includes a dedicated, private client workspace. Real-time sprint telemetry, cryptographic e-contracts, and cloud asset synchronization.
                    </p>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/80 p-3 text-xs text-slate-700 font-medium">
                        <span className="text-sky-600 font-bold">✓</span>
                        <span>Single Sign-On via Google OAuth or verified email authentication</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/80 p-3 text-xs text-slate-700 font-medium">
                        <span className="text-sky-600 font-bold">✓</span>
                        <span>RBI-compliant Razorpay invoice processing and automatic receipts</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/80 p-3 text-xs text-slate-700 font-medium">
                        <span className="text-sky-600 font-bold">✓</span>
                        <span>Interactive canvas signature pad with verifiable IP ownership transfer</span>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Link
                        href="/contact"
                        className="rounded-xl bg-slate-950 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-slate-800 !no-underline"
                      >
                        Inquire for New Project
                      </Link>
                      <Link
                        href="/pricing"
                        className="rounded-xl border border-black/15 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-800 transition hover:bg-slate-50 !no-underline"
                      >
                        Explore Packages
                      </Link>
                    </div>
                  </div>

                  {/* Direct Help Callout */}
                  <div className="rounded-2xl border border-black/8 bg-white/80 p-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-950">Have questions before starting?</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Explore package options or get in touch directly.</p>
                    </div>
                    <Link
                      href="/pricing"
                      className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 !no-underline"
                    >
                      View Pricing →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : isProspectAwaitingSprint ? (
            /* ------------------------------------------------------------- */
            /* VIEW 2: LOGGED-IN PROSPECT (AWAITING SPRINT DEPOSIT / CONFIRM) */
            /* ------------------------------------------------------------- */
            <div className="space-y-8">
              {/* Status Alert Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-sky-300/80 bg-gradient-to-r from-sky-50 via-white to-sky-100/60 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-200/80 text-2xl border border-sky-300">
                    🚀
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-200/60 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-sky-950">
                      Step 2: Confirm Sprint & Unlock Dashboard
                    </div>
                    <h3 className="mt-1 text-lg font-black text-slate-950">
                      Reserve Your Production Sprint
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
                      Your account is verified! To assign your dedicated sprint queue, unlock the live deliverables vault, and generate your digital contract, select your package and submit your 25% sprint deposit below.
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href="/contact"
                    className="rounded-full border border-black/10 bg-white/90 px-4 py-2 text-xs font-bold text-slate-800 shadow-xs hover:bg-white !no-underline"
                  >
                    Custom Consultation →
                  </Link>
                </div>
              </div>

              {/* Sprint Package Options */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">Choose Your Engineering Sprint</h2>
                    <p className="text-xs text-slate-600">Select an architecture tier to lock in with a 25% advance deposit.</p>
                  </div>
                  <span className="text-xs font-bold text-sky-900 bg-sky-100/80 px-3 py-1 rounded-full border border-sky-200">
                    25% Advance • 75% on Delivery
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {packages.map((pkg) => {
                    const isSelected = selectedSprintPackageId === pkg.id;
                    const depositInr = Math.round(pkg.price_inr * 0.25);
                    const depositUsd = Math.round(pkg.price_usd * 0.25);

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedSprintPackageId(pkg.id)}
                        className={`relative rounded-3xl p-6 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-2 border-sky-500 bg-white shadow-xl ring-4 ring-sky-200/50"
                            : "border border-black/10 bg-white/80 hover:bg-white hover:border-black/20 shadow-sm"
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-3 right-6 rounded-full bg-slate-950 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                            Most Popular
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between">
                            <span className="rounded-md border border-sky-300 bg-sky-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-900">
                              {pkg.turnaround_weeks}
                            </span>
                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${isSelected ? "border-sky-600 bg-sky-600 text-white" : "border-slate-300 bg-white"}`}>
                              {isSelected && <span className="text-xs font-bold">✓</span>}
                            </div>
                          </div>

                          <h3 className="mt-3 text-lg font-black text-slate-950">{pkg.name}</h3>
                          <p className="mt-1 text-xs text-slate-600 line-clamp-2">{pkg.tagline}</p>

                          <div className="mt-4 pt-4 border-t border-black/5">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-slate-950">₹{depositInr.toLocaleString("en-IN")}</span>
                              <span className="text-xs font-bold text-slate-500">(${depositUsd.toLocaleString()})</span>
                            </div>
                            <span className="text-[11px] font-semibold text-sky-700">
                              25% sprint advance deposit
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Total Sprint: ₹{pkg.price_inr.toLocaleString("en-IN")} (${pkg.price_usd.toLocaleString()})
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            {pkg.deliverables.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                                <span className="text-sky-600 font-bold shrink-0">✦</span>
                                <span className="line-clamp-1">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-black/5">
                          <button
                            type="button"
                            disabled={isPayingDeposit}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePayAdvanceDeposit(pkg);
                            }}
                            className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                              isSelected
                                ? "bg-slate-950 text-white hover:bg-slate-800 shadow-md"
                                : "bg-sky-100 hover:bg-sky-200 text-sky-950"
                            }`}
                          >
                            <span>{isPayingDeposit && selectedSprintPackageId === pkg.id ? "Opening Checkout..." : "Pay 25% Deposit & Unlock →"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct Booking & Custom Scope Help */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <div className="rounded-3xl border border-sky-300/70 bg-white/90 p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="text-2xl">🤝</span>
                    <h4 className="mt-3 text-base font-bold text-slate-950">
                      Already in contact with Tanie for a custom scope?
                    </h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      If you're already discussing a tailored milestone agreement, wire transfer, or custom sprint timeline, Tanie will manually link your active workspace within 12 hours.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href="/contact"
                      className="rounded-full bg-slate-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-slate-800 !no-underline"
                    >
                      Send Message to Tanie
                    </Link>
                    <a
                      href="mailto:tanielalwani.work@gmail.com"
                      className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 !no-underline"
                    >
                      Email Tanie ↗
                    </a>
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-gradient-to-br from-slate-950 to-slate-900 text-white p-6 flex flex-col justify-between shadow-md">
                  <div>
                    <span className="text-2xl">🛡️</span>
                    <h4 className="mt-3 text-base font-bold text-white">
                      Guaranteed Security & Transparency
                    </h4>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      Every production sprint is backed by an official service agreement, milestone sign-offs, and encrypted Razorpay transaction receipts. Full IP transfer upon completion.
                    </p>
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/terms"
                      className="inline-flex rounded-full bg-sky-400 hover:bg-sky-300 text-slate-950 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all shadow-md !no-underline"
                    >
                      Review Terms of Service →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ------------------------------------------------------------- */
            /* VIEW 3: AUTHENTICATED CLIENT DASHBOARD / DEMO MODE            */
            /* ------------------------------------------------------------- */
            <div>
              {/* Navigation Tabs */}
              <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-black/10 pb-4">
                {[
                  { id: "overview", label: "Project Overview", icon: "📊" },
                  { id: "payments", label: "Invoices & Payments", icon: "💳", status: paidReceipt ? "Paid ✓" : "Pending" },
                  { id: "changes", label: "Changes & Requests", count: changeRequests.length, icon: "💬" },
                  { id: "assets", label: "Brand Asset Vault", count: assets.length, icon: "📁" },
                  {
                    id: "contracts",
                    label: "E-Contract & Signing",
                    status: contract?.status === "signed" ? "Signed ✓" : "Pending ✍️",
                    icon: "📜",
                  },
                  { id: "packages", label: "Packages & Add-ons", icon: "💎" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-slate-950 text-white shadow-md"
                        : "bg-white/80 text-slate-700 hover:bg-white hover:text-black border border-black/8"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-900 font-bold">
                        {tab.count}
                      </span>
                    )}
                    {tab.status && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          tab.status.includes("Signed") || tab.status.includes("Paid")
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                            : "bg-amber-100 text-amber-900 border border-amber-300"
                        }`}
                      >
                        {tab.status}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && selectedProject && (
                <div className="space-y-8">
                  {/* Project Header Card */}
                  <div className="rounded-[2.2rem] border border-sky-300/70 bg-white/95 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <span className="inline-block rounded-md border border-sky-300 bg-sky-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-sky-900">
                          {selectedProject.company_name || "Active Engagement"}
                        </span>
                        <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">{selectedProject.title}</h2>
                        <p className="mt-1 max-w-2xl text-xs sm:text-sm text-slate-600 font-medium">{selectedProject.description}</p>
                      </div>

                      <div className="rounded-2xl border border-black/8 bg-sky-50/70 p-4 text-right">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Target Launch</div>
                        <div className="text-base font-extrabold text-slate-950">
                          {selectedProject.target_launch_date
                            ? new Date(selectedProject.target_launch_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "October 2026"}
                        </div>
                        <div className="mt-0.5 text-xs font-bold text-emerald-700">On Track • Active Phase</div>
                      </div>
                    </div>

                    {/* Stage Flow Stepper */}
                    <div className="mt-8 border-t border-black/8 pt-6">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                        <span>Project Lifecycle Pipeline</span>
                        <span className="text-sky-800">{selectedProject.progress_percent}% Overall Progress</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 border border-black/5">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-1000 shadow-sm"
                          style={{ width: `${selectedProject.progress_percent}%` }}
                        />
                      </div>

                      {/* Stage Steps */}
                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-6">
                        {stages.map((stage, idx) => {
                          const isDone = idx < currentStageIndex;
                          const isCurrent = idx === currentStageIndex;

                          return (
                            <div
                              key={stage}
                              className={`flex flex-col items-center rounded-xl p-2.5 text-center text-xs transition ${
                                isCurrent
                                  ? "border border-sky-400 bg-sky-100 text-sky-950 font-bold shadow-xs"
                                  : isDone
                                  ? "border border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold"
                                  : "border border-black/5 bg-white/60 text-slate-400"
                              }`}
                            >
                              <span className="text-sm">
                                {isDone ? "✓" : isCurrent ? "⚡" : idx + 1}
                              </span>
                              <span className="mt-1">{stage}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Action Deliverable Links */}
                    <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-black/8">
                      {selectedProject.live_preview_url && (
                        <a
                          href={selectedProject.live_preview_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-sky-300 bg-sky-100 px-4 py-2 text-xs font-bold text-sky-900 hover:bg-sky-200 !no-underline"
                        >
                          <span>🌐 Staging Preview Build</span>
                          <span>↗</span>
                        </a>
                      )}
                      {selectedProject.figma_url && (
                        <a
                          href={selectedProject.figma_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 !no-underline"
                        >
                          <span>🎨 Figma Design System</span>
                          <span>↗</span>
                        </a>
                      )}
                      {selectedProject.github_repo && (
                        <a
                          href={selectedProject.github_repo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 !no-underline"
                        >
                          <span>📦 GitHub Repository</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Milestones and Deliverables Grid */}
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Left 7 Cols: Detailed Milestone Tracker */}
                    <div className="lg:col-span-7 rounded-[2rem] border border-black/8 bg-white/90 p-6 sm:p-8 backdrop-blur-xl shadow-md">
                      <div className="flex items-center justify-between border-b border-black/8 pb-4">
                        <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                          <span>📋</span> Sprint Milestones & Tasks
                        </h3>
                        <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-md border border-sky-200">
                          {selectedProject.milestones?.filter((m) => m.status === "completed").length || 0} / {selectedProject.milestones?.length || 5} Completed
                        </span>
                      </div>

                      <div className="mt-6 space-y-4">
                        {selectedProject.milestones?.map((milestone, idx) => {
                          const isCompleted = milestone.status === "completed";
                          const isInProgress = milestone.status === "in-progress";

                          return (
                            <div
                              key={milestone.id || idx}
                              className={`flex items-start gap-4 rounded-2xl border p-4 transition ${
                                isInProgress
                                  ? "border-sky-400 bg-sky-50/70 shadow-xs"
                                  : isCompleted
                                  ? "border-emerald-200 bg-emerald-50/50"
                                  : "border-black/5 bg-slate-50"
                              }`}
                            >
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                                  isCompleted
                                    ? "bg-emerald-600 text-white"
                                    : isInProgress
                                    ? "bg-sky-600 text-white animate-pulse"
                                    : "bg-slate-200 text-slate-600"
                                }`}
                              >
                                {isCompleted ? "✓" : isInProgress ? "⚡" : idx + 1}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-sm font-bold text-slate-950">{milestone.title}</h4>
                                  <span
                                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                      isCompleted
                                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                        : isInProgress
                                        ? "bg-sky-100 text-sky-900 border border-sky-300"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                                  >
                                    {milestone.status}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{milestone.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right 5 Cols: Deliverables Vault */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="rounded-[2rem] border border-black/8 bg-white/90 p-6 sm:p-8 backdrop-blur-xl shadow-md">
                        <div className="flex items-center justify-between border-b border-black/8 pb-4">
                          <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                            <span>📦</span> Staging & Handover Vault
                          </h3>
                        </div>

                        <div className="mt-6 space-y-3">
                          {selectedProject.deliverables && selectedProject.deliverables.length > 0 ? (
                            selectedProject.deliverables.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between rounded-2xl border border-black/5 bg-slate-50 p-3.5 hover:border-black/15 transition"
                              >
                                <div>
                                  <div className="text-xs font-bold text-slate-950">{item.title}</div>
                                  <div className="text-[10px] text-slate-500">{item.added_at}</div>
                                </div>
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 !no-underline"
                                >
                                  Access ↗
                                </a>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-500 py-6 text-center">
                              Deliverables will be published here as each milestone completes.
                            </p>
                          )}
                        </div>

                        <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-4">
                          <div className="text-xs font-bold uppercase tracking-wider text-sky-900">
                            Need an urgent revision?
                          </div>
                          <p className="mt-1 text-xs text-slate-600">
                            Submit a change request in the tab above or reach out directly.
                          </p>
                          <Link
                            href="/contact"
                            className="mt-2 inline-block text-xs font-bold text-sky-800 hover:text-sky-950 underline !no-underline"
                          >
                            Contact Tanie Lalwani →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INVOICES & PAYMENTS */}
              {activeTab === "payments" && selectedProject && (
                <div className="space-y-8">
                  {/* Success Receipt if paid */}
                  {paidReceipt && (
                    <div className="rounded-[2rem] border border-emerald-300 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white text-2xl font-bold">
                          ✓
                        </div>
                        <div className="flex-1">
                          <span className="inline-block rounded-full bg-emerald-100 border border-emerald-300 px-3 py-0.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                            Payment Settled via Razorpay
                          </span>
                          <h3 className="mt-1 text-xl font-bold text-slate-950">
                            Invoice Settlement Complete
                          </h3>
                          <p className="text-xs text-slate-600 mt-1">
                            Your transaction has been processed. Design tokens and sprint discovery are unlocked.
                          </p>

                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-white p-4 border border-black/8 text-xs">
                            <div>
                              <span className="text-slate-500 block mb-0.5">Razorpay Payment ID:</span>
                              <span className="font-mono font-bold text-slate-900 select-all">{paidReceipt.paymentId}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-0.5">Amount Settled:</span>
                              <span className="font-bold text-emerald-700 text-sm">₹{paidReceipt.amount.toLocaleString()} INR</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-0.5">Timestamp:</span>
                              <span className="text-slate-700">{paidReceipt.date}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-3">
                            <button
                              type="button"
                              onClick={() => window.print()}
                              className="rounded-xl border border-black/15 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                            >
                              🖨️ Print Receipt
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Main Invoice Card */}
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-8 rounded-[2rem] border border-sky-300/80 bg-white/95 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/8 pb-5">
                        <div>
                          <span className="inline-block rounded-md border border-sky-300 bg-sky-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-sky-900">
                            Active Sprint Invoice
                          </span>
                          <h3 className="mt-2 text-xl font-black text-slate-950">
                            Milestone Retainer & Engineering Deposit
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Invoice #{selectedProject.id.toUpperCase()} • Issued to {selectedProject.client_name}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">Total Agreed Scope</span>
                          <span className="text-xl font-black text-slate-950">${selectedProject.budget_usd?.toLocaleString() || "3,499"} USD</span>
                        </div>
                      </div>

                      {/* Breakdown */}
                      <div className="mt-6 space-y-3 text-xs">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
                          <div>
                            <div className="font-bold text-slate-950 text-sm">Sprint Milestone 1: 50% Initial Retainer</div>
                            <div className="text-slate-600 mt-0.5">Covers Discovery, Figma tokens, WebGL shader prototyping & sprint kickoff</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sky-900 text-base">₹1,44,500 INR</div>
                            <div className="text-slate-500 text-[11px]">($1,749 USD)</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-black/5 text-slate-500">
                          <div>
                            <div className="font-semibold text-slate-800">Sprint Milestone 2: 50% Launch Clearance</div>
                            <div className="text-[11px] mt-0.5">Due upon staging review approval & prior to DNS cutover</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-slate-800">₹1,44,500 INR</div>
                            <div className="text-[11px]">($1,749 USD)</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-8 pt-6 border-t border-black/8 flex flex-wrap items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handlePayWithRazorpay(144500, "50% Sprint Retainer Deposit - " + selectedProject.title)}
                          disabled={isPayingWithRazorpay}
                          className="rounded-2xl bg-slate-950 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-slate-800 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          {isPayingWithRazorpay ? (
                            <>
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              <span>Connecting Razorpay...</span>
                            </>
                          ) : (
                            <>
                              <span>💳 Pay Retainer (₹1,44,500) via Razorpay</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePayWithRazorpay(1, "Razorpay Site Verification Test Transaction - ₹1")}
                          disabled={isPayingWithRazorpay}
                          className="rounded-2xl border border-sky-300 bg-sky-50 px-4 py-3.5 text-xs font-bold text-sky-900 hover:bg-sky-100 transition cursor-pointer"
                        >
                          ⚡ Test Transaction (₹1)
                        </button>


                      </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="rounded-[2rem] border border-black/8 bg-white/90 p-6 backdrop-blur-xl shadow-sm">
                        <div className="flex items-center gap-2 text-sky-900 font-bold text-xs uppercase tracking-wider">
                          <span>🔒</span>
                          <span>Razorpay Payments Gateway</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                          All transactions are processed through Razorpay with 256-bit SSL encryption adhering to RBI security directives and PCI-DSS compliance.
                        </p>

                        <div className="mt-4 space-y-2 text-[11px] text-slate-700 border-t border-black/8 pt-3 font-medium">
                          <div className="flex items-center gap-1.5"><span className="text-sky-600 font-bold">✓</span><span>UPI, Credit/Debit Cards, NetBanking</span></div>
                          <div className="flex items-center gap-1.5"><span className="text-sky-600 font-bold">✓</span><span>Instant Automated Invoicing</span></div>
                          <div className="flex items-center gap-1.5"><span className="text-sky-600 font-bold">✓</span><span>Protected Milestone Escrow</span></div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-black/8 bg-white/80 p-5 text-xs text-slate-600 space-y-2">
                        <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Statutory Policies</div>
                        <div className="flex flex-col gap-1.5 text-sky-800 font-medium">
                          <Link href="/terms#terms" className="hover:underline">Terms & Conditions</Link>
                          <Link href="/terms#refunds" className="hover:underline">Cancellation & Refund Policy</Link>
                          <Link href="/terms#privacy" className="hover:underline">Privacy Policy</Link>
                          <Link href="/terms#delivery" className="hover:underline">Delivery Policy</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CHANGES & REQUESTS */}
              {activeTab === "changes" && selectedProject && (
                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-black/8 bg-white/95 p-6 sm:p-8 backdrop-blur-xl shadow-md">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/8 pb-5">
                      <div>
                        <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                          <span>💬</span> Submit a Change Request or Feedback
                        </h3>
                        <p className="mt-1 text-xs text-slate-600">
                          Request design adjustments, button behaviors, content swaps, or scope inquiries.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleChangeSubmit} className="mt-6 space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Request Summary / Title *
                          </label>
                          <input
                            type="text"
                            value={newChangeTitle}
                            onChange={(e) => setNewChangeTitle(e.target.value)}
                            placeholder="e.g. Can we adjust the hero typography? / Add social sharing buttons"
                            required
                            className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Category
                          </label>
                          <select
                            value={newChangeCategory}
                            onChange={(e) => setNewChangeCategory(e.target.value as any)}
                            className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                          >
                            <option value="Design">Design & Visual Aesthetic</option>
                            <option value="Content">Content & Copy Swap</option>
                            <option value="Feature">Interactive Feature</option>
                            <option value="Bug / Fix">Fix / Visual Bug</option>
                            <option value="Other">Scope / Addon / Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Detailed Description & Instructions *
                        </label>
                        <textarea
                          rows={3}
                          value={newChangeDesc}
                          onChange={(e) => setNewChangeDesc(e.target.value)}
                          placeholder="Describe the change you'd like made, which section it affects, and any reference URLs."
                          required
                          className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none resize-none"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span>💡</span>
                          <span>Upload reference files to the Brand Asset Vault for faster implementation.</span>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingChange}
                          className="rounded-xl bg-slate-950 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmittingChange ? "Submitting Request..." : "Submit Change Request →"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 4: ASSETS DROPZONE */}
              {activeTab === "assets" && selectedProject && (
                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-black/8 bg-white/95 p-6 sm:p-8 backdrop-blur-xl shadow-md">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/8 pb-5">
                      <div>
                        <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                          <span>📁</span> Cloud Asset Dropzone & Media Kit
                        </h3>
                        <p className="mt-1 text-xs text-slate-600">
                          Upload vector logos, brand typography, 3D GLB assets, and copy documents directly to secure cloud storage.
                        </p>
                      </div>
                    </div>

                    {/* Upload Box */}
                    <div className="mt-6 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/50 p-8 text-center">
                      <div className="text-3xl mb-2">☁️</div>
                      <div className="text-sm font-bold text-slate-900">Upload Project Brand Assets</div>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Supports SVG, PNG, WebP, PDF, TTF/WOFF2, and 3D GLB/GLTF files.
                      </p>

                      <div className="mt-4 flex items-center justify-center gap-4">
                        <label className="rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition cursor-pointer">
                          {isUploading ? "Uploading..." : "Select Files to Upload"}
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {uploadProgress && (
                        <div className="mt-3 text-xs font-bold text-sky-800 animate-pulse">
                          {uploadProgress}
                        </div>
                      )}
                    </div>

                    {/* Asset List */}
                    <div className="mt-8">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                        Project Media Kit ({assets.length} items)
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assets.map((asset) => (
                          <div
                            key={asset.id}
                            className="flex items-center justify-between rounded-2xl border border-black/8 bg-slate-50 p-4 shadow-xs"
                          >
                            <div className="truncate mr-3">
                              <div className="text-xs font-bold text-slate-900 truncate">{asset.file_name}</div>
                              <div className="text-[10px] text-slate-500">{asset.category}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={asset.public_url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-900 hover:bg-sky-200 !no-underline"
                              >
                                View
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDeleteAsset(asset.id, asset.storage_path)}
                                className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CONTRACTS & SIGNING */}
              {activeTab === "contracts" && selectedProject && (
                <div className="space-y-6">
                  {contract ? (
                    <div className="rounded-[2rem] border border-sky-300/80 bg-white/95 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/8 pb-5">
                        <div>
                          <div className="inline-flex items-center gap-1.5 rounded-md border border-sky-300 bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-900 uppercase tracking-wider">
                            <span>📜</span>
                            <span>Digital Engineering Agreement</span>
                          </div>
                          <h2 className="mt-2 text-2xl font-black text-slate-950">{contract.package_name}</h2>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Client: {contract.client_name} ({contract.client_email})
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3.5 py-1 text-xs font-bold ${
                            contract.status === "signed"
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              : "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                          }`}
                        >
                          {contract.status === "signed" ? "Executed & Signed ✓" : "Pending Signature ✍️"}
                        </span>
                      </div>

                      {/* Contract Scope Grid */}
                      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl border border-black/8 bg-slate-50 p-5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            1. Project Scope & Deliverables
                          </h4>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                            {contract.scope_summary}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-black/8 bg-slate-50 p-5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            2. Total Fee & Payment Schedule
                          </h4>
                          <div className="text-xl font-bold text-slate-950 mb-2">
                            ${contract.total_amount_usd?.toLocaleString() || "3,200"} USD
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                            {contract.payment_terms}
                          </p>
                        </div>

                        <div className="col-span-full rounded-2xl border border-black/8 bg-slate-50 p-5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            3. Legal Terms & Warranties
                          </h4>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                            {contract.legal_terms}
                          </p>
                        </div>
                      </div>

                      {/* Signature Pad Section */}
                      <div className="mt-8 border-t border-black/8 pt-6">
                        {contract.status === "signed" ? (
                          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                                  Legally Executed Signature
                                </div>
                                <div className="text-lg font-bold text-slate-950 mt-1">
                                  {contract.signature_name || contract.client_name}
                                </div>
                                <div className="text-xs text-slate-600 mt-1">
                                  Signed on: {new Date(contract.signed_at || "").toLocaleString()}
                                </div>
                              </div>

                              {contract.signature_url && (
                                <div className="rounded-xl border border-black/10 bg-white p-3">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={contract.signature_url}
                                    alt="Client Signature"
                                    className="h-16 max-w-[200px] object-contain"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                id="agreeTerms"
                                checked={legalAgreed}
                                onChange={(e) => setLegalAgreed(e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-black/20 text-sky-600 focus:ring-sky-400"
                              />
                              <label htmlFor="agreeTerms" className="text-xs text-slate-700 font-medium cursor-pointer">
                                I confirm that I have authority to execute this agreement on behalf of my organization,
                                and agree to the scope, warranty, and milestone terms set forth above.
                              </label>
                            </div>

                            <div className="rounded-2xl border border-black/15 bg-slate-50 p-4">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                                Draw or Type Your Signature Below
                              </h4>
                              <SignaturePad
                                onSave={handleSaveSignature}
                                defaultName={contract.client_name}
                                isSaving={isSigning}
                              />
                            </div>

                            {contractSignedSuccess && (
                              <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-center text-xs font-bold text-emerald-900">
                                🎉 Agreement successfully signed and recorded!
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[2rem] border border-black/8 bg-white/95 p-12 text-center backdrop-blur-xl">
                      <span className="text-4xl">📜</span>
                      <h3 className="mt-3 text-lg font-bold text-slate-950">No Pending Contracts</h3>
                      <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                        All agreements for this sprint are up to date. Once a new milestone contract is created, it will appear here for signature.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: PACKAGES & SPRINT EXPANSIONS */}
              {activeTab === "packages" && (
                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-black/8 bg-white/95 p-6 sm:p-8 backdrop-blur-xl shadow-md">
                    <h3 className="text-xl font-bold text-slate-950">Available Packages & Sprint Expansions</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Expand your project with dedicated sprint modules, AI integrations, or speed optimization packages.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                      {packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className="flex flex-col justify-between rounded-3xl border border-black/8 bg-slate-50 p-6 transition hover:shadow-md"
                        >
                          <div>
                            {pkg.badge && (
                              <span className="inline-block rounded-md bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-900 border border-sky-300">
                                {pkg.badge}
                              </span>
                            )}
                            <h4 className="mt-2 text-lg font-bold text-slate-950">{pkg.name}</h4>
                            <p className="mt-1 text-xs text-slate-500">{pkg.tagline}</p>
                            <div className="mt-4 flex items-baseline gap-2">
                              <span className="text-2xl font-black text-slate-950">${pkg.price_usd}</span>
                              <span className="text-xs text-slate-500">USD / sprint</span>
                            </div>

                            <ul className="mt-5 space-y-2 text-xs text-slate-700">
                              {pkg.features.slice(0, 5).map((feat, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <span className="text-sky-600 font-bold">✓</span>
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-6 border-t border-black/8 pt-4">
                            <Link
                              href="/contact"
                              className="block w-full rounded-xl bg-slate-950 py-2.5 text-center text-xs font-bold text-white transition hover:bg-slate-800 !no-underline"
                            >
                              Request Add-On Sprint →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
