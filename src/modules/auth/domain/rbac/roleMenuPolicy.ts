//Files: src/modules/auth/domain/rbac/roleMenuPolicy.ts

import { IconType } from "react-icons";
import { MdDashboard, MdPeople, MdSchool } from "react-icons/md";
import { Permission, PERMISSIONS } from "@/modules/auth/domain/rbac/permissions";
import { UserRole } from "@/libs/utils";

export interface SidebarMenuItem {
    label: string;
    path?: string;
    icon?: IconType;
    permission?: Permission;
    children?: SidebarMenuItem[];
}

const BASE_MENU: SidebarMenuItem[] = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: MdDashboard,
    },
];

const ROLE_MENU: Record<UserRole, SidebarMenuItem[]> = {
    ADMIN: [
        {
            label: "Pengguna",
            path: "/dashboard/users",
            icon: MdPeople,
            permission: PERMISSIONS.USER_MANAGE,
        },
        {
            label: "Guru",
            path: "/dashboard/teachers",
            icon: MdSchool,
            permission: PERMISSIONS.TEACHER_READ,
        },
    ],
    TEACHER: [],
    STUDENT: [],
    PARENT: [],
};

export function getRoleMenu(role: UserRole): SidebarMenuItem[] {
    return [...BASE_MENU, ...(ROLE_MENU[role] ?? [])];
}
