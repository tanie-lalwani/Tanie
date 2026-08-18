"use client";

import { type ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { LanguageProvider } from "../context/LanguageContext";
import { Analytics } from "@vercel/analytics/react";
import AppShell from "./AppShell";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppShell>{children}</AppShell>
        <Analytics />
      </LanguageProvider>
    </ErrorBoundary>
  );
}
export default AppProviders;
