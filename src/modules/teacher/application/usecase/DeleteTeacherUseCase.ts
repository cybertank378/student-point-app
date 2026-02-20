//Files: src/modules/teacher/application/usecase/DeleteTeacherUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import {AppError} from "@/modules/shared/errors/AppError";

/**
 * ============================================================
 * DELETE TEACHER USE CASE
 * ============================================================
 *
 * Business Responsibilities:
 * - Memastikan guru ada sebelum dihapus
 * - Menghapus data guru
 *
 * Error handling dilakukan oleh BaseUseCase.
 */
export class DeleteTeacherUseCase
    extends BaseUseCase<string, void> {

    constructor(
        private readonly repo: TeacherInterface,
    ) {
        super();
    }

    /**
     * Implementasi logika penghapusan guru.
     */
    protected async handle(id: string): Promise<void> {
        const teacher = await this.repo.findById(id);

        if (!teacher) {
            throw AppError.notFound("Guru tidak ditemukan.");

        }

        await this.repo.delete(id);
    }
}
