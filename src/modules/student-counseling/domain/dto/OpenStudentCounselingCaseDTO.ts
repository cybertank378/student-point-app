//Files: src/modules/student-counseling/domain/dto/OpenStudentCounselingCaseDTO.ts
/**
 * ============================================================
 * DTO PEMBUKAAN KASUS KONSELING
 * ============================================================
 *
 * DTO yang digunakan ketika client membuka kasus konseling
 * baru untuk seorang siswa.
 *
 * DTO hanya berisi field yang berasal dari request client
 * dan tidak memuat field yang dihasilkan sistem seperti
 * id, status, openedAt, dan closedAt.
 */

import { CaseSource } from "@/libs/utils/enums"

export class OpenStudentCounselingCaseDTO {

    readonly academicYearId: string
    readonly reason: string
    readonly source: CaseSource

    constructor(params: {
        academicYearId: string
        reason: string
        source: CaseSource
    }) {

        this.academicYearId = params.academicYearId
        this.reason = params.reason
        this.source = params.source

    }

}