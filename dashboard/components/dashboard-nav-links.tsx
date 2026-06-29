"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAnalyticsPlugin } from "@/components/analytics-plugin-provider";
import { useAuth } from "@/components/auth-provider";
import {
  dashboardNavItems,
  DashboardNavItem,
  UserRole,
} from "@/dashboard/constants/nav-items";
import { ChevronIcon } from "@/dashboard/icons/nav-icons";

type DashboardNavLinksProps = {
  onNavigate?: () => void;
};

function isActiveLink(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isGroupActive(pathname: string, item: DashboardNavItem) {
  return (
    item.children?.some(
      (child) => child.href && isActiveLink(pathname, child.href),
    ) ?? false
  );
}

function canViewItem(item: DashboardNavItem, userRole?: string) {
  if (!item.roles?.length) return true;
  if (!userRole) return false;
  return item.roles.includes(userRole as UserRole);
}

function filterNavItems(
  items: DashboardNavItem[],
  userRole?: string,
): DashboardNavItem[] {
  return items
    .filter((item) => canViewItem(item, userRole))
    .map((item) => ({
      ...item,
      children: item.children
        ? filterNavItems(item.children, userRole)
        : undefined,
    }))
    .filter((item) => !item.children || item.children.length > 0);
}

const itemClass = (active: boolean, disabled?: boolean) =>
  `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${disabled
    ? "cursor-not-allowed opacity-50"
    : active
      ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-900 dark:text-white"
      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
  }`;

const childClass = (active: boolean, disabled?: boolean) =>
  `flex w-full items-center gap-3 rounded-lg py-2 pl-3 pr-3 text-sm transition-colors ${disabled
    ? "cursor-not-allowed opacity-50"
    : active
      ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-900 dark:text-white"
      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
  }`;

function NavIcon({ icon }: { icon?: React.ReactNode }) {
  if (!icon) return null;
  return (
    <span className="flex size-5 shrink-0 items-center justify-center text-zinc-500 dark:text-zinc-400">
      {icon}
    </span>
  );
}

function NavBadge({ badge }: { badge?: string }) {
  if (!badge) return null;
  return (
    <span className="ml-auto rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
      {badge}
    </span>
  );
}

export function DashboardNavLinks({ onNavigate }: DashboardNavLinksProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { canViewPlatformAnalytics } = useAnalyticsPlugin();
  const visibleItems = useMemo(() => {
    const filtered = filterNavItems(dashboardNavItems, user?.role);
    if (canViewPlatformAnalytics) return filtered;
    return filtered.filter((item) => item.id !== "analytics");
  }, [user?.role, canViewPlatformAnalytics]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev };
      visibleItems.forEach((item) => {
        if (item.children?.length && isGroupActive(pathname, item)) {
          next[item.id] = true;
        }
      });
      return next;
    });
  }, [pathname, visibleItems]);

  function toggleSection(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-1">
      {visibleItems.map((item) => {
        if (item.children?.length) {
          const isOpen = openSections[item.id] ?? false;
          const groupActive = isGroupActive(pathname, item);

          return (
            <div key={item.id} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleSection(item.id)}
                title={item.description}
                className={itemClass(groupActive)}
              >
                <NavIcon icon={item.icon} />
                <span className="flex-1 text-left">{item.label}</span>
                <NavBadge badge={item.badge} />
                <ChevronIcon className="size-4 shrink-0" open={isOpen} />
              </button>

              <div
                className={`grid transition-all duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="ml-4 space-y-1 border-l border-zinc-200 pl-2 dark:border-zinc-800">
                    {item.children.map((child) => {
                      if (!child.href) return null;
                      const active = isActiveLink(pathname, child.href);

                      if (child.disabled) {
                        return (
                          <span
                            key={child.id}
                            title={child.description}
                            className={childClass(active, true)}
                          >
                            <NavIcon icon={child.icon} />
                            <span>{child.label}</span>
                            <NavBadge badge={child.badge} />
                          </span>
                        );
                      }

                      return (
                        <Link
                          key={child.id}
                          href={child.href}
                          title={child.description}
                          target={child.external ? "_blank" : undefined}
                          rel={child.external ? "noopener noreferrer" : undefined}
                          onClick={onNavigate}
                          className={childClass(active)}
                        >
                          <NavIcon icon={child.icon} />
                          <span>{child.label}</span>
                          <NavBadge badge={child.badge} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (!item.href) return null;
        const active = isActiveLink(pathname, item.href);

        if (item.disabled) {
          return (
            <span
              key={item.id}
              title={item.description}
              className={itemClass(active, true)}
            >
              <NavIcon icon={item.icon} />
              <span>{item.label}</span>
              <NavBadge badge={item.badge} />
            </span>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            title={item.description}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            onClick={onNavigate}
            className={itemClass(active)}
          >
            <NavIcon icon={item.icon} />
            <span>{item.label}</span>
            <NavBadge badge={item.badge} />
          </Link>
        );
      })}
    </div>
  );
}
