"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BiddingForm } from "@/components/bidding/bidding-form";
import { PropertyGallery } from "@/components/bidding/property-gallery";
import { PropertyTabs } from "@/components/bidding/property-tabs";
import type { BidProperty } from "@/components/bidding/types";
import { api, getApiErrorMessage } from "@/lib/api";
import { track } from "@/lib/analytics";
import {
  mapPropertyToBidProperty,
  type LiveAuctionResponse,
} from "@/lib/live-auctions";

type PropertyPageContentProps = {
  propertyId: string;
};

export function PropertyPageContent({ propertyId }: PropertyPageContentProps) {
  const [property, setProperty] = useState<BidProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProperty = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get<LiveAuctionResponse>(
        `/api/properties/live-auctions/${propertyId}`,
      );

      if (!data.success || !data.data) {
        setError(data.message || "Property not found");
        setProperty(null);
        return;
      }

      setProperty(mapPropertyToBidProperty(data.data));
      track("auction_viewed", {
        propertyId,
        city: data.data.city || "",
        category: data.data.category || "",
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load property"));
      setProperty(null);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-48 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="aspect-[4/3] rounded-xl bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-[640px] rounded-xl bg-zinc-100 dark:bg-zinc-900" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900/50 dark:bg-red-950/30">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
          {error || "Property not found"}
        </h2>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          This property may no longer be available.
        </p>
        <Link
          href="/auctions"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-indigo-500 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
        >
          Back to Auctions
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <PropertyGallery
          images={property.images}
          alt={property.imageAlt}
          isLive={property.isLive}
        />
        <BiddingForm property={property} onBidPlaced={fetchProperty} />
      </div>

      <PropertyTabs property={property} />
    </>
  );
}

/** @deprecated Use PropertyPageContent */
export const BidPageContent = PropertyPageContent;
