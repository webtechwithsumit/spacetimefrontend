"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AuctionCard } from "@/components/auction-card/auction-card";
import type { Auction } from "@/components/auction-card/types";
import { Pagination } from "@/components/pagination";
import { PROPERTY_CATEGORIES } from "@/dashboard/constants/property";
import { api, getApiErrorMessage } from "@/lib/api";
import { trackPropertySearch } from "@/lib/analytics";
import {
  mapPropertyToAuction,
  type LiveAuctionsResponse,
} from "@/lib/live-auctions";
import {
  buildPaginationParams,
  DEFAULT_PAGINATION,
  ITEMS_PER_PAGE,
  type PaginationMeta,
} from "@/lib/pagination";

type LiveAuctionsListProps = {
  gridClassName?: string;
  skeletonCount?: number;
  limit?: number;
  sort?: "latest" | "ending";
  showPagination?: boolean;
  showSearch?: boolean;
};

export function LiveAuctionsList(props: LiveAuctionsListProps) {
  const {
    gridClassName = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    skeletonCount = ITEMS_PER_PAGE,
    limit = ITEMS_PER_PAGE,
  } = props;

  return (
    <Suspense
      fallback={
        <div className={`grid gap-6 ${gridClassName}`}>
          {Array.from({ length: Math.min(skeletonCount, limit) }).map(
            (_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
              />
            ),
          )}
        </div>
      }
    >
      <LiveAuctionsListInner {...props} />
    </Suspense>
  );
}

function LiveAuctionsListInner({
  gridClassName = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  skeletonCount = ITEMS_PER_PAGE,
  limit = ITEMS_PER_PAGE,
  sort = "ending",
  showPagination = true,
  showSearch = true,
}: LiveAuctionsListProps) {
  const searchParams = useSearchParams();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [pagination, setPagination] =
    useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("search") ?? "",
  );
  const [debouncedSearch, setDebouncedSearch] = useState(
    () => searchParams.get("search")?.trim() ?? "",
  );
  const [categoryFilter, setCategoryFilter] = useState(
    () => searchParams.get("category") ?? "",
  );
  const [cityFilter, setCityFilter] = useState(
    () => searchParams.get("city") ?? "",
  );
  const lastTrackedSearch = useRef("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, categoryFilter, cityFilter, sort]);

  const fetchLiveAuctions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get<LiveAuctionsResponse>(
        "/api/properties/live-auctions",
        {
          params: {
            ...buildPaginationParams(currentPage, limit, sort),
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
            ...(categoryFilter ? { category: categoryFilter } : {}),
            ...(cityFilter ? { city: cityFilter } : {}),
          },
        },
      );
      if (!data.success) {
        setError(data.message || "Failed to load live auctions");
        setAuctions([]);
        setPagination(DEFAULT_PAGINATION);
        return;
      }
      const nextAuctions = (data.data ?? []).map(mapPropertyToAuction);
      setAuctions(nextAuctions);
      setPagination(data.pagination ?? DEFAULT_PAGINATION);

      const hasFilters = Boolean(
        debouncedSearch || categoryFilter || cityFilter,
      );
      if (hasFilters) {
        const signature = JSON.stringify({
          debouncedSearch,
          categoryFilter,
          cityFilter,
        });
        if (signature !== lastTrackedSearch.current) {
          lastTrackedSearch.current = signature;
          trackPropertySearch(
            {
              query: debouncedSearch,
              category: categoryFilter,
              city: cityFilter,
              source: "live_auctions",
              resultCount: nextAuctions.length,
            },
            "/auctions",
          );
        }
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
      setAuctions([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, sort, debouncedSearch, categoryFilter, cityFilter]);

  useEffect(() => {
    fetchLiveAuctions();
  }, [fetchLiveAuctions]);

  return (
    <div className="space-y-6">
      {showSearch ? (
        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-[1.4fr_1fr_1fr]">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, city, category, locality..."
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">All categories</option>
            {PROPERTY_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Filter by city"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      ) : null}

      {loading ? (
        <div className={`grid gap-6 ${gridClassName}`}>
          {Array.from({ length: Math.min(skeletonCount, limit) }).map(
            (_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
              />
            ),
          )}
        </div>
      ) : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </p>
      ) : auctions.length === 0 ? (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-12 text-center dark:border-indigo-900/50 dark:bg-indigo-950/30">
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200">
            No live auctions right now
          </h3>
          <p className="mt-2 text-sm text-indigo-700 dark:text-indigo-300">
            Try changing your search filters or check back soon.
          </p>
        </div>
      ) : (
        <>
          <div className={`grid items-stretch gap-6 ${gridClassName}`}>
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
          {showPagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}
