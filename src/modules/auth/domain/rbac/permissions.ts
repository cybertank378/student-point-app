//Files: src/modules/auth/domain/rbac/permissions.ts
export const PERMISSIONS = {
    DASHBOARD_VIEW: "dashboard.view",

    USER_READ: "user.read",
    USER_MANAGE: "user.manage",

    TEACHER_READ: "teacher.read",
    TEACHER_MANAGE: "teacher.manage",

    STUDENT_READ: "student.read",
    STUDENT_MANAGE: "student.manage",

    ACADEMIC_YEAR_MANAGE: "academicYear.manage",

    ATTENDANCE_READ: "attendance.read",
    ATTENDANCE_MANAGE: "attendance.manage",

    VIOLATION_READ: "violation.read",
    VIOLATION_MANAGE: "violation.manage",
} as const;

export type Permission =
    (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
