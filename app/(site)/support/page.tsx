import { PageHeader } from "@/components/site/page-header";
import { SupportContent } from "@/components/site/support-content";

export default function SupportPage() {
  return (
    <main>
      <PageHeader
        title="Support"
        description="Get help with auctions, KYC, billing, and technical issues. Our team is here to assist you."
      />
      <SupportContent />
    </main>
  );
}
