//Files: src/modules/violation/application/usecases/CreateViolationUseCase.ts

import { ViolationInterface } from "@/modules/violation/domain/interfaces/ViolationInterface";
import { CreateViolationDTO } from "@/modules/violation/domain/dto/CreateViolationDTO";
import { Violation } from "@/modules/violation/domain/entity/Violation";
import { Result } from "@/modules/shared/core/Result";
import { resolveViolationLevel } from "@/modules/violation/domain/rules/ViolationLevelRule";

export class CreateViolationUseCase {
    constructor(private repo: ViolationInterface) {}

    async execute(dto: CreateViolationDTO): Promise<Result<Violation>> {
        const level = resolveViolationLevel(dto.point);
        return Result.ok(await this.repo.create({ ...dto, level }));
    }
}
