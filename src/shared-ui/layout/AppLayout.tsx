//Files : src/shared-ui/layout/AppLayout.tsx
"use client";

import { type ReactNode, useState } from "react";
import type { Role } from "@/libs/utils/enums";
import AppSidebar from "@/shared-ui/layout/AppSidebar";
import AppTopbar from "@/shared-ui/layout/AppTopbar";

interface Props {
  children: ReactNode;
  role: Role;
  username?: string;
}

export default function AppLayout({ children, role, username }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f5fa]">
      <AppSidebar role={role} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0">
        <AppTopbar role={role} username={username} onMenuClick={() => setMobileOpen(true)} />

        {/* Scroll only here */}
        <main className="flex-1 w-full overflow-y-auto">
          <div className="px-4 md:px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
