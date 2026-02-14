//Files: src/shared-ui/layout/AppLayout.tsx
"use client";

import { type ReactNode, useState } from "react";
import type { UserRole } from "@/libs/utils";
import AppSidebar from "@/shared-ui/layout/AppSidebar";
import AppTopbar from "@/shared-ui/layout/AppTopbar";

interface Props {
  children: ReactNode;
  role: UserRole;
  username?: string;
}

export default function AppLayout({ children, role, username }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* SIDEBAR */}
      <AppSidebar
        role={role}
        onToggleSidebar={() => setCollapsed(!collapsed)}
      />

      {/* CONTENT */}
      <div className="flex flex-col flex-1 min-w-0 w-full">
        <AppTopbar role={role} username={username} />

        <main className="flex-1 bg-[#f4f5fa] overflow-y-auto">
          <div className="px-8 py-8 w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
