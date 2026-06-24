import axios from "axios";
import { API_BASE_URL } from "@/lib/api-config";
import { clearStoredSession, getStoredToken } from "./auth";

let apiToken: string | null =
  typeof window !== "undefined" ? getStoredToken() : null;

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

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

function handleUnauthorized() {
  clearApiToken();
  clearStoredSession();
  unauthorizedHandler?.();
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  },
);

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
