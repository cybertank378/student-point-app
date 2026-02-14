//Files: src/modules/auth/domain/rbac/policy.config.ts

import {PERMISSIONS} from "@/modules/auth/domain/rbac/permissions";

export const POLICY_CONFIG = {
    dashboard: {
        basePermission: PERMISSIONS.DASHBOARD_VIEW,
    },

    api: {
        academicYears: {
            basePath: "/api/academic-years",
            permissions: {
                GET: PERMISSIONS.ACADEMIC_YEAR_MANAGE,
                POST: PERMISSIONS.ACADEMIC_YEAR_MANAGE,
                PUT: PERMISSIONS.ACADEMIC_YEAR_MANAGE,
                DELETE: PERMISSIONS.ACADEMIC_YEAR_MANAGE,
            },
        },

        rombels: {
            basePath: "/api/rombels",
            permissions: {
                GET: PERMISSIONS.ROMBEL_READ,
                POST: PERMISSIONS.ROMBEL_MANAGE,
                PUT: PERMISSIONS.ROMBEL_MANAGE,
                DELETE: PERMISSIONS.ROMBEL_MANAGE,
            },
        },
    },
} as const;
