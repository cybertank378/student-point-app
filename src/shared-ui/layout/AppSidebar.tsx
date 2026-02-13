// src/shared-ui/layout/AppSidebar.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useSidebarMenu } from "@/sections/sidebar/hooks/useSidebarMenu";
import { RecursiveSidebarItem } from "@/sections/sidebar/components/RecursiveSidebarItem";
import { TeacherRole, UserRole } from "@/libs/utils";

interface Props {
    role: UserRole;
    teacherRole?: TeacherRole;
    collapsed?: boolean; // ✅ tambahkan
    onToggleSidebar?: () => void; // ✅ tambahkan
}

export default function AppSidebar({
                                       role,
                                       teacherRole,
                                       collapsed = false,
                                       onToggleSidebar,
                                   }: Props) {
    const menu = useSidebarMenu(role, teacherRole);

    const [expandedIndex, setExpandedIndex] =
        useState<number | null>(1);

    return (
        <aside
            className={`bg-[#282A42] text-[#D8D8EE] min-h-screen transition-all duration-300 ${
                collapsed ? "w-[80px]" : "w-[260px]"
            }`}
        >
            {/* HEADER */}
            <div className="h-16 flex items-center justify-between px-4">
                <div className="flex items-center">
                    <Image
                        src="/assets/images/logo/logo.png"
                        alt="Logo"
                        width={32}
                        height={32}
                    />

                    {!collapsed && (
                        <span className="ml-3 font-semibold">
              SMP Negeri 29
            </span>
                    )}
                </div>

                {/* Toggle Button */}
                {onToggleSidebar && (
                    <button
                        onClick={onToggleSidebar}
                        className="text-sm opacity-70 hover:opacity-100"
                    >
                        ☰
                    </button>
                )}
            </div>

            {/* MENU */}
            <nav className="px-3 space-y-1">
                {menu.map((item, index) => (
                    <RecursiveSidebarItem
                        key={item.label}
                        item={item}
                        index={index}
                        expandedIndex={expandedIndex}
                        setExpandedIndex={setExpandedIndex}
                        collapsed={collapsed} // optional kalau mau support icon-only
                    />
                ))}
            </nav>
        </aside>
    );
}
