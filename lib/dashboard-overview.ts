export type DashboardOverviewUser = {
  name: string;
  role: string;
  email: string;
};

export type DashboardRecentBid = {
  propertyId: string;
  title: string;
  city: string;
  microMarketLocality: string;
  image: string | null;
  myHighestBid: number;
  currentBidAmount: number;
  lastBidAt: string;
  isLeading: boolean;
  isAuctionLive: boolean;
  isAuctionEnded: boolean;
};

export type DashboardBidSummary = {
  myBidsCount: number;
  leadingBidsCount: number;
  outbidCount: number;
  endedBidsCount: number;
  recentBids: DashboardRecentBid[];
};

export type DashboardRecentProperty = {
  id: string;
  title: string;
  city: string;
  microMarketLocality: string;
  image: string | null;
  auctionStatus: string;
  status: string;
  updatedAt: string;
};

export type DashboardPropertySummary = {
  totalProperties: number;
  liveListings: number;
  scheduledListings: number;
  endedListings: number;
  draftListings: number;
  recentProperties: DashboardRecentProperty[];
};

export type DashboardPlatformSummary = {
  totalUsers: number;
  totalBuyers: number;
  totalSellers: number;
  totalBrokers: number;
  totalAdmins: number;
  totalProperties: number;
  liveAuctions: number;
  totalBids: number;
};

export type DashboardOverviewData = {
  user: DashboardOverviewUser;
  liveAuctionsCount: number;
  bids?: DashboardBidSummary;
  properties?: DashboardPropertySummary;
  platform?: DashboardPlatformSummary;
};

export type DashboardOverviewResponse = {
  success: boolean;
  message?: string;
  data?: DashboardOverviewData;
};
