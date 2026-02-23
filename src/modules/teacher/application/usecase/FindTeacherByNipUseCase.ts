// Files: src/modules/teacher/application/usecase/FindTeacherByNipUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";

/**
 * ============================================================
 * FIND TEACHER BY NIP USE CASE
 * ============================================================
 *
 * Business Responsibilities:
 * - Validasi NIP tidak kosong
 * - Validasi NIP harus 18 digit angka
 * - Mengembalikan guru berdasarkan NIP (String Based)
 */
export class FindTeacherByNipUseCase
    extends BaseUseCase<string, Teacher> {

    constructor(
        private readonly repo: TeacherInterface,
    ) {
        super();
    }

    protected async handle(nip: string): Promise<Teacher> {

        if (!nip || nip.trim() === "") {
            throw new Error("NIP tidak boleh kosong.");
        }

        const cleaned = nip.trim();

        // ✅ Validasi 18 digit angka
        if (!/^\d{18}$/.test(cleaned)) {
            throw new Error("NIP harus 18 digit angka.");
        }

        const teacher = await this.repo.findByNip(cleaned);

        if (!teacher) {
            throw new Error("Guru dengan NIP tersebut tidak ditemukan.");
        }

        return teacher;
    }
}