//Files: src/sections/sidebar/components/SidebarGroup.tsx

"use client";

import { useState } from "react";
import { SidebarMenuItem } from "@/modules/auth/domain/rbac/roleMenuPolicy";
import { RecursiveSidebarItem } from "./RecursiveSidebarItem";

interface SidebarGroupProps {
    title?: string;
    items: SidebarMenuItem[];
    collapsed?: boolean;
}

export function SidebarGroup({
                                 title,
                                 items,
                                 collapsed = false,
                             }: SidebarGroupProps) {

    const [expandedIndex, setExpandedIndex] =
        useState<number | null>(null);

    return (
        <div className="space-y-2">
            {title && (
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                    {title}
                </p>
            )}

            {items.map((item, index) => (
                <RecursiveSidebarItem
                    key={item.label}
                    item={item}
                    index={index}
                    expandedIndex={expandedIndex}
                    setExpandedIndex={setExpandedIndex}
                    collapsed={collapsed}
                />
            ))}
        </div>
    );
}

