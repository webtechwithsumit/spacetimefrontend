"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api";
import { useAnalyticsPlugin } from "@/components/analytics-plugin-provider";
import { useToast } from "@/components/toast-provider";

type LicenseForm = {
  licenseKey: string;
  organizationName: string;
  organizationId: string;
  plan: "starter" | "pro" | "enterprise";
  notes: string;
};

export function AnalyticsLicenseManager() {
  const { user } = useAuth();
  const { status, refresh } = useAnalyticsPlugin();
  const { success, error } = useToast();
  const [generatedKey, setGeneratedKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<LicenseForm>({
    licenseKey: "",
    organizationName: "SpaceTime",
    organizationId: "default",
    plan: "pro",
    notes: "",
  });

  useEffect(() => {
    if (status?.organizationName) {
      setForm((prev) => ({
        ...prev,
        organizationName: status.organizationName ?? prev.organizationName,
        organizationId: status.organizationId ?? prev.organizationId,
      }));
    }
  }, [status]);

  if (user?.role !== "Super-Admin") {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        Only Super-Admin can manage analytics licenses.
      </div>
    );
  }

  async function handleGenerateKey() {
    try {
      const { data } = await api.get<{ success: boolean; data?: { licenseKey: string } }>(
        "/api/analytics/license/generate-key",
      );
      const key = data.data?.licenseKey ?? "";
      setGeneratedKey(key);
      setForm((prev) => ({ ...prev, licenseKey: key }));
      success("License key generated");
    } catch {
      error("Failed to generate license key");
    }
  }

  async function handleActivate(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post<{ success: boolean; message?: string }>(
        "/api/analytics/license/activate",
        form,
      );
      success(data.message || "License activated");
      await refresh();
    } catch {
      error("Failed to activate license");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivate() {
    const licenseKey = form.licenseKey.trim();
    if (!licenseKey) {
      error("Enter a license key to deactivate");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post<{ success: boolean; message?: string }>(
        "/api/analytics/license/deactivate",
        { licenseKey },
      );
      success(data.message || "License deactivated");
      await refresh();
    } catch {
      error("Failed to deactivate license");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Analytics License
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Activate the paid analytics plugin. Data is stored in{" "}
          <code className="text-xs">spacetime-analytics</code>, separate from the
          main app database.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-white">
          Current status
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500">Plugin enabled</dt>
            <dd className="font-medium">{status?.enabled ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">License active</dt>
            <dd className="font-medium">{status?.active ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Organization</dt>
            <dd className="font-medium">{status?.organizationName || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Plan</dt>
            <dd className="font-medium">{status?.plan || "—"}</dd>
          </div>
        </dl>
      </div>

      <form
        onSubmit={handleActivate}
        className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[280px] flex-1">
            <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
              License key
            </label>
            <input
              value={form.licenseKey}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, licenseKey: event.target.value }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="ST-AN-..."
              required
            />
          </div>
          <button
            type="button"
            onClick={handleGenerateKey}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
          >
            Generate key
          </button>
        </div>

        {generatedKey ? (
          <p className="text-xs text-zinc-500">
            Generated: <code>{generatedKey}</code>
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
              Organization name
            </label>
            <input
              value={form.organizationName}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  organizationName: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
              Organization ID
            </label>
            <input
              value={form.organizationId}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  organizationId: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
            Plan
          </label>
          <select
            value={form.plan}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                plan: event.target.value as LicenseForm["plan"],
              }))
            }
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-xs"
          >
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
            Notes
          </label>
          <textarea
            value={form.notes}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, notes: event.target.value }))
            }
            rows={3}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-zinc-900"
          >
            Activate license
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleDeactivate}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 dark:border-red-900 dark:text-red-400"
          >
            Deactivate
          </button>
        </div>
      </form>
    </div>
  );
}
