//Files: src/modules/violation/domain/interfaces/ViolationInterface.ts

import {Violation} from "@/modules/violation/domain/entity/Violation";
import {CreateViolationDTO} from "@/modules/violation/domain/dto/CreateViolationDTO";
import {UpdateViolationDTO} from "@/modules/violation/domain/dto/UpdateViolationDTO";
import {ViolationLevel} from "@/generated/prisma";

export interface ViolationInterface {
    findAll(): Promise<Violation[]>;
    findById(id: string): Promise<Violation | null>;

    create(dto: CreateViolationDTO & { level: ViolationLevel }): Promise<Violation>;
    update(dto: UpdateViolationDTO & { level: ViolationLevel }): Promise<Violation>;

    softDelete(id: string): Promise<void>;
    isUsed(id: string): Promise<boolean>;
}