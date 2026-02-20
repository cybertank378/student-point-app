// Files: src/modules/user/infrastructure/http/UploadController.ts

import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import type { UserService } from "@/modules/user/application/services/UserServices";
import type { UploadUserImageRequest } from "@/modules/user/application/usecase/UploadUserImageUseCase";

/**
 * ============================================================
 * UPLOAD CONTROLLER
 * ============================================================
 *
 * HTTP Adapter for handling user image upload.
 *
 * ------------------------------------------------------------
 * RESPONSIBILITIES
 * ------------------------------------------------------------
 * 1. Parse multipart/form-data request
 * 2. Perform HTTP-level validation only
 * 3. Delegate execution to the Application Layer (UserService)
 * 4. Standardize HTTP response via HttpResultHandler
 *
 * ------------------------------------------------------------
 * ARCHITECTURE PRINCIPLES
 * ------------------------------------------------------------
 * - No business logic inside controller
 * - No database access
 * - No filesystem access
 * - No Result. Fail usage here
 * - Business validation handled in UseCase
 * - Error wrapping handled by BaseUseCase
 *
 * This class is strictly an HTTP transport adapter.
 * ============================================================
 */
export class UploadController {
    constructor(
        private readonly userService: UserService
    ) {}

    /**
     * Handle upload request.
     *
     * @param req     Incoming HTTP request (multipart/form-data)
     * @param userId  Authenticated user ID (from auth middleware)
     *
     * Flow:
     * 1. Extract file from formData
     * 2. Validate transport-level requirements
     * 3. Call UserService
     * 4. Return standardized HTTP response
     */
    async upload(req: Request, userId: string) {

        /* =========================================================
           1️⃣ Parse multipart form data
        ========================================================= */

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        /* =========================================================
           2️⃣ HTTP-Level Validation
           (Transport validation only, not business rule)
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

        const request: UploadUserImageRequest = {
            userId,
            file,
        };

        const result =
            await this.userService.uploadUserImage(request);

        /* =========================================================
           4️⃣ Standardized HTTP Response
        ========================================================= */

        return HttpResultHandler.handle(result);
    }
}