"use client";

import clsx from "clsx";
import type { IconType } from "react-icons";

interface Props {
    icon: IconType;
    label: string;
    badge?: string;
    onClick?: () => void;
}

export function DropdownItem({
                                 icon: Icon,
                                 label,
                                 badge,
                                 onClick,
                             }: Props) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "w-full flex items-center justify-between",
                "px-4 py-2.5 text-sm text-gray-700",
                "hover:bg-gray-100 transition-colors"
            )}
        >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">
                <Icon size={18} className="text-gray-500" />
                <span className="text-left">{label}</span>
            </div>

            {/* BADGE */}
            {badge && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
            )}
        </button>
    );
}
