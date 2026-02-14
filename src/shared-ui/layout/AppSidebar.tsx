// src/shared-ui/layout/AppSidebar.tsx
// src/shared-ui/layout/AppSidebar.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useSidebarMenu } from "@/sections/sidebar/hooks/useSidebarMenu";
import { RecursiveSidebarItem } from "@/sections/sidebar/components/RecursiveSidebarItem";
import type { UserRole } from "@/libs/utils";
import { MdMenu } from "react-icons/md";
import Button from "@/shared-ui/component/Button";

interface Props {
  role: UserRole;
  collapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function AppSidebar({
  role,
  collapsed = false,
  onToggleSidebar,
}: Props) {
  const menu = useSidebarMenu(role);

  // 🔥 Parent ke-2 otomatis expand
  const [expandedIndex, setExpandedIndex] = useState<number | null>(1);

  return (
    <aside
      className={`bg-[#282A42] text-[#D8D8EE] min-h-screen transition-all duration-300 ${
        collapsed ? "w-[80px]" : "w-[260px]"
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4">
        <div className="flex items-center">
          <Image
            src="/assets/images/logo/logo.png"
            alt="Logo"
            width={32}
            height={32}
          />

          {!collapsed && (
            <span className="ml-3 font-semibold">SMP Negeri 29</span>
          )}
        </div>

        {onToggleSidebar && (
          <Button
            type="button"
            variant="text"
            color="secondary"
            onClick={onToggleSidebar}
            iconOnly
            className="opacity-70 hover:opacity-100"
          >
            <MdMenu />
          </Button>
        )}
      </div>

      <nav className="px-3 space-y-1">
        {menu.map((item, index) => (
          <RecursiveSidebarItem
            key={item.label}
            item={item}
            index={index}
            expandedIndex={expandedIndex}
            setExpandedIndex={setExpandedIndex}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </aside>
  );
}
