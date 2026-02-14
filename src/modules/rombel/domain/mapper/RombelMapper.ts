//Files: src/modules/rombel/domain/mapper/RombelMapper.ts
import type { Prisma } from "@/generated/prisma";
import { Rombel } from "@/modules/rombel/domain/entity/Rombel";

/**
 * Prisma type dengan relation academicYear
 */
type PrismaClassWithRelation = Prisma.ClassGetPayload<{
  include: {
    academicYear: {
      select: { name: true };
    };
  };
}>;

/**
 * Mapper: Prisma → Domain
 * Tidak ada logic bisnis
 */
export const RombelMapper = {
  toDomain(row: PrismaClassWithRelation, studentCount: number): Rombel {
    return new Rombel(
      row.id,
      row.grade,
      row.name,
      row.academicYear?.name ?? "",
      row.createdAt,
      studentCount,
    );
  },

  toDomainList(
    rows: PrismaClassWithRelation[],
    studentCountMap: Record<string, number>,
  ): Rombel[] {
    return rows.map((row) =>
      RombelMapper.toDomain(row, studentCountMap[row.id] ?? 0),
    );
  },
};
