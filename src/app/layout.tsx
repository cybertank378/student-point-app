//Files: src/app/layout.tsx

// src/app/layout.tsx
import "@/styles/globals.css";
import React from "react";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "User Management",
    description: "Halaman manajemen user aplikasi",
};

export default function RootLayout({children}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <body className="bg-[#1e1e2d] text-gray-200">
                {children}
            </body>
        </html>
    );
}
