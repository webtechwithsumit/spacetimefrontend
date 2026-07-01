"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { SelectField } from "@/dashboard/components/ui";
import { Pagination } from "@/components/pagination";
import {
  buildPaginationParams,
  DEFAULT_PAGINATION,
  type PaginationMeta,
} from "@/lib/pagination";
import {
  categoryBadgeClass,
  fetchMyTickets,
  priorityBadgeClass,
  statusBadgeClass,
  TICKET_STATUSES,
  type Ticket,
  type TicketStatus,
} from "@/lib/tickets";

export function SupportTicketsContent() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] =
    useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login?redirect=/support/tickets");
    }
  }, [isAuthenticated, isReady, router]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const loadTickets = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await fetchMyTickets({
        ...buildPaginationParams(currentPage),
        ...(statusFilter ? { status: statusFilter as TicketStatus } : {}),
      });
      setTickets(response.data ?? []);
      setPagination(response.pagination ?? DEFAULT_PAGINATION);
    } catch {
      setTickets([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, [currentPage, isAuthenticated, statusFilter]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  if (!isReady) {
    return (
      <p className="mx-auto max-w-5xl px-4 py-10 text-sm text-zinc-500">
        Loading...
      </p>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/support"
            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            ← Back to support
          </Link>
          <h2 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-white">
            My support tickets
          </h2>
        </div>
        <Link
          href="/support"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          New ticket
        </Link>
      </div>

      <div className="mb-6 w-full sm:max-w-xs">
        <SelectField
          id="ticket-status-filter"
          label="Filter by status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={TICKET_STATUSES}
          placeholder="All statuses"
        />
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No tickets yet. Create one if you need help.
          </p>
          <Link
            href="/support"
            className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Create a ticket
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/support/tickets/${ticket.id}`}
              className="block rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-700"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-500">
                    {ticket.ticketNumber}
                  </p>
                  <h3 className="mt-1 text-base font-medium text-zinc-900 dark:text-white">
                    {ticket.subject}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    {new Date(ticket.createdAt).toLocaleString()} ·{" "}
                    {ticket.replyCount} {ticket.replyCount === 1 ? "reply" : "replies"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(ticket.status)}`}
                  >
                    {ticket.status}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityBadgeClass(ticket.priority)}`}
                  >
                    {ticket.priority}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryBadgeClass(ticket.category)}`}
                  >
                    {ticket.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}
