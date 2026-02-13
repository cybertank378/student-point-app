//Files: src/modules/auth/domain/rbac/rolePermissionPolicy.ts
import { UserRole, TeacherRole } from "@/libs/utils";
import { PERMISSIONS, Permission } from "./permissions";

/**
 * =====================================================
 * PERMISSION RESOLVER (FULLY CENTRALIZED)
 * =====================================================
 *
 * - Role → Base permission
 * - TeacherRole → Extra scoped permission
 * - Secure by default
 */

export function getPermissions(
    role: UserRole,
    teacherRole?: TeacherRole
): Permission[] {
    switch (role) {
        /**
         * =====================================================
         * ADMIN → FULL ACCESS
         * =====================================================
         */
        case "ADMIN":
            return Object.values(PERMISSIONS);

        /**
         * =====================================================
         * TEACHER → BASE + SPECIALIZATION
         * =====================================================
         */
        case "TEACHER": {
            const base: Permission[] = [
                PERMISSIONS.DASHBOARD_VIEW,
                PERMISSIONS.STUDENT_READ,
            ];

            if (!teacherRole) {
                return base;
            }

            switch (teacherRole) {
                /**
                 * SUBJECT TEACHER
                 * - Can manage attendance
                 * - Can record violations
                 */
                case "SUBJECT_TEACHER":
                    return [
                        ...base,
                        PERMISSIONS.ATTENDANCE_MANAGE,
                        PERMISSIONS.VIOLATION_MANAGE,
                    ];

                /**
                 * HOMEROOM
                 * - Stronger rights
                 */
                case "HOMEROOM":
                    return [
                        ...base,
                        PERMISSIONS.ATTENDANCE_MANAGE,
                        PERMISSIONS.VIOLATION_MANAGE,
                        PERMISSIONS.STUDENT_MANAGE,
                    ];

                /**
                 * COUNSELOR
                 * - Focus on discipline
                 */
                case "COUNSELOR":
                    return [
                        ...base,
                        PERMISSIONS.VIOLATION_READ,
                        PERMISSIONS.VIOLATION_MANAGE,
                    ];

                /**
                 * DUTY TEACHER
                 */
                case "DUTY_TEACHER":
                    return [
                        ...base,
                        PERMISSIONS.ATTENDANCE_MANAGE,
                        PERMISSIONS.VIOLATION_READ,
                    ];

                default:
                    return base;
            }
        }

        /**
         * =====================================================
         * STUDENT
         * =====================================================
         */
        case "STUDENT":
            return [
                PERMISSIONS.DASHBOARD_VIEW,
                PERMISSIONS.ATTENDANCE_READ,
                PERMISSIONS.VIOLATION_READ,
            ];

        /**
         * =====================================================
         * PARENT
         * =====================================================
         */
        case "PARENT":
            return [
                PERMISSIONS.DASHBOARD_VIEW,
                PERMISSIONS.ATTENDANCE_READ,
                PERMISSIONS.VIOLATION_READ,
            ];

        default:
            return [];
    }
}
