"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/components/toast-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import { Pagination } from "@/dashboard/components/pagination";
import { SelectField } from "@/dashboard/components/ui";
import {
  adminDeleteCommunityPost,
  adminToggleCommunityPin,
  categoryBadgeClass,
  COMMUNITY_CATEGORIES,
  fetchAdminCommunityPosts,
  type CommunityPost,
} from "@/lib/community";
import { getApiErrorMessage } from "@/lib/api";
import {
  buildPaginationParams,
  DEFAULT_PAGINATION,
  type PaginationMeta,
} from "@/lib/pagination";

export function CommunityModerationList() {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const isAdmin = user?.role === "Admin" || user?.role === "Super-Admin";

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [pagination, setPagination] =
    useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, categoryFilter]);

  const loadPosts = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;
    setLoading(true);
    try {
      const response = await fetchAdminCommunityPosts({
        ...buildPaginationParams(currentPage),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(categoryFilter ? { category: categoryFilter } : {}),
      });
      setPosts(response.data ?? []);
      setPagination(response.pagination ?? DEFAULT_PAGINATION);
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to load community posts"));
      setPosts([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, categoryFilter, error, isAdmin, isAuthenticated]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await adminDeleteCommunityPost(deleteId);
      success("Discussion removed");
      setDeleteId(null);
      await loadPosts();
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to remove discussion"));
    }
  }

  async function handleTogglePin(id: string) {
    try {
      const response = await adminToggleCommunityPin(id);
      success(response.message || "Pin updated");
      await loadPosts();
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to update pin"));
    }
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <p className="text-sm text-zinc-500">
        Only Admin and Super-Admin can moderate community posts.
      </p>
    );
  }

  return (
    <>
      <PageHeader
        title="Community"
        description="Moderate discussions, pin helpful posts, and remove spam."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search discussions..."
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-xs"
        />
        <div className="w-full sm:max-w-xs">
          <SelectField
            id="community-admin-category-filter"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={COMMUNITY_CATEGORIES}
            placeholder="All categories"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        {loading ? (
          <p className="p-6 text-sm text-zinc-500">Loading discussions...</p>
        ) : posts.length === 0 ? (
          <p className="p-6 text-sm text-zinc-500">No community posts yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {posts.map((post) => (
              <li key={post.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.isPinned ? (
                        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                          Pinned
                        </span>
                      ) : null}
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryBadgeClass(post.category)}`}
                      >
                        {post.category}
                      </span>
                    </div>
                    <h3 className="mt-2 font-medium text-zinc-900 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{post.body}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {post.authorId?.name || "Member"} ·{" "}
                      {new Date(post.createdAt).toLocaleDateString()} ·{" "}
                      {post.commentCount} comments
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/community/${post.id}`}
                      target="_blank"
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium dark:border-zinc-700"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleTogglePin(post.id)}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium dark:border-zinc-700"
                    >
                      {post.isPinned ? "Unpin" : "Pin"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(post.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 dark:border-red-900/50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Remove discussion?"
        description="This post will be hidden from the community."
        confirmLabel="Remove"
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
