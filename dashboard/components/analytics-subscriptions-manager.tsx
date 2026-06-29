"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import { api } from "@/lib/api";

type SubscriptionRow = {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
  } | null;
  enabled: boolean;
  active: boolean;
  plan: string;
  expiresAt: string | null;
  notes: string;
};

type CandidateUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export function AnalyticsSubscriptionsManager() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([]);
  const [candidates, setCandidates] = useState<CandidateUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [notes, setNotes] = useState("");
  const [plan, setPlan] = useState<"basic" | "pro">("basic");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [subsRes, usersRes] = await Promise.all([
        api.get<{ success: boolean; data: SubscriptionRow[] }>(
          "/api/analytics/subscriptions",
        ),
        api.get<{ success: boolean; data: CandidateUser[] }>("/api/users", {
          params: { limit: 200 },
        }),
      ]);

      setSubscriptions(subsRes.data.data ?? []);
      const sellersBrokers = (usersRes.data.data ?? []).filter((item) =>
        ["Seller", "Broker"].includes(item.role),
      );
      setCandidates(sellersBrokers);
    } catch {
      error("Failed to load analytics subscriptions");
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (user?.role !== "Super-Admin") {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        Only Super-Admin can manage seller/broker analytics subscriptions.
      </div>
    );
  }

  async function handleActivate(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedUserId) {
      error("Select a seller or broker");
      return;
    }

    try {
      await api.post("/api/analytics/subscriptions/activate", {
        userId: selectedUserId,
        plan,
        notes,
      });
      success("Analytics enabled for user");
      setNotes("");
      setSelectedUserId("");
      await loadData();
    } catch {
      error("Failed to activate subscription");
    }
  }

  async function handleDeactivate(userId: string) {
    try {
      await api.post("/api/analytics/subscriptions/deactivate", { userId });
      success("Analytics disabled for user");
      await loadData();
    } catch {
      error("Failed to deactivate subscription");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Subscriptions"
        description="Enable property analytics for individual sellers and brokers who have paid."
      />

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-white">
          Give analytics to seller / broker
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Super-Admin always sees all analytics. Paid sellers/brokers only see
          their own property analytics.
        </p>

        <form onSubmit={handleActivate} className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
              Seller / Broker
            </label>
            <select
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              required
            >
              <option value="">Select user</option>
              {candidates.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} ({item.role}) — {item.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
              Plan
            </label>
            <select
              value={plan}
              onChange={(event) => setPlan(event.target.value as "basic" | "pro")}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
              Notes (payment ref, amount, etc.)
            </label>
            <input
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Paid ₹5000 on 25 Jun 2026"
            />
          </div>

          <div>
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
            >
              Enable analytics
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-white">
            Active subscriptions
          </h2>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-zinc-500">Loading...</p>
        ) : subscriptions.length === 0 ? (
          <p className="p-6 text-sm text-zinc-500">
            No seller/broker analytics subscriptions yet.
          </p>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {subscriptions.map((row) => (
              <div
                key={row.id}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {row.user?.name || "Unknown user"}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {row.user?.role} · {row.user?.email}
                  </p>
                  {row.notes ? (
                    <p className="mt-1 text-xs text-zinc-400">{row.notes}</p>
                  ) : null}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      row.active
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                    }`}
                  >
                    {row.active ? "Active" : "Inactive"}
                  </span>
                  {row.active ? (
                    <button
                      type="button"
                      onClick={() => handleDeactivate(row.userId)}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 dark:border-red-900 dark:text-red-400"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        api
                          .post("/api/analytics/subscriptions/activate", {
                            userId: row.userId,
                            plan: row.plan,
                            notes: row.notes,
                          })
                          .then(() => loadData())
                      }
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
                    >
                      Re-enable
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
