"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/components/toast-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import { Pagination } from "@/dashboard/components/pagination";
import { btnPrimaryClass } from "@/dashboard/components/ui";
import { api, getApiErrorMessage } from "@/lib/api";
import { fetchAdminPosts, type BlogPost } from "@/lib/blog";
import {
  buildPaginationParams,
  DEFAULT_PAGINATION,
  type PaginationMeta,
} from "@/lib/pagination";

function statusClass(status: string) {
  return status === "published"
    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";
}

export function BlogPostList() {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const isAdmin = user?.role === "Admin" || user?.role === "Super-Admin";

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] =
    useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  const loadPosts = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;
    setLoading(true);
    try {
      const response = await fetchAdminPosts({
        ...buildPaginationParams(currentPage),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      });
      setPosts(response.data ?? []);
      setPagination(response.pagination ?? DEFAULT_PAGINATION);
    } catch (err) {
      error(getApiErrorMessage(err));
      setPosts([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin, currentPage, debouncedSearch, statusFilter, error]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.delete(`/api/blog/admin/posts/${deleteId}`);
      success("Blog post deleted");
      setDeleteId(null);
      await loadPosts();
    } catch (err) {
      error(getApiErrorMessage(err));
    }
  }

  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        Only Admin and Super-Admin can manage blog posts.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Blog"
          description="Create, edit, and publish articles on your site."
        />
        <Link href="/dashboard/blog/create" className={btnPrimaryClass}>
          New post
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search posts..."
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-xs"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        {loading ? (
          <p className="p-6 text-sm text-zinc-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="p-6 text-sm text-zinc-500">No blog posts yet.</p>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {post.title}
                  </p>
                  <p className="text-sm text-zinc-500">/{post.slug}</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {post.authorId?.name || "Admin"} ·{" "}
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(post.status)}`}
                  >
                    {post.status}
                  </span>
                  {post.status === "published" ? (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
                    >
                      View
                    </Link>
                  ) : null}
                  <Link
                    href={`/dashboard/blog/${post.id}/edit`}
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteId(post.id)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 dark:border-red-900 dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete blog post?"
        description="This post will be removed from the site."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
