//Files: src/security/fieldGuard.ts
import type { Role } from "@/libs/utils/enums";
import type { Permission } from "@/security/permissions";
import { getRolePermissions, rbacConfig } from "@/security/rbacConfig";

/* ============================================================
 BASIC PERMISSION CHECK
 ============================================================ */

export function canAccess(role: Role, required: Permission): boolean {
  const permissions = getRolePermissions(role);
  return permissions.includes(required);
}

/* ============================================================
 ROUTE GUARD
 ============================================================ */

export function canAccessRoute(role: Role, path: string) {
  const dashboardRoutes = rbacConfig.dashboard;

  const required = dashboardRoutes[path as keyof typeof dashboardRoutes];

  if (!required) return true;

  return canAccess(role, required);
}

/* ============================================================
 FIELD GUARD
 ============================================================ */

export function canAccessField<T extends keyof typeof rbacConfig.fields, F extends keyof (typeof rbacConfig.fields)[T]>(
  role: Role,
  resource: T,
  field: F
): boolean {
  const permissions = getRolePermissions(role);

  const rules = rbacConfig.fields[resource][field] as readonly Permission[];

  return rules.some((p) => permissions.includes(p));
}
