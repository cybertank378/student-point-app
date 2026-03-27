// Files: src/modules/student-violation/domain/dto/ResolveViolationDTO.ts
import type {ViolationActionType, ViolationResolutionStatus} from "@/libs/utils/enums";

/**
 * ============================================================
 * RESOLVE VIOLATION DTO
 * ============================================================
 *
 * Input structure used when resolving a student violation.
 */
export interface ResolveViolationDTO {

    violationId: string

    handlerTeacherId: string

    status: ViolationResolutionStatus

    action: ViolationActionType

    note: string | null

}