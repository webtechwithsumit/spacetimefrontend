import { AnalyticsDashboard } from "@/dashboard/components/analytics-dashboard";
import { AnalyticsLicenseGate } from "@/dashboard/components/analytics-license-gate";

export default function AnalyticsPage() {
  return (
    <AnalyticsLicenseGate title="Analytics Overview">
      <AnalyticsDashboard />
    </AnalyticsLicenseGate>
  );
}
