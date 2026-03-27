//Files: src/modules/student-profile/domain/mapper/StudentProfileMapper.ts

import {StudentProfileDTO} from "@/modules/student-profile/domain/dto/StudentProfileDTO";
/**
 * Responsible for converting persistence layer models
 * (Prisma) into domain entities.
 *
 * Mapper acts as the **single source of truth**
 * for transformation logic between database models
 * and domain models.
 *
 * @class StudentProfileMapper
 */

/**
 * Mapper converting persistence model to DTO
 */

export class StudentProfileMapper {

    static toDTO(profile: StudentProfileDTO): StudentProfileDTO {

        return {

            id: profile.id,
            studentId: profile.studentId,

            childOrder: profile.childOrder,
            totalSiblings: profile.totalSiblings,

            distanceToSchool: profile.distanceToSchool,
            transport: profile.transport,

            hobby: profile.hobby,
            dream: profile.dream,
            closeFriend: profile.closeFriend

        }

    }

}