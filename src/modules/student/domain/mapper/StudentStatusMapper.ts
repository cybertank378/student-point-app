//Files: src/modules/student/domain/mapper/StudentStatusMapper.ts
import type { StudentStatus } from "@/modules/student/domain/enums/StudentStatus";
import type { $Enums } from "@/generated/prisma";

/**
 * Mapper: Prisma Enum ↔ Domain Enum
 * Tidak ada logic bisnis
 */
export const StudentStatusMapper = {
  toDomain(status: $Enums.StudentStatus): StudentStatus {
    return status;
  },

  toPrisma(status: StudentStatus): $Enums.StudentStatus {
    return status;
  },
};
