"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import {
  addCommunityComment,
  categoryBadgeClass,
  deleteCommunityComment,
  deleteCommunityPost,
  fetchCommunityPostById,
  type CommunityComment,
  type CommunityPostDetail,
} from "@/lib/community";
import { getApiErrorMessage } from "@/lib/api";
import { getUserInitials } from "@/lib/auth";

type CommunityPostContentProps = {
  postId: string;
};

function AuthorAvatar({ name, image }: { name: string; image?: string }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        className="size-9 rounded-full object-cover"
      />
    );
  }

  return (
    <span className="flex size-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
      {getUserInitials(name || "Member")}
    </span>
  );
}

function CommentItem({
  comment,
  canDelete,
  onDelete,
}: {
  comment: CommunityComment;
  canDelete: boolean;
  onDelete: (id: string) => void;
}) {
  const authorName = comment.authorId?.name || "Member";

  return (
    <div className="flex gap-3 border-t border-zinc-100 py-4 first:border-t-0 dark:border-zinc-800">
      <AuthorAvatar name={authorName} image={comment.authorId?.image} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-white">
            {authorName}
          </span>
          {comment.authorId?.role ? (
            <span className="text-xs text-zinc-500">{comment.authorId.role}</span>
          ) : null}
          <span className="text-xs text-zinc-400">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
          {canDelete ? (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              className="ml-auto text-xs text-red-600 hover:text-red-500"
            >
              Delete
            </button>
          ) : null}
        </div>
        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          {comment.content}
        </p>
      </div>
    </div>
  );
}

export function CommunityPostContent({ postId }: CommunityPostContentProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const [post, setPost] = useState<CommunityPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === "Admin" || user?.role === "Super-Admin";

  const loadPost = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCommunityPostById(postId);
      if (!response.success || !response.data) {
        setPost(null);
        return;
      }
      setPost(response.data);
    } catch {
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void loadPost();
  }, [loadPost]);

  async function handleAddComment(event: React.FormEvent) {
    event.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const response = await addCommunityComment(postId, comment.trim());
      if (!response.success || !response.data) {
        error(response.message || "Failed to add comment");
        return;
      }
      setComment("");
      success("Comment added");
      await loadPost();
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to add comment"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await deleteCommunityComment(commentId);
      success("Comment deleted");
      await loadPost();
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to delete comment"));
    }
  }

  async function handleDeletePost() {
    if (!window.confirm("Delete this discussion?")) return;

    try {
      await deleteCommunityPost(postId);
      success("Discussion deleted");
      router.push("/community");
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to delete discussion"));
    }
  }

  if (loading) {
    return <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-zinc-500">Loading...</p>;
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-zinc-500">Discussion not found.</p>
        <Link
          href="/community"
          className="mt-4 inline-block text-sm font-medium text-indigo-600"
        >
          ← Back to community
        </Link>
      </div>
    );
  }

  const authorName = post.authorId?.name || "Member";
  const canDeletePost =
    isAuthenticated &&
    (isAdmin || user?._id === post.authorId?.id);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/community"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        ← Back to community
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
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
      </div>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        {post.title}
      </h1>

      <div className="mt-4 flex items-center gap-3">
        <AuthorAvatar name={authorName} image={post.authorId?.image} />
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-white">{authorName}</p>
          <p className="text-xs text-zinc-500">
            {post.authorId?.role || "Member"} ·{" "}
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
        {canDeletePost ? (
          <button
            type="button"
            onClick={() => void handleDeletePost()}
            className="ml-auto text-sm text-red-600 hover:text-red-500"
          >
            Delete post
          </button>
        ) : null}
      </div>

      <div className="prose prose-zinc mt-8 max-w-none dark:prose-invert">
        <p className="whitespace-pre-wrap leading-7 text-zinc-700 dark:text-zinc-300">
          {post.body}
        </p>
      </div>

      {post.tags.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <section className="mt-12 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Comments ({post.comments.length})
        </h2>

        {isAuthenticated ? (
          <form onSubmit={handleAddComment} className="mt-4">
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              placeholder="Share your thoughts..."
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="mt-3 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post comment"}
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">
            <Link href="/login" className="font-medium text-indigo-600">
              Log in
            </Link>{" "}
            to join the discussion.
          </p>
        )}

        <div className="mt-6">
          {post.comments.length === 0 ? (
            <p className="text-sm text-zinc-500">No comments yet. Start the conversation.</p>
          ) : (
            post.comments.map((item) => (
              <CommentItem
                key={item.id}
                comment={item}
                canDelete={
                  isAuthenticated &&
                  (isAdmin || user?._id === item.authorId?.id)
                }
                onDelete={(id) => void handleDeleteComment(id)}
              />
            ))
          )}
        </div>
      </section>
    </article>
  );
}
