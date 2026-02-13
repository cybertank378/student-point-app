//Files: src/sections/sidebar/components/SidebarGroup.tsx

import { SidebarMenuItem } from "@/modules/auth/domain/rbac/roleMenuPolicy";
import { RecursiveSidebarItem } from "./RecursiveSidebarItem";

interface SidebarGroupProps {
    title?: string;
    items: SidebarMenuItem[];
}

export function SidebarGroup({ title, items }: SidebarGroupProps) {
    return (
        <div className="space-y-2">
            {title && (
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                    {title}
                </p>
            )}

            {items.map((item) => (
                <RecursiveSidebarItem key={item.label} item={item} />
            ))}
        </div>
    );
}
