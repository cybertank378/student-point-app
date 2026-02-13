//Files: src/modules/religion/domain/mapper/ReligionMapper.ts

import type { Religion as PrismaReligion } from "@/generated/prisma";
import { Religion } from "@/modules/religion/domain/entity/Religion";

export class ReligionMapper {
    static toDomain(row: PrismaReligion): Religion {
        return new Religion(row.id, row.kode, row.name);
    }
}