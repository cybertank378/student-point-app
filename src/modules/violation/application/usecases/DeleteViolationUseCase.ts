//Files: src/modules/violation/application/usecases/DeleteViolationUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import {ViolationInterface} from "@/modules/violation/domain/interfaces/ViolationInterface";

export class DeleteViolationUseCase {
    constructor(private repo: ViolationInterface) {}

    async execute(id: string): Promise<Result<void>> {
        if (await this.repo.isUsed(id)) {
            return Result.fail("Violation already used and cannot be deleted");
        }
        await this.repo.softDelete(id);
        return Result.ok(undefined);
    }
}
