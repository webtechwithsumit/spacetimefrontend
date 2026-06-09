"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavItems } from "@/dashboard/constants/nav-items";

const bottomLinkClassName =
  "whitespace-nowrap rounded-lg px-2 py-2 text-center text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800/60 dark:bg-black lg:flex">
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {dashboardNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${isActive
                  ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800/60">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            GU
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-white">
            Guest User
          </p>
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
          <Link href="/login" className={bottomLinkClassName}>
            Logout
          </Link>
        </div>
      </div>
    </aside>
  );
}
