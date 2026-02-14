//Files: src/modules/rombel/application/usecases/ListRombelUseCase.ts
import { Result } from "@/modules/shared/core/Result";
import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";
import { serverLog } from "@/libs/serverLogger";

export class ListRombelUseCase {

    constructor(
        private readonly repo: RombelInterface,
    ) {}

    async execute(): Promise<Result<Rombel[]>> {

        const context = "ListRombelUseCase.execute";

        try {

            const rows = await this.repo.findAll();

            serverLog(
                context,
                "Rombel fetched successfully",
                {
                    total: rows.length,
                    data: rows.map(r => ({
                        id: r.id,
                        label: r.label,
                        academicYearName: r.academicYearName,
                        studentCount: r.studentCount,
                    })),
                }
            );

            return Result.ok(rows);

        } catch (error) {

            serverLog(context, "ERROR:", error);

            return Result.fail(
                "Failed to fetch rombels"
            );
        }
    }
}
