//Files: src/modules/student/domain/dto/CreateStudentDTO.ts

import type {Gender} from "@/modules/student/domain/enums/Gender";
import {$Enums} from "@/generated/prisma";

export interface CreateStudentDTO {
    nis: number;
    nisn: number;
    name: string;
    nickname?: string | null; // 👈 PERBOLEHKAN null
    gender: Gender;
    religionCode: string;
    rombelId: string;
}
