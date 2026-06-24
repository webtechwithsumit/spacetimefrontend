"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Pagination } from "@/components/pagination";
import { PageHeader } from "@/dashboard/components/page-header";
import { btnPrimaryClass } from "@/dashboard/components/ui";
import { ALL_USER_ROLES } from "@/dashboard/constants/nav-items";
import { api, getApiErrorMessage } from "@/lib/api";
import {
  buildPaginationParams,
  DEFAULT_PAGINATION,
  type PaginatedResponse,
  type PaginationMeta,
} from "@/lib/pagination";

type DashboardUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt?: string;
};

type UsersResponse = PaginatedResponse<DashboardUser>;

function roleBadgeClass(role: string) {
  if (role === "Super-Admin") {
    return "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300";
  }
  if (role === "Admin") {
    return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
  }
  if (role === "Buyer") {
    return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  }
  if (role === "Seller") {
    return "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300";
  }
  if (role === "Broker") {
    return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300";
  }
  return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
}

export function UsersList() {
  const { user, isAuthenticated } = useAuth();
  const isSuperAdmin = user?.role === "Super-Admin";

  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [pagination, setPagination] =
    useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, roleFilter]);

  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await api.get<UsersResponse>("/api/users", {
        params: {
          ...buildPaginationParams(currentPage),
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
          ...(roleFilter ? { role: roleFilter } : {}),
        },
      });

      if (!data.success) {
        setError(data.message || "Failed to load users");
        setUsers([]);
        setPagination(DEFAULT_PAGINATION);
        return;
      }

      setUsers(data.data ?? []);
      setPagination(data.pagination ?? DEFAULT_PAGINATION);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setUsers([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentPage, debouncedSearch, roleFilter]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin, fetchUsers]);

  if (!isSuperAdmin) {
    return (
      <div>
        <PageHeader
          title="Users"
          description="View and manage system users."
        />
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          Super-Admin access required to manage users.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Users"
          description="View all users and manage roles."
        />
        <Link
          href="/dashboard/system-master/users/create"
          className={`${btnPrimaryClass} shrink-0 text-center`}
        >
          Create User
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="mb-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-4 sm:grid-cols-[1fr_180px_auto] sm:items-end">
          <div>
            <label
              htmlFor="searchUsers"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Search
            </label>
            <input
              id="searchUsers"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, email, or phone"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white dark:focus:border-indigo-400 dark:focus:bg-zinc-900"
            />
          </div>
          <div>
            <label
              htmlFor="roleFilter"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Role
            </label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white dark:focus:border-indigo-400 dark:focus:bg-zinc-900"
            >
              <option value="">All roles</option>
              {ALL_USER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setRoleFilter("");
            }}
            disabled={!searchQuery && !roleFilter}
            className="rounded-full border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Clear
          </button>
        </div>
        {(debouncedSearch || roleFilter) && (
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            {loading
              ? "Filtering..."
              : `${pagination.total} user${pagination.total === 1 ? "" : "s"} found`}
            {roleFilter ? ` · Role: ${roleFilter}` : ""}
            {debouncedSearch ? ` · Search: "${debouncedSearch}"` : ""}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Sr. No
                </th>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Name
                </th>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Email
                </th>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Phone
                </th>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Role
                </th>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60"
                  >
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {item.email}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {item.phone}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleBadgeClass(item.role)}`}
                      >
                        {item.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/system-master/users/${item._id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="size-4"
                        >
                          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
