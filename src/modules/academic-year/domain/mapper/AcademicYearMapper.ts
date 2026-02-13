//Files: src/modules/academic-year/domain/mapper/AcademicYearMapper.ts

import type { AcademicYear as PrismaAcademicYear } from "@/generated/prisma";
import { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";

/**
 * Mapper: Prisma → Domain
 */
export class AcademicYearMapper {
    static toDomain(
        row: PrismaAcademicYear,
    ): AcademicYear {
        return new AcademicYear(
            row.id,
            row.name,
            row.isActive,
            row.createdAt,
        );
    }

    static toDomainList(
        rows: PrismaAcademicYear[],
    ): AcademicYear[] {
        return rows.map(this.toDomain);
    }
}
