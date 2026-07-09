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
  upcomingListings: number;
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

export type DashboardRoleCount = {
  userId: string;
  name: string;
  email: string;
  role: string;
  count: number;
  totalBids?: number;
  leadingCount?: number;
};

export type DashboardPropertyInBidding = {
  propertyId: string;
  title: string;
  city: string;
  microMarketLocality: string;
  totalBids: number;
  currentBidAmount: number;
  leadingBidderName: string | null;
  auctionEndDateTime: string;
};

export type DashboardLatestListing = {
  id: string;
  title: string;
  city: string;
  microMarketLocality: string;
  auctionStatus: string;
  status: string;
  totalPrice: string;
  createdAt: string;
};

export type DashboardClosedAuction = {
  propertyId: string;
  title: string;
  city: string;
  microMarketLocality: string;
  image: string | null;
  totalBids: number;
  winningBid: number;
  winningBidderName: string | null;
  auctionEndDateTime: string;
};

export type DashboardRecentActivity = {
  id: string;
  amount: number;
  createdAt: string;
  userName: string;
  userRole: string;
  propertyId: string;
  propertyTitle: string;
  propertyCity: string;
};

export type DashboardAttentionItem = {
  propertyId: string;
  title: string;
  auctionEndDateTime?: string;
};

export type DashboardNeedsAttention = {
  endingSoon: DashboardAttentionItem[];
  zeroBids: DashboardAttentionItem[];
  openSupportTickets: number;
  draftListings: number;
};

export type DashboardAdminInsights = {
  activityDays: number;
  periodBidCount: number;
  needsAttention: DashboardNeedsAttention;
  roleBreakdown: {
    brokerListings: DashboardRoleCount[];
    sellerListings: DashboardRoleCount[];
    buyerBids: DashboardRoleCount[];
    adminListings: DashboardRoleCount[];
    brokerBids: DashboardRoleCount[];
    sellerBids: DashboardRoleCount[];
  };
  propertiesInBidding: DashboardPropertyInBidding[];
  latestListings: DashboardLatestListing[];
  closedAuctions: DashboardClosedAuction[];
  recentActivity: DashboardRecentActivity[];
};

export type DashboardOverviewData = {
  user: DashboardOverviewUser;
  liveAuctionsCount: number;
  bids?: DashboardBidSummary;
  properties?: DashboardPropertySummary;
  platform?: DashboardPlatformSummary;
  adminInsights?: DashboardAdminInsights;
};

export type DashboardOverviewResponse = {
  success: boolean;
  message?: string;
  data?: DashboardOverviewData;
};
