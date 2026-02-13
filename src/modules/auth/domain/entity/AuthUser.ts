//Files: src/modules/auth/domain/entity/AuthUser.ts

import {Role} from "@/generated/prisma";

export class AuthUser {
    constructor(
        public readonly id: string,
        public readonly username: string,
        public readonly password: string,
        public readonly role: Role,
        public readonly isActive: boolean,
        public readonly failedAttempts: number,
        public readonly lockUntil: Date | null,
        public readonly mustChangePassword: boolean,
    ) {}
}