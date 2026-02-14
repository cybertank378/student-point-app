//Files: src/modules/rombel/domain/mapper/RombelMapper.ts

import { Prisma } from "@/generated/prisma";
import { Rombel } from "@/modules/rombel/domain/entity/Rombel";

/**
 * Prisma type dengan relation academicYear
 */
type PrismaClassWithRelation =
    Prisma.ClassGetPayload<{
        include: {
            academicYear: {
                select: { name: true };
            };
        };
    }>;

/**
 * Mapper: Prisma -> Domain
 */
export class RombelMapper {

    static toDomain(
        row: PrismaClassWithRelation,
        studentCount: number,
    ): Rombel {

        return new Rombel(
            row.id,
            row.grade,
            row.name,
            row.academicYear?.name ?? "", // 🔥 Aman & Tidak Memaksa
            row.createdAt,
            studentCount,
        );
    }
}
