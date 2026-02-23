// src/modules/teacher/application/usecase/AssignHomeroomUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { AssignHomeroomDTO } from "@/modules/teacher/domain/dto/AssignHomeroomDTO";

/**
 * ============================================================
 * ASSIGN HOMEROOM USE CASE
 * ============================================================
 *
 * Business Rules:
 * - At least one teacher must be selected
 * - At least one rombel must be selected
 * - All teachers must exist
 * - Must be executed atomically
 */
export class AssignHomeroomUseCase extends BaseUseCase<
    AssignHomeroomDTO,
    void
> {
    constructor(private readonly repo: TeacherInterface) {
        super();
    }

    protected async handle(dto: AssignHomeroomDTO): Promise<void> {
        if (dto.teacherIds.length === 0) {
            throw new Error("Minimal satu guru harus dipilih.");
        }

        if (dto.rombelIds.length === 0) {
            throw new Error("Minimal satu kelas harus dipilih.");
        }

        await this.repo.withTransaction(async () => {
            const teachers = await Promise.all(
                dto.teacherIds.map((id) => this.repo.findById(id))
            );

            if (teachers.some((teacher) => teacher === null)) {
                throw new Error("Terdapat guru yang tidak ditemukan.");
            }

            await this.repo.bulkAssignHomeroom(
                dto.teacherIds,
                dto.rombelIds
            );
        });
    }
}