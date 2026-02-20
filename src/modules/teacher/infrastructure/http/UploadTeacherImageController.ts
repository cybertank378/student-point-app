//Files: src/modules/teacher/infrastructure/http/UploadTeacherImageController.ts

import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import type { TeacherService } from "@/modules/teacher/application/services/TeacherService";
import type { UploadTeacherImageRequest } from "@/modules/teacher/application/usecase/UploadTeacherImageUseCase";

/**
 * ============================================================
 * UPLOAD TEACHER CONTROLLER
 * ============================================================
 *
 * HTTP Adapter for handling teacher image upload.
 *
 * ------------------------------------------------------------
 * RESPONSIBILITIES
 * ------------------------------------------------------------
 * 1. Parse multipart/form-data request
 * 2. Perform HTTP-level validation only
 * 3. Delegate execution to Application Layer (TeacherService)
 * 4. Standardize HTTP response via HttpResultHandler
 *
 * ------------------------------------------------------------
 * ARCHITECTURE PRINCIPLES
 * ------------------------------------------------------------
 * - No business logic inside controller
 * - No database access
 * - No filesystem access
 * - No Result.Fail handling here
 * - Business validation handled in UseCase
 * - Error wrapping handled by BaseUseCase
 *
 * Strictly an HTTP transport adapter.
 * ============================================================
 */
export class UploadTeacherImageController {
    constructor(
        private readonly teacherService: TeacherService
    ) {}

    /**
     * Handle teacher image upload.
     *
     * @param req        Incoming HTTP request (multipart/form-data)
     * @param teacherId  Teacher ID (from route params)
     */
    async upload(req: Request, teacherId: string) {

        /* =========================================================
           1️⃣ Parse multipart form data
        ========================================================= */

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        /* =========================================================
           2️⃣ HTTP-Level Validation (Transport Only)
        ========================================================= */

        if (!file) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "File tidak ditemukan.",
                }),
                { status: 400 }
            );
        }

        /* =========================================================
           3️⃣ Delegate to Application Layer
        ========================================================= */

        const request: UploadTeacherImageRequest = {
            teacherId,
            file,
        };

        const result = await this.teacherService.uploadTeacherImage(request);

        /* =========================================================
           4️⃣ Standardized HTTP Response
        ========================================================= */

        return HttpResultHandler.handle(result);
    }
}