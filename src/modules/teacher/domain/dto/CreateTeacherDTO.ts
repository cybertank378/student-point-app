//Files: src/modules/teacher/domain/domain/dto/CreateTeacherDTO.ts

import {TeacherRole} from "@/libs/utils";

export interface CreateTeacherDTO {
    userId: string;
    nip: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    roles: TeacherRole[];
}
