//Files: src/sections/sidebar/components/RecursiveSidebarItem.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { SidebarMenuItem } from "@/modules/auth/domain/rbac/roleMenuPolicy";
import { FaChevronRight } from "react-icons/fa";
import clsx from "clsx";

interface Props {
    item: SidebarMenuItem;
    level?: number;
    index: number;
    expandedIndex: number | null;
    setExpandedIndex: (index: number | null) => void;
    collapsed?: boolean; // ✅ TAMBAHKAN INI
}

export function RecursiveSidebarItem({
                                         item,
                                         level = 0,
                                         index,
                                         expandedIndex,
                                         setExpandedIndex,
                                         collapsed = false, // default
                                     }: Props) {
    const pathname = usePathname();
    const router = useRouter();

    const hasChildren = !!item.children?.length;
    const isActive = item.path && pathname === item.path;
    const isOpen = expandedIndex === index;

    const handleClick = () => {
        if (collapsed && item.path) {
            router.push(item.path);
            return;
        }

        if (hasChildren && level === 0) {
            setExpandedIndex(isOpen ? null : index);
        } else if (item.path) {
            router.push(item.path);
        }
    };

    const paddingLeft = collapsed ? 12 : 16 + level * 18;

    return (
        <div>
            <button
                onClick={handleClick}
                className={clsx(
                    "flex items-center justify-between w-full rounded-xl",
                    "text-sm font-medium px-3 py-2 transition-all duration-200",
                    {
                        "bg-[#666CFF] text-white": isActive,
                        "bg-[#383951] text-[#D8D8EE]":
                            level === 0 && isOpen && !isActive,
                        "hover:bg-[#383951] text-[#D8D8EE]":
                            !isActive && !(level === 0 && isOpen),
                    }
                )}
                style={{ paddingLeft }}
            >
                <div className="flex items-center gap-2">
                    {level === 0 && item.icon && (
                        <item.icon size={18} />
                    )}

                    {/* 🔥 HIDE LABEL IF COLLAPSED */}
                    {!collapsed && (
                        <>
                            {level > 0 && (
                                <span
                                    className={clsx(
                                        "w-2 h-2 rounded-full",
                                        isActive ? "bg-white" : "bg-[#B0B0C6]"
                                    )}
                                />
                            )}

                            <span
                                className={clsx(
                                    level > 0 && !isActive
                                        ? "text-[#B0B0C6]"
                                        : ""
                                )}
                            >
                {item.label}
              </span>
                        </>
                    )}
                </div>

                {hasChildren && level === 0 && !collapsed && (
                    <FaChevronRight
                        size={12}
                        className={clsx(
                            "transition-transform duration-200",
                            isOpen && "rotate-90"
                        )}
                    />
                )}
            </button>

            {hasChildren && isOpen && !collapsed && (
                <div className="mt-1 space-y-1">
                    {item.children?.map((child, i) => (
                        <RecursiveSidebarItem
                            key={child.label}
                            item={child}
                            level={level + 1}
                            index={i}
                            expandedIndex={expandedIndex}
                            setExpandedIndex={setExpandedIndex}
                            collapsed={collapsed} // ✅ teruskan ke child
                        />
                    ))}
                </div>
            )}
        </div>
    );
}



