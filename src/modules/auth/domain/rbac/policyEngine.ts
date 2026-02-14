//Files: src/modules/auth/domain/rbac/policyEngine.ts
import { UserRole } from "@/libs/utils";
import {
    getRolePermissions,
    rbacConfig,
} from "@/modules/auth/domain/rbac/rbacConfig";
import { auditLog } from "@/modules/shared/audit/auditLogger";

/* ============================================================
   POLICY INPUT
============================================================ */

interface PolicyInput {
    path: string;
    method: string;
    role: UserRole;
}

/* ============================================================
   MATCH API BASE ROUTE
============================================================ */

function matchApiRoute(
    path: string
): keyof typeof rbacConfig.api | undefined {
    return (
        Object.keys(rbacConfig.api) as Array<
            keyof typeof rbacConfig.api
        >
    ).find(
        (base) =>
            path === base ||
            path.startsWith(base + "/")
    );
}

/* ============================================================
   POLICY EVALUATION
============================================================ */

export function evaluatePolicy({
                                   path,
                                   method,
                                   role,
                               }: PolicyInput): boolean {
    const permissions = getRolePermissions(role);
    let allowed = false;

    /* ================= DASHBOARD ================= */

    if (path.startsWith("/dashboard")) {
        const required =
            rbacConfig.dashboard[
                path as keyof typeof rbacConfig.dashboard
                ];

        if (required) {
            allowed = permissions.includes(required);
        }
    }

    /* ================= API ================= */

    else if (path.startsWith("/api")) {
        const base = matchApiRoute(path);

        if (base) {
            const routePolicy = rbacConfig.api[base];

            const required =
                routePolicy[
                    method.toUpperCase() as keyof typeof routePolicy
                    ];

            if (required) {
                allowed = permissions.includes(required);
            }
        }
    }

    /* ================= AUDIT LOG ================= */

    auditLog(allowed ? "ALLOW" : "DENY", {
        role,
        path,
        method,
    });

    return allowed;
}




