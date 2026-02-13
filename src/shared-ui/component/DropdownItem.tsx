//Files: src/shared-ui/component/DropdownItem.tsx

import { IconType } from "react-icons";

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
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
        >
            <div className="flex items-center gap-3">
                <Icon size={16} className="text-gray-500" />
                <span>{label}</span>
            </div>

            {badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
            )}
        </button>
    );
}

