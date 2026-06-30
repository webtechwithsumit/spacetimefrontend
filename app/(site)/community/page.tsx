import { PageHeader } from "@/components/site/page-header";
import { CommunityContent } from "@/components/site/community-content";

export default function CommunityPage() {
  return (
    <main>
      <PageHeader
        title="Community"
        description="Connect with buyers, sellers, and brokers. Share auction tips, market insights, and questions."
      />
      <CommunityContent />
    </main>
  );
}
