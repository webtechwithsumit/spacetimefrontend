"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BlogImage, processBlogHtml } from "@/components/site/blog-image";
import { fetchPublishedPostBySlug, type BlogPost } from "@/lib/blog";

type BlogPostContentProps = {
  slug: string;
};

export function BlogPostContent({ slug }: BlogPostContentProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPost() {
      setLoading(true);
      try {
        const response = await fetchPublishedPostBySlug(slug);
        if (!response.success || !response.data) {
          setError(response.message || "Article not found");
          setPost(null);
          return;
        }
        setPost(response.data);
        setError("");
      } catch {
        setError("Article not found");
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    void loadPost();
  }, [slug]);

  if (loading) {
    return <p className="px-4 py-16 text-center text-sm text-zinc-500">Loading article...</p>;
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Article not found</h1>
        <Link href="/blog" className="mt-4 inline-block text-indigo-600">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/blog" className="text-sm text-indigo-600 hover:underline">
        ← Back to blog
      </Link>

      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        {post.title}
      </h1>

      <p className="mt-3 text-sm text-zinc-500">
        {post.authorId?.name || "SpaceTime"} ·{" "}
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString()
          : new Date(post.createdAt).toLocaleDateString()}
      </p>

      {post.featuredImage ? (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
          <BlogImage
            src={post.featuredImage}
            alt={post.title}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      ) : null}

      {post.excerpt ? (
        <p className="mt-8 text-lg text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
      ) : null}

      <div
        className="prose prose-zinc mt-8 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: processBlogHtml(post.content) }}
      />
    </article>
  );
}
