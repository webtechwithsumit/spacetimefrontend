import { PropertyAnalyticsDashboard } from "@/dashboard/components/property/property-analytics-dashboard";

type PropertyAnalyticsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PropertyAnalyticsPage({
  params,
}: PropertyAnalyticsPageProps) {
  const { id } = await params;
  return <PropertyAnalyticsDashboard propertyId={id} />;
}
