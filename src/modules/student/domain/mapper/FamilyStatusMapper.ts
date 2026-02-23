//Files: src/modules/student/domain/mapper/FamilyStatusMapper.ts

import { FamilyStatus as PrismaFamilyStatus } from "@/generated/prisma";
import {FamilyStatus} from "@/libs/utils";

export const FamilyStatusMapper = {
    toDomain(status: PrismaFamilyStatus): FamilyStatus {
        return status as FamilyStatus;
    },

    toPrisma(status: FamilyStatus): PrismaFamilyStatus {
        return status as PrismaFamilyStatus;
    },
};