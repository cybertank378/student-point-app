//Files: src/modules/teacher/application/usecase/ExportTeacherUseCase

import { Result } from "@/modules/shared/core/Result";
import {TeacherInterface} from "@/modules/teacher/domain/interfaces/TeacherInterface";
export class ExportTeacherUseCase {
    constructor(
        private readonly repo: TeacherInterface,
    ) {}

    async execute() {
        try {
            const data = await this.repo.findAllForExport();
            return Result.ok(data);
        } catch (error) {
            console.error("ExportTeacherUseCase:", error);
            return Result.fail("Gagal export data guru.");
        }
    }
}
