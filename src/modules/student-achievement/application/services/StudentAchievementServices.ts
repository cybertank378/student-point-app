// Files: src/modules/student-achievement/application/services/StudentAchievementService.ts

import { BaseAppServices } from "@/modules/shared/core/BaseAppServices";

import { StudentAchievementInterface } from "../../domain/interfaces/StudentAchievementInterface";
import { StudentCompositeInterface } from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface";

import { AddStudentAchievementUseCase } from "../usecases/AddStudentAchievementUseCase";
import { GetStudentAchievementUseCase } from "../usecases/GetStudentAchievementUseCase";
import { ListStudentAchievementUseCase } from "../usecases/ListStudentAchievementUseCase";
import { RemoveStudentAchievementUseCase } from "../usecases/RemoveStudentAchievementUseCase";

import { AddStudentAchievementDTO } from "../../domain/dto/AddStudentAchievementDTO";

/**
 * ============================================================
 * STUDENT ACHIEVEMENT SERVICE
 * ============================================================
 *
 * Application service responsible for orchestrating
 * student achievement-related operations.
 *
 * Architectural Flow:
 *
 * Controller
 *      ↓
 * StudentAchievementService
 *      ↓
 * UseCase
 *      ↓
 * Repository / CompositeRepository
 */

export class StudentAchievementService extends BaseAppServices {

    /**
     * Add an achievement use case.
     */
    private readonly addUC: AddStudentAchievementUseCase;

    /**
     * Retrieve achievement use case.
     */
    private readonly getUC: GetStudentAchievementUseCase;

    /**
     * List achievements use case.
     */
    private readonly listUC: ListStudentAchievementUseCase;

    /**
     * Remove achievement use case.
     */
    private readonly removeUC: RemoveStudentAchievementUseCase;

    /**
     * Create a service instance.
     */
    constructor(
        repo: StudentAchievementInterface,
        compositeRepo: StudentCompositeInterface
    ) {

        super();

        this.addUC = new AddStudentAchievementUseCase(repo, compositeRepo);
        this.getUC = new GetStudentAchievementUseCase(compositeRepo);
        this.listUC = new ListStudentAchievementUseCase(compositeRepo);
        this.removeUC = new RemoveStudentAchievementUseCase(repo);

    }

    /**
     * ============================================================
     * ADD STUDENT ACHIEVEMENT
     * ============================================================
     */
    addStudentAchievement(dto: AddStudentAchievementDTO) {

        return this.execute(this.addUC, dto);

    }

    /**
     * ============================================================
     * GET STUDENT ACHIEVEMENT
     * ============================================================
     */
    getStudentAchievement(studentId: string, achievementId: string) {

        return this.execute(this.getUC, { studentId, achievementId });

    }

    /**
     * ============================================================
     * LIST STUDENT ACHIEVEMENTS
     * ============================================================
     */
    listStudentAchievements(studentId: string) {

        return this.execute(this.listUC, studentId);

    }

    /**
     * ============================================================
     * REMOVE STUDENT ACHIEVEMENT
     * ============================================================
     */
    removeStudentAchievement(achievementId: string) {

        return this.execute(this.removeUC, achievementId);

    }

}