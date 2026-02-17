//Files: src/modules/user/infrastructure/http/UploadController.ts

import { NextResponse } from "next/server";
import type { UserService } from "@/modules/user/application/services/UserServices";
import {serverLog} from "@/libs/serverLogger";

/**
 * =========================================================
 * UploadController
 * =========================================================
 *
 * Responsible for:
 * - Parsing multipart form
 * - Validating file existence
 * - Delegating to UserService
 */
export class UploadController {
    constructor(
        private readonly userService: UserService
    ) {}

    async upload(req: Request, userId: string) {
        try {
            const formData = await req.formData();
            const file = formData.get("file") as File | null;

            if (!file) {
                return NextResponse.json(
                    { message: "File tidak ditemukan." },
                    { status: 400 }
                );
            }

            const result =
                await this.userService.uploadUserImage(
                    userId,
                    file
                );

            if (result.isFailure) {
                return NextResponse.json(
                    { message: result.getError() },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                result.getValue(),
                { status: 200 }
            );
        } catch (error) {
            serverLog("UPLOAD CONTROLLER ERROR:", error);
            return NextResponse.json(
                { message: "Gagal upload file." },
                { status: 500 }
            );
        }
    }
}

