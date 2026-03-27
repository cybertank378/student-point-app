//Files: src/modules/user/domain/dto/CreateUserDTO.ts
import {Role, TeacherRole} from "@/libs/utils/enums";

export interface CreateUserDTO {
    readonly role: Exclude<Role, "ADMIN">;
    readonly referenceId: string;
    readonly teacherRole?: TeacherRole;
}

