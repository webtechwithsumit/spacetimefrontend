import { DashboardAuthGuard } from "@/dashboard/components/dashboard-auth-guard";
import { DashboardMobileNav } from "@/dashboard/components/dashboard-mobile-nav";
import { DashboardSidebar } from "@/dashboard/components/dashboard-sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardAuthGuard>
      <div className="flex min-h-screen flex-col lg:h-screen lg:overflow-hidden lg:flex-row">
        <DashboardMobileNav />
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:min-h-0">
          {children}
        </main>
      </div>
    </DashboardAuthGuard>
  );
}
