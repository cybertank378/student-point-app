//Files: src/modules/student/domain/mapper/GenderMapper.ts

import type { Gender } from "@/modules/student/domain/enums/Gender";
import type { $Enums } from "@/generated/prisma";

export class GenderMapper {
    static toDomain(gender: $Enums.Gender): Gender {
        return gender;
    }

    static toPrisma(gender: Gender): $Enums.Gender {
        return gender;
    }
}