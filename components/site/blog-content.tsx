"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BlogImage } from "@/components/site/blog-image";
import { fetchPublishedPosts, type BlogPost } from "@/lib/blog";
import {
  buildPaginationParams,
  DEFAULT_PAGINATION,
  type PaginationMeta,
} from "@/lib/pagination";

export function BlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] =
    useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchPublishedPosts({
        ...buildPaginationParams(currentPage),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      });
      setPosts(response.data ?? []);
      setPagination(response.pagination ?? DEFAULT_PAGINATION);
    } catch {
      setPosts([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search articles..."
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-sm"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading articles...</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-zinc-500">No published articles yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  {post.featuredImage ? (
                    <BlogImage
                      src={post.featuredImage}
                      alt={post.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                      SpaceTime Blog
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {post.excerpt || "Read this article on SpaceTime."}
                  </p>
                  <p className="mt-4 text-xs text-zinc-500">
                    {post.authorId?.name || "SpaceTime"} ·{" "}
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
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
