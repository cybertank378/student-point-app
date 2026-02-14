//Files: src/modules/student/domain/mapper/GenderMapper.ts
import type { Gender } from "@/modules/student/domain/enums/Gender";
import type { $Enums } from "@/generated/prisma";

/**
 * Mapper: Prisma Enum ↔ Domain Enum
 * Tidak ada logic bisnis
 */
export const GenderMapper = {
  toDomain(gender: Gender): Gender {
    return gender;
  },

  toPrisma(gender: Gender): $Enums.Gender {
    return gender;
  },
};
