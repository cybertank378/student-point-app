"use client";

import { ReactNode, useState } from "react";
import type { UserRole } from "@/libs/utils";
import AppSidebar from "@/shared-ui/layout/AppSidebar";
import AppTopbar from "@/shared-ui/layout/AppTopbar";

interface Props {
    children: ReactNode;
    role: UserRole;
    username?: string;
}

export default function AppLayout({ children, role, username }: Props) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen w-full bg-[#f4f5fa]">

            {/* Sidebar - Render Only Once */}
            <AppSidebar
                role={role}
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <div className="flex flex-col flex-1 min-w-0 w-full">

                <AppTopbar
                    role={role}
                    username={username}
                    onMenuClick={() => setMobileOpen(true)}
                />

                <main className="flex-1 overflow-y-auto">
                    <div className="px-6 md:px-8 py-6 md:py-8 w-full">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}
