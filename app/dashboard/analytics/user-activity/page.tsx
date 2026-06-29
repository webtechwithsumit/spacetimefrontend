import { AnalyticsLicenseGate } from "@/dashboard/components/analytics-license-gate";
import { UserActivityDashboard } from "@/dashboard/components/user-activity-dashboard";

export default function UserActivityPage() {
  return (
    <AnalyticsLicenseGate title="User Activity">
      <UserActivityDashboard />
    </AnalyticsLicenseGate>
  );
}
