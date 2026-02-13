//src/modules/shared/errors/AppError.ts
/**
 * AppError — centralized custom error handler
 * for all domain, application, and infrastructure layers.
 */

export class AppError extends Error {
	public readonly statusCode: number;
	public readonly code: string;
	public readonly details?: unknown;

	constructor(
		message: string,
		statusCode = 500,
		code = "INTERNAL_ERROR",
		details?: unknown,
	) {
		super(message);
		this.statusCode = statusCode;
		this.code = code;
		this.details = details;

		// Set prototype explicitly (for instanceof to work correctly)
		Object.setPrototypeOf(this, AppError.prototype);
	}

	static badRequest(message = "Bad Request", details?: unknown) {
		return new AppError(message, 400, "BAD_REQUEST", details);
	}

	static notFound(message = "Resource not found", details?: unknown) {
		return new AppError(message, 404, "NOT_FOUND", details);
	}

	static conflict(message = "Conflict detected", details?: unknown) {
		return new AppError(message, 409, "CONFLICT", details);
	}

	static unauthorized(message = "Unauthorized", details?: unknown) {
		return new AppError(message, 401, "UNAUTHORIZED", details);
	}

	static forbidden(message = "Forbidden", details?: unknown) {
		return new AppError(message, 403, "FORBIDDEN", details);
	}

	static internal(message = "Internal server error", details?: unknown) {
		return new AppError(message, 500, "INTERNAL_ERROR", details);
	}

	toJSON() {
		return {
			message: this.message,
			code: this.code,
			statusCode: this.statusCode,
			details: this.details,
		};
	}
}
