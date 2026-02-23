//Files: src/modules/student/domain/entity/Student.ts

import type { Gender } from "@/modules/student/domain/enums/Gender";
import type { StudentStatus } from "@/modules/student/domain/enums/StudentStatus";
import {FamilyStatus} from "@/libs/utils";
export class Student {
    constructor(
        public readonly id: string,
        public readonly nis: string | null,
        public readonly nisn: string,
        public name: string,
        public nickname: string | null,
        public gender: Gender,
        public religionCode: string,
        public rombelId: string,
        public status: StudentStatus,
        public familyStatus: FamilyStatus,
        public isDifable: boolean,
        public difableNotes: string | null,
        public deletedAt: Date | null,
    ) {}

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

    isOrphan(): boolean {
        return this.familyStatus === FamilyStatus.ORPHAN;
    }
}