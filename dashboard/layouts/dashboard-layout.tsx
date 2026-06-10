import { DashboardMobileNav } from "@/dashboard/components/dashboard-mobile-nav";
import { DashboardSidebar } from "@/dashboard/components/dashboard-sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <DashboardMobileNav />
      <DashboardSidebar />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
