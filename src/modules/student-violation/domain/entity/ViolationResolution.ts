//Files: src/modules/student-violation/domain/entity/ViolationResolution.ts
import {ViolationActionLog} from "@/modules/student-violation/domain/entity/ViolationActionLog";

/**
 * ============================================================
 * VIOLATION RESOLUTION ENTITY
 * ============================================================
 *
 * Represents the resolution process of a student violation.
 *
 * A resolution contains disciplinary actions performed by
 * a teacher and maintains an audit log of actions.
 *
 * Architectural Role
 * - Domain Entity
 */
export class ViolationResolution {

    private logs: ViolationActionLog[]

    constructor(
        readonly id: string,
        readonly studentViolationId: string,
        readonly handlerTeacherId: string,
        readonly status: string,
        readonly action: string,
        readonly note: string | null,
        readonly resolvedAt: Date | null,
        readonly createdAt: Date,
        readonly updatedAt: Date,
        logs: ViolationActionLog[]
    ) {

        this.logs = logs

    }

    /**
     * Returns action logs associated with this resolution.
     */
    getLogs(): ViolationActionLog[] {

        return this.logs

    }

    /**
     * Attaches logs to the resolution entity.
     */
    attachLogs(
        logs: ViolationActionLog[]
    ): void {

        this.logs = logs

    }

}