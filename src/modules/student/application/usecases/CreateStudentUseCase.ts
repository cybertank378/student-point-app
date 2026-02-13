//Files: src/modules/student/application/usecases/CreateStudentUseCase.ts
import { Result } from "@/modules/shared/core/Result";

import type { Student } from "@/modules/student/domain/entity/Student";
import type { CreateStudentDTO } from "@/modules/student/domain/dto/CreateStudentDTO";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

export class CreateStudentUseCase {
    constructor(
        private readonly studentRepo: StudentInterface,
        private readonly academicYearRepo: AcademicYearInterface,
    ) {}

    async execute(
        dto: CreateStudentDTO,
    ): Promise<Result<Student>> {

        // 1️⃣ Validasi tahun ajaran aktif
        const activeYear =
            await this.academicYearRepo.findActive();

        if (!activeYear) {
            return Result.fail(
                "Tidak ada tahun ajaran aktif",
            );
        }

        // 2️⃣ Validasi NIS unik
        const exists =
            await this.studentRepo.findByNis(dto.nis);

        if (exists) {
            return Result.fail(
                "NIS sudah terdaftar",
            );
        }

        // 3️⃣ SIMPAN VIA REPOSITORY (DTO → Entity)
        const student =
            await this.studentRepo.create(dto);

        return Result.ok(student);
    }
}
