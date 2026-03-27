//Files :src/modules/student-counseling/domain/entity/StudentCounselingCase.ts

/**
 * ============================================================
 * ENTITAS KASUS KONSELING SISWA
 * ============================================================
 *
 * Entitas domain yang merepresentasikan satu kasus konseling
 * siswa di dalam sistem.
 *
 * Entitas ini bersifat immutable dan merefleksikan struktur
 * data dari model Prisma `CounselingCase` tanpa memiliki
 * ketergantungan langsung terhadap ORM.
 *
 * Prinsip Arsitektur
 * - Domain Driven Design
 * - Immutable Domain Entity
 * - Single Source of Truth berasal dari Prisma Schema
 *
 * Tanggung Jawab
 * - Menyimpan state domain kasus konseling
 * - Menjadi objek utama yang digunakan oleh UseCase
 * - Mencegah perubahan state secara langsung
 */

import { CaseStatus, CaseSource } from "@/libs/utils/enums"

export class StudentCounselingCase {

    readonly id: string

    readonly studentId: string

    readonly academicYearId: string

    readonly reason: string

    readonly source: CaseSource

    readonly status: CaseStatus

    readonly openedAt: Date

    readonly closedAt: Date | null

    constructor(params: {
        id: string
        studentId: string
        academicYearId: string
        reason: string
        source: CaseSource
        status: CaseStatus
        openedAt: Date
        closedAt: Date | null
    }) {

        this.id = params.id
        this.studentId = params.studentId
        this.academicYearId = params.academicYearId
        this.reason = params.reason
        this.source = params.source
        this.status = params.status
        this.openedAt = params.openedAt
        this.closedAt = params.closedAt

        Object.freeze(this)

    }

}