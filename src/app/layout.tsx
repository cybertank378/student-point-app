//Files: src/app/layout.tsx

// src/app/layout.tsx
import "@/styles/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Student Point App",
    template: "%s | Student Point App",
  },
  description:
    "Aplikasi manajemen poin pelanggaran dan prestasi siswa untuk sekolah.",
  keywords: [
    "student point",
    "sistem poin siswa",
    "manajemen pelanggaran",
    "manajemen prestasi",
    "dashboard sekolah",
  ],
  applicationName: "Student Point App",
  authors: [{ name: "Tim Student Point App" }],
  creator: "Tim Student Point App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-[#1e1e2d] text-gray-200">{children}</body>
    </html>
  );
}
