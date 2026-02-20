//Files: src/app/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import AppLayout from "@/shared-ui/layout/AppLayout";
import type React from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppLayout role={user.role} username={user.username}>
      {children}
    </AppLayout>
  );
}
