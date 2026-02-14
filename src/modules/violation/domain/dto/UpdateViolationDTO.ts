//Files: src/modules/violation/domain/dto/UpdateViolationDTO.ts

import {ViolationLevel} from "@/generated/prisma";

export interface UpdateViolationDTO {
    id: string;
    name: string;
    point: number;
    level: ViolationLevel;
}
