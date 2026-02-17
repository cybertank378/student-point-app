// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,

    experimental: {
        optimizePackageImports: ["react-icons"],
    },

    images: {
        formats: ["image/avif", "image/webp"],
        localPatterns: [
            {
                pathname: "/assets/**",
            },
        ],
    },

    compiler: {
        removeConsole:
            process.env.NODE_ENV === "production"
                ? {
                    exclude: ["error"],
                }
                : false,
    },
};

export default nextConfig;
