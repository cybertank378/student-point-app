//Files: src/modules/teacher/application/usecase/UploadTeacherImageUseCase.ts
import path from "path";
import fs from "fs";
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { FileStorageInterface } from "@/libs/FileStorageInterface";
import {AppError} from "@/modules/shared/errors/AppError";
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
    private readonly relativeFolder = "teacher";

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
            throw new AppError("Teacher ID wajib diisi.", 400);
        }

        if (!file) {
            throw new AppError("File tidak ditemukan.", 400);
        }

        /* ================= ENSURE TEACHER EXISTS ================= */

        const teacher = await this.repo.findById(teacherId);

        if (!teacher) {
            throw new AppError("Guru tidak ditemukan.", 404);
        }

        /* ================= ABSOLUTE PATH ================= */

        const absoluteFolder = path.join(
            process.cwd(),
            "public",
            this.relativeFolder
        );

        /* ================= ENSURE DIRECTORY EXISTS ================= */

        try {
            if (!fs.existsSync(absoluteFolder)) {
                fs.mkdirSync(absoluteFolder, { recursive: true });
            }
        } catch {
            throw new AppError(
                "Gagal membuat folder upload teacher.",
                500
            );
        }

        /* ================= GENERATE FILE NAME ================= */

        const identity = teacher.nrg;

        const ext = path.extname(file.name);
        const fileName = `${identity}${ext}`;

        const filePath = path.join(absoluteFolder, fileName);

        /* ================= DELETE OLD FILE ================= */

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch {
            throw new AppError(
                "Gagal menghapus file lama.",
                500
            );
        }

        /* ================= SAVE FILE ================= */

        try {
            await this.storage.save(
                this.relativeFolder,
                fileName,
                file
            );
        } catch {
            throw new AppError(
                "Gagal menyimpan file.",
                500
            );
        }

        return { fileName };
    }
}