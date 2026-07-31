import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // imageUrl is a free-text field filled in by admins, so allow any https host.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
