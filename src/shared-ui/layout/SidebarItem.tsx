//Files: src/shared-ui/layout/SidebarItem.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { SidebarMenuItem } from "@/modules/auth/domain/rbac/roleMenuPolicy";
import type { IconType } from "react-icons";
import { MdKeyboardArrowRight } from "react-icons/md";
import { LuDot } from "react-icons/lu";
import Button from "@/shared-ui/component/Button";

interface Props {
  item: SidebarMenuItem;
  pathname: string;
  forceOpen?: boolean;
  level?: number;
}

export default function SidebarItem({
  item,
  pathname,
  forceOpen = false,
  level = 0,
}: Props) {
  const hasChildren = !!item.children?.length;

  const isActive = (path?: string) => path && pathname.startsWith(path);

  const isChildActive =
    item.children?.some((child) => isActive(child.path)) ?? false;

  const [open, setOpen] = useState(false);

  /**
   * AUTO EXPAND
   */
  useEffect(() => {
    if (isChildActive || forceOpen) {
      setOpen(true);
    }
  }, [isChildActive, forceOpen]);

  const Icon = item.icon as IconType | undefined;

  /**
   * =====================================================
   * CHILD ITEM
   * =====================================================
   */
  if (!hasChildren) {
    const active = isActive(item.path);

    return (
      <Link
        href={item.path ?? "#"}
        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${
          active
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            : "text-gray-400 hover:bg-[#3b3f5c] hover:text-white"
        }`}
      >
        {/* DOT ICON untuk child */}
        {level > 0 && (
          <LuDot
            size={18}
            className={`${active ? "text-white" : "text-gray-500"}`}
          />
        )}

        {/* Icon hanya untuk parent level 0 tanpa children */}
        {level === 0 && Icon && <Icon size={18} />}

        <span>{item.label}</span>
      </Link>
    );
  }

  /**
   * =====================================================
   * PARENT ITEM
   * =====================================================
   */
  return (
    <div>
      <Button
        type="button"
        variant="text"
        color="secondary"
        onClick={() => setOpen(!open)}
        className={`w-full !justify-between px-4 py-2 text-sm rounded-lg transition-all ${
          isChildActive
            ? "bg-[#3b3f5c] !text-white"
            : "!text-gray-400 hover:bg-[#3b3f5c] hover:!text-white"
        }`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} />}
          <span>{item.label}</span>
        </div>

        <MdKeyboardArrowRight
          size={18}
          className={`transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        />
      </Button>

      {open && (
        <div className="ml-6 mt-1 space-y-1">
          {item.children!.map((child) => (
            <SidebarItem
              key={child.label}
              item={child}
              pathname={pathname}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
