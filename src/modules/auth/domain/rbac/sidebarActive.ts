//Files: src/modules/auth/domain/rbac/sidebarActive.ts

import { SidebarMenuItem } from "./roleMenuPolicy";

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
