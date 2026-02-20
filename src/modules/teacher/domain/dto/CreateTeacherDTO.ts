// Files: src/modules/teacher/domain/dto/CreateTeacherDTO.ts

import type {
    Gender,
    EducationLevel,
    CivilServantRank,
    TeacherRole,
} from "@/generated/prisma";

export interface CreateTeacherDTO {
    nip?: string | null;
    nuptk?: string | null;
    nrk?: string | null;
    nrg?: number | null;

    name: string;
    gender: Gender;

    religionCode: string; // ✅ FK only

    phone?: string | null;
    email?: string | null;
    photo?: string | null;

    educationLevel: EducationLevel;
    major?: string | null;
    graduationYear: number;

    birthPlace: string;
    birthDate: Date;

    civilServantRank?: CivilServantRank | null;

    roles: TeacherRole[];
    isPns:  boolean;
}
