import { BaseUseCase } from "@/modules/shared/core/BaseUseCase"
import { AppError } from "@/modules/shared/errors/AppError"

import { StudentCompositeInterface }
    from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface"

import { StudentAchievement }
    from "../../domain/entity/StudentAchievement"

import { StudentAchievementMapper }
    from "../../domain/mapper/StudentAchievementMapper"

/**
 * ============================================================
 * LIST STUDENT ACHIEVEMENT USE CASE
 * ============================================================
 *
 * Retrieve all achievements for a student
 */

export class ListStudentAchievementUseCase
    extends BaseUseCase<string, StudentAchievement[]>
{

    constructor(
        private readonly compositeRepository: StudentCompositeInterface
    ) {
        super()
    }

    protected async handle(
        studentId: string
    ): Promise<StudentAchievement[]> {

        this.ensureStudentId(studentId)

        const student =
            await this.compositeRepository.findById(studentId)

        if (!student) {
            throw new AppError("Student not found")
        }

        return student.achievements.map(record =>
            StudentAchievementMapper.fromComposite(studentId, record)
        )

    }

    private ensureStudentId(studentId: string): void {

        if (!studentId) {
            throw new AppError("Student ID is required")
        }

    }

}