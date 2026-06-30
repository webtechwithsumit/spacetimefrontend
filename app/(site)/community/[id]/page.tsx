import { CommunityPostContent } from "@/components/site/community-post-content";

type CommunityPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CommunityPostPage({ params }: CommunityPostPageProps) {
  const { id } = await params;
  return (
    <main>
      <CommunityPostContent postId={id} />
    </main>
  );
}
