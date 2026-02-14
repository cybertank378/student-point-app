//Files: src/modules/teacher/domain/dto/UpdateTeacherDTO.ts


import type {TeacherRole} from "@/libs/utils";

export interface UpdateTeacherDTO {
    id: string;
    nip: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    roles: TeacherRole[];
}
