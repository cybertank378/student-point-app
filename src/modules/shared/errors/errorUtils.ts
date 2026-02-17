//Files: src/modules/shared/errors/errorUtils.ts

import type { ApiError } from "@/modules/shared/errors/ApiError";

/**
 * Extract best possible message from ApiError
 */
export const getErrorMessage = (
    error?: ApiError | null
): string => {
    if (!error) {
        return "Terjadi kesalahan.";
    }

    // Field validation error (Zod)
    if (error.fieldErrors) {
        const firstField = Object.values(error.fieldErrors)[0];

        if (
            Array.isArray(firstField) &&
            typeof firstField[0] === "string"
        ) {
            return firstField[0];
        }
    }

    return error.message;
};

/**
 * Extract field-level errors for forms
 */
export const getFieldErrors = (
    error?: ApiError | null
): Record<string, string[]> => {
    if (!error?.fieldErrors) return {};
    return error.fieldErrors;
};
