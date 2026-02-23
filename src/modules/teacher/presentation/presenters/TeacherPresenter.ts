//Files: src/modules/teacher/presentation/presenters/TeacherPresenter.ts

import { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherRespDTO } from "@/modules/teacher/domain/dto/ListTeacherRespDTO";

/**
 * ============================================================
 * TEACHER PRESENTER
 * ============================================================
 *
 * Convert Domain → Response DTO
 *
 * IMPORTANT:
 * - BigInt must be converted to string
 * - JSON does NOT support bigint
 */
export const TeacherPresenter = {
    toResponse(teacher: Teacher): TeacherRespDTO {
        return {
            id: teacher.id,

            // 🔥 Convert BigInt → string
            nip: teacher.nip ? teacher.nip.toString() : null,
            nuptk: teacher.nuptk ? teacher.nuptk.toString() : null,
            nrk: teacher.nrk ? teacher.nrk.toString() : null,
            nrg: teacher.nrg.toString(),

            name: teacher.name,
            gender: teacher.gender,

            religionCode: teacher.religionCode,

            phone: teacher.phone,
            email: teacher.email,
            photo: teacher.photo,

            educationLevel: teacher.educationLevel,
            major: teacher.major,
            graduationYear: teacher.graduationYear,

            birthPlace: teacher.birthPlace,
            birthDate: teacher.birthDate,

            civilServantRank: teacher.civilServantRank,

            roles: teacher.roles,

            homeroomClassIds: teacher.homeroomClassIds,
            isPns: teacher.isPns
        };
    },

    toResponseList(teachers: readonly Teacher[]): TeacherRespDTO[] {
        return teachers.map((t) => this.toResponse(t));
    },
};
