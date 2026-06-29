"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { RichTextEditor } from "@/dashboard/components/blog/rich-text-editor";
import { PageHeader } from "@/dashboard/components/page-header";
import { btnPrimaryClass } from "@/dashboard/components/ui";
import { api, getApiErrorMessage } from "@/lib/api";
import {
  buildBlogFormData,
  fetchAdminPostById,
  type BlogPost,
} from "@/lib/blog";
import { getMediaUrl } from "@/lib/media";

type BlogPostFormProps = {
  postId?: string;
};

const initialState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "draft" as "draft" | "published",
  tags: "",
};

export function BlogPostForm({ postId }: BlogPostFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useToast();
  const [form, setForm] = useState(initialState);
  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === "Admin" || user?.role === "Super-Admin";

  useEffect(() => {
    if (!postId) return;

    const id = postId;

    async function loadPost() {
      setLoading(true);
      try {
        const response = await fetchAdminPostById(id);
        if (!response.success || !response.data) {
          error(response.message || "Failed to load blog post");
          return;
        }
        const post = response.data;
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          status: post.status,
          tags: post.tags.join(", "),
        });
        setFeaturedImage(post.featuredImage);
      } catch (err) {
        error(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    void loadPost();
  }, [postId, error]);

  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        Only Admin and Super-Admin can manage blog posts.
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.title.trim()) {
      error("Title is required");
      return;
    }

    setSaving(true);
    try {
      const payload = buildBlogFormData({
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        status: form.status,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        featuredImage,
        featuredImageFile,
      });

      if (postId) {
        await api.put(`/api/blog/admin/posts/${postId}`, payload);
        success("Blog post updated");
      } else {
        await api.post("/api/blog/admin/posts", payload);
        success("Blog post created");
      }

      router.push("/dashboard/blog");
    } catch (err) {
      error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Loading blog post...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader
        title={postId ? "Edit Blog Post" : "Create Blog Post"}
        description="Write and publish articles on your SpaceTime site, WordPress-style."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Slug (optional)</label>
            <input
              value={form.slug}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, slug: event.target.value }))
              }
              placeholder="auto-generated-from-title"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, excerpt: event.target.value }))
              }
              rows={3}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Short summary for blog cards"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Content</label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <label className="mb-2 block text-sm font-medium">Status</label>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  status: event.target.value as BlogPost["status"],
                }))
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <label className="mb-2 block text-sm font-medium">Tags</label>
            <input
              value={form.tags}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, tags: event.target.value }))
              }
              placeholder="auction, property, tips"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <p className="mt-1 text-xs text-zinc-500">Comma separated</p>
          </div>

          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <label className="mb-2 block text-sm font-medium">Featured image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setFeaturedImageFile(file);
              }}
              className="w-full text-sm"
            />
            {featuredImage ? (
              <div className="relative mt-3 aspect-video overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getMediaUrl(featuredImage)}
                  alt="Featured"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </div>

          <button type="submit" disabled={saving} className={btnPrimaryClass}>
            {saving ? "Saving..." : postId ? "Update post" : "Publish / Save"}
          </button>

          <Link
            href="/dashboard/blog"
            className="block text-center text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
