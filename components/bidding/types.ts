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
};
