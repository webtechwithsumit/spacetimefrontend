"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { getApiErrorMessage } from "@/lib/api";
import { getUserInitials } from "@/lib/auth";
import {
  addTicketReply,
  categoryBadgeClass,
  fetchTicketById,
  priorityBadgeClass,
  statusBadgeClass,
  type TicketDetail,
  type TicketReply,
} from "@/lib/tickets";

type SupportTicketDetailContentProps = {
  ticketId: string;
  backHref?: string;
  backLabel?: string;
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
      {getUserInitials(name || "User")}
    </span>
  );
}

function ReplyItem({ reply }: { reply: TicketReply }) {
  const authorName = reply.authorId?.name || "User";
  const isStaff =
    reply.authorId?.role === "Admin" || reply.authorId?.role === "Super-Admin";

  return (
    <div className="flex gap-3 border-t border-zinc-100 py-4 first:border-t-0 dark:border-zinc-800">
      <AuthorAvatar name={authorName} image={reply.authorId?.image} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-white">
            {authorName}
          </span>
          {isStaff ? (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              Support
            </span>
          ) : null}
          <span className="text-xs text-zinc-400">
            {new Date(reply.createdAt).toLocaleString()}
          </span>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          {reply.content}
        </p>
      </div>
    </div>
  );
}

export function SupportTicketDetailContent({
  ticketId,
  backHref = "/support/tickets",
  backLabel = "← Back to my tickets",
}: SupportTicketDetailContentProps) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();
  const { success, error } = useToast();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace(`/login?redirect=/support/tickets/${ticketId}`);
    }
  }, [isAuthenticated, isReady, router, ticketId]);

  const loadTicket = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await fetchTicketById(ticketId);
      setTicket(response.data ?? null);
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to load ticket"));
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }, [error, isAuthenticated, ticketId]);

  useEffect(() => {
    void loadTicket();
  }, [loadTicket]);

  async function handleReply(event: React.FormEvent) {
    event.preventDefault();
    if (!reply.trim()) {
      error("Reply cannot be empty");
      return;
    }

    setSubmitting(true);
    try {
      await addTicketReply(ticketId, { content: reply.trim() });
      success("Reply sent");
      setReply("");
      await loadTicket();
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to send reply"));
    } finally {
      setSubmitting(false);
    }
  }

  if (!isReady) {
    return (
      <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-zinc-500">
        Loading...
      </p>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-zinc-500">
        Loading ticket...
      </p>
    );
  }

  if (!ticket) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-zinc-500">Ticket not found.</p>
        <Link
          href={backHref}
          className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          {backLabel}
        </Link>
      </div>
    );
  }

  const isClosed = ticket.status === "Closed" || ticket.status === "Resolved";

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={backHref}
        className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        {backLabel}
      </Link>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-zinc-500">
              {ticket.ticketNumber}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">
              {ticket.subject}
            </h1>
            <p className="mt-2 text-xs text-zinc-500">
              Opened {new Date(ticket.createdAt).toLocaleString()}
              {ticket.assignedTo?.name
                ? ` · Assigned to ${ticket.assignedTo.name}`
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(ticket.status)}`}
            >
              {ticket.status}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityBadgeClass(ticket.priority)}`}
            >
              {ticket.priority}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryBadgeClass(ticket.category)}`}
            >
              {ticket.category}
            </span>
          </div>
        </div>

        {ticket.propertyId ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Related property:{" "}
            <Link
              href={`/auctions/${ticket.propertyId.id}`}
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              {ticket.propertyId.title}
              {ticket.propertyId.city ? ` · ${ticket.propertyId.city}` : ""}
            </Link>
          </p>
        ) : null}

        <div className="mt-6 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
          <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            {ticket.description}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Conversation
        </h2>
        {ticket.replies.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            No replies yet. Our team will respond soon.
          </p>
        ) : (
          <div className="mt-2">
            {ticket.replies.map((item) => (
              <ReplyItem key={item.id} reply={item} />
            ))}
          </div>
        )}

        {!isClosed ? (
          <form onSubmit={handleReply} className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
            <label
              htmlFor="ticket-reply"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Add a reply
            </label>
            <textarea
              id="ticket-reply"
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              rows={4}
              placeholder="Type your message..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send reply"}
            </button>
          </form>
        ) : (
          <p className="mt-6 border-t border-zinc-100 pt-6 text-sm text-zinc-500 dark:border-zinc-800">
            This ticket is {ticket.status.toLowerCase()}. Contact support to reopen if needed.
          </p>
        )}
      </div>
    </section>
  );
}
