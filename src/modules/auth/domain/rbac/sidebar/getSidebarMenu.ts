import type { UserRole } from "@/libs/utils";
import {rbacConfig} from "@/modules/auth/domain/rbac/rbacConfig";
import {canAccess} from "@/modules/auth/domain/rbac/fieldGuard";

export function generateSidebar(role: UserRole) {
    return rbacConfig.sidebar
        .map((item) => {
            if (item.permission && !canAccess(role, item.permission)) {
                return null;
            }

            if (item.children) {
                const filteredChildren = item.children.filter(
                    (child) =>
                        !child.permission ||
                        canAccess(role, child.permission)
                );

                if (filteredChildren.length === 0) return null;

                return { ...item, children: filteredChildren };
            }

            return item;
        })
        .filter(Boolean);
}
