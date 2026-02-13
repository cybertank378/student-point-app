//Files: src/modules/academic-year/application/usecases/SetActiveAcademicYearUseCase.ts
import { Result } from "@/modules/shared/core/Result";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";
import { serverLog } from "@/libs/serverLogger";

export class SetActiveAcademicYearUseCase {
    constructor(
        private readonly repo: AcademicYearInterface
    ) {}

    async execute(id: string): Promise<Result<void>> {
        try {
            serverLog("SET ACTIVE CALLED WITH ID:", id);

            const existing = await this.repo.findById(id);

            serverLog("FIND RESULT:", existing);

            if (!existing) {
                serverLog("ACADEMIC YEAR NOT FOUND:", id);
                return Result.fail("Tahun ajaran tidak ditemukan.");
            }

            await this.repo.setActive(id);

            serverLog("ACADEMIC YEAR ACTIVATED:", id);

            return Result.ok();
        } catch (error) {
            serverLog("SET ACTIVE ERROR:", error);

            return Result.fail(
                "Gagal mengaktifkan tahun ajaran."
            );
        }
    }
}


