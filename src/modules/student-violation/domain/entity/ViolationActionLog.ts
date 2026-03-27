// Files: src/modules/student-violation/domain/entity/ViolationActionLog.ts

/**
 * ============================================================
 * VIOLATION ACTION LOG ENTITY
 * ============================================================
 *
 * Immutable audit record capturing actions performed during
 * the violation resolution lifecycle.
 *
 * Architectural Role
 * - Domain Entity
 * - Supports audit trail for disciplinary handling
 */
export class ViolationActionLog {

    constructor(
        readonly id: string,
        readonly resolutionId: string,
        readonly action: string,
        readonly note: string | null,
        readonly createdAt: Date
    ) {}

}