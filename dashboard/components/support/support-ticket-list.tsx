"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import { Pagination } from "@/dashboard/components/pagination";
import { SelectField } from "@/dashboard/components/ui";
import { getApiErrorMessage } from "@/lib/api";
import {
  buildPaginationParams,
  DEFAULT_PAGINATION,
  type PaginationMeta,
} from "@/lib/pagination";
import {
  categoryBadgeClass,
  fetchAdminTickets,
  priorityBadgeClass,
  statusBadgeClass,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type Ticket,
  type TicketCategory,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/tickets";

export function SupportTicketList() {
  const { user, isAuthenticated } = useAuth();
  const { error } = useToast();
  const isAdmin = user?.role === "Admin" || user?.role === "Super-Admin";

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] =
    useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, priorityFilter, categoryFilter]);

  const loadTickets = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;
    setLoading(true);
    try {
      const response = await fetchAdminTickets({
        ...buildPaginationParams(currentPage),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(statusFilter ? { status: statusFilter as TicketStatus } : {}),
        ...(priorityFilter ? { priority: priorityFilter as TicketPriority } : {}),
        ...(categoryFilter ? { category: categoryFilter as TicketCategory } : {}),
      });
      setTickets(response.data ?? []);
      setPagination(response.pagination ?? DEFAULT_PAGINATION);
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to load support tickets"));
      setTickets([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, [
    categoryFilter,
    currentPage,
    debouncedSearch,
    error,
    isAdmin,
    isAuthenticated,
    priorityFilter,
    statusFilter,
  ]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <p className="text-sm text-zinc-500">
        Only Admin and Super-Admin can manage support tickets.
      </p>
    );
  }

  return (
    <>
      <PageHeader
        title="Support Tickets"
        description="View, assign, and resolve user support requests."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by subject or ticket number..."
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-xs"
        />
        <div className="w-full sm:max-w-[180px]">
          <SelectField
            id="admin-ticket-status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={TICKET_STATUSES}
            placeholder="All statuses"
          />
        </div>
        <div className="w-full sm:max-w-[160px]">
          <SelectField
            id="admin-ticket-priority"
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={TICKET_PRIORITIES}
            placeholder="All priorities"
          />
        </div>
        <div className="w-full sm:max-w-[160px]">
          <SelectField
            id="admin-ticket-category"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={TICKET_CATEGORIES}
            placeholder="All categories"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-sm text-zinc-500">No support tickets found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Ticket
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  User
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Priority
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Assigned
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/support/${ticket.id}`}
                      className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                      {ticket.ticketNumber}
                    </Link>
                    <p className="mt-0.5 max-w-xs truncate text-zinc-700 dark:text-zinc-300">
                      {ticket.subject}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {ticket.userId?.name ?? "—"}
                    </p>
                    <p className="text-xs text-zinc-500">{ticket.userId?.email ?? ""}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(ticket.status)}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${priorityBadgeClass(ticket.priority)}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${categoryBadgeClass(ticket.category)}`}
                    >
                      {ticket.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {ticket.assignedTo?.name ?? "Unassigned"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
