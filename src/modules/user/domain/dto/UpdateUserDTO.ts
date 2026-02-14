//Files: src/modules/user/domain/dto/UpdateUserAuthDTO.ts
import type {Role, TeacherRole} from "@/generated/prisma";

export interface UpdateUserDTO {
    id: string;
    username?: string;
    password?: string;
    role?: Role;
    teacherRoles?: TeacherRole[];
    isActive?: boolean;
}