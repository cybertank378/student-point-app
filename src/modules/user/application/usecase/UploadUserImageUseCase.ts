// Files: src/modules/user/application/usecase/UploadUserImageUseCase.ts

import path from "path";
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";
import type { FileStorageInterface } from "@/modules/user/domain/interfaces/FileStorageInterface";
import { resolveUserUploadMeta } from "@/libs/utils";

/**
 * ============================================================
 * UPLOAD USER IMAGE USE CASE
 * ============================================================
 *
 * Responsible for:
 * - Validating user existence
 * - Resolving dynamic upload folder (based on role)
 * - Generating deterministic file name (NIS/NIP/Username)
 * - Replacing old file automatically
 * - Delegating physical storage to FileStorageInterface
 *
 * Pattern:
 *   execute({ userId, file }) -> Result<{ fileName: string }>
 *
 * Extends:
 *   BaseUseCase<UploadUserImageRequest, { fileName: string }>
 *
 * Notes:
 * - No direct Result handling (handled by BaseUseCase)
 * - No infrastructure coupling
 * - Fully Clean Architecture compliant
 */

export interface UploadUserImageRequest {
    userId: string;
    file: File;
}

export class UploadUserImageUseCase extends BaseUseCase<
    UploadUserImageRequest,
    { fileName: string }
> {
    constructor(
        private readonly repo: UserInterface,
        private readonly storage: FileStorageInterface
    ) {
        super();
    }

    /**
     * ============================================================
     * BUSINESS LOGIC
     * ============================================================
     *
     * Steps:
     * 1. Ensure user exists
     * 2. Resolve folder & identity
     * 3. Generate deterministic filename
     * 4. Replace old file (safe delete)
     * 5. Save new file
     *
     * Any thrown Error will be handled by BaseUseCase.execute()
     */
    protected async handle(
        request: UploadUserImageRequest
    ): Promise<{ fileName: string }> {

        const { userId, file } = request;

        /* =========================================================
           BASIC VALIDATION
        ========================================================= */

        if (!userId) {
            throw new Error("User ID wajib diisi.");
        }

        if (!file) {
            throw new Error("File tidak ditemukan.");
        }

        /* =========================================================
           1️⃣ Ensure user exists
        ========================================================= */

        const user = await this.repo.findById(userId);

        if (!user) {
            throw new Error("User tidak ditemukan.");
        }

        /* =========================================================
           2️⃣ Resolve folder & identity
        ========================================================= */

        const { roleFolder, identity } =
            resolveUserUploadMeta(user);

        /* =========================================================
           3️⃣ Generate deterministic filename
        ========================================================= */

        const ext = path.extname(file.name);
        const fileName = `${identity}${ext}`;

        /* =========================================================
           4️⃣ Replace old file automatically (safe delete)
        ========================================================= */

        await this.storage.delete(roleFolder, fileName);

        /* =========================================================
           5️⃣ Save new file
        ========================================================= */

        await this.storage.save(roleFolder, fileName, file);

        return { fileName };
    }
}