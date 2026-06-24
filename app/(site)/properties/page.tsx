import { PageHeader } from "@/components/site/page-header";
import { PropertiesContent } from "@/components/site/properties-content";

export default function PropertiesPage() {
  return (
    <main>
      <PageHeader
        title="Properties"
        description="Explore residential, commercial, and land listings available on SpaceTime."
      />
      <PropertiesContent />
    </main>
  );
}
