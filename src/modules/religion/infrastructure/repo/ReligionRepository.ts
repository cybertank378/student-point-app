//Files: src/modules/religion/infrastructure/repository/ReligionRepository.ts

import {ReligionInterface} from "@/modules/religion/domain/interfaces/ReligionInterface";
import prisma from "@/libs/prisma";
import {ReligionMapper} from "@/modules/religion/domain/mapper/ReligionMapper";
import {CreateReligionDTO} from "@/modules/religion/domain/dto/CreateReligionDTO";
import {UpdateReligionDTO} from "@/modules/religion/domain/dto/UpdateReligionDTO";

export class ReligionRepository implements ReligionInterface {
    async findAll() {
        const rows = await prisma.religion.findMany({ orderBy: { name: "asc" } });
        return rows.map(ReligionMapper.toDomain);
    }

    async findById(id: string) {
        const row = await prisma.religion.findUnique({ where: { id } });
        return row ? ReligionMapper.toDomain(row) : null;
    }

    async findByCode(kode: string) {
        const row = await prisma.religion.findUnique({ where: { kode } });
        return row ? ReligionMapper.toDomain(row) : null;
    }

    async create(dto: CreateReligionDTO) {
        const row = await prisma.religion.create({ data: dto });
        return ReligionMapper.toDomain(row);
    }

    async update(dto: UpdateReligionDTO) {
        const row = await prisma.religion.update({
            where: { id: dto.id },
            data: { kode: dto.kode, name: dto.name },
        });
        return ReligionMapper.toDomain(row);
    }

    async delete(id: string) {
        await prisma.religion.delete({ where: { id } });
    }
}