//Files: src/shared-ui/component/DropdownItem.tsx
// Files: src/shared-ui/component/DropdownItem.tsx

"use client";

import type { IconType } from "react-icons";
import Button from "@/shared-ui/component/Button";
import clsx from "clsx";

interface DropdownItemProps {
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
                             }: DropdownItemProps) {
    return (
        <Button
            variant="text"
            color="secondary"
            size="md"
            fullWidth
            onClick={onClick}
            leftIcon={Icon}
            className={clsx(
                "justify-between px-4 py-2.5 text-sm hover:bg-gray-50"
            )}
        >
            <span>{label}</span>

            {badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
            )}
        </Button>
    );
}
