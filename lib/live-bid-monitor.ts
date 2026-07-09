export type LiveBidMonitorBid = {
  bidId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  amount: number;
  createdAt: string;
  isLeading: boolean;
};

export type LiveBidMonitorItem = {
  propertyId: string;
  title: string;
  city: string;
  microMarketLocality: string;
  category: string;
  image: string | null;
  startingBidAmount: number;
  currentBidAmount: number;
  auctionStartDateTime: string;
  auctionEndDateTime: string;
  auctionStatus?: string;
  auctionStage: "live" | "ended" | "other";
  totalBids: number;
  uniqueBidders: number;
  leadingBidder: {
    userId: string;
    name: string;
    email: string;
    amount: number;
  } | null;
  bids: LiveBidMonitorBid[];
};

export type LiveBidMonitorResponse = {
  success: boolean;
  message?: string;
  data?: LiveBidMonitorItem[];
};
