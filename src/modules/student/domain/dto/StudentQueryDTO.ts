//Files: src/modules/student/domain/dto/StudentQueryDTO.ts

import type { StudentStatus } from "@/modules/student/domain/enums/StudentStatus";

export interface StudentQueryDTO {
  rombelId?: string;
  status?: StudentStatus;
}
