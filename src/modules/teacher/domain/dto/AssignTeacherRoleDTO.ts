//Files: src/modules/teacher/domain/dto/AssignTeacherRoleDTO.ts

import type { TeacherRole } from "@/generated/prisma";

/**
 * ============================================================
 * ASSIGN TEACHER ROLE DTO
 * ============================================================
 *
 * Supports both single and bulk operations.
 * Single assignment = teacherIds.length === 1
 * Bulk assignment   = teacherIds.length > 1
 */
export interface AssignTeacherRoleDTO {
    readonly teacherIds: string[];
    readonly roles: TeacherRole[];
}