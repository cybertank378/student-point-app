import type { TeacherRole, UserRole } from "@/libs/utils";

export interface UpdateUserDTO {
    readonly id: string;
    readonly password?: string;
    readonly role: UserRole;
    readonly teacherRole: TeacherRole | null;
    readonly image?: string | null;
    readonly isActive: boolean;
}
