"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/components/auth-provider";
import {
  clearAnalyticsAccessCache,
  fetchAnalyticsPluginStatus,
  fetchAnalyticsUserAccess,
  isAnalyticsPluginActive,
  type AnalyticsPluginStatus,
  type AnalyticsUserAccess,
} from "@/lib/analytics-plugin";

type AnalyticsPluginContextValue = {
  status: AnalyticsPluginStatus | null;
  access: AnalyticsUserAccess | null;
  isReady: boolean;
  isActive: boolean;
  canViewPlatformAnalytics: boolean;
  canViewPropertyAnalytics: boolean;
  refresh: () => Promise<void>;
};

const AnalyticsPluginContext =
  createContext<AnalyticsPluginContextValue | null>(null);

export function AnalyticsPluginProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isReady: authReady, user } = useAuth();
  const [status, setStatus] = useState<AnalyticsPluginStatus | null>(null);
  const [access, setAccess] = useState<AnalyticsUserAccess | null>(null);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    clearAnalyticsAccessCache();
    const nextStatus = await fetchAnalyticsPluginStatus(true);

    let nextAccess: AnalyticsUserAccess = {
      role: user?.role ?? null,
      canViewPlatformAnalytics: false,
      canViewPropertyAnalytics: false,
      subscription: null,
    };

    if (isAuthenticated) {
      nextAccess = await fetchAnalyticsUserAccess(true);
    } else if (user?.role === "Admin" || user?.role === "Super-Admin") {
      nextAccess = {
        role: user.role,
        canViewPlatformAnalytics: isAnalyticsPluginActive(nextStatus),
        canViewPropertyAnalytics: isAnalyticsPluginActive(nextStatus),
        subscription: null,
      };
    }

    setStatus(nextStatus);
    setAccess(nextAccess);
    setIsReady(true);
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    if (!authReady) return;
    void refresh();
  }, [authReady, refresh]);

  const value = useMemo(
    () => ({
      status,
      access,
      isReady,
      isActive: isAnalyticsPluginActive(status),
      canViewPlatformAnalytics: Boolean(access?.canViewPlatformAnalytics),
      canViewPropertyAnalytics: Boolean(access?.canViewPropertyAnalytics),
      refresh,
    }),
    [status, access, isReady, refresh],
  );

  return (
    <AnalyticsPluginContext.Provider value={value}>
      {children}
    </AnalyticsPluginContext.Provider>
  );
}

export function useAnalyticsPlugin() {
  const context = useContext(AnalyticsPluginContext);
  if (!context) {
    throw new Error("useAnalyticsPlugin must be used within AnalyticsPluginProvider");
  }
  return context;
}
