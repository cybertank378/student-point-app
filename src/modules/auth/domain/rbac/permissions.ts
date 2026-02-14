//Files: src/modules/auth/domain/rbac/permissions.ts
export const PERMISSIONS = {
    DASHBOARD_VIEW: "dashboard.view",

    ACADEMIC_YEAR_READ: "academicYear.read",
    ACADEMIC_YEAR_MANAGE: "academicYear.manage",

    ACHIEVEMENT_READ: "achievement.read",
    ACHIEVEMENT_MANAGE: "achievement.manage",

    ATTENDANCE_READ: "attendance.read",
    ATTENDANCE_MANAGE: "attendance.manage",

    ROMBEL_READ: "rombel.read",
    ROMBEL_MANAGE: "rombel.manage",

    RELIGION_READ: "religion.read",
    RELIGION_MANAGE: "religion.manage",

    USER_READ: "user.read",
    USER_MANAGE: "user.manage",

    TEACHER_READ: "teacher.read",
    TEACHER_MANAGE: "teacher.manage",


    STUDENT_READ: "student.read",
    STUDENT_MANAGE: "student.manage",

    VIOLATION_READ: "violation.read",
    VIOLATION_MANAGE: "violation.manage",

    WARNING_LETTER_READ: "warning_letter.read",
    WARNING_LETTER_APPROVE: "warning_letter.approve",

    COUNSELING_READ: "counseling.read",
    COUNSELING_MANAGE: "counseling.manage",

    PARENT_CALL_READ: "parent_call.read",

    REPORT_READ: "report.read",
    REPORT_MANAGE: "report.manage",

} as const;

export type Permission =
    (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
