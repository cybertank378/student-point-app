import type { Role } from "@/libs/utils/enums";
import { canAccess } from "@/security/fieldGuard";
import { rbacConfig, type SidebarNode } from "@/security/rbacConfig";

/* ============================================================
 TYPE GUARD
 ============================================================ */

function isSidebarItem(item: SidebarNode | null): item is SidebarNode {
  return item !== null;
}

/* ============================================================
 ROLE CHECK
 ============================================================ */

function canAccessRole(role: Role, roles?: readonly Role[]) {
  if (!roles) return true;

  return roles.includes(role);
}

/* ============================================================
 GENERATE SIDEBAR
 ============================================================ */

export function generateSidebar(role: Role): SidebarNode[] {
  return rbacConfig.sidebar
    .map<SidebarNode | null>((item) => {
      /* ================= ROLE CHECK ================= */

      if (!canAccessRole(role, item.roles)) {
        return null;
      }

      /* ================= PERMISSION CHECK ================= */

      if (item.permission && !canAccess(role, item.permission)) {
        return null;
      }

      /* ================= CHILDREN ================= */

      if (item.children) {
        const filteredChildren = item.children.filter((child) => {
          if (!canAccessRole(role, child.roles)) {
            return false;
          }

          if (child.permission && !canAccess(role, child.permission)) {
            return false;
          }

          return true;
        });

        if (filteredChildren.length === 0) return null;

        return { ...item, children: filteredChildren };
      }

      return item;
    })
    .filter(isSidebarItem);
}
