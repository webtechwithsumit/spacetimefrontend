"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Pagination } from "@/components/pagination";
import { PageHeader } from "@/dashboard/components/page-header";
import { btnPrimaryClass } from "@/dashboard/components/ui";
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
  return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300";
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

  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await api.get<UsersResponse>("/api/users", {
        params: buildPaginationParams(currentPage),
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
  }, [isAuthenticated, currentPage]);

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
