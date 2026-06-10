"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { api, getApiErrorMessage } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";
import { getUserInitials } from "@/lib/auth";

type ProfileResponse = {
  success: boolean;
  message?: string;
  data?: AuthUser;
};

const inputClass =
  "w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400/10";

const labelClass =
  "mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

const cardClass =
  "rounded-2xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-200/40 dark:border-zinc-800/80 dark:bg-zinc-950 dark:shadow-none";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  image: "",
  aadharNo: "",
  password: "",
  currentPassword: "",
};

function maskAadhar(value: string) {
  if (!value) return "Not provided";
  if (value.length < 4) return value;
  return `**** **** ${value.slice(-4)}`;
}

function getProfileCompletion(form: typeof emptyForm) {
  const fields = [form.name, form.email, form.phone, form.aadharNo, form.image];
  const filled = fields.filter((v) => v?.trim()).length;
  return Math.round((filled / fields.length) * 100);
}

function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-zinc-100 bg-gradient-to-br from-zinc-50/80 to-white p-4 transition-all hover:border-indigo-200/60 hover:shadow-sm dark:border-zinc-800/80 dark:from-zinc-900/40 dark:to-zinc-950 dark:hover:border-indigo-900/50">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-500 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:text-indigo-400 dark:ring-zinc-800">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {label}
          </p>
          <p className="mt-1 break-all text-sm font-medium text-zinc-900 dark:text-white">
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "Super-Admin" || role === "Admin";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${isAdmin
        ? "bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-900"
        : "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
        }`}
    >
      {role}
    </span>
  );
}

const fieldIcons = {
  name: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <circle cx="12" cy="8" r="3" /><path d="M6 20v-1a6 6 0 0 1 12 0v1" />
    </svg>
  ),
  email: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
    </svg>
  ),
  phone: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <path d="M6.5 4h3l1.5 5-2 1.5a11 11 0 0 0 5 5L15.5 14l5 1.5v3A2 2 0 0 1 18.7 20 16 16 0 0 1 4 5.3 2 2 0 0 1 6.5 4z" />
    </svg>
  ),
  image: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="m21 15-4-4-5 5-2-2-4 4" />
    </svg>
  ),
  aadhar: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <rect x="4" y="6" width="16" height="12" rx="2" /><path d="M8 10h8M8 14h5" />
    </svg>
  ),
};

export function ProfileForm() {
  const { isAuthenticated, updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showAadhar, setShowAadhar] = useState(false);
  const [pending, setPending] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const { data } = await api.get<ProfileResponse>("/api/profile");
      if (!data.success || !data.data) {
        toast.error(data.message || "Failed to load profile");
        return;
      }
      setForm({
        name: data.data.name ?? "",
        email: data.data.email ?? "",
        phone: data.data.phone ?? "",
        image: data.data.image ?? "",
        aadharNo: data.data.aadharNo ?? "",
        password: "",
        currentPassword: "",
      });
      setRole(data.data.role ?? "");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
      image: form.image.trim(),
      aadharNo: form.aadharNo.trim(),
    };
    if (form.password) {
      payload.password = form.password;
      payload.currentPassword = form.currentPassword;
    }
    try {
      const { data } = await api.put<ProfileResponse>("/api/profile", payload);
      if (!data.success || !data.data) {
        toast.error(data.message || "Failed to update profile");
        setPending(false);
        return;
      }
      updateUser(data.data);
      setForm((prev) => ({
        ...prev,
        name: data.data!.name ?? "",
        email: data.data!.email ?? "",
        phone: data.data!.phone ?? "",
        image: data.data!.image ?? "",
        aadharNo: data.data!.aadharNo ?? "",
        password: "",
        currentPassword: "",
      }));
      toast.success(data.message || "Profile updated successfully");
      setEditing(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className={`${cardClass} h-44 animate-pulse`} />
        <div className="grid gap-6 xl:grid-cols-3">
          <div className={`${cardClass} h-[28rem] animate-pulse xl:col-span-2`} />
          <div className={`${cardClass} h-[28rem] animate-pulse`} />
        </div>
      </div>
    );
  }

  const hasAadhar = Boolean(form.aadharNo?.trim());
  const completion = getProfileCompletion(form);

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <section className={`${cardClass} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-indigo-950/30 dark:via-zinc-950 dark:to-violet-950/20" />
        <div className="absolute -right-16 -top-16 size-56 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute -bottom-20 left-1/3 size-48 rounded-full bg-violet-200/25 blur-3xl dark:bg-violet-500/10" />

        <div className="relative px-6 pb-6 pt-8 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 opacity-70 blur-sm" />
                {form.image ? (
                  <img
                    src={form.image}
                    alt={form.name || "Profile"}
                    className="relative size-24 rounded-full border-[3px] border-white object-cover shadow-lg dark:border-zinc-900"
                  />
                ) : (
                  <span className="relative flex size-24 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-zinc-800 to-zinc-900 text-2xl font-semibold text-white shadow-lg dark:border-zinc-900">
                    {getUserInitials(form.name || "User")}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                  My Account
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                  {form.name || "Your profile"}
                </h1>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                  {fieldIcons.email}
                  {form.email}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {role && <RoleBadge role={role} />}
                  {hasAadhar && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-900">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                      </svg>
                      Verified Aadhar
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-zinc-900/15 transition-all hover:-translate-y-0.5 hover:shadow-xl dark:bg-white dark:text-zinc-900 dark:shadow-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                  <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main card */}
        <div className={`${cardClass} p-6 sm:p-8 xl:col-span-2`}>
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-100 pb-5 dark:border-zinc-800/80">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Profile Information
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                Your personal details and identity information
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-zinc-400">Completion</p>
              <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                {completion}%
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 sm:hidden">
              Profile {completion}% complete
            </p>
          </div>

          {!editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoField label="Full Name" value={form.name} icon={fieldIcons.name} />
              <InfoField label="Email Address" value={form.email} icon={fieldIcons.email} />
              <InfoField label="Mobile Number" value={form.phone} icon={fieldIcons.phone} />
              <div className="group rounded-2xl border border-zinc-100 bg-gradient-to-br from-zinc-50/80 to-white p-4 transition-all hover:border-indigo-200/60 hover:shadow-sm dark:border-zinc-800/80 dark:from-zinc-900/40 dark:to-zinc-950">
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-500 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800">
                    {fieldIcons.aadhar}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Aadhar Number</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="font-mono text-sm font-medium tracking-wider text-zinc-900 dark:text-white">
                        {showAadhar ? form.aadharNo || "—" : maskAadhar(form.aadharNo)}
                      </p>
                      {hasAadhar && (
                        <button
                          type="button"
                          onClick={() => setShowAadhar((p) => !p)}
                          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                          aria-label={showAadhar ? "Hide Aadhar" : "Show Aadhar"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                            {showAadhar ? (
                              <path d="M3 3l18 18M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58M9.88 5.09A10.94 10.94 0 0 1 12 5c7 0 10 7 10 7a18.45 18.45 0 0 1-3.06 4.12M6.12 6.12A18.45 18.45 0 0 0 2 12s3 7 10 7a10.94 10.94 0 0 0 4.12-.88" />
                            ) : (
                              <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>
                            )}
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <InfoField
                label="Profile Image"
                value={form.image ? "Added" : "Not provided"}
                icon={fieldIcons.image}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className={labelClass}>Full Name</label>
                  <input id="name" type="text" required value={form.name} onChange={(e) => updateField("name", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input id="email" type="email" required value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Mobile Number</label>
                  <input id="phone" type="tel" required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="image" className={labelClass}>Profile Image URL</label>
                  <input id="image" type="url" value={form.image} onChange={(e) => updateField("image", e.target.value)} className={inputClass} placeholder="https://example.com/photo.jpg" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="aadharNo" className={labelClass}>Aadhar Number</label>
                  <input id="aadharNo" type="text" inputMode="numeric" maxLength={12} value={form.aadharNo} onChange={(e) => updateField("aadharNo", e.target.value)} className={inputClass} placeholder="123456789012" />
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Change Password</h3>
                <p className="mt-1 text-xs text-zinc-500">Leave blank if you don&apos;t want to change it</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="currentPassword" className={labelClass}>Current Password</label>
                    <input id="currentPassword" type="password" value={form.currentPassword} onChange={(e) => updateField("currentPassword", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="password" className={labelClass}>New Password</label>
                    <input id="password" type="password" minLength={6} value={form.password} onChange={(e) => updateField("password", e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={pending} className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-zinc-900">
                  {pending ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" disabled={pending} onClick={() => { setEditing(false); fetchProfile(); }} className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className={`${cardClass} overflow-hidden`}>
            <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Account Overview</h3>
            </div>
            <div className="space-y-3 p-4">
              <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 dark:from-emerald-950/30 dark:to-emerald-900/10">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Profile Status</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-emerald-800 dark:text-emerald-200">
                  {hasAadhar ? "Your profile is complete and ready." : "Add Aadhar to complete your profile."}
                </p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 p-4 dark:from-indigo-950/30 dark:to-violet-950/20">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                      <path d="M12 3 4 7v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4z" />
                    </svg>
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Account Type</p>
                </div>
                <p className="mt-2 text-base font-semibold text-indigo-900 dark:text-indigo-100">{role || "User"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-5 shadow-sm dark:border-indigo-900/40 dark:from-indigo-950/20 dark:to-zinc-950">
            <div className="flex gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                  <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Editable Fields</p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Update name, email, mobile, image URL, and Aadhar. Password change needs your current password.
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardClass} p-5`}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Security Tips</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-400" />
                Use a strong password with 6+ characters
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-400" />
                Keep your Aadhar number private
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-400" />
                Verify email and phone are always current
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
