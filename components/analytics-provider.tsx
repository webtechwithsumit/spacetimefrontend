"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAnalyticsPlugin } from "@/components/analytics-plugin-provider";
import {
  initAnalytics,
  setAnalyticsTrackingEnabled,
  setupGlobalClickTracking,
  trackPageView,
} from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isActive } = useAnalyticsPlugin();

  useEffect(() => {
    setAnalyticsTrackingEnabled(isActive);
    if (!isActive) return;
    initAnalytics();
    return setupGlobalClickTracking();
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !pathname) return;
    trackPageView(pathname);
  }, [pathname, isActive]);

  return children;
}
