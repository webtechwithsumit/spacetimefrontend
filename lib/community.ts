import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/lib/pagination";

export const COMMUNITY_CATEGORIES = [
  "Auction Tips",
  "Market News",
  "Q&A",
  "Success Stories",
  "General",
] as const;

export type CommunityCategory = (typeof COMMUNITY_CATEGORIES)[number];

export type CommunityAuthor = {
  id: string;
  name: string;
  role: string;
  image: string;
};

export type CommunityPost = {
  id: string;
  title: string;
  body: string;
  category: CommunityCategory;
  tags: string[];
  commentCount: number;
  isPinned: boolean;
  authorId: CommunityAuthor | null;
  createdAt: string;
  updatedAt: string;
};

export type CommunityComment = {
  id: string;
  postId: string;
  content: string;
  authorId: CommunityAuthor | null;
  createdAt: string;
  updatedAt: string;
};

export type CommunityPostDetail = CommunityPost & {
  comments: CommunityComment[];
};

export type CommunityPostsResponse = PaginatedResponse<CommunityPost>;

export type CommunityPostResponse = {
  success: boolean;
  message?: string;
  data?: CommunityPost;
};

export type CommunityPostDetailResponse = {
  success: boolean;
  message?: string;
  data?: CommunityPostDetail;
};

export type CommunityCommentResponse = {
  success: boolean;
  message?: string;
  data?: CommunityComment;
};

export async function fetchCommunityPosts(params?: {
  page?: number;
  search?: string;
  category?: string;
}) {
  const { data } = await api.get<CommunityPostsResponse>("/api/community/posts", {
    params,
  });
  return data;
}

export async function fetchCommunityPostById(id: string) {
  const { data } = await api.get<CommunityPostDetailResponse>(
    `/api/community/posts/${id}`,
  );
  return data;
}

export async function createCommunityPost(payload: {
  title: string;
  body: string;
  category: CommunityCategory;
  tags?: string[];
}) {
  const { data } = await api.post<CommunityPostResponse>("/api/community/posts", payload);
  return data;
}

export async function deleteCommunityPost(id: string) {
  const { data } = await api.delete<{ success: boolean; message?: string }>(
    `/api/community/posts/${id}`,
  );
  return data;
}

export async function addCommunityComment(postId: string, content: string) {
  const { data } = await api.post<CommunityCommentResponse>(
    `/api/community/posts/${postId}/comments`,
    { content },
  );
  return data;
}

export async function deleteCommunityComment(id: string) {
  const { data } = await api.delete<{ success: boolean; message?: string }>(
    `/api/community/comments/${id}`,
  );
  return data;
}

export async function fetchAdminCommunityPosts(params?: {
  page?: number;
  search?: string;
  category?: string;
}) {
  const { data } = await api.get<CommunityPostsResponse>(
    "/api/community/admin/posts",
    { params },
  );
  return data;
}

export async function adminDeleteCommunityPost(id: string) {
  const { data } = await api.delete<{ success: boolean; message?: string }>(
    `/api/community/admin/posts/${id}`,
  );
  return data;
}

export async function adminToggleCommunityPin(id: string) {
  const { data } = await api.patch<{ success: boolean; message?: string }>(
    `/api/community/admin/posts/${id}/pin`,
  );
  return data;
}

export function categoryBadgeClass(category: string) {
  switch (category) {
    case "Auction Tips":
      return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300";
    case "Market News":
      return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
    case "Q&A":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
    case "Success Stories":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
    default:
      return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";
  }
}
