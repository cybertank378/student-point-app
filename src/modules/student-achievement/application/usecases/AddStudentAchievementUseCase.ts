import { BaseUseCase } from "@/modules/shared/core/BaseUseCase"
import { AppError } from "@/modules/shared/errors/AppError"

import { AddStudentAchievementDTO }
    from "../../domain/dto/AddStudentAchievementDTO"

import { StudentAchievement }
    from "../../domain/entity/StudentAchievement"

import { StudentAchievementInterface }
    from "../../domain/interfaces/StudentAchievementInterface"

import { StudentCompositeInterface }
    from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface"

/**
 * ============================================================
 * ADD STUDENT ACHIEVEMENT USE CASE
 * ============================================================
 *
 * Responsibilities
 * - Validate student existence
 * - Prevent duplicate achievement records
 * - Persist achievement record
 */

export class AddStudentAchievementUseCase
    extends BaseUseCase<AddStudentAchievementDTO, StudentAchievement>
{

    constructor(
        private readonly repository: StudentAchievementInterface,
        private readonly compositeRepository: StudentCompositeInterface
    ) {
        super()
    }

    protected async handle(
        dto: AddStudentAchievementDTO
    ): Promise<StudentAchievement> {

        this.ensurePayload(dto)

        const student =
            await this.compositeRepository.findById(dto.studentId)

        if (!student) {
            throw new AppError("Student not found")
        }

        const duplicate =
            student.achievements.find(
                record =>
                    record.achievementId === dto.achievementId &&
                    new Date(record.achievedAt).getTime()
                    === dto.achievedAt.getTime()
            )

        if (duplicate) {
            throw new AppError(
                "Achievement already recorded for this student on the same date"
            )
        }

        return this.repository.assign(dto)

    }

    private ensurePayload(dto: AddStudentAchievementDTO): void {

        if (!dto.studentId) {
            throw new AppError("Student ID is required")
        }

        if (!dto.achievementId) {
            throw new AppError("Achievement ID is required")
        }

        if (!dto.achievedAt) {
            throw new AppError("Achievement date is required")
        }

    }

}