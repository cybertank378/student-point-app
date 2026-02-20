//Files: src/modules/student/application/usecases/AssignStudentAcademicYearUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { Student } from "@/modules/student/domain/entity/Student";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

type Request = {
    studentId: string;
    rombelId: string;
};

export class AssignStudentAcademicYearUseCase extends BaseUseCase<
    Request,
    Student
> {
    constructor(private readonly repo: StudentInterface) {
        super();
    }

    protected async handle(
        dto: Request
    ): Promise<Student> {
        const { studentId, rombelId } = dto;

        if (!studentId) {
            throw AppError.badRequest("Student ID is required");
        }

        if (!rombelId) {
            throw AppError.badRequest("Rombel ID is required");
        }

        const student = await this.repo.findById(studentId);

        if (!student) {
            throw AppError.notFound("Student not found");
        }

        await this.repo.assignToRombel(studentId, rombelId);

        const updated = await this.repo.findById(studentId);

        if (!updated) {
            throw AppError.internal("Failed to assign student");
        }

        return updated;
    }
}