//Files: src/modules/teacher/domain/dto/AssignHomeroomDTO
/**
 * ============================================================
 * ASSIGN HOMEROOM DTO
 * ============================================================
 *
 * Supports both single and bulk homeroom assignment.
 */
export interface AssignHomeroomDTO {
    readonly teacherIds: string[];
    readonly rombelIds: string[];
}