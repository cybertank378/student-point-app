//Files: src/modules/shared/http/QueryParams.ts

/**
 * Convert null query param menjadi undefined.
 * Agar kompatibel dengan Zod optional().
 */
export const getQueryParam = (
    value: string | null
): string | undefined => {
    return value ?? undefined;
};
