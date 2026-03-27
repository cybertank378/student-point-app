import type { TeacherRole, Role } from "@/libs/utils/enums";

export interface UpdateUserDTO {
    readonly id: string;
    readonly password?: string;
    readonly role: Role;
    readonly teacherRole: TeacherRole | null;
    readonly image?: string | null;
    readonly isActive: boolean;
}
