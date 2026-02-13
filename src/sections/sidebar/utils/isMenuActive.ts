//Files: src/sections/sidebar/utils/isMenuActive.ts

import { SidebarMenuItem } from "@/modules/auth/domain/rbac/roleMenuPolicy";

/**
 * Recursively check if a menu or its children is active
 */
export function isMenuActive(
    item: SidebarMenuItem,
    pathname: string
): boolean {
    if (item.path && pathname.startsWith(item.path)) {
        return true;
    }

    if (item.children && item.children.length > 0) {
        return item.children.some((child) =>
            isMenuActive(child, pathname)
        );
    }

    return false;
}
