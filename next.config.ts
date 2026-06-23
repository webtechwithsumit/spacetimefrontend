import type { NextConfig } from "next";

function apiImageRemotePattern() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.spacetime.com.co";

  try {
    const url = new URL(apiBase);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/uploads/**",
    };
  } catch {
    return {
      protocol: "http" as const,
      hostname: "localhost",
      port: "3002",
      pathname: "/uploads/**",
    };
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
};

export default nextConfig;
