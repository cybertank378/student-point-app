//Files: src/modules/student/domain/dto/CreateStudentDTO.ts

import type {Gender} from "@/modules/student/domain/enums/Gender";
import type {StudentStatus} from "@/modules/student/domain/enums/StudentStatus";
import {FamilyStatus} from "@/libs/utils";

export interface CreateStudentDTO {
    nis?: string | null;
    nisn: string;
    name: string;
    nickname?: string | null;

    gender: Gender;
    religionCode: string;
    rombelId: string;

    status?: StudentStatus;

    // ✅ Optional (kalau tidak dikirim → default COMPLETE di DB)
    familyStatus?: FamilyStatus;

    isDifable?: boolean;
    difableNotes?: string | null;
}