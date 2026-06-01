import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/projects/vibe-blog",
        destination: "/projects/proofline",
        permanent: true,
      },
      {
        source: "/writing/html-showcase",
        destination: "/writing/markdown-showcase",
        permanent: true,
      },
      {
        source: "/posts/html-showcase",
        destination: "/writing/markdown-showcase",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
