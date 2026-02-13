//Files: src/modules/teacher/domain/constants/TeacherRole.ts

/**
 * HARUS sinkron dengan enum Prisma TeacherRole
 */
export const TEACHER_ROLES = [
    "SUBJECT_TEACHER",
    "HOMEROOM",
    "COUNSELOR",
    "DUTY_TEACHER",
] as const;

export type TeacherRoleLiteral = typeof TEACHER_ROLES[number];
