// src/modules/shared/errors/ApiError.ts
export interface ApiError {
	/** Pesan yang bisa langsung ditampilkan ke user */
	message: string;

	/** Application / business error code (opsional) */
	code?: number;

	/** HTTP status code (opsional) */
	statusCode?: number;

	/** Payload mentah / detail lain dari server */
	details?: unknown;
}

/**
 * Parse Response → ApiError (dipakai di semua hook)
 */
export const parseError = async (res: Response): Promise<ApiError> => {
    let data: unknown = null;

    const contentType = res.headers.get("content-type");

    try {
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
            ? (data as Record<string, unknown>)
            : {};

    const message =
        typeof record.message === "string"
            ? record.message
            : typeof record.error === "string"
                ? record.error
                : `Request failed with status ${res.status}`;

    return {
        message,
        code: typeof record.code === "number" ? record.code : undefined,
        statusCode:
            typeof record.statusCode === "number"
                ? record.statusCode
                : res.status,
        details: data ?? undefined,
    };
};


/**
 * Helper internal: ekstrak message/code/statusCode dari unknown object
 */
type ErrorLike = {
	message?: unknown;
	code?: unknown;
	statusCode?: unknown;
};

const extractFromUnknown = (
	err: unknown,
): Pick<ApiError, "message" | "code" | "statusCode"> | null => {
	if (!err || typeof err !== "object") return null;

	const { message, code, statusCode } = err as ErrorLike;

	if (typeof message !== "string") return null;

	return {
		message,
		code: typeof code === "number" ? code : undefined,
		statusCode: typeof statusCode === "number" ? statusCode : undefined,
	};
};

/**
 * Konversi unknown error → ApiError (buat dipakai di catch blok)
 */
export const toApiError = (err: unknown, fallbackMessage: string): ApiError => {
	const extracted = extractFromUnknown(err);
	if (extracted) {
		return {
			...extracted,
			details: err,
		};
	}

	if (err instanceof Error) {
		return {
			message: err.message,
			details: err,
		};
	}

	return {
		message: fallbackMessage,
		details: err,
	};
};

/**
 * Helper: parse JSON, sekaligus handle format:
 * - { _value: T }
 * - T langsung
 */
export const safeJson = async <T>(res: Response): Promise<T> => {
    if (!res.ok) {
        throw await parseError(res);
    }

    const contentType = res.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
        throw {
            message: "Server returned non-JSON response",
            statusCode: res.status,
        } satisfies ApiError;
    }

    const json = (await res.json()) as unknown;

    if (json && typeof json === "object" && "_value" in json) {
        const wrapped = json as { _value: T | null | undefined };
        return (wrapped._value as T) ?? ({} as T);
    }

    return json as T;
};
