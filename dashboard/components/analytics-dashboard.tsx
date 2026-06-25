"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/components/auth-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import { api, getApiErrorMessage } from "@/lib/api";
import {
  getDefaultAnalyticsRange,
  type AnalyticsOverviewData,
  type AnalyticsOverviewResponse,
} from "@/lib/analytics-overview";
import { formatBidAmount } from "@/lib/live-auctions";

const CHART_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#0ea5e9",
  "#ef4444",
  "#14b8a6",
  "#f97316",
];

const RANGE_PRESETS = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
] as const;

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-white">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      ) : null}
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function formatShortDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function AnalyticsDashboard() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "Admin" || user?.role === "Super-Admin";

  const [range, setRange] = useState(getDefaultAnalyticsRange(30));
  const [data, setData] = useState<AnalyticsOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;

    setLoading(true);
    setError("");

    try {
      const { data: response } = await api.get<AnalyticsOverviewResponse>(
        "/api/analytics/overview",
        { params: range },
      );

      if (!response.success || !response.data) {
        setError(response.message || "Failed to load analytics");
        setData(null);
        return;
      }

      setData(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin, range]);

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
    } else {
      setLoading(false);
    }
  }, [isAdmin, fetchAnalytics]);

  const eventTrend = useMemo(() => {
    if (!data) return [];

    const grouped = new Map<string, number>();
    for (const row of data.eventsOverTime) {
      grouped.set(row.date, (grouped.get(row.date) ?? 0) + row.count);
    }

    return [...grouped.entries()]
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  const eventBreakdown = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.eventCounts).map(([event, count]) => ({
      event: event.replaceAll("_", " "),
      count,
    }));
  }, [data]);

  if (!isAdmin) {
    return (
      <div>
        <PageHeader
          title="Analytics"
          description="Platform metrics, trends, and user activity."
        />
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          Admin access required to view analytics.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Analytics"
          description="Platform metrics, bidding trends, and product activity."
        />

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/analytics/user-activity"
            className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300"
          >
            User Activity
          </Link>
          {RANGE_PRESETS.map((preset) => (
            <button
              key={preset.days}
              type="button"
              onClick={() => setRange(getDefaultAnalyticsRange(preset.days))}
              className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-800 dark:hover:text-indigo-300"
            >
              {preset.label}
            </button>
          ))}
          <input
            type="date"
            value={range.from}
            onChange={(e) =>
              setRange((prev) => ({ ...prev, from: e.target.value }))
            }
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          />
          <span className="text-xs text-zinc-400">to</span>
          <input
            type="date"
            value={range.to}
            onChange={(e) =>
              setRange((prev) => ({ ...prev, to: e.target.value }))
            }
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900"
            />
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Users" value={data.summary.totalUsers} />
            <StatCard
              label="New Users"
              value={data.summary.newUsersInRange}
              hint="In selected range"
            />
            <StatCard label="Total Bids" value={data.summary.totalBids} />
            <StatCard
              label="Bids in Range"
              value={data.summary.newBidsInRange}
            />
            <StatCard
              label="Live Auctions"
              value={data.summary.liveAuctions}
            />
            <StatCard
              label="Avg Bid Amount"
              value={formatBidAmount(data.summary.avgBidAmount)}
              hint="In selected range"
            />
            <StatCard
              label="Auction Views"
              value={data.summary.auctionViews}
              hint="Tracked events"
            />
            <StatCard
              label="Total Clicks"
              value={data.summary.clickEvents}
              hint="Tracked in selected range"
            />
            <StatCard
              label="View → Bid Rate"
              value={`${data.summary.viewToBidRate}%`}
              hint={`${data.summary.bidPlacedEvents} bids from views`}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ChartCard
              title="Bids Over Time"
              description="Daily bid count in the selected range"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.bidsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatShortDate}
                      fontSize={12}
                    />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip
                      labelFormatter={(value) => formatShortDate(String(value))}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Bids"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="New Users Over Time"
              description="Daily signups in the selected range"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.usersOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatShortDate}
                      fontSize={12}
                    />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip
                      labelFormatter={(value) => formatShortDate(String(value))}
                    />
                    <Bar dataKey="count" name="Users" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Users by Role"
              description="Current distribution across roles"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.usersByRole}
                      dataKey="count"
                      nameKey="role"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                    >
                      {data.usersByRole.map((entry, index) => (
                        <Cell
                          key={entry.role}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Listing Stages"
              description="Current property pipeline"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { stage: "Live", count: data.propertyStats.live },
                      { stage: "Upcoming", count: data.propertyStats.upcoming },
                      { stage: "Ended", count: data.propertyStats.ended },
                      { stage: "Draft", count: data.propertyStats.draft },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="stage" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" name="Properties" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Bids by City"
              description="Top cities by bid activity"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.bidsByCity} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis type="number" allowDecimals={false} fontSize={12} />
                    <YAxis
                      type="category"
                      dataKey="city"
                      width={90}
                      fontSize={12}
                    />
                    <Tooltip />
                    <Bar dataKey="count" name="Bids" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Bids by Category"
              description="Property categories with most bidding"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.bidsByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="category" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" name="Bids" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Product Events"
              description="Tracked frontend and server events"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={eventTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatShortDate}
                      fontSize={12}
                    />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip
                      labelFormatter={(value) => formatShortDate(String(value))}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Events"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Event Breakdown"
              description="Counts by event type in selected range"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="event" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" name="Events" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <ChartCard
            title="Top Auctions"
            description="Most active auctions in the selected range"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    <th className="px-3 py-2 font-medium">Property</th>
                    <th className="px-3 py-2 font-medium">City</th>
                    <th className="px-3 py-2 font-medium">Bids</th>
                    <th className="px-3 py-2 font-medium">Top Bid</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topAuctions.length ? (
                    data.topAuctions.map((auction) => (
                      <tr
                        key={auction.propertyId}
                        className="border-b border-zinc-100 dark:border-zinc-900"
                      >
                        <td className="px-3 py-3 font-medium text-zinc-900 dark:text-white">
                          {auction.title}
                        </td>
                        <td className="px-3 py-3 text-zinc-600 dark:text-zinc-400">
                          {auction.city || "—"}
                        </td>
                        <td className="px-3 py-3 tabular-nums text-zinc-700 dark:text-zinc-300">
                          {auction.bidCount}
                        </td>
                        <td className="px-3 py-3 tabular-nums text-zinc-700 dark:text-zinc-300">
                          {formatBidAmount(auction.topBid)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-8 text-center text-zinc-500 dark:text-zinc-400"
                      >
                        No bid activity in this range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </>
      ) : null}
    </div>
  );
}
