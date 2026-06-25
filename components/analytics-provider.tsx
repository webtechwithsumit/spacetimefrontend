"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  initAnalytics,
  setupGlobalClickTracking,
  trackPageView,
} from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initAnalytics();
    return setupGlobalClickTracking();
  }, []);

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return children;
}
