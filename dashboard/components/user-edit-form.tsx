"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import { SelectField } from "@/dashboard/components/ui";
import { ALL_USER_ROLES } from "@/dashboard/constants/nav-items";
import { api, getApiErrorMessage } from "@/lib/api";

type DashboardUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  image?: string;
  aadharNo?: string;
};

type UserResponse = {
  success: boolean;
  message?: string;
  data?: DashboardUser;
};

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 dark:focus:bg-zinc-900 dark:focus:ring-indigo-400/10";

const labelClass =
  "mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

const cardClass =
  "rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "",
  image: "",
  aadharNo: "",
  password: "",
};

type UserEditFormProps = {
  userId: string;
};

export function UserEditForm({ userId }: UserEditFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const isSuperAdmin = user?.role === "Super-Admin";

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!isSuperAdmin) return;
    setLoading(true);
    try {
      const { data } = await api.get<UserResponse>(`/api/users/${userId}`);
      if (!data.success || !data.data) {
        toast.error(data.message || "Failed to load user");
        return;
      }
      setForm({
        name: data.data.name ?? "",
        email: data.data.email ?? "",
        phone: data.data.phone ?? "",
        role: data.data.role ?? "",
        image: data.data.image ?? "",
        aadharNo: data.data.aadharNo ?? "",
        password: "",
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin, userId, toast]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const payload: Record<string, string> = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role.trim(),
      image: form.image.trim(),
      aadharNo: form.aadharNo.trim(),
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    try {
      const { data } = await api.put<UserResponse>(
        `/api/users/${userId}`,
        payload,
      );

      if (!data.success) {
        toast.error(data.message || "Failed to update user");
        setPending(false);
        return;
      }

      toast.success(data.message || "User updated successfully");
      router.push("/dashboard/system-master/users");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  if (!isSuperAdmin) {
    return (
      <div>
        <PageHeader
          title="Edit User"
          description="Update user details and role."
        />
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          Super-Admin access required to edit users.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Edit User"
          description="Update user details and role."
        />
        <div className={`${cardClass} h-96 animate-pulse`} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/system-master/users"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-4"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Users
        </Link>
      </div>

      <PageHeader
        title="Edit User"
        description="Update name, contact details, role, and optional password."
      />

      <form onSubmit={handleSubmit} className={cardClass}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass}
            />
          </div>
          <SelectField
            id="role"
            label="Role"
            value={form.role}
            onChange={(value) => updateField("role", value)}
            options={ALL_USER_ROLES}
            placeholder="Select role"
            clearable={false}
          />
          <div className="sm:col-span-2">
            <label htmlFor="image" className={labelClass}>
              Profile Image URL
            </label>
            <input
              id="image"
              type="url"
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              className={inputClass}
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="aadharNo" className={labelClass}>
              Aadhar Number
            </label>
            <input
              id="aadharNo"
              type="text"
              inputMode="numeric"
              maxLength={12}
              value={form.aadharNo}
              onChange={(e) => updateField("aadharNo", e.target.value)}
              className={inputClass}
              placeholder="123456789012"
            />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Reset Password
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Leave blank to keep the current password
          </p>
          <div className="mt-4">
            <label htmlFor="password" className={labelClass}>
              New Password
            </label>
            <input
              id="password"
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className={inputClass}
              placeholder="Minimum 6 characters"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
          >
            {pending ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/dashboard/system-master/users"
            className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
