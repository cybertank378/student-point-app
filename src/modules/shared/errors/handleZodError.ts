//Files: src/modules/shared/errors/handleZodError.ts


import { ZodError } from "zod";

/**
 * Reusable Zod validation error handler
 * Untuk HTTP layer (Controller)
 */
export function handleZodError(error: unknown): Response {
    if (error instanceof ZodError) {
        return Response.json(
            {
                error: "Validation error",
                details: error.flatten(),
            },
            { status: 422 },
        );
    }

    // ❗️ BUKAN zod error → lempar ulang
    throw error;
}
