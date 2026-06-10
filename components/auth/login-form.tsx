"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { api, getApiErrorMessage } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";

type LoginResponse = {
  success: boolean;
  message: string;
  data?: {
    user: AuthUser;
    token: string;
  };
};

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Email and password are required");
      setPending(false);
      return;
    }

    try {
      const { data } = await api.post<LoginResponse>("/api/auth/login", {
        email,
        password,
      });

      if (!data.success) {
        setError(data.message || "Login failed");
        setPending(false);
        return;
      }

      if (!data.data?.user || !data.data?.token) {
        setError("Login failed");
        setPending(false);
        return;
      }

      login(data.data.user, data.data.token);
      router.push("/dashboard");
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to connect to server. Please try again."));
      setPending(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your SpaceTime account"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Register
          </Link>
        </>
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
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-4"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          }
        />

        <AuthPasswordInput
          id="password"
          name="password"
          label="Password"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              name="remember"
              className="size-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500/20 dark:border-zinc-600"
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:shadow-xl disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:shadow-white/10 dark:hover:bg-zinc-100"
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </AuthCard>
  );
}
