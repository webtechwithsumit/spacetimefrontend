"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnalyticsPlugin } from "@/components/analytics-plugin-provider";
import { useAuth } from "@/components/auth-provider";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/components/toast-provider";
import { DataTable, type DataTableColumn } from "@/dashboard/components/data-table";
import { PageHeader } from "@/dashboard/components/page-header";
import { Pagination } from "@/dashboard/components/pagination";
import {
  canEditProperty,
  getSellerName,
  isAdminUser,
  PropertiesResponse,
  statusClass,
  type DashboardProperty,
} from "@/dashboard/components/property/types";
import { PROPERTY_MANAGER_ROLES } from "@/dashboard/constants/property";
import {
  auctionStageClass,
  auctionStageLabel,
  resolveAuctionStage,
  UPCOMING_AUCTION_DAYS,
} from "@/lib/auction-stage";
import { api, getApiErrorMessage } from "@/lib/api";
import { formatBidAmount } from "@/lib/live-auctions";
import { trackPropertySearch } from "@/lib/analytics";
import {
  buildPaginationParams,
  DEFAULT_PAGINATION,
  type PaginationMeta,
} from "@/lib/pagination";

type PropertyColumn = DataTableColumn<DashboardProperty>;

const STAGE_TABS = [
  { id: "", label: "All" },
  { id: "Live", label: "Live" },
  { id: "Upcoming", label: "Upcoming" },
  { id: "Ended", label: "Ended" },
] as const;

const STAGE_FILTER_VALUES = new Set(["Live", "Upcoming", "Ended"]);

const actionLinkClass =
  "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors";

function buildPropertyListHref(params: {
  status?: string;
  sellerId?: string;
  sellerName?: string;
  bidderId?: string;
  bidderName?: string;
}) {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.sellerId) search.set("sellerId", params.sellerId);
  if (params.sellerName) search.set("sellerName", params.sellerName);
  if (params.bidderId) search.set("bidderId", params.bidderId);
  if (params.bidderName) search.set("bidderName", params.bidderName);
  const query = search.toString();
  return query ? `/dashboard/property?${query}` : "/dashboard/property";
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-3.5"
    >
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function AuctionIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-3.5"
    >
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M4 14h4M12 10h4M20 16h-4" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-3.5"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 17V11" />
      <path d="M12 17V7" />
      <path d="M16 17v-4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-3.5"
    >
      <path d="M3 6h18M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6m2 0v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6h10Z" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

const INITIAL_COLUMNS: PropertyColumn[] = [
  { id: "title", label: "Title", visible: true },
  { id: "city", label: "City", visible: true },
  { id: "category", label: "Category", visible: true },
  { id: "auctionStage", label: "Auction Stage", visible: true },
  { id: "area", label: "Area", visible: true },
  { id: "pricePerSqft", label: "Price/sqft", visible: true },
  { id: "status", label: "Status", visible: true },
  { id: "sellerId", label: "Seller", visible: true },
];

export function PropertyList() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status")?.trim() ?? "";
  const sellerIdFilter = searchParams.get("sellerId")?.trim() ?? "";
  const sellerNameFilter = searchParams.get("sellerName")?.trim() ?? "";
  const bidderIdFilter = searchParams.get("bidderId")?.trim() ?? "";
  const bidderNameFilter = searchParams.get("bidderName")?.trim() ?? "";
  const personFilterParams = {
    sellerId: sellerIdFilter,
    sellerName: sellerNameFilter,
    bidderId: bidderIdFilter,
    bidderName: bidderNameFilter,
  };
  const { user, isAuthenticated } = useAuth();
  const { canViewPropertyAnalytics } = useAnalyticsPlugin();
  const toast = useToast();
  const canManage = PROPERTY_MANAGER_ROLES.includes(user?.role ?? "");

  const [properties, setProperties] = useState<DashboardProperty[]>([]);
  const [pagination, setPagination] =
    useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState<PropertyColumn[]>(INITIAL_COLUMNS);
  const [searchTitle, setSearchTitle] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [removeTarget, setRemoveTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [removing, setRemoving] = useState(false);
  const lastTrackedSearch = useRef("");

  const tableColumns = useMemo(() => {
    if (!bidderIdFilter) return columns;

    const bidderColumns: PropertyColumn[] = [
      { id: "bidderBidCount", label: "Times bid", visible: true },
      { id: "bidderHighestBid", label: "Highest bid", visible: true },
    ];

    return [...columns.filter((column) => column.visible), ...bidderColumns];
  }, [columns, bidderIdFilter]);

  const fetchProperties = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get<PropertiesResponse>("/api/properties", {
        params: {
          ...buildPaginationParams(currentPage),
          ...(debouncedSearch ? { title: debouncedSearch } : {}),
          ...(statusFilter && STAGE_FILTER_VALUES.has(statusFilter)
            ? { status: statusFilter }
            : statusFilter
              ? { auctionStatus: statusFilter }
              : {}),
          ...(sellerIdFilter ? { sellerId: sellerIdFilter } : {}),
          ...(bidderIdFilter ? { bidderId: bidderIdFilter } : {}),
        },
      });
      if (!data.success) {
        setError(data.message || "Failed to load properties");
        setProperties([]);
        setPagination(DEFAULT_PAGINATION);
        return;
      }
      setProperties(data.data ?? []);
      setPagination(data.pagination ?? DEFAULT_PAGINATION);

      const hasFilters = Boolean(
        debouncedSearch || statusFilter || sellerIdFilter || bidderIdFilter,
      );
      if (hasFilters) {
        const signature = JSON.stringify({
          debouncedSearch,
          statusFilter,
          sellerIdFilter,
          bidderIdFilter,
        });
        if (signature !== lastTrackedSearch.current) {
          lastTrackedSearch.current = signature;
          trackPropertySearch(
            {
              query: debouncedSearch,
              category: statusFilter,
              source: "dashboard_properties",
              resultCount: (data.data ?? []).length,
            },
            "/dashboard/property",
          );
        }
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
      setProperties([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, [
    isAuthenticated,
    currentPage,
    debouncedSearch,
    statusFilter,
    sellerIdFilter,
    bidderIdFilter,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTitle.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTitle]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, sellerIdFilter, bidderIdFilter]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  function handleClear() {
    setSearchTitle("");
    setDebouncedSearch("");
    setCurrentPage(1);
  }

  async function confirmRemove() {
    if (!removeTarget) return;
    setRemoving(true);

    try {
      const { data } = await api.delete<{ success: boolean; message?: string }>(
        `/api/properties/${removeTarget.id}`,
      );
      if (!data.success) {
        toast.error(data.message || "Failed to remove property");
        return;
      }
      toast.success(data.message || "Property removed successfully");
      setRemoveTarget(null);
      await fetchProperties();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setRemoving(false);
    }
  }

  function renderTableCell(item: DashboardProperty, col: PropertyColumn) {
    if (col.id === "title") {
      return (
        <span className="font-medium text-zinc-900 dark:text-white">
          {item.title || "—"}
        </span>
      );
    }
    if (col.id === "auctionStage") {
      const stage = resolveAuctionStage(item);
      return (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${auctionStageClass(stage)}`}
        >
          {auctionStageLabel(stage)}
        </span>
      );
    }
    if (col.id === "status") {
      return (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(item.status)}`}
        >
          {item.status || "—"}
        </span>
      );
    }
    if (col.id === "sellerId") return getSellerName(item.sellerId);
    if (col.id === "bidderBidCount") {
      return (
        <span className="font-semibold tabular-nums text-zinc-900 dark:text-white">
          {item.bidderBidCount ?? 0}
        </span>
      );
    }
    if (col.id === "bidderHighestBid") {
      return item.bidderHighestBid != null ? (
        <span className="font-semibold tabular-nums text-zinc-900 dark:text-white">
          {formatBidAmount(item.bidderHighestBid)}
        </span>
      ) : (
        "—"
      );
    }
    const value = item[col.id as keyof DashboardProperty];
    if (value === undefined || value === null || value === "") return "—";
    return String(value);
  }

  function renderActions(item: DashboardProperty) {
    const canEdit = canEditProperty(user?.role, user?._id, item.sellerId);
    const showAdmin = isAdminUser(user?.role);

    if (!canEdit && !showAdmin) return null;

    return (
      <div className="flex flex-nowrap items-center gap-1.5">
        {(canEdit || showAdmin) && (showAdmin || canViewPropertyAnalytics) && (
          <Link
            href={`/dashboard/property/${item._id}/analytics`}
            title="Property analytics"
            className={`${actionLinkClass} text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40`}
          >
            <AnalyticsIcon />
            Analytics
          </Link>
        )}
        {canEdit && (
          <Link
            href={`/dashboard/property/${item._id}/edit`}
            title="Edit property"
            className={`${actionLinkClass} text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40`}
          >
            <EditIcon />
            Edit
          </Link>
        )}
        {showAdmin && (
          <Link
            href={`/dashboard/property/${item._id}/admin`}
            title="Auction & listing admin"
            className={`${actionLinkClass} text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-950/40`}
          >
            <AuctionIcon />
            Admin
          </Link>
        )}
        {canEdit && (
          <button
            type="button"
            title="Remove property"
            onClick={() => setRemoveTarget({ id: item._id, title: item.title })}
            className={`${actionLinkClass} text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40`}
          >
            <TrashIcon />
            Remove
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Properties"
          description="View all property listings for auctions."
        />
        {canManage && (
          <Link
            href="/dashboard/property/create"
            className="shrink-0 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
          >
            Create Property
          </Link>
        )}
      </div>

      {!canManage && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          Only Seller or Broker can create and manage their own properties. You can view all listings below.
        </div>
      )}

      {statusFilter && !STAGE_FILTER_VALUES.has(statusFilter) ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Filtered by:</span>
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {statusFilter}
          </span>
          <Link
            href={buildPropertyListHref(personFilterParams)}
            className="text-xs font-medium text-zinc-600 hover:underline dark:text-zinc-400"
          >
            Clear filter
          </Link>
        </div>
      ) : null}

      {sellerIdFilter || bidderIdFilter ? (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-700 dark:bg-zinc-900/80">
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="size-4"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Active filter
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold text-zinc-900 dark:text-white">
                {sellerIdFilter
                  ? `Listings by ${sellerNameFilter || "user"}`
                  : `Properties bid on by ${bidderNameFilter || "user"}`}
              </p>
            </div>
          </div>
          <Link
            href={
              statusFilter
                ? buildPropertyListHref({ status: statusFilter })
                : "/dashboard/property"
            }
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Clear person filter
          </Link>
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-6 border-b border-zinc-200 dark:border-zinc-800">
        {STAGE_TABS.map((tab) => {
          const active = statusFilter === tab.id;
          const href = buildPropertyListHref({
            ...personFilterParams,
            status: tab.id || undefined,
          });

          return (
            <Link
              key={tab.id || "all"}
              href={href}
              className={`pb-3 text-sm font-medium transition-colors ${
                active
                  ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {statusFilter === "Upcoming" ? (
        <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
          Showing properties going live within the next {UPCOMING_AUCTION_DAYS} days.
        </p>
      ) : null}

      <div className="mb-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label
              htmlFor="searchTitle"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Property Title
            </label>
            <input
              id="searchTitle"
              type="search"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Search by Title"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white dark:focus:border-indigo-400 dark:focus:bg-zinc-900"
            />
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </p>
      )}

      {loading ? (
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-zinc-500 dark:text-zinc-400">Please Wait!</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-8 text-center dark:border-indigo-900/50 dark:bg-indigo-950/30">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-200">
            {sellerIdFilter
              ? `No listings found for ${sellerNameFilter || "this user"}`
              : bidderIdFilter
                ? `No properties found for bids by ${bidderNameFilter || "this user"}`
                : statusFilter === "Live"
              ? "No live properties"
              : statusFilter === "Upcoming"
                ? "No upcoming properties"
                : statusFilter === "Ended"
                  ? "No ended properties"
                  : "No Data Found"}
          </h4>
          <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
            {statusFilter === "Upcoming"
              ? `Properties appear here when their auction starts within ${UPCOMING_AUCTION_DAYS} days.`
              : statusFilter
                ? "Try another filter or create a new property."
                : "You currently don't have any Data"}
          </p>
        </div>
      ) : (
        <>
          <DataTable
            columns={tableColumns}
            data={properties}
            getRowKey={(item) => item._id}
            renderTableCell={renderTableCell}
            currentPage={pagination.page}
            itemsPerPage={pagination.limit}
            renderActions={canManage ? renderActions : undefined}
            actionsLabel="Actions"
          />
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(removeTarget)}
        title="Remove property?"
        description={
          removeTarget
            ? `Are you sure you want to remove "${removeTarget.title}" from listings?`
            : ""
        }
        confirmLabel="Remove"
        cancelLabel="Cancel"
        variant="danger"
        pending={removing}
        onConfirm={confirmRemove}
        onCancel={() => {
          if (!removing) setRemoveTarget(null);
        }}
      />
    </div>
  );
}
