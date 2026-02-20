import { NextResponse } from "next/server";
import type { Result } from "@/modules/shared/core/Result";
import { AppError } from "@/modules/shared/errors/AppError";

export class HttpResultHandler {

    static handle<T>(
        result: Result<T>,
        successStatus = 200
    ) {
        if (!result.isSuccess) {
            console.error("HTTP RESULT FAILURE:", result.getError());
            const error = result.getError();

            // Proper type narrowing
            if (error instanceof AppError) {
                return NextResponse.json(
                    error.toJSON(),
                    { status: error.statusCode }
                );
            }

            // Generic JS Error
            if (error instanceof Error) {
                return NextResponse.json(
                    {
                        message: error.message,
                        code: "INTERNAL_ERROR",
                        statusCode: 500,
                    },
                    { status: 500 }
                );
            }

            // Fallback unknown error
            return NextResponse.json(
                {
                    message: "Internal server error",
                    code: "INTERNAL_ERROR",
                    statusCode: 500,
                },
                { status: 500 }
            );
        }

        const value = result.getValue();

        return NextResponse.json(
            value ?? { success: true },
            { status: successStatus }
        );
    }
}