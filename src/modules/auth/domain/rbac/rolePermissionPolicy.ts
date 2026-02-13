//Files: src/modules/auth/domain/rbac/rolePermissionPolicy.ts
import { UserRole, TeacherRole } from "@/libs/utils";
import { PERMISSIONS, Permission } from "./permissions";

export function getPermissions(
    role: UserRole,
    teacherRole?: TeacherRole
): Permission[] {
    switch (role) {
        case "ADMIN":
            return Object.values(PERMISSIONS);

        case "TEACHER":
            return [
                PERMISSIONS.DASHBOARD_VIEW,
                PERMISSIONS.STUDENT_READ,
                PERMISSIONS.ATTENDANCE_MANAGE,
                PERMISSIONS.VIOLATION_MANAGE,
            ];

        case "STUDENT":
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
