import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/library/daily-news",
        destination: "/",
        permanent: true,
      },
      {
        source: "/library",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
