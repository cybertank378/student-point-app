import { NextResponse } from "next/server";
import type { Result } from "@/modules/shared/core/Result";

export class HttpResultHandler {

    static handle<T>(
        result: Result<T>,
        successStatus = 200
    ) {

        if (result.isFailure) {

            const error = result.error!;

            // Log once, centrally
            console.error("HTTP RESULT FAILURE:", error);

            return NextResponse.json(
                error.toJSON(),
                { status: error.statusCode }
            );



        }

        const value = result.getValue();

        return NextResponse.json(
            value ?? { success: true },
            { status: successStatus }
        );
    }
}