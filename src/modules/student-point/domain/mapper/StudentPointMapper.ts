// Files: src/modules/student-point/domain/mapper/StudentPointMapper.ts

import { StudentPoint } from "@/modules/student-point/domain/entity/StudentPoint";
import { StudentPointDTO } from "@/modules/student-point/domain/dto/StudentPointDTO";

/**
 * ============================================================
 * STUDENT POINT MAPPER
 * ============================================================
 *
 * Transformasi antara DTO dan Entity.
 */

export class StudentPointMapper {

    static toDTO(entity: StudentPoint): StudentPointDTO {

        return {

            id: entity.id,

            studentId: entity.studentId,
            academicYearId: entity.academicYearId,

            totalViolationPoint: entity.totalViolationPoint,
            totalAchievementPoint: entity.totalAchievementPoint,
            totalPoint: entity.totalPoint,

            updatedAt: entity.updatedAt

        }

    }

    static toEntity(dto: StudentPointDTO): StudentPoint {

        if (!dto.updatedAt) {
            throw new Error("Invalid DTO: updatedAt required")
        }

        return new StudentPoint({

            id: dto.id,

            studentId: dto.studentId,
            academicYearId: dto.academicYearId,

            totalViolationPoint: dto.totalViolationPoint,
            totalAchievementPoint: dto.totalAchievementPoint,
            totalPoint: dto.totalPoint,

            updatedAt: dto.updatedAt

        })

    }

}