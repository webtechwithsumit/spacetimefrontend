"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavItems } from "@/dashboard/constants/nav-items";

const linkClassName =
  "rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white";

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
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-zinc-200 p-4 dark:border-zinc-800/60">
        <Link href="/" className={linkClassName}>
          Back to Home
        </Link>
        <Link href="/login" className={linkClassName}>
          Logout
        </Link>
      </div>
    </aside>
  );
}
