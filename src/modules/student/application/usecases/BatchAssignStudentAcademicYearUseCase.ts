//Files: src/modules/student/application/usecases/BatchAssignStudentAcademicYearUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

type Request = {
    studentIds: string[];
    rombelId: string;
};

export class BatchAssignStudentAcademicYearUseCase extends BaseUseCase<
    Request,
    number
> {
    constructor(private readonly repo: StudentInterface) {
        super();
    }

    protected async handle(
        dto: Request
    ): Promise<number> {
        const { studentIds, rombelId } = dto;

        if (!studentIds || studentIds.length === 0) {
            throw AppError.badRequest("Student IDs are required");
        }

        if (!rombelId) {
            throw AppError.badRequest("Rombel ID is required");
        }

        return this.repo.batchAssignToRombel(
            studentIds,
            rombelId
        );
    }
}