//Files: src/modules/teacher/application/usecase/UploadTeacherImageUseCase.ts
import path from "path";
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { FileStorageInterface } from "@/libs/FileStorageInterface";

/**
 * ============================================================
 * UPLOAD TEACHER IMAGE USE CASE (STATIC PATH)
 * ============================================================
 *
 * Static folder:
 *   public/assets/upload/teacher
 *
 * Responsible for:
 * - Validating teacher existence
 * - Generating deterministic file name (NIP/NUPTK/ID)
 * - Replacing old file automatically
 * - Delegating storage to FileStorageInterface
 *
 * Pattern:
 *   execute({ teacherId, file }) -> Result<{ fileName: string }>
 */

export interface UploadTeacherImageRequest {
    teacherId: string;
    file: File;
}

export class UploadTeacherImageUseCase extends BaseUseCase<
    UploadTeacherImageRequest,
    { fileName: string }
> {
    private readonly folder = "public/assets/upload/teacher";

    constructor(
        private readonly repo: TeacherInterface,
        private readonly storage: FileStorageInterface
    ) {
        super();
    }

    protected async handle(
        request: UploadTeacherImageRequest
    ): Promise<{ fileName: string }> {

        const { teacherId, file } = request;

        /* ================= VALIDATION ================= */

        if (!teacherId) {
            throw new Error("Teacher ID wajib diisi.");
        }

        if (!file) {
            throw new Error("File tidak ditemukan.");
        }

        /* ================= ENSURE TEACHER EXISTS ================= */

        const teacher = await this.repo.findById(teacherId);

        if (!teacher) {
            throw new Error("Guru tidak ditemukan.");
        }

        /* ================= GENERATE DETERMINISTIC NAME ================= */

        const identity =
            teacher.nip ??
            teacher.nuptk ??
            teacher.id;

        const ext = path.extname(file.name);
        const fileName = `${identity}${ext}`;

        /* ================= REPLACE OLD FILE ================= */

        await this.storage.delete(this.folder, fileName);

        /* ================= SAVE NEW FILE ================= */

        await this.storage.save(this.folder, fileName, file);

        return { fileName };
    }
}