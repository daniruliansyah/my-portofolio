import type { NextConfig } from "next";

function getSupabaseHostname(): string {
  try {
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
    return url ? new URL(url).hostname : "";
  } catch {
    return "";
  }
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: getSupabaseHostname(),
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
    ],
  },
};

export default nextConfig;
