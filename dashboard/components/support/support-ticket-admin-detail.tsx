"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { SelectField } from "@/dashboard/components/ui";
import { getApiErrorMessage } from "@/lib/api";
import { getUserInitials } from "@/lib/auth";
import {
  addTicketReply,
  categoryBadgeClass,
  fetchAdminSupportUsers,
  fetchTicketById,
  priorityBadgeClass,
  statusBadgeClass,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  updateAdminTicket,
  type TicketDetail,
  type TicketReply,
  type TicketCategory,
  type TicketPriority,
  type TicketStatus,
  type TicketUser,
} from "@/lib/tickets";

type SupportTicketAdminDetailProps = {
  ticketId: string;
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

  return (
    <div className="flex gap-3 border-t border-zinc-100 py-4 first:border-t-0 dark:border-zinc-800">
      <AuthorAvatar name={authorName} image={reply.authorId?.image} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-white">
            {authorName}
          </span>
          {reply.isInternal ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              Internal note
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

export function SupportTicketAdminDetail({ ticketId }: SupportTicketAdminDetailProps) {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const isAdmin = user?.role === "Admin" || user?.role === "Super-Admin";

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [admins, setAdmins] = useState<TicketUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<TicketStatus>("Open");
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [category, setCategory] = useState<TicketCategory>("General");
  const [assignedTo, setAssignedTo] = useState("");

  const loadTicket = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;
    setLoading(true);
    try {
      const [ticketResponse, adminsResponse] = await Promise.all([
        fetchTicketById(ticketId),
        fetchAdminSupportUsers(),
      ]);
      const data = ticketResponse.data ?? null;
      setTicket(data);
      setAdmins(adminsResponse.data ?? []);
      if (data) {
        setStatus(data.status);
        setPriority(data.priority);
        setCategory(data.category);
        setAssignedTo(data.assignedTo?.id ?? "");
      }
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to load ticket"));
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }, [error, isAdmin, isAuthenticated, ticketId]);

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
      await addTicketReply(ticketId, {
        content: reply.trim(),
        isInternal,
      });
      success(isInternal ? "Internal note added" : "Reply sent");
      setReply("");
      setIsInternal(false);
      await loadTicket();
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to send reply"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate() {
    setUpdating(true);
    try {
      await updateAdminTicket(ticketId, {
        status,
        priority,
        category,
        assignedTo: assignedTo || null,
      });
      success("Ticket updated");
      await loadTicket();
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to update ticket"));
    } finally {
      setUpdating(false);
    }
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <p className="text-sm text-zinc-500">
        Only Admin and Super-Admin can manage support tickets.
      </p>
    );
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Loading ticket...</p>;
  }

  if (!ticket) {
    return (
      <div>
        <p className="text-sm text-zinc-500">Ticket not found.</p>
        <Link
          href="/dashboard/support"
          className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          ← Back to support tickets
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/dashboard/support"
        className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        ← Back to support tickets
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
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

            <div className="mt-4 rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900/50">
              <p className="font-medium text-zinc-900 dark:text-white">
                {ticket.userId?.name} · {ticket.userId?.email}
              </p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                Role: {ticket.userId?.role}
              </p>
            </div>

            {ticket.propertyId ? (
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                Related property:{" "}
                <Link
                  href={`/auctions/${ticket.propertyId.id}`}
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  {ticket.propertyId.title}
                </Link>
              </p>
            ) : null}

            <div className="mt-6 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
              <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {ticket.description}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Conversation
            </h2>
            {ticket.replies.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-500">No replies yet.</p>
            ) : (
              <div className="mt-2">
                {ticket.replies.map((item) => (
                  <ReplyItem key={item.id} reply={item} />
                ))}
              </div>
            )}

            <form
              onSubmit={handleReply}
              className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800"
            >
              <label
                htmlFor="admin-ticket-reply"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Reply or add internal note
              </label>
              <textarea
                id="admin-ticket-reply"
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                rows={4}
                placeholder="Type your message..."
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <label className="mt-3 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(event) => setIsInternal(event.target.checked)}
                  className="rounded border-zinc-300"
                />
                Internal note (visible to admins only)
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
              >
                {submitting ? "Sending..." : isInternal ? "Add note" : "Send reply"}
              </button>
            </form>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Manage ticket
            </h3>
            <div className="mt-4 space-y-4">
              <SelectField
                id="admin-update-status"
                label="Status"
                value={status}
                onChange={(value) => setStatus(value as TicketStatus)}
                options={TICKET_STATUSES}
              />
              <SelectField
                id="admin-update-priority"
                label="Priority"
                value={priority}
                onChange={(value) => setPriority(value as TicketPriority)}
                options={TICKET_PRIORITIES}
              />
              <SelectField
                id="admin-update-category"
                label="Category"
                value={category}
                onChange={(value) => setCategory(value as TicketCategory)}
                options={TICKET_CATEGORIES}
              />
              <div>
                <label
                  htmlFor="admin-update-assignee"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Assigned to
                </label>
                <select
                  id="admin-update-assignee"
                  value={assignedTo}
                  onChange={(event) => setAssignedTo(event.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <option value="">Unassigned</option>
                  {admins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => void handleUpdate()}
                disabled={updating}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                {updating ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
