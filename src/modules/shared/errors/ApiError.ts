// src/modules/shared/errors/ApiError.ts

export interface ApiError {
    /** Pesan yang bisa langsung ditampilkan ke user */
    message: string;

    /** Application / business error code (opsional) */
    code?: number;

    /** HTTP status code (selalu ada) */
    statusCode: number;

    /** Zod field validation errors */
    fieldErrors?: Record<string, string[]>;

    /** Raw payload */
    details?: unknown;
}

/**
 * Parse Response → ApiError
 */
export const parseError = async (
    res: Response
): Promise<ApiError> => {
    let data: unknown = null;

    try {
        const contentType = res.headers.get("content-type");

        if (contentType?.includes("application/json")) {
            data = await res.json();
        } else {
            const text = await res.text();
            data = { message: text.slice(0, 200) };
        }
    } catch {
        // ignore parsing error
    }

    const record =
        data && typeof data === "object"
            ? (data as Record<string, any>)
            : {};

    /**
     * Extract Zod fieldErrors if exists
     */
    const fieldErrors =
        record?.details?.fieldErrors ??
        record?.fieldErrors ??
        undefined;

    /**
     * Determine message
     */
    let message: string;

    if (fieldErrors && typeof fieldErrors === "object") {
        const values = Object.values(
            fieldErrors as Record<string, string[]>
        );

        const firstError =
            values.length > 0 && Array.isArray(values[0])
                ? values[0][0]
                : undefined;

        message =
            typeof firstError === "string"
                ? firstError
                : "Validation error";
    } else if (typeof record.message === "string") {
        message = record.message;
    } else if (typeof record.error === "string") {
        message = record.error;
    } else {
        message = `Request failed with status ${res.status}`;
    }

    return {
        message,
        code:
            typeof record.code === "number"
                ? record.code
                : undefined,
        statusCode: res.status,
        fieldErrors,
        details: data ?? undefined,
    };
};

/**
 * Extract error-like object
 */
type ErrorLike = {
    message?: unknown;
    code?: unknown;
    statusCode?: unknown;
    fieldErrors?: unknown;
};

const extractFromUnknown = (
    err: unknown
): ApiError | null => {
    if (!err || typeof err !== "object") return null;

    const e = err as ErrorLike;

    if (typeof e.message !== "string") return null;

    return {
        message: e.message,
        code:
            typeof e.code === "number"
                ? e.code
                : undefined,
        statusCode:
            typeof e.statusCode === "number"
                ? e.statusCode
                : 500,
        fieldErrors:
            typeof e.fieldErrors === "object"
                ? (e.fieldErrors as Record<
                    string,
                    string[]
                >)
                : undefined,
        details: err,
    };
};

/**
 * Convert unknown → ApiError
 */
export const toApiError = (
    err: unknown,
    fallbackMessage: string
): ApiError => {
    const extracted = extractFromUnknown(err);
    if (extracted) return extracted;

    if (err instanceof Error) {
        return {
            message: err.message,
            statusCode: 500,
            details: err,
        };
    }

    return {
        message: fallbackMessage,
        statusCode: 500,
        details: err,
    };
};

/**
 * Safe JSON wrapper
 */
export const safeJson = async <T>(
    res: Response
): Promise<T> => {
    if (!res.ok) {
        throw await parseError(res);
    }

    const contentType = res.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
        throw {
            message:
                "Server returned non-JSON response",
            statusCode: res.status,
        } satisfies ApiError;
    }

    const json = (await res.json()) as unknown;

    if (
        json &&
        typeof json === "object" &&
        "_value" in json
    ) {
        const wrapped = json as {
            _value: T | null | undefined;
        };
        return (wrapped._value as T) ?? ({} as T);
    }

    return json as T;
};
