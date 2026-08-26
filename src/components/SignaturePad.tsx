"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface SignaturePadProps {
  onSave: (dataUrl: string, signatureName: string) => void;
  defaultName?: string;
  isSaving?: boolean;
}

export default function SignaturePad({
  onSave,
  defaultName = "",
  isSaving = false,
}: SignaturePadProps) {
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typedName, setTypedName] = useState(defaultName);
  const [inkColor, setInkColor] = useState<string>("#38bdf8"); // Ocean Cyan
  const [hasDrawn, setHasDrawn] = useState(false);
  const [fontStyle, setFontStyle] = useState<"cursive" | "serif" | "modern">("cursive");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize Canvas
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get display size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2.5;

    // Subtle background guideline line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, rect.height - 35);
    ctx.lineTo(rect.width - 30, rect.height - 35);
    ctx.stroke();

    // Reset stroke style
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2.5;
  }, [inkColor]);

  useEffect(() => {
    setupCanvas();
    const handleResize = () => setupCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setupCanvas]);

  // Drawing Handlers
  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const coords = getCanvasCoordinates(e);
    lastPointRef.current = coords;
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);
    if (!lastPointRef.current) {
      lastPointRef.current = coords;
      return;
    }

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    lastPointRef.current = coords;
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    // Redraw guide line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, rect.height - 35);
    ctx.lineTo(rect.width - 30, rect.height - 35);
    ctx.stroke();

    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2.5;
    setHasDrawn(false);
  };

  // Convert typed name to canvas image for uniform storage
  const generateTypedSignatureDataUrl = (): string => {
    const offscreen = document.createElement("canvas");
    offscreen.width = 600;
    offscreen.height = 200;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return "";

    ctx.fillStyle = inkColor;
    if (fontStyle === "cursive") {
      ctx.font = "italic 44px 'Brush Script MT', 'Dancing Script', 'Caveat', cursive";
    } else if (fontStyle === "serif") {
      ctx.font = "italic 36px 'Bodoni Moda', 'Didot', 'Georgia', serif";
    } else {
      ctx.font = "600 32px 'Inter', sans-serif";
    }
    ctx.textBaseline = "middle";
    ctx.fillText(typedName.trim() || "Client Signature", 40, 100);

    // Add legal timestamp microtext
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fillText(`Digitally Authenticated • ${new Date().toUTCString()}`, 40, 160);

    return offscreen.toDataURL("image/png");
  };

  const handleConfirmSignature = () => {
    if (mode === "draw") {
      if (!canvasRef.current || !hasDrawn) {
        alert("Please draw your signature before confirming.");
        return;
      }
      const dataUrl = canvasRef.current.toDataURL("image/png");
      onSave(dataUrl, defaultName || "Client Signature");
    } else {
      if (!typedName.trim()) {
        alert("Please type your full legal name.");
        return;
      }
      const dataUrl = generateTypedSignatureDataUrl();
      onSave(dataUrl, typedName.trim());
    }
  };

  return (
    <div className="rounded-2xl border border-sky-400/20 bg-slate-950/80 p-5 backdrop-blur-xl shadow-2xl">
      {/* Mode & Ink Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
        <div className="flex items-center gap-1.5 rounded-full bg-slate-900/90 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => setMode("draw")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
              mode === "draw"
                ? "bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Draw Signature
          </button>
          <button
            type="button"
            onClick={() => setMode("type")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
              mode === "type"
                ? "bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Type Name
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Ink:</span>
          <div className="flex items-center gap-1.5">
            {[
              { label: "Cyan", color: "#38bdf8" },
              { label: "White", color: "#ffffff" },
              { label: "Emerald", color: "#34d399" },
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => setInkColor(c.color)}
                style={{ backgroundColor: c.color }}
                className={`h-5 w-5 rounded-full transition-transform ${
                  inkColor === c.color ? "scale-125 ring-2 ring-white/60" : "opacity-60 hover:opacity-100"
                }`}
                aria-label={`Select ${c.label} ink`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Signature Canvas Area */}
      <div className="mt-4 relative">
        {mode === "draw" ? (
          <div className="relative rounded-xl border border-dashed border-sky-400/30 bg-slate-900/50 p-2 overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="h-44 w-full cursor-crosshair touch-none"
            />
            <div className="pointer-events-none absolute bottom-3 left-4 text-[11px] uppercase tracking-widest text-slate-500">
              Sign above the line using finger, stylus, or cursor
            </div>
            {hasDrawn && (
              <button
                type="button"
                onClick={clearCanvas}
                className="absolute top-3 right-3 rounded-md bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white border border-white/10"
              >
                Clear
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-sky-400/30 bg-slate-900/50 p-5">
            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
              Legal Full Name
            </label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="e.g. Alex Sterling"
              className="w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />

            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-slate-400">Style:</span>
              {(["cursive", "serif", "modern"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setFontStyle(style)}
                  className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition ${
                    fontStyle === style
                      ? "bg-sky-500/20 text-sky-300 border border-sky-400/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-white/6 bg-slate-950/90 p-5 text-center min-h-[90px] flex items-center justify-center">
              <span
                style={{
                  color: inkColor,
                  fontFamily:
                    fontStyle === "cursive"
                      ? "'Brush Script MT', 'Dancing Script', cursive"
                      : fontStyle === "serif"
                      ? "var(--font-display), serif"
                      : "var(--font-ui), sans-serif",
                  fontStyle: fontStyle !== "modern" ? "italic" : "normal",
                  fontSize: fontStyle === "cursive" ? "2.2rem" : "1.8rem",
                }}
              >
                {typedName.trim() || "Alex Sterling"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation CTA */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/8">
        <p className="text-xs text-slate-400">
          By signing, you agree to execute this e-contract legally with timestamp metadata.
        </p>
        <button
          type="button"
          disabled={isSaving}
          onClick={handleConfirmSignature}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all hover:brightness-110 disabled:opacity-50"
        >
          {isSaving ? "Authenticating Signature..." : "Apply & Sign Contract"}
        </button>
      </div>
    </div>
  );
}
