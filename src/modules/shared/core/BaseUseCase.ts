//Files: src/modules/shared/core/BaseUseCase.ts

import { Result } from "@/modules/shared/core/Result";

/**
 * ============================================================
 * BASE USE CASE
 * ============================================================
 *
 * Abstract base class for all application use cases.
 *
 * Responsibilities:
 * - Standardized Result<T> response
 * - Centralized error handling
 * - Prevents throwing exceptions outside application layer
 *
 * Pattern:
 *   execute(request) -> Result<Response>
 *
 * All UseCases must extend this class.
 */
export abstract class BaseUseCase<Request, Response> {

    /**
     * Execute the use case safely.
     *
     * Automatically wraps execution in try/catch
     * and converts thrown errors into Result.fail.
     */
    async execute(request: Request): Promise<Result<Response>> {
        try {
            const result = await this.handle(request);
            return Result.ok<Response>(result);
        } catch (error: unknown) {
            return Result.fail<Response>(
                error instanceof Error
                    ? error.message
                    : "Unexpected application error"
            );
        }
    }

    /**
     * Business logic implementation.
     *
     * Must be implemented by concrete use case.
     */
    protected abstract handle(
        request: Request
    ): Promise<Response>;
}
