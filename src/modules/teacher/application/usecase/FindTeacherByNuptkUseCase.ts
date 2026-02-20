//Files: src/modules/teacher/application/usecase/FindTeacherByNuptkUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";

/**
 * ============================================================
 * FIND TEACHER BY NUPTK USE CASE
 * ============================================================
 *
 * Business Responsibilities:
 * - Validasi NUPTK tidak kosong
 * - Mengembalikan guru berdasarkan NUPTK
 */
export class FindTeacherByNuptkUseCase
    extends BaseUseCase<string, Teacher> {

    constructor(
        private readonly repo: TeacherInterface,
    ) {
        super();
    }

    protected async handle(nuptk: string): Promise<Teacher> {

        if (!nuptk || nuptk.trim() === "") {
            throw new Error("NUPTK tidak boleh kosong.");
        }

        const teacher = await this.repo.findByNuptk(nuptk.trim());

        if (!teacher) {
            throw new Error("Guru dengan NUPTK tersebut tidak ditemukan.");
        }

        return teacher;
    }
}