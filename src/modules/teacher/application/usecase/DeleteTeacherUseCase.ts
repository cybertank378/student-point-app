//Files: src/modules/teacher/application/usecase/DeleteTeacherUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";

export class DeleteTeacherUseCase {
    constructor(
        private readonly repo: TeacherInterface,
    ) {}

    async execute(id: string): Promise<Result<void>> {
        const teacher = await this.repo.findById(id);

        if (!teacher) {
            return Result.fail("Guru tidak ditemukan");
        }

        await this.repo.delete(id);
        return Result.ok(undefined);
    }
}
