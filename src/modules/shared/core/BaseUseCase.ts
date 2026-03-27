//Files: src/modules/shared/core/BaseUseCase.ts
import { Result } from "@/modules/shared/core/Result";
import { AppError } from "@/modules/shared/errors/AppError";

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
 * - Prevents throwing exceptions outside the application layer
 *
 * Pattern:
 *   execute(request?) -> Result<Response>
 */

export abstract class BaseUseCase<Request, Response> {
  async execute(request?: Request): Promise<Result<Response>> {
    try {
      const result = await this.handle(request as Request);

      return Result.ok<Response>(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<Response>(error);
      }

      return Result.fail<Response>(AppError.internal(error instanceof Error ? error.message : "Unexpected application error"));
    }
  }

  protected abstract handle(request: Request): Promise<Response>;
}
