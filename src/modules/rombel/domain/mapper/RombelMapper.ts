//Files: src/modules/rombel/domain/mapper/RombelMapper.ts
import type { Class as PrismaClass } from "@/generated/prisma";
import { Rombel } from "@/modules/rombel/domain/entity/Rombel";

/**
 * Shape hasil query yang include academicYear.name
 */
type PrismaClassWithRelation = PrismaClass & {
    academicYear: {
        name: string;
    };
};

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
            row.academicYear.name, // 🔥 pakai name
            row.createdAt,
            studentCount,
        );
    }
}
