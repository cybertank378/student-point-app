//Files: src/modules/shared/core/Result.ts

export class Result<T> {
    public isSuccess: boolean;
    public isFailure: boolean;
    private readonly _error: string | null;
    private readonly _value: T | null;

    private constructor(isSuccess: boolean, error?: string, value?: T) {
        if (isSuccess && error) {
            throw new Error(
                "InvalidOperation: successful result cannot contain error",
            );
        }
        if (!isSuccess && !error) {
            throw new Error(
                "InvalidOperation: failure result must contain error message",
            );
        }

        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this._error = error ?? null;
        this._value = value ?? null;
    }

    public getValue(): T {
        if (!this.isSuccess) {
            throw new Error("Cannot get value from failed result");
        }
        return this._value as T;
    }

    public getError(): string | null {
        return this._error;
    }

    public static ok<U>(value?: U): Result<U> {
        return new Result<U>(true, undefined, value);
    }

    public static fail<U>(error: string): Result<U> {
        return new Result<U>(false, error);
    }
}