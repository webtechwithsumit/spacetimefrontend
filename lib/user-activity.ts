import type { PaginationMeta } from "@/lib/pagination";
import type { AnalyticsDateRange } from "@/lib/analytics-overview";

export type ActivityUserRow = {
  userId: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  totalEvents: number;
  clicks: number;
  pageViews: number;
  sessionCount: number;
  firstActivityAt: string;
  lastActivityAt: string;
};

export type GuestSessionRow = {
  sessionId: string;
  totalEvents: number;
  clicks: number;
  pageViews: number;
  lastPath: string;
  firstActivityAt: string;
  lastActivityAt: string;
};

export type ActivityTimelineItem = {
  id: string;
  event: string;
  properties: Record<string, string | number | boolean>;
  path: string;
  sessionId: string;
  userId: string | null;
  createdAt: string;
};

export type UserActivityData = {
  range: AnalyticsDateRange;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    createdAt: string;
  } | null;
  sessionId: string | null;
  summary: {
    totalEvents: number;
    clicks: number;
    pageViews: number;
    auctionViews: number;
    bids: number;
  };
  journey: Array<{
    path: string;
    firstSeen: string;
    lastSeen: string;
    views: number;
  }>;
  topClicks: Array<{
    label: string;
    href: string;
    path: string;
    count: number;
  }>;
  timeline: ActivityTimelineItem[];
  pagination: PaginationMeta;
};

export type ActivityUsersResponse = {
  success: boolean;
  message?: string;
  data?: ActivityUserRow[];
  pagination?: PaginationMeta;
  range?: AnalyticsDateRange;
};

export type GuestSessionsResponse = {
  success: boolean;
  message?: string;
  data?: GuestSessionRow[];
  pagination?: PaginationMeta;
  range?: AnalyticsDateRange;
};

export type UserActivityResponse = {
  success: boolean;
  message?: string;
  data?: UserActivityData;
};

export function formatActivityTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

export function getEventLabel(event: string) {
  return event.replaceAll("_", " ");
}

export function getEventBadgeClass(event: string) {
  if (event === "click") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  }
  if (event === "page_view") {
    return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
  }
  if (event === "bid_placed") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (event === "auction_viewed") {
    return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300";
  }
  if (event === "property_card_click") {
    return "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300";
  }
  if (event === "property_search") {
    return "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300";
  }
  if (event === "login" || event === "signup_completed") {
    return "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300";
  }
  return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
}

export function describeTimelineItem(item: ActivityTimelineItem) {
  if (item.event === "click") {
    const label =
      String(item.properties.analyticsId || item.properties.text || "Element");
    const href = item.properties.href ? ` → ${item.properties.href}` : "";
    return `Clicked "${label}"${href}`;
  }

  if (item.event === "page_view") {
    return `Visited ${item.path || item.properties.path || "a page"}`;
  }

  if (item.event === "auction_viewed") {
    return `Viewed auction ${item.properties.propertyId || ""}`.trim();
  }

  if (item.event === "bid_placed") {
    return `Placed bid on ${item.properties.propertyId || "property"}`;
  }

  if (item.event === "login") {
    return `Logged in (${item.properties.role || "user"})`;
  }

  if (item.event === "signup_completed") {
    return `Signed up as ${item.properties.role || "user"}`;
  }

  if (item.event === "logout") {
    return "Logged out";
  }

  if (item.event === "property_created") {
    return `Created property ${item.properties.propertyId || ""}`.trim();
  }

  if (item.event === "property_card_click") {
    return `Clicked property card ${item.properties.propertyId || ""} from ${item.properties.source || "listing"}`;
  }

  if (item.event === "property_search") {
    const parts = [
      item.properties.query ? `"${item.properties.query}"` : "",
      item.properties.category ? `category: ${item.properties.category}` : "",
      item.properties.city ? `city: ${item.properties.city}` : "",
    ].filter(Boolean);
    return `Searched properties ${parts.join(", ") || ""}`.trim();
  }

  return getEventLabel(item.event);
}
