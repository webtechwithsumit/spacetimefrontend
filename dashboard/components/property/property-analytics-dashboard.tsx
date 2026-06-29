"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Pagination } from "@/components/pagination";
import { PageHeader } from "@/dashboard/components/page-header";
import { api, getApiErrorMessage } from "@/lib/api";
import { getDefaultAnalyticsRange } from "@/lib/analytics-overview";
import type { PropertyAnalyticsData, PropertyAnalyticsResponse } from "@/lib/property-analytics";
import {
  describeTimelineItem,
  formatActivityTimestamp,
  getEventBadgeClass,
  getEventLabel,
} from "@/lib/user-activity";

type PropertyAnalyticsDashboardProps = {
  propertyId: string;
};

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
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-white">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T00:00:00`));
}

export function PropertyAnalyticsDashboard({
  propertyId,
}: PropertyAnalyticsDashboardProps) {
  const [range, setRange] = useState(getDefaultAnalyticsRange(30));
  const [timelinePage, setTimelinePage] = useState(1);
  const [data, setData] = useState<PropertyAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data: response } = await api.get<PropertyAnalyticsResponse>(
        `/api/analytics/property/${propertyId}`,
        {
          params: {
            page: timelinePage,
            limit: 20,
            ...range,
          },
        },
      );

      if (!response.success || !response.data) {
        setError(response.message || "Failed to load property analytics");
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
  }, [propertyId, range, timelinePage]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    setTimelinePage(1);
  }, [range, propertyId]);

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <div className="h-20 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <PageHeader
            title="Property Analytics"
            description={`Performance for ${data.property.title}`}
          />
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{data.property.category}</span>
            <span>·</span>
            <span>{data.property.city || "City not set"}</span>
            <span>·</span>
            <span>{data.property.auctionStatus || data.property.status}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/auctions/${propertyId}`}
            className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300"
          >
            View Live Page
          </Link>
          <input
            type="date"
            value={range.from}
            onChange={(e) =>
              setRange((prev) => ({ ...prev, from: e.target.value }))
            }
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900"
          />
          <span className="text-xs text-zinc-400">to</span>
          <input
            type="date"
            value={range.to}
            onChange={(e) =>
              setRange((prev) => ({ ...prev, to: e.target.value }))
            }
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Unique Visitors" value={data.summary.uniqueVisitors} />
        <StatCard
          label="Property Views"
          value={data.summary.totalViews}
          hint="Opened property detail page"
        />
        <StatCard
          label="Card Clicks"
          value={data.summary.cardClicks}
          hint="Clicked from auction listing"
        />
        <StatCard
          label="Clicks on Page"
          value={data.summary.pageClicks}
          hint="Buttons/links on property page"
        />
        <StatCard label="Registered" value={data.summary.registeredVisitors} />
        <StatCard label="Guests" value={data.summary.guestVisitors} />
        <StatCard label="Bids Placed" value={data.summary.bidsPlaced} />
        <StatCard
          label="View → Bid Rate"
          value={`${data.summary.viewToBidRate}%`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Views Over Time
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="date" tickFormatter={formatShortDate} fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip labelFormatter={(value) => formatShortDate(String(value))} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Views"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Property Types Users Searched
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Categories searched before viewing this property
          </p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categoryInterest}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="category" fontSize={11} interval={0} angle={-15} textAnchor="end" height={70} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" name="Searches" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Where Users Came From
          </h3>
          <div className="mt-4 space-y-2">
            {data.trafficSources.length ? (
              data.trafficSources.map((item) => (
                <div
                  key={item.path}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="truncate text-zinc-700 dark:text-zinc-300">
                    {item.path}
                  </span>
                  <span className="tabular-nums text-zinc-500">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">No traffic source data yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Where Users Went Next
          </h3>
          <div className="mt-4 space-y-2">
            {data.nextPages.length ? (
              data.nextPages.map((item) => (
                <div
                  key={item.path}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="truncate text-zinc-700 dark:text-zinc-300">
                    {item.path}
                  </span>
                  <span className="tabular-nums text-zinc-500">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">No next-page data yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Top Clicks on Property
          </h3>
          <div className="mt-4 space-y-2">
            {data.topClicks.length ? (
              data.topClicks.map((item) => (
                <div
                  key={`${item.label}-${item.href}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="truncate text-zinc-700 dark:text-zinc-300">
                    {item.label}
                  </span>
                  <span className="tabular-nums text-zinc-500">{item.count}x</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">No clicks recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            What Users Searched Before Viewing
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                <th className="px-4 py-2">Search Query</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Building Type</th>
                <th className="px-4 py-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {data.searchesBeforeView.length ? (
                data.searchesBeforeView.map((row, index) => (
                  <tr
                    key={`${row.query}-${row.category}-${index}`}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="px-4 py-3">{row.query || "—"}</td>
                    <td className="px-4 py-3">{row.category || "—"}</td>
                    <td className="px-4 py-3">{row.city || "—"}</td>
                    <td className="px-4 py-3">{row.buildingType || "—"}</td>
                    <td className="px-4 py-3 tabular-nums">{row.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                    No search data linked to this property yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Visitor Journeys
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            What each visitor did before and after opening this property
          </p>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {data.visitors.length ? (
            data.visitors.map((visitor) => (
              <div key={visitor.visitorKey} className="px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {visitor.name || `Guest ${visitor.sessionId.slice(0, 8)}...`}
                  </p>
                  {visitor.email ? (
                    <span className="text-xs text-zinc-500">{visitor.email}</span>
                  ) : null}
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {visitor.views} view{visitor.views === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {visitor.journey.map((step, index) => (
                    <div
                      key={`${visitor.visitorKey}-${index}`}
                      className="flex flex-wrap items-center gap-2 text-xs"
                    >
                      <span className="text-zinc-400">
                        {formatActivityTimestamp(step.createdAt)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide ${getEventBadgeClass(step.event)}`}
                      >
                        {getEventLabel(step.event)}
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {describeTimelineItem({
                          id: String(index),
                          event: step.event,
                          properties: step.properties,
                          path: step.path,
                          sessionId: visitor.sessionId,
                          userId: visitor.userId,
                          createdAt: step.createdAt,
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="px-4 py-8 text-sm text-zinc-500">
              No visitor journeys recorded yet.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            All Property Events
          </h3>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {data.timeline.map((item) => (
            <div key={item.id} className="px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getEventBadgeClass(item.event)}`}
                >
                  {getEventLabel(item.event)}
                </span>
                <span className="text-xs text-zinc-500">
                  {formatActivityTimestamp(item.createdAt)}
                </span>
                {item.userId ? (
                  <span className="text-xs text-zinc-500">
                    {item.userId.name} ({item.userId.role})
                  </span>
                ) : (
                  <span className="text-xs text-zinc-500">
                    Guest {item.sessionId.slice(0, 8)}...
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-zinc-900 dark:text-white">
                {describeTimelineItem({
                  id: item.id,
                  event: item.event,
                  properties: item.properties,
                  path: item.path,
                  sessionId: item.sessionId,
                  userId: item.userId?.id ?? null,
                  createdAt: item.createdAt,
                })}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <Pagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setTimelinePage}
          />
        </div>
      </div>
    </div>
  );
}
