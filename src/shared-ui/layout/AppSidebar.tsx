// src/shared-ui/layout/AppSidebar.tsx
"use client";

import Image from "next/image";
import { useSidebarMenu } from "@/sections/sidebar/hooks/useSidebarMenu";
import { RecursiveSidebarItem } from "@/sections/sidebar/components/RecursiveSidebarItem";
import {TeacherRole, UserRole} from "@/libs/utils";

;

interface AppSidebarProps {
    role: UserRole;
    teacherRole?: TeacherRole;
    onToggleSidebar?: () => void;
}

export default function AppSidebar({
                                       role,
                                       teacherRole,
                                       onToggleSidebar,
                                   }: AppSidebarProps) {
    const menu = useSidebarMenu(role, teacherRole);

    return (
        <aside className="w-[260px] bg-[#2c2f48] text-gray-300 flex flex-col min-h-screen">
            {/* ===================================== */}
            {/* HEADER */}
            {/* ===================================== */}
            <div className="h-16 flex items-center bg-white justify-between px-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <Image
                        src="/assets/images/logo/logo.png"
                        alt="Logo"
                        width={32}
                        height={32}
                        priority
                    />
                    <span className="text-[#2c2f48] text-lg font-semibold tracking-wide">SMP Negeri 29 Jakarta</span>
                </div>

                {onToggleSidebar && (
                    <button
                        onClick={onToggleSidebar}
                        className="text-gray-400 hover:text-gray-700 transition"
                        aria-label="Toggle Sidebar"
                    >
                        ❮❮
                    </button>
                )}
            </div>

            {/* ===================================== */}
            {/* MENU */}
            {/* ===================================== */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {menu.map((item) => (
                    <RecursiveSidebarItem key={item.label} item={item} />
                ))}
            </nav>
        </aside>
    );
}
