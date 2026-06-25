import type { Auction } from "@/components/auction-card/types";
import type { DashboardProperty } from "@/dashboard/components/property/types";
import { isPropertyLive } from "@/lib/auction-stage";
import { getMediaUrl } from "@/lib/media";
import type { PaginatedResponse } from "@/lib/pagination";
import {
  formatIndianNumber,
  parseIndianNumber,
} from "@/lib/property-form-utils";

export const LIVE_AUCTION_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";

export type LiveAuctionProperty = DashboardProperty & {
  currentBidAmount?: number;
  leadingBidderId?: string | null;
  leadingBidAmount?: number | null;
  userLastBidAmount?: number | null;
};

export type LiveAuctionsResponse = PaginatedResponse<LiveAuctionProperty>;

export type LiveAuctionResponse = {
  success: boolean;
  message?: string;
  data?: LiveAuctionProperty;
};

export function formatBidAmount(value?: string | number) {
  if (value == null || value === "") return "—";
  const num =
    typeof value === "number" ? value : parseIndianNumber(String(value));
  if (!num) return "—";
  return `₹${formatIndianNumber(num)}`;
}

export function mapPropertyToAuction(property: LiveAuctionProperty): Auction {
  const location = [property.microMarketLocality, property.city]
    .filter(Boolean)
    .join(", ");

  const currentBidAmount =
    property.currentBidAmount ??
    parseIndianNumber(property.startingBidAmount || "");

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
    currentBid: formatBidAmount(currentBidAmount),
    startingBid: formatBidAmount(property.startingBidAmount),
    isLive: isPropertyLive(property),
  };
}

export function mapPropertyToBidProperty(property: LiveAuctionProperty) {
  const auction = mapPropertyToAuction(property);
  const images = (property.images ?? []).map(getMediaUrl);
  const image = images[0] || LIVE_AUCTION_FALLBACK_IMAGE;

  const currentBidAmount =
    property.currentBidAmount ??
    parseIndianNumber(property.startingBidAmount || "");

  const address =
    [property.address, property.microMarketLocality, property.city, property.state]
      .filter(Boolean)
      .join(", ") || "—";

  const pricePerSqftValue = parseIndianNumber(property.pricePerSqft || "");
  const pricePerSqft = pricePerSqftValue
    ? `₹${formatIndianNumber(pricePerSqftValue)} / Sq.ft`
    : "—";

  const details = [
    { label: "Property Type", value: property.category || "—" },
    { label: "Building Type", value: property.buildingType || "—" },
    {
      label: "Total Area",
      value: property.area || property.totalCarpetArea || "—",
    },
    { label: "City", value: property.city || "—" },
    {
      label: "Starting Bid",
      value: formatBidAmount(property.startingBidAmount),
    },
    { label: "Bid Increment", value: formatBidAmount(property.bidIncrement) },
  ];

  return {
    ...auction,
    images: images.length ? images : [image],
    area: property.area || property.totalCarpetArea || "—",
    buildingType: property.buildingType || property.category || "—",
    status: property.occupancyStatus || property.status || "—",
    address,
    pricePerSqft,
    startsAt: property.auctionStartDateTime || new Date().toISOString(),
    description: property.description?.trim() || "No description available.",
    details,
    bidIncrement: property.bidIncrement || "",
    currentBidAmount,
    sellerId:
      typeof property.sellerId === "string"
        ? property.sellerId
        : property.sellerId?._id,
    leadingBidderId: property.leadingBidderId ?? null,
    leadingBidAmount: property.leadingBidAmount ?? null,
    userLastBidAmount: property.userLastBidAmount ?? null,
  };
}
