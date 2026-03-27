//Files: src/modules/student-counseling/domain/dto/CloseStudentCounselingCaseDTO.ts

/**
 * ============================================================
 * DTO PENUTUPAN KASUS KONSELING
 * ============================================================
 *
 * DTO yang digunakan ketika sistem menutup kasus konseling
 * siswa.
 */

export class CloseStudentCounselingCaseDTO {

    readonly caseId: string

    constructor(params: {
        caseId: string
    }) {

        this.caseId = params.caseId

    }

}