// Files: src/modules/student-point/domain/entity/StudentPoint.ts

/**
 * ============================================================
 * STUDENT POINT SUMMARY ENTITY
 * ============================================================
 *
 * Immutable domain entity yang merepresentasikan
 * agregasi poin siswa dalam satu tahun akademik.
 *
 * Entity ini hanya merepresentasikan state domain.
 * ID tidak pernah dibuat di domain layer karena
 * dihasilkan oleh database (Prisma).
 *
 * Responsibilities:
 *
 * - Menyimpan akumulasi poin siswa
 * - Menghasilkan entity baru ketika terjadi perubahan
 * - Menjadi sumber kebenaran domain state
 */

export class StudentPoint {

    public readonly id: string
    public readonly studentId: string
    public readonly academicYearId: string

    public readonly totalViolationPoint: number
    public readonly totalAchievementPoint: number
    public readonly totalPoint: number

    public readonly updatedAt: Date

    constructor(props: {
        id: string
        studentId: string
        academicYearId: string
        totalViolationPoint: number
        totalAchievementPoint: number
        totalPoint: number
        updatedAt: Date
    }) {

        this.id = props.id
        this.studentId = props.studentId
        this.academicYearId = props.academicYearId

        this.totalViolationPoint = props.totalViolationPoint
        this.totalAchievementPoint = props.totalAchievementPoint
        this.totalPoint = props.totalPoint

        this.updatedAt = props.updatedAt

    }

    recalculate(
        violationPoint: number,
        achievementPoint: number
    ): StudentPoint {

        const totalPoint = achievementPoint - violationPoint

        return new StudentPoint({

            id: this.id,
            studentId: this.studentId,
            academicYearId: this.academicYearId,

            totalViolationPoint: violationPoint,
            totalAchievementPoint: achievementPoint,
            totalPoint,

            updatedAt: new Date()

        })

    }

}