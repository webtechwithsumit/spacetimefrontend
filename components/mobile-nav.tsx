"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { siteNavItems } from "@/constants/site-nav";
import { getUserInitials } from "@/lib/auth";

function isActiveLink(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav() {
  const pathname = usePathname();
  const { user, isAuthenticated, isReady, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
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

      {open && (
        <nav className="absolute left-0 right-0 top-16 z-50 border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-black">
          <ul className="flex flex-col gap-4">
            {siteNavItems.map((link) => {
              const isActive = isActiveLink(pathname, link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`inline-block border-b-2 pb-1 text-sm transition-colors ${
                      isActive
                        ? "border-indigo-500 font-medium text-zinc-900 dark:border-indigo-400 dark:text-white"
                        : "border-transparent text-zinc-600 hover:text-foreground dark:text-zinc-400"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            {isReady && isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
                    {getUserInitials(user.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-zinc-100 px-4 py-2 text-center text-sm font-medium text-zinc-900 dark:bg-zinc-900 dark:text-white"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="w-full rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 dark:border-red-900/50 dark:text-red-400"
                >
                  Logout
                </button>
              </div>
            ) : isReady ? (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
              >
                Login / Sign Up
              </Link>
            ) : null}
          </div>
        </nav>
      )}
    </div>
  );
}
