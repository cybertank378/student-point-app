//Files: src/app/layout.tsx
//Files: src/app/layout.tsx
import "@/styles/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppToastProvider from "@/shared-ui/layout/AppToastProvider";

export const metadata: Metadata = {
  title: {
    default: "Manajemen Poin Siswa",
    template: "%s | Manajemen Poin Siswa",
  },
  description:
    "Aplikasi manajemen poin pelanggaran dan prestasi siswa untuk mendukung monitoring dan pembinaan di sekolah.",
  keywords: [
    "manajemen poin siswa",
    "sistem poin siswa",
    "pelanggaran siswa",
    "prestasi siswa",
    "dashboard sekolah",
  ],
  applicationName: "Manajemen Poin Siswa",
  authors: [{ name: "Tim Pengembang Manajemen Poin Siswa" }],
  creator: "Tim Pengembang Manajemen Poin Siswa",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-[#1e1e2d] text-gray-200">
            <AppToastProvider>{children}</AppToastProvider>
      </body>
    </html>
  );
}
