//Files: src/modules/religion/domain/mapper/ReligionMapper.ts
import type { Religion as PrismaReligion } from "@/generated/prisma";
import { Religion } from "@/modules/religion/domain/entity/Religion";

/**
 * Mapper: Prisma → Domain
 * Tidak ada logic bisnis
 */
export const ReligionMapper = {
  toDomain(row: PrismaReligion): Religion {
    return new Religion(row.id, row.kode, row.name);
  },

  toDomainList(rows: PrismaReligion[]): Religion[] {
    return rows.map(ReligionMapper.toDomain);
  },
};
