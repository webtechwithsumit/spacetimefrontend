"use client";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/components/auth-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import { api, getApiErrorMessage } from "@/lib/api";
import type { DashboardOverviewData } from "@/lib/dashboard-overview";
import { formatBidAmount } from "@/lib/live-auctions";
import { getMediaUrl } from "@/lib/media";

type StatCardProps = {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  accent?: "indigo" | "emerald" | "amber" | "violet" | "sky" | "zinc";
  icon?: ReactNode;
};

const accentClasses = {
  indigo:
    "border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300 dark:hover:border-indigo-800",
  emerald:
    "border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:border-emerald-800",
  amber:
    "border-amber-200 bg-amber-50/70 text-amber-700 hover:border-amber-300 hover:bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:border-amber-800",
  violet:
    "border-violet-200 bg-violet-50/70 text-violet-700 hover:border-violet-300 hover:bg-violet-50 dark:border-violet-900/50 dark:bg-violet-950/30 dark:text-violet-300 dark:hover:border-violet-800",
  sky: "border-sky-200 bg-sky-50/70 text-sky-700 hover:border-sky-300 hover:bg-sky-50 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-300 dark:hover:border-sky-800",
  zinc: "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700",
};

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-4 shrink-0 opacity-50"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function StatCard({
  label,
  value,
  hint,
  href,
  accent = "zinc",
  icon,
}: StatCardProps) {
  const className = `group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${accentClasses[accent]} ${href ? "cursor-pointer hover:shadow-sm" : ""
    }`;

  const content = (
    <>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/70 dark:bg-black/20 [&_svg]:size-4">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium uppercase tracking-wide opacity-70">
          {label}
        </p>
        <p className="text-xl font-semibold tabular-nums leading-tight">{value}</p>
        {hint ? (
          <p className="truncate text-[11px] opacity-70">{hint}</p>
        ) : null}
      </div>
      {href ? <ChevronIcon /> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

function buildMetricCards(data: DashboardOverviewData): StatCardProps[] {
  const cards: StatCardProps[] = [
    {
      label: "Live Auctions",
      value: data.liveAuctionsCount,
      hint: "Open for bidding",
      href: "/dashboard/auctions",
      accent: "emerald",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
      ),
    },
  ];

  if (data.bids) {
    cards.push(
      {
        label: "My Bids",
        value: data.bids.myBidsCount,
        hint: "Your bids",
        href: "/dashboard/buyers",
        accent: "indigo",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
      },
      {
        label: "Leading",
        value: data.bids.leadingBidsCount,
        hint: "Highest bidder",
        href: "/dashboard/buyers",
        accent: "emerald",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" />
          </svg>
        ),
      },
      {
        label: "Outbid",
        value: data.bids.outbidCount,
        hint: "Raise your bid",
        href: "/dashboard/buyers",
        accent: "amber",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        ),
      },
    );
  }

  if (data.properties) {
    cards.push(
      {
        label: "Total Properties",
        value: data.properties.totalProperties,
        hint: "All listings",
        href: "/dashboard/property",
        accent: "violet",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 22V12h6v10" />
          </svg>
        ),
      },
      {
        label: "Live Listings",
        value: data.properties.liveListings,
        hint: "Under auction",
        href: "/dashboard/property?status=Live",
        accent: "emerald",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2Z" />
          </svg>
        ),
      },
      {
        label: "Upcoming",
        value: data.properties.upcomingListings,
        hint: "Live in 10 days",
        href: "/dashboard/property?status=Upcoming",
        accent: "sky",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        ),
      },
      {
        label: "Ended",
        value: data.properties.endedListings,
        hint: "Auction closed",
        href: "/dashboard/property?status=Ended",
        accent: "zinc",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" /><path d="m9 9 6 6M15 9l-6 6" />
          </svg>
        ),
      },
      {
        label: "Drafts",
        value: data.properties.draftListings,
        hint: "Unpublished",
        href: "/dashboard/property?status=Draft",
        accent: "zinc",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        ),
      },
    );
  }

  if (data.platform) {
    cards.push(
      {
        label: "Total Users",
        value: data.platform.totalUsers,
        hint: `${data.platform.totalBuyers}B · ${data.platform.totalSellers}S · ${data.platform.totalBrokers}Br`,
        href: "/dashboard/system-master/users",
        accent: "indigo",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        label: "Total Bids",
        value: data.platform.totalBids,
        hint: "Platform-wide",
        href: "/dashboard/auctions",
        accent: "sky",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        ),
      },
      {
        label: "Admins",
        value: data.platform.totalAdmins,
        hint: "Admin accounts",
        href: "/dashboard/system-master/users",
        accent: "zinc",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          </svg>
        ),
      },
    );
  }

  return cards;
}

function SnapshotRow({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href?: string;
}) {
  const rowClass =
    "flex items-center justify-between gap-4 rounded-lg px-2 py-2 transition-colors hover:bg-white/60 dark:hover:bg-zinc-900/40";

  if (href) {
    return (
      <li>
        <Link href={href} className={rowClass}>
          <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
          <span className="flex items-center gap-2 font-semibold">
            {value}
            <ChevronIcon />
          </span>
        </Link>
      </li>
    );
  }

  return (
    <li className={rowClass}>
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </li>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

function auctionStatusBadge(status: string) {
  if (status === "Live") {
    return (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
        Live
      </span>
    );
  }
  if (status === "Scheduled") {
    return (
      <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
        Scheduled
      </span>
    );
  }
  if (status === "Draft") {
    return (
      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        Draft
      </span>
    );
  }
  return (
    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
      {status || "—"}
    </span>
  );
}

function bidStatusBadge(isLeading: boolean, isAuctionEnded: boolean) {
  if (isLeading) {
    return (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
        Leading
      </span>
    );
  }
  if (isAuctionEnded) {
    return (
      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        Ended
      </span>
    );
  }
  return (
    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
      Outbid
    </span>
  );
}

type QuickAction = {
  label: string;
  href: string;
  description: string;
};

function getQuickActions(role: string): QuickAction[] {
  const actions: QuickAction[] = [
    {
      label: "Live Auctions",
      href: "/dashboard/auctions",
      description: "Browse properties open for bidding",
    },
  ];

  if (role === "Buyer" || role === "Broker") {
    actions.push({
      label: "My Bids",
      href: "/dashboard/buyers",
      description: "Track your active and past bids",
    });
  }

  if (role === "Seller" || role === "Broker" || role === "Admin" || role === "Super-Admin") {
    actions.push(
      {
        label: "My Properties",
        href: "/dashboard/property",
        description: "Manage your property listings",
      },
      {
        label: "Add Property",
        href: "/dashboard/property/create",
        description: "Create a new listing for auction",
      },
    );
  }

  if (role === "Super-Admin") {
    actions.push({
      label: "Manage Users",
      href: "/dashboard/system-master/users",
      description: "View and manage all platform users",
    });
  }

  actions.push({
    label: "Profile",
    href: "/dashboard/profile",
    description: "Update your account details",
  });

  return actions;
}

export function DashboardOverview() {
  const { isAuthenticated, isReady } = useAuth();
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOverview = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError("");

    try {
      const { data: response } = await api.get<{
        success: boolean;
        message?: string;
        data?: DashboardOverviewData;
      }>("/api/dashboard/overview");

      if (!response.success || !response.data) {
        setError(response.message || "Failed to load dashboard overview");
        setData(null);
        return;
      }

      setData(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        return;
      }
      setError(getApiErrorMessage(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isReady || !isAuthenticated) return;
    fetchOverview();
  }, [fetchOverview, isAuthenticated, isReady]);

  const metricCards = useMemo(
    () => (data ? buildMetricCards(data) : []),
    [data],
  );

  const quickActions = useMemo(
    () => (data ? getQuickActions(data.user.role) : []),
    [data],
  );

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Overview"
          description="Loading your SpaceTime dashboard..."
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <PageHeader
          title="Overview"
          description="Welcome to your SpaceTime dashboard."
        />
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error || "Unable to load dashboard data."}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">
              Welcome, {data.user.name.split(" ")[0]}
            </h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              {data.user.role}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Live auctions, listings, and bids at a glance.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={fetchOverview}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            Refresh
          </button>
          <Link
            href="/auctions"
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
          >
            View Site
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {metricCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {data.bids?.recentBids.length ? (
            <section className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                <h2 className="text-sm font-semibold">Recent Bids</h2>
                <Link
                  href="/dashboard/buyers"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  View all
                </Link>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {data.bids.recentBids.map((bid) => (
                  <Link
                    key={bid.propertyId}
                    href={`/auctions/${bid.propertyId}`}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  >
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      {bid.image ? (
                        <Image
                          src={getMediaUrl(bid.image)}
                          alt={bid.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold">
                          {bid.title}
                        </p>
                        {bidStatusBadge(bid.isLeading, bid.isAuctionEnded)}
                      </div>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {[bid.microMarketLocality, bid.city]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Last bid {formatDate(bid.lastBidAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        My bid
                      </p>
                      <p className="text-sm font-semibold">
                        {formatBidAmount(bid.myHighestBid)}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Current {formatBidAmount(bid.currentBidAmount)}
                      </p>
                    </div>
                    <ChevronIcon />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {data.properties?.recentProperties.length ? (
            <section className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                <h2 className="text-sm font-semibold">Recent Properties</h2>
                <Link
                  href="/dashboard/property"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  View all
                </Link>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {data.properties.recentProperties.map((property) => {
                  const propertyHref =
                    property.auctionStatus === "Live"
                      ? `/auctions/${property.id}`
                      : `/dashboard/property/${property.id}/edit`;

                  return (
                    <Link
                      key={property.id}
                      href={propertyHref}
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    >
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        {property.image ? (
                          <Image
                            src={getMediaUrl(property.image)}
                            alt={property.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold">
                            {property.title}
                          </p>
                          {auctionStatusBadge(property.auctionStatus)}
                        </div>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {[property.microMarketLocality, property.city]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          Updated {formatDate(property.updatedAt)}
                        </p>
                      </div>
                      <ChevronIcon />
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}

          {!data.bids?.recentBids.length &&
            !data.properties?.recentProperties.length ? (
            <section className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
              <h2 className="text-sm font-semibold">No recent activity yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
                {data.user.role === "Buyer"
                  ? "Start by browsing live auctions and placing your first bid."
                  : "Create a property listing or browse live auctions to get started."}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link
                  href="/dashboard/auctions"
                  className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900"
                >
                  Browse Auctions
                </Link>
                {(data.user.role === "Seller" ||
                  data.user.role === "Broker" ||
                  data.user.role === "Admin" ||
                  data.user.role === "Super-Admin") && (
                    <Link
                      href="/dashboard/property/create"
                      className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                      Add Property
                    </Link>
                  )}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-sm font-semibold">Quick Actions</h2>
            <div className="mt-3 space-y-1.5">
              {quickActions.map((action) => (
                <Link
                  key={action.href + action.label}
                  href={action.href}
                  className="block rounded-lg border border-zinc-200 px-3 py-2 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-zinc-800 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/20"
                >
                  <p className="text-xs font-semibold">{action.label}</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4 dark:border-zinc-800 dark:from-indigo-950/30 dark:via-zinc-950 dark:to-violet-950/20">
            <h2 className="text-sm font-semibold">Platform snapshot</h2>
            <ul className="mt-3 space-y-0.5 text-xs">
              <SnapshotRow
                label="Live auctions"
                value={data.liveAuctionsCount}
                href="/dashboard/auctions"
              />
              {data.bids ? (
                <SnapshotRow
                  label="Ended bid auctions"
                  value={data.bids.endedBidsCount}
                  href="/dashboard/buyers"
                />
              ) : null}
              {data.properties ? (
                <>
                  <SnapshotRow
                    label="Ended listings"
                    value={data.properties.endedListings}
                    href="/dashboard/property?status=Ended"
                  />
                  <SnapshotRow
                    label="Live listings"
                    value={data.properties.liveListings}
                    href="/dashboard/property?status=Live"
                  />
                </>
              ) : null}
              {data.platform ? (
                <>
                  <SnapshotRow
                    label="Platform bids"
                    value={data.platform.totalBids}
                    href="/dashboard/auctions"
                  />
                  <SnapshotRow
                    label="Total users"
                    value={data.platform.totalUsers}
                    href="/dashboard/system-master/users"
                  />
                </>
              ) : null}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
