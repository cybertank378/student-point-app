// ============================================================
// SMART PATCH BUILDER
// - Only send changed fields
// - Remove empty string
// - Remove null
// - Remove empty array
// ============================================================

export function buildPatchPayload<T extends object>(
    id: string,
    current: T,
    original: T
): { id: string } & Partial<T> {

    const result: Partial<T> = {};

    for (const key in current) {
        const currentValue = current[key];
        const originalValue = original[key];

        // Skip empty values
        if (currentValue === "" || currentValue === null) continue;
        if (Array.isArray(currentValue) && currentValue.length === 0) continue;

        // Only include changed values
        if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
            result[key] = currentValue;
        }
    }

    return {
        id,
        ...result,
    };
}