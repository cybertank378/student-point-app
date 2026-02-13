//Files: src/modules/teacher/application/usecase/UpdateTeacherUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { UpdateTeacherDTO } from "@/modules/teacher/domain/dto/UpdateTeacherDTO";

export class UpdateTeacherUseCase {
    constructor(
        private readonly repo: TeacherInterface,
    ) {}

    async execute(
        dto: UpdateTeacherDTO,
    ): Promise<Result<Teacher>> {

        const exists = await this.repo.findById(dto.id);
        if (!exists) {
            return Result.fail("Guru tidak ditemukan");
        }

        const updated = await this.repo.update(dto);
        return Result.ok(updated);
    }
}
