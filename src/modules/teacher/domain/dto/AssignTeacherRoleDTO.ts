//Files: src/modules/teacher/domain/dto/AssignTeacherRoleDTO.ts
import {TeacherRoleLiteral} from "@/modules/teacher/domain/constants/TeacherRole";

export interface AssignTeacherRoleDTO {
    teacherId: string;
    roles: TeacherRoleLiteral[];
}