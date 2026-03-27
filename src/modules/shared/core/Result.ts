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
import { AppError } from "@/modules/shared/errors/AppError";

export class Result<T> {

    public readonly isSuccess: boolean;
    public readonly isFailure: boolean;
    private readonly _value?: T;
    public readonly error?: AppError;

    private constructor(
        isSuccess: boolean,
        error?: AppError,
        value?: T
    ) {
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = error;
        this._value = value;
    }

    public getValue(): T {
        if (!this.isSuccess) {
            throw new Error("Cannot get value of a failed result.");
        }
        return this._value as T;
    }

    public static ok<T>(value: T): Result<T> {
        return new Result<T>(true, undefined, value);
    }

    public static fail<T>(error: AppError): Result<T> {
        return new Result<T>(false, error);
    }
}