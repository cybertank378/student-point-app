//Files: src/modules/student-aid/domain/mapper/StudentAidMapper.ts

import type { StudentAidDTO } from "../dto/StudentAidDTO"
import type { StudentAid } from "../entity/StudentAid"

/**
 * ============================================================
 * STUDENT AID MAPPER
 * ============================================================
 *
 * Responsible for transforming persistence
 * data into domain entity representation.
 */

export class StudentAidMapper {

    static toEntity(dto: StudentAidDTO): StudentAid {

        return {
            id: dto.id,
            studentId: dto.studentId,
            academicYearId: dto.academicYearId,
            kjp: dto.kjp,
            pip: dto.pip
        }

    }

}