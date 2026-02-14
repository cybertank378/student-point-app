//Files: src/modules/auth/domain/rbac/policyEngine.ts


import {POLICY_CONFIG} from "@/modules/auth/domain/rbac/policy.config";
import {Permission} from "@/modules/auth/domain/rbac/permissions";
import {DASHBOARD_PAGE_POLICY} from "@/modules/auth/domain/rbac/dashboard.policy";

interface PolicyInput {
    path: string;
    method: string;
    permissions: Permission[];
}

function matchApiRoute(path: string) {
    const configs = Object.values(
        POLICY_CONFIG.api,
    );

    for (const config of configs) {
        if (
            path === config.basePath ||
            path.startsWith(
                config.basePath + "/",
            )
        ) {
            return config;
        }
    }

    return null;
}

export function evaluatePolicy({
                                   path,
                                   method,
                                   permissions,
                               }: PolicyInput): boolean {

    const normalizedMethod =
        method.toUpperCase();

    /* =========================
       DASHBOARD PAGE CHECK
    ========================= */
    if (path.startsWith("/dashboard")) {
        const specificPermission =
            DASHBOARD_PAGE_POLICY[path];

        if (specificPermission) {
            return permissions.includes(
                specificPermission as Permission,
            );
        }

        return permissions.includes(
            POLICY_CONFIG.dashboard
                .basePermission,
        );
    }

    /* =========================
       API CHECK
    ========================= */
    if (path.startsWith("/api")) {
        const config =
            matchApiRoute(path);

        if (!config) return false;

        const required =
            config.permissions[
                normalizedMethod as keyof typeof config.permissions
                ];

        if (!required) return false;

        return permissions.includes(
            required,
        );
    }

    /* =========================
       DEFAULT DENY
    ========================= */
    return false;
}

