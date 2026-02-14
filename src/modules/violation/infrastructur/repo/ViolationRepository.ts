//Files: src/modules/violation/infrastructur/repo/ViolationRepository.ts

import  prisma  from "@/libs/prisma";
import { ViolationMapper } from "@/modules/violation/domain/mapper/ViolationMapper";
import type { ViolationInterface } from "@/modules/violation/domain/interfaces/ViolationInterface";
import type { CreateViolationDTO } from "@/modules/violation/domain/dto/CreateViolationDTO";
import type { UpdateViolationDTO } from "@/modules/violation/domain/dto/UpdateViolationDTO";
import type { Violation } from "@/modules/violation/domain/entity/Violation";
import type {ViolationLevel} from "@/generated/prisma";

export class ViolationRepository implements ViolationInterface {
    async findAll(): Promise<Violation[]> {
        const rows = await prisma.violation.findMany({
            where: { deletedAt: null },
            orderBy: { point: "asc" },
        });
        return ViolationMapper.toDomainList(rows);
    }

    async findById(id: string): Promise<Violation | null> {
        const row = await prisma.violation.findFirst({
            where: { id, deletedAt: null },
        });
        return row ? ViolationMapper.toDomain(row) : null;
    }

    async create(dto: CreateViolationDTO & { level: ViolationLevel }): Promise<Violation> {
        const row = await prisma.violation.create({
            data: {
                name: dto.name,
                point: dto.point,
                level: dto.level,
            },
        });
        return ViolationMapper.toDomain(row);
    }

    async update(dto: UpdateViolationDTO & { level: ViolationLevel }): Promise<Violation> {
        const row = await prisma.violation.update({
            where: { id: dto.id },
            data: {
                name: dto.name,
                point: dto.point,
                level: dto.level,
            },
        });
        return ViolationMapper.toDomain(row);
    }

    async isUsed(id: string): Promise<boolean> {
        const count = await prisma.studentViolation.count({
            where: { violationId: id },
        });
        return count > 0;
    }

    async softDelete(id: string): Promise<void> {
        await prisma.violation.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}


