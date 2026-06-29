import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/lib/pagination";

export type BlogPostAuthor = {
  id: string;
  name: string;
  email: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  tags: string[];
  status: "draft" | "published";
  authorId: BlogPostAuthor | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostsResponse = PaginatedResponse<BlogPost>;

export type BlogPostResponse = {
  success: boolean;
  message?: string;
  data?: BlogPost;
};

export async function fetchPublishedPosts(params?: {
  page?: number;
  search?: string;
  tag?: string;
}) {
  const { data } = await api.get<BlogPostsResponse>("/api/blog/posts", { params });
  return data;
}

export async function fetchPublishedPostBySlug(slug: string) {
  const { data } = await api.get<BlogPostResponse>(`/api/blog/posts/slug/${slug}`);
  return data;
}

export async function fetchAdminPosts(params?: {
  page?: number;
  search?: string;
  status?: string;
}) {
  const { data } = await api.get<BlogPostsResponse>("/api/blog/admin/posts", { params });
  return data;
}

export async function fetchAdminPostById(id: string) {
  const { data } = await api.get<BlogPostResponse>(`/api/blog/admin/posts/${id}`);
  return data;
}

export function buildBlogFormData(payload: {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  tags: string[];
  featuredImageFile?: File | null;
  featuredImage?: string;
}) {
  const formData = new FormData();
  formData.append("title", payload.title.trim());
  if (payload.slug?.trim()) formData.append("slug", payload.slug.trim());
  formData.append("excerpt", payload.excerpt.trim());
  formData.append("content", payload.content);
  formData.append("status", payload.status);
  formData.append("tags", JSON.stringify(payload.tags));
  if (payload.featuredImage?.trim()) {
    formData.append("featuredImage", payload.featuredImage.trim());
  }
  if (payload.featuredImageFile) {
    formData.append("featuredImage", payload.featuredImageFile);
  }
  return formData;
}
