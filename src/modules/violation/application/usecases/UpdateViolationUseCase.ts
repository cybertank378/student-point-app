//Files: src/modules/violation/application/usecases/UpdateViolationUseCase.ts


import { Result } from "@/modules/shared/core/Result";
import type { UpdateViolationDTO } from "@/modules/violation/domain/dto/UpdateViolationDTO";
import type { Violation } from "@/modules/violation/domain/entity/Violation";
import type { ViolationInterface } from "@/modules/violation/domain/interfaces/ViolationInterface";
import { resolveViolationLevel } from "@/modules/violation/domain/rules/ViolationLevelRule";

export class UpdateViolationUseCase {
    constructor(private repo: ViolationInterface) {
    }

    async execute(dto: UpdateViolationDTO): Promise<Result<Violation>> {
        const level = resolveViolationLevel(dto.point);
        return Result.ok(await this.repo.update({...dto, level}));
    }
}