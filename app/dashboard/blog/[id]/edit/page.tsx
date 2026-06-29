import { BlogPostForm } from "@/dashboard/components/blog/blog-post-form";

type EditBlogPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  return <BlogPostForm postId={id} />;
}
