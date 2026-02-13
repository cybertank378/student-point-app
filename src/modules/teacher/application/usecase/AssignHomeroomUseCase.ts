//Files: src/modules/teacher/application/usecase/AssignHomeroomUseCase.ts
import { Result } from "@/modules/shared/core/Result";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";

export class AssignHomeroomUseCase {
    constructor(
        private readonly repo: TeacherInterface,
    ) {}

    async execute(
        teacherId: string,
        classId: string,
    ): Promise<Result<void>> {

        const teacher = await this.repo.findById(teacherId);
        if (!teacher) {
            return Result.fail("Guru tidak ditemukan");
        }

        if (!teacher.isHomeroom()) {
            return Result.fail("Guru tidak memiliki role wali kelas");
        }

        await this.repo.assignHomeroom(teacherId, classId);
        return Result.ok(undefined);
    }
}
