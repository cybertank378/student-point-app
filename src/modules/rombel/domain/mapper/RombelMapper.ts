//Files: src/modules/rombel/domain/mapper/RombelMapper.ts

import type { Prisma } from "@/generated/prisma";
import { Rombel } from "@/modules/rombel/domain/entity/Rombel";

type RombelPrismaPayload =
    Prisma.ClassGetPayload<{
      include: {
        academicYear: true;
        _count: {
          select: {
            enrollments: true;
          };
        };
      };
    }>;

export const RombelMapper = {

  toDomain(row: RombelPrismaPayload): Rombel {

    return new Rombel(
        row.id,
        row.grade,
        row.name,

        row.academicYearId,
        row.academicYear.name,

        row.homeroomTeacherId,
        row.createdAt,
        row._count.enrollments
    );

  },

  toDomainList(rows: RombelPrismaPayload[]): Rombel[] {

    return rows.map(RombelMapper.toDomain);

  }

};