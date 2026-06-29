import { AnalyticsLicenseGate } from "@/dashboard/components/analytics-license-gate";
import { PropertyAnalyticsDashboard } from "@/dashboard/components/property/property-analytics-dashboard";

type PropertyAnalyticsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PropertyAnalyticsPage({
  params,
}: PropertyAnalyticsPageProps) {
  const { id } = await params;
  return (
    <AnalyticsLicenseGate title="Property Analytics" mode="property">
      <PropertyAnalyticsDashboard propertyId={id} />
    </AnalyticsLicenseGate>
  );
}
