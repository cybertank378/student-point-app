//Files: src/modules/auth/domain/rbac/dashboard.policy.ts



import {PERMISSIONS} from "@/modules/auth/domain/rbac/permissions";

export const DASHBOARD_PAGE_POLICY: Record<
    string,
    string
> = {
    "/dashboard/academic-years":
    PERMISSIONS.ACADEMIC_YEAR_MANAGE,

    "/dashboard/rombels":
    PERMISSIONS.ROMBEL_READ,

    "/dashboard/users":
    PERMISSIONS.USER_MANAGE,
};
