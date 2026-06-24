const API_URLS = {
  development: "http://localhost:3002",
  production: "https://api.spacetime.com.co",
} as const;

/** Change URLs above — this is the only place for the backend API base URL. */
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? API_URLS.production
    : API_URLS.development;
