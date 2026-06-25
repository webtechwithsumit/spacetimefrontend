"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pagination } from "@/components/pagination";
import { useAuth } from "@/components/auth-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import { api, getApiErrorMessage } from "@/lib/api";
import { getDefaultAnalyticsRange } from "@/lib/analytics-overview";
import {
  DEFAULT_PAGINATION,
  type PaginationMeta,
} from "@/lib/pagination";
import {
  describeTimelineItem,
  formatActivityTimestamp,
  getEventBadgeClass,
  getEventLabel,
  type ActivityTimelineItem,
  type ActivityUserRow,
  type ActivityUsersResponse,
  type GuestSessionRow,
  type GuestSessionsResponse,
  type UserActivityData,
  type UserActivityResponse,
} from "@/lib/user-activity";

type ViewMode = "users" | "guests";

const EVENT_FILTERS = [
  "all",
  "click",
  "page_view",
  "auction_viewed",
  "bid_placed",
  "login",
  "signup_completed",
  "logout",
  "property_created",
] as const;

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

export function UserActivityDashboard() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "Admin" || user?.role === "Super-Admin";

  const [range, setRange] = useState(getDefaultAnalyticsRange(30));
  const [viewMode, setViewMode] = useState<ViewMode>("users");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [listPage, setListPage] = useState(1);
  const [timelinePage, setTimelinePage] = useState(1);
  const [eventFilter, setEventFilter] =
    useState<(typeof EVENT_FILTERS)[number]>("all");

  const [users, setUsers] = useState<ActivityUserRow[]>([]);
  const [guestSessions, setGuestSessions] = useState<GuestSessionRow[]>([]);
  const [listPagination, setListPagination] =
    useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [activity, setActivity] = useState<UserActivityData | null>(null);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  const [listLoading, setListLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setListPage(1);
  }, [debouncedSearch, range, viewMode]);

  useEffect(() => {
    setTimelinePage(1);
  }, [selectedUserId, selectedSessionId, range, eventFilter]);

  const fetchList = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;

    setListLoading(true);
    setError("");

    try {
      if (viewMode === "users") {
        const { data } = await api.get<ActivityUsersResponse>(
          "/api/analytics/activity-users",
          {
            params: {
              page: listPage,
              limit: 10,
              search: debouncedSearch || undefined,
              ...range,
            },
          },
        );

        if (!data.success) {
          setError(data.message || "Failed to load active users");
          setUsers([]);
          return;
        }

        setUsers(data.data ?? []);
        setListPagination(data.pagination ?? DEFAULT_PAGINATION);
      } else {
        const { data } = await api.get<GuestSessionsResponse>(
          "/api/analytics/activity-sessions",
          {
            params: {
              page: listPage,
              limit: 10,
              ...range,
            },
          },
        );

        if (!data.success) {
          setError(data.message || "Failed to load guest sessions");
          setGuestSessions([]);
          return;
        }

        setGuestSessions(data.data ?? []);
        setListPagination(data.pagination ?? DEFAULT_PAGINATION);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setListLoading(false);
    }
  }, [
    isAuthenticated,
    isAdmin,
    viewMode,
    listPage,
    debouncedSearch,
    range,
  ]);

  const fetchActivity = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;
    if (!selectedUserId && !selectedSessionId) {
      setActivity(null);
      return;
    }

    setActivityLoading(true);
    setError("");

    try {
      const { data } = await api.get<UserActivityResponse>(
        "/api/analytics/user-activity",
        {
          params: {
            page: timelinePage,
            limit: 25,
            event: eventFilter === "all" ? undefined : eventFilter,
            ...(selectedUserId ? { userId: selectedUserId } : {}),
            ...(selectedSessionId ? { sessionId: selectedSessionId } : {}),
            ...range,
          },
        },
      );

      if (!data.success || !data.data) {
        setError(data.message || "Failed to load user activity");
        setActivity(null);
        return;
      }

      setActivity(data.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setActivity(null);
    } finally {
      setActivityLoading(false);
    }
  }, [
    isAuthenticated,
    isAdmin,
    selectedUserId,
    selectedSessionId,
    timelinePage,
    eventFilter,
    range,
  ]);

  useEffect(() => {
    if (isAdmin) fetchList();
  }, [isAdmin, fetchList]);

  useEffect(() => {
    if (isAdmin) fetchActivity();
  }, [isAdmin, fetchActivity]);

  const selectedLabel = useMemo(() => {
    if (selectedUserId) {
      const match = users.find((row) => row.userId === selectedUserId);
      return match ? `${match.name} (${match.email})` : "Selected user";
    }
    if (selectedSessionId) {
      return `Guest session ${selectedSessionId.slice(0, 8)}...`;
    }
    return null;
  }, [selectedUserId, selectedSessionId, users]);

  function selectUser(row: ActivityUserRow) {
    setSelectedUserId(row.userId);
    setSelectedSessionId(null);
  }

  function selectGuestSession(row: GuestSessionRow) {
    setSelectedSessionId(row.sessionId);
    setSelectedUserId(null);
  }

  if (!isAdmin) {
    return (
      <div>
        <PageHeader
          title="User Activity"
          description="Track clicks, page visits, and full user journeys."
        />
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          Admin access required to view user activity.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <PageHeader
          title="User Activity"
          description="See exactly where users clicked, which pages they visited, and their full journey."
        />
        <div className="flex flex-wrap items-center gap-2">
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

      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/analytics"
          className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300"
        >
          Platform Analytics
        </Link>
        <button
          type="button"
          onClick={() => setViewMode("users")}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            viewMode === "users"
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : "border border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
          }`}
        >
          Logged-in Users
        </button>
        <button
          type="button"
          onClick={() => setViewMode("guests")}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            viewMode === "guests"
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : "border border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
          }`}
        >
          Guest Sessions
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {viewMode === "users" ? "Active Users" : "Guest Sessions"}
            </h2>
            {viewMode === "users" ? (
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, phone..."
                className="mt-3 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
              />
            ) : (
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Anonymous visitors tracked by session ID.
              </p>
            )}
          </div>

          <div className="max-h-[560px] overflow-y-auto p-2">
            {listLoading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900"
                  />
                ))}
              </div>
            ) : viewMode === "users" ? (
              users.length ? (
                users.map((row) => {
                  const active = selectedUserId === row.userId;
                  return (
                    <button
                      key={row.userId}
                      type="button"
                      onClick={() => selectUser(row)}
                      className={`mb-2 w-full rounded-lg border px-3 py-3 text-left transition-colors ${
                        active
                          ? "border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/30"
                          : "border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                            {row.name}
                          </p>
                          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {row.email}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {row.role}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                        <span>{row.totalEvents} events</span>
                        <span>{row.clicks} clicks</span>
                        <span>{row.pageViews} pages</span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="p-4 text-sm text-zinc-500">No user activity found.</p>
              )
            ) : guestSessions.length ? (
              guestSessions.map((row) => {
                const active = selectedSessionId === row.sessionId;
                return (
                  <button
                    key={row.sessionId}
                    type="button"
                    onClick={() => selectGuestSession(row)}
                    className={`mb-2 w-full rounded-lg border px-3 py-3 text-left transition-colors ${
                      active
                        ? "border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/30"
                        : "border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      Session {row.sessionId.slice(0, 12)}...
                    </p>
                    <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                      Last page: {row.lastPath || "—"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span>{row.totalEvents} events</span>
                      <span>{row.clicks} clicks</span>
                      <span>{row.pageViews} pages</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="p-4 text-sm text-zinc-500">
                No guest sessions found.
              </p>
            )}
          </div>

          <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
            <Pagination
              currentPage={listPagination.page}
              totalPages={listPagination.totalPages}
              onPageChange={setListPage}
            />
          </div>
        </div>

        <div className="space-y-4">
          {!selectedLabel ? (
            <div className="rounded-xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-700">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Select a user or guest session
              </p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                You will see every click, page visit, bid, and login in a full
                timeline.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {selectedLabel}
                    </p>
                    {activity?.user ? (
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {activity.user.phone} · Joined{" "}
                        {formatActivityTimestamp(activity.user.createdAt)}
                      </p>
                    ) : null}
                  </div>
                  <select
                    value={eventFilter}
                    onChange={(e) =>
                      setEventFilter(
                        e.target.value as (typeof EVENT_FILTERS)[number],
                      )
                    }
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    {EVENT_FILTERS.map((filter) => (
                      <option key={filter} value={filter}>
                        {filter === "all" ? "All events" : getEventLabel(filter)}
                      </option>
                    ))}
                  </select>
                </div>

                {activity ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <StatPill label="Total" value={activity.summary.totalEvents} />
                    <StatPill label="Clicks" value={activity.summary.clicks} />
                    <StatPill label="Pages" value={activity.summary.pageViews} />
                    <StatPill
                      label="Auction Views"
                      value={activity.summary.auctionViews}
                    />
                    <StatPill label="Bids" value={activity.summary.bids} />
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Page Journey
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Order of pages visited in this range
                  </p>
                  <div className="mt-4 space-y-3">
                    {activity?.journey.length ? (
                      activity.journey.map((step, index) => (
                        <div
                          key={`${step.path}-${index}`}
                          className="flex gap-3 text-sm"
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-zinc-900 dark:text-white">
                              {step.path}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {step.views} visit{step.views === 1 ? "" : "s"} ·{" "}
                              {formatActivityTimestamp(step.firstSeen)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">No page journey yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Top Clicks
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Most clicked buttons and links
                  </p>
                  <div className="mt-4 space-y-3">
                    {activity?.topClicks.length ? (
                      activity.topClicks.map((click, index) => (
                        <div
                          key={`${click.label}-${click.path}-${index}`}
                          className="rounded-lg border border-zinc-100 px-3 py-2 dark:border-zinc-900"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                              {click.label}
                            </p>
                            <span className="shrink-0 text-xs tabular-nums text-zinc-500">
                              {click.count}x
                            </span>
                          </div>
                          <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {click.path}
                            {click.href ? ` · ${click.href}` : ""}
                          </p>
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
                    Full Timeline
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Every tracked click, visit, bid, and auth event
                  </p>
                </div>

                {activityLoading ? (
                  <div className="space-y-2 p-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-14 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900"
                      />
                    ))}
                  </div>
                ) : activity?.timeline.length ? (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
                    {activity.timeline.map((item: ActivityTimelineItem) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getEventBadgeClass(item.event)}`}
                            >
                              {getEventLabel(item.event)}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {formatActivityTimestamp(item.createdAt)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-zinc-900 dark:text-white">
                            {describeTimelineItem(item)}
                          </p>
                          {item.path ? (
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              Page: {item.path}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-6 text-sm text-zinc-500">
                    No activity found for this selection.
                  </p>
                )}

                {activity ? (
                  <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                    <Pagination
                      currentPage={activity.pagination.page}
                      totalPages={activity.pagination.totalPages}
                      onPageChange={setTimelinePage}
                    />
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
