import { AboutContent } from "@/components/site/about-content";
import { PageHeader } from "@/components/site/page-header";

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        title="About Us"
        description="SpaceTime is India's trusted live auction platform for commercial property — connecting buyers, sellers, and brokers with transparency and confidence."
      />
      <AboutContent />
    </main>
  );
}
