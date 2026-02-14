//Files: src/modules/teacher/domain/dto/AssignTeacherRoleDTO.ts
import {TeacherRole} from "@/libs/utils";

export interface AssignTeacherRoleDTO {
    teacherId: string;
    roles: TeacherRole[];
}