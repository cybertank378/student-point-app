//Files: src/modules/student-point/application/services/StudentPointService.ts
import { BaseAppServices } from "@/modules/shared/core/BaseAppServices";

import { RecalculateStudentPointUseCase } from "@/modules/student-point/application/usecases/RecalculateStudentPointUseCase";
import { GetStudentPointSummaryUseCase } from "@/modules/student-point/application/usecases/GetStudentPointSummaryUseCase";
import { ListStudentPointSummaryUseCase } from "@/modules/student-point/application/usecases/ListStudentPointSummaryUseCase";

import { StudentPointInterface } from "@/modules/student-point/domain/interfaces/StudentPointInterface";
import type {StudentViolationInterface} from "@/modules/student-violation/domain/interfaces/StudentViolationInterface";
import type {
    StudentAchievementInterface
} from "@/modules/student-achievement/domain/interfaces/StudentAchievementInterface";

export class StudentPointService extends BaseAppServices {

    private readonly recalcUC: RecalculateStudentPointUseCase;
    private readonly getUC: GetStudentPointSummaryUseCase;
    private readonly listUC: ListStudentPointSummaryUseCase;

    constructor(
        repo: StudentPointInterface,
        violationRepo: StudentViolationInterface,
        achievementRepo: StudentAchievementInterface
    ) {

        super();

        this.recalcUC =
            new RecalculateStudentPointUseCase(repo, violationRepo, achievementRepo);

        this.getUC =
            new GetStudentPointSummaryUseCase(repo);

        this.listUC =
            new ListStudentPointSummaryUseCase(repo);

    }

    recalculateStudentPoint(
        dto: {
            studentId: string
            academicYearId: string
            violationPoint: number
            achievementPoint: number
        }
    ) {

        return this.execute(
            this.recalcUC,
            dto
        );

    }

    getStudentPointSummary(
        dto: {
            studentId: string
            academicYearId: string
        }
    ) {

        return this.execute(
            this.getUC,
            dto
        );

    }

    listStudentPointSummary(
        academicYearId: string
    ) {

        return this.execute(
            this.listUC,
            { academicYearId }
        );

    }

}