//Files: src/modules/teacher/domain/dto/UpdateTeacherDTO.ts

import {TeacherRoleLiteral} from "@/modules/teacher/domain/constants/TeacherRole";

export interface UpdateTeacherDTO {
    id: string;
    nip: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    roles: TeacherRoleLiteral[];
}
