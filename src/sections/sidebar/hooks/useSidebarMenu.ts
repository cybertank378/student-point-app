//Files: src/sections/sidebar/hooks/useSidebarMenu.ts
"use client";

import { useMemo } from "react";
import { UserRole, TeacherRole } from "@/libs/utils";
import { getRoleMenu } from "@/modules/auth/domain/rbac/roleMenuPolicy";
import { getPermissions } from "@/modules/auth/domain/rbac/rolePermissionPolicy";
import { filterMenuByPermission } from "@/modules/auth/domain/rbac/menuFilter";
import { SidebarMenuItem } from "@/modules/auth/domain/rbac/roleMenuPolicy";

export function useSidebarMenu(
    role: UserRole,
    teacherRole?: TeacherRole
): SidebarMenuItem[] {
    return useMemo(() => {
        const permissions = getPermissions(role, teacherRole);
        const rawMenu = getRoleMenu(role, teacherRole);
        return filterMenuByPermission(rawMenu, permissions);
    }, [role, teacherRole]);
}
