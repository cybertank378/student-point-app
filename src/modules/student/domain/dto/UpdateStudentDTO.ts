//Files: src/modules/student/domain/dto/UpdateStudentDTO.ts

import type { Gender } from "@/modules/student/domain/enums/Gender";
import type { StudentStatus } from "@/modules/student/domain/enums/StudentStatus";
import {FamilyStatus} from "@/libs/utils";

export interface UpdateStudentDTO {
    id: string;

    name?: string;
    nickname?: string | null;
    gender?: Gender;
    religionCode?: string;
    rombelId?: string;
    status?: StudentStatus;

    // ✅ Bisa diubah jika diperlukan
    familyStatus?: FamilyStatus;

    nis?: string | null;
    nisn?: string;

    isDifable?: boolean;
    difableNotes?: string | null;
}