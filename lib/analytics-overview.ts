export type AnalyticsDateRange = {
  from: string;
  to: string;
};

export type AnalyticsOverviewData = {
  range: AnalyticsDateRange;
  summary: {
    totalUsers: number;
    totalBuyers: number;
    totalSellers: number;
    totalBrokers: number;
    totalAdmins: number;
    totalProperties: number;
    liveAuctions: number;
    totalBids: number;
    newUsersInRange: number;
    newBidsInRange: number;
    avgBidAmount: number;
    auctionViews: number;
    bidPlacedEvents: number;
    clickEvents: number;
    viewToBidRate: number;
  };
  propertyStats: {
    live: number;
    upcoming: number;
    ended: number;
    draft: number;
  };
  bidsOverTime: Array<{
    date: string;
    count: number;
    totalAmount: number;
  }>;
  usersOverTime: Array<{
    date: string;
    count: number;
  }>;
  usersByRole: Array<{
    role: string;
    count: number;
  }>;
  bidsByCity: Array<{
    city: string;
    count: number;
    totalAmount: number;
  }>;
  bidsByCategory: Array<{
    category: string;
    count: number;
  }>;
  topAuctions: Array<{
    propertyId: string;
    title: string;
    city: string;
    bidCount: number;
    topBid: number;
  }>;
  eventsOverTime: Array<{
    date: string;
    event: string;
    count: number;
  }>;
  eventCounts: Record<string, number>;
};

export type AnalyticsOverviewResponse = {
  success: boolean;
  message?: string;
  data?: AnalyticsOverviewData;
};

export function formatAnalyticsDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getDefaultAnalyticsRange(days = 30) {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);

  return {
    from: formatAnalyticsDateInput(from),
    to: formatAnalyticsDateInput(to),
  };
}
