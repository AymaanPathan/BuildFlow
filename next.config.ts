import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "uploadthingy.com",
      "utfs.io",
      "img.clerk.com",
      "subdomain",
      "files.stripe.com",
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
