//Files: src/modules/teacher/domain/domain/dto/CreateTeacherDTO.ts
import {TeacherRoleLiteral} from "@/modules/teacher/domain/constants/TeacherRole";

export interface CreateTeacherDTO {
    userId: string;
    nip: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    roles: TeacherRoleLiteral[];
}
