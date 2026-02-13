//Files: src/modules/student/domain/mapper/StudentStatusMapper.ts

import type { StudentStatus } from "@/modules/student/domain/enums/StudentStatus";
import type { $Enums } from "@/generated/prisma";

export class StudentStatusMapper {
    static toDomain(status: $Enums.StudentStatus): StudentStatus {
        return status;
    }

    static toPrisma(status: StudentStatus): $Enums.StudentStatus {
        return status;
    }
}