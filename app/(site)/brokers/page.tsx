import { PageHeader } from "@/components/site/page-header";
import { BrokersContent } from "@/components/site/brokers-content";

export default function BrokersPage() {
  return (
    <main>
      <PageHeader
        title="Brokers"
        description="Partner with SpaceTime to connect clients with live property auctions and grow your business."
      />
      <BrokersContent />
    </main>
  );
}
