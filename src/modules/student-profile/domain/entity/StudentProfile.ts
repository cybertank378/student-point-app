//Files: src/modules/student-profile/entity/StudentProfile.ts
/**
 * Represents a student's additional profile information.
 *
 * This entity mirrors the `StudentProfile` table in the database
 * but is expressed as a domain model used throughout the application.
 *
 * Design principles:
 * - Immutable (readonly)
 * - Pure data structure
 * - No persistence logic
 *
 * @domainEntity StudentProfile
 */
export interface StudentProfile {

    readonly id: string
    readonly studentId: string

    readonly childOrder: number | null
    readonly totalSiblings: number | null

    readonly distanceToSchool: string | null
    readonly transport: string | null

    readonly hobby: string | null
    readonly dream: string | null
    readonly closeFriend: string | null

}