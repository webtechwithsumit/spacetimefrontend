import { LiveAuctionsList } from "@/dashboard/components/live-auctions-list";
import { PageHeader } from "@/dashboard/components/page-header";

export default function AuctionsPage() {
  return (
    <div>
      <PageHeader
        title="Live Auctions"
        description="Bid in real-time on commercial properties currently under the hammer."
      />
      <LiveAuctionsList gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
    </div>
  );
}
