//Files: src/modules/student/application/usecases/GetStudentByNisUseCase.ts

import {StudentInterface} from "@/modules/student/domain/interfaces/StudentInterface";
import {Result} from "@/modules/shared/core/Result";
import type {Student} from "@/modules/student/domain/entity/Student";

export class GetStudentByNisUseCase {
    constructor(
        private readonly repo: StudentInterface,
    ) {}

    async execute(nis: number): Promise<Result<Student>> {
        const student = await this.repo.findByNis(nis);

        if (!student) {
            return Result.fail(`Siswa dengan ${nis} tidak ditemukan`);
        }

        return Result.ok(student);
    }
}
