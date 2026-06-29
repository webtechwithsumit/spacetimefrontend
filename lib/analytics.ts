import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/api-config";
import { getStoredToken } from "@/lib/auth";

export const ANALYTICS_EVENTS = [
  "page_view",
  "auction_viewed",
  "bid_placed",
  "signup_completed",
  "login",
  "property_created",
  "logout",
  "click",
  "property_card_click",
  "property_search",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

const SESSION_KEY = "st_analytics_session";
const BATCH_SIZE = 20;
const FLUSH_INTERVAL_MS = 2500;
const CLICK_DEDUPE_MS = 400;

let initialized = false;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const eventQueue: Array<{
  event: AnalyticsEventName;
  properties?: AnalyticsProperties;
  path?: string;
}> = [];

let lastClickSignature = "";
let lastClickAt = 0;

function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function initAnalytics() {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushEventQueue();
  }, FLUSH_INTERVAL_MS);
}

async function flushEventQueue() {
  if (!eventQueue.length || typeof window === "undefined") return;

  const batch = eventQueue.splice(0, BATCH_SIZE);
  const path = window.location.pathname;

  try {
    await api.post("/api/analytics/events", {
      events: batch.map((item) => ({
        event: item.event,
        properties: item.properties,
        sessionId: getSessionId(),
        path: item.path ?? path,
      })),
    });
  } catch {
    eventQueue.unshift(...batch);
    scheduleFlush();
    return;
  }

  if (eventQueue.length) {
    scheduleFlush();
  }
}

function queueEvent(
  event: AnalyticsEventName,
  properties?: AnalyticsProperties,
  path?: string,
  immediate = false,
) {
  if (typeof window === "undefined") return;

  eventQueue.push({ event, properties, path });

  if (immediate || eventQueue.length >= BATCH_SIZE) {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    void flushEventQueue();
    return;
  }

  scheduleFlush();
}

export function track(
  event: AnalyticsEventName,
  properties?: AnalyticsProperties,
  path?: string,
) {
  const immediateEvents: AnalyticsEventName[] = [
    "bid_placed",
    "login",
    "signup_completed",
    "logout",
    "property_created",
  ];
  queueEvent(event, properties, path, immediateEvents.includes(event));
}

export function trackPageView(path: string) {
  track("page_view", { path }, path);
}

export function trackPropertySearch(
  properties: {
    query?: string;
    category?: string;
    city?: string;
    buildingType?: string;
    source: string;
    resultCount?: number;
  },
  path?: string,
) {
  track("property_search", properties, path);
}

export function trackPropertyCardClick(
  propertyId: string,
  properties?: AnalyticsProperties,
) {
  track(
    "property_card_click",
    { propertyId, ...properties },
    `/auctions/${propertyId}`,
  );
}

export type ClickTrackProperties = {
  tag: string;
  text: string;
  href: string;
  elementId: string;
  analyticsId: string;
  className: string;
  path: string;
};

export function trackClick(properties: ClickTrackProperties) {
  if (typeof window === "undefined") return;

  const signature = [
    properties.path,
    properties.analyticsId,
    properties.elementId,
    properties.href,
    properties.text,
    properties.tag,
  ].join("|");

  const now = Date.now();
  if (signature === lastClickSignature && now - lastClickAt < CLICK_DEDUPE_MS) {
    return;
  }

  lastClickSignature = signature;
  lastClickAt = now;

  queueEvent("click", properties, properties.path);
}

export function identifyUser(
  _userId: string,
  _traits?: AnalyticsProperties,
) {
  // Custom analytics links activity via authenticated API requests.
}

export function resetAnalyticsUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  lastClickSignature = "";
  lastClickAt = 0;
}

export function setupGlobalClickTracking() {
  if (typeof window === "undefined") return () => {};

  const handleClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest('input[type="password"], [data-no-track]')) return;

    const interactive = target.closest(
      "a, button, [role='button'], input, select, textarea, label, [data-track-click]",
    );

    const element = interactive ?? target;
    const tag = element.tagName.toLowerCase();
    const text = (
      element.getAttribute("aria-label") ||
      element.getAttribute("title") ||
      (element instanceof HTMLElement ? element.innerText : "") ||
      ""
    )
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80);

    const href =
      element.closest("a")?.getAttribute("href") ||
      element.getAttribute("href") ||
      "";

    const analyticsId =
      element.getAttribute("data-analytics-id") ||
      element.closest("[data-analytics-id]")?.getAttribute("data-analytics-id") ||
      "";

    const elementId = element.id || "";
    const className =
      typeof element.className === "string"
        ? element.className.replace(/\s+/g, " ").trim().slice(0, 80)
        : "";

    if (
      !interactive &&
      !text &&
      !href &&
      !analyticsId &&
      !["a", "button", "input", "select", "textarea", "label"].includes(tag)
    ) {
      return;
    }

    trackClick({
      tag,
      text: text || tag,
      href: href.slice(0, 200),
      elementId: elementId.slice(0, 64),
      analyticsId: analyticsId.slice(0, 64),
      className,
      path: window.location.pathname,
    });
  };

  document.addEventListener("click", handleClick, true);

  const handleUnload = () => {
    if (!eventQueue.length) return;

    const path = window.location.pathname;
    const payload = JSON.stringify({
      events: eventQueue.splice(0, BATCH_SIZE).map((item) => ({
        event: item.event,
        properties: item.properties,
        sessionId: getSessionId(),
        path: item.path ?? path,
      })),
    });

    const token = getStoredToken();
    void fetch(`${API_BASE_URL}/api/analytics/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: payload,
      keepalive: true,
    });
  };

  window.addEventListener("pagehide", handleUnload);

  return () => {
    document.removeEventListener("click", handleClick, true);
    window.removeEventListener("pagehide", handleUnload);
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
  };
}
