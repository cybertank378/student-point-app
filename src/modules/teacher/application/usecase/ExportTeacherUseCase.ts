//Files: src/modules/teacher/application/usecase/ExportTeacherUseCase
import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";

/**
 * ============================================================
 * EXPORT TEACHER USE CASE (FINAL CLEAN VERSION)
 * ============================================================
 *
 * Responsibility:
 * - Fetch data for export
 * - Apply optional filter
 *
 * Not Responsible:
 * - Excel generation
 * - File formatting
 */
export class ExportTeacherUseCase extends BaseUseCase<
    { role?: string } | undefined,
    ReadonlyArray<Teacher>
> {
    constructor(private readonly repo: TeacherInterface) {
        super();
    }

    protected async handle(
        params?: { role?: string }
    ): Promise<ReadonlyArray<Teacher>> {
        return this.repo.findAllForExport(params);
    }
}