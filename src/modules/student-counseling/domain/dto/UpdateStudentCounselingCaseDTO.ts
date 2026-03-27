//Files: src/modules/student-counseling/domain/dto/UpdateStudentCounselingCaseDTO.ts
/**
 * ============================================================
 * DTO PERUBAHAN PARSIAL KASUS KONSELING
 * ============================================================
 *
 * DTO ini digunakan untuk melakukan perubahan parsial
 * terhadap kasus konseling menggunakan metode PATCH.
 *
 * Hanya field yang diperbolehkan berubah yang disediakan
 * pada DTO ini.
 */

export class UpdateStudentCounselingCaseDTO {

    readonly reason?: string

    constructor(params: {
        reason?: string
    }) {

        this.reason = params.reason

    }

}