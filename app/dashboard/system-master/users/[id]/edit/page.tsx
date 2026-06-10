import { UserEditForm } from "@/dashboard/components/user-edit-form";

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  return <UserEditForm userId={id} />;
}
