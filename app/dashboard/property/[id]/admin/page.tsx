import { PropertyAdminForm } from "@/dashboard/components/property/property-admin-form";

type AdminPropertyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPropertyPage({
  params,
}: AdminPropertyPageProps) {
  const { id } = await params;
  return <PropertyAdminForm propertyId={id} />;
}
