"use client";

import { type ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { LanguageProvider } from "../context/LanguageContext";
import { LoadingProvider } from "../context/LoadingContext";
import { GeoPricingProvider } from "../context/GeoPricingContext";
import { Analytics } from "@vercel/analytics/react";
import AppShell from "./AppShell";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <LoadingProvider>
          <GeoPricingProvider>
            <AppShell>{children}</AppShell>
            <Analytics />
          </GeoPricingProvider>
        </LoadingProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
export default AppProviders;
