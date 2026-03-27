import { BaseUseCase } from "@/modules/shared/core/BaseUseCase"
import { AppError } from "@/modules/shared/errors/AppError"

import { StudentCompositeInterface }
    from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface"

import { StudentAchievement }
    from "../../domain/entity/StudentAchievement"

import { StudentAchievementMapper }
    from "../../domain/mapper/StudentAchievementMapper"

export interface GetStudentAchievementQuery {

    studentId: string
    achievementId: string

}

/**
 * ============================================================
 * GET STUDENT ACHIEVEMENT USE CASE
 * ============================================================
 */

export class GetStudentAchievementUseCase
    extends BaseUseCase<GetStudentAchievementQuery, StudentAchievement>
{

    constructor(
        private readonly compositeRepository: StudentCompositeInterface
    ) {
        super()
    }

    protected async handle(
        query: GetStudentAchievementQuery
    ): Promise<StudentAchievement> {

        this.ensureQuery(query)

        const student =
            await this.compositeRepository.findById(query.studentId)

        if (!student) {
            throw new AppError("Student not found")
        }

        const record =
            student.achievements.find(
                item => item.id === query.achievementId
            )

        if (!record) {
            throw new AppError("Student achievement not found")
        }

        return StudentAchievementMapper.fromComposite(
            query.studentId,
            record
        )

    }

    private ensureQuery(query: GetStudentAchievementQuery): void {

        if (!query.studentId) {
            throw new AppError("Student ID is required")
        }

        if (!query.achievementId) {
            throw new AppError("Achievement ID is required")
        }

    }

}