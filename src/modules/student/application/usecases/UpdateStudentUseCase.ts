//Files: src/modules/student/application/usecases/UpdateStudentUseCase.ts
import { Result } from "@/modules/shared/core/Result";
import type { Student } from "@/modules/student/domain/entity/Student";
import type { UpdateStudentDTO } from "@/modules/student/domain/dto/UpdateStudentDTO";
import {StudentInterface} from "@/modules/student/domain/interfaces/StudentInterface";

export class UpdateStudentUseCase {
    constructor(
        private readonly repo: StudentInterface,
    ) {}

    async execute(
        dto: UpdateStudentDTO,
    ): Promise<Result<Student>> {

        const existing = await this.repo.findById(dto.id);
        if (!existing) {
            return Result.fail("Siswa tidak ditemukan");
        }

        const updated = await this.repo.update(dto);
        return Result.ok(updated);
    }
}
