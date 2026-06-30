"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { SelectField } from "@/dashboard/components/ui";
import {
  COMMUNITY_CATEGORIES,
  createCommunityPost,
  type CommunityCategory,
} from "@/lib/community";
import { getApiErrorMessage } from "@/lib/api";

export function CommunityPostForm() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();
  const { success, error } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    category: "General" as CommunityCategory,
    tags: "",
  });

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login?redirect=/community/new");
    }
  }, [isAuthenticated, isReady, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.title.trim() || !form.body.trim()) {
      error("Title and body are required");
      return;
    }

    setSaving(true);
    try {
      const tags = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const response = await createCommunityPost({
        title: form.title.trim(),
        body: form.body.trim(),
        category: form.category,
        tags,
      });

      if (!response.success || !response.data) {
        error(response.message || "Failed to create post");
        return;
      }

      success("Discussion posted");
      router.push(`/community/${response.data.id}`);
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to create post"));
    } finally {
      setSaving(false);
    }
  }

  if (!isReady) {
    return <p className="mx-auto max-w-2xl px-4 py-10 text-sm text-zinc-500">Loading...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href="/community"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        ← Back to community
      </Link>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        Start a discussion
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Share auction tips, ask questions, or connect with buyers, sellers, and brokers.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Title
          </label>
          <input
            id="title"
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="What's on your mind?"
            className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <SelectField
          id="category"
          label="Category"
          value={form.category}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              category: (value || "General") as CommunityCategory,
            }))
          }
          options={COMMUNITY_CATEGORIES}
          placeholder="Select category"
          clearable={false}
        />

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Details
          </label>
          <textarea
            id="body"
            value={form.body}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, body: event.target.value }))
            }
            rows={8}
            placeholder="Share context, questions, or insights..."
            className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Tags (optional)
          </label>
          <input
            id="tags"
            value={form.tags}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, tags: event.target.value }))
            }
            placeholder="Mumbai, office space, bidding"
            className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="mt-1 text-xs text-zinc-500">Separate tags with commas</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Posting..." : "Publish discussion"}
        </button>
      </form>
    </section>
  );
}
