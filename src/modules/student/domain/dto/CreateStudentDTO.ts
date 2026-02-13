//Files: src/modules/student/domain/dto/CreateStudentDTO.ts

import {Gender} from "@/modules/student/domain/enums/Gender";
import {$Enums} from "@/generated/prisma";
import StudentStatus = $Enums.StudentStatus;

export interface CreateStudentDTO {
    nis: number;
    nisn: number;
    name: string;
    nickname?: string | null; // 👈 PERBOLEHKAN null
    gender: Gender;
    religionId: string;
    rombelId: string;
}