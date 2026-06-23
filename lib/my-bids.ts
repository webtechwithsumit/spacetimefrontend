import type { DashboardProperty } from "@/dashboard/components/property/types";
import type { PaginatedResponse } from "@/lib/pagination";

export type MyBidItem = {
  propertyId: string;
  property: DashboardProperty & {
    currentBidAmount?: number;
    leadingBidderId?: string | null;
  };
  myHighestBid: number;
  lastBidAt: string;
  totalBids: number;
  currentBidAmount: number;
  isLeading: boolean;
  isAuctionLive: boolean;
  isAuctionEnded: boolean;
};

export type MyBidsResponse = PaginatedResponse<MyBidItem>;
