import { DashboardSidebar } from "@/dashboard/components/dashboard-sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
