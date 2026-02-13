//Files: src/shared-ui/layout/AppLayout.tsx
"use client";

import { ReactNode, useState } from "react";
import { UserRole } from "@/libs/utils";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";

interface Props {
    children: ReactNode;
    role: UserRole;
    username?: string;
}

export default function AppLayout({
                                      children,
                                      role,
                                      username,
                                  }: Props) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen w-full">

            {/* SIDEBAR */}
            <AppSidebar role={role}
                        onToggleSidebar={() => setCollapsed(!collapsed)} />

            {/* CONTENT */}
            <div className="flex flex-col flex-1 min-w-0 w-full">

                <AppTopbar
                    role={role}
                    username={username}
                    onToggleTopBar={() => setCollapsed(!collapsed)}
                />

                <main className="flex-1 bg-[#f4f5fa] overflow-y-auto">
                    <div className="px-8 py-8 w-full">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}
