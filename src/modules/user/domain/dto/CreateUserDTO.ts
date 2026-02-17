//Files: src/modules/user/domain/dto/CreateUserDTO.ts
import type {TeacherRole, UserRole} from "@/libs/utils";

export interface CreateUserDTO {
    readonly role: Exclude<UserRole, "ADMIN">;
    readonly referenceId: string;
    readonly teacherRole?: TeacherRole;
}

