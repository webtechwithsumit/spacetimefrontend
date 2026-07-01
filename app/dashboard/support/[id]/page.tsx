import { SupportTicketAdminDetail } from "@/dashboard/components/support/support-ticket-admin-detail";

type DashboardSupportTicketPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardSupportTicketPage({
  params,
}: DashboardSupportTicketPageProps) {
  const { id } = await params;
  return <SupportTicketAdminDetail ticketId={id} />;
}
