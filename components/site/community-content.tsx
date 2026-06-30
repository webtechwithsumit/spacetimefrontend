"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { SelectField } from "@/dashboard/components/ui";
import {
  COMMUNITY_CATEGORIES,
  categoryBadgeClass,
  fetchCommunityPosts,
  type CommunityPost,
} from "@/lib/community";
import {
  buildPaginationParams,
  DEFAULT_PAGINATION,
  type PaginationMeta,
} from "@/lib/pagination";

function roleLabel(role?: string) {
  if (!role) return "Member";
  return role;
}

export function CommunityContent() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [pagination, setPagination] =
    useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category]);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCommunityPosts({
        ...buildPaginationParams(currentPage),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(category ? { category } : {}),
      });
      setPosts(response.data ?? []);
      setPagination(response.pagination ?? DEFAULT_PAGINATION);
    } catch {
      setPosts([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, category]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search discussions..."
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-xs"
          />
          <div className="w-full sm:max-w-xs">
            <SelectField
              id="community-category-filter"
              value={category}
              onChange={setCategory}
              options={COMMUNITY_CATEGORIES}
              placeholder="All categories"
            />
          </div>
        </div>

        {isAuthenticated ? (
          <Link
            href="/community/new"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start a discussion
          </Link>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Log in to post
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading discussions...</p>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">No discussions yet.</p>
          {isAuthenticated ? (
            <Link
              href="/community/new"
              className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Be the first to start one →
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex flex-wrap items-center gap-2">
                {post.isPinned ? (
                  <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                    Pinned
                  </span>
                ) : null}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryBadgeClass(post.category)}`}
                >
                  {post.category}
                </span>
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link href={`/community/${post.id}`} className="group mt-3 block">
                <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {post.title}
                </h2>
              </Link>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                <span>
                  {post.authorId?.name || "Member"} ·{" "}
                  {roleLabel(post.authorId?.role)}
                </span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>
                  {post.commentCount}{" "}
                  {post.commentCount === 1 ? "comment" : "comments"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 ? (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  page === pagination.page
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "border border-zinc-300 dark:border-zinc-700"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>
      ) : null}
    </section>
  );
}
