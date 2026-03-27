//Files: src/modules/shared/http/validators/BaseValidatedController.ts

import { NextRequest, NextResponse } from "next/server";
import type { ZodSchema } from "zod";

import { handleZodError } from "@/modules/shared/errors/handleZodError";
import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import type { Result } from "@/modules/shared/core/Result";

/**
 * ============================================================
 * BASE VALIDATED CONTROLLER
 * ============================================================
 *
 * Abstract controller that:
 * - Validates request body or query using Zod
 * - Handles Result<T> automatically
 * - Eliminates repetitive try/catch blocks
 *
 * Designed for Next.js App Router.
 *
 * Responsibilities:
 * - Zod validation
 * - Result → HTTP mapping
 *
 * Does NOT:
 * - Contain business logic
 */
export abstract class BaseValidatedController {

    /**
     * Validate JSON body and handle Result automatically.
     */
    protected async validateBodyAndHandle<TSchema, TResult>(
        schema: ZodSchema<TSchema>,
        req: NextRequest,
        handler: (validated: TSchema) => Promise<Result<TResult>>,
        successStatus = 200
    ) {
        try {
            const body = await req.json();
            const parsed = schema.parse(body);

            const result = await handler(parsed);

            return HttpResultHandler.handle(result, successStatus);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /**
     * Validate query parameters and handle Result automatically.
     */
    protected async validateQueryAndHandle<TSchema, TResult>(
        schema: ZodSchema<TSchema>,
        req: NextRequest,
        handler: (validated: TSchema) => Promise<Result<TResult>>,
        successStatus = 200
    ) {
        try {
            const queryObject = Object.fromEntries(
                req.nextUrl.searchParams.entries()
            );

            const parsed = schema.parse(queryObject);

            const result = await handler(parsed);

            return HttpResultHandler.handle(result, successStatus);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /**
     * Handle Result without validation.
     */
    protected async handleResult<TResult>(
        promise: Promise<Result<TResult>>,
        successStatus = 200
    ) {
        const result = await promise;
        return HttpResultHandler.handle(result, successStatus);
    }
}