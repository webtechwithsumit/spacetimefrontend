import { api } from "@/lib/api";

export type AnalyticsPluginStatus = {
  plugin: string;
  enabled: boolean;
  active: boolean;
  features: string[];
};

export type AnalyticsUserSubscription = {
  enabled: boolean;
  active: boolean;
  plan: string;
  features: string[];
  expiresAt: string | null;
  activatedAt: string | null;
};

export type AnalyticsUserAccess = {
  role: string | null;
  canViewPlatformAnalytics: boolean;
  canViewPropertyAnalytics: boolean;
  subscription: AnalyticsUserSubscription | null;
};

export type AnalyticsAccessData = {
  platform: AnalyticsPluginStatus;
} & AnalyticsUserAccess;

type AnalyticsStatusResponse = {
  success: boolean;
  data?: AnalyticsPluginStatus;
};

type AnalyticsAccessResponse = {
  success: boolean;
  data?: AnalyticsAccessData;
};

let cachedStatus: AnalyticsPluginStatus | null = null;
let cachedAccess: AnalyticsUserAccess | null = null;
let cacheExpiresAt = 0;

const defaultStatus = (): AnalyticsPluginStatus => ({
  plugin: "spacetime-analytics",
  enabled: false,
  active: false,
  features: [],
});

const defaultAccess = (): AnalyticsUserAccess => ({
  role: null,
  canViewPlatformAnalytics: false,
  canViewPropertyAnalytics: false,
  subscription: null,
});

export async function fetchAnalyticsPluginStatus(force = false) {
  const now = Date.now();
  if (!force && cachedStatus && cacheExpiresAt > now) {
    return cachedStatus;
  }

  try {
    const { data } = await api.get<AnalyticsStatusResponse>("/api/analytics/status");
    cachedStatus = data.data ?? defaultStatus();
  } catch {
    cachedStatus = defaultStatus();
  }

  cacheExpiresAt = now + 30_000;
  return cachedStatus;
}

export async function fetchAnalyticsUserAccess(force = false) {
  const now = Date.now();
  if (!force && cachedAccess && cacheExpiresAt > now) {
    return cachedAccess;
  }

  try {
    const { data } = await api.get<AnalyticsAccessResponse>("/api/analytics/access");
    if (data.data) {
      cachedStatus = data.data.platform;
      cachedAccess = {
        role: data.data.role,
        canViewPlatformAnalytics: data.data.canViewPlatformAnalytics,
        canViewPropertyAnalytics: data.data.canViewPropertyAnalytics,
        subscription: data.data.subscription,
      };
    } else {
      cachedAccess = defaultAccess();
    }
  } catch {
    cachedAccess = defaultAccess();
  }

  cacheExpiresAt = now + 30_000;
  return cachedAccess;
}

export function clearAnalyticsAccessCache() {
  cachedAccess = null;
  cacheExpiresAt = 0;
}

export function isAnalyticsPluginActive(status: AnalyticsPluginStatus | null) {
  return Boolean(status?.active);
}

export function hasAnalyticsFeature(
  status: AnalyticsPluginStatus | null,
  feature: string,
) {
  return Boolean(status?.active && status.features.includes(feature));
}
