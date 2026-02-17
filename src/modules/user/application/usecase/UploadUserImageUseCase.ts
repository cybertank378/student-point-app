//Files: src/modules/user/application/usecase/UploadUserImageUseCase.ts
import path from "path";
import { Result } from "@/modules/shared/core/Result";
import type { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";
import type { FileStorageInterface } from "@/modules/user/domain/interfaces/FileStorageInterface";
import { resolveUserUploadMeta } from "@/libs/utils";

/**
 * =========================================================
 * UploadUserImageUseCase
 * =========================================================
 *
 * Responsible for:
 * - Validating user existence
 * - Resolving dynamic upload folder (based on role)
 * - Generating deterministic file name (NIS/NIP/Username)
 * - Replacing old file automatically
 * - Delegating physical storage to FileStorageInterface
 *
 * NOTE:
 * This use case does NOT depend on:
 * - Prisma
 * - fs
 * - Any infrastructure detail
 *
 * Fully Clean Architecture compliant.
 */
export class UploadUserImageUseCase {
    constructor(
        private readonly repo: UserInterface,
        private readonly storage: FileStorageInterface
    ) {}

    /**
     * Execute upload flow.
     *
     * @param userId - Authenticated user ID
     * @param file - File object from request
     */
    async execute(
        userId: string,
        file: File
    ): Promise<Result<{ fileName: string }>> {

        /* =========================================================
           1️⃣ Ensure user exists
        ========================================================= */

        const user = await this.repo.findById(userId);

        if (!user) {
            return Result.fail("User tidak ditemukan.");
        }

        /* =========================================================
           2️⃣ Resolve folder & identity name
           Folder based on role:
             - student
             - teacher
             - parent
             - admin

           Identity based on:
             - NIS (student)
             - NIP (teacher)
             - NIS anak (parent)
             - username (admin)
        ========================================================= */

        const { roleFolder, identity } =
            resolveUserUploadMeta(user);

        /* =========================================================
           3️⃣ Generate deterministic filename
           Example:
             1987654321.png
             12345678.jpg
        ========================================================= */

        const ext = path.extname(file.name);
        const fileName = `${identity}${ext}`;

        /* =========================================================
           4️⃣ Replace old file automatically
           (Safe delete — ignore if not exist)
        ========================================================= */

        await this.storage.delete(roleFolder, fileName);

        /* =========================================================
           5️⃣ Save new file
        ========================================================= */

        await this.storage.save(roleFolder, fileName, file);

        return Result.ok({ fileName });
    }
}


