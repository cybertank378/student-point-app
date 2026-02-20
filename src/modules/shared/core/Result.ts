//Files: src/modules/shared/core/Result.ts

/**
 * ============================================================
 * RESULT PATTERN
 * ============================================================
 *
 * Generic wrapper untuk success / failure.
 * Error disimpan sebagai unknown agar bisa berupa:
 * - AppError
 * - DomainError
 * - Error
 * - validation error
 */
export class Result<T> {
    public readonly isSuccess: boolean;
    private readonly error?: unknown;
    private readonly value?: T;

    private constructor(
        isSuccess: boolean,
        value?: T,
        error?: unknown
    ) {
        this.isSuccess = isSuccess;
        this.value = value;
        this.error = error;

        Object.freeze(this);
    }

    public static ok<T>(value?: T): Result<T> {
        return new Result<T>(true, value);
    }

    public static fail<T>(error: unknown): Result<T> {
        return new Result<T>(false, undefined, error);
    }

    public getValue(): T {
        if (!this.isSuccess) {
            throw new Error(
                "Cannot get value from failed Result."
            );
        }
        return this.value as T;
    }

    /**
     * Return raw error (unknown)
     */
    public getError(): unknown {
        return this.error;
    }
}