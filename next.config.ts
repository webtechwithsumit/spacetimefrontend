import type { NextConfig } from "next";
import { API_BASE_URL } from "./lib/api-config";

function apiImageRemotePattern() {
  try {
    const url = new URL(API_BASE_URL);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/**",
    };
  } catch {
    throw new Error(`Invalid API_BASE_URL in lib/api-config.ts: ${API_BASE_URL}`);
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      apiImageRemotePattern(),
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
