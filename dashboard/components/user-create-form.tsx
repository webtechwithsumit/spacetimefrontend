"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import {
  BackLink,
  btnPrimaryClass,
  btnSecondaryClass,
  cardClass,
  inputClass,
  labelClass,
  SelectField,
} from "@/dashboard/components/ui";
import { ALL_USER_ROLES } from "@/dashboard/constants/nav-items";
import { api, getApiErrorMessage } from "@/lib/api";

type CreateUserResponse = {
  success: boolean;
  message?: string;
};

export function UserCreateForm() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const isSuperAdmin = user?.role === "Super-Admin";
  const [pending, setPending] = useState(false);
  const [role, setRole] = useState("");

  async function handleCreateUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!role.trim()) {
      toast.error("Role is required");
      return;
    }

    setPending(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: (formData.get("name") as string)?.trim(),
      email: (formData.get("email") as string)?.trim(),
      phone: (formData.get("phone") as string)?.trim(),
      role,
      password: formData.get("password") as string,
    };

    try {
      const { data } = await api.post<CreateUserResponse>(
        "/api/users/create",
        payload,
      );

      if (!data.success) {
        toast.error(data.message || "Failed to create user");
        setPending(false);
        return;
      }

      toast.success(data.message || "User created successfully");
      router.push("/dashboard/system-master/users");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      setPending(false);
    }
  }

  if (!isSuperAdmin) {
    return (
      <div>
        <PageHeader
          title="Create User"
          description="Add a new user to the system."
        />
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          Super-Admin access required to create users.
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackLink
        href="/dashboard/system-master/users"
        label="Back to Users"
      />

      <PageHeader
        title="Create User"
        description="Add a new user with name, contact details, role, and password."
      />

      <form onSubmit={handleCreateUser} className={cardClass}>
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
          <SelectField
            id="role"
            label="Role"
            value={role}
            onChange={setRole}
            options={ALL_USER_ROLES}
            placeholder="Select role"
            clearable={false}
          />
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

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={pending}
            className={`${btnPrimaryClass} disabled:opacity-50`}
          >
            {pending ? "Creating..." : "Create User"}
          </button>
          <Link href="/dashboard/system-master/users" className={btnSecondaryClass}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
