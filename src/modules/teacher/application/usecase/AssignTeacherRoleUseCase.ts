//Files: src/modules/teacher/application/usecase/AssignTeacherRoleUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { AssignTeacherRoleDTO } from "@/modules/teacher/domain/dto/AssignTeacherRoleDTO";

export class AssignTeacherRoleUseCase {
    constructor(
        private readonly repo: TeacherInterface,
    ) {}

    async execute(
        dto: AssignTeacherRoleDTO,
    ): Promise<Result<Teacher>> {

        const teacher = await this.repo.findById(dto.teacherId);
        if (!teacher) {
            return Result.fail("Guru tidak ditemukan");
        }

        const updated = await this.repo.updateRoles(
            dto.teacherId,
            dto.roles,
        );

        return Result.ok(updated);
    }
}

