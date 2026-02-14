//Files: src/modules/auth/domain/entity/AuthUser.ts

import type {TeacherRole, UserRole} from "@/libs/utils";

export class AuthUser {
    constructor(
        public readonly id: string,
        public readonly username: string,
        public readonly password: string,
        public readonly role: UserRole,
        public readonly teacherRole?: TeacherRole, // ← ini wajib optional
        public readonly isActive: boolean = true,
        public readonly failedAttempts: number = 0,
        public readonly lockUntil: Date | null = null,
        public readonly mustChangePassword: boolean = false,
    ) {}
}