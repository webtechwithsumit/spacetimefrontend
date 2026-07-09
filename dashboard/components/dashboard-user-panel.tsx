"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { getUserInitials } from "@/lib/auth";

function formatRole(role: string) {
  return role.replace(/-/g, " ");
}

function roleBadgeClass(role: string) {
  if (role === "Super-Admin") {
    return "bg-violet-100 text-violet-700 ring-violet-200/80 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-900/60";
  }
  if (role === "Admin") {
    return "bg-sky-100 text-sky-700 ring-sky-200/80 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-900/60";
  }
  if (role === "Buyer") {
    return "bg-blue-100 text-blue-700 ring-blue-200/80 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-900/60";
  }
  if (role === "Seller") {
    return "bg-purple-100 text-purple-700 ring-purple-200/80 dark:bg-purple-950/50 dark:text-purple-300 dark:ring-purple-900/60";
  }
  if (role === "Broker") {
    return "bg-indigo-100 text-indigo-700 ring-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-300 dark:ring-indigo-900/60";
  }
  return "bg-zinc-100 text-zinc-700 ring-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700/60";
}

function avatarClass(role?: string) {
  if (role === "Super-Admin") {
    return "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm shadow-violet-500/25";
  }
  if (role === "Admin") {
    return "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm shadow-sky-500/25";
  }
  if (role === "Seller") {
    return "bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-sm shadow-purple-500/25";
  }
  if (role === "Buyer") {
    return "bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-sm shadow-blue-500/25";
  }
  if (role === "Broker") {
    return "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/25";
  }
  return "bg-gradient-to-br from-zinc-500 to-zinc-600 text-white shadow-sm shadow-zinc-500/20";
}

const actionButtonClassName =
  "flex size-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-white";

const footerLinkClassName =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-white";

export function DashboardUserPanel({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const displayName = user?.name ?? "Guest User";
  const initials = user ? getUserInitials(user.name) : "GU";
  const role = user?.role;

  return (
    <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 p-3 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
      <div className="flex items-start gap-3">
        <Link
          href="/dashboard/profile"
          onClick={onNavigate}
          title="View profile"
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-transform hover:scale-105 ${avatarClass(role)}`}
        >
          {initials}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-900 dark:text-white">
              {displayName}
            </p>
            <ThemeToggle />
            <Link
              href="/dashboard/profile"
              onClick={onNavigate}
              title="Profile"
              aria-label="Profile"
              className={actionButtonClassName}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="size-4"
              >
                <circle cx="12" cy="8" r="3" />
                <path d="M6 20v-1a6 6 0 0 1 12 0v1" />
              </svg>
            </Link>
          </div>
          {role ? (
            <span
              className={`mt-1.5 inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${roleBadgeClass(role)}`}
            >
              {formatRole(role)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link href="/" onClick={onNavigate} className={footerLinkClassName}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-3.5 shrink-0 opacity-70"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M9 22V12h6v10" />
          </svg>
          Home
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          className={`${footerLinkClassName} text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:border-red-900/50 dark:hover:bg-red-950/30 dark:hover:text-red-300`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-3.5 shrink-0 opacity-70"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5M21 12H9" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
