"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import { ALL_USER_ROLES } from "@/dashboard/constants/nav-items";
import { API_BASE_URL } from "@/lib/api";

type DashboardUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt?: string;
};

type UsersResponse = {
  success: boolean;
  message?: string;
  data?: DashboardUser[];
};

type CreateUserResponse = {
  success: boolean;
  message?: string;
  data?: DashboardUser;
};

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 dark:focus:bg-zinc-900 dark:focus:ring-indigo-400/10";

const labelClass =
  "mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

export function UsersManagement() {
  const { user, token } = useAuth();
  const isSuperAdmin = user?.role === "Super-Admin";

  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [pending, setPending] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: UsersResponse = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load users");
        setUsers([]);
        return;
      }

      setUsers(data.data ?? []);
    } catch {
      setError("Unable to connect to server.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin, fetchUsers]);

  async function handleCreateUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: (formData.get("name") as string)?.trim(),
      email: (formData.get("email") as string)?.trim(),
      phone: (formData.get("phone") as string)?.trim(),
      role: formData.get("role") as string,
      password: formData.get("password") as string,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data: CreateUserResponse = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.message || "Failed to create user");
        setPending(false);
        return;
      }

      setFormSuccess(data.message || "User created successfully");
      e.currentTarget.reset();
      setShowForm(false);
      await fetchUsers();
    } catch {
      setFormError("Unable to connect to server.");
    } finally {
      setPending(false);
    }
  }

  if (!isSuperAdmin) {
    return (
      <div>
        <PageHeader
          title="Users"
          description="Manage system users and roles."
        />
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          Super-Admin access required to manage users.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Users"
          description="Create and manage users including Admin and Super-Admin roles."
        />
        <button
          type="button"
          onClick={() => {
            setShowForm((prev) => !prev);
            setFormError("");
            setFormSuccess("");
          }}
          className="shrink-0 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
        >
          {showForm ? "Cancel" : "Create User"}
        </button>
      </div>

      {formSuccess && (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          {formSuccess}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleCreateUser}
          className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            Create User
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={inputClass}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={inputClass}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={inputClass}
                placeholder="9876543210"
              />
            </div>
            <div>
              <label htmlFor="role" className={labelClass}>
                Role
              </label>
              <select id="role" name="role" required className={inputClass}>
                <option value="">Select role</option>
                {ALL_USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className={inputClass}
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          {formError && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-4 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
          >
            {pending ? "Creating..." : "Create User"}
          </button>
        </form>
      )}

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Name
                </th>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Email
                </th>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Phone
                </th>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {item.email}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {item.phone}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                        {item.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
