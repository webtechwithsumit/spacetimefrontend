import { PageHeader } from "@/components/site/page-header";
import { BlogContent } from "@/components/site/blog-content";

export default function BlogPage() {
  return (
    <main>
      <PageHeader
        title="Blog"
        description="Insights, guides, and updates from SpaceTime on property auctions and real estate."
      />
      <BlogContent />
    </main>
  );
}
