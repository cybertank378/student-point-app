//Files: src/sections/sidebar/components/RecursiveSidebarItem.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { SidebarMenuItem } from "@/modules/auth/domain/rbac/roleMenuPolicy";
import { isMenuActive } from "../utils/isMenuActive";

interface RecursiveSidebarItemProps {
    item: SidebarMenuItem;
    depth?: number;
}

export function RecursiveSidebarItem({
                                         item,
                                         depth = 0,
                                     }: RecursiveSidebarItemProps) {
    const pathname = usePathname();
    const active = isMenuActive(item, pathname);
    const hasChildren = Boolean(item.children && item.children.length > 0);

    const [open, setOpen] = useState<boolean>(active);

    useEffect(() => {
        if (active) {
            setOpen(true);
        }
    }, [active]);

    return (
        <div>
            <div
                onClick={() => {
                    if (hasChildren) setOpen((prev) => !prev);
                }}
                className={clsx(
                    "flex items-center justify-between px-4 py-2 rounded-lg transition-colors cursor-pointer",
                    active
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 hover:bg-gray-100",
                    depth > 0 && "ml-4"
                )}
            >
                {item.path ? (
                    <Link href={item.path} className="flex items-center gap-2 w-full">
                        {item.icon && <item.icon size={18} />}
                        <span>{item.label}</span>
                    </Link>
                ) : (
                    <div className="flex items-center gap-2 w-full">
                        {item.icon && <item.icon size={18} />}
                        <span>{item.label}</span>
                    </div>
                )}

                {hasChildren && (
                    <span
                        className={clsx(
                            "text-xs transition-transform",
                            open && "rotate-90"
                        )}
                    >
            ▶
          </span>
                )}
            </div>

            {hasChildren && open && item.children && (
                <div className="mt-1 space-y-1">
                    {item.children.map((child) => (
                        <RecursiveSidebarItem
                            key={`${child.label}-${depth}`}
                            item={child}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
