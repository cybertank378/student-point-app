//Files: src/modules/violation/application/usecases/ListViolationUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import {ViolationInterface} from "@/modules/violation/domain/interfaces/ViolationInterface";
import {Violation} from "@/modules/violation/domain/entity/Violation";

export class ListViolationUseCase {
    constructor(private repo: ViolationInterface) {}

    async execute(): Promise<Result<Violation[]>> {
        return Result.ok(await this.repo.findAll());
    }
}