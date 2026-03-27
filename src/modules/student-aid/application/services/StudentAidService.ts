//Files: src/modules/student-aid/application/services/StudentAidService.ts


import {BaseAppServices} from "@/modules/shared/core/BaseAppServices";
import {AssignStudentAidUseCase} from "@/modules/student-aid/application/usecases/AssignStudentAidUseCase";
import {UpdateStudentAidUseCase} from "@/modules/student-aid/application/usecases/UpdateStudentAidUseCase";
import {ListStudentAidUseCase} from "@/modules/student-aid/application/usecases/ListStudentAidUseCase";
import {StudentAidInterface} from "@/modules/student-aid/domain/interfaces/StudentAidInterface";
import {StudentAidDTO} from "@/modules/student-aid/domain/dto/StudentAidDTO";

/**
 * ============================================================
 * STUDENT AID SERVICE
 * ============================================================
 *
 * Application service responsible for orchestrating
 * student aid related operations.
 *
 * Responsibilities:
 *
 * - Delegate requests to appropriate use cases
 * - Maintain thin controllers
 * - Standardize use case execution
 *
 * Architectural Flow:
 *
 * Controller
 *      ↓
 * StudentAidService
 *      ↓
 * UseCase
 *      ↓
 * Repository
 */

export class StudentAidService extends BaseAppServices {

    /**
     * Assign aid use case.
     */
    private readonly assignUC: AssignStudentAidUseCase;

    /**
     * Update aid use case.
     */
    private readonly updateUC: UpdateStudentAidUseCase;

    /**
     * Retrieve aid records for a student.
     */
    private readonly listUC: ListStudentAidUseCase;

    /**
     * Create service instance.
     *
     * @param repo StudentAid repository implementation
     */
    constructor(
        repo: StudentAidInterface
    ) {

        super();

        this.assignUC =
            new AssignStudentAidUseCase(repo);

        this.updateUC =
            new UpdateStudentAidUseCase(repo);

        this.listUC =
            new ListStudentAidUseCase(repo);

    }

    /**
     * ============================================================
     * ASSIGN STUDENT AID
     * ============================================================
     *
     * Assign government aid to a student
     * within a specific academic year.
     *
     * @param dto student aid data without id
     */
    assignStudentAid(
        dto: Omit<StudentAidDTO, "id">
    ) {

        return this.execute(
            this.assignUC,
            dto
        );

    }

    /**
     * ============================================================
     * UPDATE STUDENT AID
     * ============================================================
     *
     * Update an existing student aid record.
     *
     * @param dto student aid data
     */
    updateStudentAid(
        dto: StudentAidDTO
    ) {

        return this.execute(
            this.updateUC,
            dto
        );

    }

    /**
     * ============================================================
     * GET STUDENT AID BY STUDENT ID
     * ============================================================
     *
     * Retrieve all aid records belonging to a student.
     *
     * @param studentId student identifier
     */
    getStudentAidByStudentId(
        studentId: string
    ) {

        return this.execute(
            this.listUC,
            studentId
        );

    }

}