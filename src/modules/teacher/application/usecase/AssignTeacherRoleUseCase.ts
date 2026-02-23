//Files: src/modules/teacher/application/usecase/AssignTeacherRoleUseCase.ts
// src/modules/teacher/application/usecase/AssignTeacherRoleUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { AssignTeacherRoleDTO } from "@/modules/teacher/domain/dto/AssignTeacherRoleDTO";

/**
 * ============================================================
 * ASSIGN TEACHER ROLE USE CASE
 * ============================================================
 *
 * Business Rules:
 * - At least one teacher must be selected
 * - At least one role must be provided
 * - All teachers must exist
 * - Operation must be atomic
 */
export class AssignTeacherRoleUseCase extends BaseUseCase<
    AssignTeacherRoleDTO,
    void
> {
    constructor(private readonly repo: TeacherInterface) {
        super();
    }

    protected async handle(dto: AssignTeacherRoleDTO): Promise<void> {
        if (dto.teacherIds.length === 0) {
            throw new Error("Minimal satu guru harus dipilih.");
        }

        if (dto.roles.length === 0) {
            throw new Error("Minimal satu role harus dipilih.");
        }

        await this.repo.withTransaction(async () => {
            const teachers = await Promise.all(
                dto.teacherIds.map((id) => this.repo.findById(id))
            );

            if (teachers.some((teacher) => teacher === null)) {
                throw new Error("Terdapat guru yang tidak ditemukan.");
            }

            await this.repo.bulkAssignRoles(dto.teacherIds, dto.roles);
        });
    }
}