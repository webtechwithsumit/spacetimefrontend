"use client";

import { useAnalyticsPlugin } from "@/components/analytics-plugin-provider";

type AnalyticsLicenseGateProps = {
  children: React.ReactNode;
  title?: string;
  mode?: "platform" | "property";
};

export function AnalyticsLicenseGate({
  children,
  title = "Analytics",
  mode = "platform",
}: AnalyticsLicenseGateProps) {
  const {
    isReady,
    isActive,
    status,
    access,
    canViewPlatformAnalytics,
    canViewPropertyAnalytics,
  } = useAnalyticsPlugin();

  const canView =
    mode === "property"
      ? canViewPropertyAnalytics
      : canViewPlatformAnalytics;

  if (!isReady) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        Checking analytics access...
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-8 dark:border-amber-900/50 dark:bg-amber-950/20">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
          {title} is not active
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          SpaceTime Analytics plugin is not enabled on this server.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
          <li>
            Plugin enabled: <strong>{status?.enabled ? "Yes" : "No"}</strong>
          </li>
          <li>
            License active: <strong>{status?.licensed ? "Yes" : "No"}</strong>
          </li>
        </ul>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-8 dark:border-amber-900/50 dark:bg-amber-950/20">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
          {title} not available
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {mode === "property"
            ? "Property analytics is a paid add-on for sellers and brokers. Contact SpaceTime admin to activate analytics for your account."
            : "Platform-wide analytics is available only to SpaceTime admins."}
        </p>
        {access?.subscription && !access.subscription.active ? (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
            Your analytics subscription is inactive or expired.
          </p>
        ) : null}
      </div>
    );
  }

  return children;
}
