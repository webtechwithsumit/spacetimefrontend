"use client";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { api, getApiErrorMessage } from "@/lib/api";
import type {
  DashboardAdminInsights,
  DashboardOverviewData,
  DashboardRoleCount,
} from "@/lib/dashboard-overview";
import { formatBidAmount } from "@/lib/live-auctions";
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

function formatShortDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

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

type KpiTone = "violet" | "blue" | "indigo" | "emerald";

const kpiCardStyles: Record<KpiTone, string> = {
  violet:
    "border-violet-200/90 bg-violet-50/90 hover:bg-violet-100/90 dark:border-violet-900/50 dark:bg-violet-950/30 dark:hover:bg-violet-950/45",
  blue: "border-sky-200/90 bg-sky-50/90 hover:bg-sky-100/90 dark:border-sky-900/50 dark:bg-sky-950/30 dark:hover:bg-sky-950/45",
  indigo:
    "border-indigo-200/90 bg-indigo-50/90 hover:bg-indigo-100/90 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/45",
  emerald:
    "border-emerald-200/90 bg-emerald-50/90 hover:bg-emerald-100/90 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/45",
};

const kpiLabelStyles: Record<KpiTone, string> = {
  violet: "text-violet-700 dark:text-violet-300",
  blue: "text-sky-700 dark:text-sky-300",
  indigo: "text-indigo-700 dark:text-indigo-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
};

type PanelTheme =
  | "default"
  | "attention"
  | "bidding"
  | "activity"
  | "listings"
  | "closed";

const panelThemes: Record<
  PanelTheme,
  { section: string; header: string; title: string; action: string }
> = {
  default: {
    section: "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
    header:
      "border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50",
    title: "text-zinc-900 dark:text-white",
    action:
      "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white",
  },
  attention: {
    section:
      "border-amber-200/90 bg-white dark:border-amber-900/40 dark:bg-zinc-950",
    header:
      "border-amber-100 bg-amber-50/90 dark:border-amber-900/30 dark:bg-amber-950/25",
    title: "text-amber-950 dark:text-amber-100",
    action: "text-amber-700 hover:text-amber-900 dark:text-amber-400",
  },
  bidding: {
    section:
      "border-emerald-200/90 bg-white dark:border-emerald-900/40 dark:bg-zinc-950",
    header:
      "border-emerald-100 bg-emerald-50/90 dark:border-emerald-900/30 dark:bg-emerald-950/25",
    title: "text-emerald-950 dark:text-emerald-100",
    action: "text-emerald-700 hover:text-emerald-900 dark:text-emerald-400",
  },
  activity: {
    section:
      "border-sky-200/90 bg-white dark:border-sky-900/40 dark:bg-zinc-950",
    header:
      "border-sky-100 bg-sky-50/90 dark:border-sky-900/30 dark:bg-sky-950/25",
    title: "text-sky-950 dark:text-sky-100",
    action: "text-sky-700 hover:text-sky-900 dark:text-sky-400",
  },
  listings: {
    section:
      "border-violet-200/90 bg-white dark:border-violet-900/40 dark:bg-zinc-950",
    header:
      "border-violet-100 bg-violet-50/90 dark:border-violet-900/30 dark:bg-violet-950/25",
    title: "text-violet-950 dark:text-violet-100",
    action: "text-violet-700 hover:text-violet-900 dark:text-violet-400",
  },
  closed: {
    section:
      "border-zinc-300/80 bg-white dark:border-zinc-700 dark:bg-zinc-950",
    header:
      "border-zinc-200 bg-zinc-100/90 dark:border-zinc-800 dark:bg-zinc-900/60",
    title: "text-zinc-900 dark:text-zinc-100",
    action: "text-zinc-700 hover:text-zinc-900 dark:text-zinc-300",
  },
};

function HeroKpi({
  label,
  value,
  href,
  tone = "indigo",
}: {
  label: string;
  value: number | string;
  href?: string;
  tone?: KpiTone;
}) {
  const content = (
    <div
      className={`rounded-xl border px-5 py-4 transition-colors ${kpiCardStyles[tone]}`}
    >
      <p
        className={`text-xs font-medium uppercase tracking-wide ${kpiLabelStyles[tone]}`}
      >
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-zinc-900 dark:text-white">
        {value}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
  theme = "default",
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
  theme?: PanelTheme;
}) {
  const styles = panelThemes[theme];

  return (
    <section
      className={`overflow-hidden rounded-xl border ${styles.section} ${className}`}
    >
      <div
        className={`flex items-center justify-between border-b px-4 py-3 ${styles.header}`}
      >
        <div>
          <h2 className={`text-sm font-semibold ${styles.title}`}>{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          ) : null}
        </div>
        {action ? (
          <Link href={action.href} className={`text-xs font-medium ${styles.action}`}>
            {action.label}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="size-4"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MetricBadge({
  value,
  variant = "neutral",
}: {
  value: number;
  variant?: "listings" | "bids" | "leading" | "neutral";
}) {
  const styles = {
    listings:
      "border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-200",
    bids: "border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-200",
    leading:
      "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200",
    neutral:
      "border-zinc-200 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white",
  };

  return (
    <span
      className={`inline-flex min-w-8 items-center justify-center rounded-lg border px-2 py-1 text-xs font-bold tabular-nums ${styles[variant]}`}
    >
      {value}
    </span>
  );
}

function getRoleBreakdownViewHref(
  variant: "listings" | "bids",
  row: DashboardRoleCount,
) {
  if (row.count <= 0) return null;

  const name = encodeURIComponent(row.name);
  if (variant === "listings") {
    return `/dashboard/property?sellerId=${row.userId}&sellerName=${name}`;
  }
  return `/dashboard/bid-monitor?bidderId=${row.userId}&bidderName=${name}`;
}

const ROLE_BREAKDOWN_VISIBLE_ROWS = 5;

function RoleBreakdownCard({
  title,
  subtitle,
  variant,
  rows,
  seeMoreHref,
}: {
  title: string;
  subtitle: string;
  variant: "listings" | "bids";
  rows: DashboardRoleCount[];
  seeMoreHref?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = rows.length > ROLE_BREAKDOWN_VISIBLE_ROWS;
  const visibleRows = expanded
    ? rows
    : rows.slice(0, ROLE_BREAKDOWN_VISIBLE_ROWS);
  const hiddenCount = rows.length - ROLE_BREAKDOWN_VISIBLE_ROWS;

  const viewButtonClassName =
    variant === "listings"
      ? "inline-flex size-8 items-center justify-center rounded-lg border border-violet-300 text-violet-700 transition-colors hover:bg-violet-50 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-950/40"
      : "inline-flex size-8 items-center justify-center rounded-lg border border-sky-300 text-sky-700 transition-colors hover:bg-sky-50 dark:border-sky-700 dark:text-sky-300 dark:hover:bg-sky-950/40";

  const cardTheme =
    variant === "listings"
      ? "border-violet-200/80 bg-white dark:border-violet-900/40 dark:bg-zinc-950"
      : "border-sky-200/80 bg-white dark:border-sky-900/40 dark:bg-zinc-950";
  const headerTheme =
    variant === "listings"
      ? "border-violet-100 bg-violet-50/60 dark:border-violet-900/30 dark:bg-violet-950/20"
      : "border-sky-100 bg-sky-50/60 dark:border-sky-900/30 dark:bg-sky-950/20";

  return (
    <div className={`overflow-hidden rounded-xl border ${cardTheme}`}>
      <div className={`border-b px-4 py-3 ${headerTheme}`}>
        <h3
          className={`text-sm font-semibold ${variant === "listings" ? "text-violet-950 dark:text-violet-100" : "text-sky-950 dark:text-sky-100"}`}
        >
          {title}
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-left text-xs text-zinc-500 dark:border-zinc-800">
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              {variant === "listings" ? (
                <th className="px-4 py-2 text-center font-medium">Listings</th>
              ) : (
                <>
                  <th className="px-4 py-2 text-center font-medium">Properties</th>
                  <th className="px-4 py-2 text-center font-medium">Total bids</th>
                  <th className="px-4 py-2 text-center font-medium">Leading</th>
                </>
              )}
              <th className="px-4 py-2 text-right font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={variant === "listings" ? 4 : 6}
                  className="px-4 py-6 text-center text-sm text-zinc-400"
                >
                  No activity yet
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => {
                const viewHref = getRoleBreakdownViewHref(variant, row);

                return (
                  <tr
                    key={row.userId}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                      {row.name}
                    </td>
                    <td className="max-w-[140px] truncate px-4 py-3 text-zinc-500">
                      {row.email}
                    </td>
                    {variant === "listings" ? (
                      <td className="px-4 py-3 text-center">
                        <MetricBadge value={row.count} variant="listings" />
                      </td>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-center">
                          <MetricBadge value={row.count} variant="bids" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <MetricBadge value={row.totalBids ?? 0} variant="neutral" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <MetricBadge value={row.leadingCount ?? 0} variant="leading" />
                        </td>
                      </>
                    )}
                    <td className="px-4 py-3 text-right">
                      {viewHref ? (
                        <Link
                          href={viewHref}
                          className={viewButtonClassName}
                          title={
                            variant === "listings"
                              ? `View all listings by ${row.name}`
                              : `View properties bid on by ${row.name}`
                          }
                        >
                          <EyeIcon />
                        </Link>
                      ) : (
                        <span
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700"
                          title="No property available"
                        >
                          <EyeIcon />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {hasMore ? (
        <div className="border-t border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
          {expanded ? (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-xs font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              Show less
            </button>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="text-xs font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                See more ({hiddenCount} more)
              </button>
              {seeMoreHref ? (
                <Link
                  href={seeMoreHref}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  View all →
                </Link>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function NeedsAttentionPanel({
  attention,
}: {
  attention: DashboardAdminInsights["needsAttention"];
}) {
  const items = [
    ...attention.endingSoon.map((item) => ({
      key: `end-${item.propertyId}`,
      tone: "amber" as const,
      label: "Ending in 24h",
      title: item.title,
      href: `/auctions/${item.propertyId}`,
      meta: item.auctionEndDateTime
        ? `Ends ${formatDate(item.auctionEndDateTime)}`
        : undefined,
    })),
    ...attention.zeroBids.map((item) => ({
      key: `zero-${item.propertyId}`,
      tone: "red" as const,
      label: "No bids yet",
      title: item.title,
      href: `/auctions/${item.propertyId}`,
      meta: "Live auction needs attention",
    })),
  ];

  const summaryItems = [
    attention.openSupportTickets > 0
      ? {
        key: "tickets",
        label: `${attention.openSupportTickets} open support ticket${attention.openSupportTickets === 1 ? "" : "s"}`,
        href: "/dashboard/support",
      }
      : null,
    attention.draftListings > 0
      ? {
        key: "drafts",
        label: `${attention.draftListings} draft listing${attention.draftListings === 1 ? "" : "s"} unpublished`,
        href: "/dashboard/property?status=Draft",
      }
      : null,
  ].filter(Boolean) as { key: string; label: string; href: string }[];

  if (!items.length && !summaryItems.length) {
    return (
      <Panel title="Needs attention" theme="attention">
        <p className="px-4 py-5 text-sm text-emerald-700 dark:text-emerald-400">
          All clear — no urgent items right now.
        </p>
      </Panel>
    );
  }

  const toneClass = {
    amber:
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200",
    red: "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200",
  };

  return (
    <Panel title="Needs attention" subtitle="Items that need your action" theme="attention">
      <div className="space-y-3 px-4 py-4">
        {summaryItems.length ? (
          <div className="flex flex-wrap gap-2">
            {summaryItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-200 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-950/60"
              >
                {item.label} →
              </Link>
            ))}
          </div>
        ) : null}

        {items.length ? (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 transition-colors hover:opacity-90 ${toneClass[item.tone]}`}
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
                      {item.label}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium">
                      {item.title}
                    </p>
                    {item.meta ? (
                      <p className="mt-0.5 text-xs opacity-80">{item.meta}</p>
                    ) : null}
                  </div>
                  <ChevronIcon />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Panel>
  );
}

function activityDaysLabel(days: number) {
  if (!days) return "All time";
  if (days === 7) return "Last 7 days";
  return "Last 30 days";
}

function statusBadge(status: string) {
  if (status === "Live") {
    return (
      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white dark:bg-emerald-500">
        Live
      </span>
    );
  }
  if (status === "Draft") {
    return (
      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
        Draft
      </span>
    );
  }
  if (status === "Ended") {
    return (
      <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        Ended
      </span>
    );
  }
  return (
    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
      {status || "—"}
    </span>
  );
}

function ActivityFilter({
  value,
  onChange,
}: {
  value: number;
  onChange: (days: number) => void;
}) {
  const options = [
    { label: "7 days", days: 7 },
    { label: "30 days", days: 30 },
    { label: "All time", days: 0 },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.days}
          type="button"
          onClick={() => onChange(option.days)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${            value === option.days
              ? "bg-indigo-600 text-white dark:bg-indigo-500"
              : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function SectionGroup({
  title,
  description,
  theme,
  children,
}: {
  title: string;
  description: string;
  theme: "listings" | "bids";
  children: React.ReactNode;
}) {
  const isListings = theme === "listings";

  return (
    <div
      className={
        isListings
          ? "rounded-2xl border border-violet-200/90 bg-gradient-to-br from-violet-50/70 via-white to-white p-4 sm:p-5 dark:border-violet-900/40 dark:from-violet-950/20 dark:via-zinc-950 dark:to-zinc-950"
          : "rounded-2xl border border-sky-200/90 bg-gradient-to-br from-sky-50/70 via-white to-white p-4 sm:p-5 dark:border-sky-900/40 dark:from-sky-950/20 dark:via-zinc-950 dark:to-zinc-950"
      }
    >
      <div className="mb-4 flex items-start gap-3">
        <span
          className={`mt-1.5 size-2.5 shrink-0 rounded-full ${isListings ? "bg-violet-500" : "bg-sky-500"}`}
        />
        <div>
          <h3
            className={`text-sm font-semibold ${isListings ? "text-violet-950 dark:text-violet-100" : "text-sky-950 dark:text-sky-100"}`}
          >
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

function AdminDashboardView({
  data,
  insights,
  activityDays,
}: {
  data: DashboardOverviewData;
  insights: DashboardAdminInsights;
  activityDays: number;
}) {
  const platform = data.platform!;
  const draftCount = insights.needsAttention.draftListings;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-indigo-200/90 bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/40 p-5 shadow-sm sm:p-6 dark:border-indigo-900/40 dark:from-indigo-950/30 dark:via-zinc-950 dark:to-violet-950/20">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Platform pulse
            </p>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Here&apos;s what&apos;s happening right now
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {platform.totalBuyers} buyers · {platform.totalSellers} sellers ·{" "}
            {platform.totalBrokers} brokers
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <HeroKpi
            label="Total Properties"
            value={platform.totalProperties}
            href="/dashboard/property"
            tone="violet"
          />
          <HeroKpi
            label="Total Bids"
            value={platform.totalBids}
            href="/dashboard/bid-monitor"
            tone="blue"
          />
          <HeroKpi
            label="Users"
            value={platform.totalUsers}
            href="/dashboard/system-master/users"
            tone="indigo"
          />
          <HeroKpi
            label="Live Auctions"
            value={platform.liveAuctions}
            href="/dashboard/auctions"
            tone="emerald"
          />
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          {platform.liveAuctions} live · {draftCount} draft ·{" "}
          {insights.periodBidCount} bids {activityDaysLabel(activityDays).toLowerCase()}
        </p>
      </div>

      <NeedsAttentionPanel attention={insights.needsAttention} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Properties in bidding"
          subtitle="Live auctions with active bids"
          action={{ label: "Bid monitor", href: "/dashboard/bid-monitor" }}
          theme="bidding"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-left text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/30">
                  <th className="px-4 py-2.5 font-medium">Property</th>
                  <th className="px-4 py-2.5 font-medium">Bids</th>
                  <th className="px-4 py-2.5 font-medium">Leading bid</th>
                  <th className="px-4 py-2.5 font-medium">Ends</th>
                </tr>
              </thead>
              <tbody>
                {insights.propertiesInBidding.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-zinc-400">
                      No live auctions with bidding activity
                    </td>
                  </tr>
                ) : (
                  insights.propertiesInBidding.map((item) => (
                    <tr key={item.propertyId} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                      <td className="px-4 py-3">
                        <Link href={`/auctions/${item.propertyId}`} className="font-medium text-zinc-900 hover:text-emerald-700 dark:text-white dark:hover:text-emerald-300">
                          {item.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {[item.microMarketLocality, item.city].filter(Boolean).join(", ") || "—"}
                        </p>
                        {item.leadingBidderName ? (
                          <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                            Leading: {item.leadingBidderName}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 tabular-nums font-semibold">{item.totalBids}</td>
                      <td className="px-4 py-3 tabular-nums font-semibold text-emerald-700 dark:text-emerald-300">
                        {formatBidAmount(item.currentBidAmount)}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {formatShortDate(item.auctionEndDateTime)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Recent activity"
          subtitle={`${insights.periodBidCount} bids · ${activityDaysLabel(activityDays).toLowerCase()}`}
          theme="activity"
        >
          {insights.recentActivity.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-zinc-400">
              No bids in this period
            </p>
          ) : (
            <ul className="divide-y divide-sky-100 dark:divide-sky-900/30">
              {insights.recentActivity.map((item) => (
                <li key={item.id} className="flex gap-3 px-4 py-3">
                  <div className="mt-1 size-2 shrink-0 rounded-full bg-sky-400 dark:bg-sky-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-800 dark:text-zinc-200">
                      <span className="font-semibold">{item.userName}</span>
                      {item.userRole ? (
                        <span className="ml-1 text-xs text-zinc-400">({item.userRole})</span>
                      ) : null}{" "}
                      bid {formatBidAmount(item.amount)} on{" "}
                      <Link href={`/auctions/${item.propertyId}`} className="font-medium text-sky-800 hover:text-sky-600 dark:text-sky-200 dark:hover:text-sky-300">
                        {item.propertyTitle}
                      </Link>
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {formatDate(item.createdAt)}
                      {item.propertyCity ? ` · ${item.propertyCity}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Latest listings"
          subtitle="Recently added properties"
          action={{ label: "All properties", href: "/dashboard/property" }}
          theme="listings"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-left text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/30">
                  <th className="px-4 py-2.5 font-medium">Property</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Added</th>
                </tr>
              </thead>
              <tbody>
                {insights.latestListings.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-sm text-zinc-400">
                      No listings yet
                    </td>
                  </tr>
                ) : (
                  insights.latestListings.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/property/${item.id}/edit`} className="font-medium text-violet-900 hover:text-violet-700 dark:text-violet-200 dark:hover:text-violet-300">
                          {item.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{statusBadge(item.auctionStatus)}</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">{formatShortDate(item.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Closed auctions"
          subtitle="Recently ended auctions"
          action={{ label: "View ended", href: "/dashboard/bid-monitor" }}
          theme="closed"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-left text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/30">
                  <th className="px-4 py-2.5 font-medium">Property</th>
                  <th className="px-4 py-2.5 font-medium">Bids</th>
                  <th className="px-4 py-2.5 font-medium">Winning bid</th>
                  <th className="px-4 py-2.5 font-medium text-right">View</th>
                </tr>
              </thead>
              <tbody>
                {insights.closedAuctions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-zinc-400">
                      No closed auctions yet
                    </td>
                  </tr>
                ) : (
                  insights.closedAuctions.map((item) => (
                    <tr key={item.propertyId} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            {item.image ? (
                              <Image
                                src={getMediaUrl(item.image)}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/auctions/${item.propertyId}`}
                              className="font-medium text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
                            >
                              {item.title}
                            </Link>
                            <p className="mt-0.5 text-xs text-zinc-500">
                              {[item.microMarketLocality, item.city].filter(Boolean).join(", ") || "—"}
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-400">
                              Ended {formatDate(item.auctionEndDateTime)}
                            </p>
                            {item.winningBidderName ? (
                              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Winner: {item.winningBidderName}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 tabular-nums font-semibold">{item.totalBids}</td>
                      <td className="px-4 py-3 tabular-nums font-semibold text-zinc-600 dark:text-zinc-300">
                        {formatBidAmount(item.winningBid)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/dashboard/property/${item.propertyId}/edit`}
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
                          title={`View ${item.title}`}
                        >
                          <EyeIcon />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-white">
            Role breakdown
          </h2>
        </div>

        <SectionGroup
          title="Listings"
          description="Who listed how many properties on the platform"
          theme="listings"
        >
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <RoleBreakdownCard
              title="Admin — Listings"
              subtitle="Number of properties listed per admin"
              variant="listings"
              rows={insights.roleBreakdown.adminListings}
              seeMoreHref="/dashboard/property"
            />
            <RoleBreakdownCard
              title="Brokers — Listings"
              subtitle="Number of properties listed per broker"
              variant="listings"
              rows={insights.roleBreakdown.brokerListings}
              seeMoreHref="/dashboard/property"
            />
            <RoleBreakdownCard
              title="Sellers — Listings"
              subtitle="Number of properties listed per seller"
              variant="listings"
              rows={insights.roleBreakdown.sellerListings}
              seeMoreHref="/dashboard/property"
            />
          </div>
        </SectionGroup>

        <SectionGroup
          title="Bids"
          description="Who bid on how many properties and where they are leading"
          theme="bids"
        >
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <RoleBreakdownCard
              title="Buyers — Bids"
              subtitle="Properties bid on and total bid activity"
              variant="bids"
              rows={insights.roleBreakdown.buyerBids}
              seeMoreHref="/dashboard/bid-monitor"
            />
            <RoleBreakdownCard
              title="Brokers — Bids"
              subtitle="Properties bid on and total bid activity"
              variant="bids"
              rows={insights.roleBreakdown.brokerBids}
              seeMoreHref="/dashboard/bid-monitor"
            />
            <RoleBreakdownCard
              title="Sellers — Bids"
              subtitle="Properties bid on and total bid activity"
              variant="bids"
              rows={insights.roleBreakdown.sellerBids}
              seeMoreHref="/dashboard/bid-monitor"
            />
          </div>
        </SectionGroup>
      </div>
    </div>
  );
}

function UserStatCard({
  label,
  value,
  hint,
  href,
  accent,
}: {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  accent: string;
}) {
  const className = `rounded-xl border px-4 py-3 transition-all ${accent} ${href ? "hover:shadow-sm" : ""}`;
  const content = (
    <>
      <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      {hint ? <p className="mt-0.5 text-xs opacity-70">{hint}</p> : null}
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

function UserDashboardView({ data }: { data: DashboardOverviewData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <UserStatCard
          label="Live Auctions"
          value={data.liveAuctionsCount}
          hint="Open for bidding"
          href="/dashboard/auctions"
          accent="border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        />
        {data.bids ? (
          <>
            <UserStatCard
              label="My Bids"
              value={data.bids.myBidsCount}
              hint="Properties bid on"
              href="/dashboard/buyers"
              accent="border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            />
            <UserStatCard
              label="Leading"
              value={data.bids.leadingBidsCount}
              hint="Highest bidder"
              href="/dashboard/buyers"
              accent="border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            />
            <UserStatCard
              label="Outbid"
              value={data.bids.outbidCount}
              hint="Raise your bid"
              href="/dashboard/buyers"
              accent="border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            />
          </>
        ) : null}
        {data.properties ? (
          <>
            <UserStatCard
              label="My Listings"
              value={data.properties.totalProperties}
              hint="All properties"
              href="/dashboard/property"
              accent="border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            />
            <UserStatCard
              label="Live"
              value={data.properties.liveListings}
              hint="Under auction"
              href="/dashboard/property?status=Live"
              accent="border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            />
            <UserStatCard
              label="Upcoming"
              value={data.properties.upcomingListings}
              hint="Starting soon"
              href="/dashboard/property?status=Upcoming"
              accent="border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            />
            <UserStatCard
              label="Ended"
              value={data.properties.endedListings}
              hint="Auction closed"
              href="/dashboard/property?status=Ended"
              accent="border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            />
          </>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {data.bids?.recentBids.length ? (
          <Panel
            title="Your recent bids"
            action={{ label: "View all", href: "/dashboard/buyers" }}
          >
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {data.bids.recentBids.map((bid) => (
                <Link
                  key={bid.propertyId}
                  href={`/auctions/${bid.propertyId}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    {bid.image ? (
                      <Image
                        src={getMediaUrl(bid.image)}
                        alt={bid.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{bid.title}</p>
                    <p className="text-xs text-zinc-500">
                      My bid {formatBidAmount(bid.myHighestBid)} · Current{" "}
                      {formatBidAmount(bid.currentBidAmount)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${bid.isLeading
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                  >
                    {bid.isLeading ? "Leading" : "Outbid"}
                  </span>
                  <ChevronIcon />
                </Link>
              ))}
            </div>
          </Panel>
        ) : null}

        {data.properties?.recentProperties.length ? (
          <Panel
            title="Your recent listings"
            action={{ label: "View all", href: "/dashboard/property" }}
          >
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {data.properties.recentProperties.map((property) => (
                <Link
                  key={property.id}
                  href={
                    property.auctionStatus === "Live"
                      ? `/auctions/${property.id}`
                      : `/dashboard/property/${property.id}/edit`
                  }
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    {property.image ? (
                      <Image
                        src={getMediaUrl(property.image)}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {property.title}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Updated {formatDate(property.updatedAt)}
                    </p>
                  </div>
                  {statusBadge(property.auctionStatus)}
                  <ChevronIcon />
                </Link>
              ))}
            </div>
          </Panel>
        ) : null}
      </div>
    </div>
  );
}

export function DashboardOverview() {
  const { isAuthenticated, isReady } = useAuth();
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityDays, setActivityDays] = useState(30);

  const fetchOverview = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError("");

    try {
      const { data: response } = await api.get<{
        success: boolean;
        message?: string;
        data?: DashboardOverviewData;
      }>("/api/dashboard/overview", {
        params: { days: activityDays || "all" },
      });

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
  }, [activityDays, isAuthenticated]);

  useEffect(() => {
    if (!isReady || !isAuthenticated) return;
    fetchOverview();
  }, [fetchOverview, isAuthenticated, isReady]);

  const isAdminView = useMemo(
    () =>
      Boolean(
        data?.adminInsights &&
        (data.user.role === "Admin" || data.user.role === "Super-Admin"),
      ),
    [data],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
        {error || "Unable to load dashboard data."}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">
              Welcome, {data.user.name.split(" ")[0]}
            </h1>
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {data.user.role}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {isAdminView
              ? "Platform overview — listings, bids, users, and live activity."
              : "Your auctions, bids, and listings at a glance."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAdminView ? (
            <ActivityFilter value={activityDays} onChange={setActivityDays} />
          ) : null}
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

      {isAdminView && data.adminInsights ? (
        <AdminDashboardView
          data={data}
          insights={data.adminInsights}
          activityDays={activityDays}
        />
      ) : (
        <UserDashboardView data={data} />
      )}
    </div>
  );
}
