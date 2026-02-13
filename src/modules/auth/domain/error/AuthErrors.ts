//Files: src/modules/shared/errors/domain/AuthErrors.ts

import {DomainError} from "@/modules/shared/errors/DomainError";

export class InvalidCredentialsError extends DomainError {
    constructor() {
        super("Email atau kata sandi tidak valid", 401);
    }
}

export class AccountLockedError extends DomainError {
    constructor(until: Date) {
        super(
            `Akun terkunci sampai ${until.toISOString()}`,
            423,
        );
    }
}

export class UserNotFoundError extends DomainError {
    constructor() {
        super("Pengguna tidak ditemukan", 404);
    }
}

export class InvalidResetTokenError extends DomainError {
    constructor() {
        super("Token reset tidak valid atau sudah kedaluwarsa", 400);
    }
}

export class InvalidOldPasswordError extends DomainError {
    constructor() {
        super("Kata sandi lama tidak valid", 400);
    }
}

