"use client";

import React from "react";
import { ClientHubProject } from "./types";

interface ClientHubHeroProps {
  project: ClientHubProject;
}

const STAGES = [
  { key: "not_booked", label: "Reserve" },
  { key: "requested", label: "Requested" },
  { key: "booked_advance_paid", label: "Booked" },
  { key: "handed_over", label: "Handed Over" },
] as const;

function getStageIndex(status: string): number {
  if (status === "handed_over") return 3;
  if (status === "booked_advance_paid") return 2;
  if (status === "contract_ready" || status === "requested") return 1;
  return 0;
}

export default function ClientHubHero({ project }: ClientHubHeroProps) {
  const stageIdx = getStageIndex(project.booking_status);

  return (
    <div className="w-full px-2 sm:px-4 py-1">
      <div className="flex items-center justify-between gap-0 max-w-2xl mx-auto">
        {STAGES.map((stage, i) => {
          const done = i < stageIdx;
          const current = i === stageIdx;
          const isLast = i === STAGES.length - 1;
          return (
            <React.Fragment key={stage.key}>
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                    done
                      ? "bg-[#0a192f] border-[#0a192f] text-white"
                      : current
                      ? "bg-sky-500 border-sky-400 ring-4 ring-sky-400/20 scale-110"
                      : "bg-white/80 border-slate-300"
                  }`}
                >
                  {done && (
                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-bold whitespace-nowrap transition-colors ${
                    current
                      ? "text-[#0a192f] font-extrabold"
                      : done
                      ? "text-slate-600"
                      : "text-slate-400"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mb-5 mx-2 rounded-full transition-all ${
                    i < stageIdx ? "bg-[#0a192f]" : "bg-slate-300/80"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
