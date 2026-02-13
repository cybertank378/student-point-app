//Files: src/modules/auth/domain/rbac/getSidebarMenu.ts

import { UserRole, TeacherRole } from "@/libs/utils";
import {getRoleMenu, SidebarMenuItem} from "@/modules/auth/domain/rbac/roleMenuPolicy";
import {getPermissions} from "@/modules/auth/domain/rbac/rolePermissionPolicy";
import {filterMenuByPermission} from "@/modules/auth/domain/rbac/menuFilter";
export function getSidebarMenu(
    role: UserRole,
    teacherRole?: TeacherRole
): SidebarMenuItem[] {
    const permissions = getPermissions(role, teacherRole);
    const menu = getRoleMenu(role);

    return filterMenuByPermission(menu, permissions);
}
