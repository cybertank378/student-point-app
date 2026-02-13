//Files: src/modules/teacher/application/usecase/CreateTeacherUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { CreateTeacherDTO } from "@/modules/teacher/domain/dto/CreateTeacherDTO";

export class CreateTeacherUseCase {
    constructor(
        private readonly repo: TeacherInterface,
    ) {}

    async execute(
        dto: CreateTeacherDTO,
    ): Promise<Result<Teacher>> {

        const exists = await this.repo.findByUserId(dto.userId);
        if (exists) {
            return Result.fail("AuthUser sudah terdaftar sebagai guru");
        }

        const teacher = await this.repo.create(dto);
        return Result.ok(teacher);
    }
}
