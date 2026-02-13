//Files: src/modules/auth/domain/entity/AuthSession.ts

export class AuthSession {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly tokenHash: string,
        public readonly expiresAt: Date,
        public readonly revoked: boolean,
    ) {}
}