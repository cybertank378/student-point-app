//Files: src/modules/user/domain/entity/AuthUser.ts
import { Role } from "@/generated/prisma";

export class User {
    constructor(
        public readonly id: string,
        public username: string,
        public password: string,
        public role: Role,
        public isActive: boolean,
        public failedAttempts: number,
        public lockUntil: Date | null,
        public mustChangePassword: boolean,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}

    isLocked(): boolean {
        if (!this.lockUntil) return false;
        return this.lockUntil.getTime() > Date.now();
    }
}
