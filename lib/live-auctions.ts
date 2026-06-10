import type { Auction } from "@/components/auction-card/types";
import type { DashboardProperty } from "@/dashboard/components/property/types";
import { getMediaUrl } from "@/lib/media";

export const LIVE_AUCTION_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";

export type LiveAuctionsResponse = {
  success: boolean;
  message?: string;
  data?: DashboardProperty[];
};

export function formatBidAmount(value?: string) {
  if (!value?.trim()) return "—";
  const cleaned = value.replace(/[,\s₹]/g, "").trim();
  if (!cleaned) return "—";
  return `₹${value.trim()}`;
}

export function mapPropertyToAuction(property: DashboardProperty): Auction {
  const location = [property.microMarketLocality, property.city]
    .filter(Boolean)
    .join(", ");

  return {
    id: property._id,
    image: property.images?.[0]
      ? getMediaUrl(property.images[0])
      : LIVE_AUCTION_FALLBACK_IMAGE,
    imageAlt: property.title,
    category: property.category,
    title: property.title,
    location: location || property.city || "—",
    endsAt: property.auctionEndDateTime || new Date().toISOString(),
    currentBid: formatBidAmount(property.startingBidAmount),
    startingBid: formatBidAmount(property.startingBidAmount),
    isLive: property.auctionStatus === "Live",
  };
}
