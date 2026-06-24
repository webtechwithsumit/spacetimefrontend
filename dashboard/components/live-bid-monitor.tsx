"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/dashboard/components/page-header";
import { api, getApiErrorMessage } from "@/lib/api";
import { formatBidAmount } from "@/lib/live-auctions";
import type {
  LiveBidMonitorItem,
  LiveBidMonitorResponse,
} from "@/lib/live-bid-monitor";
import { getMediaUrl } from "@/lib/media";

function formatDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

function PropertyBidCard({ item }: { item: LiveBidMonitorItem }) {
  const [open, setOpen] = useState(true);
  const location = [item.microMarketLocality, item.city].filter(Boolean).join(", ");

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start gap-4 border-b border-zinc-200 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
      >
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
          {item.image ? (
            <Image
              src={getMediaUrl(item.image)}
              alt={item.title}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {item.title}
            </h3>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Live
            </span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {location || "—"} · Ends {formatDate(item.auctionEndDateTime)}
          </p>
          <div className="mt-2 flex flex-wrap gap-4 text-xs">
            <span>
              <span className="text-zinc-500">Current bid:</span>{" "}
              <strong>{formatBidAmount(item.currentBidAmount)}</strong>
            </span>
            <span>
              <span className="text-zinc-500">Bidders:</span>{" "}
              <strong>{item.uniqueBidders}</strong>
            </span>
            <span>
              <span className="text-zinc-500">Total bids:</span>{" "}
              <strong>{item.totalBids}</strong>
            </span>
          </div>
          {item.leadingBidder ? (
            <p className="mt-1.5 text-xs text-emerald-700 dark:text-emerald-300">
              Leading: <strong>{item.leadingBidder.name}</strong> (
              {formatBidAmount(item.leadingBidder.amount)})
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-zinc-500">No bids yet</p>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`mt-1 size-5 shrink-0 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div className="px-4 py-3">
          {item.bids.length === 0 ? (
            <p className="py-4 text-center text-sm text-zinc-500">
              No bids placed on this property yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                    <th className="px-2 py-2 font-medium">#</th>
                    <th className="px-2 py-2 font-medium">Bidder</th>
                    <th className="px-2 py-2 font-medium">Email</th>
                    <th className="px-2 py-2 font-medium">Bid Amount</th>
                    <th className="px-2 py-2 font-medium">Bid Time</th>
                    <th className="px-2 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {item.bids.map((bid, index) => (
                    <tr
                      key={bid.bidId}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60"
                    >
                      <td className="px-2 py-2.5 tabular-nums text-zinc-500">
                        {item.bids.length - index}
                      </td>
                      <td className="px-2 py-2.5 font-medium text-zinc-900 dark:text-white">
                        {bid.name}
                        <span className="ml-1 text-xs font-normal text-zinc-400">
                          ({bid.role})
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-zinc-600 dark:text-zinc-300">
                        {bid.email}
                      </td>
                      <td className="px-2 py-2.5 font-semibold tabular-nums">
                        {formatBidAmount(bid.amount)}
                      </td>
                      <td className="px-2 py-2.5 text-xs text-zinc-500">
                        {formatDate(bid.createdAt)}
                      </td>
                      <td className="px-2 py-2.5">
                        {bid.isLeading ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            Leading
                          </span>
                        ) : (
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                            Outbid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-3 flex justify-end">
            <Link
              href={`/auctions/${item.propertyId}`}
              className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              View property →
            </Link>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function LiveBidMonitor() {
  const [items, setItems] = useState<LiveBidMonitorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMonitor = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get<LiveBidMonitorResponse>(
        "/api/bids/live-monitor",
      );

      if (!data.success) {
        setError(data.message || "Failed to load bid monitor");
        setItems([]);
        return;
      }

      setItems(data.data ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitor();
  }, [fetchMonitor]);

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Live Bid Monitor"
          description="Track active auctions and every bid placed on each property."
        />
        <button
          type="button"
          onClick={fetchMonitor}
          className="shrink-0 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
          <h2 className="text-sm font-semibold">No live auctions with bidding</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Properties go live when their auction status is set to Live.
          </p>
          <Link
            href="/dashboard/property"
            className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Manage properties
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {items.length} live auction{items.length === 1 ? "" : "s"}
          </p>
          {items.map((item) => (
            <PropertyBidCard key={item.propertyId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
