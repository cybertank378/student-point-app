//Files: src/modules/violation/domain/mapper/ViolationMapper.ts

import type { Violation as PrismaViolation } from "@/generated/prisma";
import { Violation } from "@/modules/violation/domain/entity/Violation";

export class ViolationMapper {
    static toDomain(row: PrismaViolation): Violation {
        return new Violation(
            row.id,
            row.name,
            row.point,
            row.level,
            row.createdAt,
            row.deletedAt,
        );
    }

    static toDomainList(rows: PrismaViolation[]): Violation[] {
        return rows.map(this.toDomain);
    }
}
