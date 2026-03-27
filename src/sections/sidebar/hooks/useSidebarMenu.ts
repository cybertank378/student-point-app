//Files: src/sections/sidebar/hooks/useSidebarMenu.ts
"use client";

import {
    type SidebarNode,
} from "@/security/rbacConfig";
import type {Permission} from "@/security/permissions";

/* ============================================================
   RECURSIVE FILTER
============================================================ */

function filterMenu(
    menu: readonly SidebarNode[],
    permissions: Permission[]
): SidebarNode[] {

    return menu
        .map((item) => {

                        if (item.children) {

                const filteredChildren = filterMenu(
                    item.children,
                    permissions
                );

                if (filteredChildren.length === 0) {
                    return null;
                }

                return {
                    ...item,
                    children: filteredChildren,
                };
            }

            // Leaf node
            if (
                item.permission &&
                !permissions.includes(item.permission)
            ) {
                return null;
            }

            return item;
        })
        .filter(
            (item): item is SidebarNode => item !== null
        );
}


