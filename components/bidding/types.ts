import type { Auction } from "@/components/auction-card";

export type BidProperty = Auction & {
  images: string[];
  area: string;
  buildingType: string;
  status: string;
  address: string;
  pricePerSqft: string;
  startsAt: string;
  description: string;
  details: { label: string; value: string }[];
  bidIncrement?: string;
  currentBidAmount?: number;
  sellerId?: string;
  leadingBidderId?: string | null;
  leadingBidAmount?: number | null;
  userLastBidAmount?: number | null;
};
