//Files: src/modules/user/domain/dto/CreateUserDTO.ts

import {Role, TeacherRole} from "@/generated/prisma";

export interface CreateUserDTO {
    username: string;
    password: string;
    role: Role;
    teacherRoles?: TeacherRole[]; // hanya jika role = TEACHER
}
