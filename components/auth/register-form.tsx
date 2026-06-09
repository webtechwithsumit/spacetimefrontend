"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";

const linkClass =
  "font-semibold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300";

const buttonClass =
  "w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:shadow-xl disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:shadow-white/10 dark:hover:bg-zinc-100";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      setPending(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setPending(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setPending(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Join SpaceTime to start bidding on properties"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className={linkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="name"
          name="name"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          autoComplete="name"
        />
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
        />
        <AuthPasswordInput
          id="password"
          name="password"
          label="Password"
          autoComplete="new-password"
        />
        <AuthPasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
        />

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </p>
        )}

        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthCard>
  );
}
