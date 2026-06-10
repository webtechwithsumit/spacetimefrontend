import axios from "axios";
import { getStoredToken } from "./auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002";

let apiToken: string | null =
  typeof window !== "undefined" ? getStoredToken() : null;

export function setApiToken(token: string) {
  apiToken = token;
}

export function clearApiToken() {
  apiToken = null;
}

function resolveApiToken(): string | null {
  if (apiToken) return apiToken;
  apiToken = getStoredToken();
  return apiToken;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = resolveApiToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

type ApiErrorBody = {
  message?: string;
};

export function getApiErrorMessage(
  error: unknown,
  fallback = "Unable to connect to server.",
): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}
