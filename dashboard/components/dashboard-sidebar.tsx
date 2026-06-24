"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardNavLinks } from "@/dashboard/components/dashboard-nav-links";
import { getUserInitials } from "@/lib/auth";

const bottomLinkClassName =
  "whitespace-nowrap rounded-lg px-2 py-2 text-center text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white";

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const displayName = user?.name ?? "Guest User";
  const initials = user ? getUserInitials(user.name) : "GU";

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800/60 dark:bg-black lg:flex">
      <nav className="min-h-0 flex-1 overflow-y-auto p-4">
        <DashboardNavLinks />
      </nav>

      <div className="shrink-0 border-t border-zinc-200 p-4 dark:border-zinc-800/60">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {initials}
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-white">
            {displayName}
          </p>
          <ThemeToggle />
          <Link
            href="/dashboard/profile"
            title="Profile"
            aria-label="Profile"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
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

        <div className="grid grid-cols-2 gap-2">
          <Link href="/" className={bottomLinkClassName}>
            Back to Home
          </Link>
          <button type="button" onClick={logout} className={bottomLinkClassName}>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
