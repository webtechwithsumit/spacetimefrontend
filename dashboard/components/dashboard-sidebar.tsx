"use client";

import { DashboardNavLinks } from "@/dashboard/components/dashboard-nav-links";
import { DashboardUserPanel } from "@/dashboard/components/dashboard-user-panel";

export function DashboardSidebar() {
  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800/60 dark:bg-black lg:flex">
      <nav className="min-h-0 flex-1 overflow-y-auto p-4">
        <DashboardNavLinks />
      </nav>

      <div className="shrink-0 border-t border-zinc-200 p-4 dark:border-zinc-800/60">
        <DashboardUserPanel />
      </div>
    </aside>
  );
}
