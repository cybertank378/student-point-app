//Files: src/modules/student-counseling/domain/interfaces/StudentCounselingCaseInterface.ts

/**
 * ============================================================
 * PORT REPOSITORY KASUS KONSELING
 * ============================================================
 *
 * Interface repository pada domain layer yang berfungsi
 * sebagai kontrak akses data untuk entitas StudentCounselingCase.
 *
 * Interface ini merupakan implementasi Hexagonal Architecture
 * dimana domain tidak memiliki ketergantungan langsung pada
 * teknologi database ataupun ORM.
 */

import {StudentCounselingCase} from "@/modules/student-counseling/domain/entity/StudentCounselingCase";

export interface StudentCounselingCaseInterface {

    create(
        entity: StudentCounselingCase
    ): Promise<StudentCounselingCase>

    update(
        entity: StudentCounselingCase
    ): Promise<StudentCounselingCase>

    findById(
        id: string
    ): Promise<StudentCounselingCase | null>

}