//Files: src/modules/teacher/application/usecase/ListTeacherUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";

export class ListTeacherUseCase {
    constructor(
        private readonly repo: TeacherInterface,
    ) {}

    async execute(): Promise<Result<Teacher[]>> {
        const teachers = await this.repo.findAll();
        return Result.ok(teachers);
    }
}