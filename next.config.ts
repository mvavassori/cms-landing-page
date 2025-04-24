import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("http://127.0.0.1:1337/uploads/**"), new URL("http://91.99.49.37:1337/uploads/**")],
  },
};

export default nextConfig;
