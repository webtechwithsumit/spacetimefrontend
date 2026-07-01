"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { SelectField } from "@/dashboard/components/ui";
import { getApiErrorMessage } from "@/lib/api";
import {
  createTicket,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  type TicketCategory,
  type TicketPriority,
} from "@/lib/tickets";

const FAQ_ITEMS = [
  {
    q: "How do I place a bid on a property?",
    a: "Register as a Buyer, browse live auctions, and click Bid on any active listing. You must meet the minimum bid increment shown on the property page.",
  },
  {
    q: "Can brokers bid on auctions?",
    a: "Brokers can bid only when the seller has enabled broker bidding for that specific property.",
  },
  {
    q: "How long does KYC verification take?",
    a: "Upload your Aadhar and KYC documents from your profile. Our team typically reviews submissions within 1–2 business days.",
  },
  {
    q: "What if my auction ended while I was leading?",
    a: "The seller or SpaceTime advisor will contact the leading bidder. Raise a ticket under the Auction category for follow-up.",
  },
];

export function SupportContent() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();
  const { success, error } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    description: "",
    category: "General" as TicketCategory,
    priority: "Medium" as TicketPriority,
    propertyId: "",
  });

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login?redirect=/support");
    }
  }, [isAuthenticated, isReady, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.subject.trim() || !form.description.trim()) {
      error("Subject and description are required");
      return;
    }

    setSaving(true);
    try {
      const response = await createTicket({
        subject: form.subject.trim(),
        description: form.description.trim(),
        category: form.category,
        priority: form.priority,
        ...(form.propertyId.trim()
          ? { propertyId: form.propertyId.trim() }
          : {}),
      });

      if (!response.success || !response.data) {
        error(response.message || "Failed to create ticket");
        return;
      }

      success("Support ticket created");
      router.push(`/support/tickets/${response.data.id}`);
    } catch (err) {
      error(getApiErrorMessage(err, "Failed to create ticket"));
    } finally {
      setSaving(false);
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

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Create a support ticket
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Describe your issue and our team will respond as soon as possible.
          </p>
        </div>
        <Link
          href="/support/tickets"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          My tickets
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div>
            <label
              htmlFor="ticket-subject"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Subject
            </label>
            <input
              id="ticket-subject"
              value={form.subject}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, subject: event.target.value }))
              }
              placeholder="Brief summary of your issue"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              id="ticket-category"
              label="Category"
              value={form.category}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  category: value as TicketCategory,
                }))
              }
              options={TICKET_CATEGORIES}
            />
            <SelectField
              id="ticket-priority"
              label="Priority"
              value={form.priority}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  priority: value as TicketPriority,
                }))
              }
              options={TICKET_PRIORITIES}
            />
          </div>

          <div>
            <label
              htmlFor="ticket-property-id"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Property ID (optional)
            </label>
            <input
              id="ticket-property-id"
              value={form.propertyId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, propertyId: event.target.value }))
              }
              placeholder="Link ticket to a specific auction listing"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div>
            <label
              htmlFor="ticket-description"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Description
            </label>
            <textarea
              id="ticket-description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={6}
              placeholder="Provide as much detail as possible..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {saving ? "Submitting..." : "Submit ticket"}
          </button>
        </form>

        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Before you submit
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Check the FAQ below for quick answers.</li>
              <li>Include property ID if your issue is auction-related.</li>
              <li>Response times vary by priority — Urgent tickets are handled first.</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Frequently asked questions
            </h3>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.q}
                  className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <summary className="cursor-pointer text-sm font-medium text-zinc-900 dark:text-white">
                    {item.q}
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
