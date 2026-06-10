import { API_BASE_URL } from "@/lib/api";

export function getMediaUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/uploads/")) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/uploads/${path.replace(/^\/+/, "")}`;
}
