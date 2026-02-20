//Files: src/modules/teacher/domain/dto/AssignTeacherRoleDTO.ts

import type { TeacherRole } from "@/generated/prisma";

export interface AssignTeacherRoleDTO {
    teacherId: string;
    roles: TeacherRole[];
}
