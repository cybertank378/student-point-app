//Files: src/sections/sidebar/hooks/useSidebarMenu.ts
"use client";

import { useMemo } from "react";
import type { UserRole } from "@/libs/utils";
import {
    getRolePermissions, rbacConfig,
    type SidebarNode,
} from "@/modules/auth/domain/rbac/rbacConfig";
import type {Permission} from "@/modules/auth/domain/rbac/permissions";

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

/* ============================================================
   HOOK
============================================================ */

export function useSidebarMenu(role: UserRole) {

    return useMemo(() => {

        const permissions =
            getRolePermissions(role);

        return filterMenu(
            rbacConfig.sidebar,
            permissions
        );

    }, [role]);
}

