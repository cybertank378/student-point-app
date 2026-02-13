//Files: src/modules/auth/domain/entity/PasswordResetToken.ts

export class PasswordResetToken {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly tokenHash: string,
        public readonly expiresAt: Date,
        public readonly used: boolean,
    ) {}
}