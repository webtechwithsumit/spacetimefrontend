import type { PaginationMeta } from "@/lib/pagination";
import type { AnalyticsDateRange } from "@/lib/analytics-overview";

export type PropertyAnalyticsData = {
  property: {
    id: string;
    title: string;
    city: string;
    category: string;
    buildingType: string;
    microMarketLocality: string;
    auctionStatus: string;
    status: string;
    seller: {
      id: string;
      name: string;
      email: string;
    } | null;
  };
  range: AnalyticsDateRange;
  summary: {
    uniqueVisitors: number;
    registeredVisitors: number;
    guestVisitors: number;
    totalViews: number;
    cardClicks: number;
    pageClicks: number;
    totalClicks: number;
    bidsPlaced: number;
    viewToBidRate: number;
    totalEvents: number;
  };
  viewsOverTime: Array<{
    date: string;
    count: number;
    uniqueVisitors: number;
  }>;
  topClicks: Array<{
    label: string;
    href: string;
    count: number;
  }>;
  trafficSources: Array<{
    path: string;
    count: number;
  }>;
  nextPages: Array<{
    path: string;
    count: number;
  }>;
  searchesBeforeView: Array<{
    query: string;
    category: string;
    city: string;
    buildingType: string;
    count: number;
  }>;
  categoryInterest: Array<{
    category: string;
    count: number;
  }>;
  visitors: Array<{
    visitorKey: string;
    userId: string | null;
    sessionId: string;
    name: string | null;
    email: string | null;
    role: string | null;
    views: number;
    firstSeen: string;
    lastSeen: string;
    journey: Array<{
      event: string;
      path: string;
      properties: Record<string, string | number | boolean>;
      createdAt: string;
    }>;
  }>;
  timeline: Array<{
    id: string;
    event: string;
    properties: Record<string, string | number | boolean>;
    path: string;
    sessionId: string;
    userId: {
      id: string;
      name: string;
      email: string;
      role: string;
    } | null;
    createdAt: string;
  }>;
  pagination: PaginationMeta;
};

export type PropertyAnalyticsResponse = {
  success: boolean;
  message?: string;
  data?: PropertyAnalyticsData;
};
