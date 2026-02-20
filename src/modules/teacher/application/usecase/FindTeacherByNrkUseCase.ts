//Files: src/modules/teacher/application/usecase/FindTeacherByNrkUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";

/**
 * ============================================================
 * FIND TEACHER BY NRK USE CASE
 * ============================================================
 *
 * Business Responsibilities:
 * - Validasi NRK tidak kosong
 * - Mengembalikan guru berdasarkan NRK
 */
export class FindTeacherByNrkUseCase
    extends BaseUseCase<string, Teacher> {

    constructor(
        private readonly repo: TeacherInterface,
    ) {
        super();
    }

    protected async handle(nrk: string): Promise<Teacher> {

        if (!nrk || nrk.trim() === "") {
            throw new Error("NRK tidak boleh kosong.");
        }

        const teacher = await this.repo.findByNrk(nrk.trim());

        if (!teacher) {
            throw new Error("Guru dengan NRK tersebut tidak ditemukan.");
        }

        return teacher;
    }
}