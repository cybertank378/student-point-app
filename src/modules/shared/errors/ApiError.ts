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
	let data: any = null;

	try {
		data = await res.json();
	} catch {
		// body kosong / bukan JSON → abaikan, pakai fallback
	}

	const message =
		data?.message || data?.error || `Request failed with status ${res.status}`;

	return {
		message,
		code: typeof data?.code === "number" ? data.code : undefined,
		statusCode:
			typeof data?.statusCode === "number" ? data.statusCode : res.status,
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
		// lempar ApiError dari helper shared
		throw await parseError(res);
	}

	const json = (await res.json()) as unknown;

	if (json && typeof json === "object" && "_value" in json) {
		const wrapped = json as { _value: T | null | undefined };
		return (wrapped._value as T) ?? ({} as T);
	}

	return json as T;
};
