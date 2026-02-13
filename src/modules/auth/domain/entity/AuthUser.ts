//Files: src/modules/auth/domain/entity/AuthUser.ts

import { Role, TeacherRole } from "@/generated/prisma";

export class AuthUser {
    constructor(
        public readonly id: string,
        public readonly username: string,
        public readonly password: string,
        public readonly role: Role,
        public readonly teacherRole?: TeacherRole, // ← ini wajib optional
        public readonly isActive: boolean = true,
        public readonly failedAttempts: number = 0,
        public readonly lockUntil: Date | null = null,
        public readonly mustChangePassword: boolean = false,
    ) {}
}