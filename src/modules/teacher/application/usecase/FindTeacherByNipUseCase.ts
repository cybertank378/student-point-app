//Files: src/modules/teacher/application/usecase/FindTeacherByNipUseCase.ts

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
 * - Mengembalikan guru berdasarkan NIP
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

        const teacher = await this.repo.findByNip(nip.trim());

        if (!teacher) {
            throw new Error("Guru dengan NIP tersebut tidak ditemukan.");
        }

        return teacher;
    }
}

