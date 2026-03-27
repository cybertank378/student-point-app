//Files: src/modules/student-profile/application/services/StudentProfileService.ts

import {UpdateStudentProfileDTO} from "@/modules/student-profile/domain/dto/UpdateStudentProfileDTO";
import {CreateStudentProfileDTO} from "@/modules/student-profile/domain/dto/CreateStudentProfileDTO";
import {DeleteStudentProfileUseCase} from "@/modules/student-profile/application/usecase/DeleteStudentProfileUseCase";
import {GetStudentProfileUseCase} from "@/modules/student-profile/application/usecase/GetStudentProfileUseCase";
import {UpdateStudentProfileUseCase} from "@/modules/student-profile/application/usecase/UpdateStudentProfileUseCase";
import {CreateStudentProfileUseCase} from "@/modules/student-profile/application/usecase/CreateStudentProfileUseCase";
import {StudentProfileInterface} from "@/modules/student-profile/domain/interfaces/StudentProfileInterface";
import {StudentCompositeInterface} from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface";
import {BaseAppServices} from "@/modules/shared/core/BaseAppServices";

/**
 * ============================================================
 * STUDENT PROFILE SERVICE
 * ============================================================
 *
 * Application service responsible for orchestrating
 * student profile use cases.
 *
 * Responsibilities:
 * - delegate execution to use cases
 * - provide a simple API for controllers
 * - keep controllers thin
 *
 * Business rules must remain inside UseCases.
 */


export class StudentProfileService extends BaseAppServices {

    private readonly createUC: CreateStudentProfileUseCase;
    private readonly updateUC: UpdateStudentProfileUseCase;
    private readonly deleteUC: DeleteStudentProfileUseCase;
    private readonly getUC: GetStudentProfileUseCase;

    constructor(
        repo: StudentProfileInterface,
        compositeRepo: StudentCompositeInterface
    ) {
        super();

        this.createUC = new CreateStudentProfileUseCase(repo);
        this.updateUC = new UpdateStudentProfileUseCase(repo);
        this.deleteUC = new DeleteStudentProfileUseCase(repo);
        this.getUC = new GetStudentProfileUseCase(compositeRepo);

    }

    createProfile(dto: CreateStudentProfileDTO) {
        return this.execute(this.createUC, dto);
    }

    updateProfile(dto: UpdateStudentProfileDTO) {
        return this.execute(this.updateUC, dto);
    }

    deleteProfile(studentId: string) {
        return this.execute(this.deleteUC, studentId);
    }

    getProfile(studentId: string) {
        return this.execute(this.getUC, studentId);
    }

}