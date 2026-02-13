//Files: src/modules/auth/domain/rbac/menuFilter.ts

import { Permission } from "./permissions";
import { SidebarMenuItem } from "./roleMenuPolicy";

/**
 * Recursively filter sidebar menu based on permissions.
 */
export function filterMenuByPermission(
    menu: SidebarMenuItem[],
    permissions: Permission[]
): SidebarMenuItem[] {
    return menu
        .filter((item) => {
            // If item has permission, check it
            if (item.permission) {
                return permissions.includes(item.permission);
            }

            // No permission required → allow
            return true;
        })
        .map((item) => {
            if (item.children && item.children.length > 0) {
                const filteredChildren = filterMenuByPermission(
                    item.children,
                    permissions
                );

                return {
                    ...item,
                    children: filteredChildren,
                };
            }

            return item;
        })
        .filter((item) => {
            // Remove parent if all children removed
            if (item.children) {
                return item.children.length > 0;
            }
            return true;
        });
}
