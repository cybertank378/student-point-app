import { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherRespDTO } from "@/modules/teacher/domain/dto/ListTeacherRespDTO";

export const TeacherPresenter = {
    toResponse(teacher: Teacher): TeacherRespDTO {
        return {
            id: teacher.id,

            nip: teacher.nip,
            nuptk: teacher.nuptk,
            nrk: teacher.nrk,

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
        };
    },

    toResponseList(teachers: readonly Teacher[]): TeacherRespDTO[] {
        return teachers.map((t) => this.toResponse(t));
    },
};
