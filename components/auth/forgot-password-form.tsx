"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";

const linkClass =
  "font-semibold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300";

const buttonClass =
  "w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:shadow-xl disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:shadow-white/10 dark:hover:bg-zinc-100";

export function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();

    if (!email) {
      setError("Email is required");
      setPending(false);
      return;
    }

    setSuccess(true);
    setPending(false);
  }

  if (success) {
    return (
      <AuthCard
        title="Check your email"
        subtitle="If an account exists with that email, we've sent password reset instructions."
        footer={
          <Link href="/login" className={linkClass}>
            Back to Sign In
          </Link>
        }
      >
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-center dark:border-emerald-900/50 dark:bg-emerald-950/30">
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            Reset instructions sent successfully.
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Didn&apos;t receive an email? Check your spam folder or try again.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password"
      subtitle="Enter your email and we'll send you reset instructions"
      footer={
        <Link href="/login" className={linkClass}>
          Back to Sign In
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
        />

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </p>
        )}

        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </AuthCard>
  );
}
