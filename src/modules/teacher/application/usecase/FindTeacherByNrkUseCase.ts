// Files: src/modules/teacher/application/usecase/FindTeacherByNrkUseCase.ts

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
 * - Validasi NRK harus 6 digit angka
 * - Mengembalikan guru berdasarkan NRK (String Based)
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

        const cleaned = nrk.trim();

        // ✅ Validasi 6 digit angka (sesuaikan jika format berbeda)
        if (!/^\d{6}$/.test(cleaned)) {
            throw new Error("NRK harus 6 digit angka.");
        }

        const teacher = await this.repo.findByNrk(cleaned);

        if (!teacher) {
            throw new Error("Guru dengan NRK tersebut tidak ditemukan.");
        }

        return teacher;
    }
}