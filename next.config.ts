import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: "standalone",

    experimental: {
        optimizePackageImports: ["react-icons"],
        forceSwcTransforms: false
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
        removeConsole: isProd
            ? {
                exclude: ["error", "warn"],
            }
            : false,
    },

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                ],


            },
            {
                source: "/pdf.worker.min.mjs",
                headers: [
                    {
                        key: "Content-Type",
                        value: "application/javascript",
                    },
                ],
            },
        ];
    },


    turbopack: {
        rules: {
            "*pdf.worker.min.mjs": {
                loaders: ["asset"],
            },
        },
    },
};

export default nextConfig;