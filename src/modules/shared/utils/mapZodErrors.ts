//Files: src/modules/shared/utils/mapZodErrors.ts
import type { ZodError } from "zod";

export function mapZodErrors(
    error: ZodError
): Record<string, string> {
    const formatted: Record<string, string> = {};

    for (const issue of error.issues) {
        const field = issue.path[0];

        // pastikan hanya ambil field-level error
        if (typeof field === "string" && !formatted[field]) {
            formatted[field] = issue.message;
        }
    }

    return formatted;
}