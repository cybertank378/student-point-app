//Files: src/modules/shared/errors/DomainError.ts

export abstract class DomainError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean = true;

    protected constructor(
        message: string,
        statusCode: number,
    ) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
