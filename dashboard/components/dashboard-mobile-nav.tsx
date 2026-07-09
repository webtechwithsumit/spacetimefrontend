"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardNavLinks } from "@/dashboard/components/dashboard-nav-links";
import { DashboardUserPanel } from "@/dashboard/components/dashboard-user-panel";

export function DashboardMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white px-4 dark:border-zinc-800/60 dark:bg-black">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle dashboard menu"
          aria-expanded={open}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-5"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white dark:bg-white dark:text-black">
            ST
          </span>
          <span className="text-sm font-semibold tracking-tight">
            <span className="text-zinc-900 dark:text-white">Space</span>
            <span className="text-indigo-500 dark:text-indigo-400">Time</span>
          </span>
        </Link>
      </header>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close dashboard menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-zinc-200 bg-white dark:border-zinc-800/60 dark:bg-black lg:hidden">
            <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800/60">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Dashboard Menu
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex size-8 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="size-5"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <DashboardNavLinks onNavigate={() => setOpen(false)} />
            </nav>

            <div className="border-t border-zinc-200 p-4 dark:border-zinc-800/60">
              <DashboardUserPanel onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
