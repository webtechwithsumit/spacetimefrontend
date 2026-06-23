import { MyBidsList } from "@/dashboard/components/my-bids-list";
import { PageHeader } from "@/dashboard/components/page-header";

export default function BuyersPage() {
  return (
    <div>
      <PageHeader
        title="My Bids"
        description="Properties you have bid on, with your latest status in each auction."
      />
      <MyBidsList />
    </div>
  );
}
