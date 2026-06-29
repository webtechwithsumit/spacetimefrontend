import { BlogPostContent } from "@/components/site/blog-post-content";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  return (
    <main>
      <BlogPostContent slug={slug} />
    </main>
  );
}
