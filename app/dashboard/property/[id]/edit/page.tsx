import { PropertyEditForm } from "@/dashboard/components/property/property-edit-form";

type EditPropertyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  return <PropertyEditForm propertyId={id} />;
}
