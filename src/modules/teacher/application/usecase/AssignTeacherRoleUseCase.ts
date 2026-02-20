//Files: src/modules/teacher/application/usecase/AssignTeacherRoleUseCase.ts
// src/modules/teacher/application/usecase/AssignTeacherRoleUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { AssignTeacherRoleDTO } from "@/modules/teacher/domain/dto/AssignTeacherRoleDTO";

/**
 * ============================================================
 * ASSIGN TEACHER ROLE USE CASE
 * ============================================================
 *
 * Business Responsibilities:
 * - Minimal satu role harus dipilih
 * - Guru harus ada
 * - Memperbarui role guru
 *
 * Error handling dilakukan oleh BaseUseCase.
 */
export class AssignTeacherRoleUseCase
    extends BaseUseCase<AssignTeacherRoleDTO, Teacher> {

    constructor(
        private readonly repo: TeacherInterface,
    ) {
        super();
    }

    /**
     * Implementasi logika assign role guru.
     */
    protected async handle(
        dto: AssignTeacherRoleDTO,
    ): Promise<Teacher> {

        /**
         * ====================================================
         * VALIDASI ROLE
         * ====================================================
         */

        if (!dto.roles || dto.roles.length === 0) {
            throw new Error("Minimal satu role harus dipilih.");
        }

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
         * UPDATE ROLE
         * ====================================================
         */

        return this.repo.updateRoles(
            dto.teacherId,
            dto.roles,
        );
    }
}
