//Files: src/modules/teacher/application/usecase/GetTeacherByIdUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";

export class GetTeacherByIdUseCase {
    constructor(
        private readonly repo: TeacherInterface,
    ) {}

    async execute(id: string): Promise<Result<Teacher>> {
        const teacher = await this.repo.findById(id);

        if (!teacher) {
            return Result.fail("Guru tidak ditemukan");
        }

        return Result.ok(teacher);
    }
}
