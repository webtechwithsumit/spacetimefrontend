import { SupportTicketDetailContent } from "@/components/site/support-ticket-detail-content";

type SupportTicketPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SupportTicketPage({ params }: SupportTicketPageProps) {
  const { id } = await params;
  return (
    <main>
      <SupportTicketDetailContent ticketId={id} />
    </main>
  );
}
