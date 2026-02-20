//Files: src/modules/teacher/application/usecase/GetTeacherByIdUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";

/**
 * ============================================================
 * GET TEACHER BY ID USE CASE
 * ============================================================
 *
 * Business Responsibilities:
 * - Memastikan guru ada
 * - Mengembalikan detail guru berdasarkan ID
 *
 * Error handling dilakukan oleh BaseUseCase.
 */
export class GetTeacherByIdUseCase
    extends BaseUseCase<string, Teacher> {

    constructor(
        private readonly repo: TeacherInterface,
    ) {
        super();
    }

    /**
     * Implementasi logika pengambilan guru berdasarkan ID.
     */
    protected async handle(id: string): Promise<Teacher> {

        const teacher = await this.repo.findById(id);

        if (!teacher) {
            throw new Error("Guru tidak ditemukan.");
        }

        return teacher;
    }
}

