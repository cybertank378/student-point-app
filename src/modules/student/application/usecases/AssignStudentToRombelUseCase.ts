//Files: src/modules/student/application/usecases/AssignStudentToRombelUseCase.ts

import type {StudentInterface} from "@/modules/student/domain/interfaces/StudentInterface";
import type {AssignStudentToRombelDTO} from "@/modules/student/domain/dto/AssignStudentToRombelDTO";
import { Result } from "@/modules/shared/core/Result";

export class AssignStudentToRombelUseCase {
    constructor(
        private readonly repo: StudentInterface,
    ) {}

    async execute(dto: AssignStudentToRombelDTO): Promise<Result<void>> {
        await this.repo.assignToRombel(dto.studentId, dto.rombelId);
        return Result.ok(undefined);
    }
}