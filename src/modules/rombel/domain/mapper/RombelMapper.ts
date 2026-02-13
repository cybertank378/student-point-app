//Files: src/modules/rombel/domain/mapper/RombelMapper.ts

import type { Class as PrismaClass } from "@/generated/prisma";
import { Rombel } from "@/modules/rombel/domain/entity/Rombel";

/**
 * Mapper: Prisma Class -> Domain Rombel
 */
export class RombelMapper {
    static toDomain(row: PrismaClass, studentCount: number,): Rombel {
        return new Rombel(
            row.id,
            row.grade,
            row.name,
            row.academicYearId,
            row.createdAt,
            studentCount
        );
    }

    static toDomainList(rows: PrismaClass[]): Rombel[] {
        return rows.map(this.toDomain);
    }
}
