//Files: src/modules/student/domain/dto/UpdateStudentDTO.ts

import type { Gender } from "@/modules/student/domain/enums/Gender";
import type { StudentStatus } from "@/modules/student/domain/enums/StudentStatus";

export interface UpdateStudentDTO {
  id: string;
  name?: string;
  nickname?: string | null;
  gender?: Gender;
  religionId?: string;
  rombelId?: string;
  status?: StudentStatus;
}
