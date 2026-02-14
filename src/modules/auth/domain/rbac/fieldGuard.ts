//Files: src/modules/auth/domain/rbac/fieldGuard.ts
import { UserRole } from "@/libs/utils";
import {Permission} from "@/modules/auth/domain/rbac/permissions";
import {getRolePermissions, rbacConfig} from "@/modules/auth/domain/rbac/rbacConfig";

/* ============================================================
   BASIC PERMISSION CHECK
============================================================ */

export function canAccess(
    role: UserRole,
    required: Permission
): boolean {
    const permissions = getRolePermissions(role);
    return permissions.includes(required);
}

/* ============================================================
   ROUTE GUARD
============================================================ */

export function canAccessRoute(
    role: UserRole,
    path: string
): boolean {
    const required =
        rbacConfig.dashboard[
            path as keyof typeof rbacConfig.dashboard
            ];

    if (!required) return true;

    return canAccess(role, required);
}

/* ============================================================
   FIELD GUARD
============================================================ */

export function canAccessField<
    T extends keyof typeof rbacConfig.fields,
    F extends keyof typeof rbacConfig.fields[T]
>(
    role: UserRole,
    resource: T,
    field: F
): boolean {
    const permissions = getRolePermissions(role);

    const rules =
        rbacConfig.fields[resource][field] as readonly Permission[];

    return rules.some((p) => permissions.includes(p));
}
