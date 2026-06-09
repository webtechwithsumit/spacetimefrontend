"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteNavItems } from "@/constants/site-nav";

function isActiveLink(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="relative border-b border-zinc-200 bg-white dark:border-zinc-800/60 dark:bg-black">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-6 lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-black">
            ST
          </span>
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-zinc-900 dark:text-white">Space</span>
            <span className="text-indigo-500 dark:text-indigo-400">Time</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {siteNavItems.map((link) => {
            const isActive = isActiveLink(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-2 text-sm transition-colors ${
                  isActive
                    ? "font-medium text-zinc-900 dark:text-white"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-indigo-500 dark:bg-indigo-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:inline-block dark:bg-white dark:text-zinc-900"
          >
            Login / Sign Up
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
