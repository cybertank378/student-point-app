//Files: src/modules/student/domain/entity/Student.ts

import type { Gender } from "@/modules/student/domain/enums/Gender";
import type { StudentStatus } from "@/modules/student/domain/enums/StudentStatus";

export class Student {
  constructor(
    public readonly id: string,
    public readonly nis: number,
    public readonly nisn: number,
    public name: string,
    public nickname: string | null,

    public gender: Gender,
    public religionCode: string,
    public rombelId: string,

    public status: StudentStatus,
    public deletedAt: Date | null,
  ) {}

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
