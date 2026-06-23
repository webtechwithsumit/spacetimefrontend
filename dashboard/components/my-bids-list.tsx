"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DataTable, type DataTableColumn } from "@/dashboard/components/data-table";
import { Pagination } from "@/dashboard/components/pagination";
import { api, getApiErrorMessage } from "@/lib/api";
import { formatBidAmount } from "@/lib/live-auctions";
import { getMediaUrl } from "@/lib/media";
import type { MyBidItem, MyBidsResponse } from "@/lib/my-bids";
import {
  buildPaginationParams,
  DEFAULT_PAGINATION,
  ITEMS_PER_PAGE,
  type PaginationMeta,
} from "@/lib/pagination";

type BidColumn = DataTableColumn<MyBidItem>;

const columns: BidColumn[] = [
  { id: "property", label: "Property", visible: true },
  { id: "location", label: "Location", visible: true },
  { id: "myBid", label: "My Highest Bid", visible: true },
  { id: "currentBid", label: "Current Bid", visible: true },
  { id: "status", label: "Status", visible: true },
  { id: "lastBid", label: "Last Bid On", visible: true },
];

function statusBadge(item: MyBidItem) {
  if (item.isLeading) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
        Highest Bidder
      </span>
    );
  }
  if (item.isAuctionEnded) {
    return (
      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        Auction Ended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
      Outbid
    </span>
  );
}

function formatBidDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

export function MyBidsList() {
  const [items, setItems] = useState<MyBidItem[]>([]);
  const [pagination, setPagination] =
    useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMyBids = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get<MyBidsResponse>("/api/bids/my-bids", {
        params: buildPaginationParams(currentPage),
      });

      if (!data.success) {
        setError(data.message || "Failed to load your bids");
        setItems([]);
        setPagination(DEFAULT_PAGINATION);
        return;
      }

      setItems(data.data ?? []);
      setPagination(data.pagination ?? DEFAULT_PAGINATION);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setItems([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchMyBids();
  }, [fetchMyBids]);

  function renderTableCell(item: MyBidItem, column: BidColumn) {
    const location = [item.property.microMarketLocality, item.property.city]
      .filter(Boolean)
      .join(", ");

    switch (column.id) {
      case "property":
        return (
          <div className="flex min-w-[220px] items-center gap-3">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
              {item.property.images?.[0] ? (
                <Image
                  src={getMediaUrl(item.property.images[0])}
                  alt={item.property.title}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-zinc-900 dark:text-white">
                {item.property.title}
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {item.property.category}
              </p>
            </div>
          </div>
        );
      case "location":
        return location || "—";
      case "myBid":
        return (
          <span className="font-semibold text-indigo-700 dark:text-indigo-300">
            {formatBidAmount(item.myHighestBid)}
          </span>
        );
      case "currentBid":
        return (
          <span className="font-semibold text-zinc-900 dark:text-white">
            {formatBidAmount(item.currentBidAmount)}
          </span>
        );
      case "status":
        return statusBadge(item);
      case "lastBid":
        return formatBidDate(item.lastBidAt);
      default:
        return "—";
    }
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
        {error}
      </p>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        loadingMessage="Loading your bids..."
        emptyMessage={
          <div className="py-8 text-center">
            <p className="font-medium text-zinc-700 dark:text-zinc-300">
              No bids placed yet
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Browse live auctions and place your first bid.
            </p>
            <Link
              href="/dashboard/auctions"
              className="mt-4 inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 dark:bg-white dark:text-zinc-900"
            >
              View Live Auctions
            </Link>
          </div>
        }
        getRowKey={(item) => item.propertyId}
        renderTableCell={renderTableCell}
        currentPage={pagination.page}
        renderActions={(item) => (
          <Link
            href={`/auctions/${item.propertyId}`}
            className="inline-flex items-center rounded-lg border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-950/30"
          >
            View Property
          </Link>
        )}
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
