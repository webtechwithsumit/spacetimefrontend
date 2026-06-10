"use client";

import { useCallback, useEffect, useState } from "react";
import { AuctionCard } from "@/components/auction-card/auction-card";
import type { Auction } from "@/components/auction-card/types";
import { api, getApiErrorMessage } from "@/lib/api";
import {
  mapPropertyToAuction,
  type LiveAuctionsResponse,
} from "@/lib/live-auctions";

type LiveAuctionsListProps = {
  gridClassName?: string;
  skeletonCount?: number;
};

export function LiveAuctionsList({
  gridClassName = "sm:grid-cols-2 xl:grid-cols-3",
  skeletonCount = 3,
}: LiveAuctionsListProps) {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLiveAuctions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get<LiveAuctionsResponse>(
        "/api/properties/live-auctions",
      );
      if (!data.success) {
        setError(data.message || "Failed to load live auctions");
        setAuctions([]);
        return;
      }
      setAuctions((data.data ?? []).map(mapPropertyToAuction));
    } catch (err) {
      setError(getApiErrorMessage(err));
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveAuctions();
  }, [fetchLiveAuctions]);

  if (loading) {
    return (
      <div className={`grid gap-6 ${gridClassName}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div
            key={index}
            className="h-96 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
        {error}
      </p>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-12 text-center dark:border-indigo-900/50 dark:bg-indigo-950/30">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200">
          No live auctions right now
        </h3>
        <p className="mt-2 text-sm text-indigo-700 dark:text-indigo-300">
          Check back soon — new properties go under the hammer here.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${gridClassName}`}>
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
}
