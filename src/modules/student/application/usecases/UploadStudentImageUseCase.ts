//Files: src/modules/student/application/usecases/UploadStudentImageUseCase.ts

import path from "path";
import fs from "fs";

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";
import type { FileStorageInterface } from "@/libs/FileStorageInterface";
import { AppError } from "@/modules/shared/errors/AppError";

/**
 * ============================================================
 * UPLOAD STUDENT IMAGE USE CASE (STATIC PATH)
 * ============================================================
 *
 * Static folder:
 *   public/assets/upload/student
 *
 * Responsible for:
 * - Validating student existence
 * - Generating deterministic file name (NIS / Student Identity)
 * - Replacing an old file automatically
 * - Delegating storage to FileStorageInterface
 *
 * Pattern:
 *   execute({ studentId, file }) -> Result<{ fileName: string }>
 */

export interface UploadStudentImageRequest {
  studentId: string;
  file: File;
}

export class UploadStudentImageUseCase extends BaseUseCase<
    UploadStudentImageRequest,
    { fileName: string }
> {

  private readonly relativeFolder = "student";

  constructor(
      private readonly repo: StudentInterface,
      private readonly storage: FileStorageInterface
  ) {
    super();
  }

  protected async handle(
      request: UploadStudentImageRequest
  ): Promise<{ fileName: string }> {

    const { studentId, file } = request;

    /* ================= VALIDATION ================= */

    if (!studentId) {
      throw new AppError("Student ID wajib diisi.", 400);
    }

    if (!file) {
      throw new AppError("File tidak ditemukan.", 400);
    }

    /* ================= ENSURE STUDENT EXISTS ================= */

    const student = await this.repo.findById(studentId);

    if (!student) {
      throw new AppError("Siswa tidak ditemukan.", 404);
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
          "Gagal membuat folder upload student.",
          500
      );
    }

    /* ================= GENERATE FILE NAME ================= */

    const identity = student.nis;

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