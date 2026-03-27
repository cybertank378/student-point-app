import { BaseUseCase } from "@/modules/shared/core/BaseUseCase"
import { AppError } from "@/modules/shared/errors/AppError"

import { StudentAchievementInterface }
    from "../../domain/interfaces/StudentAchievementInterface"

/**
 * ============================================================
 * REMOVE STUDENT ACHIEVEMENT USE CASE
 * ============================================================
 *
 * Responsibilities
 * - Validate achievement existence
 * - Remove achievement record
 */

export class RemoveStudentAchievementUseCase
    extends BaseUseCase<string, void>
{

    constructor(
        private readonly repository: StudentAchievementInterface
    ) {
        super()
    }

    protected async handle(id: string): Promise<void> {

        this.ensureIdentifier(id)

        const record =
            await this.repository.findById(id)

        if (!record) {
            throw new AppError("Student achievement not found")
        }

        await this.repository.remove(id)

    }

    private ensureIdentifier(id: string): void {

        if (!id) {
            throw new AppError("Achievement ID is required")
        }

    }

}