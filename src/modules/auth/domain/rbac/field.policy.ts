//Files: src/modules/auth/domain/rbac/field.policy.ts


import {PERMISSIONS} from "@/modules/auth/domain/rbac/permissions";

export const FIELD_POLICY = {
    rombel: {
        grade: [PERMISSIONS.ROMBEL_MANAGE],
        name: [PERMISSIONS.ROMBEL_MANAGE],
        academicYearId: [PERMISSIONS.ROMBEL_MANAGE],
        studentCount: [PERMISSIONS.ROMBEL_MANAGE],
    },

    academicYear: {
        name: [PERMISSIONS.ACADEMIC_YEAR_MANAGE],
        startDate: [PERMISSIONS.ACADEMIC_YEAR_MANAGE],
        endDate: [PERMISSIONS.ACADEMIC_YEAR_MANAGE],
    },
} as const;
