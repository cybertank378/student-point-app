//Files: src/modules/student-counseling/domain/mapper/StudentCounselingCaseMapper.ts

/**
 * ============================================================
 * MAPPER KASUS KONSELING SISWA
 * ============================================================
 *
 * Mapper bertanggung jawab melakukan transformasi
 * objek antar layer arsitektur.
 *
 * Transformasi yang didukung:
 * - DTO → Entity
 * - PATCH DTO → Entity
 * - Prisma Model → Entity
 */

import { randomUUID } from "crypto"

import { CounselingCase } from "@/generated/prisma"

import { CaseStatus }
    from "@/libs/utils/enums"

import { StudentCounselingCase }
    from "@/modules/student-counseling/domain/entity/StudentCounselingCase"

import { OpenStudentCounselingCaseDTO }
    from "@/modules/student-counseling/domain/dto/OpenStudentCounselingCaseDTO"

import { UpdateStudentCounselingCaseDTO }
    from "@/modules/student-counseling/domain/dto/UpdateStudentCounselingCaseDTO"

export class StudentCounselingCaseMapper {

    static fromOpenDTO(
        studentId: string,
        dto: OpenStudentCounselingCaseDTO
    ): StudentCounselingCase {

        return new StudentCounselingCase({

            id: randomUUID(),
            studentId,
            academicYearId: dto.academicYearId,
            reason: dto.reason,
            source: dto.source,
            status: CaseStatus.OPEN,
            openedAt: new Date(),
            closedAt: null

        })

    }

    static applyPatch(
        entity: StudentCounselingCase,
        dto: UpdateStudentCounselingCaseDTO
    ): StudentCounselingCase {

        return new StudentCounselingCase({

            id: entity.id,
            studentId: entity.studentId,
            academicYearId: entity.academicYearId,
            reason: dto.reason ?? entity.reason,
            source: entity.source,
            status: entity.status,
            openedAt: entity.openedAt,
            closedAt: entity.closedAt

        })

    }

    static fromPrisma(
        model: CounselingCase
    ): StudentCounselingCase {

        return new StudentCounselingCase({

            id: model.id,
            studentId: model.studentId,
            academicYearId: model.academicYearId,
            reason: model.reason,
            source: model.source,
            status: model.status,
            openedAt: model.openedAt,
            closedAt: model.closedAt

        })

    }

}