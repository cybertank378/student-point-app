// src/modules/teacher/application/usecase/AssignHomeroomUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { AssignHomeroomDTO } from "@/modules/teacher/domain/dto/AssignHomeroomDTO";

/**
 * ============================================================
 * ASSIGN HOMEROOM USE CASE
 * ============================================================
 *
 * Business Responsibilities:
 * - Memastikan guru ada
 * - Menetapkan guru sebagai wali kelas
 *
 * Error handling dilakukan oleh BaseUseCase.
 */
export class AssignHomeroomUseCase
    extends BaseUseCase<AssignHomeroomDTO, void> {

    constructor(
        private readonly repo: TeacherInterface,
    ) {
        super();
    }

    /**
     * Implementasi logika penetapan wali kelas.
     */
    protected async handle(
        dto: AssignHomeroomDTO,
    ): Promise<void> {

        /**
         * ====================================================
         * VALIDASI KEBERADAAN GURU
         * ====================================================
         */

        const teacher = await this.repo.findById(dto.teacherId);

        if (!teacher) {
            throw new Error("Guru tidak ditemukan.");
        }

        /**
         * ====================================================
         * ASSIGN HOMEROOM
         * ====================================================
         */

        await this.repo.assignHomeroom(
            dto.teacherId,
            dto.classId,
        );
    }
}
