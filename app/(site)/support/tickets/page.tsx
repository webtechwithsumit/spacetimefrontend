import { PageHeader } from "@/components/site/page-header";
import { SupportTicketsContent } from "@/components/site/support-tickets-content";

export default function SupportTicketsPage() {
  return (
    <main>
      <PageHeader
        title="My Tickets"
        description="Track your support requests and continue conversations with our team."
      />
      <SupportTicketsContent />
    </main>
  );
}
